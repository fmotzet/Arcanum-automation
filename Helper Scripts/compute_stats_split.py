#!/usr/bin/env python3
# This script access the CWS store API to scrape the stats of all extenions within the db
# WARNING! On large Datapses this script can have a very long runtime we experienced >24h for 197.000 extenions
# Usage compute_stats_split.py--ids IDS [--outdir /directory/to/write/results/to/] [--local-crx-dir /dir/containing/the/extnsions/] [--limit Limit so a lower count] [--which {available,removed,both}] [--skip-metadata] [--skip-permissions]
import argparse, csv, gzip, io, json, os, re, sys, time, zipfile, html
from pathlib import Path
from datetime import datetime, timezone
from typing import Dict, List, Optional, Set, Tuple
import requests
from xml.etree import ElementTree as ET

BASE_SITEMAP_SHARD = "https://chromewebstore.google.com/sitemap?shard={}"
BASE_LISTING = "https://chromewebstore.google.com/detail/{}"
CRX_UPDATE = ("https://clients2.google.com/service/update2/crx?"
              "response=redirect&prodversion=114.0&x=id%3D{ID}%26uc")

ID_RE = re.compile(r"\b[a-p]{32}\b")
NS = {'sm': 'http://www.sitemaps.org/schemas/sitemap/0.9'}

UA = {"User-Agent": "Mozilla/5.0 (compatible; arcanum-bsc/1.0)"}

# -------------------------
# Utilities
# -------------------------

def read_ids(path: Path) -> List[str]:
    ids = []
    with path.open("r", encoding="utf-8") as f:
        for line in f:
            s = line.strip().replace(".crx","")
            m = ID_RE.search(s)
            if m: ids.append(m.group(0))
    return sorted(set(ids))

def fetch(url: str, timeout=30, allow_200_only=True) -> requests.Response:
    # simple retry loop
    for i in range(3):
        try:
            r = requests.get(url, headers=UA, timeout=timeout, allow_redirects=True)
            if (not allow_200_only) or r.status_code == 200:
                return r
        except requests.RequestException:
            pass
        time.sleep(0.6*(i+1))
    raise RuntimeError(f"Failed GET {url}")

def parse_sitemap_xml(xml_bytes: bytes) -> List[Tuple[str, Optional[str]]]:
    # returns list of (id, lastmod_str or None)
    if xml_bytes[:2] == b"\x1f\x8b":
        with gzip.GzipFile(fileobj=io.BytesIO(xml_bytes)) as gz:
            xml_bytes = gz.read()
    root = ET.fromstring(xml_bytes)
    out = []
    if root.tag.endswith("urlset"):
        for url in root.findall("sm:url", NS):
            loc = url.findtext("sm:loc", default="", namespaces=NS) or ""
            lastmod = url.findtext("sm:lastmod", default="", namespaces=NS) or None
            m = ID_RE.search(loc)
            if m:
                out.append((m.group(0), lastmod))
    return out

def collect_availability_and_age(shards=range(0,19)) -> Dict[str, Optional[str]]:
    id_to_lastmod: Dict[str, Optional[str]] = {}
    for s in shards:
        r = fetch(BASE_SITEMAP_SHARD.format(s))
        items = parse_sitemap_xml(r.content)
        for eid, lm in items:
            if lm:
                prev = id_to_lastmod.get(eid)
                if (not prev) or (lm > prev):
                    id_to_lastmod[eid] = lm
            else:
                id_to_lastmod.setdefault(eid, None)
        time.sleep(0.2)
    return id_to_lastmod

def parse_installs(text: str) -> Optional[int]:
    # Try JSON-LD and a few textual fallbacks
    m = re.search(r'<script type="application/ld\+json">(.+?)</script>', text, flags=re.S)
    if m:
        try:
            data = json.loads(m.group(1))
            objs = data if isinstance(data, list) else [data]
            for obj in objs:
                # scan for counts in a few common fields
                for key in ("interactionStatistic","aggregateRating","interactionCount","userInteractionCount"):
                    v = obj.get(key)
                    if isinstance(v, (int, str)):
                        n = re.sub(r"[^\d]", "", str(v))
                        if n: return int(n)
                    if isinstance(v, dict):
                        for k2 in v.values():
                            if isinstance(k2, (int, str)):
                                n = re.sub(r"[^\d]", "", str(k2))
                                if n: return int(n)
        except Exception:
            pass
    m = re.search(r'([\d,\. ]+)\s*(users|User|Users)', text, flags=re.I)
    if m:
        n = re.sub(r"[^\d]", "", m.group(1))
        if n: return int(n)
    m = re.search(r'aria-label="[^"]*(\d[\d,\. ]+)\s+users', text, flags=re.I)
    if m:
        n = re.sub(r"[^\d]", "", m.group(1))
        if n: return int(n)
    return None

