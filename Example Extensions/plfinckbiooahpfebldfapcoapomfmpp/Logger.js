function log(e) {
  0 == arguments.length ? Logger.print("") : Logger.print(e);
}
let Logger = (function () {
  "use strict";
  let i = null,
    n = null,
    d = null,
    o = null,
    e = !0,
    r = !1,
    t = !0,
    l = !1,
    s = 215,
    a = 0,
    u = 200;
  function c() {
    let e = new Date(),
      t = "0" + e.getHours(),
      n = ((t = t.substring(t.length - 2)), "0" + e.getMinutes()),
      o = ((n = n.substring(n.length - 2)), "0" + e.getSeconds());
    return (o = o.substring(o.length - 2)), t + ":" + n + ":" + o;
  }
  function p() {
    let t =
      window.requestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.webkitRequestAnimationFrame;
    return t
      ? function (e) {
          return t(e);
        }
      : function (e) {
          return setTimeout(e, 16);
        };
  }
  return {
    init: function () {
      if (!i) {
        if (
          !(
            document &&
            document.createElement &&
            document.body &&
            document.body.appendChild
          )
        )
          return !1;
        var t = "loggerContainer";
        if (!(i = document.getElementById(t))) {
          ((i = document.createElement("div")).id = t),
            i.setAttribute(
              "style",
              "width:100%;margin:0;padding:0;text-align:left;box-sizing:border-box;position:fixed;left:0;z-index:9999;bottom:-215px;"
            ),
            ((n = document.createElement("div")).id = "loggerTab"),
            n.appendChild(document.createTextNode("LOG")),
            n.setAttribute(
              "style",
              "width:40px;box-sizing:border-box;overflow:hidden;font:bold 10px verdana,helvetica,sans-serif;line-height:19px;color:#fff;position:absolute;left:20px;top:-20px;margin:0; padding:0;text-align:center;border:1px solid #aaa;border-bottom:none;background:rgba(0,0,0,0.8);border-top-right-radius:8px;border-top-left-radius:8px;"
            ),
            ((o = document.createElement("div")).id = "fullscreen"),
            o.appendChild(document.createTextNode("↑")),
            o.setAttribute(
              "style",
              "width:40px;box-sizing:border-box;overflow:hidden;font:bold 10px verdana,helvetica,sans-serif;line-height:19px;color:#fff;position:absolute;right:1px;top:-20px;margin:0; padding:0;text-align:center;border:1px solid #aaa;border-bottom:none;background:rgba(0,0,0,0.8);border-top-right-radius:8px;border-top-left-radius:8px;"
            ),
            (n.onmouseover = function () {
              (this.style.cursor = "pointer"),
                (this.style.textShadow =
                  "0 0 1px #fff, 0 0 2px #0f0, 0 0 6px #0f0");
            }),
            (n.onmouseout = function () {
              (this.style.cursor = "auto"), (this.style.textShadow = "none");
            }),
            (n.onclick = function () {
              Logger.toggle(), (this.style.textShadow = "none");
            }),
            (o.onclick = function () {
              Logger.fsToggle();
            }),
            (o.onmouseover = function () {
              (this.style.cursor = "pointer"),
                (this.style.textShadow =
                  "0 0 1px #fff, 0 0 2px #0f0, 0 0 6px #0f0");
            }),
            ((d = document.createElement("div")).id = "logger"),
            d.setAttribute(
              "style",
              "font:12px monospace;height: 215px;box-sizing:border-box;color:#fff;overflow-x:hidden;overflow-y:auto;visibility:hidden;position:relative;bottom:0px;margin:0px;padding:5px;background:rgba(0,0,0,0.8);border-top:1px solid #aaa;"
            );
          let e = document.createElement("span");
          (e.style.color = "#afa"), (e.style.fontWeight = "bold");
          t =
            "===== Rozpoczęto pobieranie o " +
            (function () {
              let e = new Date();
              var t = "" + e.getFullYear();
              let n = "0" + (e.getMonth() + 1),
                o = ((n = n.substring(n.length - 2)), "0" + e.getDate());
              return (o = o.substring(o.length - 2)), t + "-" + n + "-" + o;
            })() +
            " " +
            c() +
            " =====";
          e.appendChild(document.createTextNode(t)),
            d.appendChild(e),
            d.appendChild(document.createElement("br")),
            d.appendChild(document.createElement("br")),
            i.appendChild(n),
            i.appendChild(o),
            i.appendChild(d),
            document.body.appendChild(i);
        }
      }
      return !0;
    },
    print: function (e) {
      if (t) {
        if (!i) if (!this.init()) return;
        let r = !0,
          l =
            (void 0 === e
              ? ((e = "undefined"), (r = !1))
              : "function" == typeof e
              ? ((e = "function"), (r = !1))
              : null === e
              ? ((e = "null"), (r = !1))
              : e instanceof Array
              ? (e = this.arrayToString(e))
              : e instanceof Object
              ? (e = e.toString())
              : (e += ""),
            e.split(/\r\n|\r|\n/));
        for (let i = 0, e = l.length; i < e; ++i) {
          let e = document.createElement("div");
          e.setAttribute("class", "timeDiv"),
            e.setAttribute("style", "color:#999;float:left;");
          var s = document.createTextNode(c() + " ");
          e.appendChild(s);
          let t = document.createElement("div");
          t.setAttribute("class", "msgDiv"),
            t.setAttribute("style", "word-wrap:break-word;margin-left:6.0em;"),
            r || (t.style.color = "#afa");
          (s = l[i].replace(/ /g, " ")), (s = document.createTextNode(s));
          t.appendChild(s);
          let n = document.createElement("div"),
            o =
              (n.setAttribute("class", "newLineDiv"),
              n.setAttribute("style", "clear:both;"),
              d.appendChild(e),
              d.appendChild(t),
              d.appendChild(n),
              document.getElementsByClassName("timeDiv"));
          1e4 < o.length &&
            (o[0].remove(),
            document.getElementsByClassName("msgDiv")[0].remove(),
            document.getElementsByClassName("newLineDiv")[0].remove()),
            (d.scrollTop = d.scrollHeight);
        }
      }
    },
    fsToggle: function () {
      l ? this.fsClose() : this.fsOpen();
    },
    fsOpen: function () {
      this.open(),
        (l = !0),
        (d.style.height = "calc(100vh - 20px)"),
        (o.innerText = "↓");
    },
    fsClose: function () {
      (l = !1), (d.style.height = s + "px"), (o.innerText = "↑");
    },
    toggle: function () {
      r ? this.close() : this.open();
    },
    open: function () {
      if (this.init() && e && !r) {
        (d.style.visibility = "visible"), (a = Date.now());
        let o = p();
        o(function e() {
          let t = Date.now() - a;
          if (t >= u) return (i.style.bottom = 0), void (r = !0);
          let n = Math.round(
            -s * (1 - 0.5 * (1 - Math.cos((Math.PI * t) / u)))
          );
          i.style.bottom = n + "px";
          o(e);
        });
      }
    },
    close: function () {
      if (this.init() && e && r) {
        l && this.fsClose(), (a = Date.now());
        let o = p();
        o(function e() {
          let t = Date.now() - a;
          if (t >= u)
            return (
              (i.style.bottom = -s + "px"),
              (d.style.visibility = "hidden"),
              void (r = !1)
            );
          let n = Math.round(0.5 * -s * (1 - Math.cos((Math.PI * t) / u)));
          i.style.bottom = n + "px";
          o(e);
        });
      }
    },
    show: function () {
      this.init() && ((i.style.display = "block"), (e = !0));
    },
    hide: function () {
      this.init() && ((i.style.display = "none"), (e = !1));
    },
    enable: function () {
      this.init() &&
        ((t = !0), (n.style.color = "#fff"), (d.style.color = "#fff"));
    },
    disable: function () {
      this.init() &&
        ((t = !1), (n.style.color = "#666"), (d.style.color = "#666"));
    },
    clear: function () {
      this.init() && (d.innerHTML = "");
    },
    arrayToString: function (n) {
      let o = "[";
      for (let e = 0, t = n.length; e < t; ++e)
        n[e] instanceof Array ? (o += this.arrayToString(n[e])) : (o += n[e]),
          e < t - 1 && (o += ", ");
      return (o += "]");
    },
  };
})();
