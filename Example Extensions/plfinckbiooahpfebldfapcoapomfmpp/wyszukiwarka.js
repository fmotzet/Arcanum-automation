var szukarka = {
  dirHandle: null,
  fraza: [],
  not_fraza: [],
  dzialy: [],
  wydzialy: [],
  zakresOd: 1,
  zakresDo: "",
  foundKW: [],
  searchInProgress: !1,
  startSearchActions: function () {
    (this.searchInProgress = !0),
      (this.foundKW = []),
      (document.getElementById("wyniki-kw").innerHTML = ""),
      (document.getElementById("search-in-progress").style.display = "block"),
      (document.getElementById("btn-szukaj").disabled = !0),
      (document.getElementById("btn-zatrzymaj").disabled = !1),
      (document.getElementById("wyniki").style.display = "flex"),
      (document.getElementById("result-buttons").style.display = "none"),
      (document.getElementById("nothing-found").style.display = "none");
  },
  stopSearchActions: function () {
    (this.searchInProgress = !1),
      (document.getElementById("search-in-progress").style.display = "none"),
      (document.getElementById("btn-szukaj").disabled = !1),
      (document.getElementById("btn-zatrzymaj").disabled = !0),
      0 === this.foundKW.length
        ? ((document.getElementById("result-buttons").style.display = "none"),
          (document.getElementById("nothing-found").style.display = "block"))
        : (document.getElementById("result-buttons").style.display = "flex");
  },
  szukaj: async function () {
    if (!(await szukarka.verifyForm())) return !1;
    try {
      this.dirHandle = await window.showDirectoryPicker();
    } catch (e) {
      return (
        console.error(e),
        void alert("Błąd - wybierz folder aby uruchomić proces.")
      );
    }
    this.startSearchActions(),
      (szukarka.fraza = []),
      chrome.storage.local.get(null, async function (e) {
        e.s_fraza && 0 < e.s_fraza.length && Array.isArray(e.s_fraza)
          ? e.s_fraza.forEach((e, a) => {
              null != e && (szukarka.fraza[a] = e);
            })
          : (szukarka.fraza[0] = e.s_fraza),
          e.s_not_fraza &&
            0 < e.s_not_fraza.length &&
            Array.isArray(e.s_not_fraza) &&
            e.s_not_fraza.forEach((e, a) => {
              szukarka.not_fraza[a] = !0 === e;
            }),
          (szukarka.dzialy = []),
          e.s_dzialy &&
          e.s_dzialy[0] &&
          0 < e.s_dzialy[0].length &&
          Array.isArray(e.s_dzialy[0])
            ? e.s_dzialy.forEach((e, a) => {
                null != e &&
                  e.forEach((e) => {
                    szukarka.dzialy[a] || (szukarka.dzialy[a] = []),
                      szukarka.dzialy[a].push(e);
                  });
              })
            : (szukarka.dzialy[0] = e.s_dzialy),
          (szukarka.wydzialy = e.s_wydzialy),
          (szukarka.zakresOd = parseInt(e.s_zakres_od)),
          (szukarka.zakresDo = parseInt(e.s_zakres_do)),
          e.s_wszystkie_numery &&
            ((szukarka.zakresOd = 1), (szukarka.zakresDo = 999999999)),
          (szukarka.foundKW = []),
          await szukarka.doSearch(szukarka.dirHandle),
          szukarka.stopSearchActions();
      });
  },
  doSearch: async function (e) {
    if (this.searchInProgress)
      for await (var [a, t] of e) {
        var {} = t;
        if ("directory" === t.kind) await this.doSearch(t);
        else if ("file" === t.kind && a.endsWith(".html")) {
          const r = await t.getFile();
          a = await r.text();
          try {
            const n = new DOMParser(),
              i = n.parseFromString(a, "text/html");
            if (
              i.getElementById("nawigacja") &&
              i.getElementById("contentDzialu")
            ) {
              var l = i
                  .querySelector("h2")
                  .innerText.match(/([A-Z0-9]{4})\/([0-9]{8})\/([0-9])/),
                s = l[1],
                d = parseInt(l[2]),
                o = l[0];
              let t = i.querySelector(".csTTytul").innerText.trim();
              if (t.startsWith("DZIAŁ I-O")) t = "I-O";
              else if (t.startsWith("DZIAŁ I-SP")) t = "I-Sp";
              else if (t.startsWith("DZIAŁ III")) t = "III";
              else if (t.startsWith("DZIAŁ II")) t = "II";
              else {
                if (!t.startsWith("DZIAŁ IV")) continue;
                t = "IV";
              }
              let r = [],
                n =
                  (szukarka.dzialy.forEach((e, a) => {
                    e.includes(t) &&
                      szukarka.fraza &&
                      szukarka.fraza[a] &&
                      null != szukarka.fraza[a] &&
                      "" !== szukarka.fraza[a] &&
                      (r.includes(szukarka.fraza[a]) ||
                        r.push(szukarka.fraza[a]));
                  }),
                  []);
              szukarka.dzialy.forEach((e, a) => {
                t.includes(t) &&
                  szukarka.not_fraza &&
                  szukarka.not_fraza[a] &&
                  !0 === szukarka.not_fraza[a] &&
                  szukarka.fraza &&
                  szukarka.fraza[a] &&
                  null != szukarka.fraza[a] &&
                  "" !== szukarka.fraza[a] &&
                  (n.includes(szukarka.fraza[a]) || n.push(szukarka.fraza[a]));
              }),
                0 !== r.length &&
                  (this.wydzialy.includes("Wszystkie") ||
                    this.wydzialy.includes(s)) &&
                  d >= this.zakresOd &&
                  d <= this.zakresDo &&
                  this.findTextInDoc(i, r, n) &&
                  (this.foundKW.includes(o) || this.foundKW.push(o),
                  document.getElementById("wyniki-kw").insertAdjacentHTML(
                    "beforeend",
                    `
                                <div><b>${o}</b> - ${t}</div>
                            `
                  ));
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
  },
  findTextInDoc: function (e, a, t) {
    const r = e.getElementsByTagName("*");
    a = a.filter((e) => !t.includes(e));
    let n = 0,
      l = !1;
    return (
      a.forEach((a) => {
        const t = new RegExp(szukarka.trim(a.toLowerCase(), "/"));
        for (let e = 0; e < r.length; e++)
          if ("/" === a[0] && "/" === a[a.length - 1]) {
            if (t.test(r[e].textContent.toLowerCase())) return void n++;
          } else if (
            -1 !== r[e].textContent.toLowerCase().indexOf(a.toLowerCase())
          )
            return void n++;
      }),
      t.forEach((a) => {
        if (!l) {
          const t = new RegExp(szukarka.trim(a.toLowerCase(), "/"));
          for (let e = 0; e < r.length; e++)
            if ("/" === a[0] && "/" === a[a.length - 1]) {
              if (t.test(r[e].textContent.toLowerCase())) return void (l = !0);
            } else if (
              -1 !== r[e].textContent.toLowerCase().indexOf(a.toLowerCase())
            )
              return void (l = !0);
        }
      }),
      a.length === n && !l
    );
  },
  verifyForm: async function () {
    let t = !1;
    const e = document.querySelectorAll("input[name^='fraza[']"),
      a = document.querySelectorAll("div[id^='error-fraza-']"),
      r = document.querySelectorAll("input[name^='dzialy[']"),
      n = document.querySelectorAll("div[id^='error-dzialy-']");
    var l = parseInt(document.getElementById("zakres-od").value),
      s = parseInt(document.getElementById("zakres-do").value);
    const d = document.getElementById("error-zakres");
    var o = document.getElementById("input-wszystkie-numery");
    return (
      a.forEach((e) => (e.style.display = "none")),
      n.forEach((e) => (e.style.display = "none")),
      (d.style.display = "none"),
      e.forEach((e, a) => {
        e.value.length <= 1 &&
          (e = document.querySelector("#error-fraza-" + a)) &&
          (this.showError(e, "Fraza musi zawierać co najmniej 2 znaki"),
          (t = !0));
      }),
      r.forEach((e, a) => {
        0 ===
          document.querySelectorAll("input[name^='dzialy[" + a + "]']:checked")
            .length &&
          (a = document.querySelector("#error-dzialy-" + a)) &&
          (this.showError(a, "Wybierz co najmniej 1 dział"), (t = !0));
      }),
      o.checked ||
        ((s < l || l < 1 || s < 1 || isNaN(l) || isNaN(s)) &&
          (this.showError(d, "Błędny zakres numerów"), (t = !0))),
      !1 === t
    );
  },
  showError: function (e, a) {
    (e.style.display = "block"), (e.querySelector("span").innerText = a);
  },
  addListenerForFrazy: function () {
    document.querySelectorAll("input[name^='fraza[']").forEach((e) => {
      e.addEventListener("input", function () {
        let t = [];
        document.querySelectorAll("input[name^='fraza[']").forEach((e, a) => {
          "" === e.value ? (t[a] = null) : (t[a] = e.value);
        }),
          chrome.storage.local.set({ s_fraza: t }, function () {});
      });
    }),
      document.querySelectorAll("input[name^='not_fraza[']").forEach((e) => {
        e.addEventListener("change", function () {
          let t = [];
          document
            .querySelectorAll("input[name^='not_fraza[']")
            .forEach((e, a) => {
              t[a] = e.checked;
            }),
            chrome.storage.local.set({ s_not_fraza: t }, function () {});
        });
      }),
      document.querySelectorAll("input[name^='dzialy[']").forEach((r) => {
        r.addEventListener("change", function () {
          chrome.storage.local.get(null, function (e) {
            var a = parseInt(
              r
                .getAttribute("name")
                .replaceAll("[", "")
                .replaceAll("]", "")
                .replace("dzialy", "")
            );
            let t = [];
            e.s_dzialy &&
              e.s_dzialy[a] &&
              Array.isArray(e.s_dzialy) &&
              (t = e.s_dzialy[a]),
              Array.isArray(e.s_dzialy) || (e.s_dzialy = []),
              r.checked
                ? t.includes(r.value) || t.push(r.value)
                : (t = t.filter((e) => e !== r.value)),
              (e.s_dzialy[a] = t),
              chrome.storage.local.set(
                { s_dzialy: e.s_dzialy },
                function () {}
              );
          });
        });
      }),
      document.querySelectorAll(".usun-fraze-btn").forEach((a) => {
        a.addEventListener("click", function () {
          const l = parseInt(a.parentElement.id.replace("frazy-wydzialy-", ""));
          chrome.storage.local.get(null, async function (e) {
            let t = [],
              r = [],
              n = [];
            e.s_fraza &&
              Array.isArray(e.s_fraza) &&
              e.s_fraza.forEach((e, a) => {
                a !== l && (t[a] = e);
              }),
              e.s_not_fraza &&
                Array.isArray(e.s_not_fraza) &&
                e.s_not_fraza.forEach((e, a) => {
                  a !== l && (n[a] = e);
                }),
              e.s_dzialy &&
                Array.isArray(e.s_dzialy) &&
                e.s_dzialy.forEach((e, a) => {
                  a !== l && (r[a] = e);
                }),
              chrome.storage.local.set({ s_fraza: t }, function () {}),
              chrome.storage.local.set({ s_not_fraza: n }, function () {}),
              chrome.storage.local.set({ s_dzialy: r }, function () {}),
              a.parentElement.remove();
          });
        });
      });
  },
  addListeners: function () {
    document
      .getElementById("szukaj-form")
      .addEventListener("submit", function (e) {
        return e.preventDefault(), !1;
      }),
      document
        .getElementById("btn-szukaj")
        .addEventListener("click", function () {
          szukarka.szukaj();
        }),
      document
        .getElementById("btn-zatrzymaj")
        .addEventListener("click", function () {
          szukarka.stopSearchActions();
        }),
      document
        .getElementById("export-txt")
        .addEventListener("click", function () {
          szukarka.downloadStrAsTextFile(szukarka.foundKW.join("\r\n"));
        }),
      document
        .getElementById("kopiuj-wynik")
        .addEventListener("click", async function () {
          try {
            await navigator.clipboard.writeText(szukarka.foundKW.join("\r\n"));
          } catch (e) {
            console.error("Failed to copy text: ", e);
          }
        }),
      (this.dzialy[0] = []);
    const e = document.querySelectorAll("input[name^='dzialy[']:checked");
    e.forEach((e) => {
      var a = parseInt(
        e
          .getAttribute("name")
          .replaceAll("[", "")
          .replaceAll("]", "")
          .replace("dzialy", "")
      );
      (this.dzialy[a] && Array.isArray(this.dzialy[a])) ||
        (this.dzialy[a] = []),
        this.dzialy[a].push(e.value);
    }),
      szukarka.addListenerForFrazy(),
      document
        .getElementById("btn-dodaj-wydzial")
        .addEventListener("click", function () {
          szukarka.addWydzialLabel();
        }),
      szukarka.refreshWydzialyListeners(),
      document
        .getElementById("zakres-od")
        .addEventListener("input", function () {
          chrome.storage.local.set(
            { s_zakres_od: document.getElementById("zakres-od").value },
            function () {}
          );
        }),
      document
        .getElementById("zakres-do")
        .addEventListener("input", function () {
          chrome.storage.local.set(
            { s_zakres_do: document.getElementById("zakres-do").value },
            function () {}
          );
        }),
      document
        .getElementById("input-wszystkie-numery")
        .addEventListener("change", function () {
          document.getElementById("input-wszystkie-numery").checked
            ? ((document.getElementById("zakres-od").disabled = !0),
              (document.getElementById("zakres-do").disabled = !0),
              chrome.storage.local.set(
                { s_wszystkie_numery: !0 },
                function () {}
              ))
            : ((document.getElementById("zakres-od").disabled = !1),
              (document.getElementById("zakres-do").disabled = !1),
              chrome.storage.local.set(
                { s_wszystkie_numery: !1 },
                function () {}
              ));
        }),
      document
        .getElementById("dodaj-fraze-btn")
        .addEventListener("click", function () {
          szukarka.dodajFrazeBtnClick();
        });
  },
  dodajFrazeBtnClick: async function (a = null) {
    let t = a;
    null === a &&
      (t =
        parseInt(
          document
            .querySelector("div[id^='frazy-wydzialy-']:last-of-type")
            .id.replaceAll("frazy-wydzialy-", "")
        ) + 1),
      document.getElementById("frazy-wydzialy").insertAdjacentHTML(
        "beforeend",
        `
            <div class="frazy-wydzialy" id="frazy-wydzialy-` +
          t +
          `">
                <div style="display: flex">
                    <label class="form-label" for="fraza` +
          t +
          `" style="padding-right: 8px">Fraza do wyszukania:</label>
                    <input type="text" name="fraza[` +
          t +
          ']" id="fraza' +
          t +
          `" value="">
                    <label>
                        <input type="checkbox" name="not_fraza[` +
          t +
          ']" id="not_fraza' +
          t +
          `">Nie zawiera
                    </label>
                </div>

                <div class="error" id="error-fraza-` +
          t +
          `" style="display: none">
                    <label class="form-label"></label>
                    <span></span>
                </div>

                <div>
                    <label class="form-label">Działy:</label>
                    <label>
                        <input type="checkbox" name="dzialy[` +
          t +
          `][]" value="I-O" checked> I-O
                    </label>
                    <label>
                        <input type="checkbox" name="dzialy[` +
          t +
          `][]" value="I-Sp" checked> I-Sp
                    </label>
                    <label>
                        <input type="checkbox" name="dzialy[` +
          t +
          `][]" value="II" checked> II
                    </label>
                    <label>
                        <input type="checkbox" name="dzialy[` +
          t +
          `][]" value="III" checked> III
                    </label>
                    <label>
                        <input type="checkbox" name="dzialy[` +
          t +
          `][]" value="IV" checked> IV
                    </label>
                </div>

                <div class="error" id="error-dzialy-` +
          t +
          `" style="display: none">
                    <label class="form-label"></label>
                    <span></span>
                </div>
                
                <button class="dodaj-fraze-btn usun-fraze-btn" style="color: red" type="button">Usuń</button>
            </div>`
      ),
      chrome.storage.local.get(null, async function (e) {
        null == a &&
          ((e.s_dzialy[t] = ["I-O", "I-Sp", "II", "III", "IV"]),
          await chrome.storage.local.set(
            { s_dzialy: e.s_dzialy },
            function () {}
          )),
          szukarka.addListenerForFrazy();
      });
  },
  refreshWydzialyListeners: function () {
    document.querySelectorAll("span[id^='wydzial-']").forEach((a) => {
      a.addEventListener("click", function () {
        a.parentElement.remove(),
          chrome.storage.local.get(null, function (e) {
            e.s_wydzialy &&
              Array.isArray(e.s_wydzialy) &&
              0 < e.s_wydzialy.length &&
              ((e.s_wydzialy = e.s_wydzialy.filter(
                (e) => e !== a.parentElement.getAttribute("data-kod")
              )),
              0 === e.s_wydzialy.length &&
                (e.s_wydzialy.push("Wszystkie"),
                0 ===
                  document.getElementById("wydzialy-labels").children.length &&
                  document.getElementById("wydzialy-labels").insertAdjacentHTML(
                    "beforeend",
                    `
                                <div class="wydzial-label" data-kod="Wszystkie">Wszystkie</div>`
                  )),
              chrome.storage.local.set(
                { s_wydzialy: e.s_wydzialy },
                function () {}
              ));
          });
      });
    });
  },
  getSettings: function () {
    chrome.storage.local.get(null, function (e) {
      let t = [];
      e.s_fraza &&
        Array.isArray(e.s_fraza) &&
        e.s_fraza.forEach((e, a) => {
          null === e || t.includes(a) || 0 === a || t.push(a);
        }),
        t.sort(),
        t.forEach(async (e) => {
          await szukarka.dodajFrazeBtnClick(e);
        }),
        e.s_fraza &&
          Array.isArray(e.s_fraza) &&
          e.s_fraza.forEach((e, a) => {
            null !== e && (document.getElementById("fraza" + a).value = e);
          }),
        e.s_not_fraza &&
          Array.isArray(e.s_not_fraza) &&
          e.s_not_fraza.forEach((e, a) => {
            if (!0 === e) {
              const t = document.querySelector("#not_fraza" + a);
              t && (t.checked = !0);
            }
          }),
        e.s_dzialy && e.s_dzialy[0] && Array.isArray(e.s_dzialy[0])
          ? (document
              .querySelectorAll("input[name^='dzialy[']")
              .forEach((e) => {
                e.checked = !1;
              }),
            e.s_dzialy.forEach((e, t) => {
              null != e &&
                e.forEach((e) => {
                  let a = document.querySelector(
                    "input[name='dzialy[" + t + "][]'][value='" + e + "']"
                  );
                  a && (a.checked = !0);
                });
            }))
          : (chrome.storage.local.set(
              { s_dzialy: [["I-O", "I-Sp", "II", "III", "IV"]] },
              function () {}
            ),
            document.querySelectorAll("input[name^='dzialy[']").forEach((e) => {
              e.checked = !0;
            })),
        e.s_wydzialy && Array.isArray(e.s_wydzialy) && 0 !== e.s_wydzialy.length
          ? (e.s_wydzialy.forEach((e) => {
              var a;
              "Wszystkie" === e
                ? document.getElementById("wydzialy-labels").insertAdjacentHTML(
                    "beforeend",
                    `
                        <div class="wydzial-label" data-kod="Wszystkie">Wszystkie</div>`
                  )
                : (a = document.querySelector(
                    "#kody-wydzialow > option[value='" + e + "']"
                  )) &&
                  document.getElementById("wydzialy-labels").insertAdjacentHTML(
                    "beforeend",
                    `
                        <div class="wydzial-label" data-kod="${e}">${a.label} <span id="wydzial-${e}">[X]</span></div>`
                  );
            }),
            szukarka.refreshWydzialyListeners())
          : chrome.storage.local.set(
              { s_wydzialy: ["Wszystkie"] },
              function () {
                0 ===
                  document.getElementById("wydzialy-labels").children.length &&
                  document.getElementById("wydzialy-labels").insertAdjacentHTML(
                    "beforeend",
                    `
                                <div class="wydzial-label" data-kod="Wszystkie">Wszystkie</div>`
                  ),
                  szukarka.refreshWydzialyListeners();
              }
            ),
        e.s_zakres_od
          ? (document.getElementById("zakres-od").value = e.s_zakres_od)
          : (document.getElementById("zakres-od").value = 1),
        e.s_zakres_do
          ? (document.getElementById("zakres-do").value = e.s_zakres_do)
          : (document.getElementById("zakres-do").value = ""),
        chrome.storage.local.set(
          { s_zakres_od: document.getElementById("zakres-od").value },
          function () {}
        ),
        chrome.storage.local.set(
          { s_zakres_do: document.getElementById("zakres-do").value },
          function () {}
        ),
        e.s_wszystkie_numery || void 0 === e.s_wszystkie_numery
          ? ((document.getElementById("zakres-od").disabled = !0),
            (document.getElementById("zakres-do").disabled = !0),
            (document.getElementById("input-wszystkie-numery").checked = !0))
          : ((document.getElementById("zakres-od").disabled = !1),
            (document.getElementById("zakres-do").disabled = !1),
            (document.getElementById("input-wszystkie-numery").checked = !1)),
        chrome.storage.local.set(
          {
            s_wszystkie_numery: document.getElementById(
              "input-wszystkie-numery"
            ).checked,
          },
          function () {}
        );
    });
  },
  addWydzialLabel: function () {
    const t = document.getElementById("kod-wydzialu").value,
      r = document.querySelector("#kody-wydzialow > option[value='" + t + "']");
    r &&
      chrome.storage.local.get(null, function (e) {
        var a;
        e.s_wydzialy && Array.isArray(e.s_wydzialy) && 0 !== e.s_wydzialy.length
          ? e.s_wydzialy.includes(t) ||
            ((e.s_wydzialy = e.s_wydzialy.filter((e) => "Wszystkie" !== e)),
            "Wszystkie" === t
              ? ((e.s_wydzialy = []),
                (document.getElementById("wydzialy-labels").innerHTML = ""))
              : document.querySelectorAll(".wydzial-label").forEach((e) => {
                  -1 !== e.innerHTML.indexOf("Wszystkie") && e.remove();
                }),
            e.s_wydzialy.push(t),
            (document.getElementById("kod-wydzialu").value = ""),
            (a = "Wszystkie" === t ? "Wszystkie" : r.label),
            document.getElementById("wydzialy-labels").insertAdjacentHTML(
              "beforeend",
              `
                        <div class="wydzial-label" data-kod="${t}">` +
                a +
                ("Wszystkie" === a
                  ? ""
                  : ' <span id="wydzial-${kod}">[X]</span>') +
                `</div>
                    `
            ),
            chrome.storage.local.set({ s_wydzialy: e.s_wydzialy }, function () {
              szukarka.refreshWydzialyListeners();
            }))
          : chrome.storage.local.set({ s_wydzialy: [t] }, function () {
              szukarka.refreshWydzialyListeners();
            });
      });
  },
  downloadStrAsTextFile: (e) => {
    const a = document.createElement("a");
    e = new Blob([e], { type: "text/plain" });
    (a.href = URL.createObjectURL(e)),
      (a.download = "lista_kw.txt"),
      a.click(),
      URL.revokeObjectURL(a.href);
  },
  trim: (e, a) => {
    let t = 0,
      r = e.length;
    for (; t < r && e[t] === a; ) ++t;
    for (; r > t && e[r - 1] === a; ) --r;
    return 0 < t || r < e.length ? e.substring(t, r) : e;
  },
};
function doReady() {
  szukarka.getSettings(), szukarka.addListeners();
}
"complete" === document.readyState ||
("loading" !== document.readyState && !document.documentElement.doScroll)
  ? doReady()
  : document.addEventListener("DOMContentLoaded", doReady);
