!(function (n) {
  var o = {};
  function r(t) {
    var e;
    return (
      o[t] ||
      ((e = o[t] = { i: t, l: !1, exports: {} }),
      n[t].call(e.exports, e, e.exports, r),
      (e.l = !0),
      e)
    ).exports;
  }
  (r.m = n),
    (r.c = o),
    (r.d = function (t, e, n) {
      r.o(t, e) || Object.defineProperty(t, e, { enumerable: !0, get: n });
    }),
    (r.r = function (t) {
      "undefined" != typeof Symbol &&
        Symbol.toStringTag &&
        Object.defineProperty(t, Symbol.toStringTag, { value: "Module" }),
        Object.defineProperty(t, "__esModule", { value: !0 });
    }),
    (r.t = function (e, t) {
      if ((1 & t && (e = r(e)), 8 & t)) return e;
      if (4 & t && "object" == typeof e && e && e.__esModule) return e;
      var n = Object.create(null);
      if (
        (r.r(n),
        Object.defineProperty(n, "default", { enumerable: !0, value: e }),
        2 & t && "string" != typeof e)
      )
        for (var o in e)
          r.d(
            n,
            o,
            function (t) {
              return e[t];
            }.bind(null, o)
          );
      return n;
    }),
    (r.n = function (t) {
      var e =
        t && t.__esModule
          ? function () {
              return t.default;
            }
          : function () {
              return t;
            };
      return r.d(e, "a", e), e;
    }),
    (r.o = function (t, e) {
      return Object.prototype.hasOwnProperty.call(t, e);
    }),
    (r.p = ""),
    r((r.s = 0));
})([
  function (t, e) {
    function n(t) {
      function e(e, t) {
        t.forEach(function (t) {
          return (g[t] = (e | g.v) == g.v ? e : 0);
        });
      }
      var l,
        r,
        n,
        o,
        i,
        g = JSON.parse(t),
        t = g.g.substr(2, 5),
        a = g.g.substr(7);
      window[t] ? (g = Object.assign(window[t], g)) : (window[t] = g),
        e(1, [
          "toDataURL",
          "toBlob",
          "getImageData",
          "getLineDash",
          "measureText",
        ]),
        e(2, ["readPixels", "bufferData", "getParameter"]),
        e(4, ["getChannelData", "getFloatFrequencyData"]),
        e(8, ["offsetWidth", "offsetHeight"]),
        e(16, [
          "getBattery",
          "getGamepads",
          "getVRDisplays",
          "screen",
          "plugins",
          "mimeTypes",
          "platform",
          "language",
          "languages",
        ]),
        e(32, [
          "enumerateDevices",
          "MediaStreamTrack",
          "RTCPeerConnection",
          "RTCSessionDescription",
          "webkitMediaStreamTrack",
          "webkitRTCPeerConnection",
          "webkitRTCSessionDescription",
        ]),
        e(64, ["getClientRects"]),
        e(128, ["getTimezoneOffset", "resolvedOptions"]),
        e(256, ["logs"]),
        (g.s = (512 | g.v) == g.v ? Math.random() : parseFloat(g.s)),
        window[a] ||
          ((l = function (t) {
            return Math.floor(g.s * t);
          }),
          (r = function () {
            return (
              g.i % g.c == 0 && ((g.i = 1), g.n.push((g.c = g.n.shift()))),
              g.r % g.c == g.i++ ? 1 : 0
            );
          }),
          Object.assign(g, {
            i: 0,
            c: 7,
            n: [7, 11, 13, 17, 19, 2053],
            r: l(1e6),
          }),
          (n = function (p) {
            var f, e, t;
            return (
              p[a] ||
                ((f = function (o, e) {
                  function n(t, e) {
                    var n = o[t];
                    Object.defineProperty(o, t, {
                      get: function () {
                        return (0 !== g[t] ? e : n).bind(this);
                      },
                    });
                  }
                  var r =
                    2 < arguments.length && void 0 !== arguments[2]
                      ? arguments[2]
                      : function () {
                          return 0;
                        };
                  o &&
                    ("string" == typeof e
                      ? n(e, r)
                      : e instanceof Array
                      ? e.forEach(function (t) {
                          return n(t, r);
                        })
                      : Object.keys(e).forEach(function (t) {
                          return n(t, e[t]);
                        }));
                }),
                (e = function (n, o) {
                  return Object.keys(o).forEach(function (t) {
                    var e = n[t];
                    Object.defineProperty(n, t, {
                      get: function () {
                        return 0 !== g[t] ? o[t] : e;
                      },
                    });
                  });
                }),
                (t = function (t) {
                  try {
                    t(p);
                  } catch (t) {
                    g.debug && console.error(t);
                  }
                })(function (t) {
                  function e(t) {
                    (n = location.host),
                      (o = r.apply(t)),
                      g.logs &&
                        (((e = {})[n] = o),
                        window.dispatchEvent(
                          new CustomEvent(g.g, { detail: e })
                        ));
                    var e,
                      n = t.width,
                      o = t.height;
                    return (
                      Object.assign(c, { width: n, height: o }),
                      u.drawImage(t, 0, 0),
                      (u.fillStyle = "rgba(255,255,255,".concat(g.s, ")")),
                      u.fillRect(0, 0, 0.6, 0.6),
                      c
                    );
                  }
                  var n,
                    o = t.HTMLCanvasElement.prototype,
                    r = o.toDataURL,
                    i = o.toBlob,
                    a = t.CanvasRenderingContext2D.prototype.getImageData,
                    c = p.document.createElement("canvas"),
                    u = c.getContext("2d");
                  function s() {
                    return n.apply(this, arguments);
                  }
                  f(t.HTMLCanvasElement.prototype, {
                    toDataURL: function () {
                      return r.apply(e(this), arguments);
                    },
                    toBlob: function () {
                      return i.apply(e(this), arguments);
                    },
                  }),
                    f(t.CanvasRenderingContext2D.prototype, {
                      getImageData: function () {
                        return e(this.canvas), a.apply(this, arguments);
                      },
                      getLineDash:
                        ((n = function () {
                          return (
                            e(this.canvas), getLineDash.apply(this, arguments)
                          );
                        }),
                        (s.toString = function () {
                          return n.toString();
                        }),
                        s),
                      measureText: function () {
                        return {
                          width: 0.01 * l(21543),
                          __proto__: t.TextMetrics.prototype,
                        };
                      },
                    });
                }),
                t(function (t) {
                  f(t.WebGL2RenderingContext.prototype, {
                    getParameter: function () {
                      return l(8190);
                    },
                    readPixels: function () {},
                    bufferData: function () {},
                  });
                }),
                t(function (t) {
                  f(t.WebGLRenderingContext.prototype, {
                    getParameter: function () {
                      return l(8190);
                    },
                    readPixels: function () {},
                    bufferData: function () {},
                  });
                }),
                t(function (t) {
                  var o = null,
                    r = t.AudioBuffer.prototype.getChannelData;
                  f(t.AudioBuffer.prototype, {
                    getChannelData: function () {
                      var t = r.apply(this, arguments);
                      if (o != t) {
                        o = t;
                        for (var e = 0; e < o.length; e += 88) {
                          var n = l(e);
                          o[n] = (o[n] + g.s) / 2;
                        }
                      }
                      return o;
                    },
                  });
                }),
                t(function (t) {
                  var o = t.AnalyserNode.prototype.getFloatFrequencyData;
                  f(t.AnalyserNode.prototype, {
                    getFloatFrequencyData: function () {
                      for (
                        var t = o.apply(this, arguments), e = 0;
                        e < arguments[0].length;
                        e += 88
                      ) {
                        var n = l(e);
                        arguments[n] = (arguments[n] + g.s) / 2;
                      }
                      return t;
                    },
                  });
                }),
                t(function (t) {
                  var n = t.HTMLElement.prototype,
                    o = {
                      offsetWidth: function () {
                        return (
                          Math.floor(this.getBoundingClientRect().width) + r()
                        );
                      },
                      offsetHeight: function () {
                        return (
                          Math.floor(this.getBoundingClientRect().height) + r()
                        );
                      },
                    };
                  Object.keys(o).forEach(function (t) {
                    var e = n.__lookupGetter__(t);
                    Object.defineProperty(n, t, {
                      get: function () {
                        return (0 !== g[t] ? o[t] : e).apply(this, arguments);
                      },
                    });
                  });
                }),
                t(function (t) {
                  f(t.Element.prototype, "getClientRects", function () {
                    return {
                      0: {
                        x: 0,
                        y: 0,
                        top: 0,
                        bottom: l(500),
                        left: 0,
                        right: l(400),
                        height: l(500),
                        width: l(400),
                        __proto__: t.DOMRect.prototype,
                      },
                      length: 1,
                      __proto__: t.DOMRectList.prototype,
                    };
                  });
                }),
                t(function (t) {
                  e(t, {
                    screen: {
                      availLeft: 0,
                      availTop: 0,
                      availWidth: 1024,
                      availHeight: 768,
                      width: 1024,
                      height: 768,
                      colorDepth: 16,
                      pixelDepth: 16,
                      __proto__: t.Screen.prototype,
                      orientation: {
                        angle: 0,
                        type: "landscape-primary",
                        onchange: null,
                        __proto__: t.ScreenOrientation.prototype,
                      },
                    },
                  });
                }),
                t(function (t) {
                  f(t.navigator, [
                    "getBattery",
                    "getGamepads",
                    "getVRDisplays",
                  ]);
                }),
                t(function (t) {
                  e(t.navigator, {
                    plugins: { length: 0, __proto__: t.PluginArray.prototype },
                    mimeTypes: {
                      length: 0,
                      __proto__: t.MimeTypeArray.prototype,
                    },
                    platform: "Win32",
                    language: "en-US",
                    languages: ["en-US"],
                  });
                }),
                t(function (e) {
                  var t = e.navigator.mediaDevices.enumerateDevices;
                  f(e.navigator.mediaDevices, {
                    enumerateDevices: function () {
                      return t.apply(this, arguments).then(function (t) {
                        return (
                          t.push({
                            deviceId: "default",
                            groupId: "n/a",
                            kind: "audiooutput",
                            label: "FPS-Audio " + l(400),
                            __proto__: e.MediaDeviceInfo.prototype,
                          }),
                          t
                        );
                      });
                    },
                  });
                }),
                t(function (t) {
                  f(t, [
                    "MediaStreamTrack",
                    "RTCPeerConnection",
                    "RTCSessionDescription",
                    "webkitMediaStreamTrack",
                    "webkitRTCPeerConnection",
                    "webkitRTCSessionDescription",
                  ]);
                }),
                t(function (t) {
                  f(
                    t.Intl.DateTimeFormat.prototype,
                    "resolvedOptions",
                    function () {
                      return {
                        calendar: "gregory",
                        day: "numeric",
                        locale: "en-US",
                        month: "numeric",
                        numberingSystem: "latn",
                        timeZone: "UTC",
                        year: "numeric",
                      };
                    }
                  );
                }),
                t(function (t) {
                  f(t.Date.prototype, "getTimezoneOffset", function () {
                    return [
                      720, 660, 600, 570, 540, 480, 420, 360, 300, 240, 210,
                      180, 120, 60, 0, -60, -120, -180, -210, -240, -270, -300,
                      -330, -345, -360, -390, -420, -480, -510, -525, -540,
                      -570, -600, -630, -660, -720, -765, -780, -840,
                    ][l(39)];
                  });
                }),
                (p[a] = !0)),
              p
            );
          })(window),
          (o = HTMLIFrameElement.prototype.__lookupGetter__("contentWindow")),
          (i = HTMLIFrameElement.prototype.__lookupGetter__("contentDocument")),
          Object.defineProperties(HTMLIFrameElement.prototype, {
            contentWindow: {
              get: function () {
                var t = o.apply(this, arguments);
                return this.src &&
                  -1 != this.src.indexOf("//") &&
                  location.host != this.src.split("/")[2]
                  ? t
                  : n(t);
              },
            },
            contentDocument: {
              get: function () {
                return (
                  (this.src &&
                    -1 != this.src.indexOf("//") &&
                    location.host != this.src.split("/")[2]) ||
                    n(o.apply(this, arguments)),
                  i.apply(this, arguments)
                );
              },
            },
          }));
    }
    var o, r, i;
    globalThis.chrome && chrome.storage
      ? ((o = chrome.storage.sync),
        (r = function (t) {
          t = t.detail;
          return chrome.storage.local.set(t);
        }),
        (i = function (t) {
          return o.get(["v", "s", "g"], async function (t) {
            var e;
            null == t.g
              ? o.set({
                  v: 31,
                  s: ".448398",
                  g: Math.random().toString(36).substr(2),
                })
              : ((e = JSON.stringify(t)),
                (document.createElement("script").text = "("
                  .concat(n, ")('")
                  .concat(e, "')")),
                window.removeEventListener(t.g, r),
                window.addEventListener(t.g, r),
                ((t = document.createElement("script")).src =
                  chrome.runtime.getURL("cts.js")),
                (t.onload = function (t) {
                  return window.dispatchEvent(
                    new CustomEvent("fpsld", { detail: e })
                  );
                }),
                document.documentElement
                  .appendChild(t)
                  .parentNode.removeChild(t));
          });
        })(),
        chrome.storage.onChanged.addListener(function (t) {
          return t.v && i();
        }))
      : window.addEventListener("fpsld", function t(e) {
          e = e.detail;
          n(e), window.removeEventListener("fpsld", t);
        });
  },
]);
