const extpay = ExtPay("ekw-pobieracz"),
  popup = {
    EKW_URL:
      "https://przegladarka-ekw.ms.gov.pl/eukw_prz/KsiegiWieczyste/wyszukiwanieKW",
    user: {},
    submitForm: function () {
      chrome.tabs.query({ active: !0, currentWindow: !0 }, async function (a) {
        if (!(await popup.verifyForm())) return !1;
        let e = document.getElementById("btn-start");
        e.setAttribute("disabled", "disabled"),
          (e.innerText = "Pobieranie ksiąg..."),
          await chrome.runtime.sendMessage({ type: "clear-cookies" }),
          a[0].url !== popup.EKW_URL &&
            (await popup.goToUrl(a[0].id, popup.EKW_URL)),
          chrome.storage.local.get(null, async function (e) {
            let t = document.getElementById("import-txt-file"),
              n = [];
            if (t.files.length) {
              let e = await t.files[0].text();
              e.replaceAll("\r\n", "\n")
                .split("\n")
                .forEach((e) => {
                  e = (e = e.trim().toUpperCase()).match(
                    /^[A-Z0-9]{4}.[0-9]{1,8}.*$/
                  );
                  null !== e && n.push(e[0]);
                });
            }
            let o = document.getElementById("fetch-delay").value;
            try {
              (o = parseInt(o)), (o = isNaN(o) ? 0 : o) < 0 && (o = 0);
            } catch (e) {
              o = 0;
            }
            chrome.tabs.sendMessage(a[0].id, {
              type: "start",
              data: {
                kodWydzialu: document
                  .getElementById("kod-wydzialu")
                  .value.toUpperCase(),
                numeryOd: document.getElementById("numery-od").value,
                numeryDo: document.getElementById("numery-do").value,
                iloscWatkow: document.getElementById("ilosc-watkow").value,
                rodzaj: document.getElementById("rodzaj").value,
                skipFetched:
                  "1" === document.getElementById("skip-fetched").value,
                fetchDelay: o,
                captchaSolver: document.getElementById("captcha-solver").value,
                captchaSolverKey:
                  document.getElementById("captcha-solver-key").value,
                proxyList: e.proxyList || [],
                exportType: e.exportType || "html",
                customKwList: n,
              },
            });
          });
      });
    },
    sleep: function (t) {
      return new Promise((e) => setTimeout(e, t));
    },
    showError: function (e, t) {
      (e.style.display = "flex"),
        (e.innerHTML = `<span class="error">${t}</span>`);
    },
    verifyForm: async function () {
      let t = !1;
      var e = document.getElementById("kod-wydzialu").value;
      let n = document.getElementById("error-kod-wydzialu");
      var o = parseInt(document.getElementById("numery-od").value);
      let a = document.getElementById("error-numery-od");
      var l = parseInt(document.getElementById("numery-do").value);
      let d = document.getElementById("error-numery-do");
      var r = parseInt(document.getElementById("ilosc-watkow").value),
        c = document.getElementById("rodzaj").value;
      let s = document.getElementById("error-rodzaj"),
        i = document.getElementById("error-ilosc-watkow"),
        u = document.getElementById("import-txt-file"),
        m = document.getElementById("txt-file-error"),
        y =
          ((n.style.display = "none"),
          (a.style.display = "none"),
          (d.style.display = "none"),
          (i.style.display = "none"),
          (s.style.display = "none"),
          (m.style.display = "none"),
          !0),
        p = 0;
      if (u.files.length) {
        let e = await u.files[0].text();
        e
          .replaceAll("\r\n", "\n")
          .split("\n")
          .forEach((e) => {
            (e = e.trim().toUpperCase()),
              /^[A-Z0-9]{4}.[0-9]{1,8}.*$/.test(e) && p++;
          }),
          0 === p &&
            (this.showError(m, "Wybierz plik z co najmniej 1 księgą"),
            (t = !0)),
          !popup.user.paid &&
            10 < p &&
            (this.showError(
              m,
              "Więcej niż 10 ksiąg na raz możesz pobrać tylko w wersji PRO!"
            ),
            (t = !0));
      } else
        4 !== e.length &&
          (this.showError(n, "Błędne oznaczenie kodu wydziału"), (t = !0)),
          (!/^\d+$/.test(o + "") || o <= 0) &&
            ((y = !1), this.showError(a, "Błędna liczba"), (t = !0)),
          (!/^\d+$/.test(l + "") || l <= 0) &&
            ((y = !1), this.showError(d, "Błędna liczba"), (t = !0)),
          y &&
            l < o &&
            (this.showError(
              d,
              "Numer końcowy nie może być niższy od początkowego"
            ),
            (t = !0)),
          !popup.user.paid &&
            10 < l - o + 1 &&
            (this.showError(
              d,
              "Więcej niż 10 ksiąg na raz możesz pobrać tylko w wersji PRO!"
            ),
            (t = !0));
      return (
        "przyciskWydrukZwykly" === c ||
          popup.user.paid ||
          (this.showError(s, "Opcja dostępna tylko w wersji PRO!"), (t = !0)),
        !/^\d+$/.test(r + "") || r <= 0
          ? (this.showError(i, "Błędna liczba"), (t = !0))
          : !popup.user.paid && 2 < r
          ? (this.showError(
              i,
              "Ilość wątków większa od 2 dostępna tylko w wersji PRO!"
            ),
            (t = !0))
          : popup.user.paid && 15 < r
          ? (this.showError(i, "Ilość wątków nie może być większa od 15"),
            (t = !0))
          : y &&
            (u.files.length
              ? r > p &&
                (this.showError(
                  i,
                  "Ilość wątków nie może przekraczać liczby ksiąg"
                ),
                (t = !0))
              : l - o + 1 < r &&
                (this.showError(
                  i,
                  "Ilość wątków nie może przekraczać liczby ksiąg"
                ),
                (t = !0))),
        !1 === t
      );
    },
    refreshSubscriptionStatus: async function () {
      let t = document.getElementById("subscription-status"),
        n = document.getElementById("subscription-pay-btn");
      if (((popup.user = await extpay.getUser()), popup.user.paid))
        (t.style.color = "green"),
          (t.innerHTML = "Aktywna"),
          (n.innerText = "Zmień / anuluj licencję");
      else {
        (n.innerText = "Opłać"), (t.style.color = "red");
        let e = "Nieaktywna";
        "past_due" === popup.user.subscriptionStatus
          ? (e = "Zaległa płatność")
          : "canceled" === popup.user.subscriptionStatus &&
            ((e = "Anulowana"),
            popup.user.subscriptionCancelAt &&
              (e +=
                " (koniec: " +
                popup.user.subscriptionCancelAt.toLocaleString() +
                ")")),
          (t.innerHTML = e),
          (n.style.display = "block");
      }
    },
    goToUrl: function (a, e) {
      return (
        chrome.tabs.update(a, { url: e }),
        new Promise((o) => {
          chrome.tabs.onUpdated.addListener(function e(t, n) {
            console.log("STATUS: " + n.status),
              t === a &&
                "complete" === n.status &&
                (chrome.tabs.onUpdated.removeListener(e), o());
          });
        })
      );
    },
    addListeners: function () {
      document
        .getElementById("tab-main")
        .addEventListener("click", function () {
          (document.getElementById("tab-content2").style.display = "none"),
            (document.getElementById("tab-content3").style.display = "none"),
            (document.getElementById("tab-content4").style.display = "none"),
            (document.getElementById("tab-content1").style.display = "block");
        }),
        document
          .getElementById("tab-settings")
          .addEventListener("click", function () {
            (document.getElementById("tab-content1").style.display = "none"),
              (document.getElementById("tab-content3").style.display = "none"),
              (document.getElementById("tab-content4").style.display = "none"),
              (document.getElementById("tab-content2").style.display = "block");
          }),
        document
          .getElementById("tab-pro")
          .addEventListener("click", function () {
            (document.getElementById("tab-content1").style.display = "none"),
              (document.getElementById("tab-content2").style.display = "none"),
              (document.getElementById("tab-content4").style.display = "none"),
              (document.getElementById("tab-content3").style.display = "block");
          }),
        document
          .getElementById("tab-search")
          .addEventListener("mouseup", function () {
            window.open(
              "chrome-extension://" + chrome.runtime.id + "/wyszukiwarka.html"
            );
          }),
        document
          .getElementById("kod-wydzialu")
          .addEventListener("change", function () {
            chrome.storage.local.set(
              { kodWydzialu: document.getElementById("kod-wydzialu").value },
              function () {}
            );
          }),
        document
          .getElementById("numery-od")
          .addEventListener("change", function () {
            chrome.storage.local.set(
              { numeryOd: document.getElementById("numery-od").value },
              function () {}
            );
          }),
        document
          .getElementById("numery-do")
          .addEventListener("change", function () {
            chrome.storage.local.set(
              { numeryDo: document.getElementById("numery-do").value },
              function () {}
            );
          }),
        document
          .getElementById("ilosc-watkow")
          .addEventListener("change", function () {
            chrome.storage.local.set(
              { iloscWatkow: document.getElementById("ilosc-watkow").value },
              function () {}
            );
          }),
        document
          .getElementById("rodzaj")
          .addEventListener("change", function () {
            chrome.storage.local.set(
              { rodzaj: document.getElementById("rodzaj").value },
              function () {}
            );
          }),
        document
          .getElementById("import-txt-file")
          .addEventListener("click", function (e) {
            e.target.value = "";
          }),
        document
          .getElementById("import-txt-file")
          .addEventListener("change", function () {
            let e = document.getElementById("import-txt-file").files[0],
              t = document.getElementById("txt-file-name");
            (t.innerHTML = `<strong>${e.name}</strong>`),
              e.text().then((e) => {
                let t = 0;
                e
                  .replaceAll("\r\n", "\n")
                  .split("\n")
                  .forEach((e) => {
                    (e = e.trim().toUpperCase()),
                      /^[A-Z0-9]{4}.[0-9]{1,8}.*$/.test(e) && t++;
                  }),
                  (document.getElementById(
                    "txt-file-count-wrapper"
                  ).style.display = "block"),
                  (document.getElementById("txt-file-count").innerHTML =
                    t + "");
              });
          }),
        document
          .getElementById("captcha-solver")
          .addEventListener("change", function () {
            let e = document.getElementById("captcha-solver-key-row");
            "auto" === document.getElementById("captcha-solver").value
              ? (e.style.display = "none")
              : (e.style.display = "flex");
          });
      let e = document.getElementById("btn-goto-ekw");
      e.addEventListener("click", async function () {
        e.setAttribute("disabled", "disabled"),
          (e.innerText = "Ładuję stronę EKW..."),
          await chrome.tabs.query(
            { active: !0, currentWindow: !0 },
            async function (e) {
              await popup.goToUrl(e[0].id, popup.EKW_URL),
                await popup.sleep(1e3),
                (document.getElementById("btn-goto-ekw-row").style.display =
                  "none"),
                (document.getElementById("btn-start-row").style.display =
                  "flex");
            }
          );
      }),
        document
          .getElementById("btn-start")
          .addEventListener("click", async function () {
            popup.submitForm();
          }),
        document
          .getElementById("btn-zapisz-ustawienia")
          .addEventListener("click", async function () {
            let e = !1;
            var t = document.getElementById("export-type").value;
            let n = document.getElementById("error-export-type"),
              o =
                ((n.style.display = "none"),
                "html" === t || popup.user.paid
                  ? chrome.storage.local.set({ exportType: t }, function () {})
                  : ((e = !0),
                    popup.showError(n, "Opcja dostępna tylko w wersji PRO!")),
                chrome.storage.local.set({
                  skipFetched:
                    "1" === document.getElementById("skip-fetched").value,
                }),
                chrome.storage.local.set({
                  captchaSolver:
                    document.getElementById("captcha-solver").value,
                }),
                chrome.storage.local.set({
                  captchaSolverKey:
                    document.getElementById("captcha-solver-key").value,
                }),
                document.getElementById("fetch-delay").value);
            try {
              (o = parseInt(o)), (o = isNaN(o) ? 0 : o) < 0 && (o = 0);
            } catch (e) {
              o = 0;
            }
            if (
              (chrome.storage.local.set({ fetchDelay: o }),
              (document.getElementById("fetch-delay").value = o),
              !e)
            ) {
              let o = [];
              await chrome.runtime.sendMessage({
                type: "set-proxy",
                proxy: "",
              }),
                document
                  .getElementById("lista-proxy")
                  .value.replace(/(?:\r\n)/g, "\n")
                  .split("\n")
                  .forEach((t) => {
                    t = t.trim().split(":");
                    if (t && 2 === t.length) {
                      var n = t[0];
                      let e = null;
                      try {
                        e = t[1];
                      } catch (e) {
                        return;
                      }
                      !/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(
                        n
                      ) ||
                        e <= 0 ||
                        65535 < e ||
                        o.push({ ip: n, port: e });
                    }
                  }),
                chrome.storage.local.set({ proxyList: o }, function () {}),
                (document.getElementById(
                  "zapisz-ustawienia-done"
                ).style.display = "flex"),
                setTimeout(function () {
                  document.getElementById(
                    "zapisz-ustawienia-done"
                  ).style.display = "none";
                }, 1100);
            }
          }),
        document
          .getElementById("subscription-pay-btn")
          .addEventListener("click", extpay.openPaymentPage);
    },
    getSettings: function () {
      chrome.storage.local.get(null, function (e) {
        e.kodWydzialu &&
          (document.getElementById("kod-wydzialu").value = e.kodWydzialu),
          e.numeryOd &&
            (document.getElementById("numery-od").value = e.numeryOd),
          e.numeryDo &&
            (document.getElementById("numery-do").value = e.numeryDo),
          e.iloscWatkow &&
            (document.getElementById("ilosc-watkow").value = e.iloscWatkow),
          e.rodzaj && (document.getElementById("rodzaj").value = e.rodzaj),
          e.skipFetched &&
            (document.getElementById("skip-fetched").value = e.skipFetched
              ? "1"
              : "0"),
          e.fetchDelay &&
            (document.getElementById("fetch-delay").value = e.fetchDelay),
          e.captchaSolver &&
            (document.getElementById("captcha-solver").value = e.captchaSolver),
          e.captchaSolverKey &&
            (document.getElementById("captcha-solver-key").value =
              e.captchaSolverKey);
        let t = document.getElementById("captcha-solver-key-row");
        "auto" === document.getElementById("captcha-solver").value
          ? (t.style.display = "none")
          : (t.style.display = "flex"),
          e.exportType &&
            (document.getElementById("export-type").value = e.exportType),
          "html" === e.exportType ||
            popup.user.paid ||
            ((document.getElementById("export-type").value = "html"),
            chrome.storage.local.set({ exportType: "html" }, function () {})),
          e.proxyList &&
            ((document.getElementById("lista-proxy").value = ""),
            e.proxyList.forEach((e) => {
              document.getElementById("lista-proxy").value +=
                e.ip + ":" + e.port + "\n";
            }));
      });
    },
    async initPopup() {
      await this.refreshSubscriptionStatus(),
        this.getSettings(),
        this.addListeners(),
        setInterval(popup.refreshSubscriptionStatus, 1e4);
    },
  };
function doReady() {
  popup.initPopup();
}
"complete" === document.readyState ||
("loading" !== document.readyState && !document.documentElement.doScroll)
  ? doReady()
  : document.addEventListener("DOMContentLoaded", doReady),
  chrome.runtime.sendMessage({ type: "clear-cookies" });