def parse_name(text: str) -> Optional[str]:
    m = re.search(r'<title>(.*?)</title>', text, flags=re.S|re.I)
    if m:
        t = html.unescape(m.group(1)).strip()
        t = re.sub(r"\s*-\s*Chrome Web Store.*$", "", t, flags=re.I)
        return t[:300]
    m = re.search(r"<h1[^>]*>(.*?)</h1>", text, flags=re.S|re.I)
    if m:
        return html.unescape(re.sub("<.*?>", "", m.group(1))).strip()[:300]
    return None

def parse_category(text: str) -> Optional[str]:
    m = re.search(r'Category</[^>]+>\s*<[^>]+>([^<]+)</', text, flags=re.I)
    if m:
        return m.group(1).strip()
    return None

def scrape_listing(eid: str) -> Tuple[Optional[str], Optional[int], Optional[str]]:
    url = BASE_LISTING.format(eid)
    r = fetch(url)
    txt = r.text
    name = parse_name(txt)
    installs = parse_installs(txt)
    category = parse_category(txt)
    return name, installs, category

def locate_manifest_from_crxfile(crx_path: Path) -> Optional[dict]:
    try:
        with zipfile.ZipFile(crx_path) as z:
            with z.open("manifest.json") as mf:
                return json.loads(mf.read().decode("utf-8"))
    except Exception:
        return None

def download_crx(eid: str, dest_dir: Path) -> Optional[Path]:
    url = CRX_UPDATE.replace("{ID}", eid)
    try:
        r = fetch(url, timeout=60, allow_200_only=False)
        if r.status_code == 200 and r.content:
            p = dest_dir / f"{eid}.crx"
            p.write_bytes(r.content)
            return p
    except Exception:
        pass
    return None

def get_manifest_for_id(eid: str, local_crx_dir: Optional[Path], dl_dir: Path) -> Optional[dict]:
    if local_crx_dir:
        p = local_crx_dir / f"{eid}.crx"
        if p.exists():
            m = locate_manifest_from_crxfile(p)
            if m: return m
    p = download_crx(eid, dl_dir)
    if p:
        return locate_manifest_from_crxfile(p)
    return None

def json_compact(obj) -> str:
    return json.dumps(obj, ensure_ascii=False, separators=(",",":"))

# -------------------------
# Processing passes
# -------------------------

