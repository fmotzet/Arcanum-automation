#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os, sys, time, json, argparse, importlib, traceback, shutil
from datetime import datetime
import re

REPO_ROOT = "/root/Test_Cases"
if REPO_ROOT not in sys.path:
    sys.path.insert(0, REPO_ROOT)

from rework.arcanum_common import run_site_test, v8_log_path, user_data_path, log_path

TESTS = {
    "rework.tests.test_amazon_mv3":   ("amazon_address", "mv3"),
    # "rework.tests.test_amazon_mv3":   ("amazon_payment.wprgo", "mv3"),
    "rework.tests.test_facebook_mv3": ("fb_post", "mv3"),
    "rework.tests.test_gmail_mv3":    ("gmail_inbox", "mv3"),
    "rework.tests.test_instagram_mv3":("ins_profile", "mv3"),
    "rework.tests.test_linkedin_mv3": ("linkedin_profile", "mv3"),
    "rework.tests.test_outlook_mv3":  ("outlook_inbox", "mv3"),
    "rework.tests.test_paypal_mv3":   ("paypal_card", "mv3"),
}

SITE_PREFIX = {
    "amazon":   "rework.tests.test_amazon_",
    # "amazon_payment":   "rework.tests.test_amazon_payment_",
    "facebook": "rework.tests.test_facebook_",
    "gmail":    "rework.tests.test_gmail_",
    "instagram":"rework.tests.test_instagram_",
    "outlook":  "rework.tests.test_outlook_",
    "paypal":   "rework.tests.test_paypal_",
    "linkedin": "rework.tests.test_linkedin_",
}

def sinks_only_success_check(min_bytes: int = 1) -> bool:
    """Return True if Arcanum produced any sink log with at least min_bytes."""
    candidates = [
        os.path.join(user_data_path, "taint_fetch.log"),
        os.path.join(user_data_path, "taint_xhr.log"),
        os.path.join(v8_log_path, "taint_storage.log"),
    ]
    for p in candidates:
        try:
            if os.path.exists(p) and os.path.getsize(p) >= min_bytes:
                return True
        except Exception:
            pass
    print("[sink-check] sizes:", {os.path.basename(p): (os.path.getsize(p) if os.path.exists(p) else 0) for p in candidates})
    return False

def _sink_file_sizes():
    """Return sizes of current sink/source/browser logs before archiving (for debugging)."""
    paths = {
        "taint_fetch.log":   os.path.join(user_data_path, "taint_fetch.log"),
        "taint_xhr.log":     os.path.join(user_data_path, "taint_xhr.log"),
        "taint_storage.log": os.path.join(v8_log_path,    "taint_storage.log"),
        "taint_sources.log": os.path.join(v8_log_path,    "taint_sources.log"),
        "chromium.log":      os.path.join(log_path,       "chromium.log"),
        "wprgo.log":         os.path.join(log_path,       "wprgo.log"),
    }
    sizes = {}
    for name, p in paths.items():
        try:
            sizes[name] = os.path.getsize(p) if os.path.exists(p) else 0
        except Exception:
            sizes[name] = 0
    return sizes


def select_modules(sites_arg: str, mv_arg: str):
    if sites_arg == "all":
        site_keys = list(SITE_PREFIX.keys())
    else:
        site_keys = [s.strip().lower() for s in sites_arg.split(",") if s.strip()]
    modules = []
    for s in site_keys:
        base = SITE_PREFIX.get(s)
        if not base: continue
        if mv_arg in ("mv3", "both"):
            modules.append(base + "mv3")
    return [m for m in modules if m in TESTS]

def archive_logs(tag: str, dest_root="/root/logs"):
    ts = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    target_dir = os.path.join(dest_root, tag, ts)
    os.makedirs(target_dir, exist_ok=True)
    to_copy = [
        (os.path.join(v8_log_path, 'taint_sources.log'), os.path.join(target_dir, 'taint_sources.log')),
        (os.path.join(v8_log_path, 'taint_storage.log'), os.path.join(target_dir, 'taint_storage.log')),
        (os.path.join(user_data_path, 'taint_xhr.log'),   os.path.join(target_dir, 'taint_xhr.log')),
        (os.path.join(user_data_path, 'taint_fetch.log'), os.path.join(target_dir, 'taint_fetch.log')),
        (os.path.join(log_path, 'chromium.log'),          os.path.join(target_dir, 'chromium.log')),
        (os.path.join(log_path, 'wprgo.log'),             os.path.join(target_dir, 'wprgo.log')),
    ]
    for src, dst in to_copy:
        if os.path.exists(src):
            try: shutil.copy2(src, dst)
            except Exception as e: print(f"[archive] warn: {e}")
    try:
        return sorted(os.listdir(target_dir)), target_dir
    except Exception:
        return [], target_dir

