var solvingActive = !1;
window.addEventListener("message", function (e) {
  e.data.type &&
    "activateSolving" === e.data.type &&
    (solvingActive = solvingActive || !0);
}),
  (async () => {
    const e = [200, 400],
      {
        Logger: t,
        Time: a,
        BG: c,
        Net: o,
      } = await import(chrome.runtime.getURL("utils.js"));
    function i() {
      var e, t;
      return (
        !r() &&
        ((e =
          "true" ===
          document
            .querySelector(".recaptcha-checkbox")
            ?.getAttribute("aria-checked")),
        (t = document.querySelector("#recaptcha-verify-button")?.disabled),
        e || t)
      );
    }
    function r() {
      return (
        "Try again later" ===
        document.querySelector(".rc-doscaptcha-header")?.innerText
      );
    }
    async function n(e) {
      !solvingActive ||
        i() ||
        (await a.sleep(e.open_delay),
        document.querySelector("#recaptcha-anchor")?.click());
    }
    for (;;) {
      await a.sleep(1e3);
      var l = await c.exec("get_settings");
      l &&
        ((t.debug = l.debug),
        (async function () {
          var t = document.querySelectorAll(
            'iframe[src*="/recaptcha/api2/bframe"]'
          );
          if (0 < t.length) {
            let e = !1;
            for (const a of t)
              if ((e = "visible" === window.getComputedStyle(a).visibility))
                break;
            e
              ? await c.exec("set_cache", {
                  name: "recaptcha_visible",
                  value: !0,
                  tab_specific: !0,
                })
              : await c.exec("set_cache", {
                  name: "recaptcha_visible",
                  value: !1,
                  tab_specific: !0,
                });
          }
        })(),
        l.auto_open && null !== document.querySelector(".recaptcha-checkbox")
          ? await n(l)
          : l.auto_solve &&
            null !== document.querySelector(".rc-imageselect-instructions")
          ? ((s = l),
            await (!0 ===
              (await c.exec("get_cache", {
                name: "recaptcha_visible",
                tab_specific: !0,
              })) &&
              !i() &&
              (await a.sleep(s.open_delay),
              !document.querySelector("#recaptcha-audio-button")?.click())))
          : !l.auto_solve ||
            (null === document.querySelector("#audio-instructions") &&
              null === document.querySelector(".rc-doscaptcha-header")) ||
            ((s = l),
            await !(
              !(u = l = void 0) !==
                (u = await c.exec("get_cache", {
                  name: "recaptcha_visible",
                  tab_specific: !0,
                })) ||
              i() ||
              (r()
                ? (t.log("got solve error"), await c.exec("reset_recaptcha"))
                : ((u = document.querySelector(
                    ".rc-audiochallenge-tdownload-link"
                  )?.href),
                  fetch(u),
                  await a.random_sleep(...e),
                  (u = document
                    .querySelector("#audio-source")
                    ?.src?.replace("recaptcha.net", "google.com")),
                  ((n = "en") && 0 !== n.length) || (n = "en"),
                  (l = a.time()),
                  (u = await o.fetch("https://engageub.pythonanywhere.com", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: "input=" + encodeURIComponent(u) + "&lang=" + n,
                  })),
                  (document.querySelector("#audio-response").value = u),
                  0 < (u = s.solve_delay - (a.time() - l)) &&
                    (await a.sleep(u)),
                  await a.random_sleep(...e),
                  document.querySelector("#recaptcha-verify-button")?.click()))
            )));
    }
    var u, s;
  })();