def write_availability(ids: List[str], id_to_lastmod: Dict[str, Optional[str]], outdir: Path):
    available_set = set(id_to_lastmod.keys())
    avail_csv = outdir / "availability.csv"
    with avail_csv.open("w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(["id","available","lastmod"])
        for eid in ids:
            w.writerow([eid, "1" if eid in available_set else "0", id_to_lastmod.get(eid, "")])
    return available_set, avail_csv

def process_group(group_name: str,
                  ids: List[str],
                  id_to_lastmod: Dict[str, Optional[str]],
                  outdir: Path,
                  local_crx_dir: Optional[Path],
                  do_metadata: bool,
                  do_permissions: bool,
                  throttle_every: int = 25,
                  throttle_sleep: float = 0.8):
    """
    group_name: 'available' or 'removed'
    ids: list for that group
    returns paths of written files
    """
    gdir = outdir / group_name
    gdir.mkdir(parents=True, exist_ok=True)
    dl_dir = gdir / "crx_cache"
    dl_dir.mkdir(exist_ok=True)

    meta_csv = gdir / "cws_metadata.csv"
    perm_csv = gdir / "permissions.csv"

    if do_metadata:
        with meta_csv.open("w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["id","name","installs","category","lastmod"])
            for i, eid in enumerate(ids, 1):
                try:
                    name, installs, category = scrape_listing(eid)
                    w.writerow([eid, name or "", installs if installs is not None else "", category or "", id_to_lastmod.get(eid,"")])
                except Exception:
                    w.writerow([eid, "", "", "", id_to_lastmod.get(eid,"")])
                if i % throttle_every == 0:
                    time.sleep(throttle_sleep)

    if do_permissions:
        with perm_csv.open("w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["id","manifest_version","permissions","host_permissions","optional_permissions"])
            for i, eid in enumerate(ids, 1):
                m = get_manifest_for_id(eid, local_crx_dir, dl_dir)
                if m:
                    w.writerow([
                        eid,
                        m.get("manifest_version",""),
                        json_compact(m.get("permissions",[])),
                        json_compact(m.get("host_permissions", m.get("permissions",[]))),
                        json_compact(m.get("optional_permissions",[]))
                    ])
                else:
                    w.writerow([eid,"","","",""])
                if i % 20 == 0:
                    time.sleep(0.5)

    written = []
    if do_metadata: written.append(meta_csv)
    if do_permissions: written.append(perm_csv)
    return written

# -------------------------
# Main
# -------------------------

def main():
    ap = argparse.ArgumentParser(description="Collect CWS stats split by availability (age, installs, category, permissions).")
    ap.add_argument("--ids", type=Path, required=True, help="Path to ids.txt (one id or *.crx per line)")
    ap.add_argument("--outdir", type=Path, default=Path("./out"), help="Output directory root")
    ap.add_argument("--local-crx-dir", type=Path, help="Directory with local .crx files to prefer (optional)")
    ap.add_argument("--limit", type=int, default=0, help="Optional limit for quick testing")
    ap.add_argument("--which", choices=["available","removed","both"], default="both",
                    help="Which group(s) to process beyond availability.csv")
    ap.add_argument("--skip-metadata", action="store_true", help="Skip listing scrapes (speeds up, reduces CWS load)")
    ap.add_argument("--skip-permissions", action="store_true", help="Skip CRX/manifest extraction")
    args = ap.parse_args()

    ids = read_ids(args.ids)
    if args.limit: ids = ids[:args.limit]
    args.outdir.mkdir(parents=True, exist_ok=True)

    print(f"[info] IDs loaded: {len(ids)}")
    print("[info] Fetching sitemap shards for availability+age ...")
    id_to_lastmod = collect_availability_and_age()
    available_set, avail_csv = write_availability(ids, id_to_lastmod, args.outdir)
    print(f"[done] {avail_csv}")

    available_ids = [eid for eid in ids if eid in available_set]
    removed_ids   = [eid for eid in ids if eid not in available_set]

    print(f"[info] Split -> Available: {len(available_ids)} | Removed: {len(removed_ids)} | Total: {len(ids)}")

    do_meta = not args.skip_metadata
    do_perm = not args.skip_permissions

    written_paths = []

    if args.which in ("available","both") and available_ids:
        print("[info] Processing AVAILABLE group …")
        written_paths += process_group(
            "available",
            available_ids,
            id_to_lastmod,
            args.outdir,
            args.local_crx_dir,
            do_metadata=do_meta,           # scrape listing for live ones
            do_permissions=do_perm,        # also try CRX/manifest
            throttle_every=25,
            throttle_sleep=0.8
        )

    if args.which in ("removed","both") and removed_ids:
        print("[info] Processing REMOVED group …")
        # For removed items, listing pages often return generic 200s; still write what we can
        written_paths += process_group(
            "removed",
            removed_ids,
            id_to_lastmod,
            args.outdir,
            args.local_crx_dir,
            do_metadata=do_meta,           # optional: can be skipped with --skip-metadata
            do_permissions=do_perm,        # try update2/crx (will frequently fail; recorded)
            throttle_every=35,
            throttle_sleep=1.0
        )

    print("\n== Wrote files ==")
    print(f"- {avail_csv}")
    for p in written_paths:
        print(f"- {p}")

    print("\n== Summary ==")
    print(f"Available: {len(available_ids)} | Removed: {len(removed_ids)} | Total: {len(ids)}")
    if do_meta:
        print("Metadata: enabled")
    else:
        print("Metadata: skipped")
    if do_perm:
        print("Permissions: enabled (CRX download + manifest)")
    else:
        print("Permissions: skipped")

if __name__ == "__main__":
    main()