def run_one(module_path: str, extension_path: str, retries: int = 1):
    """
    Run a single site test module with the given extension.
    - Uses sinks-only success check (no page interaction, no timeout tweaks).
    - ALWAYS archives logs, regardless of success/fail/error.
    - Archives are tagged with status and attempt number to keep everything.
    """
    target_page, mv = TESTS[module_path]
    test_key = f"{target_page}_{mv}"

    attempts = []
    overall_status = "fail"

    for i in range(max(1, retries)):
        t0 = time.time()
        error = None
        status = "error"
        archived_files, archive_dir = [], ""

        try:
            ok = run_site_test(
                target_page,
                success_check_fn=sinks_only_success_check,
                extension_path=extension_path,
            )
            status = "success" if ok else "fail"

        except Exception as e:
            status = "error"
            error = "".join(traceback.format_exception(type(e), e, e.__traceback__))
            print(f"[ERROR] {module_path}\n{error}")

        # archive, tagging with status + attempt
        tag = f"{test_key}_{status}_try{i+1}"
        archived_files, archive_dir = archive_logs(tag)

        sizes = _sink_file_sizes()

        attempt_result = {
            "status": status,
            "duration_s": round(time.time() - t0, 2),
            "archive_dir": archive_dir,
            "archived_files": archived_files,
            "error": error,
            "sink_sizes": sizes,
            "attempt": i + 1,
        }
        attempts.append(attempt_result)

        if status == "success":
            overall_status = "success"
            break
        elif status == "error" and overall_status != "success":
            overall_status = "error"
        # if fail, keep overall_status unless an error was seen earlier

    final = attempts[-1]
    return {
        "module": module_path,
        "target_page": target_page,
        "mv": mv,
        "status": overall_status,
        "duration_s": sum(a["duration_s"] for a in attempts),
        "archive_dir": final["archive_dir"],
        "archived_files": final["archived_files"],
        "error": final["error"],
        "attempts": attempts,
    }


def main():
    ap = argparse.ArgumentParser(description="Run Arcanum split-site tests for a single extension")
    ap.add_argument("--extension-path", required=True, help="Path to the .crx or unpacked extension dir to test")
    ap.add_argument("--mv", default="mv3", choices=["mv2","mv3","both"])
    ap.add_argument("--sites", default="all", help="Comma list or 'all'")
    ap.add_argument("--list", action="store_true", help="List selected tests and exit")
    ap.add_argument("--retries", type=int, default=int(os.getenv("RETRIES", "1")),help="attempts per test; 1 disables retry")
    args = ap.parse_args()

    ext_path = args.extension_path
    if not os.path.exists(ext_path):
        print(json.dumps({"error": f"extension not found: {ext_path}"}))
        sys.exit(2)

    modules = select_modules(args.sites, args.mv)
    if args.list:
        print(json.dumps({"selected": modules}, indent=2))
        return

    results = [run_one(m, ext_path, retries=args.retries) for m in modules]
    succ = sum(1 for r in results if r["status"] == "success")
    fail = sum(1 for r in results if r["status"] == "fail")
    err  = sum(1 for r in results if r["status"] == "error")
    overall = "success" if succ > 0 else ("fail" if err == 0 else "error")
    summary = {
        "overall": overall,
        "counts": {"success": succ, "fail": fail, "error": err, "total": len(results)},
        "results": results
    }
    #save logs
    summary_dir = os.getenv("SUMMARY_DIR", "/root/logs/summaries")
    os.makedirs(summary_dir, exist_ok=True)

    ext_base = os.path.basename(ext_path)
    safe_ext = re.sub(r"[^A-Za-z0-9_.-]+", "_", ext_base)
    ts = datetime.utcnow().strftime("%Y%m%d-%H%M%S")
    summary_path = os.path.join(summary_dir, f"{safe_ext}_{ts}.json")

    with open(summary_path, "w") as f:
        json.dump(summary, f, indent=2)

    print(f'WRAPPER_SUMMARY_PATH="{summary_path}"')

    print(json.dumps(summary, indent=2))

    sys.exit(0 if overall == "success" else 1)

if __name__ == "__main__":
    main()
