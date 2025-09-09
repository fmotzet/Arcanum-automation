var ExtPay = (function () {
  "use strict";
  (function (e) {
    if (
      "undefined" == typeof browser ||
      Object.getPrototypeOf(browser) !== Object.prototype
    ) {
      if (
        "object" != typeof chrome ||
        !chrome ||
        !chrome.runtime ||
        !chrome.runtime.id
      )
        throw new Error(
          "This script should only be loaded in a browser extension."
        );
      e.exports = ((n) => {
        const e = {
          alarms: {
            clear: { minArgs: 0, maxArgs: 1 },
            clearAll: { minArgs: 0, maxArgs: 0 },
            get: { minArgs: 0, maxArgs: 1 },
            getAll: { minArgs: 0, maxArgs: 0 },
          },
          bookmarks: {
            create: { minArgs: 1, maxArgs: 1 },
            get: { minArgs: 1, maxArgs: 1 },
            getChildren: { minArgs: 1, maxArgs: 1 },
            getRecent: { minArgs: 1, maxArgs: 1 },
            getSubTree: { minArgs: 1, maxArgs: 1 },
            getTree: { minArgs: 0, maxArgs: 0 },
            move: { minArgs: 2, maxArgs: 2 },
            remove: { minArgs: 1, maxArgs: 1 },
            removeTree: { minArgs: 1, maxArgs: 1 },
            search: { minArgs: 1, maxArgs: 1 },
            update: { minArgs: 2, maxArgs: 2 },
          },
          browserAction: {
            disable: { minArgs: 0, maxArgs: 1, fallbackToNoCallback: !0 },
            enable: { minArgs: 0, maxArgs: 1, fallbackToNoCallback: !0 },
            getBadgeBackgroundColor: { minArgs: 1, maxArgs: 1 },
            getBadgeText: { minArgs: 1, maxArgs: 1 },
            getPopup: { minArgs: 1, maxArgs: 1 },
            getTitle: { minArgs: 1, maxArgs: 1 },
            openPopup: { minArgs: 0, maxArgs: 0 },
            setBadgeBackgroundColor: {
              minArgs: 1,
              maxArgs: 1,
              fallbackToNoCallback: !0,
            },
            setBadgeText: { minArgs: 1, maxArgs: 1, fallbackToNoCallback: !0 },
            setIcon: { minArgs: 1, maxArgs: 1 },
            setPopup: { minArgs: 1, maxArgs: 1, fallbackToNoCallback: !0 },
            setTitle: { minArgs: 1, maxArgs: 1, fallbackToNoCallback: !0 },
          },
          browsingData: {
            remove: { minArgs: 2, maxArgs: 2 },
            removeCache: { minArgs: 1, maxArgs: 1 },
            removeCookies: { minArgs: 1, maxArgs: 1 },
            removeDownloads: { minArgs: 1, maxArgs: 1 },
            removeFormData: { minArgs: 1, maxArgs: 1 },
            removeHistory: { minArgs: 1, maxArgs: 1 },
            removeLocalStorage: { minArgs: 1, maxArgs: 1 },
            removePasswords: { minArgs: 1, maxArgs: 1 },
            removePluginData: { minArgs: 1, maxArgs: 1 },
            settings: { minArgs: 0, maxArgs: 0 },
          },
          commands: { getAll: { minArgs: 0, maxArgs: 0 } },
          contextMenus: {
            remove: { minArgs: 1, maxArgs: 1 },
            removeAll: { minArgs: 0, maxArgs: 0 },
            update: { minArgs: 2, maxArgs: 2 },
          },
          cookies: {
            get: { minArgs: 1, maxArgs: 1 },
            getAll: { minArgs: 1, maxArgs: 1 },
            getAllCookieStores: { minArgs: 0, maxArgs: 0 },
            remove: { minArgs: 1, maxArgs: 1 },
            set: { minArgs: 1, maxArgs: 1 },
          },
          devtools: {
            inspectedWindow: {
              eval: { minArgs: 1, maxArgs: 2, singleCallbackArg: !1 },
            },
            panels: {
              create: { minArgs: 3, maxArgs: 3, singleCallbackArg: !0 },
              elements: { createSidebarPane: { minArgs: 1, maxArgs: 1 } },
            },
          },
          downloads: {
            cancel: { minArgs: 1, maxArgs: 1 },
            download: { minArgs: 1, maxArgs: 1 },
            erase: { minArgs: 1, maxArgs: 1 },
            getFileIcon: { minArgs: 1, maxArgs: 2 },
            open: { minArgs: 1, maxArgs: 1, fallbackToNoCallback: !0 },
            pause: { minArgs: 1, maxArgs: 1 },
            removeFile: { minArgs: 1, maxArgs: 1 },
            resume: { minArgs: 1, maxArgs: 1 },
            search: { minArgs: 1, maxArgs: 1 },
            show: { minArgs: 1, maxArgs: 1, fallbackToNoCallback: !0 },
          },
          extension: {
            isAllowedFileSchemeAccess: { minArgs: 0, maxArgs: 0 },
            isAllowedIncognitoAccess: { minArgs: 0, maxArgs: 0 },
          },
          history: {
            addUrl: { minArgs: 1, maxArgs: 1 },
            deleteAll: { minArgs: 0, maxArgs: 0 },
            deleteRange: { minArgs: 1, maxArgs: 1 },
            deleteUrl: { minArgs: 1, maxArgs: 1 },
            getVisits: { minArgs: 1, maxArgs: 1 },
            search: { minArgs: 1, maxArgs: 1 },
          },
          i18n: {
            detectLanguage: { minArgs: 1, maxArgs: 1 },
            getAcceptLanguages: { minArgs: 0, maxArgs: 0 },
          },
          identity: { launchWebAuthFlow: { minArgs: 1, maxArgs: 1 } },
          idle: { queryState: { minArgs: 1, maxArgs: 1 } },
          management: {
            get: { minArgs: 1, maxArgs: 1 },
            getAll: { minArgs: 0, maxArgs: 0 },
            getSelf: { minArgs: 0, maxArgs: 0 },
            setEnabled: { minArgs: 2, maxArgs: 2 },
            uninstallSelf: { minArgs: 0, maxArgs: 1 },
          },
          notifications: {
            clear: { minArgs: 1, maxArgs: 1 },
            create: { minArgs: 1, maxArgs: 2 },
            getAll: { minArgs: 0, maxArgs: 0 },
            getPermissionLevel: { minArgs: 0, maxArgs: 0 },
            update: { minArgs: 2, maxArgs: 2 },
          },
          pageAction: {
            getPopup: { minArgs: 1, maxArgs: 1 },
            getTitle: { minArgs: 1, maxArgs: 1 },
            hide: { minArgs: 1, maxArgs: 1, fallbackToNoCallback: !0 },
            setIcon: { minArgs: 1, maxArgs: 1 },
            setPopup: { minArgs: 1, maxArgs: 1, fallbackToNoCallback: !0 },
            setTitle: { minArgs: 1, maxArgs: 1, fallbackToNoCallback: !0 },
            show: { minArgs: 1, maxArgs: 1, fallbackToNoCallback: !0 },
          },
          permissions: {
            contains: { minArgs: 1, maxArgs: 1 },
            getAll: { minArgs: 0, maxArgs: 0 },
            remove: { minArgs: 1, maxArgs: 1 },
            request: { minArgs: 1, maxArgs: 1 },
          },
          runtime: {
            getBackgroundPage: { minArgs: 0, maxArgs: 0 },
            getPlatformInfo: { minArgs: 0, maxArgs: 0 },
            openOptionsPage: { minArgs: 0, maxArgs: 0 },
            requestUpdateCheck: { minArgs: 0, maxArgs: 0 },
            sendMessage: { minArgs: 1, maxArgs: 3 },
            sendNativeMessage: { minArgs: 2, maxArgs: 2 },
            setUninstallURL: { minArgs: 1, maxArgs: 1 },
          },
          sessions: {
            getDevices: { minArgs: 0, maxArgs: 1 },
            getRecentlyClosed: { minArgs: 0, maxArgs: 1 },
            restore: { minArgs: 0, maxArgs: 1 },
          },
          storage: {
            local: {
              clear: { minArgs: 0, maxArgs: 0 },
              get: { minArgs: 0, maxArgs: 1 },
              getBytesInUse: { minArgs: 0, maxArgs: 1 },
              remove: { minArgs: 1, maxArgs: 1 },
              set: { minArgs: 1, maxArgs: 1 },
            },
            managed: {
              get: { minArgs: 0, maxArgs: 1 },
              getBytesInUse: { minArgs: 0, maxArgs: 1 },
            },
            sync: {
              clear: { minArgs: 0, maxArgs: 0 },
              get: { minArgs: 0, maxArgs: 1 },
              getBytesInUse: { minArgs: 0, maxArgs: 1 },
              remove: { minArgs: 1, maxArgs: 1 },
              set: { minArgs: 1, maxArgs: 1 },
            },
          },
          tabs: {
            captureVisibleTab: { minArgs: 0, maxArgs: 2 },
            create: { minArgs: 1, maxArgs: 1 },
            detectLanguage: { minArgs: 0, maxArgs: 1 },
            discard: { minArgs: 0, maxArgs: 1 },
            duplicate: { minArgs: 1, maxArgs: 1 },
            executeScript: { minArgs: 1, maxArgs: 2 },
            get: { minArgs: 1, maxArgs: 1 },
            getCurrent: { minArgs: 0, maxArgs: 0 },
            getZoom: { minArgs: 0, maxArgs: 1 },
            getZoomSettings: { minArgs: 0, maxArgs: 1 },
            goBack: { minArgs: 0, maxArgs: 1 },
            goForward: { minArgs: 0, maxArgs: 1 },
            highlight: { minArgs: 1, maxArgs: 1 },
            insertCSS: { minArgs: 1, maxArgs: 2 },
            move: { minArgs: 2, maxArgs: 2 },
            query: { minArgs: 1, maxArgs: 1 },
            reload: { minArgs: 0, maxArgs: 2 },
            remove: { minArgs: 1, maxArgs: 1 },
            removeCSS: { minArgs: 1, maxArgs: 2 },
            sendMessage: { minArgs: 2, maxArgs: 3 },
            setZoom: { minArgs: 1, maxArgs: 2 },
            setZoomSettings: { minArgs: 1, maxArgs: 2 },
            update: { minArgs: 1, maxArgs: 2 },
          },
          topSites: { get: { minArgs: 0, maxArgs: 0 } },
          webNavigation: {
            getAllFrames: { minArgs: 1, maxArgs: 1 },
            getFrame: { minArgs: 1, maxArgs: 1 },
          },
          webRequest: { handlerBehaviorChanged: { minArgs: 0, maxArgs: 0 } },
          windows: {
            create: { minArgs: 0, maxArgs: 1 },
            get: { minArgs: 1, maxArgs: 2 },
            getAll: { minArgs: 0, maxArgs: 1 },
            getCurrent: { minArgs: 0, maxArgs: 1 },
            getLastFocused: { minArgs: 0, maxArgs: 1 },
            remove: { minArgs: 1, maxArgs: 1 },
            update: { minArgs: 2, maxArgs: 2 },
          },
        };
        if (0 === Object.keys(e).length)
          throw new Error(
            "api-metadata.json has not been included in browser-polyfill"
          );
        class r extends WeakMap {
          constructor(e, r = void 0) {
            super(r), (this.createItem = e);
          }
          get(e) {
            return this.has(e) || this.set(e, this.createItem(e)), super.get(e);
          }
        }
        const A =
            (r, s) =>
            (...e) => {
              n.runtime.lastError
                ? r.reject(n.runtime.lastError)
                : s.singleCallbackArg ||
                  (e.length <= 1 && !1 !== s.singleCallbackArg)
                ? r.resolve(e[0])
                : r.resolve(e);
            },
          l = (e) => (1 == e ? "argument" : "arguments"),
          c = (t, e, n) =>
            new Proxy(e, {
              apply(e, r, s) {
                return n.call(r, t, ...s);
              },
            });
        let x = Function.call.bind(Object.prototype.hasOwnProperty);
        const u = (i, o = {}, g = {}) => {
          let m = Object.create(null);
          var e = {
              has(e, r) {
                return r in i || r in m;
              },
              get(e, r, s) {
                if (r in m) return m[r];
                if (r in i) {
                  let e = i[r];
                  var t, n, a;
                  if ("function" == typeof e)
                    e =
                      "function" == typeof o[r]
                        ? c(i, i[r], o[r])
                        : x(g, r)
                        ? ((a = g[(n = r)]),
                          (t = function (s, ...t) {
                            if (t.length < a.minArgs)
                              throw new Error(
                                `Expected at least ${a.minArgs} ${l(
                                  a.minArgs
                                )} for ${n}(), got ` + t.length
                              );
                            if (t.length > a.maxArgs)
                              throw new Error(
                                `Expected at most ${a.maxArgs} ${l(
                                  a.maxArgs
                                )} for ${n}(), got ` + t.length
                              );
                            return new Promise((r, e) => {
                              if (a.fallbackToNoCallback)
                                try {
                                  s[n](...t, A({ resolve: r, reject: e }, a));
                                } catch (e) {
                                  console.warn(
                                    n +
                                      " API method doesn't seem to support the callback parameter, falling back to call it without a callback: ",
                                    e
                                  ),
                                    s[n](...t),
                                    (a.fallbackToNoCallback = !1),
                                    (a.noCallback = !0),
                                    r();
                                }
                              else
                                a.noCallback
                                  ? (s[n](...t), r())
                                  : s[n](...t, A({ resolve: r, reject: e }, a));
                            });
                          }),
                          c(i, i[r], t))
                        : e.bind(i);
                  else if (
                    "object" == typeof e &&
                    null !== e &&
                    (x(o, r) || x(g, r))
                  )
                    e = u(e, o[r], g[r]);
                  else {
                    if (!x(g, "*"))
                      return (
                        Object.defineProperty(m, r, {
                          configurable: !0,
                          enumerable: !0,
                          get() {
                            return i[r];
                          },
                          set(e) {
                            i[r] = e;
                          },
                        }),
                        e
                      );
                    e = u(e, o[r], g["*"]);
                  }
                  return (m[r] = e);
                }
              },
              set(e, r, s, t) {
                return r in m ? (m[r] = s) : (i[r] = s), !0;
              },
              defineProperty(e, r, s) {
                return Reflect.defineProperty(m, r, s);
              },
              deleteProperty(e, r) {
                return Reflect.deleteProperty(m, r);
              },
            },
            r = Object.create(i);
          return new Proxy(r, e);
        };
        var s = (t) => ({
          addListener(e, r, ...s) {
            e.addListener(t.get(r), ...s);
          },
          hasListener(e, r) {
            return e.hasListener(t.get(r));
          },
          removeListener(e, r) {
            e.removeListener(t.get(r));
          },
        });
        let g = !1;
        var t = new r((o) =>
          "function" != typeof o
            ? o
            : function (e, r, s) {
                let t = !1,
                  n;
                var a = new Promise((r) => {
                  n = function (e) {
                    g ||
                      (console.warn(
                        "Returning a Promise is the preferred way to send a reply from an onMessage/onMessageExternal listener, as the sendResponse will be removed from the specs (See https://developer.mozilla.org/docs/Mozilla/Add-ons/WebExtensions/API/runtime/onMessage)",
                        new Error().stack
                      ),
                      (g = !0)),
                      (t = !0),
                      r(e);
                  };
                });
                let i;
                try {
                  i = o(e, r, n);
                } catch (e) {
                  i = Promise.reject(e);
                }
                r =
                  !0 !== i &&
                  (e = i) &&
                  "object" == typeof e &&
                  "function" == typeof e.then;
                return (
                  !(!0 !== i && !r && !t) &&
                  (((e) => {
                    e.then(
                      (e) => {
                        s(e);
                      },
                      (e) => {
                        let r;
                        (r =
                          e &&
                          (e instanceof Error || "string" == typeof e.message)
                            ? e.message
                            : "An unexpected error occurred"),
                          s({
                            __mozWebExtensionPolyfillReject__: !0,
                            message: r,
                          });
                      }
                    ).catch((e) => {
                      console.error(
                        "Failed to send onMessage rejected reply",
                        e
                      );
                    });
                  })(r ? i : a),
                  !0)
                );
              }
        );
        var a = (e, r, s, ...t) => {
            if (t.length < r.minArgs)
              throw new Error(
                `Expected at least ${r.minArgs} ${l(
                  r.minArgs
                )} for ${e}(), got ` + t.length
              );
            if (t.length > r.maxArgs)
              throw new Error(
                `Expected at most ${r.maxArgs} ${l(
                  r.maxArgs
                )} for ${e}(), got ` + t.length
              );
            return new Promise((e, r) => {
              e = (({ reject: e, resolve: r }, s) => {
                n.runtime.lastError
                  ? "The message port closed before a response was received." ===
                    n.runtime.lastError.message
                    ? r()
                    : e(n.runtime.lastError)
                  : s && s.__mozWebExtensionPolyfillReject__
                  ? e(new Error(s.message))
                  : r(s);
              }).bind(null, { resolve: e, reject: r });
              t.push(e), s.sendMessage(...t);
            });
          },
          s = {
            runtime: {
              onMessage: s(t),
              onMessageExternal: s(t),
              sendMessage: a.bind(null, "sendMessage", {
                minArgs: 1,
                maxArgs: 3,
              }),
            },
            tabs: {
              sendMessage: a.bind(null, "sendMessage", {
                minArgs: 2,
                maxArgs: 3,
              }),
            },
          },
          t = {
            clear: { minArgs: 1, maxArgs: 1 },
            get: { minArgs: 1, maxArgs: 1 },
            set: { minArgs: 1, maxArgs: 1 },
          };
        return (
          (e.privacy = {
            network: { "*": t },
            services: { "*": t },
            websites: { "*": t },
          }),
          u(n, s, e)
        );
      })(chrome);
    } else e.exports = browser;
  })((e = { exports: {} }));
  var e,
    u = e.exports;
  return (
    "undefined" != typeof window &&
      window.addEventListener(
        "message",
        (e) => {
          "https://extensionpay.com" !== e.origin ||
            e.source != window ||
            ("fetch-user" !== e.data && "trial-start" !== e.data) ||
            u.runtime.sendMessage(e.data);
        },
        !1
      ),
    function (e) {
      const n = "https://extensionpay.com",
        i = n + "/extension/" + e;
      async function o(r) {
        try {
          return await u.storage.sync.get(r);
        } catch (e) {
          return u.storage.local.get(r);
        }
      }
      async function g(r) {
        try {
          return await u.storage.sync.set(r);
        } catch (e) {
          return u.storage.local.set(r);
        }
      }
      u.management &&
        u.management.getSelf().then(async (e) => {
          if (!e.permissions.includes("storage"))
            throw `ExtPay Setup Error: please include the "storage" permission in manifest.json["permissions"] or else ExtensionPay won't work correctly.

You can copy and paste this to your manifest.json file to fix this error:

"permissions": [
    ${(e = e.hostPermissions.concat(e.permissions))
      .map((e) => `"    ${e}"`)
      .join(",\n")}${0 < e.length ? "," : ""}
    "storage"
]
`;
        }),
        o(["extensionpay_installed_at", "extensionpay_user"]).then(
          async (e) => {
            e.extensionpay_installed_at ||
              (await g({
                extensionpay_installed_at: (e = e.extensionpay_user)
                  ? e.installedAt
                  : new Date().toISOString(),
              }));
          }
        );
      const m = [],
        A = [];
      async function s() {
        var e,
          r = {};
        if (u.management) e = await u.management.getSelf();
        else {
          if (!u.runtime)
            throw "ExtPay needs to be run in a browser extension context";
          e = await u.runtime.sendMessage("extpay-extinfo");
        }
        "development" == e.installType && (r.development = !0);
        const s = await fetch(i + "/api/new-key", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-type": "application/json",
          },
          body: JSON.stringify(r),
        });
        if (s.ok)
          return await g({ extensionpay_api_key: (e = await s.json()) }), e;
        throw (s.status, n + "/home");
      }
      async function l() {
        var e = await o(["extensionpay_api_key"]);
        return e.extensionpay_api_key || null;
      }
      const c = /^\d\d\d\d-\d\d-\d\dT/;
      async function t() {
        var e = await o(["extensionpay_user", "extensionpay_installed_at"]),
          r = await l();
        if (!r)
          return {
            paid: !1,
            paidAt: null,
            installedAt: e.extensionpay_installed_at
              ? new Date(e.extensionpay_installed_at)
              : new Date(),
            trialStartedAt: null,
          };
        const s = await fetch(i + "/api/user?api_key=" + r, {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!s.ok) throw "ExtPay error while fetching user: " + s;
        var t,
          n,
          r = await s.json();
        const a = {};
        for ([t, n] of Object.entries(r))
          n && n.match && n.match(c) && (n = new Date(n)), (a[t] = n);
        return (
          (a.installedAt = new Date(e.extensionpay_installed_at)),
          a.paidAt &&
            (!e.extensionpay_user ||
              (e.extensionpay_user && !e.extensionpay_user.paidAt)) &&
            m.forEach((e) => e(a)),
          a.trialStartedAt &&
            (!e.extensionpay_user ||
              (e.extensionpay_user && !e.extensionpay_user.trialStartedAt)) &&
            A.forEach((e) => e(a)),
          await g({ extensionpay_user: r }),
          a
        );
      }
      var a = !1;
      async function x() {
        if (!a) {
          a = !0;
          for (var e = await t(), r = 0; r < 120; ++r) {
            if (e.paidAt) return (a = !1), e;
            await (function (r) {
              return new Promise((e) => setTimeout(e, r));
            })(1e3),
              (e = await t());
          }
          a = !1;
        }
      }
      return {
        getUser: function () {
          return t();
        },
        onPaid: {
          addListener: function (e) {
            var r = `"content_scripts": [
                {
            "matches": ["${n}/*"],
            "js": ["ExtPay.js"],
            "run_at": "document_start"
        }]`;
            const s = u.runtime.getManifest();
            if (!s.content_scripts)
              throw (
                `ExtPay setup error: To use the onPaid callback handler, please include ExtPay as a content script in your manifest.json. You can copy the example below into your manifest.json or check the docs: https://github.com/Glench/ExtPay#2-configure-your-manifestjson

        ` + r
              );
            var t = s.content_scripts.find((e) =>
              e.matches.includes(n.replace(":3000", "") + "/*")
            );
            if (!t)
              throw (
                `ExtPay setup error: To use the onPaid callback handler, please include ExtPay as a content script in your manifest.json matching "${n}/*". You can copy the example below into your manifest.json or check the docs: https://github.com/Glench/ExtPay#2-configure-your-manifestjson

        ` + r
              );
            if (!t.run_at || "document_start" !== t.run_at)
              throw (
                `ExtPay setup error: To use the onPaid callback handler, please make sure the ExtPay content script in your manifest.json runs at document start. You can copy the example below into your manifest.json or check the docs: https://github.com/Glench/ExtPay#2-configure-your-manifestjson

        ` + r
              );
            m.push(e);
          },
        },
        openPaymentPage: async function () {
          r = (r = await l()) || (await s());
          var r = await (i + "?api_key=" + r);
          if (u.windows)
            try {
              u.windows.create({
                url: r,
                type: "popup",
                focused: !0,
                width: 500,
                height: 800,
                left: 450,
              });
            } catch (e) {
              u.windows.create({
                url: r,
                type: "popup",
                width: 500,
                height: 800,
                left: 450,
              });
            }
          else
            window.open(
              r,
              null,
              "toolbar=no,location=no,directories=no,status=no,menubar=no,width=500,height=800,left=450"
            );
        },
        openTrialPage: async function (e) {
          var r = (r = await l()) || (await s()),
            r = i + "/trial?api_key=" + r;
          if ((e && (r += "&period=" + e), u.windows))
            try {
              u.windows.create({
                url: r,
                type: "popup",
                focused: !0,
                width: 500,
                height: 650,
                left: 450,
              });
            } catch (e) {
              u.windows.create({
                url: r,
                type: "popup",
                width: 500,
                height: 650,
                left: 450,
              });
            }
          else
            window.open(
              r,
              null,
              "toolbar=no,location=no,directories=no,status=no,menubar=no,width=500,height=800,left=450"
            );
        },
        onTrialStarted: {
          addListener: function (e) {
            A.push(e);
          },
        },
        startBackground: function () {
          u.runtime.onMessage.addListener(function (e, r, s) {
            if ("fetch-user" == e) x();
            else if ("trial-start" == e) t();
            else if ("extpay-extinfo" == e && u.management)
              return u.management.getSelf();
          });
        },
      };
    }
  );
})();
export { ExtPay };
