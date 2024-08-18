(() => {
  var rn = Object.create;
  var wt = Object.defineProperty;
  var ln = Object.getOwnPropertyDescriptor;
  var cn = Object.getOwnPropertyNames;
  var dn = Object.getPrototypeOf,
    un = Object.prototype.hasOwnProperty;
  var hn = (a, t, e) =>
    t in a
      ? wt(a, t, { enumerable: !0, configurable: !0, writable: !0, value: e })
      : (a[t] = e);
  var mn = (a, t) => () => (
      t || a((t = { exports: {} }).exports, t), t.exports
    ),
    ne = (a, t) => {
      for (var e in t) wt(a, e, { get: t[e], enumerable: !0 });
    },
    fn = (a, t, e, i) => {
      if ((t && typeof t == "object") || typeof t == "function")
        for (let n of cn(t))
          !un.call(a, n) &&
            n !== e &&
            wt(a, n, {
              get: () => t[n],
              enumerable: !(i = ln(t, n)) || i.enumerable,
            });
      return a;
    };
  var pn = (a, t, e) => (
    (e = a != null ? rn(dn(a)) : {}),
    fn(
      t || !a || !a.__esModule
        ? wt(e, "default", { value: a, enumerable: !0 })
        : e,
      a
    )
  );
  var se = (a, t, e) => (hn(a, typeof t != "symbol" ? t + "" : t, e), e);
  var tn = mn((ie) => {
    (function () {
      "use strict";
      var a = function () {
        this.init();
      };
      a.prototype = {
        init: function () {
          var s = this || t;
          return (
            (s._counter = 1e3),
            (s._html5AudioPool = []),
            (s.html5PoolSize = 10),
            (s._codecs = {}),
            (s._howls = []),
            (s._muted = !1),
            (s._volume = 1),
            (s._canPlayEvent = "canplaythrough"),
            (s._navigator =
              typeof window < "u" && window.navigator
                ? window.navigator
                : null),
            (s.masterGain = null),
            (s.noAudio = !1),
            (s.usingWebAudio = !0),
            (s.autoSuspend = !0),
            (s.ctx = null),
            (s.autoUnlock = !0),
            s._setup(),
            s
          );
        },
        volume: function (s) {
          var r = this || t;
          if (
            ((s = parseFloat(s)),
            r.ctx || m(),
            typeof s < "u" && s >= 0 && s <= 1)
          ) {
            if (((r._volume = s), r._muted)) return r;
            r.usingWebAudio &&
              r.masterGain.gain.setValueAtTime(s, t.ctx.currentTime);
            for (var d = 0; d < r._howls.length; d++)
              if (!r._howls[d]._webAudio)
                for (
                  var h = r._howls[d]._getSoundIds(), f = 0;
                  f < h.length;
                  f++
                ) {
                  var b = r._howls[d]._soundById(h[f]);
                  b && b._node && (b._node.volume = b._volume * s);
                }
            return r;
          }
          return r._volume;
        },
        mute: function (s) {
          var r = this || t;
          r.ctx || m(),
            (r._muted = s),
            r.usingWebAudio &&
              r.masterGain.gain.setValueAtTime(
                s ? 0 : r._volume,
                t.ctx.currentTime
              );
          for (var d = 0; d < r._howls.length; d++)
            if (!r._howls[d]._webAudio)
              for (
                var h = r._howls[d]._getSoundIds(), f = 0;
                f < h.length;
                f++
              ) {
                var b = r._howls[d]._soundById(h[f]);
                b && b._node && (b._node.muted = s ? !0 : b._muted);
              }
          return r;
        },
        stop: function () {
          for (var s = this || t, r = 0; r < s._howls.length; r++)
            s._howls[r].stop();
          return s;
        },
        unload: function () {
          for (var s = this || t, r = s._howls.length - 1; r >= 0; r--)
            s._howls[r].unload();
          return (
            s.usingWebAudio &&
              s.ctx &&
              typeof s.ctx.close < "u" &&
              (s.ctx.close(), (s.ctx = null), m()),
            s
          );
        },
        codecs: function (s) {
          return (this || t)._codecs[s.replace(/^x-/, "")];
        },
        _setup: function () {
          var s = this || t;
          if (
            ((s.state = (s.ctx && s.ctx.state) || "suspended"),
            s._autoSuspend(),
            !s.usingWebAudio)
          )
            if (typeof Audio < "u")
              try {
                var r = new Audio();
                typeof r.oncanplaythrough > "u" &&
                  (s._canPlayEvent = "canplay");
              } catch {
                s.noAudio = !0;
              }
            else s.noAudio = !0;
          try {
            var r = new Audio();
            r.muted && (s.noAudio = !0);
          } catch {}
          return s.noAudio || s._setupCodecs(), s;
        },
        _setupCodecs: function () {
          var s = this || t,
            r = null;
          try {
            r = typeof Audio < "u" ? new Audio() : null;
          } catch {
            return s;
          }
          if (!r || typeof r.canPlayType != "function") return s;
          var d = r.canPlayType("audio/mpeg;").replace(/^no$/, ""),
            h = s._navigator ? s._navigator.userAgent : "",
            f = h.match(/OPR\/(\d+)/g),
            b = f && parseInt(f[0].split("/")[1], 10) < 33,
            p = h.indexOf("Safari") !== -1 && h.indexOf("Chrome") === -1,
            g = h.match(/Version\/(.*?) /),
            Q = p && g && parseInt(g[1], 10) < 15;
          return (
            (s._codecs = {
              mp3: !!(
                !b &&
                (d || r.canPlayType("audio/mp3;").replace(/^no$/, ""))
              ),
              mpeg: !!d,
              opus: !!r
                .canPlayType('audio/ogg; codecs="opus"')
                .replace(/^no$/, ""),
              ogg: !!r
                .canPlayType('audio/ogg; codecs="vorbis"')
                .replace(/^no$/, ""),
              oga: !!r
                .canPlayType('audio/ogg; codecs="vorbis"')
                .replace(/^no$/, ""),
              wav: !!(
                r.canPlayType('audio/wav; codecs="1"') ||
                r.canPlayType("audio/wav")
              ).replace(/^no$/, ""),
              aac: !!r.canPlayType("audio/aac;").replace(/^no$/, ""),
              caf: !!r.canPlayType("audio/x-caf;").replace(/^no$/, ""),
              m4a: !!(
                r.canPlayType("audio/x-m4a;") ||
                r.canPlayType("audio/m4a;") ||
                r.canPlayType("audio/aac;")
              ).replace(/^no$/, ""),
              m4b: !!(
                r.canPlayType("audio/x-m4b;") ||
                r.canPlayType("audio/m4b;") ||
                r.canPlayType("audio/aac;")
              ).replace(/^no$/, ""),
              mp4: !!(
                r.canPlayType("audio/x-mp4;") ||
                r.canPlayType("audio/mp4;") ||
                r.canPlayType("audio/aac;")
              ).replace(/^no$/, ""),
              weba: !!(
                !Q &&
                r.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")
              ),
              webm: !!(
                !Q &&
                r.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")
              ),
              dolby: !!r
                .canPlayType('audio/mp4; codecs="ec-3"')
                .replace(/^no$/, ""),
              flac: !!(
                r.canPlayType("audio/x-flac;") || r.canPlayType("audio/flac;")
              ).replace(/^no$/, ""),
            }),
            s
          );
        },
        _unlockAudio: function () {
          var s = this || t;
          if (!(s._audioUnlocked || !s.ctx)) {
            (s._audioUnlocked = !1),
              (s.autoUnlock = !1),
              !s._mobileUnloaded &&
                s.ctx.sampleRate !== 44100 &&
                ((s._mobileUnloaded = !0), s.unload()),
              (s._scratchBuffer = s.ctx.createBuffer(1, 1, 22050));
            var r = function (d) {
              for (; s._html5AudioPool.length < s.html5PoolSize; )
                try {
                  var h = new Audio();
                  (h._unlocked = !0), s._releaseHtml5Audio(h);
                } catch {
                  s.noAudio = !0;
                  break;
                }
              for (var f = 0; f < s._howls.length; f++)
                if (!s._howls[f]._webAudio)
                  for (
                    var b = s._howls[f]._getSoundIds(), p = 0;
                    p < b.length;
                    p++
                  ) {
                    var g = s._howls[f]._soundById(b[p]);
                    g &&
                      g._node &&
                      !g._node._unlocked &&
                      ((g._node._unlocked = !0), g._node.load());
                  }
              s._autoResume();
              var Q = s.ctx.createBufferSource();
              (Q.buffer = s._scratchBuffer),
                Q.connect(s.ctx.destination),
                typeof Q.start > "u" ? Q.noteOn(0) : Q.start(0),
                typeof s.ctx.resume == "function" && s.ctx.resume(),
                (Q.onended = function () {
                  Q.disconnect(0),
                    (s._audioUnlocked = !0),
                    document.removeEventListener("touchstart", r, !0),
                    document.removeEventListener("touchend", r, !0),
                    document.removeEventListener("click", r, !0),
                    document.removeEventListener("keydown", r, !0);
                  for (var y = 0; y < s._howls.length; y++)
                    s._howls[y]._emit("unlock");
                });
            };
            return (
              document.addEventListener("touchstart", r, !0),
              document.addEventListener("touchend", r, !0),
              document.addEventListener("click", r, !0),
              document.addEventListener("keydown", r, !0),
              s
            );
          }
        },
        _obtainHtml5Audio: function () {
          var s = this || t;
          if (s._html5AudioPool.length) return s._html5AudioPool.pop();
          var r = new Audio().play();
          return (
            r &&
              typeof Promise < "u" &&
              (r instanceof Promise || typeof r.then == "function") &&
              r.catch(function () {
                console.warn(
                  "HTML5 Audio pool exhausted, returning potentially locked audio object."
                );
              }),
            new Audio()
          );
        },
        _releaseHtml5Audio: function (s) {
          var r = this || t;
          return s._unlocked && r._html5AudioPool.push(s), r;
        },
        _autoSuspend: function () {
          var s = this;
          if (
            !(
              !s.autoSuspend ||
              !s.ctx ||
              typeof s.ctx.suspend > "u" ||
              !t.usingWebAudio
            )
          ) {
            for (var r = 0; r < s._howls.length; r++)
              if (s._howls[r]._webAudio) {
                for (var d = 0; d < s._howls[r]._sounds.length; d++)
                  if (!s._howls[r]._sounds[d]._paused) return s;
              }
            return (
              s._suspendTimer && clearTimeout(s._suspendTimer),
              (s._suspendTimer = setTimeout(function () {
                if (s.autoSuspend) {
                  (s._suspendTimer = null), (s.state = "suspending");
                  var h = function () {
                    (s.state = "suspended"),
                      s._resumeAfterSuspend &&
                        (delete s._resumeAfterSuspend, s._autoResume());
                  };
                  s.ctx.suspend().then(h, h);
                }
              }, 3e4)),
              s
            );
          }
        },
        _autoResume: function () {
          var s = this;
          if (!(!s.ctx || typeof s.ctx.resume > "u" || !t.usingWebAudio))
            return (
              s.state === "running" &&
              s.ctx.state !== "interrupted" &&
              s._suspendTimer
                ? (clearTimeout(s._suspendTimer), (s._suspendTimer = null))
                : s.state === "suspended" ||
                  (s.state === "running" && s.ctx.state === "interrupted")
                ? (s.ctx.resume().then(function () {
                    s.state = "running";
                    for (var r = 0; r < s._howls.length; r++)
                      s._howls[r]._emit("resume");
                  }),
                  s._suspendTimer &&
                    (clearTimeout(s._suspendTimer), (s._suspendTimer = null)))
                : s.state === "suspending" && (s._resumeAfterSuspend = !0),
              s
            );
        },
      };
      var t = new a(),
        e = function (s) {
          var r = this;
          if (!s.src || s.src.length === 0) {
            console.error(
              "An array of source files must be passed with any new Howl."
            );
            return;
          }
          r.init(s);
        };
      e.prototype = {
        init: function (s) {
          var r = this;
          return (
            t.ctx || m(),
            (r._autoplay = s.autoplay || !1),
            (r._format = typeof s.format != "string" ? s.format : [s.format]),
            (r._html5 = s.html5 || !1),
            (r._muted = s.mute || !1),
            (r._loop = s.loop || !1),
            (r._pool = s.pool || 5),
            (r._preload =
              typeof s.preload == "boolean" || s.preload === "metadata"
                ? s.preload
                : !0),
            (r._rate = s.rate || 1),
            (r._sprite = s.sprite || {}),
            (r._src = typeof s.src != "string" ? s.src : [s.src]),
            (r._volume = s.volume !== void 0 ? s.volume : 1),
            (r._xhr = {
              method: s.xhr && s.xhr.method ? s.xhr.method : "GET",
              headers: s.xhr && s.xhr.headers ? s.xhr.headers : null,
              withCredentials:
                s.xhr && s.xhr.withCredentials ? s.xhr.withCredentials : !1,
            }),
            (r._duration = 0),
            (r._state = "unloaded"),
            (r._sounds = []),
            (r._endTimers = {}),
            (r._queue = []),
            (r._playLock = !1),
            (r._onend = s.onend ? [{ fn: s.onend }] : []),
            (r._onfade = s.onfade ? [{ fn: s.onfade }] : []),
            (r._onload = s.onload ? [{ fn: s.onload }] : []),
            (r._onloaderror = s.onloaderror ? [{ fn: s.onloaderror }] : []),
            (r._onplayerror = s.onplayerror ? [{ fn: s.onplayerror }] : []),
            (r._onpause = s.onpause ? [{ fn: s.onpause }] : []),
            (r._onplay = s.onplay ? [{ fn: s.onplay }] : []),
            (r._onstop = s.onstop ? [{ fn: s.onstop }] : []),
            (r._onmute = s.onmute ? [{ fn: s.onmute }] : []),
            (r._onvolume = s.onvolume ? [{ fn: s.onvolume }] : []),
            (r._onrate = s.onrate ? [{ fn: s.onrate }] : []),
            (r._onseek = s.onseek ? [{ fn: s.onseek }] : []),
            (r._onunlock = s.onunlock ? [{ fn: s.onunlock }] : []),
            (r._onresume = []),
            (r._webAudio = t.usingWebAudio && !r._html5),
            typeof t.ctx < "u" && t.ctx && t.autoUnlock && t._unlockAudio(),
            t._howls.push(r),
            r._autoplay &&
              r._queue.push({
                event: "play",
                action: function () {
                  r.play();
                },
              }),
            r._preload && r._preload !== "none" && r.load(),
            r
          );
        },
        load: function () {
          var s = this,
            r = null;
          if (t.noAudio) {
            s._emit("loaderror", null, "No audio support.");
            return;
          }
          typeof s._src == "string" && (s._src = [s._src]);
          for (var d = 0; d < s._src.length; d++) {
            var h, f;
            if (s._format && s._format[d]) h = s._format[d];
            else {
              if (((f = s._src[d]), typeof f != "string")) {
                s._emit(
                  "loaderror",
                  null,
                  "Non-string found in selected audio sources - ignoring."
                );
                continue;
              }
              (h = /^data:audio\/([^;,]+);/i.exec(f)),
                h || (h = /\.([^.]+)$/.exec(f.split("?", 1)[0])),
                h && (h = h[1].toLowerCase());
            }
            if (
              (h ||
                console.warn(
                  'No file extension was found. Consider using the "format" property or specify an extension.'
                ),
              h && t.codecs(h))
            ) {
              r = s._src[d];
              break;
            }
          }
          if (!r) {
            s._emit(
              "loaderror",
              null,
              "No codec support for selected audio sources."
            );
            return;
          }
          return (
            (s._src = r),
            (s._state = "loading"),
            window.location.protocol === "https:" &&
              r.slice(0, 5) === "http:" &&
              ((s._html5 = !0), (s._webAudio = !1)),
            new i(s),
            s._webAudio && o(s),
            s
          );
        },
        play: function (s, r) {
          var d = this,
            h = null;
          if (typeof s == "number") (h = s), (s = null);
          else {
            if (typeof s == "string" && d._state === "loaded" && !d._sprite[s])
              return null;
            if (typeof s > "u" && ((s = "__default"), !d._playLock)) {
              for (var f = 0, b = 0; b < d._sounds.length; b++)
                d._sounds[b]._paused &&
                  !d._sounds[b]._ended &&
                  (f++, (h = d._sounds[b]._id));
              f === 1 ? (s = null) : (h = null);
            }
          }
          var p = h ? d._soundById(h) : d._inactiveSound();
          if (!p) return null;
          if (
            (h && !s && (s = p._sprite || "__default"), d._state !== "loaded")
          ) {
            (p._sprite = s), (p._ended = !1);
            var g = p._id;
            return (
              d._queue.push({
                event: "play",
                action: function () {
                  d.play(g);
                },
              }),
              g
            );
          }
          if (h && !p._paused) return r || d._loadQueue("play"), p._id;
          d._webAudio && t._autoResume();
          var Q = Math.max(0, p._seek > 0 ? p._seek : d._sprite[s][0] / 1e3),
            y = Math.max(0, (d._sprite[s][0] + d._sprite[s][1]) / 1e3 - Q),
            B = (y * 1e3) / Math.abs(p._rate),
            k = d._sprite[s][0] / 1e3,
            M = (d._sprite[s][0] + d._sprite[s][1]) / 1e3;
          (p._sprite = s), (p._ended = !1);
          var W = function () {
            (p._paused = !1),
              (p._seek = Q),
              (p._start = k),
              (p._stop = M),
              (p._loop = !!(p._loop || d._sprite[s][2]));
          };
          if (Q >= M) {
            d._ended(p);
            return;
          }
          var x = p._node;
          if (d._webAudio) {
            var Bt = function () {
              (d._playLock = !1), W(), d._refreshBuffer(p);
              var C = p._muted || d._muted ? 0 : p._volume;
              x.gain.setValueAtTime(C, t.ctx.currentTime),
                (p._playStart = t.ctx.currentTime),
                typeof x.bufferSource.start > "u"
                  ? p._loop
                    ? x.bufferSource.noteGrainOn(0, Q, 86400)
                    : x.bufferSource.noteGrainOn(0, Q, y)
                  : p._loop
                  ? x.bufferSource.start(0, Q, 86400)
                  : x.bufferSource.start(0, Q, y),
                B !== 1 / 0 &&
                  (d._endTimers[p._id] = setTimeout(d._ended.bind(d, p), B)),
                r ||
                  setTimeout(function () {
                    d._emit("play", p._id), d._loadQueue();
                  }, 0);
            };
            t.state === "running" && t.ctx.state !== "interrupted"
              ? Bt()
              : ((d._playLock = !0),
                d.once("resume", Bt),
                d._clearTimer(p._id));
          } else {
            var xt = function () {
              (x.currentTime = Q),
                (x.muted = p._muted || d._muted || t._muted || x.muted),
                (x.volume = p._volume * t.volume()),
                (x.playbackRate = p._rate);
              try {
                var C = x.play();
                if (
                  (C &&
                  typeof Promise < "u" &&
                  (C instanceof Promise || typeof C.then == "function")
                    ? ((d._playLock = !0),
                      W(),
                      C.then(function () {
                        (d._playLock = !1),
                          (x._unlocked = !0),
                          r ? d._loadQueue() : d._emit("play", p._id);
                      }).catch(function () {
                        (d._playLock = !1),
                          d._emit(
                            "playerror",
                            p._id,
                            "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."
                          ),
                          (p._ended = !0),
                          (p._paused = !0);
                      }))
                    : r || ((d._playLock = !1), W(), d._emit("play", p._id)),
                  (x.playbackRate = p._rate),
                  x.paused)
                ) {
                  d._emit(
                    "playerror",
                    p._id,
                    "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."
                  );
                  return;
                }
                s !== "__default" || p._loop
                  ? (d._endTimers[p._id] = setTimeout(d._ended.bind(d, p), B))
                  : ((d._endTimers[p._id] = function () {
                      d._ended(p),
                        x.removeEventListener("ended", d._endTimers[p._id], !1);
                    }),
                    x.addEventListener("ended", d._endTimers[p._id], !1));
              } catch (T) {
                d._emit("playerror", p._id, T);
              }
            };
            x.src ===
              "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA" &&
              ((x.src = d._src), x.load());
            var Ut =
              (window && window.ejecta) ||
              (!x.readyState && t._navigator.isCocoonJS);
            if (x.readyState >= 3 || Ut) xt();
            else {
              (d._playLock = !0), (d._state = "loading");
              var ht = function () {
                (d._state = "loaded"),
                  xt(),
                  x.removeEventListener(t._canPlayEvent, ht, !1);
              };
              x.addEventListener(t._canPlayEvent, ht, !1), d._clearTimer(p._id);
            }
          }
          return p._id;
        },
        pause: function (s) {
          var r = this;
          if (r._state !== "loaded" || r._playLock)
            return (
              r._queue.push({
                event: "pause",
                action: function () {
                  r.pause(s);
                },
              }),
              r
            );
          for (var d = r._getSoundIds(s), h = 0; h < d.length; h++) {
            r._clearTimer(d[h]);
            var f = r._soundById(d[h]);
            if (
              f &&
              !f._paused &&
              ((f._seek = r.seek(d[h])),
              (f._rateSeek = 0),
              (f._paused = !0),
              r._stopFade(d[h]),
              f._node)
            )
              if (r._webAudio) {
                if (!f._node.bufferSource) continue;
                typeof f._node.bufferSource.stop > "u"
                  ? f._node.bufferSource.noteOff(0)
                  : f._node.bufferSource.stop(0),
                  r._cleanBuffer(f._node);
              } else
                (!isNaN(f._node.duration) || f._node.duration === 1 / 0) &&
                  f._node.pause();
            arguments[1] || r._emit("pause", f ? f._id : null);
          }
          return r;
        },
        stop: function (s, r) {
          var d = this;
          if (d._state !== "loaded" || d._playLock)
            return (
              d._queue.push({
                event: "stop",
                action: function () {
                  d.stop(s);
                },
              }),
              d
            );
          for (var h = d._getSoundIds(s), f = 0; f < h.length; f++) {
            d._clearTimer(h[f]);
            var b = d._soundById(h[f]);
            b &&
              ((b._seek = b._start || 0),
              (b._rateSeek = 0),
              (b._paused = !0),
              (b._ended = !0),
              d._stopFade(h[f]),
              b._node &&
                (d._webAudio
                  ? b._node.bufferSource &&
                    (typeof b._node.bufferSource.stop > "u"
                      ? b._node.bufferSource.noteOff(0)
                      : b._node.bufferSource.stop(0),
                    d._cleanBuffer(b._node))
                  : (!isNaN(b._node.duration) || b._node.duration === 1 / 0) &&
                    ((b._node.currentTime = b._start || 0),
                    b._node.pause(),
                    b._node.duration === 1 / 0 && d._clearSound(b._node))),
              r || d._emit("stop", b._id));
          }
          return d;
        },
        mute: function (s, r) {
          var d = this;
          if (d._state !== "loaded" || d._playLock)
            return (
              d._queue.push({
                event: "mute",
                action: function () {
                  d.mute(s, r);
                },
              }),
              d
            );
          if (typeof r > "u")
            if (typeof s == "boolean") d._muted = s;
            else return d._muted;
          for (var h = d._getSoundIds(r), f = 0; f < h.length; f++) {
            var b = d._soundById(h[f]);
            b &&
              ((b._muted = s),
              b._interval && d._stopFade(b._id),
              d._webAudio && b._node
                ? b._node.gain.setValueAtTime(
                    s ? 0 : b._volume,
                    t.ctx.currentTime
                  )
                : b._node && (b._node.muted = t._muted ? !0 : s),
              d._emit("mute", b._id));
          }
          return d;
        },
        volume: function () {
          var s = this,
            r = arguments,
            d,
            h;
          if (r.length === 0) return s._volume;
          if (r.length === 1 || (r.length === 2 && typeof r[1] > "u")) {
            var f = s._getSoundIds(),
              b = f.indexOf(r[0]);
            b >= 0 ? (h = parseInt(r[0], 10)) : (d = parseFloat(r[0]));
          } else
            r.length >= 2 && ((d = parseFloat(r[0])), (h = parseInt(r[1], 10)));
          var p;
          if (typeof d < "u" && d >= 0 && d <= 1) {
            if (s._state !== "loaded" || s._playLock)
              return (
                s._queue.push({
                  event: "volume",
                  action: function () {
                    s.volume.apply(s, r);
                  },
                }),
                s
              );
            typeof h > "u" && (s._volume = d), (h = s._getSoundIds(h));
            for (var g = 0; g < h.length; g++)
              (p = s._soundById(h[g])),
                p &&
                  ((p._volume = d),
                  r[2] || s._stopFade(h[g]),
                  s._webAudio && p._node && !p._muted
                    ? p._node.gain.setValueAtTime(d, t.ctx.currentTime)
                    : p._node && !p._muted && (p._node.volume = d * t.volume()),
                  s._emit("volume", p._id));
          } else
            return (p = h ? s._soundById(h) : s._sounds[0]), p ? p._volume : 0;
          return s;
        },
        fade: function (s, r, d, h) {
          var f = this;
          if (f._state !== "loaded" || f._playLock)
            return (
              f._queue.push({
                event: "fade",
                action: function () {
                  f.fade(s, r, d, h);
                },
              }),
              f
            );
          (s = Math.min(Math.max(0, parseFloat(s)), 1)),
            (r = Math.min(Math.max(0, parseFloat(r)), 1)),
            (d = parseFloat(d)),
            f.volume(s, h);
          for (var b = f._getSoundIds(h), p = 0; p < b.length; p++) {
            var g = f._soundById(b[p]);
            if (g) {
              if ((h || f._stopFade(b[p]), f._webAudio && !g._muted)) {
                var Q = t.ctx.currentTime,
                  y = Q + d / 1e3;
                (g._volume = s),
                  g._node.gain.setValueAtTime(s, Q),
                  g._node.gain.linearRampToValueAtTime(r, y);
              }
              f._startFadeInterval(g, s, r, d, b[p], typeof h > "u");
            }
          }
          return f;
        },
        _startFadeInterval: function (s, r, d, h, f, b) {
          var p = this,
            g = r,
            Q = d - r,
            y = Math.abs(Q / 0.01),
            B = Math.max(4, y > 0 ? h / y : h),
            k = Date.now();
          (s._fadeTo = d),
            (s._interval = setInterval(function () {
              var M = (Date.now() - k) / h;
              (k = Date.now()),
                (g += Q * M),
                (g = Math.round(g * 100) / 100),
                Q < 0 ? (g = Math.max(d, g)) : (g = Math.min(d, g)),
                p._webAudio ? (s._volume = g) : p.volume(g, s._id, !0),
                b && (p._volume = g),
                ((d < r && g <= d) || (d > r && g >= d)) &&
                  (clearInterval(s._interval),
                  (s._interval = null),
                  (s._fadeTo = null),
                  p.volume(d, s._id),
                  p._emit("fade", s._id));
            }, B));
        },
        _stopFade: function (s) {
          var r = this,
            d = r._soundById(s);
          return (
            d &&
              d._interval &&
              (r._webAudio &&
                d._node.gain.cancelScheduledValues(t.ctx.currentTime),
              clearInterval(d._interval),
              (d._interval = null),
              r.volume(d._fadeTo, s),
              (d._fadeTo = null),
              r._emit("fade", s)),
            r
          );
        },
        loop: function () {
          var s = this,
            r = arguments,
            d,
            h,
            f;
          if (r.length === 0) return s._loop;
          if (r.length === 1)
            if (typeof r[0] == "boolean") (d = r[0]), (s._loop = d);
            else
              return (f = s._soundById(parseInt(r[0], 10))), f ? f._loop : !1;
          else r.length === 2 && ((d = r[0]), (h = parseInt(r[1], 10)));
          for (var b = s._getSoundIds(h), p = 0; p < b.length; p++)
            (f = s._soundById(b[p])),
              f &&
                ((f._loop = d),
                s._webAudio &&
                  f._node &&
                  f._node.bufferSource &&
                  ((f._node.bufferSource.loop = d),
                  d &&
                    ((f._node.bufferSource.loopStart = f._start || 0),
                    (f._node.bufferSource.loopEnd = f._stop),
                    s.playing(b[p]) && (s.pause(b[p], !0), s.play(b[p], !0)))));
          return s;
        },
        rate: function () {
          var s = this,
            r = arguments,
            d,
            h;
          if (r.length === 0) h = s._sounds[0]._id;
          else if (r.length === 1) {
            var f = s._getSoundIds(),
              b = f.indexOf(r[0]);
            b >= 0 ? (h = parseInt(r[0], 10)) : (d = parseFloat(r[0]));
          } else
            r.length === 2 &&
              ((d = parseFloat(r[0])), (h = parseInt(r[1], 10)));
          var p;
          if (typeof d == "number") {
            if (s._state !== "loaded" || s._playLock)
              return (
                s._queue.push({
                  event: "rate",
                  action: function () {
                    s.rate.apply(s, r);
                  },
                }),
                s
              );
            typeof h > "u" && (s._rate = d), (h = s._getSoundIds(h));
            for (var g = 0; g < h.length; g++)
              if (((p = s._soundById(h[g])), p)) {
                s.playing(h[g]) &&
                  ((p._rateSeek = s.seek(h[g])),
                  (p._playStart = s._webAudio
                    ? t.ctx.currentTime
                    : p._playStart)),
                  (p._rate = d),
                  s._webAudio && p._node && p._node.bufferSource
                    ? p._node.bufferSource.playbackRate.setValueAtTime(
                        d,
                        t.ctx.currentTime
                      )
                    : p._node && (p._node.playbackRate = d);
                var Q = s.seek(h[g]),
                  y =
                    (s._sprite[p._sprite][0] + s._sprite[p._sprite][1]) / 1e3 -
                    Q,
                  B = (y * 1e3) / Math.abs(p._rate);
                (s._endTimers[h[g]] || !p._paused) &&
                  (s._clearTimer(h[g]),
                  (s._endTimers[h[g]] = setTimeout(s._ended.bind(s, p), B))),
                  s._emit("rate", p._id);
              }
          } else return (p = s._soundById(h)), p ? p._rate : s._rate;
          return s;
        },
        seek: function () {
          var s = this,
            r = arguments,
            d,
            h;
          if (r.length === 0) s._sounds.length && (h = s._sounds[0]._id);
          else if (r.length === 1) {
            var f = s._getSoundIds(),
              b = f.indexOf(r[0]);
            b >= 0
              ? (h = parseInt(r[0], 10))
              : s._sounds.length &&
                ((h = s._sounds[0]._id), (d = parseFloat(r[0])));
          } else
            r.length === 2 &&
              ((d = parseFloat(r[0])), (h = parseInt(r[1], 10)));
          if (typeof h > "u") return 0;
          if (typeof d == "number" && (s._state !== "loaded" || s._playLock))
            return (
              s._queue.push({
                event: "seek",
                action: function () {
                  s.seek.apply(s, r);
                },
              }),
              s
            );
          var p = s._soundById(h);
          if (p)
            if (typeof d == "number" && d >= 0) {
              var g = s.playing(h);
              g && s.pause(h, !0),
                (p._seek = d),
                (p._ended = !1),
                s._clearTimer(h),
                !s._webAudio &&
                  p._node &&
                  !isNaN(p._node.duration) &&
                  (p._node.currentTime = d);
              var Q = function () {
                g && s.play(h, !0), s._emit("seek", h);
              };
              if (g && !s._webAudio) {
                var y = function () {
                  s._playLock ? setTimeout(y, 0) : Q();
                };
                setTimeout(y, 0);
              } else Q();
            } else if (s._webAudio) {
              var B = s.playing(h) ? t.ctx.currentTime - p._playStart : 0,
                k = p._rateSeek ? p._rateSeek - p._seek : 0;
              return p._seek + (k + B * Math.abs(p._rate));
            } else return p._node.currentTime;
          return s;
        },
        playing: function (s) {
          var r = this;
          if (typeof s == "number") {
            var d = r._soundById(s);
            return d ? !d._paused : !1;
          }
          for (var h = 0; h < r._sounds.length; h++)
            if (!r._sounds[h]._paused) return !0;
          return !1;
        },
        duration: function (s) {
          var r = this,
            d = r._duration,
            h = r._soundById(s);
          return h && (d = r._sprite[h._sprite][1] / 1e3), d;
        },
        state: function () {
          return this._state;
        },
        unload: function () {
          for (var s = this, r = s._sounds, d = 0; d < r.length; d++)
            r[d]._paused || s.stop(r[d]._id),
              s._webAudio ||
                (s._clearSound(r[d]._node),
                r[d]._node.removeEventListener("error", r[d]._errorFn, !1),
                r[d]._node.removeEventListener(
                  t._canPlayEvent,
                  r[d]._loadFn,
                  !1
                ),
                r[d]._node.removeEventListener("ended", r[d]._endFn, !1),
                t._releaseHtml5Audio(r[d]._node)),
              delete r[d]._node,
              s._clearTimer(r[d]._id);
          var h = t._howls.indexOf(s);
          h >= 0 && t._howls.splice(h, 1);
          var f = !0;
          for (d = 0; d < t._howls.length; d++)
            if (
              t._howls[d]._src === s._src ||
              s._src.indexOf(t._howls[d]._src) >= 0
            ) {
              f = !1;
              break;
            }
          return (
            n && f && delete n[s._src],
            (t.noAudio = !1),
            (s._state = "unloaded"),
            (s._sounds = []),
            (s = null),
            null
          );
        },
        on: function (s, r, d, h) {
          var f = this,
            b = f["_on" + s];
          return (
            typeof r == "function" &&
              b.push(h ? { id: d, fn: r, once: h } : { id: d, fn: r }),
            f
          );
        },
        off: function (s, r, d) {
          var h = this,
            f = h["_on" + s],
            b = 0;
          if ((typeof r == "number" && ((d = r), (r = null)), r || d))
            for (b = 0; b < f.length; b++) {
              var p = d === f[b].id;
              if ((r === f[b].fn && p) || (!r && p)) {
                f.splice(b, 1);
                break;
              }
            }
          else if (s) h["_on" + s] = [];
          else {
            var g = Object.keys(h);
            for (b = 0; b < g.length; b++)
              g[b].indexOf("_on") === 0 &&
                Array.isArray(h[g[b]]) &&
                (h[g[b]] = []);
          }
          return h;
        },
        once: function (s, r, d) {
          var h = this;
          return h.on(s, r, d, 1), h;
        },
        _emit: function (s, r, d) {
          for (var h = this, f = h["_on" + s], b = f.length - 1; b >= 0; b--)
            (!f[b].id || f[b].id === r || s === "load") &&
              (setTimeout(
                function (p) {
                  p.call(this, r, d);
                }.bind(h, f[b].fn),
                0
              ),
              f[b].once && h.off(s, f[b].fn, f[b].id));
          return h._loadQueue(s), h;
        },
        _loadQueue: function (s) {
          var r = this;
          if (r._queue.length > 0) {
            var d = r._queue[0];
            d.event === s && (r._queue.shift(), r._loadQueue()),
              s || d.action();
          }
          return r;
        },
        _ended: function (s) {
          var r = this,
            d = s._sprite;
          if (
            !r._webAudio &&
            s._node &&
            !s._node.paused &&
            !s._node.ended &&
            s._node.currentTime < s._stop
          )
            return setTimeout(r._ended.bind(r, s), 100), r;
          var h = !!(s._loop || r._sprite[d][2]);
          if (
            (r._emit("end", s._id),
            !r._webAudio && h && r.stop(s._id, !0).play(s._id),
            r._webAudio && h)
          ) {
            r._emit("play", s._id),
              (s._seek = s._start || 0),
              (s._rateSeek = 0),
              (s._playStart = t.ctx.currentTime);
            var f = ((s._stop - s._start) * 1e3) / Math.abs(s._rate);
            r._endTimers[s._id] = setTimeout(r._ended.bind(r, s), f);
          }
          return (
            r._webAudio &&
              !h &&
              ((s._paused = !0),
              (s._ended = !0),
              (s._seek = s._start || 0),
              (s._rateSeek = 0),
              r._clearTimer(s._id),
              r._cleanBuffer(s._node),
              t._autoSuspend()),
            !r._webAudio && !h && r.stop(s._id, !0),
            r
          );
        },
        _clearTimer: function (s) {
          var r = this;
          if (r._endTimers[s]) {
            if (typeof r._endTimers[s] != "function")
              clearTimeout(r._endTimers[s]);
            else {
              var d = r._soundById(s);
              d &&
                d._node &&
                d._node.removeEventListener("ended", r._endTimers[s], !1);
            }
            delete r._endTimers[s];
          }
          return r;
        },
        _soundById: function (s) {
          for (var r = this, d = 0; d < r._sounds.length; d++)
            if (s === r._sounds[d]._id) return r._sounds[d];
          return null;
        },
        _inactiveSound: function () {
          var s = this;
          s._drain();
          for (var r = 0; r < s._sounds.length; r++)
            if (s._sounds[r]._ended) return s._sounds[r].reset();
          return new i(s);
        },
        _drain: function () {
          var s = this,
            r = s._pool,
            d = 0,
            h = 0;
          if (!(s._sounds.length < r)) {
            for (h = 0; h < s._sounds.length; h++) s._sounds[h]._ended && d++;
            for (h = s._sounds.length - 1; h >= 0; h--) {
              if (d <= r) return;
              s._sounds[h]._ended &&
                (s._webAudio &&
                  s._sounds[h]._node &&
                  s._sounds[h]._node.disconnect(0),
                s._sounds.splice(h, 1),
                d--);
            }
          }
        },
        _getSoundIds: function (s) {
          var r = this;
          if (typeof s > "u") {
            for (var d = [], h = 0; h < r._sounds.length; h++)
              d.push(r._sounds[h]._id);
            return d;
          } else return [s];
        },
        _refreshBuffer: function (s) {
          var r = this;
          return (
            (s._node.bufferSource = t.ctx.createBufferSource()),
            (s._node.bufferSource.buffer = n[r._src]),
            s._panner
              ? s._node.bufferSource.connect(s._panner)
              : s._node.bufferSource.connect(s._node),
            (s._node.bufferSource.loop = s._loop),
            s._loop &&
              ((s._node.bufferSource.loopStart = s._start || 0),
              (s._node.bufferSource.loopEnd = s._stop || 0)),
            s._node.bufferSource.playbackRate.setValueAtTime(
              s._rate,
              t.ctx.currentTime
            ),
            r
          );
        },
        _cleanBuffer: function (s) {
          var r = this,
            d = t._navigator && t._navigator.vendor.indexOf("Apple") >= 0;
          if (!s.bufferSource) return r;
          if (
            t._scratchBuffer &&
            s.bufferSource &&
            ((s.bufferSource.onended = null), s.bufferSource.disconnect(0), d)
          )
            try {
              s.bufferSource.buffer = t._scratchBuffer;
            } catch {}
          return (s.bufferSource = null), r;
        },
        _clearSound: function (s) {
          var r = /MSIE |Trident\//.test(
            t._navigator && t._navigator.userAgent
          );
          r ||
            (s.src =
              "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA");
        },
      };
      var i = function (s) {
        (this._parent = s), this.init();
      };
      i.prototype = {
        init: function () {
          var s = this,
            r = s._parent;
          return (
            (s._muted = r._muted),
            (s._loop = r._loop),
            (s._volume = r._volume),
            (s._rate = r._rate),
            (s._seek = 0),
            (s._paused = !0),
            (s._ended = !0),
            (s._sprite = "__default"),
            (s._id = ++t._counter),
            r._sounds.push(s),
            s.create(),
            s
          );
        },
        create: function () {
          var s = this,
            r = s._parent,
            d = t._muted || s._muted || s._parent._muted ? 0 : s._volume;
          return (
            r._webAudio
              ? ((s._node =
                  typeof t.ctx.createGain > "u"
                    ? t.ctx.createGainNode()
                    : t.ctx.createGain()),
                s._node.gain.setValueAtTime(d, t.ctx.currentTime),
                (s._node.paused = !0),
                s._node.connect(t.masterGain))
              : t.noAudio ||
                ((s._node = t._obtainHtml5Audio()),
                (s._errorFn = s._errorListener.bind(s)),
                s._node.addEventListener("error", s._errorFn, !1),
                (s._loadFn = s._loadListener.bind(s)),
                s._node.addEventListener(t._canPlayEvent, s._loadFn, !1),
                (s._endFn = s._endListener.bind(s)),
                s._node.addEventListener("ended", s._endFn, !1),
                (s._node.src = r._src),
                (s._node.preload = r._preload === !0 ? "auto" : r._preload),
                (s._node.volume = d * t.volume()),
                s._node.load()),
            s
          );
        },
        reset: function () {
          var s = this,
            r = s._parent;
          return (
            (s._muted = r._muted),
            (s._loop = r._loop),
            (s._volume = r._volume),
            (s._rate = r._rate),
            (s._seek = 0),
            (s._rateSeek = 0),
            (s._paused = !0),
            (s._ended = !0),
            (s._sprite = "__default"),
            (s._id = ++t._counter),
            s
          );
        },
        _errorListener: function () {
          var s = this;
          s._parent._emit(
            "loaderror",
            s._id,
            s._node.error ? s._node.error.code : 0
          ),
            s._node.removeEventListener("error", s._errorFn, !1);
        },
        _loadListener: function () {
          var s = this,
            r = s._parent;
          (r._duration = Math.ceil(s._node.duration * 10) / 10),
            Object.keys(r._sprite).length === 0 &&
              (r._sprite = { __default: [0, r._duration * 1e3] }),
            r._state !== "loaded" &&
              ((r._state = "loaded"), r._emit("load"), r._loadQueue()),
            s._node.removeEventListener(t._canPlayEvent, s._loadFn, !1);
        },
        _endListener: function () {
          var s = this,
            r = s._parent;
          r._duration === 1 / 0 &&
            ((r._duration = Math.ceil(s._node.duration * 10) / 10),
            r._sprite.__default[1] === 1 / 0 &&
              (r._sprite.__default[1] = r._duration * 1e3),
            r._ended(s)),
            s._node.removeEventListener("ended", s._endFn, !1);
        },
      };
      var n = {},
        o = function (s) {
          var r = s._src;
          if (n[r]) {
            (s._duration = n[r].duration), u(s);
            return;
          }
          if (/^data:[^;]+;base64,/.test(r)) {
            for (
              var d = atob(r.split(",")[1]),
                h = new Uint8Array(d.length),
                f = 0;
              f < d.length;
              ++f
            )
              h[f] = d.charCodeAt(f);
            c(h.buffer, s);
          } else {
            var b = new XMLHttpRequest();
            b.open(s._xhr.method, r, !0),
              (b.withCredentials = s._xhr.withCredentials),
              (b.responseType = "arraybuffer"),
              s._xhr.headers &&
                Object.keys(s._xhr.headers).forEach(function (p) {
                  b.setRequestHeader(p, s._xhr.headers[p]);
                }),
              (b.onload = function () {
                var p = (b.status + "")[0];
                if (p !== "0" && p !== "2" && p !== "3") {
                  s._emit(
                    "loaderror",
                    null,
                    "Failed loading audio file with status: " + b.status + "."
                  );
                  return;
                }
                c(b.response, s);
              }),
              (b.onerror = function () {
                s._webAudio &&
                  ((s._html5 = !0),
                  (s._webAudio = !1),
                  (s._sounds = []),
                  delete n[r],
                  s.load());
              }),
              l(b);
          }
        },
        l = function (s) {
          try {
            s.send();
          } catch {
            s.onerror();
          }
        },
        c = function (s, r) {
          var d = function () {
              r._emit("loaderror", null, "Decoding audio data failed.");
            },
            h = function (f) {
              f && r._sounds.length > 0 ? ((n[r._src] = f), u(r, f)) : d();
            };
          typeof Promise < "u" && t.ctx.decodeAudioData.length === 1
            ? t.ctx.decodeAudioData(s).then(h).catch(d)
            : t.ctx.decodeAudioData(s, h, d);
        },
        u = function (s, r) {
          r && !s._duration && (s._duration = r.duration),
            Object.keys(s._sprite).length === 0 &&
              (s._sprite = { __default: [0, s._duration * 1e3] }),
            s._state !== "loaded" &&
              ((s._state = "loaded"), s._emit("load"), s._loadQueue());
        },
        m = function () {
          if (t.usingWebAudio) {
            try {
              typeof AudioContext < "u"
                ? (t.ctx = new AudioContext())
                : typeof webkitAudioContext < "u"
                ? (t.ctx = new webkitAudioContext())
                : (t.usingWebAudio = !1);
            } catch {
              t.usingWebAudio = !1;
            }
            t.ctx || (t.usingWebAudio = !1);
            var s = /iP(hone|od|ad)/.test(
                t._navigator && t._navigator.platform
              ),
              r =
                t._navigator &&
                t._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),
              d = r ? parseInt(r[1], 10) : null;
            if (s && d && d < 9) {
              var h = /safari/.test(
                t._navigator && t._navigator.userAgent.toLowerCase()
              );
              t._navigator && !h && (t.usingWebAudio = !1);
            }
            t.usingWebAudio &&
              ((t.masterGain =
                typeof t.ctx.createGain > "u"
                  ? t.ctx.createGainNode()
                  : t.ctx.createGain()),
              t.masterGain.gain.setValueAtTime(
                t._muted ? 0 : t._volume,
                t.ctx.currentTime
              ),
              t.masterGain.connect(t.ctx.destination)),
              t._setup();
          }
        };
      typeof define == "function" &&
        define.amd &&
        define([], function () {
          return { Howler: t, Howl: e };
        }),
        typeof ie < "u" && ((ie.Howler = t), (ie.Howl = e)),
        typeof global < "u"
          ? ((global.HowlerGlobal = a),
            (global.Howler = t),
            (global.Howl = e),
            (global.Sound = i))
          : typeof window < "u" &&
            ((window.HowlerGlobal = a),
            (window.Howler = t),
            (window.Howl = e),
            (window.Sound = i));
    })();
    (function () {
      "use strict";
      (HowlerGlobal.prototype._pos = [0, 0, 0]),
        (HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0]),
        (HowlerGlobal.prototype.stereo = function (t) {
          var e = this;
          if (!e.ctx || !e.ctx.listener) return e;
          for (var i = e._howls.length - 1; i >= 0; i--) e._howls[i].stereo(t);
          return e;
        }),
        (HowlerGlobal.prototype.pos = function (t, e, i) {
          var n = this;
          if (!n.ctx || !n.ctx.listener) return n;
          if (
            ((e = typeof e != "number" ? n._pos[1] : e),
            (i = typeof i != "number" ? n._pos[2] : i),
            typeof t == "number")
          )
            (n._pos = [t, e, i]),
              typeof n.ctx.listener.positionX < "u"
                ? (n.ctx.listener.positionX.setTargetAtTime(
                    n._pos[0],
                    Howler.ctx.currentTime,
                    0.1
                  ),
                  n.ctx.listener.positionY.setTargetAtTime(
                    n._pos[1],
                    Howler.ctx.currentTime,
                    0.1
                  ),
                  n.ctx.listener.positionZ.setTargetAtTime(
                    n._pos[2],
                    Howler.ctx.currentTime,
                    0.1
                  ))
                : n.ctx.listener.setPosition(n._pos[0], n._pos[1], n._pos[2]);
          else return n._pos;
          return n;
        }),
        (HowlerGlobal.prototype.orientation = function (t, e, i, n, o, l) {
          var c = this;
          if (!c.ctx || !c.ctx.listener) return c;
          var u = c._orientation;
          if (
            ((e = typeof e != "number" ? u[1] : e),
            (i = typeof i != "number" ? u[2] : i),
            (n = typeof n != "number" ? u[3] : n),
            (o = typeof o != "number" ? u[4] : o),
            (l = typeof l != "number" ? u[5] : l),
            typeof t == "number")
          )
            (c._orientation = [t, e, i, n, o, l]),
              typeof c.ctx.listener.forwardX < "u"
                ? (c.ctx.listener.forwardX.setTargetAtTime(
                    t,
                    Howler.ctx.currentTime,
                    0.1
                  ),
                  c.ctx.listener.forwardY.setTargetAtTime(
                    e,
                    Howler.ctx.currentTime,
                    0.1
                  ),
                  c.ctx.listener.forwardZ.setTargetAtTime(
                    i,
                    Howler.ctx.currentTime,
                    0.1
                  ),
                  c.ctx.listener.upX.setTargetAtTime(
                    n,
                    Howler.ctx.currentTime,
                    0.1
                  ),
                  c.ctx.listener.upY.setTargetAtTime(
                    o,
                    Howler.ctx.currentTime,
                    0.1
                  ),
                  c.ctx.listener.upZ.setTargetAtTime(
                    l,
                    Howler.ctx.currentTime,
                    0.1
                  ))
                : c.ctx.listener.setOrientation(t, e, i, n, o, l);
          else return u;
          return c;
        }),
        (Howl.prototype.init = (function (t) {
          return function (e) {
            var i = this;
            return (
              (i._orientation = e.orientation || [1, 0, 0]),
              (i._stereo = e.stereo || null),
              (i._pos = e.pos || null),
              (i._pannerAttr = {
                coneInnerAngle:
                  typeof e.coneInnerAngle < "u" ? e.coneInnerAngle : 360,
                coneOuterAngle:
                  typeof e.coneOuterAngle < "u" ? e.coneOuterAngle : 360,
                coneOuterGain:
                  typeof e.coneOuterGain < "u" ? e.coneOuterGain : 0,
                distanceModel:
                  typeof e.distanceModel < "u" ? e.distanceModel : "inverse",
                maxDistance: typeof e.maxDistance < "u" ? e.maxDistance : 1e4,
                panningModel:
                  typeof e.panningModel < "u" ? e.panningModel : "HRTF",
                refDistance: typeof e.refDistance < "u" ? e.refDistance : 1,
                rolloffFactor:
                  typeof e.rolloffFactor < "u" ? e.rolloffFactor : 1,
              }),
              (i._onstereo = e.onstereo ? [{ fn: e.onstereo }] : []),
              (i._onpos = e.onpos ? [{ fn: e.onpos }] : []),
              (i._onorientation = e.onorientation
                ? [{ fn: e.onorientation }]
                : []),
              t.call(this, e)
            );
          };
        })(Howl.prototype.init)),
        (Howl.prototype.stereo = function (t, e) {
          var i = this;
          if (!i._webAudio) return i;
          if (i._state !== "loaded")
            return (
              i._queue.push({
                event: "stereo",
                action: function () {
                  i.stereo(t, e);
                },
              }),
              i
            );
          var n =
            typeof Howler.ctx.createStereoPanner > "u" ? "spatial" : "stereo";
          if (typeof e > "u")
            if (typeof t == "number") (i._stereo = t), (i._pos = [t, 0, 0]);
            else return i._stereo;
          for (var o = i._getSoundIds(e), l = 0; l < o.length; l++) {
            var c = i._soundById(o[l]);
            if (c)
              if (typeof t == "number")
                (c._stereo = t),
                  (c._pos = [t, 0, 0]),
                  c._node &&
                    ((c._pannerAttr.panningModel = "equalpower"),
                    (!c._panner || !c._panner.pan) && a(c, n),
                    n === "spatial"
                      ? typeof c._panner.positionX < "u"
                        ? (c._panner.positionX.setValueAtTime(
                            t,
                            Howler.ctx.currentTime
                          ),
                          c._panner.positionY.setValueAtTime(
                            0,
                            Howler.ctx.currentTime
                          ),
                          c._panner.positionZ.setValueAtTime(
                            0,
                            Howler.ctx.currentTime
                          ))
                        : c._panner.setPosition(t, 0, 0)
                      : c._panner.pan.setValueAtTime(
                          t,
                          Howler.ctx.currentTime
                        )),
                  i._emit("stereo", c._id);
              else return c._stereo;
          }
          return i;
        }),
        (Howl.prototype.pos = function (t, e, i, n) {
          var o = this;
          if (!o._webAudio) return o;
          if (o._state !== "loaded")
            return (
              o._queue.push({
                event: "pos",
                action: function () {
                  o.pos(t, e, i, n);
                },
              }),
              o
            );
          if (
            ((e = typeof e != "number" ? 0 : e),
            (i = typeof i != "number" ? -0.5 : i),
            typeof n > "u")
          )
            if (typeof t == "number") o._pos = [t, e, i];
            else return o._pos;
          for (var l = o._getSoundIds(n), c = 0; c < l.length; c++) {
            var u = o._soundById(l[c]);
            if (u)
              if (typeof t == "number")
                (u._pos = [t, e, i]),
                  u._node &&
                    ((!u._panner || u._panner.pan) && a(u, "spatial"),
                    typeof u._panner.positionX < "u"
                      ? (u._panner.positionX.setValueAtTime(
                          t,
                          Howler.ctx.currentTime
                        ),
                        u._panner.positionY.setValueAtTime(
                          e,
                          Howler.ctx.currentTime
                        ),
                        u._panner.positionZ.setValueAtTime(
                          i,
                          Howler.ctx.currentTime
                        ))
                      : u._panner.setPosition(t, e, i)),
                  o._emit("pos", u._id);
              else return u._pos;
          }
          return o;
        }),
        (Howl.prototype.orientation = function (t, e, i, n) {
          var o = this;
          if (!o._webAudio) return o;
          if (o._state !== "loaded")
            return (
              o._queue.push({
                event: "orientation",
                action: function () {
                  o.orientation(t, e, i, n);
                },
              }),
              o
            );
          if (
            ((e = typeof e != "number" ? o._orientation[1] : e),
            (i = typeof i != "number" ? o._orientation[2] : i),
            typeof n > "u")
          )
            if (typeof t == "number") o._orientation = [t, e, i];
            else return o._orientation;
          for (var l = o._getSoundIds(n), c = 0; c < l.length; c++) {
            var u = o._soundById(l[c]);
            if (u)
              if (typeof t == "number")
                (u._orientation = [t, e, i]),
                  u._node &&
                    (u._panner ||
                      (u._pos || (u._pos = o._pos || [0, 0, -0.5]),
                      a(u, "spatial")),
                    typeof u._panner.orientationX < "u"
                      ? (u._panner.orientationX.setValueAtTime(
                          t,
                          Howler.ctx.currentTime
                        ),
                        u._panner.orientationY.setValueAtTime(
                          e,
                          Howler.ctx.currentTime
                        ),
                        u._panner.orientationZ.setValueAtTime(
                          i,
                          Howler.ctx.currentTime
                        ))
                      : u._panner.setOrientation(t, e, i)),
                  o._emit("orientation", u._id);
              else return u._orientation;
          }
          return o;
        }),
        (Howl.prototype.pannerAttr = function () {
          var t = this,
            e = arguments,
            i,
            n,
            o;
          if (!t._webAudio) return t;
          if (e.length === 0) return t._pannerAttr;
          if (e.length === 1)
            if (typeof e[0] == "object")
              (i = e[0]),
                typeof n > "u" &&
                  (i.pannerAttr ||
                    (i.pannerAttr = {
                      coneInnerAngle: i.coneInnerAngle,
                      coneOuterAngle: i.coneOuterAngle,
                      coneOuterGain: i.coneOuterGain,
                      distanceModel: i.distanceModel,
                      maxDistance: i.maxDistance,
                      refDistance: i.refDistance,
                      rolloffFactor: i.rolloffFactor,
                      panningModel: i.panningModel,
                    }),
                  (t._pannerAttr = {
                    coneInnerAngle:
                      typeof i.pannerAttr.coneInnerAngle < "u"
                        ? i.pannerAttr.coneInnerAngle
                        : t._coneInnerAngle,
                    coneOuterAngle:
                      typeof i.pannerAttr.coneOuterAngle < "u"
                        ? i.pannerAttr.coneOuterAngle
                        : t._coneOuterAngle,
                    coneOuterGain:
                      typeof i.pannerAttr.coneOuterGain < "u"
                        ? i.pannerAttr.coneOuterGain
                        : t._coneOuterGain,
                    distanceModel:
                      typeof i.pannerAttr.distanceModel < "u"
                        ? i.pannerAttr.distanceModel
                        : t._distanceModel,
                    maxDistance:
                      typeof i.pannerAttr.maxDistance < "u"
                        ? i.pannerAttr.maxDistance
                        : t._maxDistance,
                    refDistance:
                      typeof i.pannerAttr.refDistance < "u"
                        ? i.pannerAttr.refDistance
                        : t._refDistance,
                    rolloffFactor:
                      typeof i.pannerAttr.rolloffFactor < "u"
                        ? i.pannerAttr.rolloffFactor
                        : t._rolloffFactor,
                    panningModel:
                      typeof i.pannerAttr.panningModel < "u"
                        ? i.pannerAttr.panningModel
                        : t._panningModel,
                  }));
            else
              return (
                (o = t._soundById(parseInt(e[0], 10))),
                o ? o._pannerAttr : t._pannerAttr
              );
          else e.length === 2 && ((i = e[0]), (n = parseInt(e[1], 10)));
          for (var l = t._getSoundIds(n), c = 0; c < l.length; c++)
            if (((o = t._soundById(l[c])), o)) {
              var u = o._pannerAttr;
              u = {
                coneInnerAngle:
                  typeof i.coneInnerAngle < "u"
                    ? i.coneInnerAngle
                    : u.coneInnerAngle,
                coneOuterAngle:
                  typeof i.coneOuterAngle < "u"
                    ? i.coneOuterAngle
                    : u.coneOuterAngle,
                coneOuterGain:
                  typeof i.coneOuterGain < "u"
                    ? i.coneOuterGain
                    : u.coneOuterGain,
                distanceModel:
                  typeof i.distanceModel < "u"
                    ? i.distanceModel
                    : u.distanceModel,
                maxDistance:
                  typeof i.maxDistance < "u" ? i.maxDistance : u.maxDistance,
                refDistance:
                  typeof i.refDistance < "u" ? i.refDistance : u.refDistance,
                rolloffFactor:
                  typeof i.rolloffFactor < "u"
                    ? i.rolloffFactor
                    : u.rolloffFactor,
                panningModel:
                  typeof i.panningModel < "u" ? i.panningModel : u.panningModel,
              };
              var m = o._panner;
              m ||
                (o._pos || (o._pos = t._pos || [0, 0, -0.5]),
                a(o, "spatial"),
                (m = o._panner)),
                (m.coneInnerAngle = u.coneInnerAngle),
                (m.coneOuterAngle = u.coneOuterAngle),
                (m.coneOuterGain = u.coneOuterGain),
                (m.distanceModel = u.distanceModel),
                (m.maxDistance = u.maxDistance),
                (m.refDistance = u.refDistance),
                (m.rolloffFactor = u.rolloffFactor),
                (m.panningModel = u.panningModel);
            }
          return t;
        }),
        (Sound.prototype.init = (function (t) {
          return function () {
            var e = this,
              i = e._parent;
            (e._orientation = i._orientation),
              (e._stereo = i._stereo),
              (e._pos = i._pos),
              (e._pannerAttr = i._pannerAttr),
              t.call(this),
              e._stereo
                ? i.stereo(e._stereo)
                : e._pos && i.pos(e._pos[0], e._pos[1], e._pos[2], e._id);
          };
        })(Sound.prototype.init)),
        (Sound.prototype.reset = (function (t) {
          return function () {
            var e = this,
              i = e._parent;
            return (
              (e._orientation = i._orientation),
              (e._stereo = i._stereo),
              (e._pos = i._pos),
              (e._pannerAttr = i._pannerAttr),
              e._stereo
                ? i.stereo(e._stereo)
                : e._pos
                ? i.pos(e._pos[0], e._pos[1], e._pos[2], e._id)
                : e._panner &&
                  (e._panner.disconnect(0),
                  (e._panner = void 0),
                  i._refreshBuffer(e)),
              t.call(this)
            );
          };
        })(Sound.prototype.reset));
      var a = function (t, e) {
        (e = e || "spatial"),
          e === "spatial"
            ? ((t._panner = Howler.ctx.createPanner()),
              (t._panner.coneInnerAngle = t._pannerAttr.coneInnerAngle),
              (t._panner.coneOuterAngle = t._pannerAttr.coneOuterAngle),
              (t._panner.coneOuterGain = t._pannerAttr.coneOuterGain),
              (t._panner.distanceModel = t._pannerAttr.distanceModel),
              (t._panner.maxDistance = t._pannerAttr.maxDistance),
              (t._panner.refDistance = t._pannerAttr.refDistance),
              (t._panner.rolloffFactor = t._pannerAttr.rolloffFactor),
              (t._panner.panningModel = t._pannerAttr.panningModel),
              typeof t._panner.positionX < "u"
                ? (t._panner.positionX.setValueAtTime(
                    t._pos[0],
                    Howler.ctx.currentTime
                  ),
                  t._panner.positionY.setValueAtTime(
                    t._pos[1],
                    Howler.ctx.currentTime
                  ),
                  t._panner.positionZ.setValueAtTime(
                    t._pos[2],
                    Howler.ctx.currentTime
                  ))
                : t._panner.setPosition(t._pos[0], t._pos[1], t._pos[2]),
              typeof t._panner.orientationX < "u"
                ? (t._panner.orientationX.setValueAtTime(
                    t._orientation[0],
                    Howler.ctx.currentTime
                  ),
                  t._panner.orientationY.setValueAtTime(
                    t._orientation[1],
                    Howler.ctx.currentTime
                  ),
                  t._panner.orientationZ.setValueAtTime(
                    t._orientation[2],
                    Howler.ctx.currentTime
                  ))
                : t._panner.setOrientation(
                    t._orientation[0],
                    t._orientation[1],
                    t._orientation[2]
                  ))
            : ((t._panner = Howler.ctx.createStereoPanner()),
              t._panner.pan.setValueAtTime(t._stereo, Howler.ctx.currentTime)),
          t._panner.connect(t._node),
          t._paused || t._parent.pause(t._id, !0).play(t._id, !0);
      };
    })();
  });
  var oe = class {
    constructor(t, e, i) {
      (this.eventTarget = t),
        (this.eventName = e),
        (this.eventOptions = i),
        (this.unorderedBindings = new Set());
    }
    connect() {
      this.eventTarget.addEventListener(
        this.eventName,
        this,
        this.eventOptions
      );
    }
    disconnect() {
      this.eventTarget.removeEventListener(
        this.eventName,
        this,
        this.eventOptions
      );
    }
    bindingConnected(t) {
      this.unorderedBindings.add(t);
    }
    bindingDisconnected(t) {
      this.unorderedBindings.delete(t);
    }
    handleEvent(t) {
      let e = bn(t);
      for (let i of this.bindings) {
        if (e.immediatePropagationStopped) break;
        i.handleEvent(e);
      }
    }
    hasBindings() {
      return this.unorderedBindings.size > 0;
    }
    get bindings() {
      return Array.from(this.unorderedBindings).sort((t, e) => {
        let i = t.index,
          n = e.index;
        return i < n ? -1 : i > n ? 1 : 0;
      });
    }
  };
  function bn(a) {
    if ("immediatePropagationStopped" in a) return a;
    {
      let { stopImmediatePropagation: t } = a;
      return Object.assign(a, {
        immediatePropagationStopped: !1,
        stopImmediatePropagation() {
          (this.immediatePropagationStopped = !0), t.call(this);
        },
      });
    }
  }
  var ae = class {
      constructor(t) {
        (this.application = t),
          (this.eventListenerMaps = new Map()),
          (this.started = !1);
      }
      start() {
        this.started ||
          ((this.started = !0),
          this.eventListeners.forEach((t) => t.connect()));
      }
      stop() {
        this.started &&
          ((this.started = !1),
          this.eventListeners.forEach((t) => t.disconnect()));
      }
      get eventListeners() {
        return Array.from(this.eventListenerMaps.values()).reduce(
          (t, e) => t.concat(Array.from(e.values())),
          []
        );
      }
      bindingConnected(t) {
        this.fetchEventListenerForBinding(t).bindingConnected(t);
      }
      bindingDisconnected(t, e = !1) {
        this.fetchEventListenerForBinding(t).bindingDisconnected(t),
          e && this.clearEventListenersForBinding(t);
      }
      handleError(t, e, i = {}) {
        this.application.handleError(t, `Error ${e}`, i);
      }
      clearEventListenersForBinding(t) {
        let e = this.fetchEventListenerForBinding(t);
        e.hasBindings() ||
          (e.disconnect(), this.removeMappedEventListenerFor(t));
      }
      removeMappedEventListenerFor(t) {
        let { eventTarget: e, eventName: i, eventOptions: n } = t,
          o = this.fetchEventListenerMapForEventTarget(e),
          l = this.cacheKey(i, n);
        o.delete(l), o.size == 0 && this.eventListenerMaps.delete(e);
      }
      fetchEventListenerForBinding(t) {
        let { eventTarget: e, eventName: i, eventOptions: n } = t;
        return this.fetchEventListener(e, i, n);
      }
      fetchEventListener(t, e, i) {
        let n = this.fetchEventListenerMapForEventTarget(t),
          o = this.cacheKey(e, i),
          l = n.get(o);
        return l || ((l = this.createEventListener(t, e, i)), n.set(o, l)), l;
      }
      createEventListener(t, e, i) {
        let n = new oe(t, e, i);
        return this.started && n.connect(), n;
      }
      fetchEventListenerMapForEventTarget(t) {
        let e = this.eventListenerMaps.get(t);
        return e || ((e = new Map()), this.eventListenerMaps.set(t, e)), e;
      }
      cacheKey(t, e) {
        let i = [t];
        return (
          Object.keys(e)
            .sort()
            .forEach((n) => {
              i.push(`${e[n] ? "" : "!"}${n}`);
            }),
          i.join(":")
        );
      }
    },
    gn = {
      stop({ event: a, value: t }) {
        return t && a.stopPropagation(), !0;
      },
      prevent({ event: a, value: t }) {
        return t && a.preventDefault(), !0;
      },
      self({ event: a, value: t, element: e }) {
        return t ? e === a.target : !0;
      },
    },
    Qn =
      /^(?:(?:([^.]+?)\+)?(.+?)(?:\.(.+?))?(?:@(window|document))?->)?(.+?)(?:#([^:]+?))(?::(.+))?$/;
  function Fn(a) {
    let e = a.trim().match(Qn) || [],
      i = e[2],
      n = e[3];
    return (
      n &&
        !["keydown", "keyup", "keypress"].includes(i) &&
        ((i += `.${n}`), (n = "")),
      {
        eventTarget: yn(e[4]),
        eventName: i,
        eventOptions: e[7] ? vn(e[7]) : {},
        identifier: e[5],
        methodName: e[6],
        keyFilter: e[1] || n,
      }
    );
  }
  function yn(a) {
    if (a == "window") return window;
    if (a == "document") return document;
  }
  function vn(a) {
    return a
      .split(":")
      .reduce(
        (t, e) => Object.assign(t, { [e.replace(/^!/, "")]: !/^!/.test(e) }),
        {}
      );
  }
  function Bn(a) {
    if (a == window) return "window";
    if (a == document) return "document";
  }
  function Ce(a) {
    return a.replace(/(?:[_-])([a-z0-9])/g, (t, e) => e.toUpperCase());
  }
  function re(a) {
    return Ce(a.replace(/--/g, "-").replace(/__/g, "_"));
  }
  function ft(a) {
    return a.charAt(0).toUpperCase() + a.slice(1);
  }
  function hi(a) {
    return a.replace(/([A-Z])/g, (t, e) => `-${e.toLowerCase()}`);
  }
  function xn(a) {
    return a.match(/[^\s]+/g) || [];
  }
  function ni(a) {
    return a != null;
  }
  function le(a, t) {
    return Object.prototype.hasOwnProperty.call(a, t);
  }
  var si = ["meta", "ctrl", "alt", "shift"],
    ce = class {
      constructor(t, e, i, n) {
        (this.element = t),
          (this.index = e),
          (this.eventTarget = i.eventTarget || t),
          (this.eventName = i.eventName || Un(t) || Lt("missing event name")),
          (this.eventOptions = i.eventOptions || {}),
          (this.identifier = i.identifier || Lt("missing identifier")),
          (this.methodName = i.methodName || Lt("missing method name")),
          (this.keyFilter = i.keyFilter || ""),
          (this.schema = n);
      }
      static forToken(t, e) {
        return new this(t.element, t.index, Fn(t.content), e);
      }
      toString() {
        let t = this.keyFilter ? `.${this.keyFilter}` : "",
          e = this.eventTargetName ? `@${this.eventTargetName}` : "";
        return `${this.eventName}${t}${e}->${this.identifier}#${this.methodName}`;
      }
      shouldIgnoreKeyboardEvent(t) {
        if (!this.keyFilter) return !1;
        let e = this.keyFilter.split("+");
        if (this.keyFilterDissatisfied(t, e)) return !0;
        let i = e.filter((n) => !si.includes(n))[0];
        return i
          ? (le(this.keyMappings, i) ||
              Lt(`contains unknown key filter: ${this.keyFilter}`),
            this.keyMappings[i].toLowerCase() !== t.key.toLowerCase())
          : !1;
      }
      shouldIgnoreMouseEvent(t) {
        if (!this.keyFilter) return !1;
        let e = [this.keyFilter];
        return !!this.keyFilterDissatisfied(t, e);
      }
      get params() {
        let t = {},
          e = new RegExp(`^data-${this.identifier}-(.+)-param$`, "i");
        for (let { name: i, value: n } of Array.from(this.element.attributes)) {
          let o = i.match(e),
            l = o && o[1];
          l && (t[Ce(l)] = wn(n));
        }
        return t;
      }
      get eventTargetName() {
        return Bn(this.eventTarget);
      }
      get keyMappings() {
        return this.schema.keyMappings;
      }
      keyFilterDissatisfied(t, e) {
        let [i, n, o, l] = si.map((c) => e.includes(c));
        return (
          t.metaKey !== i ||
          t.ctrlKey !== n ||
          t.altKey !== o ||
          t.shiftKey !== l
        );
      }
    },
    oi = {
      a: () => "click",
      button: () => "click",
      form: () => "submit",
      details: () => "toggle",
      input: (a) => (a.getAttribute("type") == "submit" ? "click" : "input"),
      select: () => "change",
      textarea: () => "input",
    };
  function Un(a) {
    let t = a.tagName.toLowerCase();
    if (t in oi) return oi[t](a);
  }
  function Lt(a) {
    throw new Error(a);
  }
  function wn(a) {
    try {
      return JSON.parse(a);
    } catch {
      return a;
    }
  }
  var de = class {
      constructor(t, e) {
        (this.context = t), (this.action = e);
      }
      get index() {
        return this.action.index;
      }
      get eventTarget() {
        return this.action.eventTarget;
      }
      get eventOptions() {
        return this.action.eventOptions;
      }
      get identifier() {
        return this.context.identifier;
      }
      handleEvent(t) {
        let e = this.prepareActionEvent(t);
        this.willBeInvokedByEvent(t) &&
          this.applyEventModifiers(e) &&
          this.invokeWithEvent(e);
      }
      get eventName() {
        return this.action.eventName;
      }
      get method() {
        let t = this.controller[this.methodName];
        if (typeof t == "function") return t;
        throw new Error(
          `Action "${this.action}" references undefined method "${this.methodName}"`
        );
      }
      applyEventModifiers(t) {
        let { element: e } = this.action,
          { actionDescriptorFilters: i } = this.context.application,
          { controller: n } = this.context,
          o = !0;
        for (let [l, c] of Object.entries(this.eventOptions))
          if (l in i) {
            let u = i[l];
            o =
              o &&
              u({ name: l, value: c, event: t, element: e, controller: n });
          } else continue;
        return o;
      }
      prepareActionEvent(t) {
        return Object.assign(t, { params: this.action.params });
      }
      invokeWithEvent(t) {
        let { target: e, currentTarget: i } = t;
        try {
          this.method.call(this.controller, t),
            this.context.logDebugActivity(this.methodName, {
              event: t,
              target: e,
              currentTarget: i,
              action: this.methodName,
            });
        } catch (n) {
          let { identifier: o, controller: l, element: c, index: u } = this,
            m = {
              identifier: o,
              controller: l,
              element: c,
              index: u,
              event: t,
            };
          this.context.handleError(n, `invoking action "${this.action}"`, m);
        }
      }
      willBeInvokedByEvent(t) {
        let e = t.target;
        return (t instanceof KeyboardEvent &&
          this.action.shouldIgnoreKeyboardEvent(t)) ||
          (t instanceof MouseEvent && this.action.shouldIgnoreMouseEvent(t))
          ? !1
          : this.element === e
          ? !0
          : e instanceof Element && this.element.contains(e)
          ? this.scope.containsElement(e)
          : this.scope.containsElement(this.action.element);
      }
      get controller() {
        return this.context.controller;
      }
      get methodName() {
        return this.action.methodName;
      }
      get element() {
        return this.scope.element;
      }
      get scope() {
        return this.context.scope;
      }
    },
    Wt = class {
      constructor(t, e) {
        (this.mutationObserverInit = {
          attributes: !0,
          childList: !0,
          subtree: !0,
        }),
          (this.element = t),
          (this.started = !1),
          (this.delegate = e),
          (this.elements = new Set()),
          (this.mutationObserver = new MutationObserver((i) =>
            this.processMutations(i)
          ));
      }
      start() {
        this.started ||
          ((this.started = !0),
          this.mutationObserver.observe(
            this.element,
            this.mutationObserverInit
          ),
          this.refresh());
      }
      pause(t) {
        this.started &&
          (this.mutationObserver.disconnect(), (this.started = !1)),
          t(),
          this.started ||
            (this.mutationObserver.observe(
              this.element,
              this.mutationObserverInit
            ),
            (this.started = !0));
      }
      stop() {
        this.started &&
          (this.mutationObserver.takeRecords(),
          this.mutationObserver.disconnect(),
          (this.started = !1));
      }
      refresh() {
        if (this.started) {
          let t = new Set(this.matchElementsInTree());
          for (let e of Array.from(this.elements))
            t.has(e) || this.removeElement(e);
          for (let e of Array.from(t)) this.addElement(e);
        }
      }
      processMutations(t) {
        if (this.started) for (let e of t) this.processMutation(e);
      }
      processMutation(t) {
        t.type == "attributes"
          ? this.processAttributeChange(t.target, t.attributeName)
          : t.type == "childList" &&
            (this.processRemovedNodes(t.removedNodes),
            this.processAddedNodes(t.addedNodes));
      }
      processAttributeChange(t, e) {
        this.elements.has(t)
          ? this.delegate.elementAttributeChanged && this.matchElement(t)
            ? this.delegate.elementAttributeChanged(t, e)
            : this.removeElement(t)
          : this.matchElement(t) && this.addElement(t);
      }
      processRemovedNodes(t) {
        for (let e of Array.from(t)) {
          let i = this.elementFromNode(e);
          i && this.processTree(i, this.removeElement);
        }
      }
      processAddedNodes(t) {
        for (let e of Array.from(t)) {
          let i = this.elementFromNode(e);
          i && this.elementIsActive(i) && this.processTree(i, this.addElement);
        }
      }
      matchElement(t) {
        return this.delegate.matchElement(t);
      }
      matchElementsInTree(t = this.element) {
        return this.delegate.matchElementsInTree(t);
      }
      processTree(t, e) {
        for (let i of this.matchElementsInTree(t)) e.call(this, i);
      }
      elementFromNode(t) {
        if (t.nodeType == Node.ELEMENT_NODE) return t;
      }
      elementIsActive(t) {
        return t.isConnected != this.element.isConnected
          ? !1
          : this.element.contains(t);
      }
      addElement(t) {
        this.elements.has(t) ||
          (this.elementIsActive(t) &&
            (this.elements.add(t),
            this.delegate.elementMatched && this.delegate.elementMatched(t)));
      }
      removeElement(t) {
        this.elements.has(t) &&
          (this.elements.delete(t),
          this.delegate.elementUnmatched && this.delegate.elementUnmatched(t));
      }
    },
    Ct = class {
      constructor(t, e, i) {
        (this.attributeName = e),
          (this.delegate = i),
          (this.elementObserver = new Wt(t, this));
      }
      get element() {
        return this.elementObserver.element;
      }
      get selector() {
        return `[${this.attributeName}]`;
      }
      start() {
        this.elementObserver.start();
      }
      pause(t) {
        this.elementObserver.pause(t);
      }
      stop() {
        this.elementObserver.stop();
      }
      refresh() {
        this.elementObserver.refresh();
      }
      get started() {
        return this.elementObserver.started;
      }
      matchElement(t) {
        return t.hasAttribute(this.attributeName);
      }
      matchElementsInTree(t) {
        let e = this.matchElement(t) ? [t] : [],
          i = Array.from(t.querySelectorAll(this.selector));
        return e.concat(i);
      }
      elementMatched(t) {
        this.delegate.elementMatchedAttribute &&
          this.delegate.elementMatchedAttribute(t, this.attributeName);
      }
      elementUnmatched(t) {
        this.delegate.elementUnmatchedAttribute &&
          this.delegate.elementUnmatchedAttribute(t, this.attributeName);
      }
      elementAttributeChanged(t, e) {
        this.delegate.elementAttributeValueChanged &&
          this.attributeName == e &&
          this.delegate.elementAttributeValueChanged(t, e);
      }
    };
  function Ln(a, t, e) {
    mi(a, t).add(e);
  }
  function Wn(a, t, e) {
    mi(a, t).delete(e), Cn(a, t);
  }
  function mi(a, t) {
    let e = a.get(t);
    return e || ((e = new Set()), a.set(t, e)), e;
  }
  function Cn(a, t) {
    let e = a.get(t);
    e != null && e.size == 0 && a.delete(t);
  }
  var j = class {
    constructor() {
      this.valuesByKey = new Map();
    }
    get keys() {
      return Array.from(this.valuesByKey.keys());
    }
    get values() {
      return Array.from(this.valuesByKey.values()).reduce(
        (e, i) => e.concat(Array.from(i)),
        []
      );
    }
    get size() {
      return Array.from(this.valuesByKey.values()).reduce(
        (e, i) => e + i.size,
        0
      );
    }
    add(t, e) {
      Ln(this.valuesByKey, t, e);
    }
    delete(t, e) {
      Wn(this.valuesByKey, t, e);
    }
    has(t, e) {
      let i = this.valuesByKey.get(t);
      return i != null && i.has(e);
    }
    hasKey(t) {
      return this.valuesByKey.has(t);
    }
    hasValue(t) {
      return Array.from(this.valuesByKey.values()).some((i) => i.has(t));
    }
    getValuesForKey(t) {
      let e = this.valuesByKey.get(t);
      return e ? Array.from(e) : [];
    }
    getKeysForValue(t) {
      return Array.from(this.valuesByKey)
        .filter(([e, i]) => i.has(t))
        .map(([e, i]) => e);
    }
  };
  var ue = class {
      constructor(t, e, i, n) {
        (this._selector = e),
          (this.details = n),
          (this.elementObserver = new Wt(t, this)),
          (this.delegate = i),
          (this.matchesByElement = new j());
      }
      get started() {
        return this.elementObserver.started;
      }
      get selector() {
        return this._selector;
      }
      set selector(t) {
        (this._selector = t), this.refresh();
      }
      start() {
        this.elementObserver.start();
      }
      pause(t) {
        this.elementObserver.pause(t);
      }
      stop() {
        this.elementObserver.stop();
      }
      refresh() {
        this.elementObserver.refresh();
      }
      get element() {
        return this.elementObserver.element;
      }
      matchElement(t) {
        let { selector: e } = this;
        if (e) {
          let i = t.matches(e);
          return this.delegate.selectorMatchElement
            ? i && this.delegate.selectorMatchElement(t, this.details)
            : i;
        } else return !1;
      }
      matchElementsInTree(t) {
        let { selector: e } = this;
        if (e) {
          let i = this.matchElement(t) ? [t] : [],
            n = Array.from(t.querySelectorAll(e)).filter((o) =>
              this.matchElement(o)
            );
          return i.concat(n);
        } else return [];
      }
      elementMatched(t) {
        let { selector: e } = this;
        e && this.selectorMatched(t, e);
      }
      elementUnmatched(t) {
        let e = this.matchesByElement.getKeysForValue(t);
        for (let i of e) this.selectorUnmatched(t, i);
      }
      elementAttributeChanged(t, e) {
        let { selector: i } = this;
        if (i) {
          let n = this.matchElement(t),
            o = this.matchesByElement.has(i, t);
          n && !o
            ? this.selectorMatched(t, i)
            : !n && o && this.selectorUnmatched(t, i);
        }
      }
      selectorMatched(t, e) {
        this.delegate.selectorMatched(t, e, this.details),
          this.matchesByElement.add(e, t);
      }
      selectorUnmatched(t, e) {
        this.delegate.selectorUnmatched(t, e, this.details),
          this.matchesByElement.delete(e, t);
      }
    },
    he = class {
      constructor(t, e) {
        (this.element = t),
          (this.delegate = e),
          (this.started = !1),
          (this.stringMap = new Map()),
          (this.mutationObserver = new MutationObserver((i) =>
            this.processMutations(i)
          ));
      }
      start() {
        this.started ||
          ((this.started = !0),
          this.mutationObserver.observe(this.element, {
            attributes: !0,
            attributeOldValue: !0,
          }),
          this.refresh());
      }
      stop() {
        this.started &&
          (this.mutationObserver.takeRecords(),
          this.mutationObserver.disconnect(),
          (this.started = !1));
      }
      refresh() {
        if (this.started)
          for (let t of this.knownAttributeNames)
            this.refreshAttribute(t, null);
      }
      processMutations(t) {
        if (this.started) for (let e of t) this.processMutation(e);
      }
      processMutation(t) {
        let e = t.attributeName;
        e && this.refreshAttribute(e, t.oldValue);
      }
      refreshAttribute(t, e) {
        let i = this.delegate.getStringMapKeyForAttribute(t);
        if (i != null) {
          this.stringMap.has(t) || this.stringMapKeyAdded(i, t);
          let n = this.element.getAttribute(t);
          if (
            (this.stringMap.get(t) != n && this.stringMapValueChanged(n, i, e),
            n == null)
          ) {
            let o = this.stringMap.get(t);
            this.stringMap.delete(t), o && this.stringMapKeyRemoved(i, t, o);
          } else this.stringMap.set(t, n);
        }
      }
      stringMapKeyAdded(t, e) {
        this.delegate.stringMapKeyAdded &&
          this.delegate.stringMapKeyAdded(t, e);
      }
      stringMapValueChanged(t, e, i) {
        this.delegate.stringMapValueChanged &&
          this.delegate.stringMapValueChanged(t, e, i);
      }
      stringMapKeyRemoved(t, e, i) {
        this.delegate.stringMapKeyRemoved &&
          this.delegate.stringMapKeyRemoved(t, e, i);
      }
      get knownAttributeNames() {
        return Array.from(
          new Set(
            this.currentAttributeNames.concat(this.recordedAttributeNames)
          )
        );
      }
      get currentAttributeNames() {
        return Array.from(this.element.attributes).map((t) => t.name);
      }
      get recordedAttributeNames() {
        return Array.from(this.stringMap.keys());
      }
    },
    Et = class {
      constructor(t, e, i) {
        (this.attributeObserver = new Ct(t, e, this)),
          (this.delegate = i),
          (this.tokensByElement = new j());
      }
      get started() {
        return this.attributeObserver.started;
      }
      start() {
        this.attributeObserver.start();
      }
      pause(t) {
        this.attributeObserver.pause(t);
      }
      stop() {
        this.attributeObserver.stop();
      }
      refresh() {
        this.attributeObserver.refresh();
      }
      get element() {
        return this.attributeObserver.element;
      }
      get attributeName() {
        return this.attributeObserver.attributeName;
      }
      elementMatchedAttribute(t) {
        this.tokensMatched(this.readTokensForElement(t));
      }
      elementAttributeValueChanged(t) {
        let [e, i] = this.refreshTokensForElement(t);
        this.tokensUnmatched(e), this.tokensMatched(i);
      }
      elementUnmatchedAttribute(t) {
        this.tokensUnmatched(this.tokensByElement.getValuesForKey(t));
      }
      tokensMatched(t) {
        t.forEach((e) => this.tokenMatched(e));
      }
      tokensUnmatched(t) {
        t.forEach((e) => this.tokenUnmatched(e));
      }
      tokenMatched(t) {
        this.delegate.tokenMatched(t), this.tokensByElement.add(t.element, t);
      }
      tokenUnmatched(t) {
        this.delegate.tokenUnmatched(t),
          this.tokensByElement.delete(t.element, t);
      }
      refreshTokensForElement(t) {
        let e = this.tokensByElement.getValuesForKey(t),
          i = this.readTokensForElement(t),
          n = Zn(e, i).findIndex(([o, l]) => !kn(o, l));
        return n == -1 ? [[], []] : [e.slice(n), i.slice(n)];
      }
      readTokensForElement(t) {
        let e = this.attributeName,
          i = t.getAttribute(e) || "";
        return En(i, t, e);
      }
    };
  function En(a, t, e) {
    return a
      .trim()
      .split(/\s+/)
      .filter((i) => i.length)
      .map((i, n) => ({ element: t, attributeName: e, content: i, index: n }));
  }
  function Zn(a, t) {
    let e = Math.max(a.length, t.length);
    return Array.from({ length: e }, (i, n) => [a[n], t[n]]);
  }
  function kn(a, t) {
    return a && t && a.index == t.index && a.content == t.content;
  }
  var Zt = class {
      constructor(t, e, i) {
        (this.tokenListObserver = new Et(t, e, this)),
          (this.delegate = i),
          (this.parseResultsByToken = new WeakMap()),
          (this.valuesByTokenByElement = new WeakMap());
      }
      get started() {
        return this.tokenListObserver.started;
      }
      start() {
        this.tokenListObserver.start();
      }
      stop() {
        this.tokenListObserver.stop();
      }
      refresh() {
        this.tokenListObserver.refresh();
      }
      get element() {
        return this.tokenListObserver.element;
      }
      get attributeName() {
        return this.tokenListObserver.attributeName;
      }
      tokenMatched(t) {
        let { element: e } = t,
          { value: i } = this.fetchParseResultForToken(t);
        i &&
          (this.fetchValuesByTokenForElement(e).set(t, i),
          this.delegate.elementMatchedValue(e, i));
      }
      tokenUnmatched(t) {
        let { element: e } = t,
          { value: i } = this.fetchParseResultForToken(t);
        i &&
          (this.fetchValuesByTokenForElement(e).delete(t),
          this.delegate.elementUnmatchedValue(e, i));
      }
      fetchParseResultForToken(t) {
        let e = this.parseResultsByToken.get(t);
        return (
          e || ((e = this.parseToken(t)), this.parseResultsByToken.set(t, e)), e
        );
      }
      fetchValuesByTokenForElement(t) {
        let e = this.valuesByTokenByElement.get(t);
        return e || ((e = new Map()), this.valuesByTokenByElement.set(t, e)), e;
      }
      parseToken(t) {
        try {
          return { value: this.delegate.parseValueForToken(t) };
        } catch (e) {
          return { error: e };
        }
      }
    },
    me = class {
      constructor(t, e) {
        (this.context = t),
          (this.delegate = e),
          (this.bindingsByAction = new Map());
      }
      start() {
        this.valueListObserver ||
          ((this.valueListObserver = new Zt(
            this.element,
            this.actionAttribute,
            this
          )),
          this.valueListObserver.start());
      }
      stop() {
        this.valueListObserver &&
          (this.valueListObserver.stop(),
          delete this.valueListObserver,
          this.disconnectAllActions());
      }
      get element() {
        return this.context.element;
      }
      get identifier() {
        return this.context.identifier;
      }
      get actionAttribute() {
        return this.schema.actionAttribute;
      }
      get schema() {
        return this.context.schema;
      }
      get bindings() {
        return Array.from(this.bindingsByAction.values());
      }
      connectAction(t) {
        let e = new de(this.context, t);
        this.bindingsByAction.set(t, e), this.delegate.bindingConnected(e);
      }
      disconnectAction(t) {
        let e = this.bindingsByAction.get(t);
        e &&
          (this.bindingsByAction.delete(t),
          this.delegate.bindingDisconnected(e));
      }
      disconnectAllActions() {
        this.bindings.forEach((t) => this.delegate.bindingDisconnected(t, !0)),
          this.bindingsByAction.clear();
      }
      parseValueForToken(t) {
        let e = ce.forToken(t, this.schema);
        if (e.identifier == this.identifier) return e;
      }
      elementMatchedValue(t, e) {
        this.connectAction(e);
      }
      elementUnmatchedValue(t, e) {
        this.disconnectAction(e);
      }
    },
    fe = class {
      constructor(t, e) {
        (this.context = t),
          (this.receiver = e),
          (this.stringMapObserver = new he(this.element, this)),
          (this.valueDescriptorMap = this.controller.valueDescriptorMap);
      }
      start() {
        this.stringMapObserver.start(),
          this.invokeChangedCallbacksForDefaultValues();
      }
      stop() {
        this.stringMapObserver.stop();
      }
      get element() {
        return this.context.element;
      }
      get controller() {
        return this.context.controller;
      }
      getStringMapKeyForAttribute(t) {
        if (t in this.valueDescriptorMap)
          return this.valueDescriptorMap[t].name;
      }
      stringMapKeyAdded(t, e) {
        let i = this.valueDescriptorMap[e];
        this.hasValue(t) ||
          this.invokeChangedCallback(
            t,
            i.writer(this.receiver[t]),
            i.writer(i.defaultValue)
          );
      }
      stringMapValueChanged(t, e, i) {
        let n = this.valueDescriptorNameMap[e];
        t !== null &&
          (i === null && (i = n.writer(n.defaultValue)),
          this.invokeChangedCallback(e, t, i));
      }
      stringMapKeyRemoved(t, e, i) {
        let n = this.valueDescriptorNameMap[t];
        this.hasValue(t)
          ? this.invokeChangedCallback(t, n.writer(this.receiver[t]), i)
          : this.invokeChangedCallback(t, n.writer(n.defaultValue), i);
      }
      invokeChangedCallbacksForDefaultValues() {
        for (let { key: t, name: e, defaultValue: i, writer: n } of this
          .valueDescriptors)
          i != null &&
            !this.controller.data.has(t) &&
            this.invokeChangedCallback(e, n(i), void 0);
      }
      invokeChangedCallback(t, e, i) {
        let n = `${t}Changed`,
          o = this.receiver[n];
        if (typeof o == "function") {
          let l = this.valueDescriptorNameMap[t];
          try {
            let c = l.reader(e),
              u = i;
            i && (u = l.reader(i)), o.call(this.receiver, c, u);
          } catch (c) {
            throw (
              (c instanceof TypeError &&
                (c.message = `Stimulus Value "${this.context.identifier}.${l.name}" - ${c.message}`),
              c)
            );
          }
        }
      }
      get valueDescriptors() {
        let { valueDescriptorMap: t } = this;
        return Object.keys(t).map((e) => t[e]);
      }
      get valueDescriptorNameMap() {
        let t = {};
        return (
          Object.keys(this.valueDescriptorMap).forEach((e) => {
            let i = this.valueDescriptorMap[e];
            t[i.name] = i;
          }),
          t
        );
      }
      hasValue(t) {
        let e = this.valueDescriptorNameMap[t],
          i = `has${ft(e.name)}`;
        return this.receiver[i];
      }
    },
    pe = class {
      constructor(t, e) {
        (this.context = t), (this.delegate = e), (this.targetsByName = new j());
      }
      start() {
        this.tokenListObserver ||
          ((this.tokenListObserver = new Et(
            this.element,
            this.attributeName,
            this
          )),
          this.tokenListObserver.start());
      }
      stop() {
        this.tokenListObserver &&
          (this.disconnectAllTargets(),
          this.tokenListObserver.stop(),
          delete this.tokenListObserver);
      }
      tokenMatched({ element: t, content: e }) {
        this.scope.containsElement(t) && this.connectTarget(t, e);
      }
      tokenUnmatched({ element: t, content: e }) {
        this.disconnectTarget(t, e);
      }
      connectTarget(t, e) {
        var i;
        this.targetsByName.has(e, t) ||
          (this.targetsByName.add(e, t),
          (i = this.tokenListObserver) === null ||
            i === void 0 ||
            i.pause(() => this.delegate.targetConnected(t, e)));
      }
      disconnectTarget(t, e) {
        var i;
        this.targetsByName.has(e, t) &&
          (this.targetsByName.delete(e, t),
          (i = this.tokenListObserver) === null ||
            i === void 0 ||
            i.pause(() => this.delegate.targetDisconnected(t, e)));
      }
      disconnectAllTargets() {
        for (let t of this.targetsByName.keys)
          for (let e of this.targetsByName.getValuesForKey(t))
            this.disconnectTarget(e, t);
      }
      get attributeName() {
        return `data-${this.context.identifier}-target`;
      }
      get element() {
        return this.context.element;
      }
      get scope() {
        return this.context.scope;
      }
    };
  function pt(a, t) {
    let e = fi(a);
    return Array.from(
      e.reduce((i, n) => (Mn(n, t).forEach((o) => i.add(o)), i), new Set())
    );
  }
  function On(a, t) {
    return fi(a).reduce((i, n) => (i.push(...In(n, t)), i), []);
  }
  function fi(a) {
    let t = [];
    for (; a; ) t.push(a), (a = Object.getPrototypeOf(a));
    return t.reverse();
  }
  function Mn(a, t) {
    let e = a[t];
    return Array.isArray(e) ? e : [];
  }
  function In(a, t) {
    let e = a[t];
    return e ? Object.keys(e).map((i) => [i, e[i]]) : [];
  }
  var be = class {
      constructor(t, e) {
        (this.started = !1),
          (this.context = t),
          (this.delegate = e),
          (this.outletsByName = new j()),
          (this.outletElementsByName = new j()),
          (this.selectorObserverMap = new Map()),
          (this.attributeObserverMap = new Map());
      }
      start() {
        this.started ||
          (this.outletDefinitions.forEach((t) => {
            this.setupSelectorObserverForOutlet(t),
              this.setupAttributeObserverForOutlet(t);
          }),
          (this.started = !0),
          this.dependentContexts.forEach((t) => t.refresh()));
      }
      refresh() {
        this.selectorObserverMap.forEach((t) => t.refresh()),
          this.attributeObserverMap.forEach((t) => t.refresh());
      }
      stop() {
        this.started &&
          ((this.started = !1),
          this.disconnectAllOutlets(),
          this.stopSelectorObservers(),
          this.stopAttributeObservers());
      }
      stopSelectorObservers() {
        this.selectorObserverMap.size > 0 &&
          (this.selectorObserverMap.forEach((t) => t.stop()),
          this.selectorObserverMap.clear());
      }
      stopAttributeObservers() {
        this.attributeObserverMap.size > 0 &&
          (this.attributeObserverMap.forEach((t) => t.stop()),
          this.attributeObserverMap.clear());
      }
      selectorMatched(t, e, { outletName: i }) {
        let n = this.getOutlet(t, i);
        n && this.connectOutlet(n, t, i);
      }
      selectorUnmatched(t, e, { outletName: i }) {
        let n = this.getOutletFromMap(t, i);
        n && this.disconnectOutlet(n, t, i);
      }
      selectorMatchElement(t, { outletName: e }) {
        let i = this.selector(e),
          n = this.hasOutlet(t, e),
          o = t.matches(`[${this.schema.controllerAttribute}~=${e}]`);
        return i ? n && o && t.matches(i) : !1;
      }
      elementMatchedAttribute(t, e) {
        let i = this.getOutletNameFromOutletAttributeName(e);
        i && this.updateSelectorObserverForOutlet(i);
      }
      elementAttributeValueChanged(t, e) {
        let i = this.getOutletNameFromOutletAttributeName(e);
        i && this.updateSelectorObserverForOutlet(i);
      }
      elementUnmatchedAttribute(t, e) {
        let i = this.getOutletNameFromOutletAttributeName(e);
        i && this.updateSelectorObserverForOutlet(i);
      }
      connectOutlet(t, e, i) {
        var n;
        this.outletElementsByName.has(i, e) ||
          (this.outletsByName.add(i, t),
          this.outletElementsByName.add(i, e),
          (n = this.selectorObserverMap.get(i)) === null ||
            n === void 0 ||
            n.pause(() => this.delegate.outletConnected(t, e, i)));
      }
      disconnectOutlet(t, e, i) {
        var n;
        this.outletElementsByName.has(i, e) &&
          (this.outletsByName.delete(i, t),
          this.outletElementsByName.delete(i, e),
          (n = this.selectorObserverMap.get(i)) === null ||
            n === void 0 ||
            n.pause(() => this.delegate.outletDisconnected(t, e, i)));
      }
      disconnectAllOutlets() {
        for (let t of this.outletElementsByName.keys)
          for (let e of this.outletElementsByName.getValuesForKey(t))
            for (let i of this.outletsByName.getValuesForKey(t))
              this.disconnectOutlet(i, e, t);
      }
      updateSelectorObserverForOutlet(t) {
        let e = this.selectorObserverMap.get(t);
        e && (e.selector = this.selector(t));
      }
      setupSelectorObserverForOutlet(t) {
        let e = this.selector(t),
          i = new ue(document.body, e, this, { outletName: t });
        this.selectorObserverMap.set(t, i), i.start();
      }
      setupAttributeObserverForOutlet(t) {
        let e = this.attributeNameForOutletName(t),
          i = new Ct(this.scope.element, e, this);
        this.attributeObserverMap.set(t, i), i.start();
      }
      selector(t) {
        return this.scope.outlets.getSelectorForOutletName(t);
      }
      attributeNameForOutletName(t) {
        return this.scope.schema.outletAttributeForScope(this.identifier, t);
      }
      getOutletNameFromOutletAttributeName(t) {
        return this.outletDefinitions.find(
          (e) => this.attributeNameForOutletName(e) === t
        );
      }
      get outletDependencies() {
        let t = new j();
        return (
          this.router.modules.forEach((e) => {
            let i = e.definition.controllerConstructor;
            pt(i, "outlets").forEach((o) => t.add(o, e.identifier));
          }),
          t
        );
      }
      get outletDefinitions() {
        return this.outletDependencies.getKeysForValue(this.identifier);
      }
      get dependentControllerIdentifiers() {
        return this.outletDependencies.getValuesForKey(this.identifier);
      }
      get dependentContexts() {
        let t = this.dependentControllerIdentifiers;
        return this.router.contexts.filter((e) => t.includes(e.identifier));
      }
      hasOutlet(t, e) {
        return !!this.getOutlet(t, e) || !!this.getOutletFromMap(t, e);
      }
      getOutlet(t, e) {
        return this.application.getControllerForElementAndIdentifier(t, e);
      }
      getOutletFromMap(t, e) {
        return this.outletsByName
          .getValuesForKey(e)
          .find((i) => i.element === t);
      }
      get scope() {
        return this.context.scope;
      }
      get schema() {
        return this.context.schema;
      }
      get identifier() {
        return this.context.identifier;
      }
      get application() {
        return this.context.application;
      }
      get router() {
        return this.application.router;
      }
    },
    ge = class {
      constructor(t, e) {
        (this.logDebugActivity = (i, n = {}) => {
          let { identifier: o, controller: l, element: c } = this;
          (n = Object.assign({ identifier: o, controller: l, element: c }, n)),
            this.application.logDebugActivity(this.identifier, i, n);
        }),
          (this.module = t),
          (this.scope = e),
          (this.controller = new t.controllerConstructor(this)),
          (this.bindingObserver = new me(this, this.dispatcher)),
          (this.valueObserver = new fe(this, this.controller)),
          (this.targetObserver = new pe(this, this)),
          (this.outletObserver = new be(this, this));
        try {
          this.controller.initialize(), this.logDebugActivity("initialize");
        } catch (i) {
          this.handleError(i, "initializing controller");
        }
      }
      connect() {
        this.bindingObserver.start(),
          this.valueObserver.start(),
          this.targetObserver.start(),
          this.outletObserver.start();
        try {
          this.controller.connect(), this.logDebugActivity("connect");
        } catch (t) {
          this.handleError(t, "connecting controller");
        }
      }
      refresh() {
        this.outletObserver.refresh();
      }
      disconnect() {
        try {
          this.controller.disconnect(), this.logDebugActivity("disconnect");
        } catch (t) {
          this.handleError(t, "disconnecting controller");
        }
        this.outletObserver.stop(),
          this.targetObserver.stop(),
          this.valueObserver.stop(),
          this.bindingObserver.stop();
      }
      get application() {
        return this.module.application;
      }
      get identifier() {
        return this.module.identifier;
      }
      get schema() {
        return this.application.schema;
      }
      get dispatcher() {
        return this.application.dispatcher;
      }
      get element() {
        return this.scope.element;
      }
      get parentElement() {
        return this.element.parentElement;
      }
      handleError(t, e, i = {}) {
        let { identifier: n, controller: o, element: l } = this;
        (i = Object.assign({ identifier: n, controller: o, element: l }, i)),
          this.application.handleError(t, `Error ${e}`, i);
      }
      targetConnected(t, e) {
        this.invokeControllerMethod(`${e}TargetConnected`, t);
      }
      targetDisconnected(t, e) {
        this.invokeControllerMethod(`${e}TargetDisconnected`, t);
      }
      outletConnected(t, e, i) {
        this.invokeControllerMethod(`${re(i)}OutletConnected`, t, e);
      }
      outletDisconnected(t, e, i) {
        this.invokeControllerMethod(`${re(i)}OutletDisconnected`, t, e);
      }
      invokeControllerMethod(t, ...e) {
        let i = this.controller;
        typeof i[t] == "function" && i[t](...e);
      }
    };
  function Rn(a) {
    return Vn(a, Yn(a));
  }
  function Vn(a, t) {
    let e = Gn(a),
      i = _n(a.prototype, t);
    return Object.defineProperties(e.prototype, i), e;
  }
  function Yn(a) {
    return pt(a, "blessings").reduce((e, i) => {
      let n = i(a);
      for (let o in n) {
        let l = e[o] || {};
        e[o] = Object.assign(l, n[o]);
      }
      return e;
    }, {});
  }
  function _n(a, t) {
    return Xn(t).reduce((e, i) => {
      let n = Dn(a, t, i);
      return n && Object.assign(e, { [i]: n }), e;
    }, {});
  }
  function Dn(a, t, e) {
    let i = Object.getOwnPropertyDescriptor(a, e);
    if (!(i && "value" in i)) {
      let o = Object.getOwnPropertyDescriptor(t, e).value;
      return i && ((o.get = i.get || o.get), (o.set = i.set || o.set)), o;
    }
  }
  var Xn =
      typeof Object.getOwnPropertySymbols == "function"
        ? (a) => [
            ...Object.getOwnPropertyNames(a),
            ...Object.getOwnPropertySymbols(a),
          ]
        : Object.getOwnPropertyNames,
    Gn = (() => {
      function a(e) {
        function i() {
          return Reflect.construct(e, arguments, new.target);
        }
        return (
          (i.prototype = Object.create(e.prototype, {
            constructor: { value: i },
          })),
          Reflect.setPrototypeOf(i, e),
          i
        );
      }
      function t() {
        let i = a(function () {
          this.a.call(this);
        });
        return (i.prototype.a = function () {}), new i();
      }
      try {
        return t(), a;
      } catch {
        return (i) => class extends i {};
      }
    })();
  function Nn(a) {
    return {
      identifier: a.identifier,
      controllerConstructor: Rn(a.controllerConstructor),
    };
  }
  var Qe = class {
      constructor(t, e) {
        (this.application = t),
          (this.definition = Nn(e)),
          (this.contextsByScope = new WeakMap()),
          (this.connectedContexts = new Set());
      }
      get identifier() {
        return this.definition.identifier;
      }
      get controllerConstructor() {
        return this.definition.controllerConstructor;
      }
      get contexts() {
        return Array.from(this.connectedContexts);
      }
      connectContextForScope(t) {
        let e = this.fetchContextForScope(t);
        this.connectedContexts.add(e), e.connect();
      }
      disconnectContextForScope(t) {
        let e = this.contextsByScope.get(t);
        e && (this.connectedContexts.delete(e), e.disconnect());
      }
      fetchContextForScope(t) {
        let e = this.contextsByScope.get(t);
        return e || ((e = new ge(this, t)), this.contextsByScope.set(t, e)), e;
      }
    },
    Fe = class {
      constructor(t) {
        this.scope = t;
      }
      has(t) {
        return this.data.has(this.getDataKey(t));
      }
      get(t) {
        return this.getAll(t)[0];
      }
      getAll(t) {
        let e = this.data.get(this.getDataKey(t)) || "";
        return xn(e);
      }
      getAttributeName(t) {
        return this.data.getAttributeNameForKey(this.getDataKey(t));
      }
      getDataKey(t) {
        return `${t}-class`;
      }
      get data() {
        return this.scope.data;
      }
    },
    ye = class {
      constructor(t) {
        this.scope = t;
      }
      get element() {
        return this.scope.element;
      }
      get identifier() {
        return this.scope.identifier;
      }
      get(t) {
        let e = this.getAttributeNameForKey(t);
        return this.element.getAttribute(e);
      }
      set(t, e) {
        let i = this.getAttributeNameForKey(t);
        return this.element.setAttribute(i, e), this.get(t);
      }
      has(t) {
        let e = this.getAttributeNameForKey(t);
        return this.element.hasAttribute(e);
      }
      delete(t) {
        if (this.has(t)) {
          let e = this.getAttributeNameForKey(t);
          return this.element.removeAttribute(e), !0;
        } else return !1;
      }
      getAttributeNameForKey(t) {
        return `data-${this.identifier}-${hi(t)}`;
      }
    },
    ve = class {
      constructor(t) {
        (this.warnedKeysByObject = new WeakMap()), (this.logger = t);
      }
      warn(t, e, i) {
        let n = this.warnedKeysByObject.get(t);
        n || ((n = new Set()), this.warnedKeysByObject.set(t, n)),
          n.has(e) || (n.add(e), this.logger.warn(i, t));
      }
    };
  function Be(a, t) {
    return `[${a}~="${t}"]`;
  }
  var xe = class {
      constructor(t) {
        this.scope = t;
      }
      get element() {
        return this.scope.element;
      }
      get identifier() {
        return this.scope.identifier;
      }
      get schema() {
        return this.scope.schema;
      }
      has(t) {
        return this.find(t) != null;
      }
      find(...t) {
        return t.reduce(
          (e, i) => e || this.findTarget(i) || this.findLegacyTarget(i),
          void 0
        );
      }
      findAll(...t) {
        return t.reduce(
          (e, i) => [
            ...e,
            ...this.findAllTargets(i),
            ...this.findAllLegacyTargets(i),
          ],
          []
        );
      }
      findTarget(t) {
        let e = this.getSelectorForTargetName(t);
        return this.scope.findElement(e);
      }
      findAllTargets(t) {
        let e = this.getSelectorForTargetName(t);
        return this.scope.findAllElements(e);
      }
      getSelectorForTargetName(t) {
        let e = this.schema.targetAttributeForScope(this.identifier);
        return Be(e, t);
      }
      findLegacyTarget(t) {
        let e = this.getLegacySelectorForTargetName(t);
        return this.deprecate(this.scope.findElement(e), t);
      }
      findAllLegacyTargets(t) {
        let e = this.getLegacySelectorForTargetName(t);
        return this.scope.findAllElements(e).map((i) => this.deprecate(i, t));
      }
      getLegacySelectorForTargetName(t) {
        let e = `${this.identifier}.${t}`;
        return Be(this.schema.targetAttribute, e);
      }
      deprecate(t, e) {
        if (t) {
          let { identifier: i } = this,
            n = this.schema.targetAttribute,
            o = this.schema.targetAttributeForScope(i);
          this.guide.warn(
            t,
            `target:${e}`,
            `Please replace ${n}="${i}.${e}" with ${o}="${e}". The ${n} attribute is deprecated and will be removed in a future version of Stimulus.`
          );
        }
        return t;
      }
      get guide() {
        return this.scope.guide;
      }
    },
    Ue = class {
      constructor(t, e) {
        (this.scope = t), (this.controllerElement = e);
      }
      get element() {
        return this.scope.element;
      }
      get identifier() {
        return this.scope.identifier;
      }
      get schema() {
        return this.scope.schema;
      }
      has(t) {
        return this.find(t) != null;
      }
      find(...t) {
        return t.reduce((e, i) => e || this.findOutlet(i), void 0);
      }
      findAll(...t) {
        return t.reduce((e, i) => [...e, ...this.findAllOutlets(i)], []);
      }
      getSelectorForOutletName(t) {
        let e = this.schema.outletAttributeForScope(this.identifier, t);
        return this.controllerElement.getAttribute(e);
      }
      findOutlet(t) {
        let e = this.getSelectorForOutletName(t);
        if (e) return this.findElement(e, t);
      }
      findAllOutlets(t) {
        let e = this.getSelectorForOutletName(t);
        return e ? this.findAllElements(e, t) : [];
      }
      findElement(t, e) {
        return this.scope
          .queryElements(t)
          .filter((n) => this.matchesElement(n, t, e))[0];
      }
      findAllElements(t, e) {
        return this.scope
          .queryElements(t)
          .filter((n) => this.matchesElement(n, t, e));
      }
      matchesElement(t, e, i) {
        let n = t.getAttribute(this.scope.schema.controllerAttribute) || "";
        return t.matches(e) && n.split(" ").includes(i);
      }
    },
    we = class a {
      constructor(t, e, i, n) {
        (this.targets = new xe(this)),
          (this.classes = new Fe(this)),
          (this.data = new ye(this)),
          (this.containsElement = (o) =>
            o.closest(this.controllerSelector) === this.element),
          (this.schema = t),
          (this.element = e),
          (this.identifier = i),
          (this.guide = new ve(n)),
          (this.outlets = new Ue(this.documentScope, e));
      }
      findElement(t) {
        return this.element.matches(t)
          ? this.element
          : this.queryElements(t).find(this.containsElement);
      }
      findAllElements(t) {
        return [
          ...(this.element.matches(t) ? [this.element] : []),
          ...this.queryElements(t).filter(this.containsElement),
        ];
      }
      queryElements(t) {
        return Array.from(this.element.querySelectorAll(t));
      }
      get controllerSelector() {
        return Be(this.schema.controllerAttribute, this.identifier);
      }
      get isDocumentScope() {
        return this.element === document.documentElement;
      }
      get documentScope() {
        return this.isDocumentScope
          ? this
          : new a(
              this.schema,
              document.documentElement,
              this.identifier,
              this.guide.logger
            );
      }
    },
    Le = class {
      constructor(t, e, i) {
        (this.element = t),
          (this.schema = e),
          (this.delegate = i),
          (this.valueListObserver = new Zt(
            this.element,
            this.controllerAttribute,
            this
          )),
          (this.scopesByIdentifierByElement = new WeakMap()),
          (this.scopeReferenceCounts = new WeakMap());
      }
      start() {
        this.valueListObserver.start();
      }
      stop() {
        this.valueListObserver.stop();
      }
      get controllerAttribute() {
        return this.schema.controllerAttribute;
      }
      parseValueForToken(t) {
        let { element: e, content: i } = t;
        return this.parseValueForElementAndIdentifier(e, i);
      }
      parseValueForElementAndIdentifier(t, e) {
        let i = this.fetchScopesByIdentifierForElement(t),
          n = i.get(e);
        return (
          n ||
            ((n = this.delegate.createScopeForElementAndIdentifier(t, e)),
            i.set(e, n)),
          n
        );
      }
      elementMatchedValue(t, e) {
        let i = (this.scopeReferenceCounts.get(e) || 0) + 1;
        this.scopeReferenceCounts.set(e, i),
          i == 1 && this.delegate.scopeConnected(e);
      }
      elementUnmatchedValue(t, e) {
        let i = this.scopeReferenceCounts.get(e);
        i &&
          (this.scopeReferenceCounts.set(e, i - 1),
          i == 1 && this.delegate.scopeDisconnected(e));
      }
      fetchScopesByIdentifierForElement(t) {
        let e = this.scopesByIdentifierByElement.get(t);
        return (
          e || ((e = new Map()), this.scopesByIdentifierByElement.set(t, e)), e
        );
      }
    },
    We = class {
      constructor(t) {
        (this.application = t),
          (this.scopeObserver = new Le(this.element, this.schema, this)),
          (this.scopesByIdentifier = new j()),
          (this.modulesByIdentifier = new Map());
      }
      get element() {
        return this.application.element;
      }
      get schema() {
        return this.application.schema;
      }
      get logger() {
        return this.application.logger;
      }
      get controllerAttribute() {
        return this.schema.controllerAttribute;
      }
      get modules() {
        return Array.from(this.modulesByIdentifier.values());
      }
      get contexts() {
        return this.modules.reduce((t, e) => t.concat(e.contexts), []);
      }
      start() {
        this.scopeObserver.start();
      }
      stop() {
        this.scopeObserver.stop();
      }
      loadDefinition(t) {
        this.unloadIdentifier(t.identifier);
        let e = new Qe(this.application, t);
        this.connectModule(e);
        let i = t.controllerConstructor.afterLoad;
        i && i.call(t.controllerConstructor, t.identifier, this.application);
      }
      unloadIdentifier(t) {
        let e = this.modulesByIdentifier.get(t);
        e && this.disconnectModule(e);
      }
      getContextForElementAndIdentifier(t, e) {
        let i = this.modulesByIdentifier.get(e);
        if (i) return i.contexts.find((n) => n.element == t);
      }
      proposeToConnectScopeForElementAndIdentifier(t, e) {
        let i = this.scopeObserver.parseValueForElementAndIdentifier(t, e);
        i
          ? this.scopeObserver.elementMatchedValue(i.element, i)
          : console.error(
              `Couldn't find or create scope for identifier: "${e}" and element:`,
              t
            );
      }
      handleError(t, e, i) {
        this.application.handleError(t, e, i);
      }
      createScopeForElementAndIdentifier(t, e) {
        return new we(this.schema, t, e, this.logger);
      }
      scopeConnected(t) {
        this.scopesByIdentifier.add(t.identifier, t);
        let e = this.modulesByIdentifier.get(t.identifier);
        e && e.connectContextForScope(t);
      }
      scopeDisconnected(t) {
        this.scopesByIdentifier.delete(t.identifier, t);
        let e = this.modulesByIdentifier.get(t.identifier);
        e && e.disconnectContextForScope(t);
      }
      connectModule(t) {
        this.modulesByIdentifier.set(t.identifier, t),
          this.scopesByIdentifier
            .getValuesForKey(t.identifier)
            .forEach((i) => t.connectContextForScope(i));
      }
      disconnectModule(t) {
        this.modulesByIdentifier.delete(t.identifier),
          this.scopesByIdentifier
            .getValuesForKey(t.identifier)
            .forEach((i) => t.disconnectContextForScope(i));
      }
    },
    Tn = {
      controllerAttribute: "data-controller",
      actionAttribute: "data-action",
      targetAttribute: "data-target",
      targetAttributeForScope: (a) => `data-${a}-target`,
      outletAttributeForScope: (a, t) => `data-${a}-${t}-outlet`,
      keyMappings: Object.assign(
        Object.assign(
          {
            enter: "Enter",
            tab: "Tab",
            esc: "Escape",
            space: " ",
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight",
            home: "Home",
            end: "End",
            page_up: "PageUp",
            page_down: "PageDown",
          },
          ai("abcdefghijklmnopqrstuvwxyz".split("").map((a) => [a, a]))
        ),
        ai("0123456789".split("").map((a) => [a, a]))
      ),
    };
  function ai(a) {
    return a.reduce(
      (t, [e, i]) => Object.assign(Object.assign({}, t), { [e]: i }),
      {}
    );
  }
  var kt = class {
    constructor(t = document.documentElement, e = Tn) {
      (this.logger = console),
        (this.debug = !1),
        (this.logDebugActivity = (i, n, o = {}) => {
          this.debug && this.logFormattedMessage(i, n, o);
        }),
        (this.element = t),
        (this.schema = e),
        (this.dispatcher = new ae(this)),
        (this.router = new We(this)),
        (this.actionDescriptorFilters = Object.assign({}, gn));
    }
    static start(t, e) {
      let i = new this(t, e);
      return i.start(), i;
    }
    async start() {
      await An(),
        this.logDebugActivity("application", "starting"),
        this.dispatcher.start(),
        this.router.start(),
        this.logDebugActivity("application", "start");
    }
    stop() {
      this.logDebugActivity("application", "stopping"),
        this.dispatcher.stop(),
        this.router.stop(),
        this.logDebugActivity("application", "stop");
    }
    register(t, e) {
      this.load({ identifier: t, controllerConstructor: e });
    }
    registerActionOption(t, e) {
      this.actionDescriptorFilters[t] = e;
    }
    load(t, ...e) {
      (Array.isArray(t) ? t : [t, ...e]).forEach((n) => {
        n.controllerConstructor.shouldLoad && this.router.loadDefinition(n);
      });
    }
    unload(t, ...e) {
      (Array.isArray(t) ? t : [t, ...e]).forEach((n) =>
        this.router.unloadIdentifier(n)
      );
    }
    get controllers() {
      return this.router.contexts.map((t) => t.controller);
    }
    getControllerForElementAndIdentifier(t, e) {
      let i = this.router.getContextForElementAndIdentifier(t, e);
      return i ? i.controller : null;
    }
    handleError(t, e, i) {
      var n;
      this.logger.error(
        `%s

%o

%o`,
        e,
        t,
        i
      ),
        (n = window.onerror) === null ||
          n === void 0 ||
          n.call(window, e, "", 0, 0, t);
    }
    logFormattedMessage(t, e, i = {}) {
      (i = Object.assign({ application: this }, i)),
        this.logger.groupCollapsed(`${t} #${e}`),
        this.logger.log("details:", Object.assign({}, i)),
        this.logger.groupEnd();
    }
  };
  function An() {
    return new Promise((a) => {
      document.readyState == "loading"
        ? document.addEventListener("DOMContentLoaded", () => a())
        : a();
    });
  }
  function Sn(a) {
    return pt(a, "classes").reduce((e, i) => Object.assign(e, zn(i)), {});
  }
  function zn(a) {
    return {
      [`${a}Class`]: {
        get() {
          let { classes: t } = this;
          if (t.has(a)) return t.get(a);
          {
            let e = t.getAttributeName(a);
            throw new Error(`Missing attribute "${e}"`);
          }
        },
      },
      [`${a}Classes`]: {
        get() {
          return this.classes.getAll(a);
        },
      },
      [`has${ft(a)}Class`]: {
        get() {
          return this.classes.has(a);
        },
      },
    };
  }
  function jn(a) {
    return pt(a, "outlets").reduce((e, i) => Object.assign(e, Jn(i)), {});
  }
  function ri(a, t, e) {
    return a.application.getControllerForElementAndIdentifier(t, e);
  }
  function li(a, t, e) {
    let i = ri(a, t, e);
    if (
      i ||
      (a.application.router.proposeToConnectScopeForElementAndIdentifier(t, e),
      (i = ri(a, t, e)),
      i)
    )
      return i;
  }
  function Jn(a) {
    let t = re(a);
    return {
      [`${t}Outlet`]: {
        get() {
          let e = this.outlets.find(a),
            i = this.outlets.getSelectorForOutletName(a);
          if (e) {
            let n = li(this, e, a);
            if (n) return n;
            throw new Error(
              `The provided outlet element is missing an outlet controller "${a}" instance for host controller "${this.identifier}"`
            );
          }
          throw new Error(
            `Missing outlet element "${a}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${i}".`
          );
        },
      },
      [`${t}Outlets`]: {
        get() {
          let e = this.outlets.findAll(a);
          return e.length > 0
            ? e
                .map((i) => {
                  let n = li(this, i, a);
                  if (n) return n;
                  console.warn(
                    `The provided outlet element is missing an outlet controller "${a}" instance for host controller "${this.identifier}"`,
                    i
                  );
                })
                .filter((i) => i)
            : [];
        },
      },
      [`${t}OutletElement`]: {
        get() {
          let e = this.outlets.find(a),
            i = this.outlets.getSelectorForOutletName(a);
          if (e) return e;
          throw new Error(
            `Missing outlet element "${a}" for host controller "${this.identifier}". Stimulus couldn't find a matching outlet element using selector "${i}".`
          );
        },
      },
      [`${t}OutletElements`]: {
        get() {
          return this.outlets.findAll(a);
        },
      },
      [`has${ft(t)}Outlet`]: {
        get() {
          return this.outlets.has(a);
        },
      },
    };
  }
  function Hn(a) {
    return pt(a, "targets").reduce((e, i) => Object.assign(e, Pn(i)), {});
  }
  function Pn(a) {
    return {
      [`${a}Target`]: {
        get() {
          let t = this.targets.find(a);
          if (t) return t;
          throw new Error(
            `Missing target element "${a}" for "${this.identifier}" controller`
          );
        },
      },
      [`${a}Targets`]: {
        get() {
          return this.targets.findAll(a);
        },
      },
      [`has${ft(a)}Target`]: {
        get() {
          return this.targets.has(a);
        },
      },
    };
  }
  function Kn(a) {
    let t = On(a, "values"),
      e = {
        valueDescriptorMap: {
          get() {
            return t.reduce((i, n) => {
              let o = pi(n, this.identifier),
                l = this.data.getAttributeNameForKey(o.key);
              return Object.assign(i, { [l]: o });
            }, {});
          },
        },
      };
    return t.reduce((i, n) => Object.assign(i, $n(n)), e);
  }
  function $n(a, t) {
    let e = pi(a, t),
      { key: i, name: n, reader: o, writer: l } = e;
    return {
      [n]: {
        get() {
          let c = this.data.get(i);
          return c !== null ? o(c) : e.defaultValue;
        },
        set(c) {
          c === void 0 ? this.data.delete(i) : this.data.set(i, l(c));
        },
      },
      [`has${ft(n)}`]: {
        get() {
          return this.data.has(i) || e.hasCustomDefaultValue;
        },
      },
    };
  }
  function pi([a, t], e) {
    return is({ controller: e, token: a, typeDefinition: t });
  }
  function Ot(a) {
    switch (a) {
      case Array:
        return "array";
      case Boolean:
        return "boolean";
      case Number:
        return "number";
      case Object:
        return "object";
      case String:
        return "string";
    }
  }
  function mt(a) {
    switch (typeof a) {
      case "boolean":
        return "boolean";
      case "number":
        return "number";
      case "string":
        return "string";
    }
    if (Array.isArray(a)) return "array";
    if (Object.prototype.toString.call(a) === "[object Object]")
      return "object";
  }
  function qn(a) {
    let { controller: t, token: e, typeObject: i } = a,
      n = ni(i.type),
      o = ni(i.default),
      l = n && o,
      c = n && !o,
      u = !n && o,
      m = Ot(i.type),
      s = mt(a.typeObject.default);
    if (c) return m;
    if (u) return s;
    if (m !== s) {
      let r = t ? `${t}.${e}` : e;
      throw new Error(
        `The specified default value for the Stimulus Value "${r}" must match the defined type "${m}". The provided default value of "${i.default}" is of type "${s}".`
      );
    }
    if (l) return m;
  }
  function ts(a) {
    let { controller: t, token: e, typeDefinition: i } = a,
      o = qn({ controller: t, token: e, typeObject: i }),
      l = mt(i),
      c = Ot(i),
      u = o || l || c;
    if (u) return u;
    let m = t ? `${t}.${i}` : e;
    throw new Error(`Unknown value type "${m}" for "${e}" value`);
  }
  function es(a) {
    let t = Ot(a);
    if (t) return ci[t];
    let e = le(a, "default"),
      i = le(a, "type"),
      n = a;
    if (e) return n.default;
    if (i) {
      let { type: o } = n,
        l = Ot(o);
      if (l) return ci[l];
    }
    return a;
  }
  function is(a) {
    let { token: t, typeDefinition: e } = a,
      i = `${hi(t)}-value`,
      n = ts(a);
    return {
      type: n,
      key: i,
      name: Ce(i),
      get defaultValue() {
        return es(e);
      },
      get hasCustomDefaultValue() {
        return mt(e) !== void 0;
      },
      reader: ns[n],
      writer: di[n] || di.default,
    };
  }
  var ci = {
      get array() {
        return [];
      },
      boolean: !1,
      number: 0,
      get object() {
        return {};
      },
      string: "",
    },
    ns = {
      array(a) {
        let t = JSON.parse(a);
        if (!Array.isArray(t))
          throw new TypeError(
            `expected value of type "array" but instead got value "${a}" of type "${mt(
              t
            )}"`
          );
        return t;
      },
      boolean(a) {
        return !(a == "0" || String(a).toLowerCase() == "false");
      },
      number(a) {
        return Number(a.replace(/_/g, ""));
      },
      object(a) {
        let t = JSON.parse(a);
        if (t === null || typeof t != "object" || Array.isArray(t))
          throw new TypeError(
            `expected value of type "object" but instead got value "${a}" of type "${mt(
              t
            )}"`
          );
        return t;
      },
      string(a) {
        return a;
      },
    },
    di = { default: ss, array: ui, object: ui };
  function ui(a) {
    return JSON.stringify(a);
  }
  function ss(a) {
    return `${a}`;
  }
  var _ = class {
    constructor(t) {
      this.context = t;
    }
    static get shouldLoad() {
      return !0;
    }
    static afterLoad(t, e) {}
    get application() {
      return this.context.application;
    }
    get scope() {
      return this.context.scope;
    }
    get element() {
      return this.scope.element;
    }
    get identifier() {
      return this.scope.identifier;
    }
    get targets() {
      return this.scope.targets;
    }
    get outlets() {
      return this.scope.outlets;
    }
    get classes() {
      return this.scope.classes;
    }
    get data() {
      return this.scope.data;
    }
    initialize() {}
    connect() {}
    disconnect() {}
    dispatch(
      t,
      {
        target: e = this.element,
        detail: i = {},
        prefix: n = this.identifier,
        bubbles: o = !0,
        cancelable: l = !0,
      } = {}
    ) {
      let c = n ? `${n}:${t}` : t,
        u = new CustomEvent(c, { detail: i, bubbles: o, cancelable: l });
      return e.dispatchEvent(u), u;
    }
  };
  _.blessings = [Sn, Hn, Kn, jn];
  _.targets = [];
  _.outlets = [];
  _.values = {};
  var $e = {};
  ne($e, { default: () => Ke });
  var F = (a, t = 1e4) => (
      (a = parseFloat(a + "") || 0), Math.round((a + Number.EPSILON) * t) / t
    ),
    Se = function (a) {
      if (!(a && a instanceof Element && a.offsetParent)) return !1;
      let t = a.scrollHeight > a.clientHeight,
        e = window.getComputedStyle(a).overflowY,
        i = e.indexOf("hidden") !== -1,
        n = e.indexOf("visible") !== -1;
      return t && !i && !n;
    },
    St = function (a, t = void 0) {
      return (
        !(!a || a === document.body || (t && a === t)) &&
        (Se(a) ? a : St(a.parentElement, t))
      );
    },
    S = function (a) {
      var t = new DOMParser().parseFromString(a, "text/html").body;
      if (t.childElementCount > 1) {
        for (var e = document.createElement("div"); t.firstChild; )
          e.appendChild(t.firstChild);
        return e;
      }
      return t.firstChild;
    },
    He = (a) => `${a || ""}`.split(" ").filter((t) => !!t),
    z = (a, t, e) => {
      a &&
        He(t).forEach((i) => {
          a.classList.toggle(i, e || !1);
        });
    },
    $ = class {
      constructor(t) {
        Object.defineProperty(this, "pageX", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
          Object.defineProperty(this, "pageY", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "clientX", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "clientY", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "id", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "time", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "nativePointer", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          (this.nativePointer = t),
          (this.pageX = t.pageX),
          (this.pageY = t.pageY),
          (this.clientX = t.clientX),
          (this.clientY = t.clientY),
          (this.id = self.Touch && t instanceof Touch ? t.identifier : -1),
          (this.time = Date.now());
      }
    },
    ot = { passive: !1 },
    ze = class {
      constructor(
        t,
        { start: e = () => !0, move: i = () => {}, end: n = () => {} }
      ) {
        Object.defineProperty(this, "element", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: void 0,
        }),
          Object.defineProperty(this, "startCallback", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "moveCallback", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "endCallback", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "currentPointers", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: [],
          }),
          Object.defineProperty(this, "startPointers", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: [],
          }),
          (this.element = t),
          (this.startCallback = e),
          (this.moveCallback = i),
          (this.endCallback = n);
        for (let o of [
          "onPointerStart",
          "onTouchStart",
          "onMove",
          "onTouchEnd",
          "onPointerEnd",
          "onWindowBlur",
        ])
          this[o] = this[o].bind(this);
        this.element.addEventListener("mousedown", this.onPointerStart, ot),
          this.element.addEventListener("touchstart", this.onTouchStart, ot),
          this.element.addEventListener("touchmove", this.onMove, ot),
          this.element.addEventListener("touchend", this.onTouchEnd),
          this.element.addEventListener("touchcancel", this.onTouchEnd);
      }
      onPointerStart(t) {
        if (!t.buttons || t.button !== 0) return;
        let e = new $(t);
        this.currentPointers.some((i) => i.id === e.id) ||
          (this.triggerPointerStart(e, t) &&
            (window.addEventListener("mousemove", this.onMove),
            window.addEventListener("mouseup", this.onPointerEnd),
            window.addEventListener("blur", this.onWindowBlur)));
      }
      onTouchStart(t) {
        for (let e of Array.from(t.changedTouches || []))
          this.triggerPointerStart(new $(e), t);
        window.addEventListener("blur", this.onWindowBlur);
      }
      onMove(t) {
        let e = this.currentPointers.slice(),
          i =
            "changedTouches" in t
              ? Array.from(t.changedTouches || []).map((o) => new $(o))
              : [new $(t)],
          n = [];
        for (let o of i) {
          let l = this.currentPointers.findIndex((c) => c.id === o.id);
          l < 0 || (n.push(o), (this.currentPointers[l] = o));
        }
        n.length && this.moveCallback(t, this.currentPointers.slice(), e);
      }
      onPointerEnd(t) {
        (t.buttons > 0 && t.button !== 0) ||
          (this.triggerPointerEnd(t, new $(t)),
          window.removeEventListener("mousemove", this.onMove),
          window.removeEventListener("mouseup", this.onPointerEnd),
          window.removeEventListener("blur", this.onWindowBlur));
      }
      onTouchEnd(t) {
        for (let e of Array.from(t.changedTouches || []))
          this.triggerPointerEnd(t, new $(e));
      }
      triggerPointerStart(t, e) {
        return (
          !!this.startCallback(e, t, this.currentPointers.slice()) &&
          (this.currentPointers.push(t), this.startPointers.push(t), !0)
        );
      }
      triggerPointerEnd(t, e) {
        let i = this.currentPointers.findIndex((n) => n.id === e.id);
        i < 0 ||
          (this.currentPointers.splice(i, 1),
          this.startPointers.splice(i, 1),
          this.endCallback(t, e, this.currentPointers.slice()));
      }
      onWindowBlur() {
        this.clear();
      }
      clear() {
        for (; this.currentPointers.length; ) {
          let t = this.currentPointers[this.currentPointers.length - 1];
          this.currentPointers.splice(this.currentPointers.length - 1, 1),
            this.startPointers.splice(this.currentPointers.length - 1, 1),
            this.endCallback(
              new Event("touchend", {
                bubbles: !0,
                cancelable: !0,
                clientX: t.clientX,
                clientY: t.clientY,
              }),
              t,
              this.currentPointers.slice()
            );
        }
      }
      stop() {
        this.element.removeEventListener("mousedown", this.onPointerStart, ot),
          this.element.removeEventListener("touchstart", this.onTouchStart, ot),
          this.element.removeEventListener("touchmove", this.onMove, ot),
          this.element.removeEventListener("touchend", this.onTouchEnd),
          this.element.removeEventListener("touchcancel", this.onTouchEnd),
          window.removeEventListener("mousemove", this.onMove),
          window.removeEventListener("mouseup", this.onPointerEnd),
          window.removeEventListener("blur", this.onWindowBlur);
      }
    };
  function bi(a, t) {
    return t
      ? Math.sqrt(
          Math.pow(t.clientX - a.clientX, 2) +
            Math.pow(t.clientY - a.clientY, 2)
        )
      : 0;
  }
  function gi(a, t) {
    return t
      ? {
          clientX: (a.clientX + t.clientX) / 2,
          clientY: (a.clientY + t.clientY) / 2,
        }
      : a;
  }
  var je = (a) =>
      typeof a == "object" &&
      a !== null &&
      a.constructor === Object &&
      Object.prototype.toString.call(a) === "[object Object]",
    V = (a, ...t) => {
      let e = t.length;
      for (let i = 0; i < e; i++) {
        let n = t[i] || {};
        Object.entries(n).forEach(([o, l]) => {
          let c = Array.isArray(l) ? [] : {};
          a[o] || Object.assign(a, { [o]: c }),
            je(l)
              ? Object.assign(a[o], V(c, l))
              : Array.isArray(l)
              ? Object.assign(a, { [o]: [...l] })
              : Object.assign(a, { [o]: l });
        });
      }
      return a;
    },
    Ee = function (a, t) {
      return a
        .split(".")
        .reduce((e, i) => (typeof e == "object" ? e[i] : void 0), t);
    },
    ut = class {
      constructor(t = {}) {
        Object.defineProperty(this, "options", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: t,
        }),
          Object.defineProperty(this, "events", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: new Map(),
          }),
          this.setOptions(t);
        for (let e of Object.getOwnPropertyNames(Object.getPrototypeOf(this)))
          e.startsWith("on") &&
            typeof this[e] == "function" &&
            (this[e] = this[e].bind(this));
      }
      setOptions(t) {
        this.options = t ? V({}, this.constructor.defaults, t) : {};
        for (let [e, i] of Object.entries(this.option("on") || {}))
          this.on(e, i);
      }
      option(t, ...e) {
        let i = Ee(t, this.options);
        return i && typeof i == "function" && (i = i.call(this, this, ...e)), i;
      }
      optionFor(t, e, i, ...n) {
        let o = Ee(e, t);
        var l;
        typeof (l = o) != "string" ||
          isNaN(l) ||
          isNaN(parseFloat(l)) ||
          (o = parseFloat(o)),
          o === "true" && (o = !0),
          o === "false" && (o = !1),
          o && typeof o == "function" && (o = o.call(this, this, t, ...n));
        let c = Ee(e, this.options);
        return (
          c && typeof c == "function"
            ? (o = c.call(this, this, t, ...n, o))
            : o === void 0 && (o = c),
          o === void 0 ? i : o
        );
      }
      cn(t) {
        let e = this.options.classes;
        return (e && e[t]) || "";
      }
      localize(t, e = []) {
        t = String(t).replace(/\{\{(\w+).?(\w+)?\}\}/g, (i, n, o) => {
          let l = "";
          return (
            o
              ? (l = this.option(
                  `${n[0] + n.toLowerCase().substring(1)}.l10n.${o}`
                ))
              : n && (l = this.option(`l10n.${n}`)),
            l || (l = i),
            l
          );
        });
        for (let i = 0; i < e.length; i++) t = t.split(e[i][0]).join(e[i][1]);
        return (t = t.replace(/\{\{(.*?)\}\}/g, (i, n) => n));
      }
      on(t, e) {
        let i = [];
        typeof t == "string" ? (i = t.split(" ")) : Array.isArray(t) && (i = t),
          this.events || (this.events = new Map()),
          i.forEach((n) => {
            let o = this.events.get(n);
            o || (this.events.set(n, []), (o = [])),
              o.includes(e) || o.push(e),
              this.events.set(n, o);
          });
      }
      off(t, e) {
        let i = [];
        typeof t == "string" ? (i = t.split(" ")) : Array.isArray(t) && (i = t),
          i.forEach((n) => {
            let o = this.events.get(n);
            if (Array.isArray(o)) {
              let l = o.indexOf(e);
              l > -1 && o.splice(l, 1);
            }
          });
      }
      emit(t, ...e) {
        [...(this.events.get(t) || [])].forEach((i) => i(this, ...e)),
          t !== "*" && this.emit("*", t, ...e);
      }
    };
  Object.defineProperty(ut, "version", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: "5.0.36",
  }),
    Object.defineProperty(ut, "defaults", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {},
    });
  var yt = class extends ut {
      constructor(t = {}) {
        super(t),
          Object.defineProperty(this, "plugins", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: {},
          });
      }
      attachPlugins(t = {}) {
        let e = new Map();
        for (let [i, n] of Object.entries(t)) {
          let o = this.option(i),
            l = this.plugins[i];
          l || o === !1
            ? l && o === !1 && (l.detach(), delete this.plugins[i])
            : e.set(i, new n(this, o || {}));
        }
        for (let [i, n] of e) (this.plugins[i] = n), n.attach();
      }
      detachPlugins(t) {
        t = t || Object.keys(this.plugins);
        for (let e of t) {
          let i = this.plugins[e];
          i && i.detach(), delete this.plugins[e];
        }
        return this.emit("detachPlugins"), this;
      }
    },
    w;
  (function (a) {
    (a[(a.Init = 0)] = "Init"),
      (a[(a.Error = 1)] = "Error"),
      (a[(a.Ready = 2)] = "Ready"),
      (a[(a.Panning = 3)] = "Panning"),
      (a[(a.Mousemove = 4)] = "Mousemove"),
      (a[(a.Destroy = 5)] = "Destroy");
  })(w || (w = {}));
  var J = ["a", "b", "c", "d", "e", "f"],
    Si = {
      PANUP: "Move up",
      PANDOWN: "Move down",
      PANLEFT: "Move left",
      PANRIGHT: "Move right",
      ZOOMIN: "Zoom in",
      ZOOMOUT: "Zoom out",
      TOGGLEZOOM: "Toggle zoom level",
      TOGGLE1TO1: "Toggle zoom level",
      ITERATEZOOM: "Toggle zoom level",
      ROTATECCW: "Rotate counterclockwise",
      ROTATECW: "Rotate clockwise",
      FLIPX: "Flip horizontally",
      FLIPY: "Flip vertically",
      FITX: "Fit horizontally",
      FITY: "Fit vertically",
      RESET: "Reset",
      TOGGLEFS: "Toggle fullscreen",
    },
    os = {
      content: null,
      width: "auto",
      height: "auto",
      panMode: "drag",
      touch: !0,
      dragMinThreshold: 3,
      lockAxis: !1,
      mouseMoveFactor: 1,
      mouseMoveFriction: 0.12,
      zoom: !0,
      pinchToZoom: !0,
      panOnlyZoomed: "auto",
      minScale: 1,
      maxScale: 2,
      friction: 0.25,
      dragFriction: 0.35,
      decelFriction: 0.05,
      click: "toggleZoom",
      dblClick: !1,
      wheel: "zoom",
      wheelLimit: 7,
      spinner: !0,
      bounds: "auto",
      infinite: !1,
      rubberband: !0,
      bounce: !0,
      maxVelocity: 75,
      transformParent: !1,
      classes: {
        content: "f-panzoom__content",
        isLoading: "is-loading",
        canZoomIn: "can-zoom_in",
        canZoomOut: "can-zoom_out",
        isDraggable: "is-draggable",
        isDragging: "is-dragging",
        inFullscreen: "in-fullscreen",
        htmlHasFullscreen: "with-panzoom-in-fullscreen",
      },
      l10n: Si,
    },
    Qi = '<circle cx="25" cy="25" r="20"></circle>',
    Pe =
      '<div class="f-spinner"><svg viewBox="0 0 50 50">' +
      Qi +
      Qi +
      "</svg></div>",
    R = (a) => a && a !== null && a instanceof Element && "nodeType" in a,
    U = (a, t) => {
      a &&
        He(t).forEach((e) => {
          a.classList.remove(e);
        });
    },
    v = (a, t) => {
      a &&
        He(t).forEach((e) => {
          a.classList.add(e);
        });
    },
    Mt = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 },
    as = 1e5,
    It = 1e4,
    D = "mousemove",
    Fi = "drag",
    yi = "content",
    X = "auto",
    Ze = null,
    ke = null,
    st = class a extends yt {
      get fits() {
        return (
          this.contentRect.width - this.contentRect.fitWidth < 1 &&
          this.contentRect.height - this.contentRect.fitHeight < 1
        );
      }
      get isTouchDevice() {
        return (
          ke === null && (ke = window.matchMedia("(hover: none)").matches), ke
        );
      }
      get isMobile() {
        return (
          Ze === null &&
            (Ze = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)),
          Ze
        );
      }
      get panMode() {
        return this.options.panMode !== D || this.isTouchDevice ? Fi : D;
      }
      get panOnlyZoomed() {
        let t = this.options.panOnlyZoomed;
        return t === X ? this.isTouchDevice : t;
      }
      get isInfinite() {
        return this.option("infinite");
      }
      get angle() {
        return (
          (180 * Math.atan2(this.current.b, this.current.a)) / Math.PI || 0
        );
      }
      get targetAngle() {
        return (180 * Math.atan2(this.target.b, this.target.a)) / Math.PI || 0;
      }
      get scale() {
        let { a: t, b: e } = this.current;
        return Math.sqrt(t * t + e * e) || 1;
      }
      get targetScale() {
        let { a: t, b: e } = this.target;
        return Math.sqrt(t * t + e * e) || 1;
      }
      get minScale() {
        return this.option("minScale") || 1;
      }
      get fullScale() {
        let { contentRect: t } = this;
        return t.fullWidth / t.fitWidth || 1;
      }
      get maxScale() {
        return this.fullScale * (this.option("maxScale") || 1) || 1;
      }
      get coverScale() {
        let { containerRect: t, contentRect: e } = this,
          i = Math.max(t.height / e.fitHeight, t.width / e.fitWidth) || 1;
        return Math.min(this.fullScale, i);
      }
      get isScaling() {
        return (
          Math.abs(this.targetScale - this.scale) > 1e-5 && !this.isResting
        );
      }
      get isContentLoading() {
        let t = this.content;
        return !!(t && t instanceof HTMLImageElement) && !t.complete;
      }
      get isResting() {
        if (this.isBouncingX || this.isBouncingY) return !1;
        for (let t of J) {
          let e = t == "e" || t === "f" ? 1e-4 : 1e-5;
          if (Math.abs(this.target[t] - this.current[t]) > e) return !1;
        }
        return !(!this.ignoreBounds && !this.checkBounds().inBounds);
      }
      constructor(t, e = {}, i = {}) {
        var n;
        if (
          (super(e),
          Object.defineProperty(this, "pointerTracker", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "resizeObserver", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "updateTimer", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "clickTimer", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "rAF", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "isTicking", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "ignoreBounds", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "isBouncingX", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "isBouncingY", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "clicks", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "trackingPoints", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: [],
          }),
          Object.defineProperty(this, "pwt", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "cwd", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "pmme", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "friction", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "state", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: w.Init,
          }),
          Object.defineProperty(this, "isDragging", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "container", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "content", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "spinner", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "containerRect", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: { width: 0, height: 0, innerWidth: 0, innerHeight: 0 },
          }),
          Object.defineProperty(this, "contentRect", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              fullWidth: 0,
              fullHeight: 0,
              fitWidth: 0,
              fitHeight: 0,
              width: 0,
              height: 0,
            },
          }),
          Object.defineProperty(this, "dragStart", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: { x: 0, y: 0, top: 0, left: 0, time: 0 },
          }),
          Object.defineProperty(this, "dragOffset", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: { x: 0, y: 0, time: 0 },
          }),
          Object.defineProperty(this, "current", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: Object.assign({}, Mt),
          }),
          Object.defineProperty(this, "target", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: Object.assign({}, Mt),
          }),
          Object.defineProperty(this, "velocity", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: { a: 0, b: 0, c: 0, d: 0, e: 0, f: 0 },
          }),
          Object.defineProperty(this, "lockedAxis", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          !t)
        )
          throw new Error("Container Element Not Found");
        (this.container = t),
          this.initContent(),
          this.attachPlugins(Object.assign(Object.assign({}, a.Plugins), i)),
          this.emit("attachPlugins"),
          this.emit("init");
        let o = this.content;
        if (
          (o.addEventListener("load", this.onLoad),
          o.addEventListener("error", this.onError),
          this.isContentLoading)
        ) {
          if (this.option("spinner")) {
            t.classList.add(this.cn("isLoading"));
            let l = S(Pe);
            !t.contains(o) || o.parentElement instanceof HTMLPictureElement
              ? (this.spinner = t.appendChild(l))
              : (this.spinner =
                  ((n = o.parentElement) === null || n === void 0
                    ? void 0
                    : n.insertBefore(l, o)) || null);
          }
          this.emit("beforeLoad");
        } else
          queueMicrotask(() => {
            this.enable();
          });
      }
      initContent() {
        let { container: t } = this,
          e = this.cn(yi),
          i = this.option(yi) || t.querySelector(`.${e}`);
        if (
          (i ||
            ((i = t.querySelector("img,picture") || t.firstElementChild),
            i && v(i, e)),
          i instanceof HTMLPictureElement && (i = i.querySelector("img")),
          !i)
        )
          throw new Error("No content found");
        this.content = i;
      }
      onLoad() {
        let { spinner: t, container: e, state: i } = this;
        t && (t.remove(), (this.spinner = null)),
          this.option("spinner") && e.classList.remove(this.cn("isLoading")),
          this.emit("afterLoad"),
          i === w.Init ? this.enable() : this.updateMetrics();
      }
      onError() {
        this.state !== w.Destroy &&
          (this.spinner && (this.spinner.remove(), (this.spinner = null)),
          this.stop(),
          this.detachEvents(),
          (this.state = w.Error),
          this.emit("error"));
      }
      getNextScale(t) {
        let {
            fullScale: e,
            targetScale: i,
            coverScale: n,
            maxScale: o,
            minScale: l,
          } = this,
          c = l;
        switch (t) {
          case "toggleMax":
            c = i - l < 0.5 * (o - l) ? o : l;
            break;
          case "toggleCover":
            c = i - l < 0.5 * (n - l) ? n : l;
            break;
          case "toggleZoom":
            c = i - l < 0.5 * (e - l) ? e : l;
            break;
          case "iterateZoom":
            let u = [1, e, o].sort((s, r) => s - r),
              m = u.findIndex((s) => s > i + 1e-5);
            c = u[m] || 1;
        }
        return c;
      }
      attachObserver() {
        var t;
        let e = () => {
          let { container: i, containerRect: n } = this;
          return (
            Math.abs(n.width - i.getBoundingClientRect().width) > 0.1 ||
            Math.abs(n.height - i.getBoundingClientRect().height) > 0.1
          );
        };
        this.resizeObserver ||
          window.ResizeObserver === void 0 ||
          (this.resizeObserver = new ResizeObserver(() => {
            this.updateTimer ||
              (e()
                ? (this.onResize(),
                  this.isMobile &&
                    (this.updateTimer = setTimeout(() => {
                      e() && this.onResize(), (this.updateTimer = null);
                    }, 500)))
                : this.updateTimer &&
                  (clearTimeout(this.updateTimer), (this.updateTimer = null)));
          })),
          (t = this.resizeObserver) === null ||
            t === void 0 ||
            t.observe(this.container);
      }
      detachObserver() {
        var t;
        (t = this.resizeObserver) === null || t === void 0 || t.disconnect();
      }
      attachEvents() {
        let { container: t } = this;
        t.addEventListener("click", this.onClick, { passive: !1, capture: !1 }),
          t.addEventListener("wheel", this.onWheel, { passive: !1 }),
          (this.pointerTracker = new ze(t, {
            start: this.onPointerDown,
            move: this.onPointerMove,
            end: this.onPointerUp,
          })),
          document.addEventListener(D, this.onMouseMove);
      }
      detachEvents() {
        var t;
        let { container: e } = this;
        e.removeEventListener("click", this.onClick, {
          passive: !1,
          capture: !1,
        }),
          e.removeEventListener("wheel", this.onWheel, { passive: !1 }),
          (t = this.pointerTracker) === null || t === void 0 || t.stop(),
          (this.pointerTracker = null),
          document.removeEventListener(D, this.onMouseMove),
          document.removeEventListener("keydown", this.onKeydown, !0),
          this.clickTimer &&
            (clearTimeout(this.clickTimer), (this.clickTimer = null)),
          this.updateTimer &&
            (clearTimeout(this.updateTimer), (this.updateTimer = null));
      }
      animate() {
        this.setTargetForce();
        let t = this.friction,
          e = this.option("maxVelocity");
        for (let i of J)
          t
            ? ((this.velocity[i] *= 1 - t),
              e &&
                !this.isScaling &&
                (this.velocity[i] = Math.max(
                  Math.min(this.velocity[i], e),
                  -1 * e
                )),
              (this.current[i] += this.velocity[i]))
            : (this.current[i] = this.target[i]);
        this.setTransform(),
          this.setEdgeForce(),
          !this.isResting || this.isDragging
            ? (this.rAF = requestAnimationFrame(() => this.animate()))
            : this.stop("current");
      }
      setTargetForce() {
        for (let t of J)
          (t === "e" && this.isBouncingX) ||
            (t === "f" && this.isBouncingY) ||
            (this.velocity[t] =
              (1 / (1 - this.friction) - 1) *
              (this.target[t] - this.current[t]));
      }
      checkBounds(t = 0, e = 0) {
        let { current: i } = this,
          n = i.e + t,
          o = i.f + e,
          l = this.getBounds(),
          { x: c, y: u } = l,
          m = c.min,
          s = c.max,
          r = u.min,
          d = u.max,
          h = 0,
          f = 0;
        return (
          m !== 1 / 0 && n < m
            ? (h = m - n)
            : s !== 1 / 0 && n > s && (h = s - n),
          r !== 1 / 0 && o < r
            ? (f = r - o)
            : d !== 1 / 0 && o > d && (f = d - o),
          Math.abs(h) < 1e-4 && (h = 0),
          Math.abs(f) < 1e-4 && (f = 0),
          Object.assign(Object.assign({}, l), {
            xDiff: h,
            yDiff: f,
            inBounds: !h && !f,
          })
        );
      }
      clampTargetBounds() {
        let { target: t } = this,
          { x: e, y: i } = this.getBounds();
        e.min !== 1 / 0 && (t.e = Math.max(t.e, e.min)),
          e.max !== 1 / 0 && (t.e = Math.min(t.e, e.max)),
          i.min !== 1 / 0 && (t.f = Math.max(t.f, i.min)),
          i.max !== 1 / 0 && (t.f = Math.min(t.f, i.max));
      }
      calculateContentDim(t = this.current) {
        let { content: e, contentRect: i } = this,
          { fitWidth: n, fitHeight: o, fullWidth: l, fullHeight: c } = i,
          u = l,
          m = c;
        if (this.option("zoom") || this.angle !== 0) {
          let s =
              !(e instanceof HTMLImageElement) &&
              (window.getComputedStyle(e).maxWidth === "none" ||
                window.getComputedStyle(e).maxHeight === "none"),
            r = s ? l : n,
            d = s ? c : o,
            h = this.getMatrix(t),
            f = new DOMPoint(0, 0).matrixTransform(h),
            b = new DOMPoint(0 + r, 0).matrixTransform(h),
            p = new DOMPoint(0 + r, 0 + d).matrixTransform(h),
            g = new DOMPoint(0, 0 + d).matrixTransform(h),
            Q = Math.abs(p.x - f.x),
            y = Math.abs(p.y - f.y),
            B = Math.abs(g.x - b.x),
            k = Math.abs(g.y - b.y);
          (u = Math.max(Q, B)), (m = Math.max(y, k));
        }
        return { contentWidth: u, contentHeight: m };
      }
      setEdgeForce() {
        if (
          this.ignoreBounds ||
          this.isDragging ||
          this.panMode === D ||
          this.targetScale < this.scale
        )
          return (this.isBouncingX = !1), void (this.isBouncingY = !1);
        let { target: t } = this,
          { x: e, y: i, xDiff: n, yDiff: o } = this.checkBounds(),
          l = this.option("maxVelocity"),
          c = this.velocity.e,
          u = this.velocity.f;
        n !== 0
          ? ((this.isBouncingX = !0),
            n * c <= 0
              ? (c += 0.14 * n)
              : ((c = 0.14 * n),
                e.min !== 1 / 0 && (this.target.e = Math.max(t.e, e.min)),
                e.max !== 1 / 0 && (this.target.e = Math.min(t.e, e.max))),
            l && (c = Math.max(Math.min(c, l), -1 * l)))
          : (this.isBouncingX = !1),
          o !== 0
            ? ((this.isBouncingY = !0),
              o * u <= 0
                ? (u += 0.14 * o)
                : ((u = 0.14 * o),
                  i.min !== 1 / 0 && (this.target.f = Math.max(t.f, i.min)),
                  i.max !== 1 / 0 && (this.target.f = Math.min(t.f, i.max))),
              l && (u = Math.max(Math.min(u, l), -1 * l)))
            : (this.isBouncingY = !1),
          this.isBouncingX && (this.velocity.e = c),
          this.isBouncingY && (this.velocity.f = u);
      }
      enable() {
        let { content: t } = this,
          e = new DOMMatrixReadOnly(window.getComputedStyle(t).transform);
        for (let i of J) this.current[i] = this.target[i] = e[i];
        this.updateMetrics(),
          this.attachObserver(),
          this.attachEvents(),
          (this.state = w.Ready),
          this.emit("ready");
      }
      onClick(t) {
        var e;
        t.type === "click" &&
          t.detail === 0 &&
          ((this.dragOffset.x = 0), (this.dragOffset.y = 0)),
          this.isDragging &&
            ((e = this.pointerTracker) === null || e === void 0 || e.clear(),
            (this.trackingPoints = []),
            this.startDecelAnim());
        let i = t.target;
        if (!i || t.defaultPrevented) return;
        if (i.hasAttribute("disabled"))
          return t.preventDefault(), void t.stopPropagation();
        if (
          (() => {
            let h = window.getSelection();
            return h && h.type === "Range";
          })() &&
          !i.closest("button")
        )
          return;
        let n = i.closest("[data-panzoom-action]"),
          o = i.closest("[data-panzoom-change]"),
          l = n || o,
          c = l && R(l) ? l.dataset : null;
        if (c) {
          let h = c.panzoomChange,
            f = c.panzoomAction;
          if (((h || f) && t.preventDefault(), h)) {
            let b = {};
            try {
              b = JSON.parse(h);
            } catch {
              console && console.warn("The given data was not valid JSON");
            }
            return void this.applyChange(b);
          }
          if (f) return void (this[f] && this[f]());
        }
        if (Math.abs(this.dragOffset.x) > 3 || Math.abs(this.dragOffset.y) > 3)
          return t.preventDefault(), void t.stopPropagation();
        if (i.closest("[data-fancybox]")) return;
        let u = this.content.getBoundingClientRect(),
          m = this.dragStart;
        if (
          m.time &&
          !this.canZoomOut() &&
          (Math.abs(u.x - m.x) > 2 || Math.abs(u.y - m.y) > 2)
        )
          return;
        this.dragStart.time = 0;
        let s = (h) => {
            this.option("zoom", t) &&
              h &&
              typeof h == "string" &&
              /(iterateZoom)|(toggle(Zoom|Full|Cover|Max)|(zoomTo(Fit|Cover|Max)))/.test(
                h
              ) &&
              typeof this[h] == "function" &&
              (t.preventDefault(), this[h]({ event: t }));
          },
          r = this.option("click", t),
          d = this.option("dblClick", t);
        d
          ? (this.clicks++,
            this.clicks == 1 &&
              (this.clickTimer = setTimeout(() => {
                this.clicks === 1
                  ? (this.emit("click", t), !t.defaultPrevented && r && s(r))
                  : (this.emit("dblClick", t), t.defaultPrevented || s(d)),
                  (this.clicks = 0),
                  (this.clickTimer = null);
              }, 350)))
          : (this.emit("click", t), !t.defaultPrevented && r && s(r));
      }
      addTrackingPoint(t) {
        let e = this.trackingPoints.filter((i) => i.time > Date.now() - 100);
        e.push(t), (this.trackingPoints = e);
      }
      onPointerDown(t, e, i) {
        var n;
        if (this.option("touch", t) === !1) return !1;
        (this.pwt = 0),
          (this.dragOffset = { x: 0, y: 0, time: 0 }),
          (this.trackingPoints = []);
        let o = this.content.getBoundingClientRect();
        if (
          ((this.dragStart = {
            x: o.x,
            y: o.y,
            top: o.top,
            left: o.left,
            time: Date.now(),
          }),
          this.clickTimer)
        )
          return !1;
        if (this.panMode === D && this.targetScale > 1)
          return t.preventDefault(), t.stopPropagation(), !1;
        let l = t.composedPath()[0];
        if (!i.length) {
          if (
            [
              "TEXTAREA",
              "OPTION",
              "INPUT",
              "SELECT",
              "VIDEO",
              "IFRAME",
            ].includes(l.nodeName) ||
            l.closest(
              "[contenteditable],[data-selectable],[data-draggable],[data-clickable],[data-panzoom-change],[data-panzoom-action]"
            )
          )
            return !1;
          (n = window.getSelection()) === null ||
            n === void 0 ||
            n.removeAllRanges();
        }
        if (t.type === "mousedown")
          ["A", "BUTTON"].includes(l.nodeName) || t.preventDefault();
        else if (Math.abs(this.velocity.a) > 0.3) return !1;
        return (
          (this.target.e = this.current.e),
          (this.target.f = this.current.f),
          this.stop(),
          this.isDragging ||
            ((this.isDragging = !0),
            this.addTrackingPoint(e),
            this.emit("touchStart", t)),
          !0
        );
      }
      onPointerMove(t, e, i) {
        if (
          this.option("touch", t) === !1 ||
          !this.isDragging ||
          (e.length < 2 &&
            this.panOnlyZoomed &&
            F(this.targetScale) <= F(this.minScale)) ||
          (this.emit("touchMove", t), t.defaultPrevented)
        )
          return;
        this.addTrackingPoint(e[0]);
        let { content: n } = this,
          o = gi(i[0], i[1]),
          l = gi(e[0], e[1]),
          c = 0,
          u = 0;
        if (e.length > 1) {
          let y = n.getBoundingClientRect();
          (c = o.clientX - y.left - 0.5 * y.width),
            (u = o.clientY - y.top - 0.5 * y.height);
        }
        let m = bi(i[0], i[1]),
          s = bi(e[0], e[1]),
          r = m ? s / m : 1,
          d = l.clientX - o.clientX,
          h = l.clientY - o.clientY;
        (this.dragOffset.x += d),
          (this.dragOffset.y += h),
          (this.dragOffset.time = Date.now() - this.dragStart.time);
        let f =
          F(this.targetScale) === F(this.minScale) && this.option("lockAxis");
        if (f && !this.lockedAxis)
          if (f === "xy" || f === "y" || t.type === "touchmove") {
            if (
              Math.abs(this.dragOffset.x) < 6 &&
              Math.abs(this.dragOffset.y) < 6
            )
              return void t.preventDefault();
            let y = Math.abs(
              (180 * Math.atan2(this.dragOffset.y, this.dragOffset.x)) / Math.PI
            );
            (this.lockedAxis = y > 45 && y < 135 ? "y" : "x"),
              (this.dragOffset.x = 0),
              (this.dragOffset.y = 0),
              (d = 0),
              (h = 0);
          } else this.lockedAxis = f;
        if (
          (St(t.target, this.content) && ((f = "x"), (this.dragOffset.y = 0)),
          f &&
            f !== "xy" &&
            this.lockedAxis !== f &&
            F(this.targetScale) === F(this.minScale))
        )
          return;
        t.cancelable && t.preventDefault(),
          this.container.classList.add(this.cn("isDragging"));
        let b = this.checkBounds(d, h);
        this.option("rubberband")
          ? (this.isInfinite !== "x" &&
              ((b.xDiff > 0 && d < 0) || (b.xDiff < 0 && d > 0)) &&
              (d *= Math.max(
                0,
                0.5 - Math.abs((0.75 / this.contentRect.fitWidth) * b.xDiff)
              )),
            this.isInfinite !== "y" &&
              ((b.yDiff > 0 && h < 0) || (b.yDiff < 0 && h > 0)) &&
              (h *= Math.max(
                0,
                0.5 - Math.abs((0.75 / this.contentRect.fitHeight) * b.yDiff)
              )))
          : (b.xDiff && (d = 0), b.yDiff && (h = 0));
        let p = this.targetScale,
          g = this.minScale,
          Q = this.maxScale;
        p < 0.5 * g && (r = Math.max(r, g)),
          p > 1.5 * Q && (r = Math.min(r, Q)),
          this.lockedAxis === "y" && F(p) === F(g) && (d = 0),
          this.lockedAxis === "x" && F(p) === F(g) && (h = 0),
          this.applyChange({
            originX: c,
            originY: u,
            panX: d,
            panY: h,
            scale: r,
            friction: this.option("dragFriction"),
            ignoreBounds: !0,
          });
      }
      onPointerUp(t, e, i) {
        if (i.length)
          return (
            (this.dragOffset.x = 0),
            (this.dragOffset.y = 0),
            void (this.trackingPoints = [])
          );
        this.container.classList.remove(this.cn("isDragging")),
          this.isDragging &&
            (this.addTrackingPoint(e),
            this.panOnlyZoomed &&
              this.contentRect.width - this.contentRect.fitWidth < 1 &&
              this.contentRect.height - this.contentRect.fitHeight < 1 &&
              (this.trackingPoints = []),
            St(t.target, this.content) &&
              this.lockedAxis === "y" &&
              (this.trackingPoints = []),
            this.emit("touchEnd", t),
            (this.isDragging = !1),
            (this.lockedAxis = !1),
            this.state !== w.Destroy &&
              (t.defaultPrevented || this.startDecelAnim()));
      }
      startDecelAnim() {
        var t;
        let e = this.isScaling;
        this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)),
          (this.isBouncingX = !1),
          (this.isBouncingY = !1);
        for (let y of J) this.velocity[y] = 0;
        (this.target.e = this.current.e),
          (this.target.f = this.current.f),
          U(this.container, "is-scaling"),
          U(this.container, "is-animating"),
          (this.isTicking = !1);
        let { trackingPoints: i } = this,
          n = i[0],
          o = i[i.length - 1],
          l = 0,
          c = 0,
          u = 0;
        o &&
          n &&
          ((l = o.clientX - n.clientX),
          (c = o.clientY - n.clientY),
          (u = o.time - n.time));
        let m =
          ((t = window.visualViewport) === null || t === void 0
            ? void 0
            : t.scale) || 1;
        m !== 1 && ((l *= m), (c *= m));
        let s = 0,
          r = 0,
          d = 0,
          h = 0,
          f = this.option("decelFriction"),
          b = this.targetScale;
        if (u > 0) {
          (d = Math.abs(l) > 3 ? l / (u / 30) : 0),
            (h = Math.abs(c) > 3 ? c / (u / 30) : 0);
          let y = this.option("maxVelocity");
          y &&
            ((d = Math.max(Math.min(d, y), -1 * y)),
            (h = Math.max(Math.min(h, y), -1 * y)));
        }
        d && (s = d / (1 / (1 - f) - 1)),
          h && (r = h / (1 / (1 - f) - 1)),
          (this.option("lockAxis") === "y" ||
            (this.option("lockAxis") === "xy" &&
              this.lockedAxis === "y" &&
              F(b) === this.minScale)) &&
            (s = d = 0),
          (this.option("lockAxis") === "x" ||
            (this.option("lockAxis") === "xy" &&
              this.lockedAxis === "x" &&
              F(b) === this.minScale)) &&
            (r = h = 0);
        let p = this.dragOffset.x,
          g = this.dragOffset.y,
          Q = this.option("dragMinThreshold") || 0;
        Math.abs(p) < Q && Math.abs(g) < Q && ((s = r = 0), (d = h = 0)),
          ((this.option("zoom") &&
            (b < this.minScale - 1e-5 || b > this.maxScale + 1e-5)) ||
            (e && !s && !r)) &&
            (f = 0.35),
          this.applyChange({ panX: s, panY: r, friction: f }),
          this.emit("decel", d, h, p, g);
      }
      onWheel(t) {
        var e = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce(
          function (o, l) {
            return Math.abs(l) > Math.abs(o) ? l : o;
          }
        );
        let i = Math.max(-1, Math.min(1, e));
        if (
          (this.emit("wheel", t, i), this.panMode === D || t.defaultPrevented)
        )
          return;
        let n = this.option("wheel");
        n === "pan"
          ? (t.preventDefault(),
            (this.panOnlyZoomed && !this.canZoomOut()) ||
              this.applyChange({
                panX: 2 * -t.deltaX,
                panY: 2 * -t.deltaY,
                bounce: !1,
              }))
          : n === "zoom" && this.option("zoom") !== !1 && this.zoomWithWheel(t);
      }
      onMouseMove(t) {
        this.panWithMouse(t);
      }
      onKeydown(t) {
        t.key === "Escape" && this.toggleFS();
      }
      onResize() {
        this.updateMetrics(), this.checkBounds().inBounds || this.requestTick();
      }
      setTransform() {
        this.emit("beforeTransform");
        let { current: t, target: e, content: i, contentRect: n } = this,
          o = Object.assign({}, Mt);
        for (let p of J) {
          let g = p == "e" || p === "f" ? It : as;
          (o[p] = F(t[p], g)),
            Math.abs(e[p] - t[p]) < (p == "e" || p === "f" ? 0.51 : 0.001) &&
              (t[p] = e[p]);
        }
        let { a: l, b: c, c: u, d: m, e: s, f: r } = o,
          d = `matrix(${l}, ${c}, ${u}, ${m}, ${s}, ${r})`,
          h =
            i.parentElement instanceof HTMLPictureElement ? i.parentElement : i;
        if (
          (this.option("transformParent") && (h = h.parentElement || h),
          h.style.transform === d)
        )
          return;
        h.style.transform = d;
        let { contentWidth: f, contentHeight: b } = this.calculateContentDim();
        (n.width = f), (n.height = b), this.emit("afterTransform");
      }
      updateMetrics(t = !1) {
        var e;
        if (!this || this.state === w.Destroy || this.isContentLoading) return;
        let i = Math.max(
            1,
            ((e = window.visualViewport) === null || e === void 0
              ? void 0
              : e.scale) || 1
          ),
          { container: n, content: o } = this,
          l = o instanceof HTMLImageElement,
          c = n.getBoundingClientRect(),
          u = getComputedStyle(this.container),
          m = c.width * i,
          s = c.height * i,
          r = parseFloat(u.paddingTop) + parseFloat(u.paddingBottom),
          d = m - (parseFloat(u.paddingLeft) + parseFloat(u.paddingRight)),
          h = s - r;
        this.containerRect = {
          width: m,
          height: s,
          innerWidth: d,
          innerHeight: h,
        };
        let f =
            parseFloat(o.dataset.width || "") ||
            ((C) => {
              let T = 0;
              return (
                (T =
                  C instanceof HTMLImageElement
                    ? C.naturalWidth
                    : C instanceof SVGElement
                    ? C.width.baseVal.value
                    : Math.max(C.offsetWidth, C.scrollWidth)),
                T || 0
              );
            })(o),
          b =
            parseFloat(o.dataset.height || "") ||
            ((C) => {
              let T = 0;
              return (
                (T =
                  C instanceof HTMLImageElement
                    ? C.naturalHeight
                    : C instanceof SVGElement
                    ? C.height.baseVal.value
                    : Math.max(C.offsetHeight, C.scrollHeight)),
                T || 0
              );
            })(o),
          p = this.option("width", f) || X,
          g = this.option("height", b) || X,
          Q = p === X,
          y = g === X;
        typeof p != "number" && (p = f),
          typeof g != "number" && (g = b),
          Q && (p = f * (g / b)),
          y && (g = b / (f / p));
        let B =
          o.parentElement instanceof HTMLPictureElement ? o.parentElement : o;
        this.option("transformParent") && (B = B.parentElement || B);
        let k = B.getAttribute("style") || "";
        B.style.setProperty("transform", "none", "important"),
          l && ((B.style.width = ""), (B.style.height = "")),
          B.offsetHeight;
        let M = o.getBoundingClientRect(),
          W = M.width * i,
          x = M.height * i,
          Bt = W,
          xt = x;
        (W = Math.min(W, p)),
          (x = Math.min(x, g)),
          l
            ? ({ width: W, height: x } = ((C, T, nn, sn) => {
                let on = nn / C,
                  an = sn / T,
                  ii = Math.min(on, an);
                return { width: (C *= ii), height: (T *= ii) };
              })(p, g, W, x))
            : ((W = Math.min(W, p)), (x = Math.min(x, g)));
        let Ut = 0.5 * (xt - x),
          ht = 0.5 * (Bt - W);
        (this.contentRect = Object.assign(Object.assign({}, this.contentRect), {
          top: M.top - c.top + Ut,
          bottom: c.bottom - M.bottom + Ut,
          left: M.left - c.left + ht,
          right: c.right - M.right + ht,
          fitWidth: W,
          fitHeight: x,
          width: W,
          height: x,
          fullWidth: p,
          fullHeight: g,
        })),
          (B.style.cssText = k),
          l && ((B.style.width = `${W}px`), (B.style.height = `${x}px`)),
          this.setTransform(),
          t !== !0 && this.emit("refresh"),
          this.ignoreBounds ||
            (F(this.targetScale) < F(this.minScale)
              ? this.zoomTo(this.minScale, { friction: 0 })
              : this.targetScale > this.maxScale
              ? this.zoomTo(this.maxScale, { friction: 0 })
              : this.state === w.Init ||
                this.checkBounds().inBounds ||
                this.requestTick()),
          this.updateControls();
      }
      calculateBounds() {
        let { contentWidth: t, contentHeight: e } = this.calculateContentDim(
            this.target
          ),
          { targetScale: i, lockedAxis: n } = this,
          { fitWidth: o, fitHeight: l } = this.contentRect,
          c = 0,
          u = 0,
          m = 0,
          s = 0,
          r = this.option("infinite");
        if (r === !0 || (n && r === n))
          (c = -1 / 0), (m = 1 / 0), (u = -1 / 0), (s = 1 / 0);
        else {
          let { containerRect: d, contentRect: h } = this,
            f = F(o * i, It),
            b = F(l * i, It),
            { innerWidth: p, innerHeight: g } = d;
          if (
            (d.width === f && (p = d.width),
            d.width === b && (g = d.height),
            t > p)
          ) {
            (m = 0.5 * (t - p)), (c = -1 * m);
            let Q = 0.5 * (h.right - h.left);
            (c += Q), (m += Q);
          }
          if (
            (o > p && t < p && ((c -= 0.5 * (o - p)), (m -= 0.5 * (o - p))),
            e > g)
          ) {
            (s = 0.5 * (e - g)), (u = -1 * s);
            let Q = 0.5 * (h.bottom - h.top);
            (u += Q), (s += Q);
          }
          l > g && e < g && ((c -= 0.5 * (l - g)), (m -= 0.5 * (l - g)));
        }
        return { x: { min: c, max: m }, y: { min: u, max: s } };
      }
      getBounds() {
        let t = this.option("bounds");
        return t !== X ? t : this.calculateBounds();
      }
      updateControls() {
        let t = this,
          e = t.container,
          { panMode: i, contentRect: n, targetScale: o, minScale: l } = t,
          c = l,
          u = t.option("click") || !1;
        u && (c = t.getNextScale(u));
        let m = t.canZoomIn(),
          s = t.canZoomOut(),
          r = i === Fi && !!this.option("touch"),
          d = s && r;
        if (
          (r &&
            (F(o) < F(l) && !this.panOnlyZoomed && (d = !0),
            (F(n.width, 1) > F(n.fitWidth, 1) ||
              F(n.height, 1) > F(n.fitHeight, 1)) &&
              (d = !0)),
          F(n.width * o, 1) < F(n.fitWidth, 1) && (d = !1),
          i === D && (d = !1),
          z(e, this.cn("isDraggable"), d),
          !this.option("zoom"))
        )
          return;
        let h = m && F(c) > F(o),
          f = !h && !d && s && F(c) < F(o);
        z(e, this.cn("canZoomIn"), h), z(e, this.cn("canZoomOut"), f);
        for (let b of e.querySelectorAll("[data-panzoom-action]")) {
          let p = !1,
            g = !1;
          switch (b.dataset.panzoomAction) {
            case "zoomIn":
              m ? (p = !0) : (g = !0);
              break;
            case "zoomOut":
              s ? (p = !0) : (g = !0);
              break;
            case "toggleZoom":
            case "iterateZoom":
              m || s ? (p = !0) : (g = !0);
              let Q = b.querySelector("g");
              Q && (Q.style.display = m ? "" : "none");
          }
          p
            ? (b.removeAttribute("disabled"), b.removeAttribute("tabindex"))
            : g &&
              (b.setAttribute("disabled", ""),
              b.setAttribute("tabindex", "-1"));
        }
      }
      panTo({
        x: t = this.target.e,
        y: e = this.target.f,
        scale: i = this.targetScale,
        friction: n = this.option("friction"),
        angle: o = 0,
        originX: l = 0,
        originY: c = 0,
        flipX: u = !1,
        flipY: m = !1,
        ignoreBounds: s = !1,
      }) {
        this.state !== w.Destroy &&
          this.applyChange({
            panX: t - this.target.e,
            panY: e - this.target.f,
            scale: i / this.targetScale,
            angle: o,
            originX: l,
            originY: c,
            friction: n,
            flipX: u,
            flipY: m,
            ignoreBounds: s,
          });
      }
      applyChange({
        panX: t = 0,
        panY: e = 0,
        scale: i = 1,
        angle: n = 0,
        originX: o = -this.current.e,
        originY: l = -this.current.f,
        friction: c = this.option("friction"),
        flipX: u = !1,
        flipY: m = !1,
        ignoreBounds: s = !1,
        bounce: r = this.option("bounce"),
      }) {
        let d = this.state;
        if (d === w.Destroy) return;
        this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)),
          (this.friction = c || 0),
          (this.ignoreBounds = s);
        let { current: h } = this,
          f = h.e,
          b = h.f,
          p = this.getMatrix(this.target),
          g = new DOMMatrix().translate(f, b).translate(o, l).translate(t, e);
        if (this.option("zoom")) {
          if (!s) {
            let Q = this.targetScale,
              y = this.minScale,
              B = this.maxScale;
            Q * i < y && (i = y / Q), Q * i > B && (i = B / Q);
          }
          g = g.scale(i);
        }
        (g = g.translate(-o, -l).translate(-f, -b).multiply(p)),
          n && (g = g.rotate(n)),
          u && (g = g.scale(-1, 1)),
          m && (g = g.scale(1, -1));
        for (let Q of J)
          Q !== "e" &&
          Q !== "f" &&
          (g[Q] > this.minScale + 1e-5 || g[Q] < this.minScale - 1e-5)
            ? (this.target[Q] = g[Q])
            : (this.target[Q] = F(g[Q], It));
        (this.targetScale < this.scale ||
          Math.abs(i - 1) > 0.1 ||
          this.panMode === D ||
          r === !1) &&
          !s &&
          this.clampTargetBounds(),
          d === w.Init
            ? this.animate()
            : this.isResting || ((this.state = w.Panning), this.requestTick());
      }
      stop(t = !1) {
        if (this.state === w.Init || this.state === w.Destroy) return;
        let e = this.isTicking;
        this.rAF && (cancelAnimationFrame(this.rAF), (this.rAF = null)),
          (this.isBouncingX = !1),
          (this.isBouncingY = !1);
        for (let i of J)
          (this.velocity[i] = 0),
            t === "current"
              ? (this.current[i] = this.target[i])
              : t === "target" && (this.target[i] = this.current[i]);
        this.setTransform(),
          U(this.container, "is-scaling"),
          U(this.container, "is-animating"),
          (this.isTicking = !1),
          (this.state = w.Ready),
          e && (this.emit("endAnimation"), this.updateControls());
      }
      requestTick() {
        this.isTicking ||
          (this.emit("startAnimation"),
          this.updateControls(),
          v(this.container, "is-animating"),
          this.isScaling && v(this.container, "is-scaling")),
          (this.isTicking = !0),
          this.rAF || (this.rAF = requestAnimationFrame(() => this.animate()));
      }
      panWithMouse(t, e = this.option("mouseMoveFriction")) {
        if (
          ((this.pmme = t),
          this.panMode !== D || !t || F(this.targetScale) <= F(this.minScale))
        )
          return;
        this.emit("mouseMove", t);
        let { container: i, containerRect: n, contentRect: o } = this,
          l = n.width,
          c = n.height,
          u = i.getBoundingClientRect(),
          m = (t.clientX || 0) - u.left,
          s = (t.clientY || 0) - u.top,
          { contentWidth: r, contentHeight: d } = this.calculateContentDim(
            this.target
          ),
          h = this.option("mouseMoveFactor");
        h > 1 && (r !== l && (r *= h), d !== c && (d *= h));
        let f = 0.5 * (r - l) - (((m / l) * 100) / 100) * (r - l);
        f += 0.5 * (o.right - o.left);
        let b = 0.5 * (d - c) - (((s / c) * 100) / 100) * (d - c);
        (b += 0.5 * (o.bottom - o.top)),
          this.applyChange({
            panX: f - this.target.e,
            panY: b - this.target.f,
            friction: e,
          });
      }
      zoomWithWheel(t) {
        if (this.state === w.Destroy || this.state === w.Init) return;
        let e = Date.now();
        if (e - this.pwt < 45) return void t.preventDefault();
        this.pwt = e;
        var i = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce(
          function (m, s) {
            return Math.abs(s) > Math.abs(m) ? s : m;
          }
        );
        let n = Math.max(-1, Math.min(1, i)),
          { targetScale: o, maxScale: l, minScale: c } = this,
          u = (o * (100 + 45 * n)) / 100;
        F(u) < F(c) && F(o) <= F(c)
          ? ((this.cwd += Math.abs(n)), (u = c))
          : F(u) > F(l) && F(o) >= F(l)
          ? ((this.cwd += Math.abs(n)), (u = l))
          : ((this.cwd = 0), (u = Math.max(Math.min(u, l), c))),
          this.cwd > this.option("wheelLimit") ||
            (t.preventDefault(), F(u) !== F(o) && this.zoomTo(u, { event: t }));
      }
      canZoomIn() {
        return (
          this.option("zoom") &&
          (F(this.contentRect.width, 1) < F(this.contentRect.fitWidth, 1) ||
            F(this.targetScale) < F(this.maxScale))
        );
      }
      canZoomOut() {
        return this.option("zoom") && F(this.targetScale) > F(this.minScale);
      }
      zoomIn(t = 1.25, e) {
        this.zoomTo(this.targetScale * t, e);
      }
      zoomOut(t = 0.8, e) {
        this.zoomTo(this.targetScale * t, e);
      }
      zoomToFit(t) {
        this.zoomTo("fit", t);
      }
      zoomToCover(t) {
        this.zoomTo("cover", t);
      }
      zoomToFull(t) {
        this.zoomTo("full", t);
      }
      zoomToMax(t) {
        this.zoomTo("max", t);
      }
      toggleZoom(t) {
        this.zoomTo(this.getNextScale("toggleZoom"), t);
      }
      toggleMax(t) {
        this.zoomTo(this.getNextScale("toggleMax"), t);
      }
      toggleCover(t) {
        this.zoomTo(this.getNextScale("toggleCover"), t);
      }
      iterateZoom(t) {
        this.zoomTo("next", t);
      }
      zoomTo(
        t = 1,
        { friction: e = X, originX: i = X, originY: n = X, event: o } = {}
      ) {
        if (this.isContentLoading || this.state === w.Destroy) return;
        let { targetScale: l, fullScale: c, maxScale: u, coverScale: m } = this;
        if (
          (this.stop(),
          this.panMode === D && (o = this.pmme || o),
          o || i === X || n === X)
        ) {
          let r = this.content.getBoundingClientRect(),
            d = this.container.getBoundingClientRect(),
            h = o ? o.clientX : d.left + 0.5 * d.width,
            f = o ? o.clientY : d.top + 0.5 * d.height;
          (i = h - r.left - 0.5 * r.width), (n = f - r.top - 0.5 * r.height);
        }
        let s = 1;
        typeof t == "number"
          ? (s = t)
          : t === "full"
          ? (s = c)
          : t === "cover"
          ? (s = m)
          : t === "max"
          ? (s = u)
          : t === "fit"
          ? (s = 1)
          : t === "next" && (s = this.getNextScale("iterateZoom")),
          (s = s / l || 1),
          (e = e === X ? (s > 1 ? 0.15 : 0.25) : e),
          this.applyChange({ scale: s, originX: i, originY: n, friction: e }),
          o && this.panMode === D && this.panWithMouse(o, e);
      }
      rotateCCW() {
        this.applyChange({ angle: -90 });
      }
      rotateCW() {
        this.applyChange({ angle: 90 });
      }
      flipX() {
        this.applyChange({ flipX: !0 });
      }
      flipY() {
        this.applyChange({ flipY: !0 });
      }
      fitX() {
        this.stop("target");
        let { containerRect: t, contentRect: e, target: i } = this;
        this.applyChange({
          panX: 0.5 * t.width - (e.left + 0.5 * e.fitWidth) - i.e,
          panY: 0.5 * t.height - (e.top + 0.5 * e.fitHeight) - i.f,
          scale: t.width / e.fitWidth / this.targetScale,
          originX: 0,
          originY: 0,
          ignoreBounds: !0,
        });
      }
      fitY() {
        this.stop("target");
        let { containerRect: t, contentRect: e, target: i } = this;
        this.applyChange({
          panX: 0.5 * t.width - (e.left + 0.5 * e.fitWidth) - i.e,
          panY: 0.5 * t.innerHeight - (e.top + 0.5 * e.fitHeight) - i.f,
          scale: t.height / e.fitHeight / this.targetScale,
          originX: 0,
          originY: 0,
          ignoreBounds: !0,
        });
      }
      toggleFS() {
        let { container: t } = this,
          e = this.cn("inFullscreen"),
          i = this.cn("htmlHasFullscreen");
        t.classList.toggle(e);
        let n = t.classList.contains(e);
        n
          ? (document.documentElement.classList.add(i),
            document.addEventListener("keydown", this.onKeydown, !0))
          : (document.documentElement.classList.remove(i),
            document.removeEventListener("keydown", this.onKeydown, !0)),
          this.updateMetrics(),
          this.emit(n ? "enterFS" : "exitFS");
      }
      getMatrix(t = this.current) {
        let { a: e, b: i, c: n, d: o, e: l, f: c } = t;
        return new DOMMatrix([e, i, n, o, l, c]);
      }
      reset(t) {
        if (this.state !== w.Init && this.state !== w.Destroy) {
          this.stop("current");
          for (let e of J) this.target[e] = Mt[e];
          (this.target.a = this.minScale),
            (this.target.d = this.minScale),
            this.clampTargetBounds(),
            this.isResting ||
              ((this.friction = t === void 0 ? this.option("friction") : t),
              (this.state = w.Panning),
              this.requestTick());
        }
      }
      destroy() {
        this.stop(),
          (this.state = w.Destroy),
          this.detachEvents(),
          this.detachObserver();
        let { container: t, content: e } = this,
          i = this.option("classes") || {};
        for (let n of Object.values(i)) t.classList.remove(n + "");
        e &&
          (e.removeEventListener("load", this.onLoad),
          e.removeEventListener("error", this.onError)),
          this.detachPlugins();
      }
    };
  Object.defineProperty(st, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: os,
  }),
    Object.defineProperty(st, "Plugins", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: {},
    });
  var vi = function (a, t) {
      let e = !0;
      return (...i) => {
        e &&
          ((e = !1),
          a(...i),
          setTimeout(() => {
            e = !0;
          }, t));
      };
    },
    Bi = (a, t) => {
      let e = [];
      return (
        a.childNodes.forEach((i) => {
          i.nodeType !== Node.ELEMENT_NODE || (t && !i.matches(t)) || e.push(i);
        }),
        e
      );
    },
    rs = {
      viewport: null,
      track: null,
      enabled: !0,
      slides: [],
      axis: "x",
      transition: "fade",
      preload: 1,
      slidesPerPage: "auto",
      initialPage: 0,
      friction: 0.12,
      Panzoom: { decelFriction: 0.12 },
      center: !0,
      infinite: !0,
      fill: !0,
      dragFree: !1,
      adaptiveHeight: !1,
      direction: "ltr",
      classes: {
        container: "f-carousel",
        viewport: "f-carousel__viewport",
        track: "f-carousel__track",
        slide: "f-carousel__slide",
        isLTR: "is-ltr",
        isRTL: "is-rtl",
        isHorizontal: "is-horizontal",
        isVertical: "is-vertical",
        inTransition: "in-transition",
        isSelected: "is-selected",
      },
      l10n: {
        NEXT: "Next slide",
        PREV: "Previous slide",
        GOTO: "Go to slide #%d",
      },
    },
    Z;
  (function (a) {
    (a[(a.Init = 0)] = "Init"),
      (a[(a.Ready = 1)] = "Ready"),
      (a[(a.Destroy = 2)] = "Destroy");
  })(Z || (Z = {}));
  var Oe = (a) => {
      if (typeof a == "string" || a instanceof HTMLElement) a = { html: a };
      else {
        let t = a.thumb;
        t !== void 0 &&
          (typeof t == "string" && (a.thumbSrc = t),
          t instanceof HTMLImageElement &&
            ((a.thumbEl = t), (a.thumbElSrc = t.src), (a.thumbSrc = t.src)),
          delete a.thumb);
      }
      return Object.assign(
        {
          html: "",
          el: null,
          isDom: !1,
          class: "",
          customClass: "",
          index: -1,
          dim: 0,
          gap: 0,
          pos: 0,
          transition: !1,
        },
        a
      );
    },
    ls = (a = {}) =>
      Object.assign({ index: -1, slides: [], dim: 0, pos: -1 }, a),
    Y = class extends ut {
      constructor(t, e) {
        super(e),
          Object.defineProperty(this, "instance", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: t,
          });
      }
      attach() {}
      detach() {}
    },
    cs = {
      classes: {
        list: "f-carousel__dots",
        isDynamic: "is-dynamic",
        hasDots: "has-dots",
        dot: "f-carousel__dot",
        isBeforePrev: "is-before-prev",
        isPrev: "is-prev",
        isCurrent: "is-current",
        isNext: "is-next",
        isAfterNext: "is-after-next",
      },
      dotTpl:
        '<button type="button" data-carousel-page="%i" aria-label="{{GOTO}}"><span class="f-carousel__dot" aria-hidden="true"></span></button>',
      dynamicFrom: 11,
      maxCount: 1 / 0,
      minCount: 2,
    },
    zt = class extends Y {
      constructor() {
        super(...arguments),
          Object.defineProperty(this, "isDynamic", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "list", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          });
      }
      onRefresh() {
        this.refresh();
      }
      build() {
        let t = this.list;
        if (!t) {
          (t = document.createElement("ul")),
            v(t, this.cn("list")),
            t.setAttribute("role", "tablist");
          let e = this.instance.container;
          e.appendChild(t), v(e, this.cn("hasDots")), (this.list = t);
        }
        return t;
      }
      refresh() {
        var t;
        let e = this.instance.pages.length,
          i = Math.min(2, this.option("minCount")),
          n = Math.max(2e3, this.option("maxCount")),
          o = this.option("dynamicFrom");
        if (e < i || e > n) return void this.cleanup();
        let l = typeof o == "number" && e > 5 && e >= o,
          c =
            !this.list ||
            this.isDynamic !== l ||
            this.list.children.length !== e;
        c && this.cleanup();
        let u = this.build();
        if ((z(u, this.cn("isDynamic"), !!l), c))
          for (let r = 0; r < e; r++) u.append(this.createItem(r));
        let m,
          s = 0;
        for (let r of [...u.children]) {
          let d = s === this.instance.page;
          d && (m = r),
            z(r, this.cn("isCurrent"), d),
            (t = r.children[0]) === null ||
              t === void 0 ||
              t.setAttribute("aria-selected", d ? "true" : "false");
          for (let h of ["isBeforePrev", "isPrev", "isNext", "isAfterNext"])
            U(r, this.cn(h));
          s++;
        }
        if (((m = m || u.firstChild), l && m)) {
          let r = m.previousElementSibling,
            d = r && r.previousElementSibling;
          v(r, this.cn("isPrev")), v(d, this.cn("isBeforePrev"));
          let h = m.nextElementSibling,
            f = h && h.nextElementSibling;
          v(h, this.cn("isNext")), v(f, this.cn("isAfterNext"));
        }
        this.isDynamic = l;
      }
      createItem(t = 0) {
        var e;
        let i = document.createElement("li");
        i.setAttribute("role", "presentation");
        let n = S(
          this.instance
            .localize(this.option("dotTpl"), [["%d", t + 1]])
            .replace(/\%i/g, t + "")
        );
        return (
          i.appendChild(n),
          (e = i.children[0]) === null ||
            e === void 0 ||
            e.setAttribute("role", "tab"),
          i
        );
      }
      cleanup() {
        this.list && (this.list.remove(), (this.list = null)),
          (this.isDynamic = !1),
          U(this.instance.container, this.cn("hasDots"));
      }
      attach() {
        this.instance.on(["refresh", "change"], this.onRefresh);
      }
      detach() {
        this.instance.off(["refresh", "change"], this.onRefresh),
          this.cleanup();
      }
    };
  Object.defineProperty(zt, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: cs,
  });
  var Rt = "disabled",
    Vt = "next",
    xi = "prev",
    jt = class extends Y {
      constructor() {
        super(...arguments),
          Object.defineProperty(this, "container", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "prev", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "next", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "isDom", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          });
      }
      onRefresh() {
        let t = this.instance,
          e = t.pages.length,
          i = t.page;
        if (e < 2) return void this.cleanup();
        this.build();
        let n = this.prev,
          o = this.next;
        n &&
          o &&
          (n.removeAttribute(Rt),
          o.removeAttribute(Rt),
          t.isInfinite ||
            (i <= 0 && n.setAttribute(Rt, ""),
            i >= e - 1 && o.setAttribute(Rt, "")));
      }
      addBtn(t) {
        var e;
        let i = this.instance,
          n = document.createElement("button");
        n.setAttribute("tabindex", "0"),
          n.setAttribute("title", i.localize(`{{${t.toUpperCase()}}}`)),
          v(
            n,
            this.cn("button") + " " + this.cn(t === Vt ? "isNext" : "isPrev")
          );
        let o = i.isRTL ? (t === Vt ? xi : Vt) : t;
        var l;
        return (
          (n.innerHTML = i.localize(this.option(`${o}Tpl`))),
          (n.dataset[
            `carousel${
              ((l = t),
              l
                ? l.match("^[a-z]")
                  ? l.charAt(0).toUpperCase() + l.substring(1)
                  : l
                : "")
            }`
          ] = "true"),
          (e = this.container) === null || e === void 0 || e.appendChild(n),
          n
        );
      }
      build() {
        let t = this.instance.container,
          e = this.cn("container"),
          { container: i, prev: n, next: o } = this;
        i || ((i = t.querySelector("." + e)), (this.isDom = !!i)),
          i || ((i = document.createElement("div")), v(i, e), t.appendChild(i)),
          (this.container = i),
          o || (o = i.querySelector("[data-carousel-next]")),
          o || (o = this.addBtn(Vt)),
          (this.next = o),
          n || (n = i.querySelector("[data-carousel-prev]")),
          n || (n = this.addBtn(xi)),
          (this.prev = n);
      }
      cleanup() {
        this.isDom ||
          (this.prev && this.prev.remove(),
          this.next && this.next.remove(),
          this.container && this.container.remove()),
          (this.prev = null),
          (this.next = null),
          (this.container = null),
          (this.isDom = !1);
      }
      attach() {
        this.instance.on(["refresh", "change"], this.onRefresh);
      }
      detach() {
        this.instance.off(["refresh", "change"], this.onRefresh),
          this.cleanup();
      }
    };
  Object.defineProperty(jt, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: {
      classes: {
        container: "f-carousel__nav",
        button: "f-button",
        isNext: "is-next",
        isPrev: "is-prev",
      },
      nextTpl:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M9 3l9 9-9 9"/></svg>',
      prevTpl:
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M15 3l-9 9 9 9"/></svg>',
    },
  });
  var Jt = class extends Y {
    constructor() {
      super(...arguments),
        Object.defineProperty(this, "selectedIndex", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        }),
        Object.defineProperty(this, "target", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        }),
        Object.defineProperty(this, "nav", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        });
    }
    addAsTargetFor(t) {
      (this.target = this.instance), (this.nav = t), this.attachEvents();
    }
    addAsNavFor(t) {
      (this.nav = this.instance), (this.target = t), this.attachEvents();
    }
    attachEvents() {
      let { nav: t, target: e } = this;
      t &&
        e &&
        ((t.options.initialSlide = e.options.initialPage),
        t.state === Z.Ready
          ? this.onNavReady(t)
          : t.on("ready", this.onNavReady),
        e.state === Z.Ready
          ? this.onTargetReady(e)
          : e.on("ready", this.onTargetReady));
    }
    onNavReady(t) {
      t.on("createSlide", this.onNavCreateSlide),
        t.on("Panzoom.click", this.onNavClick),
        t.on("Panzoom.touchEnd", this.onNavTouch),
        this.onTargetChange();
    }
    onTargetReady(t) {
      t.on("change", this.onTargetChange),
        t.on("Panzoom.refresh", this.onTargetChange),
        this.onTargetChange();
    }
    onNavClick(t, e, i) {
      this.onNavTouch(t, t.panzoom, i);
    }
    onNavTouch(t, e, i) {
      var n, o;
      if (Math.abs(e.dragOffset.x) > 3 || Math.abs(e.dragOffset.y) > 3) return;
      let l = i.target,
        { nav: c, target: u } = this;
      if (!c || !u || !l) return;
      let m = l.closest("[data-index]");
      if ((i.stopPropagation(), i.preventDefault(), !m)) return;
      let s = parseInt(m.dataset.index || "", 10) || 0,
        r = u.getPageForSlide(s),
        d = c.getPageForSlide(s);
      c.slideTo(d),
        u.slideTo(r, {
          friction:
            ((o =
              (n = this.nav) === null || n === void 0 ? void 0 : n.plugins) ===
              null || o === void 0
              ? void 0
              : o.Sync.option("friction")) || 0,
        }),
        this.markSelectedSlide(s);
    }
    onNavCreateSlide(t, e) {
      e.index === this.selectedIndex && this.markSelectedSlide(e.index);
    }
    onTargetChange() {
      var t, e;
      let { target: i, nav: n } = this;
      if (!i || !n || n.state !== Z.Ready || i.state !== Z.Ready) return;
      let o =
          (e =
            (t = i.pages[i.page]) === null || t === void 0
              ? void 0
              : t.slides[0]) === null || e === void 0
            ? void 0
            : e.index,
        l = n.getPageForSlide(o);
      this.markSelectedSlide(o),
        n.slideTo(
          l,
          n.prevPage === null && i.prevPage === null ? { friction: 0 } : void 0
        );
    }
    markSelectedSlide(t) {
      let e = this.nav;
      e &&
        e.state === Z.Ready &&
        ((this.selectedIndex = t),
        [...e.slides].map((i) => {
          i.el &&
            i.el.classList[i.index === t ? "add" : "remove"]("is-nav-selected");
        }));
    }
    attach() {
      let t = this,
        e = t.options.target,
        i = t.options.nav;
      e ? t.addAsNavFor(e) : i && t.addAsTargetFor(i);
    }
    detach() {
      let t = this,
        e = t.nav,
        i = t.target;
      e &&
        (e.off("ready", t.onNavReady),
        e.off("createSlide", t.onNavCreateSlide),
        e.off("Panzoom.click", t.onNavClick),
        e.off("Panzoom.touchEnd", t.onNavTouch)),
        (t.nav = null),
        i &&
          (i.off("ready", t.onTargetReady),
          i.off("refresh", t.onTargetChange),
          i.off("change", t.onTargetChange)),
        (t.target = null);
    }
  };
  Object.defineProperty(Jt, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: { friction: 0.35 },
  });
  var ds = { Navigation: jt, Dots: zt, Sync: Jt },
    Yt = "animationend",
    Ui = "isSelected",
    _t = "slide",
    dt = class a extends yt {
      get axis() {
        return this.isHorizontal ? "e" : "f";
      }
      get isEnabled() {
        return this.state === Z.Ready;
      }
      get isInfinite() {
        let t = !1,
          { contentDim: e, viewportDim: i, pages: n, slides: o } = this,
          l = o[0];
        return (
          n.length >= 2 && l && e + l.dim >= i && (t = this.option("infinite")),
          t
        );
      }
      get isRTL() {
        return this.option("direction") === "rtl";
      }
      get isHorizontal() {
        return this.option("axis") === "x";
      }
      constructor(t, e = {}, i = {}) {
        if (
          (super(),
          Object.defineProperty(this, "bp", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: "",
          }),
          Object.defineProperty(this, "lp", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "userOptions", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: {},
          }),
          Object.defineProperty(this, "userPlugins", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: {},
          }),
          Object.defineProperty(this, "state", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: Z.Init,
          }),
          Object.defineProperty(this, "page", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "prevPage", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "container", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          Object.defineProperty(this, "viewport", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "track", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "slides", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: [],
          }),
          Object.defineProperty(this, "pages", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: [],
          }),
          Object.defineProperty(this, "panzoom", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "inTransition", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: new Set(),
          }),
          Object.defineProperty(this, "contentDim", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "viewportDim", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          typeof t == "string" && (t = document.querySelector(t)),
          !t || !R(t))
        )
          throw new Error("No Element found");
        (this.container = t),
          (this.slideNext = vi(this.slideNext.bind(this), 150)),
          (this.slidePrev = vi(this.slidePrev.bind(this), 150)),
          (this.userOptions = e),
          (this.userPlugins = i),
          queueMicrotask(() => {
            this.processOptions();
          });
      }
      processOptions() {
        var t, e;
        let i = V({}, a.defaults, this.userOptions),
          n = "",
          o = i.breakpoints;
        if (o && je(o))
          for (let [l, c] of Object.entries(o))
            window.matchMedia(l).matches && je(c) && ((n += l), V(i, c));
        (n === this.bp && this.state !== Z.Init) ||
          ((this.bp = n),
          this.state === Z.Ready &&
            (i.initialSlide =
              ((e =
                (t = this.pages[this.page]) === null || t === void 0
                  ? void 0
                  : t.slides[0]) === null || e === void 0
                ? void 0
                : e.index) || 0),
          this.state !== Z.Init && this.destroy(),
          super.setOptions(i),
          this.option("enabled") === !1
            ? this.attachEvents()
            : setTimeout(() => {
                this.init();
              }, 0));
      }
      init() {
        (this.state = Z.Init),
          this.emit("init"),
          this.attachPlugins(
            Object.assign(Object.assign({}, a.Plugins), this.userPlugins)
          ),
          this.emit("attachPlugins"),
          this.initLayout(),
          this.initSlides(),
          this.updateMetrics(),
          this.setInitialPosition(),
          this.initPanzoom(),
          this.attachEvents(),
          (this.state = Z.Ready),
          this.emit("ready");
      }
      initLayout() {
        let { container: t } = this,
          e = this.option("classes");
        v(t, this.cn("container")),
          z(t, e.isLTR, !this.isRTL),
          z(t, e.isRTL, this.isRTL),
          z(t, e.isVertical, !this.isHorizontal),
          z(t, e.isHorizontal, this.isHorizontal);
        let i = this.option("viewport") || t.querySelector(`.${e.viewport}`);
        i ||
          ((i = document.createElement("div")),
          v(i, e.viewport),
          i.append(...Bi(t, `.${e.slide}`)),
          t.prepend(i)),
          i.addEventListener("scroll", this.onScroll);
        let n = this.option("track") || t.querySelector(`.${e.track}`);
        n ||
          ((n = document.createElement("div")),
          v(n, e.track),
          n.append(...Array.from(i.childNodes))),
          n.setAttribute("aria-live", "polite"),
          i.contains(n) || i.prepend(n),
          (this.viewport = i),
          (this.track = n),
          this.emit("initLayout");
      }
      initSlides() {
        let { track: t } = this;
        if (!t) return;
        let e = [...this.slides],
          i = [];
        [...Bi(t, `.${this.cn(_t)}`)].forEach((n) => {
          if (R(n)) {
            let o = Oe({ el: n, isDom: !0, index: this.slides.length });
            i.push(o);
          }
        });
        for (let n of [...(this.option("slides", []) || []), ...e])
          i.push(Oe(n));
        this.slides = i;
        for (let n = 0; n < this.slides.length; n++) this.slides[n].index = n;
        for (let n of i)
          this.emit("beforeInitSlide", n, n.index),
            this.emit("initSlide", n, n.index);
        this.emit("initSlides");
      }
      setInitialPage() {
        let t = this.option("initialSlide");
        this.page =
          typeof t == "number"
            ? this.getPageForSlide(t)
            : parseInt(this.option("initialPage", 0) + "", 10) || 0;
      }
      setInitialPosition() {
        let { track: t, pages: e, isHorizontal: i } = this;
        if (!t || !e.length) return;
        let n = this.page;
        e[n] || (this.page = n = 0);
        let o = (e[n].pos || 0) * (this.isRTL && i ? 1 : -1),
          l = i ? `${o}px` : "0",
          c = i ? "0" : `${o}px`;
        (t.style.transform = `translate3d(${l}, ${c}, 0) scale(1)`),
          this.option("adaptiveHeight") && this.setViewportHeight();
      }
      initPanzoom() {
        this.panzoom && (this.panzoom.destroy(), (this.panzoom = null));
        let t = this.option("Panzoom") || {};
        (this.panzoom = new st(
          this.viewport,
          V(
            {},
            {
              content: this.track,
              zoom: !1,
              panOnlyZoomed: !1,
              lockAxis: this.isHorizontal ? "x" : "y",
              infinite: this.isInfinite,
              click: !1,
              dblClick: !1,
              touch: (e) => !(this.pages.length < 2 && !e.options.infinite),
              bounds: () => this.getBounds(),
              maxVelocity: (e) =>
                Math.abs(e.target[this.axis] - e.current[this.axis]) <
                2 * this.viewportDim
                  ? 100
                  : 0,
            },
            t
          )
        )),
          this.panzoom.on("*", (e, i, ...n) => {
            this.emit(`Panzoom.${i}`, e, ...n);
          }),
          this.panzoom.on("decel", this.onDecel),
          this.panzoom.on("refresh", this.onRefresh),
          this.panzoom.on("beforeTransform", this.onBeforeTransform),
          this.panzoom.on("endAnimation", this.onEndAnimation);
      }
      attachEvents() {
        let t = this.container;
        t &&
          (t.addEventListener("click", this.onClick, {
            passive: !1,
            capture: !1,
          }),
          t.addEventListener("slideTo", this.onSlideTo)),
          window.addEventListener("resize", this.onResize);
      }
      createPages() {
        let t = [],
          { contentDim: e, viewportDim: i } = this,
          n = this.option("slidesPerPage");
        n =
          (n === "auto" || e <= i) && this.option("fill") !== !1
            ? 1 / 0
            : parseFloat(n + "");
        let o = 0,
          l = 0,
          c = 0;
        for (let u of this.slides)
          (!t.length || l + u.dim - i > 0.05 || c >= n) &&
            (t.push(ls()), (o = t.length - 1), (l = 0), (c = 0)),
            t[o].slides.push(u),
            (l += u.dim + u.gap),
            c++;
        return t;
      }
      processPages() {
        let t = this.pages,
          { contentDim: e, viewportDim: i, isInfinite: n } = this,
          o = this.option("center"),
          l = this.option("fill"),
          c = l && o && e > i && !n;
        if (
          (t.forEach((s, r) => {
            var d;
            (s.index = r),
              (s.pos =
                ((d = s.slides[0]) === null || d === void 0 ? void 0 : d.pos) ||
                0),
              (s.dim = 0);
            for (let [h, f] of s.slides.entries())
              (s.dim += f.dim), h < s.slides.length - 1 && (s.dim += f.gap);
            c && s.pos + 0.5 * s.dim < 0.5 * i
              ? (s.pos = 0)
              : c && s.pos + 0.5 * s.dim >= e - 0.5 * i
              ? (s.pos = e - i)
              : o && (s.pos += -0.5 * (i - s.dim));
          }),
          t.forEach((s) => {
            l &&
              !n &&
              e > i &&
              ((s.pos = Math.max(s.pos, 0)), (s.pos = Math.min(s.pos, e - i))),
              (s.pos = F(s.pos, 1e3)),
              (s.dim = F(s.dim, 1e3)),
              Math.abs(s.pos) <= 0.1 && (s.pos = 0);
          }),
          n)
        )
          return t;
        let u = [],
          m;
        return (
          t.forEach((s) => {
            let r = Object.assign({}, s);
            m && r.pos === m.pos
              ? ((m.dim += r.dim), (m.slides = [...m.slides, ...r.slides]))
              : ((r.index = u.length), (m = r), u.push(r));
          }),
          u
        );
      }
      getPageFromIndex(t = 0) {
        let e = this.pages.length,
          i;
        return (
          (t = parseInt((t || 0).toString()) || 0),
          (i = this.isInfinite
            ? ((t % e) + e) % e
            : Math.max(Math.min(t, e - 1), 0)),
          i
        );
      }
      getSlideMetrics(t) {
        var e, i;
        let n = this.isHorizontal ? "width" : "height",
          o = 0,
          l = 0,
          c = t.el,
          u = !(!c || c.parentNode);
        if (
          (c
            ? (o = parseFloat(c.dataset[n] || "") || 0)
            : ((c = document.createElement("div")),
              (c.style.visibility = "hidden"),
              (this.track || document.body).prepend(c)),
          v(c, this.cn(_t) + " " + t.class + " " + t.customClass),
          o)
        )
          (c.style[n] = `${o}px`),
            (c.style[n === "width" ? "height" : "width"] = "");
        else {
          u && (this.track || document.body).prepend(c),
            (o =
              c.getBoundingClientRect()[n] *
              Math.max(
                1,
                ((e = window.visualViewport) === null || e === void 0
                  ? void 0
                  : e.scale) || 1
              ));
          let s = c[this.isHorizontal ? "offsetWidth" : "offsetHeight"];
          s - 1 > o && (o = s);
        }
        let m = getComputedStyle(c);
        return (
          m.boxSizing === "content-box" &&
            (this.isHorizontal
              ? ((o += parseFloat(m.paddingLeft) || 0),
                (o += parseFloat(m.paddingRight) || 0))
              : ((o += parseFloat(m.paddingTop) || 0),
                (o += parseFloat(m.paddingBottom) || 0))),
          (l =
            parseFloat(m[this.isHorizontal ? "marginRight" : "marginBottom"]) ||
            0),
          u
            ? (i = c.parentElement) === null || i === void 0 || i.removeChild(c)
            : t.el || c.remove(),
          { dim: F(o, 1e3), gap: F(l, 1e3) }
        );
      }
      getBounds() {
        let { isInfinite: t, isRTL: e, isHorizontal: i, pages: n } = this,
          o = { min: 0, max: 0 };
        if (t) o = { min: -1 / 0, max: 1 / 0 };
        else if (n.length) {
          let l = n[0].pos,
            c = n[n.length - 1].pos;
          o = e && i ? { min: l, max: c } : { min: -1 * c, max: -1 * l };
        }
        return { x: i ? o : { min: 0, max: 0 }, y: i ? { min: 0, max: 0 } : o };
      }
      repositionSlides() {
        let t,
          {
            isHorizontal: e,
            isRTL: i,
            isInfinite: n,
            viewport: o,
            viewportDim: l,
            contentDim: c,
            page: u,
            pages: m,
            slides: s,
            panzoom: r,
          } = this,
          d = 0,
          h = 0,
          f = 0,
          b = 0;
        r ? (b = -1 * r.current[this.axis]) : m[u] && (b = m[u].pos || 0),
          (t = e ? (i ? "right" : "left") : "top"),
          i && e && (b *= -1);
        for (let y of s) {
          let B = y.el;
          B
            ? (t === "top"
                ? ((B.style.right = ""), (B.style.left = ""))
                : (B.style.top = ""),
              y.index !== d
                ? (B.style[t] = h === 0 ? "" : `${F(h, 1e3)}px`)
                : (B.style[t] = ""),
              (f += y.dim + y.gap),
              d++)
            : (h += y.dim + y.gap);
        }
        if (n && f && o) {
          let y = getComputedStyle(o),
            B = "padding",
            k = e ? "Right" : "Bottom",
            M = parseFloat(y[B + (e ? "Left" : "Top")]);
          (b -= M), (l += M), (l += parseFloat(y[B + k]));
          for (let W of s)
            W.el &&
              (F(W.pos) < F(l) &&
                F(W.pos + W.dim + W.gap) < F(b) &&
                F(b) > F(c - l) &&
                (W.el.style[t] = `${F(h + f, 1e3)}px`),
              F(W.pos + W.gap) >= F(c - l) &&
                F(W.pos) > F(b + l) &&
                F(b) < F(l) &&
                (W.el.style[t] = `-${F(f, 1e3)}px`));
        }
        let p,
          g,
          Q = [...this.inTransition];
        if ((Q.length > 1 && ((p = m[Q[0]]), (g = m[Q[1]])), p && g)) {
          let y = 0;
          for (let B of s)
            B.el
              ? this.inTransition.has(B.index) &&
                p.slides.indexOf(B) < 0 &&
                (B.el.style[t] = `${F(y + (p.pos - g.pos), 1e3)}px`)
              : (y += B.dim + B.gap);
        }
      }
      createSlideEl(t) {
        let { track: e, slides: i } = this;
        if (!e || !t || (t.el && t.el.parentNode)) return;
        let n = t.el || document.createElement("div");
        v(n, this.cn(_t)), v(n, t.class), v(n, t.customClass);
        let o = t.html;
        o &&
          (o instanceof HTMLElement
            ? n.appendChild(o)
            : (n.innerHTML = t.html + ""));
        let l = [];
        i.forEach((s, r) => {
          s.el && l.push(r);
        });
        let c = t.index,
          u = null;
        l.length &&
          (u =
            i[l.reduce((s, r) => (Math.abs(r - c) < Math.abs(s - c) ? r : s))]);
        let m =
          u && u.el && u.el.parentNode
            ? u.index < t.index
              ? u.el.nextSibling
              : u.el
            : null;
        e.insertBefore(n, e.contains(m) ? m : null),
          (t.el = n),
          this.emit("createSlide", t);
      }
      removeSlideEl(t, e = !1) {
        let i = t?.el;
        if (!i || !i.parentNode) return;
        let n = this.cn(Ui);
        if (
          (i.classList.contains(n) && (U(i, n), this.emit("unselectSlide", t)),
          t.isDom && !e)
        )
          return (
            i.removeAttribute("aria-hidden"),
            i.removeAttribute("data-index"),
            void (i.style.left = "")
          );
        this.emit("removeSlide", t);
        let o = new CustomEvent(Yt);
        i.dispatchEvent(o), t.el && (t.el.remove(), (t.el = null));
      }
      transitionTo(t = 0, e = this.option("transition")) {
        var i, n, o, l;
        if (!e) return !1;
        let c = this.page,
          { pages: u, panzoom: m } = this;
        t = parseInt((t || 0).toString()) || 0;
        let s = this.getPageFromIndex(t);
        if (
          !m ||
          !u[s] ||
          u.length < 2 ||
          Math.abs(
            (((n =
              (i = u[c]) === null || i === void 0 ? void 0 : i.slides[0]) ===
              null || n === void 0
              ? void 0
              : n.dim) || 0) - this.viewportDim
          ) > 1
        )
          return !1;
        let r = t > c ? 1 : -1;
        this.isInfinite &&
          (c === 0 && t === u.length - 1 && (r = -1),
          c === u.length - 1 && t === 0 && (r = 1));
        let d = u[s].pos * (this.isRTL ? 1 : -1);
        if (c === s && Math.abs(d - m.target[this.axis]) < 1) return !1;
        this.clearTransitions();
        let h = m.isResting;
        v(this.container, this.cn("inTransition"));
        let f =
            ((o = u[c]) === null || o === void 0 ? void 0 : o.slides[0]) ||
            null,
          b =
            ((l = u[s]) === null || l === void 0 ? void 0 : l.slides[0]) ||
            null;
        this.inTransition.add(b.index), this.createSlideEl(b);
        let p = f.el,
          g = b.el;
        h || e === _t || ((e = "fadeFast"), (p = null));
        let Q = this.isRTL ? "next" : "prev",
          y = this.isRTL ? "prev" : "next";
        return (
          p &&
            (this.inTransition.add(f.index),
            (f.transition = e),
            p.addEventListener(Yt, this.onAnimationEnd),
            p.classList.add(`f-${e}Out`, `to-${r > 0 ? y : Q}`)),
          g &&
            ((b.transition = e),
            g.addEventListener(Yt, this.onAnimationEnd),
            g.classList.add(`f-${e}In`, `from-${r > 0 ? Q : y}`)),
          (m.current[this.axis] = d),
          (m.target[this.axis] = d),
          m.requestTick(),
          this.onChange(s),
          !0
        );
      }
      manageSlideVisiblity() {
        let t = new Set(),
          e = new Set(),
          i = this.getVisibleSlides(
            parseFloat(this.option("preload", 0) + "") || 0
          );
        for (let n of this.slides) i.has(n) ? t.add(n) : e.add(n);
        for (let n of this.inTransition) t.add(this.slides[n]);
        for (let n of t) this.createSlideEl(n), this.lazyLoadSlide(n);
        for (let n of e) t.has(n) || this.removeSlideEl(n);
        this.markSelectedSlides(), this.repositionSlides();
      }
      markSelectedSlides() {
        if (!this.pages[this.page] || !this.pages[this.page].slides) return;
        let t = "aria-hidden",
          e = this.cn(Ui);
        if (e)
          for (let i of this.slides) {
            let n = i.el;
            n &&
              ((n.dataset.index = `${i.index}`),
              n.classList.contains("f-thumbs__slide")
                ? this.getVisibleSlides(0).has(i)
                  ? n.removeAttribute(t)
                  : n.setAttribute(t, "true")
                : this.pages[this.page].slides.includes(i)
                ? (n.classList.contains(e) ||
                    (v(n, e), this.emit("selectSlide", i)),
                  n.removeAttribute(t))
                : (n.classList.contains(e) &&
                    (U(n, e), this.emit("unselectSlide", i)),
                  n.setAttribute(t, "true")));
          }
      }
      flipInfiniteTrack() {
        let {
            axis: t,
            isHorizontal: e,
            isInfinite: i,
            isRTL: n,
            viewportDim: o,
            contentDim: l,
          } = this,
          c = this.panzoom;
        if (!c || !i) return;
        let u = c.current[t],
          m = c.target[t] - u,
          s = 0,
          r = 0.5 * o;
        n && e
          ? (u < -r && ((s = -1), (u += l)), u > l - r && ((s = 1), (u -= l)))
          : (u > r && ((s = 1), (u -= l)), u < -l + r && ((s = -1), (u += l))),
          s && ((c.current[t] = u), (c.target[t] = u + m));
      }
      lazyLoadImg(t, e) {
        let i = this,
          n = "f-fadeIn",
          o = "is-preloading",
          l = !1,
          c = null,
          u = () => {
            l ||
              ((l = !0),
              c && (c.remove(), (c = null)),
              U(e, o),
              e.complete &&
                (v(e, n),
                setTimeout(() => {
                  U(e, n);
                }, 350)),
              this.option("adaptiveHeight") &&
                t.el &&
                this.pages[this.page].slides.indexOf(t) > -1 &&
                (i.updateMetrics(), i.setViewportHeight()),
              this.emit("load", t));
          };
        v(e, o),
          (e.src = e.dataset.lazySrcset || e.dataset.lazySrc || ""),
          delete e.dataset.lazySrc,
          delete e.dataset.lazySrcset,
          e.addEventListener("error", () => {
            u();
          }),
          e.addEventListener("load", () => {
            u();
          }),
          setTimeout(() => {
            let m = e.parentNode;
            m &&
              t.el &&
              (e.complete ? u() : l || ((c = S(Pe)), m.insertBefore(c, e)));
          }, 300);
      }
      lazyLoadSlide(t) {
        let e = t && t.el;
        if (!e) return;
        let i = new Set(),
          n = Array.from(
            e.querySelectorAll("[data-lazy-src],[data-lazy-srcset]")
          );
        e.dataset.lazySrc && n.push(e),
          n.map((o) => {
            o instanceof HTMLImageElement
              ? i.add(o)
              : o instanceof HTMLElement &&
                o.dataset.lazySrc &&
                ((o.style.backgroundImage = `url('${o.dataset.lazySrc}')`),
                delete o.dataset.lazySrc);
          });
        for (let o of i) this.lazyLoadImg(t, o);
      }
      onAnimationEnd(t) {
        var e;
        let i = t.target,
          n = i ? parseInt(i.dataset.index || "", 10) || 0 : -1,
          o = this.slides[n],
          l = t.animationName;
        if (!i || !o || !l) return;
        let c = !!this.inTransition.has(n) && o.transition;
        c &&
          l.substring(0, c.length + 2) === `f-${c}` &&
          this.inTransition.delete(n),
          this.inTransition.size || this.clearTransitions(),
          n === this.page &&
            !((e = this.panzoom) === null || e === void 0) &&
            e.isResting &&
            this.emit("settle");
      }
      onDecel(t, e = 0, i = 0, n = 0, o = 0) {
        if (this.option("dragFree")) return void this.setPageFromPosition();
        let { isRTL: l, isHorizontal: c, axis: u, pages: m } = this,
          s = m.length,
          r = Math.abs(Math.atan2(i, e) / (Math.PI / 180)),
          d = 0;
        if (((d = r > 45 && r < 135 ? (c ? 0 : i) : c ? e : 0), !s)) return;
        let h = this.page,
          f = l && c ? 1 : -1,
          b = t.current[u] * f,
          { pageIndex: p } = this.getPageFromPosition(b);
        Math.abs(d) > 5
          ? (m[h].dim <
              document.documentElement[
                "client" + (this.isHorizontal ? "Width" : "Height")
              ] -
                1 && (h = p),
            (h = l && c ? (d < 0 ? h - 1 : h + 1) : d < 0 ? h + 1 : h - 1))
          : (h = n === 0 && o === 0 ? h : p),
          this.slideTo(h, {
            transition: !1,
            friction: t.option("decelFriction"),
          });
      }
      onClick(t) {
        let e = t.target,
          i = e && R(e) ? e.dataset : null,
          n,
          o;
        i &&
          (i.carouselPage !== void 0
            ? ((o = "slideTo"), (n = i.carouselPage))
            : i.carouselNext !== void 0
            ? (o = "slideNext")
            : i.carouselPrev !== void 0 && (o = "slidePrev")),
          o
            ? (t.preventDefault(),
              t.stopPropagation(),
              e && !e.hasAttribute("disabled") && this[o](n))
            : this.emit("click", t);
      }
      onSlideTo(t) {
        let e = t.detail || 0;
        this.slideTo(this.getPageForSlide(e), { friction: 0 });
      }
      onChange(t, e = 0) {
        let i = this.page;
        (this.prevPage = i),
          (this.page = t),
          this.option("adaptiveHeight") && this.setViewportHeight(),
          t !== i && (this.markSelectedSlides(), this.emit("change", t, i, e));
      }
      onRefresh() {
        let t = this.contentDim,
          e = this.viewportDim;
        this.updateMetrics(),
          (this.contentDim === t && this.viewportDim === e) ||
            this.slideTo(this.page, { friction: 0, transition: !1 });
      }
      onScroll() {
        var t;
        (t = this.viewport) === null || t === void 0 || t.scroll(0, 0);
      }
      onResize() {
        this.option("breakpoints") && this.processOptions();
      }
      onBeforeTransform(t) {
        this.lp !== t.current[this.axis] &&
          (this.flipInfiniteTrack(), this.manageSlideVisiblity()),
          (this.lp = t.current.e);
      }
      onEndAnimation() {
        this.inTransition.size || this.emit("settle");
      }
      reInit(t = null, e = null) {
        this.destroy(),
          (this.state = Z.Init),
          (this.prevPage = null),
          (this.userOptions = t || this.userOptions),
          (this.userPlugins = e || this.userPlugins),
          this.processOptions();
      }
      slideTo(
        t = 0,
        {
          friction: e = this.option("friction"),
          transition: i = this.option("transition"),
        } = {}
      ) {
        if (this.state === Z.Destroy) return;
        t = parseInt((t || 0).toString()) || 0;
        let n = this.getPageFromIndex(t),
          { axis: o, isHorizontal: l, isRTL: c, pages: u, panzoom: m } = this,
          s = u.length,
          r = c && l ? 1 : -1;
        if (!m || !s) return;
        if (this.page !== n) {
          let h = new Event("beforeChange", { bubbles: !0, cancelable: !0 });
          if ((this.emit("beforeChange", h, t), h.defaultPrevented)) return;
        }
        if (this.transitionTo(t, i)) return;
        let d = u[n].pos;
        if (this.isInfinite) {
          let h = this.contentDim,
            f = m.target[o] * r;
          s === 2
            ? (d += h * Math.floor(parseFloat(t + "") / 2))
            : (d = [d, d - h, d + h].reduce(function (b, p) {
                return Math.abs(p - f) < Math.abs(b - f) ? p : b;
              }));
        }
        (d *= r),
          Math.abs(m.target[o] - d) < 1 ||
            (m.panTo({ x: l ? d : 0, y: l ? 0 : d, friction: e }),
            this.onChange(n));
      }
      slideToClosest(t) {
        if (this.panzoom) {
          let { pageIndex: e } = this.getPageFromPosition();
          this.slideTo(e, t);
        }
      }
      slideNext() {
        this.slideTo(this.page + 1);
      }
      slidePrev() {
        this.slideTo(this.page - 1);
      }
      clearTransitions() {
        this.inTransition.clear(), U(this.container, this.cn("inTransition"));
        let t = ["to-prev", "to-next", "from-prev", "from-next"];
        for (let e of this.slides) {
          let i = e.el;
          if (i) {
            i.removeEventListener(Yt, this.onAnimationEnd),
              i.classList.remove(...t);
            let n = e.transition;
            n && i.classList.remove(`f-${n}Out`, `f-${n}In`);
          }
        }
        this.manageSlideVisiblity();
      }
      addSlide(t, e) {
        var i, n, o, l;
        let c = this.panzoom,
          u =
            ((i = this.pages[this.page]) === null || i === void 0
              ? void 0
              : i.pos) || 0,
          m =
            ((n = this.pages[this.page]) === null || n === void 0
              ? void 0
              : n.dim) || 0,
          s = this.contentDim < this.viewportDim,
          r = Array.isArray(e) ? e : [e],
          d = [];
        for (let h of r) d.push(Oe(h));
        this.slides.splice(t, 0, ...d);
        for (let h = 0; h < this.slides.length; h++) this.slides[h].index = h;
        for (let h of d) this.emit("beforeInitSlide", h, h.index);
        if (
          (this.page >= t && (this.page += d.length), this.updateMetrics(), c)
        ) {
          let h =
              ((o = this.pages[this.page]) === null || o === void 0
                ? void 0
                : o.pos) || 0,
            f =
              ((l = this.pages[this.page]) === null || l === void 0
                ? void 0
                : l.dim) || 0,
            b = this.pages.length || 1,
            p = this.isRTL ? m - f : f - m,
            g = this.isRTL ? u - h : h - u;
          s && b === 1
            ? (t <= this.page &&
                ((c.current[this.axis] -= p), (c.target[this.axis] -= p)),
              c.panTo({ [this.isHorizontal ? "x" : "y"]: -1 * h }))
            : g &&
              t <= this.page &&
              ((c.target[this.axis] -= g),
              (c.current[this.axis] -= g),
              c.requestTick());
        }
        for (let h of d) this.emit("initSlide", h, h.index);
      }
      prependSlide(t) {
        this.addSlide(0, t);
      }
      appendSlide(t) {
        this.addSlide(this.slides.length, t);
      }
      removeSlide(t) {
        let e = this.slides.length;
        t = ((t % e) + e) % e;
        let i = this.slides[t];
        if (i) {
          this.removeSlideEl(i, !0), this.slides.splice(t, 1);
          for (let n = 0; n < this.slides.length; n++) this.slides[n].index = n;
          this.updateMetrics(),
            this.slideTo(this.page, { friction: 0, transition: !1 }),
            this.emit("destroySlide", i);
        }
      }
      updateMetrics() {
        let {
          panzoom: t,
          viewport: e,
          track: i,
          slides: n,
          isHorizontal: o,
          isInfinite: l,
        } = this;
        if (!i) return;
        let c = o ? "width" : "height",
          u = o ? "offsetWidth" : "offsetHeight";
        if (e) {
          let r = Math.max(e[u], F(e.getBoundingClientRect()[c], 1e3)),
            d = getComputedStyle(e),
            h = "padding",
            f = o ? "Right" : "Bottom";
          (r -= parseFloat(d[h + (o ? "Left" : "Top")]) + parseFloat(d[h + f])),
            (this.viewportDim = r);
        }
        let m,
          s = 0;
        for (let [r, d] of n.entries()) {
          let h = 0,
            f = 0;
          !d.el && m
            ? ((h = m.dim), (f = m.gap))
            : (({ dim: h, gap: f } = this.getSlideMetrics(d)), (m = d)),
            (h = F(h, 1e3)),
            (f = F(f, 1e3)),
            (d.dim = h),
            (d.gap = f),
            (d.pos = s),
            (s += h),
            (l || r < n.length - 1) && (s += f);
        }
        (s = F(s, 1e3)),
          (this.contentDim = s),
          t &&
            ((t.contentRect[c] = s),
            (t.contentRect[o ? "fullWidth" : "fullHeight"] = s)),
          (this.pages = this.createPages()),
          (this.pages = this.processPages()),
          this.state === Z.Init && this.setInitialPage(),
          (this.page = Math.max(0, Math.min(this.page, this.pages.length - 1))),
          this.manageSlideVisiblity(),
          this.emit("refresh");
      }
      getProgress(t, e = !1, i = !1) {
        t === void 0 && (t = this.page);
        let n = this,
          o = n.panzoom,
          l = n.contentDim,
          c = n.pages[t] || 0;
        if (!c || !o) return t > this.page ? -1 : 1;
        let u = -1 * o.current.e,
          m = F((u - c.pos) / (1 * c.dim), 1e3),
          s = m,
          r = m;
        this.isInfinite &&
          i !== !0 &&
          ((s = F((u - c.pos + l) / (1 * c.dim), 1e3)),
          (r = F((u - c.pos - l) / (1 * c.dim), 1e3)));
        let d = [m, s, r].reduce(function (h, f) {
          return Math.abs(f) < Math.abs(h) ? f : h;
        });
        return e ? d : d > 1 ? 1 : d < -1 ? -1 : d;
      }
      setViewportHeight() {
        let { page: t, pages: e, viewport: i, isHorizontal: n } = this;
        if (!i || !e[t]) return;
        let o = 0;
        n &&
          this.track &&
          ((this.track.style.height = "auto"),
          e[t].slides.forEach((l) => {
            l.el && (o = Math.max(o, l.el.offsetHeight));
          })),
          (i.style.height = o ? `${o}px` : "");
      }
      getPageForSlide(t) {
        for (let e of this.pages)
          for (let i of e.slides) if (i.index === t) return e.index;
        return -1;
      }
      getVisibleSlides(t = 0) {
        var e;
        let i = new Set(),
          {
            panzoom: n,
            contentDim: o,
            viewportDim: l,
            pages: c,
            page: u,
          } = this;
        if (l) {
          o =
            o +
              ((e = this.slides[this.slides.length - 1]) === null ||
              e === void 0
                ? void 0
                : e.gap) || 0;
          let m = 0;
          (m =
            n && n.state !== w.Init && n.state !== w.Destroy
              ? -1 * n.current[this.axis]
              : (c[u] && c[u].pos) || 0),
            this.isInfinite && (m -= Math.floor(m / o) * o),
            this.isRTL && this.isHorizontal && (m *= -1);
          let s = m - l * t,
            r = m + l * (t + 1),
            d = this.isInfinite ? [-1, 0, 1] : [0];
          for (let h of this.slides)
            for (let f of d) {
              let b = h.pos + f * o,
                p = b + h.dim + h.gap;
              b < r && p > s && i.add(h);
            }
        }
        return i;
      }
      getPageFromPosition(t) {
        let {
            viewportDim: e,
            contentDim: i,
            slides: n,
            pages: o,
            panzoom: l,
          } = this,
          c = o.length,
          u = n.length,
          m = n[0],
          s = n[u - 1],
          r = this.option("center"),
          d = 0,
          h = 0,
          f = 0,
          b = t === void 0 ? -1 * (l?.target[this.axis] || 0) : t;
        r && (b += 0.5 * e),
          this.isInfinite
            ? (b < m.pos - 0.5 * s.gap && ((b -= i), (f = -1)),
              b > s.pos + s.dim + 0.5 * s.gap && ((b -= i), (f = 1)))
            : (b = Math.max(m.pos || 0, Math.min(b, s.pos)));
        let p = s,
          g = n.find((Q) => {
            let y = Q.pos - 0.5 * p.gap,
              B = Q.pos + Q.dim + 0.5 * Q.gap;
            return (p = Q), b >= y && b < B;
          });
        return (
          g || (g = s),
          (h = this.getPageForSlide(g.index)),
          (d = h + f * c),
          { page: d, pageIndex: h }
        );
      }
      setPageFromPosition() {
        let { pageIndex: t } = this.getPageFromPosition();
        this.onChange(t);
      }
      destroy() {
        if ([Z.Destroy].includes(this.state)) return;
        this.state = Z.Destroy;
        let {
            container: t,
            viewport: e,
            track: i,
            slides: n,
            panzoom: o,
          } = this,
          l = this.option("classes");
        t.removeEventListener("click", this.onClick, {
          passive: !1,
          capture: !1,
        }),
          t.removeEventListener("slideTo", this.onSlideTo),
          window.removeEventListener("resize", this.onResize),
          o && (o.destroy(), (this.panzoom = null)),
          n &&
            n.forEach((u) => {
              this.removeSlideEl(u);
            }),
          this.detachPlugins(),
          e &&
            (e.removeEventListener("scroll", this.onScroll),
            e.offsetParent &&
              i &&
              i.offsetParent &&
              e.replaceWith(...i.childNodes));
        for (let [u, m] of Object.entries(l))
          u !== "container" && m && t.classList.remove(m);
        (this.track = null),
          (this.viewport = null),
          (this.page = 0),
          (this.slides = []);
        let c = this.events.get("ready");
        (this.events = new Map()), c && this.events.set("ready", c);
      }
    };
  Object.defineProperty(dt, "Panzoom", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: st,
  }),
    Object.defineProperty(dt, "defaults", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: rs,
    }),
    Object.defineProperty(dt, "Plugins", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: ds,
    });
  var zi = function (a) {
      if (!R(a)) return 0;
      let t = window.scrollY,
        e = window.innerHeight,
        i = t + e,
        n = a.getBoundingClientRect(),
        o = n.y + t,
        l = n.height,
        c = o + l;
      if (t > c || i < o) return 0;
      if ((t < o && i > c) || (o < t && c > i)) return 100;
      let u = l;
      o < t && (u -= t - o), c > i && (u -= c - i);
      let m = (u / e) * 100;
      return Math.round(m);
    },
    Ft = !(
      typeof window > "u" ||
      !window.document ||
      !window.document.createElement
    ),
    Me,
    Ie = [
      "a[href]",
      "area[href]",
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      "select:not([disabled]):not([aria-hidden])",
      "textarea:not([disabled]):not([aria-hidden])",
      "button:not([disabled]):not([aria-hidden]):not(.fancybox-focus-guard)",
      "iframe",
      "object",
      "embed",
      "video",
      "audio",
      "[contenteditable]",
      '[tabindex]:not([tabindex^="-"]):not([disabled]):not([aria-hidden])',
    ].join(","),
    wi = (a) => {
      if (a && Ft) {
        Me === void 0 &&
          document.createElement("div").focus({
            get preventScroll() {
              return (Me = !0), !1;
            },
          });
        try {
          if (Me) a.focus({ preventScroll: !0 });
          else {
            let t = window.scrollY || document.body.scrollTop,
              e = window.scrollX || document.body.scrollLeft;
            a.focus(),
              document.body.scrollTo({ top: t, left: e, behavior: "auto" });
          }
        } catch {}
      }
    },
    ji = () => {
      let a = document,
        t,
        e = "",
        i = "",
        n = "";
      return (
        a.fullscreenEnabled
          ? ((e = "requestFullscreen"),
            (i = "exitFullscreen"),
            (n = "fullscreenElement"))
          : a.webkitFullscreenEnabled &&
            ((e = "webkitRequestFullscreen"),
            (i = "webkitExitFullscreen"),
            (n = "webkitFullscreenElement")),
        e &&
          (t = {
            request: function (o = a.documentElement) {
              return e === "webkitRequestFullscreen"
                ? o[e](Element.ALLOW_KEYBOARD_INPUT)
                : o[e]();
            },
            exit: function () {
              return a[n] && a[i]();
            },
            isFullscreen: function () {
              return a[n];
            },
          }),
        t
      );
    },
    Je = {
      animated: !0,
      autoFocus: !0,
      backdropClick: "close",
      Carousel: {
        classes: {
          container: "fancybox__carousel",
          viewport: "fancybox__viewport",
          track: "fancybox__track",
          slide: "fancybox__slide",
        },
      },
      closeButton: "auto",
      closeExisting: !1,
      commonCaption: !1,
      compact: () =>
        window.matchMedia("(max-width: 578px), (max-height: 578px)").matches,
      contentClick: "toggleZoom",
      contentDblClick: !1,
      defaultType: "image",
      defaultDisplay: "flex",
      dragToClose: !0,
      Fullscreen: { autoStart: !1 },
      groupAll: !1,
      groupAttr: "data-fancybox",
      hideClass: "f-fadeOut",
      hideScrollbar: !0,
      idle: 3500,
      keyboard: {
        Escape: "close",
        Delete: "close",
        Backspace: "close",
        PageUp: "next",
        PageDown: "prev",
        ArrowUp: "prev",
        ArrowDown: "next",
        ArrowRight: "next",
        ArrowLeft: "prev",
      },
      l10n: Object.assign(Object.assign({}, Si), {
        CLOSE: "Close",
        NEXT: "Next",
        PREV: "Previous",
        MODAL: "You can close this modal content with the ESC key",
        ERROR: "Something Went Wrong, Please Try Again Later",
        IMAGE_ERROR: "Image Not Found",
        ELEMENT_NOT_FOUND: "HTML Element Not Found",
        AJAX_NOT_FOUND: "Error Loading AJAX : Not Found",
        AJAX_FORBIDDEN: "Error Loading AJAX : Forbidden",
        IFRAME_ERROR: "Error Loading Page",
        TOGGLE_ZOOM: "Toggle zoom level",
        TOGGLE_THUMBS: "Toggle thumbnails",
        TOGGLE_SLIDESHOW: "Toggle slideshow",
        TOGGLE_FULLSCREEN: "Toggle full-screen mode",
        DOWNLOAD: "Download",
      }),
      parentEl: null,
      placeFocusBack: !0,
      showClass: "f-zoomInUp",
      startIndex: 0,
      tpl: {
        closeButton:
          '<button data-fancybox-close class="f-button is-close-btn" title="{{CLOSE}}"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" tabindex="-1"><path d="M20 20L4 4m16 0L4 20"/></svg></button>',
        main: `<div class="fancybox__container" role="dialog" aria-modal="true" aria-label="{{MODAL}}" tabindex="-1">
    <div class="fancybox__backdrop"></div>
    <div class="fancybox__carousel"></div>
    <div class="fancybox__footer"></div>
  </div>`,
      },
      trapFocus: !0,
      wheel: "zoom",
    },
    O,
    I;
  (function (a) {
    (a[(a.Init = 0)] = "Init"),
      (a[(a.Ready = 1)] = "Ready"),
      (a[(a.Closing = 2)] = "Closing"),
      (a[(a.CustomClosing = 3)] = "CustomClosing"),
      (a[(a.Destroy = 4)] = "Destroy");
  })(O || (O = {})),
    (function (a) {
      (a[(a.Loading = 0)] = "Loading"),
        (a[(a.Opening = 1)] = "Opening"),
        (a[(a.Ready = 2)] = "Ready"),
        (a[(a.Closing = 3)] = "Closing");
    })(I || (I = {}));
  var Li = "",
    Qt = !1,
    Dt = !1,
    it = null,
    Ji = () => {
      let a = "",
        t = "",
        e = E.getInstance();
      if (e) {
        let i = e.carousel,
          n = e.getSlide();
        if (i && n) {
          let o = n.slug || void 0,
            l = n.triggerEl || void 0;
          (t = o || e.option("slug") || ""),
            !t && l && l.dataset && (t = l.dataset.fancybox || ""),
            t &&
              t !== "true" &&
              (a =
                "#" +
                t +
                (!o && i.slides.length > 1 ? "-" + (n.index + 1) : ""));
        }
      }
      return { hash: a, slug: t, index: 1 };
    },
    Ht = () => {
      let a = new URL(document.URL).hash,
        t = a.slice(1).split("-"),
        e = t[t.length - 1],
        i = (e && /^\+?\d+$/.test(e) && parseInt(t.pop() || "1", 10)) || 1;
      return { hash: a, slug: t.join("-"), index: i };
    },
    Hi = () => {
      let { slug: a, index: t } = Ht();
      if (!a) return;
      let e = document.querySelector(`[data-slug="${a}"]`);
      if (
        (e &&
          e.dispatchEvent(
            new CustomEvent("click", { bubbles: !0, cancelable: !0 })
          ),
        E.getInstance())
      )
        return;
      let i = document.querySelectorAll(`[data-fancybox="${a}"]`);
      i.length &&
        ((e = i[t - 1]),
        e &&
          e.dispatchEvent(
            new CustomEvent("click", { bubbles: !0, cancelable: !0 })
          ));
    },
    Pi = () => {
      if (E.defaults.Hash === !1) return;
      let a = E.getInstance();
      if (a?.options.Hash === !1) return;
      let { slug: t, index: e } = Ht(),
        { slug: i } = Ji();
      a && (t === i ? a.jumpTo(e - 1) : ((Qt = !0), a.close())), Hi();
    },
    Ki = () => {
      it && clearTimeout(it),
        queueMicrotask(() => {
          Pi();
        });
    },
    Wi = () => {
      window.addEventListener("hashchange", Ki, !1),
        setTimeout(() => {
          Pi();
        }, 500);
    };
  Ft &&
    (/complete|interactive|loaded/.test(document.readyState)
      ? Wi()
      : document.addEventListener("DOMContentLoaded", Wi));
  var Xt = "is-zooming-in",
    Pt = class extends Y {
      onCreateSlide(t, e, i) {
        let n = this.instance.optionFor(i, "src") || "";
        i.el &&
          i.type === "image" &&
          typeof n == "string" &&
          this.setImage(i, n);
      }
      onRemoveSlide(t, e, i) {
        i.panzoom && i.panzoom.destroy(),
          (i.panzoom = void 0),
          (i.imageEl = void 0);
      }
      onChange(t, e, i, n) {
        U(this.instance.container, Xt);
        for (let o of e.slides) {
          let l = o.panzoom;
          l && o.index !== i && l.reset(0.35);
        }
      }
      onClose() {
        var t;
        let e = this.instance,
          i = e.container,
          n = e.getSlide();
        if (!i || !i.parentElement || !n) return;
        let { el: o, contentEl: l, panzoom: c, thumbElSrc: u } = n;
        if (
          !o ||
          !u ||
          !l ||
          !c ||
          c.isContentLoading ||
          c.state === w.Init ||
          c.state === w.Destroy
        )
          return;
        c.updateMetrics();
        let m = this.getZoomInfo(n);
        if (!m) return;
        (this.instance.state = O.CustomClosing),
          i.classList.remove(Xt),
          i.classList.add("is-zooming-out"),
          (l.style.backgroundImage = `url('${u}')`);
        let s = i.getBoundingClientRect();
        (((t = window.visualViewport) === null || t === void 0
          ? void 0
          : t.scale) || 1) === 1 &&
          Object.assign(i.style, {
            position: "absolute",
            top: `${i.offsetTop + window.scrollY}px`,
            left: `${i.offsetLeft + window.scrollX}px`,
            bottom: "auto",
            right: "auto",
            width: `${s.width}px`,
            height: `${s.height}px`,
            overflow: "hidden",
          });
        let { x: r, y: d, scale: h, opacity: f } = m;
        if (f) {
          let b = ((p, g, Q, y) => {
            let B = g - p,
              k = y - Q;
            return (M) => Q + (((M - p) / B) * k || 0);
          })(c.scale, h, 1, 0);
          c.on("afterTransform", () => {
            l.style.opacity = b(c.scale) + "";
          });
        }
        c.on("endAnimation", () => {
          e.destroy();
        }),
          (c.target.a = h),
          (c.target.b = 0),
          (c.target.c = 0),
          (c.target.d = h),
          c.panTo({
            x: r,
            y: d,
            scale: h,
            friction: f ? 0.2 : 0.33,
            ignoreBounds: !0,
          }),
          c.isResting && e.destroy();
      }
      setImage(t, e) {
        let i = this.instance;
        (t.src = e),
          this.process(t, e).then(
            (n) => {
              let { contentEl: o, imageEl: l, thumbElSrc: c, el: u } = t;
              if (i.isClosing() || !o || !l) return;
              o.offsetHeight;
              let m = !!i.isOpeningSlide(t) && this.getZoomInfo(t);
              if (this.option("protected") && u) {
                u.addEventListener("contextmenu", (d) => {
                  d.preventDefault();
                });
                let r = document.createElement("div");
                v(r, "fancybox-protected"), o.appendChild(r);
              }
              if (c && m) {
                let r = n.contentRect,
                  d = Math.max(r.fullWidth, r.fullHeight),
                  h = null;
                !m.opacity &&
                  d > 1200 &&
                  ((h = document.createElement("img")),
                  v(h, "fancybox-ghost"),
                  (h.src = c),
                  o.appendChild(h));
                let f = () => {
                  h &&
                    (v(h, "f-fadeFastOut"),
                    setTimeout(() => {
                      h && (h.remove(), (h = null));
                    }, 200));
                };
                ((s = c),
                new Promise((b, p) => {
                  let g = new Image();
                  (g.onload = b), (g.onerror = p), (g.src = s);
                })).then(
                  () => {
                    i.hideLoading(t),
                      (t.state = I.Opening),
                      this.instance.emit("reveal", t),
                      this.zoomIn(t).then(
                        () => {
                          f(), this.instance.done(t);
                        },
                        () => {}
                      ),
                      h &&
                        setTimeout(
                          () => {
                            f();
                          },
                          d > 2500 ? 800 : 200
                        );
                  },
                  () => {
                    i.hideLoading(t), i.revealContent(t);
                  }
                );
              } else {
                let r = this.optionFor(t, "initialSize"),
                  d = this.optionFor(t, "zoom"),
                  h = {
                    event: i.prevMouseMoveEvent || i.options.event,
                    friction: d ? 0.12 : 0,
                  },
                  f = i.optionFor(t, "showClass") || void 0,
                  b = !0;
                i.isOpeningSlide(t) &&
                  (r === "full"
                    ? n.zoomToFull(h)
                    : r === "cover"
                    ? n.zoomToCover(h)
                    : r === "max"
                    ? n.zoomToMax(h)
                    : (b = !1),
                  n.stop("current")),
                  b && f && (f = n.isDragging ? "f-fadeIn" : ""),
                  i.hideLoading(t),
                  i.revealContent(t, f);
              }
              var s;
            },
            () => {
              i.setError(t, "{{IMAGE_ERROR}}");
            }
          );
      }
      process(t, e) {
        return new Promise((i, n) => {
          var o;
          let l = this.instance,
            c = t.el;
          l.clearContent(t), l.showLoading(t);
          let u = this.optionFor(t, "content");
          if ((typeof u == "string" && (u = S(u)), !u || !R(u))) {
            if (
              ((u = document.createElement("img")),
              u instanceof HTMLImageElement)
            ) {
              let m = "",
                s = t.caption;
              (m =
                typeof s == "string" && s
                  ? s.replace(/<[^>]+>/gi, "").substring(0, 1e3)
                  : `Image ${t.index + 1} of ${
                      ((o = l.carousel) === null || o === void 0
                        ? void 0
                        : o.pages.length) || 1
                    }`),
                (u.src = e || ""),
                (u.alt = m),
                (u.draggable = !1),
                t.srcset && u.setAttribute("srcset", t.srcset),
                this.instance.isOpeningSlide(t) && (u.fetchPriority = "high");
            }
            t.sizes && u.setAttribute("sizes", t.sizes);
          }
          v(u, "fancybox-image"),
            (t.imageEl = u),
            l.setContent(t, u, !1),
            (t.panzoom = new st(
              c,
              V({ transformParent: !0 }, this.option("Panzoom") || {}, {
                content: u,
                width: (m, s) => l.optionFor(t, "width", "auto", s) || "auto",
                height: (m, s) => l.optionFor(t, "height", "auto", s) || "auto",
                wheel: () => {
                  let m = l.option("wheel");
                  return (m === "zoom" || m == "pan") && m;
                },
                click: (m, s) => {
                  var r, d;
                  if (
                    l.isCompact ||
                    l.isClosing() ||
                    t.index !==
                      ((r = l.getSlide()) === null || r === void 0
                        ? void 0
                        : r.index)
                  )
                    return !1;
                  if (s) {
                    let f = s.composedPath()[0];
                    if (
                      [
                        "A",
                        "BUTTON",
                        "TEXTAREA",
                        "OPTION",
                        "INPUT",
                        "SELECT",
                        "VIDEO",
                      ].includes(f.nodeName)
                    )
                      return !1;
                  }
                  let h =
                    !s ||
                    (s.target &&
                      ((d = t.contentEl) === null || d === void 0
                        ? void 0
                        : d.contains(s.target)));
                  return l.option(h ? "contentClick" : "backdropClick") || !1;
                },
                dblClick: () =>
                  l.isCompact
                    ? "toggleZoom"
                    : l.option("contentDblClick") || !1,
                spinner: !1,
                panOnlyZoomed: !0,
                wheelLimit: 1 / 0,
                on: {
                  ready: (m) => {
                    i(m);
                  },
                  error: () => {
                    n();
                  },
                  destroy: () => {
                    n();
                  },
                },
              })
            ));
        });
      }
      zoomIn(t) {
        return new Promise((e, i) => {
          let n = this.instance,
            o = n.container,
            { panzoom: l, contentEl: c, el: u } = t;
          l && l.updateMetrics();
          let m = this.getZoomInfo(t);
          if (!(m && u && c && l && o)) return void i();
          let { x: s, y: r, scale: d, opacity: h } = m,
            f = () => {
              t.state !== I.Closing &&
                (h &&
                  (c.style.opacity =
                    Math.max(Math.min(1, 1 - (1 - l.scale) / (1 - d)), 0) + ""),
                l.scale >= 1 && l.scale > l.targetScale - 0.1 && e(l));
            },
            b = (Q) => {
              ((Q.scale < 0.99 || Q.scale > 1.01) && !Q.isDragging) ||
                (U(o, Xt),
                (c.style.opacity = ""),
                Q.off("endAnimation", b),
                Q.off("touchStart", b),
                Q.off("afterTransform", f),
                e(Q));
            };
          l.on("endAnimation", b),
            l.on("touchStart", b),
            l.on("afterTransform", f),
            l.on(["error", "destroy"], () => {
              i();
            }),
            l.panTo({ x: s, y: r, scale: d, friction: 0, ignoreBounds: !0 }),
            l.stop("current");
          let p = {
              event:
                l.panMode === "mousemove"
                  ? n.prevMouseMoveEvent || n.options.event
                  : void 0,
            },
            g = this.optionFor(t, "initialSize");
          v(o, Xt),
            n.hideLoading(t),
            g === "full"
              ? l.zoomToFull(p)
              : g === "cover"
              ? l.zoomToCover(p)
              : g === "max"
              ? l.zoomToMax(p)
              : l.reset(0.172);
        });
      }
      getZoomInfo(t) {
        let { el: e, imageEl: i, thumbEl: n, panzoom: o } = t,
          l = this.instance,
          c = l.container;
        if (
          !e ||
          !i ||
          !n ||
          !o ||
          zi(n) < 3 ||
          !this.optionFor(t, "zoom") ||
          !c ||
          l.state === O.Destroy ||
          getComputedStyle(c).getPropertyValue("--f-images-zoom") === "0"
        )
          return !1;
        let u = window.visualViewport || null;
        if ((u ? u.scale : 1) !== 1) return !1;
        let {
            top: m,
            left: s,
            width: r,
            height: d,
          } = n.getBoundingClientRect(),
          { top: h, left: f, fitWidth: b, fitHeight: p } = o.contentRect;
        if (!(r && d && b && p)) return !1;
        let g = o.container.getBoundingClientRect();
        (f += g.left), (h += g.top);
        let Q = -1 * (f + 0.5 * b - (s + 0.5 * r)),
          y = -1 * (h + 0.5 * p - (m + 0.5 * d)),
          B = r / b,
          k = this.option("zoomOpacity") || !1;
        return (
          k === "auto" && (k = Math.abs(r / d - b / p) > 0.1),
          { x: Q, y, scale: B, opacity: k }
        );
      }
      attach() {
        let t = this,
          e = t.instance;
        e.on("Carousel.change", t.onChange),
          e.on("Carousel.createSlide", t.onCreateSlide),
          e.on("Carousel.removeSlide", t.onRemoveSlide),
          e.on("close", t.onClose);
      }
      detach() {
        let t = this,
          e = t.instance;
        e.off("Carousel.change", t.onChange),
          e.off("Carousel.createSlide", t.onCreateSlide),
          e.off("Carousel.removeSlide", t.onRemoveSlide),
          e.off("close", t.onClose);
      }
    };
  Object.defineProperty(Pt, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: {
      initialSize: "fit",
      Panzoom: { maxScale: 1 },
      protected: !1,
      zoom: !0,
      zoomOpacity: "auto",
    },
  }),
    typeof SuppressedError == "function" && SuppressedError;
  var Re = "html",
    Ci = "image",
    Ve = "map",
    H = "youtube",
    q = "vimeo",
    bt = "html5video",
    Ei = (a, t = {}) => {
      let e = new URL(a),
        i = new URLSearchParams(e.search),
        n = new URLSearchParams();
      for (let [c, u] of [...i, ...Object.entries(t)]) {
        let m = u + "";
        if (c === "t") {
          let s = m.match(/((\d*)m)?(\d*)s?/);
          s &&
            n.set(
              "start",
              60 * parseInt(s[2] || "0") + parseInt(s[3] || "0") + ""
            );
        } else n.set(c, m);
      }
      let o = n + "",
        l = a.match(/#t=((.*)?\d+s)/);
      return l && (o += `#t=${l[1]}`), o;
    },
    us = {
      ajax: null,
      autoSize: !0,
      iframeAttr: { allow: "autoplay; fullscreen", scrolling: "auto" },
      preload: !0,
      videoAutoplay: !0,
      videoRatio: 16 / 9,
      videoTpl: `<video class="fancybox__html5video" playsinline controls controlsList="nodownload" poster="{{poster}}">
  <source src="{{src}}" type="{{format}}" />Sorry, your browser doesn't support embedded videos.</video>`,
      videoFormat: "",
      vimeo: { byline: 1, color: "00adef", controls: 1, dnt: 1, muted: 0 },
      youtube: { controls: 1, enablejsapi: 1, nocookie: 1, rel: 0, fs: 1 },
    },
    hs = [
      "image",
      "html",
      "ajax",
      "inline",
      "clone",
      "iframe",
      "map",
      "pdf",
      "html5video",
      "youtube",
      "vimeo",
    ],
    Kt = class extends Y {
      onBeforeInitSlide(t, e, i) {
        this.processType(i);
      }
      onCreateSlide(t, e, i) {
        this.setContent(i);
      }
      onClearContent(t, e) {
        e.xhr && (e.xhr.abort(), (e.xhr = null));
        let i = e.iframeEl;
        i &&
          ((i.onload = i.onerror = null),
          (i.src = "//about:blank"),
          (e.iframeEl = null));
        let n = e.contentEl,
          o = e.placeholderEl;
        if (e.type === "inline" && n && o)
          n.classList.remove("fancybox__content"),
            getComputedStyle(n).getPropertyValue("display") !== "none" &&
              (n.style.display = "none"),
            setTimeout(() => {
              o &&
                (n && o.parentNode && o.parentNode.insertBefore(n, o),
                o.remove());
            }, 0),
            (e.contentEl = void 0),
            (e.placeholderEl = void 0);
        else
          for (; e.el && e.el.firstChild; ) e.el.removeChild(e.el.firstChild);
      }
      onSelectSlide(t, e, i) {
        i.state === I.Ready && this.playVideo();
      }
      onUnselectSlide(t, e, i) {
        var n, o;
        if (i.type === bt) {
          try {
            (o =
              (n = i.el) === null || n === void 0
                ? void 0
                : n.querySelector("video")) === null ||
              o === void 0 ||
              o.pause();
          } catch {}
          return;
        }
        let l;
        i.type === q
          ? (l = { method: "pause", value: "true" })
          : i.type === H && (l = { event: "command", func: "pauseVideo" }),
          l &&
            i.iframeEl &&
            i.iframeEl.contentWindow &&
            i.iframeEl.contentWindow.postMessage(JSON.stringify(l), "*"),
          i.poller && clearTimeout(i.poller);
      }
      onDone(t, e) {
        t.isCurrentSlide(e) && !t.isClosing() && this.playVideo();
      }
      onRefresh(t, e) {
        e.slides.forEach((i) => {
          i.el && (this.resizeIframe(i), this.setAspectRatio(i));
        });
      }
      onMessage(t) {
        try {
          let e = JSON.parse(t.data);
          if (t.origin === "https://player.vimeo.com") {
            if (e.event === "ready")
              for (let i of Array.from(
                document.getElementsByClassName("fancybox__iframe")
              ))
                i instanceof HTMLIFrameElement &&
                  i.contentWindow === t.source &&
                  (i.dataset.ready = "true");
          } else if (
            t.origin.match(/^https:\/\/(www.)?youtube(-nocookie)?.com$/) &&
            e.event === "onReady"
          ) {
            let i = document.getElementById(e.id);
            i && (i.dataset.ready = "true");
          }
        } catch {}
      }
      loadAjaxContent(t) {
        let e = this.instance.optionFor(t, "src") || "";
        this.instance.showLoading(t);
        let i = this.instance,
          n = new XMLHttpRequest();
        i.showLoading(t),
          (n.onreadystatechange = function () {
            n.readyState === XMLHttpRequest.DONE &&
              i.state === O.Ready &&
              (i.hideLoading(t),
              n.status === 200
                ? i.setContent(t, n.responseText)
                : i.setError(
                    t,
                    n.status === 404
                      ? "{{AJAX_NOT_FOUND}}"
                      : "{{AJAX_FORBIDDEN}}"
                  ));
          });
        let o = t.ajax || null;
        n.open(o ? "POST" : "GET", e + ""),
          n.setRequestHeader(
            "Content-Type",
            "application/x-www-form-urlencoded"
          ),
          n.setRequestHeader("X-Requested-With", "XMLHttpRequest"),
          n.send(o),
          (t.xhr = n);
      }
      setInlineContent(t) {
        let e = null;
        if (R(t.src)) e = t.src;
        else if (typeof t.src == "string") {
          let i = t.src.split("#", 2).pop();
          e = i ? document.getElementById(i) : null;
        }
        if (e) {
          if (t.type === "clone" || e.closest(".fancybox__slide")) {
            e = e.cloneNode(!0);
            let i = e.dataset.animationName;
            i && (e.classList.remove(i), delete e.dataset.animationName);
            let n = e.getAttribute("id");
            (n = n ? `${n}--clone` : `clone-${this.instance.id}-${t.index}`),
              e.setAttribute("id", n);
          } else if (e.parentNode) {
            let i = document.createElement("div");
            i.classList.add("fancybox-placeholder"),
              e.parentNode.insertBefore(i, e),
              (t.placeholderEl = i);
          }
          this.instance.setContent(t, e);
        } else this.instance.setError(t, "{{ELEMENT_NOT_FOUND}}");
      }
      setIframeContent(t) {
        let { src: e, el: i } = t;
        if (!e || typeof e != "string" || !i) return;
        i.classList.add("is-loading");
        let n = this.instance,
          o = document.createElement("iframe");
        (o.className = "fancybox__iframe"),
          o.setAttribute("id", `fancybox__iframe_${n.id}_${t.index}`);
        for (let [c, u] of Object.entries(
          this.optionFor(t, "iframeAttr") || {}
        ))
          o.setAttribute(c, u);
        (o.onerror = () => {
          n.setError(t, "{{IFRAME_ERROR}}");
        }),
          (t.iframeEl = o);
        let l = this.optionFor(t, "preload");
        if (t.type !== "iframe" || l === !1)
          return (
            o.setAttribute("src", t.src + ""),
            n.setContent(t, o, !1),
            this.resizeIframe(t),
            void n.revealContent(t)
          );
        n.showLoading(t),
          (o.onload = () => {
            if (!o.src.length) return;
            let c = o.dataset.ready !== "true";
            (o.dataset.ready = "true"),
              this.resizeIframe(t),
              c ? n.revealContent(t) : n.hideLoading(t);
          }),
          o.setAttribute("src", e),
          n.setContent(t, o, !1);
      }
      resizeIframe(t) {
        let { type: e, iframeEl: i } = t;
        if (e === H || e === q) return;
        let n = i?.parentElement;
        if (!i || !n) return;
        let o = t.autoSize;
        o === void 0 && (o = this.optionFor(t, "autoSize"));
        let l = t.width || 0,
          c = t.height || 0;
        l && c && (o = !1);
        let u = n && n.style;
        if (t.preload !== !1 && o !== !1 && u)
          try {
            let m = window.getComputedStyle(n),
              s = parseFloat(m.paddingLeft) + parseFloat(m.paddingRight),
              r = parseFloat(m.paddingTop) + parseFloat(m.paddingBottom),
              d = i.contentWindow;
            if (d) {
              let h = d.document,
                f = h.getElementsByTagName(Re)[0],
                b = h.body;
              (u.width = ""),
                (b.style.overflow = "hidden"),
                (l = l || f.scrollWidth + s),
                (u.width = `${l}px`),
                (b.style.overflow = ""),
                (u.flex = "0 0 auto"),
                (u.height = `${b.scrollHeight}px`),
                (c = f.scrollHeight + r);
            }
          } catch {}
        if (l || c) {
          let m = { flex: "0 1 auto", width: "", height: "" };
          l && l !== "auto" && (m.width = `${l}px`),
            c && c !== "auto" && (m.height = `${c}px`),
            Object.assign(u, m);
        }
      }
      playVideo() {
        let t = this.instance.getSlide();
        if (!t) return;
        let { el: e } = t;
        if (!e || !e.offsetParent || !this.optionFor(t, "videoAutoplay"))
          return;
        if (t.type === bt)
          try {
            let n = e.querySelector("video");
            if (n) {
              let o = n.play();
              o !== void 0 &&
                o
                  .then(() => {})
                  .catch((l) => {
                    (n.muted = !0), n.play();
                  });
            }
          } catch {}
        if (t.type !== H && t.type !== q) return;
        let i = () => {
          if (t.iframeEl && t.iframeEl.contentWindow) {
            let n;
            if (t.iframeEl.dataset.ready === "true")
              return (
                (n =
                  t.type === H
                    ? { event: "command", func: "playVideo" }
                    : { method: "play", value: "true" }),
                n &&
                  t.iframeEl.contentWindow.postMessage(JSON.stringify(n), "*"),
                void (t.poller = void 0)
              );
            t.type === H &&
              ((n = { event: "listening", id: t.iframeEl.getAttribute("id") }),
              t.iframeEl.contentWindow.postMessage(JSON.stringify(n), "*"));
          }
          t.poller = setTimeout(i, 250);
        };
        i();
      }
      processType(t) {
        if (t.html) return (t.type = Re), (t.src = t.html), void (t.html = "");
        let e = this.instance.optionFor(t, "src", "");
        if (!e || typeof e != "string") return;
        let i = t.type,
          n = null;
        if (
          (n = e.match(
            /(youtube\.com|youtu\.be|youtube\-nocookie\.com)\/(?:watch\?(?:.*&)?v=|v\/|u\/|shorts\/|embed\/?)?(videoseries\?list=(?:.*)|[\w-]{11}|\?listType=(?:.*)&list=(?:.*))(?:.*)/i
          ))
        ) {
          let o = this.optionFor(t, H),
            { nocookie: l } = o,
            c = (function (r, d) {
              var h = {};
              for (var f in r)
                Object.prototype.hasOwnProperty.call(r, f) &&
                  d.indexOf(f) < 0 &&
                  (h[f] = r[f]);
              if (
                r != null &&
                typeof Object.getOwnPropertySymbols == "function"
              ) {
                var b = 0;
                for (f = Object.getOwnPropertySymbols(r); b < f.length; b++)
                  d.indexOf(f[b]) < 0 &&
                    Object.prototype.propertyIsEnumerable.call(r, f[b]) &&
                    (h[f[b]] = r[f[b]]);
              }
              return h;
            })(o, ["nocookie"]),
            u = `www.youtube${l ? "-nocookie" : ""}.com`,
            m = Ei(e, c),
            s = encodeURIComponent(n[2]);
          (t.videoId = s),
            (t.src = `https://${u}/embed/${s}?${m}`),
            (t.thumbSrc =
              t.thumbSrc || `https://i.ytimg.com/vi/${s}/mqdefault.jpg`),
            (i = H);
        } else if (
          (n = e.match(
            /^.+vimeo.com\/(?:\/)?([\d]+)((\/|\?h=)([a-z0-9]+))?(.*)?/
          ))
        ) {
          let o = Ei(e, this.optionFor(t, q)),
            l = encodeURIComponent(n[1]),
            c = n[4] || "";
          (t.videoId = l),
            (t.src = `https://player.vimeo.com/video/${l}?${
              c ? `h=${c}${o ? "&" : ""}` : ""
            }${o}`),
            (i = q);
        }
        if (!i && t.triggerEl) {
          let o = t.triggerEl.dataset.type;
          hs.includes(o) && (i = o);
        }
        i ||
          (typeof e == "string" &&
            (e.charAt(0) === "#"
              ? (i = "inline")
              : (n = e.match(/\.(mp4|mov|ogv|webm)((\?|#).*)?$/i))
              ? ((i = bt),
                (t.videoFormat =
                  t.videoFormat || "video/" + (n[1] === "ogv" ? "ogg" : n[1])))
              : e.match(
                  /(^data:image\/[a-z0-9+\/=]*,)|(\.(jp(e|g|eg)|gif|png|bmp|webp|svg|ico)((\?|#).*)?$)/i
                )
              ? (i = Ci)
              : e.match(/\.(pdf)((\?|#).*)?$/i) && (i = "pdf"))),
          (n = e.match(
            /(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:(?:(?:maps\/(?:place\/(?:.*)\/)?\@(.*),(\d+.?\d+?)z))|(?:\?ll=))(.*)?/i
          ))
            ? ((t.src = `https://maps.google.${n[1]}/?ll=${(n[2]
                ? n[2] +
                  "&z=" +
                  Math.floor(parseFloat(n[3])) +
                  (n[4] ? n[4].replace(/^\//, "&") : "")
                : n[4] + ""
              ).replace(/\?/, "&")}&output=${
                n[4] && n[4].indexOf("layer=c") > 0 ? "svembed" : "embed"
              }`),
              (i = Ve))
            : (n = e.match(
                /(?:maps\.)?google\.([a-z]{2,3}(?:\.[a-z]{2})?)\/(?:maps\/search\/)(.*)/i
              )) &&
              ((t.src = `https://maps.google.${n[1]}/maps?q=${n[2]
                .replace("query=", "q=")
                .replace("api=1", "")}&output=embed`),
              (i = Ve)),
          (i = i || this.instance.option("defaultType")),
          (t.type = i),
          i === Ci && (t.thumbSrc = t.thumbSrc || t.src);
      }
      setContent(t) {
        let e = this.instance.optionFor(t, "src") || "";
        if (t && t.type && e) {
          switch (t.type) {
            case Re:
              this.instance.setContent(t, e);
              break;
            case bt:
              let i = this.option("videoTpl");
              i &&
                this.instance.setContent(
                  t,
                  i
                    .replace(/\{\{src\}\}/gi, e + "")
                    .replace(
                      /\{\{format\}\}/gi,
                      this.optionFor(t, "videoFormat") || ""
                    )
                    .replace(/\{\{poster\}\}/gi, t.poster || t.thumbSrc || "")
                );
              break;
            case "inline":
            case "clone":
              this.setInlineContent(t);
              break;
            case "ajax":
              this.loadAjaxContent(t);
              break;
            case "pdf":
            case Ve:
            case H:
            case q:
              t.preload = !1;
            case "iframe":
              this.setIframeContent(t);
          }
          this.setAspectRatio(t);
        }
      }
      setAspectRatio(t) {
        let e = t.contentEl;
        if (!(t.el && e && t.type && [H, q, bt].includes(t.type))) return;
        let i,
          n = t.width || "auto",
          o = t.height || "auto";
        if (n === "auto" || o === "auto") {
          i = this.optionFor(t, "videoRatio");
          let m = (i + "").match(/(\d+)\s*\/\s?(\d+)/);
          i =
            m && m.length > 2
              ? parseFloat(m[1]) / parseFloat(m[2])
              : parseFloat(i + "");
        } else n && o && (i = n / o);
        if (!i) return;
        (e.style.aspectRatio = ""),
          (e.style.width = ""),
          (e.style.height = ""),
          e.offsetHeight;
        let l = e.getBoundingClientRect(),
          c = l.width || 1,
          u = l.height || 1;
        (e.style.aspectRatio = i + ""),
          i < c / u
            ? ((o = o === "auto" ? u : Math.min(u, o)),
              (e.style.width = "auto"),
              (e.style.height = `${o}px`))
            : ((n = n === "auto" ? c : Math.min(c, n)),
              (e.style.width = `${n}px`),
              (e.style.height = "auto"));
      }
      attach() {
        let t = this,
          e = t.instance;
        e.on("Carousel.beforeInitSlide", t.onBeforeInitSlide),
          e.on("Carousel.createSlide", t.onCreateSlide),
          e.on("Carousel.selectSlide", t.onSelectSlide),
          e.on("Carousel.unselectSlide", t.onUnselectSlide),
          e.on("Carousel.Panzoom.refresh", t.onRefresh),
          e.on("done", t.onDone),
          e.on("clearContent", t.onClearContent),
          window.addEventListener("message", t.onMessage);
      }
      detach() {
        let t = this,
          e = t.instance;
        e.off("Carousel.beforeInitSlide", t.onBeforeInitSlide),
          e.off("Carousel.createSlide", t.onCreateSlide),
          e.off("Carousel.selectSlide", t.onSelectSlide),
          e.off("Carousel.unselectSlide", t.onUnselectSlide),
          e.off("Carousel.Panzoom.refresh", t.onRefresh),
          e.off("done", t.onDone),
          e.off("clearContent", t.onClearContent),
          window.removeEventListener("message", t.onMessage);
      }
    };
  Object.defineProperty(Kt, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: us,
  });
  var Gt = "play",
    Nt = "pause",
    gt = "ready",
    $t = class extends Y {
      constructor() {
        super(...arguments),
          Object.defineProperty(this, "state", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: gt,
          }),
          Object.defineProperty(this, "inHover", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "timer", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "progressBar", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          });
      }
      get isActive() {
        return this.state !== gt;
      }
      onReady(t) {
        this.option("autoStart") &&
          (t.isInfinite || t.page < t.pages.length - 1) &&
          this.start();
      }
      onChange() {
        this.removeProgressBar(), this.pause();
      }
      onSettle() {
        this.resume();
      }
      onVisibilityChange() {
        document.visibilityState === "visible" ? this.resume() : this.pause();
      }
      onMouseEnter() {
        (this.inHover = !0), this.pause();
      }
      onMouseLeave() {
        var t;
        (this.inHover = !1),
          !((t = this.instance.panzoom) === null || t === void 0) &&
            t.isResting &&
            this.resume();
      }
      onTimerEnd() {
        let t = this.instance;
        this.state === "play" &&
          (t.isInfinite || t.page !== t.pages.length - 1
            ? t.slideNext()
            : t.slideTo(0));
      }
      removeProgressBar() {
        this.progressBar &&
          (this.progressBar.remove(), (this.progressBar = null));
      }
      createProgressBar() {
        var t;
        if (!this.option("showProgress")) return null;
        this.removeProgressBar();
        let e = this.instance,
          i =
            ((t = e.pages[e.page]) === null || t === void 0
              ? void 0
              : t.slides) || [],
          n = this.option("progressParentEl");
        if ((n || (n = (i.length === 1 ? i[0].el : null) || e.viewport), !n))
          return null;
        let o = document.createElement("div");
        return (
          v(o, "f-progress"),
          n.prepend(o),
          (this.progressBar = o),
          o.offsetHeight,
          o
        );
      }
      set() {
        let t = this,
          e = t.instance;
        if (e.pages.length < 2 || t.timer) return;
        let i = t.option("timeout");
        (t.state = Gt), v(e.container, "has-autoplay");
        let n = t.createProgressBar();
        n &&
          ((n.style.transitionDuration = `${i}ms`),
          (n.style.transform = "scaleX(1)")),
          (t.timer = setTimeout(() => {
            (t.timer = null), t.inHover || t.onTimerEnd();
          }, i)),
          t.emit("set");
      }
      clear() {
        let t = this;
        t.timer && (clearTimeout(t.timer), (t.timer = null)),
          t.removeProgressBar();
      }
      start() {
        let t = this;
        if ((t.set(), t.state !== gt)) {
          if (t.option("pauseOnHover")) {
            let e = t.instance.container;
            e.addEventListener("mouseenter", t.onMouseEnter, !1),
              e.addEventListener("mouseleave", t.onMouseLeave, !1);
          }
          document.addEventListener(
            "visibilitychange",
            t.onVisibilityChange,
            !1
          ),
            t.emit("start");
        }
      }
      stop() {
        let t = this,
          e = t.state,
          i = t.instance.container;
        t.clear(),
          (t.state = gt),
          i.removeEventListener("mouseenter", t.onMouseEnter, !1),
          i.removeEventListener("mouseleave", t.onMouseLeave, !1),
          document.removeEventListener(
            "visibilitychange",
            t.onVisibilityChange,
            !1
          ),
          U(i, "has-autoplay"),
          e !== gt && t.emit("stop");
      }
      pause() {
        let t = this;
        t.state === Gt && ((t.state = Nt), t.clear(), t.emit(Nt));
      }
      resume() {
        let t = this,
          e = t.instance;
        if (e.isInfinite || e.page !== e.pages.length - 1)
          if (t.state !== Gt) {
            if (t.state === Nt && !t.inHover) {
              let i = new Event("resume", { bubbles: !0, cancelable: !0 });
              t.emit("resume", i), i.defaultPrevented || t.set();
            }
          } else t.set();
        else t.stop();
      }
      toggle() {
        this.state === Gt || this.state === Nt ? this.stop() : this.start();
      }
      attach() {
        let t = this,
          e = t.instance;
        e.on("ready", t.onReady),
          e.on("Panzoom.startAnimation", t.onChange),
          e.on("Panzoom.endAnimation", t.onSettle),
          e.on("Panzoom.touchMove", t.onChange);
      }
      detach() {
        let t = this,
          e = t.instance;
        e.off("ready", t.onReady),
          e.off("Panzoom.startAnimation", t.onChange),
          e.off("Panzoom.endAnimation", t.onSettle),
          e.off("Panzoom.touchMove", t.onChange),
          t.stop();
      }
    };
  Object.defineProperty($t, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: {
      autoStart: !0,
      pauseOnHover: !0,
      progressParentEl: null,
      showProgress: !0,
      timeout: 3e3,
    },
  });
  var qt = class extends Y {
    constructor() {
      super(...arguments),
        Object.defineProperty(this, "ref", {
          enumerable: !0,
          configurable: !0,
          writable: !0,
          value: null,
        });
    }
    onPrepare(t) {
      let e = t.carousel;
      if (!e) return;
      let i = t.container;
      i &&
        ((e.options.Autoplay = V(
          { autoStart: !1 },
          this.option("Autoplay") || {},
          {
            pauseOnHover: !1,
            timeout: this.option("timeout"),
            progressParentEl: () => this.option("progressParentEl") || null,
            on: {
              start: () => {
                t.emit("startSlideshow");
              },
              set: (n) => {
                var o;
                i.classList.add("has-slideshow"),
                  ((o = t.getSlide()) === null || o === void 0
                    ? void 0
                    : o.state) !== I.Ready && n.pause();
              },
              stop: () => {
                i.classList.remove("has-slideshow"),
                  t.isCompact || t.endIdle(),
                  t.emit("endSlideshow");
              },
              resume: (n, o) => {
                var l, c, u;
                !o ||
                  !o.cancelable ||
                  (((l = t.getSlide()) === null || l === void 0
                    ? void 0
                    : l.state) === I.Ready &&
                    !(
                      (u =
                        (c = t.carousel) === null || c === void 0
                          ? void 0
                          : c.panzoom) === null || u === void 0
                    ) &&
                    u.isResting) ||
                  o.preventDefault();
              },
            },
          }
        )),
        e.attachPlugins({ Autoplay: $t }),
        (this.ref = e.plugins.Autoplay));
    }
    onReady(t) {
      let e = t.carousel,
        i = this.ref;
      i &&
        e &&
        this.option("playOnStart") &&
        (e.isInfinite || e.page < e.pages.length - 1) &&
        i.start();
    }
    onDone(t, e) {
      let i = this.ref,
        n = t.carousel;
      if (!i || !n) return;
      let o = e.panzoom;
      o &&
        o.on("startAnimation", () => {
          t.isCurrentSlide(e) && i.stop();
        }),
        t.isCurrentSlide(e) && i.resume();
    }
    onKeydown(t, e) {
      var i;
      let n = this.ref;
      n &&
        e === this.option("key") &&
        ((i = document.activeElement) === null || i === void 0
          ? void 0
          : i.nodeName) !== "BUTTON" &&
        n.toggle();
    }
    attach() {
      let t = this,
        e = t.instance;
      e.on("Carousel.init", t.onPrepare),
        e.on("Carousel.ready", t.onReady),
        e.on("done", t.onDone),
        e.on("keydown", t.onKeydown);
    }
    detach() {
      let t = this,
        e = t.instance;
      e.off("Carousel.init", t.onPrepare),
        e.off("Carousel.ready", t.onReady),
        e.off("done", t.onDone),
        e.off("keydown", t.onKeydown);
    }
  };
  Object.defineProperty(qt, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: {
      key: " ",
      playOnStart: !1,
      progressParentEl: (a) => {
        var t;
        return (
          ((t = a.instance.container) === null || t === void 0
            ? void 0
            : t.querySelector(
                ".fancybox__toolbar [data-fancybox-toggle-slideshow]"
              )) || a.instance.container
        );
      },
      timeout: 3e3,
    },
  });
  var $i = {
      classes: {
        container: "f-thumbs f-carousel__thumbs",
        viewport: "f-thumbs__viewport",
        track: "f-thumbs__track",
        slide: "f-thumbs__slide",
        isResting: "is-resting",
        isSelected: "is-selected",
        isLoading: "is-loading",
        hasThumbs: "has-thumbs",
      },
      minCount: 2,
      parentEl: null,
      thumbTpl:
        '<button class="f-thumbs__slide__button" tabindex="0" type="button" aria-label="{{GOTO}}" data-carousel-index="%i"><img class="f-thumbs__slide__img" data-lazy-src="{{%s}}" alt="" /></button>',
      type: "modern",
    },
    P;
  (function (a) {
    (a[(a.Init = 0)] = "Init"),
      (a[(a.Ready = 1)] = "Ready"),
      (a[(a.Hidden = 2)] = "Hidden");
  })(P || (P = {}));
  var Zi = "isResting",
    Tt = "thumbWidth",
    at = "thumbHeight",
    A = "thumbClipWidth",
    qi = class extends Y {
      constructor() {
        super(...arguments),
          Object.defineProperty(this, "type", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: "modern",
          }),
          Object.defineProperty(this, "container", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "track", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "carousel", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "thumbWidth", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "thumbClipWidth", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "thumbHeight", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "thumbGap", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "thumbExtraGap", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "state", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: P.Init,
          });
      }
      get isModern() {
        return this.type === "modern";
      }
      onInitSlide(a, t) {
        let e = t.el ? t.el.dataset : void 0;
        e &&
          ((t.thumbSrc = e.thumbSrc || t.thumbSrc || ""),
          (t[A] = parseFloat(e[A] || "") || t[A] || 0),
          (t[at] = parseFloat(e.thumbHeight || "") || t[at] || 0)),
          this.addSlide(t);
      }
      onInitSlides() {
        this.build();
      }
      onChange() {
        var a;
        if (!this.isModern) return;
        let t = this.container,
          e = this.instance,
          i = e.panzoom,
          n = this.carousel,
          o = n ? n.panzoom : null,
          l = e.page;
        if (i && n && o) {
          if (i.isDragging) {
            U(t, this.cn(Zi));
            let c =
              ((a = n.pages[l]) === null || a === void 0 ? void 0 : a.pos) || 0;
            c += e.getProgress(l) * (this[A] + this.thumbGap);
            let u = o.getBounds();
            -1 * c > u.x.min &&
              -1 * c < u.x.max &&
              o.panTo({ x: -1 * c, friction: 0.12 });
          } else z(t, this.cn(Zi), i.isResting);
          this.shiftModern();
        }
      }
      onRefresh() {
        this.updateProps();
        for (let a of this.instance.slides || []) this.resizeModernSlide(a);
        this.shiftModern();
      }
      isDisabled() {
        let a = this.option("minCount") || 0;
        if (a) {
          let e = this.instance,
            i = 0;
          for (let n of e.slides || []) n.thumbSrc && i++;
          if (i < a) return !0;
        }
        let t = this.option("type");
        return ["modern", "classic"].indexOf(t) < 0;
      }
      getThumb(a) {
        let t = this.option("thumbTpl") || "";
        return {
          html: this.instance.localize(t, [
            ["%i", a.index],
            ["%d", a.index + 1],
            [
              "%s",
              a.thumbSrc ||
                "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            ],
          ]),
        };
      }
      addSlide(a) {
        let t = this.carousel;
        t && t.addSlide(a.index, this.getThumb(a));
      }
      getSlides() {
        let a = [];
        for (let t of this.instance.slides || []) a.push(this.getThumb(t));
        return a;
      }
      resizeModernSlide(a) {
        this.isModern &&
          (a[Tt] =
            a[A] && a[at] ? Math.round(this[at] * (a[A] / a[at])) : this[Tt]);
      }
      updateProps() {
        let a = this.container;
        if (!a) return;
        let t = (e) =>
          parseFloat(getComputedStyle(a).getPropertyValue("--f-thumb-" + e)) ||
          0;
        (this.thumbGap = t("gap")),
          (this.thumbExtraGap = t("extra-gap")),
          (this[Tt] = t("width") || 40),
          (this[A] = t("clip-width") || 40),
          (this[at] = t("height") || 40);
      }
      build() {
        let a = this;
        if (a.state !== P.Init) return;
        if (a.isDisabled()) return void a.emit("disabled");
        let t = a.instance,
          e = t.container,
          i = a.getSlides(),
          n = a.option("type");
        a.type = n;
        let o = a.option("parentEl"),
          l = a.cn("container"),
          c = a.cn("track"),
          u = o?.querySelector("." + l);
        u ||
          ((u = document.createElement("div")),
          v(u, l),
          o ? o.appendChild(u) : e.after(u)),
          v(u, `is-${n}`),
          v(e, a.cn("hasThumbs")),
          (a.container = u),
          a.updateProps();
        let m = u.querySelector("." + c);
        m ||
          ((m = document.createElement("div")),
          v(m, a.cn("track")),
          u.appendChild(m)),
          (a.track = m);
        let s = V(
            {},
            {
              track: m,
              infinite: !1,
              center: !0,
              fill: n === "classic",
              dragFree: !0,
              slidesPerPage: 1,
              transition: !1,
              preload: 0.25,
              friction: 0.12,
              Panzoom: { maxVelocity: 0 },
              Dots: !1,
              Navigation: !1,
              classes: {
                container: "f-thumbs",
                viewport: "f-thumbs__viewport",
                track: "f-thumbs__track",
                slide: "f-thumbs__slide",
              },
            },
            a.option("Carousel") || {},
            { Sync: { target: t }, slides: i }
          ),
          r = new t.constructor(u, s);
        r.on("createSlide", (d, h) => {
          a.setProps(h.index), a.emit("createSlide", h, h.el);
        }),
          r.on("ready", () => {
            a.shiftModern(), a.emit("ready");
          }),
          r.on("refresh", () => {
            a.shiftModern();
          }),
          r.on("Panzoom.click", (d, h, f) => {
            a.onClick(f);
          }),
          (a.carousel = r),
          (a.state = P.Ready);
      }
      onClick(a) {
        a.preventDefault(), a.stopPropagation();
        let t = this.instance,
          { pages: e, page: i } = t,
          n = (b) => {
            if (b) {
              let p = b.closest("[data-carousel-index]");
              if (p)
                return [parseInt(p.dataset.carouselIndex || "", 10) || 0, p];
            }
            return [-1, void 0];
          },
          o = (b, p) => {
            let g = document.elementFromPoint(b, p);
            return g ? n(g) : [-1, void 0];
          },
          [l, c] = n(a.target);
        if (l > -1) return;
        let u = this[A],
          m = a.clientX,
          s = a.clientY,
          [r, d] = o(m - u, s),
          [h, f] = o(m + u, s);
        d && f
          ? ((l =
              Math.abs(m - d.getBoundingClientRect().right) <
              Math.abs(m - f.getBoundingClientRect().left)
                ? r
                : h),
            l === i && (l = l === r ? h : r))
          : d
          ? (l = r)
          : f && (l = h),
          l > -1 && e[l] && t.slideTo(l);
      }
      getShift(a) {
        var t;
        let e = this,
          { instance: i } = e,
          n = e.carousel;
        if (!i || !n) return 0;
        let o = e[Tt],
          l = e[A],
          c = e.thumbGap,
          u = e.thumbExtraGap;
        if (!(!((t = n.slides[a]) === null || t === void 0) && t.el)) return 0;
        let m = 0.5 * (o - l),
          s = i.pages.length - 1,
          r = i.getProgress(0),
          d = i.getProgress(s),
          h = i.getProgress(a, !1, !0),
          f = 0,
          b = m + u + c,
          p = r < 0 && r > -1,
          g = d > 0 && d < 1;
        return (
          a === 0
            ? ((f = b * Math.abs(r)), g && r === 1 && (f -= b * Math.abs(d)))
            : a === s
            ? ((f = b * Math.abs(d) * -1),
              p && d === -1 && (f += b * Math.abs(r)))
            : p || g
            ? ((f = -1 * b),
              (f += b * Math.abs(r)),
              (f += b * (1 - Math.abs(d))))
            : (f = b * h),
          f
        );
      }
      setProps(a) {
        var t;
        let e = this;
        if (!e.isModern) return;
        let { instance: i } = e,
          n = e.carousel;
        if (i && n) {
          let o = (t = n.slides[a]) === null || t === void 0 ? void 0 : t.el;
          if (o && o.childNodes.length) {
            let l = F(1 - Math.abs(i.getProgress(a))),
              c = F(e.getShift(a));
            o.style.setProperty("--progress", l ? l + "" : ""),
              o.style.setProperty("--shift", c + "");
          }
        }
      }
      shiftModern() {
        let a = this;
        if (!a.isModern) return;
        let { instance: t, track: e } = a,
          i = t.panzoom,
          n = a.carousel;
        if (!(t && e && i && n) || i.state === w.Init || i.state === w.Destroy)
          return;
        for (let l of t.slides) a.setProps(l.index);
        let o = (a[A] + a.thumbGap) * (n.slides.length || 0);
        e.style.setProperty("--width", o + "");
      }
      cleanup() {
        let a = this;
        a.carousel && a.carousel.destroy(),
          (a.carousel = null),
          a.container && a.container.remove(),
          (a.container = null),
          a.track && a.track.remove(),
          (a.track = null),
          (a.state = P.Init),
          U(a.instance.container, a.cn("hasThumbs"));
      }
      attach() {
        let a = this,
          t = a.instance;
        t.on("initSlide", a.onInitSlide),
          t.state === Z.Init
            ? t.on("initSlides", a.onInitSlides)
            : a.onInitSlides(),
          t.on(["change", "Panzoom.afterTransform"], a.onChange),
          t.on("Panzoom.refresh", a.onRefresh);
      }
      detach() {
        let a = this,
          t = a.instance;
        t.off("initSlide", a.onInitSlide),
          t.off("initSlides", a.onInitSlides),
          t.off(["change", "Panzoom.afterTransform"], a.onChange),
          t.off("Panzoom.refresh", a.onRefresh),
          a.cleanup();
      }
    };
  Object.defineProperty(qi, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: $i,
  });
  var ms = Object.assign(Object.assign({}, $i), {
      key: "t",
      showOnStart: !0,
      parentEl: null,
    }),
    ki = "is-masked",
    Oi = "aria-hidden",
    te = class extends Y {
      constructor() {
        super(...arguments),
          Object.defineProperty(this, "ref", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "hidden", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          });
      }
      get isEnabled() {
        let t = this.ref;
        return t && !t.isDisabled();
      }
      get isHidden() {
        return this.hidden;
      }
      onClick(t, e) {
        e.stopPropagation();
      }
      onCreateSlide(t, e) {
        var i, n, o;
        let l =
            ((o =
              (n =
                (i = this.instance) === null || i === void 0
                  ? void 0
                  : i.carousel) === null || n === void 0
                ? void 0
                : n.slides[e.index]) === null || o === void 0
              ? void 0
              : o.type) || "",
          c = e.el;
        if (c && l) {
          let u = `for-${l}`;
          ["video", "youtube", "vimeo", "html5video"].includes(l) &&
            (u += " for-video"),
            v(c, u);
        }
      }
      onInit() {
        var t;
        let e = this,
          i = e.instance,
          n = i.carousel;
        if (e.ref || !n) return;
        let o = e.option("parentEl") || i.footer || i.container;
        if (!o) return;
        let l = V({}, e.options, {
          parentEl: o,
          classes: { container: "f-thumbs fancybox__thumbs" },
          Carousel: { Sync: { friction: i.option("Carousel.friction") || 0 } },
          on: {
            ready: (c) => {
              let u = c.container;
              u &&
                this.hidden &&
                (e.refresh(),
                (u.style.transition = "none"),
                e.hide(),
                u.offsetHeight,
                queueMicrotask(() => {
                  (u.style.transition = ""), e.show();
                }));
            },
          },
        });
        (l.Carousel = l.Carousel || {}),
          (l.Carousel.on = V(
            ((t = e.options.Carousel) === null || t === void 0
              ? void 0
              : t.on) || {},
            { click: this.onClick, createSlide: this.onCreateSlide }
          )),
          (n.options.Thumbs = l),
          n.attachPlugins({ Thumbs: qi }),
          (e.ref = n.plugins.Thumbs),
          e.option("showOnStart") ||
            ((e.ref.state = P.Hidden), (e.hidden = !0));
      }
      onResize() {
        var t;
        let e = (t = this.ref) === null || t === void 0 ? void 0 : t.container;
        e && (e.style.maxHeight = "");
      }
      onKeydown(t, e) {
        let i = this.option("key");
        i && i === e && this.toggle();
      }
      toggle() {
        let t = this.ref;
        if (t && !t.isDisabled())
          return t.state === P.Hidden
            ? ((t.state = P.Init), void t.build())
            : void (this.hidden ? this.show() : this.hide());
      }
      show() {
        let t = this.ref;
        if (!t || t.isDisabled()) return;
        let e = t.container;
        e &&
          (this.refresh(),
          e.offsetHeight,
          e.removeAttribute(Oi),
          e.classList.remove(ki),
          (this.hidden = !1));
      }
      hide() {
        let t = this.ref,
          e = t && t.container;
        e &&
          (this.refresh(),
          e.offsetHeight,
          e.classList.add(ki),
          e.setAttribute(Oi, "true")),
          (this.hidden = !0);
      }
      refresh() {
        let t = this.ref;
        if (!t || !t.state) return;
        let e = t.container,
          i = e?.firstChild || null;
        e &&
          i &&
          i.childNodes.length &&
          (e.style.maxHeight = `${i.getBoundingClientRect().height}px`);
      }
      attach() {
        let t = this,
          e = t.instance;
        e.state === O.Init ? e.on("Carousel.init", t.onInit) : t.onInit(),
          e.on("resize", t.onResize),
          e.on("keydown", t.onKeydown);
      }
      detach() {
        var t;
        let e = this,
          i = e.instance;
        i.off("Carousel.init", e.onInit),
          i.off("resize", e.onResize),
          i.off("keydown", e.onKeydown),
          (t = i.carousel) === null ||
            t === void 0 ||
            t.detachPlugins(["Thumbs"]),
          (e.ref = null);
      }
    };
  Object.defineProperty(te, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: ms,
  });
  var Ye = {
      panLeft: {
        icon: '<svg><path d="M5 12h14M5 12l6 6M5 12l6-6"/></svg>',
        change: { panX: -100 },
      },
      panRight: {
        icon: '<svg><path d="M5 12h14M13 18l6-6M13 6l6 6"/></svg>',
        change: { panX: 100 },
      },
      panUp: {
        icon: '<svg><path d="M12 5v14M18 11l-6-6M6 11l6-6"/></svg>',
        change: { panY: -100 },
      },
      panDown: {
        icon: '<svg><path d="M12 5v14M18 13l-6 6M6 13l6 6"/></svg>',
        change: { panY: 100 },
      },
      zoomIn: {
        icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M11 8v6M8 11h6"/></svg>',
        action: "zoomIn",
      },
      zoomOut: {
        icon: '<svg><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
        action: "zoomOut",
      },
      toggle1to1: {
        icon: '<svg><path d="M3.51 3.07c5.74.02 11.48-.02 17.22.02 1.37.1 2.34 1.64 2.18 3.13 0 4.08.02 8.16 0 12.23-.1 1.54-1.47 2.64-2.79 2.46-5.61-.01-11.24.02-16.86-.01-1.36-.12-2.33-1.65-2.17-3.14 0-4.07-.02-8.16 0-12.23.1-1.36 1.22-2.48 2.42-2.46Z"/><path d="M5.65 8.54h1.49v6.92m8.94-6.92h1.49v6.92M11.5 9.4v.02m0 5.18v0"/></svg>',
        action: "toggleZoom",
      },
      toggleZoom: {
        icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
        action: "toggleZoom",
      },
      iterateZoom: {
        icon: '<svg><g><line x1="11" y1="8" x2="11" y2="14"></line></g><circle cx="11" cy="11" r="7.5"/><path d="m21 21-4.35-4.35M8 11h6"/></svg>',
        action: "iterateZoom",
      },
      rotateCCW: {
        icon: '<svg><path d="M15 4.55a8 8 0 0 0-6 14.9M9 15v5H4M18.37 7.16v.01M13 19.94v.01M16.84 18.37v.01M19.37 15.1v.01M19.94 11v.01"/></svg>',
        action: "rotateCCW",
      },
      rotateCW: {
        icon: '<svg><path d="M9 4.55a8 8 0 0 1 6 14.9M15 15v5h5M5.63 7.16v.01M4.06 11v.01M4.63 15.1v.01M7.16 18.37v.01M11 19.94v.01"/></svg>',
        action: "rotateCW",
      },
      flipX: {
        icon: '<svg style="stroke-width: 1.3"><path d="M12 3v18M16 7v10h5L16 7M8 7v10H3L8 7"/></svg>',
        action: "flipX",
      },
      flipY: {
        icon: '<svg style="stroke-width: 1.3"><path d="M3 12h18M7 16h10L7 21v-5M7 8h10L7 3v5"/></svg>',
        action: "flipY",
      },
      fitX: {
        icon: '<svg><path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6M10 18H3M21 18h-7M6 15l-3 3 3 3M18 15l3 3-3 3"/></svg>',
        action: "fitX",
      },
      fitY: {
        icon: '<svg><path d="M12 20H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6M18 14v7M18 3v7M15 18l3 3 3-3M15 6l3-3 3 3"/></svg>',
        action: "fitY",
      },
      reset: {
        icon: '<svg><path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/></svg>',
        action: "reset",
      },
      toggleFS: {
        icon: '<svg><g><path d="M14.5 9.5 21 3m0 0h-6m6 0v6M3 21l6.5-6.5M3 21v-6m0 6h6"/></g><g><path d="m14 10 7-7m-7 7h6m-6 0V4M3 21l7-7m0 0v6m0-6H4"/></g></svg>',
        action: "toggleFS",
      },
    },
    nt;
  (function (a) {
    (a[(a.Init = 0)] = "Init"),
      (a[(a.Ready = 1)] = "Ready"),
      (a[(a.Disabled = 2)] = "Disabled");
  })(nt || (nt = {}));
  var fs = {
      absolute: "auto",
      display: {
        left: ["infobar"],
        middle: [],
        right: ["iterateZoom", "slideshow", "fullscreen", "thumbs", "close"],
      },
      enabled: "auto",
      items: {
        infobar: {
          tpl: '<div class="fancybox__infobar" tabindex="-1"><span data-fancybox-current-index></span>/<span data-fancybox-count></span></div>',
        },
        download: {
          tpl: '<a class="f-button" title="{{DOWNLOAD}}" data-fancybox-download href="javasript:;"><svg><path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2M7 11l5 5 5-5M12 4v12"/></svg></a>',
        },
        prev: {
          tpl: '<button class="f-button" title="{{PREV}}" data-fancybox-prev><svg><path d="m15 6-6 6 6 6"/></svg></button>',
        },
        next: {
          tpl: '<button class="f-button" title="{{NEXT}}" data-fancybox-next><svg><path d="m9 6 6 6-6 6"/></svg></button>',
        },
        slideshow: {
          tpl: '<button class="f-button" title="{{TOGGLE_SLIDESHOW}}" data-fancybox-toggle-slideshow><svg><g><path d="M8 4v16l13 -8z"></path></g><g><path d="M8 4v15M17 4v15"/></g></svg></button>',
        },
        fullscreen: {
          tpl: '<button class="f-button" title="{{TOGGLE_FULLSCREEN}}" data-fancybox-toggle-fullscreen><svg><g><path d="M4 8V6a2 2 0 0 1 2-2h2M4 16v2a2 2 0 0 0 2 2h2M16 4h2a2 2 0 0 1 2 2v2M16 20h2a2 2 0 0 0 2-2v-2"/></g><g><path d="M15 19v-2a2 2 0 0 1 2-2h2M15 5v2a2 2 0 0 0 2 2h2M5 15h2a2 2 0 0 1 2 2v2M5 9h2a2 2 0 0 0 2-2V5"/></g></svg></button>',
        },
        thumbs: {
          tpl: '<button class="f-button" title="{{TOGGLE_THUMBS}}" data-fancybox-toggle-thumbs><svg><circle cx="5.5" cy="5.5" r="1"/><circle cx="12" cy="5.5" r="1"/><circle cx="18.5" cy="5.5" r="1"/><circle cx="5.5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="18.5" cy="12" r="1"/><circle cx="5.5" cy="18.5" r="1"/><circle cx="12" cy="18.5" r="1"/><circle cx="18.5" cy="18.5" r="1"/></svg></button>',
        },
        close: {
          tpl: '<button class="f-button" title="{{CLOSE}}" data-fancybox-close><svg><path d="m19.5 4.5-15 15M4.5 4.5l15 15"/></svg></button>',
        },
      },
      parentEl: null,
    },
    ps = {
      tabindex: "-1",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg",
    },
    Mi = "has-toolbar",
    _e = "fancybox__toolbar",
    ee = class extends Y {
      constructor() {
        super(...arguments),
          Object.defineProperty(this, "state", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: nt.Init,
          }),
          Object.defineProperty(this, "container", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          });
      }
      onReady(t) {
        var e;
        if (!t.carousel) return;
        let i = this.option("display"),
          n = this.option("absolute"),
          o = this.option("enabled");
        if (o === "auto") {
          let m = this.instance.carousel,
            s = 0;
          if (m)
            for (let r of m.slides) (r.panzoom || r.type === "image") && s++;
          s || (o = !1);
        }
        o || (i = void 0);
        let l = 0,
          c = { left: [], middle: [], right: [] };
        if (i)
          for (let m of ["left", "middle", "right"])
            for (let s of i[m]) {
              let r = this.createEl(s);
              r && ((e = c[m]) === null || e === void 0 || e.push(r), l++);
            }
        let u = null;
        if ((l && (u = this.createContainer()), u)) {
          for (let [m, s] of Object.entries(c)) {
            let r = document.createElement("div");
            v(r, _e + "__column is-" + m);
            for (let d of s) r.appendChild(d);
            n !== "auto" || m !== "middle" || s.length || (n = !0),
              u.appendChild(r);
          }
          n === !0 && v(u, "is-absolute"),
            (this.state = nt.Ready),
            this.onRefresh();
        } else this.state = nt.Disabled;
      }
      onClick(t) {
        var e, i;
        let n = this.instance,
          o = n.getSlide(),
          l = o?.panzoom,
          c = t.target,
          u = c && R(c) ? c.dataset : null;
        if (!u) return;
        if (u.fancyboxToggleThumbs !== void 0)
          return (
            t.preventDefault(),
            t.stopPropagation(),
            void ((e = n.plugins.Thumbs) === null || e === void 0 || e.toggle())
          );
        if (u.fancyboxToggleFullscreen !== void 0)
          return (
            t.preventDefault(),
            t.stopPropagation(),
            void this.instance.toggleFullscreen()
          );
        if (u.fancyboxToggleSlideshow !== void 0) {
          t.preventDefault(), t.stopPropagation();
          let r =
              (i = n.carousel) === null || i === void 0
                ? void 0
                : i.plugins.Autoplay,
            d = r.isActive;
          return (
            l && l.panMode === "mousemove" && !d && l.reset(),
            void (d ? r.stop() : r.start())
          );
        }
        let m = u.panzoomAction,
          s = u.panzoomChange;
        if (((s || m) && (t.preventDefault(), t.stopPropagation()), s)) {
          let r = {};
          try {
            r = JSON.parse(s);
          } catch {}
          l && l.applyChange(r);
        } else m && l && l[m] && l[m]();
      }
      onChange() {
        this.onRefresh();
      }
      onRefresh() {
        if (this.instance.isClosing()) return;
        let t = this.container;
        if (!t) return;
        let e = this.instance.getSlide();
        if (!e || e.state !== I.Ready) return;
        let i = e && !e.error && e.panzoom;
        for (let l of t.querySelectorAll("[data-panzoom-action]"))
          i
            ? (l.removeAttribute("disabled"), l.removeAttribute("tabindex"))
            : (l.setAttribute("disabled", ""),
              l.setAttribute("tabindex", "-1"));
        let n = i && i.canZoomIn(),
          o = i && i.canZoomOut();
        for (let l of t.querySelectorAll('[data-panzoom-action="zoomIn"]'))
          n
            ? (l.removeAttribute("disabled"), l.removeAttribute("tabindex"))
            : (l.setAttribute("disabled", ""),
              l.setAttribute("tabindex", "-1"));
        for (let l of t.querySelectorAll('[data-panzoom-action="zoomOut"]'))
          o
            ? (l.removeAttribute("disabled"), l.removeAttribute("tabindex"))
            : (l.setAttribute("disabled", ""),
              l.setAttribute("tabindex", "-1"));
        for (let l of t.querySelectorAll(
          '[data-panzoom-action="toggleZoom"],[data-panzoom-action="iterateZoom"]'
        )) {
          o || n
            ? (l.removeAttribute("disabled"), l.removeAttribute("tabindex"))
            : (l.setAttribute("disabled", ""),
              l.setAttribute("tabindex", "-1"));
          let c = l.querySelector("g");
          c && (c.style.display = n ? "" : "none");
        }
      }
      onDone(t, e) {
        var i;
        (i = e.panzoom) === null ||
          i === void 0 ||
          i.on("afterTransform", () => {
            this.instance.isCurrentSlide(e) && this.onRefresh();
          }),
          this.instance.isCurrentSlide(e) && this.onRefresh();
      }
      createContainer() {
        let t = this.instance.container;
        if (!t) return null;
        let e = this.option("parentEl") || t,
          i = e.querySelector("." + _e);
        return (
          i || ((i = document.createElement("div")), v(i, _e), e.prepend(i)),
          i.addEventListener("click", this.onClick, {
            passive: !1,
            capture: !0,
          }),
          t && v(t, Mi),
          (this.container = i),
          i
        );
      }
      createEl(t) {
        let e = this.instance,
          i = e.carousel;
        if (!i || t === "toggleFS" || (t === "fullscreen" && !ji()))
          return null;
        let n = null,
          o = i.slides.length || 0,
          l = 0,
          c = 0;
        for (let m of i.slides)
          (m.panzoom || m.type === "image") && l++,
            (m.type === "image" || m.downloadSrc) && c++;
        if (o < 2 && ["infobar", "prev", "next"].includes(t)) return n;
        if ((Ye[t] !== void 0 && !l) || (t === "download" && !c)) return null;
        if (t === "thumbs") {
          let m = e.plugins.Thumbs;
          if (!m || !m.isEnabled) return null;
        }
        if (t === "slideshow" && (!i.plugins.Autoplay || o < 2)) return null;
        if (Ye[t] !== void 0) {
          let m = Ye[t];
          (n = document.createElement("button")),
            n.setAttribute(
              "title",
              this.instance.localize(`{{${t.toUpperCase()}}}`)
            ),
            v(n, "f-button"),
            m.action && (n.dataset.panzoomAction = m.action),
            m.change && (n.dataset.panzoomChange = JSON.stringify(m.change)),
            n.appendChild(S(this.instance.localize(m.icon)));
        } else {
          let m = (this.option("items") || [])[t];
          m &&
            ((n = S(this.instance.localize(m.tpl))),
            typeof m.click == "function" &&
              n.addEventListener("click", (s) => {
                s.preventDefault(),
                  s.stopPropagation(),
                  typeof m.click == "function" && m.click.call(this, this, s);
              }));
        }
        let u = n?.querySelector("svg");
        if (u)
          for (let [m, s] of Object.entries(ps))
            u.getAttribute(m) || u.setAttribute(m, String(s));
        return n;
      }
      removeContainer() {
        let t = this.container;
        t && t.remove(), (this.container = null), (this.state = nt.Disabled);
        let e = this.instance.container;
        e && U(e, Mi);
      }
      attach() {
        let t = this,
          e = t.instance;
        e.on("Carousel.initSlides", t.onReady),
          e.on("done", t.onDone),
          e.on(["reveal", "Carousel.change"], t.onChange),
          t.onReady(t.instance);
      }
      detach() {
        let t = this,
          e = t.instance;
        e.off("Carousel.initSlides", t.onReady),
          e.off("done", t.onDone),
          e.off(["reveal", "Carousel.change"], t.onChange),
          t.removeContainer();
      }
    };
  Object.defineProperty(ee, "defaults", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: fs,
  });
  var bs = {
      Hash: class extends Y {
        onReady() {
          Qt = !1;
        }
        onChange(a) {
          it && clearTimeout(it);
          let { hash: t } = Ji(),
            { hash: e } = Ht(),
            i = a.isOpeningSlide(a.getSlide());
          i && (Li = e === t ? "" : e),
            t &&
              t !== e &&
              (it = setTimeout(() => {
                try {
                  if (a.state === O.Ready) {
                    let n = "replaceState";
                    i && !Dt && ((n = "pushState"), (Dt = !0)),
                      window.history[n](
                        {},
                        document.title,
                        window.location.pathname + window.location.search + t
                      );
                  }
                } catch {}
              }, 300));
        }
        onClose(a) {
          if ((it && clearTimeout(it), !Qt && Dt))
            return (Dt = !1), (Qt = !1), void window.history.back();
          if (!Qt)
            try {
              window.history.replaceState(
                {},
                document.title,
                window.location.pathname + window.location.search + (Li || "")
              );
            } catch {}
        }
        attach() {
          let a = this.instance;
          a.on("ready", this.onReady),
            a.on(["Carousel.ready", "Carousel.change"], this.onChange),
            a.on("close", this.onClose);
        }
        detach() {
          let a = this.instance;
          a.off("ready", this.onReady),
            a.off(["Carousel.ready", "Carousel.change"], this.onChange),
            a.off("close", this.onClose);
        }
        static parseURL() {
          return Ht();
        }
        static startFromUrl() {
          Hi();
        }
        static destroy() {
          window.removeEventListener("hashchange", Ki, !1);
        }
      },
      Html: Kt,
      Images: Pt,
      Slideshow: qt,
      Thumbs: te,
      Toolbar: ee,
    },
    Ii = "with-fancybox",
    De = "hide-scrollbar",
    Ri = "--fancybox-scrollbar-compensate",
    Vi = "--fancybox-body-margin",
    Xe = "aria-hidden",
    Ge = "is-using-tab",
    Ne = "is-animated",
    Yi = "is-compact",
    _i = "is-loading",
    Te = "is-opening",
    At = "has-caption",
    rt = "disabled",
    tt = "tabindex",
    Di = "download",
    Ae = "href",
    lt = "src",
    K = (a) => typeof a == "string",
    Xi = function () {
      var a = window.getSelection();
      return !!a && a.type === "Range";
    },
    G,
    N = null,
    et = null,
    Gi = 0,
    Ni = 0,
    Ti = 0,
    Ai = 0,
    ct = new Map(),
    gs = 0,
    E = class a extends yt {
      get isIdle() {
        return this.idle;
      }
      get isCompact() {
        return this.option("compact");
      }
      constructor(t = [], e = {}, i = {}) {
        super(e),
          Object.defineProperty(this, "userSlides", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: [],
          }),
          Object.defineProperty(this, "userPlugins", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: {},
          }),
          Object.defineProperty(this, "idle", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "idleTimer", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "clickTimer", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "pwt", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "ignoreFocusChange", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "startedFs", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: !1,
          }),
          Object.defineProperty(this, "state", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: O.Init,
          }),
          Object.defineProperty(this, "id", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: 0,
          }),
          Object.defineProperty(this, "container", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "caption", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "footer", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "carousel", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "lastFocus", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: null,
          }),
          Object.defineProperty(this, "prevMouseMoveEvent", {
            enumerable: !0,
            configurable: !0,
            writable: !0,
            value: void 0,
          }),
          G || (G = ji()),
          (this.id = e.id || ++gs),
          ct.set(this.id, this),
          (this.userSlides = t),
          (this.userPlugins = i),
          queueMicrotask(() => {
            this.init();
          });
      }
      init() {
        if (this.state === O.Destroy) return;
        (this.state = O.Init),
          this.attachPlugins(
            Object.assign(Object.assign({}, a.Plugins), this.userPlugins)
          ),
          this.emit("init"),
          this.emit("attachPlugins"),
          this.option("hideScrollbar") === !0 &&
            (() => {
              if (!Ft) return;
              let e = document,
                i = e.body,
                n = e.documentElement;
              if (i.classList.contains(De)) return;
              let o = window.innerWidth - n.getBoundingClientRect().width,
                l = parseFloat(window.getComputedStyle(i).marginRight);
              o < 0 && (o = 0),
                n.style.setProperty(Ri, `${o}px`),
                l && i.style.setProperty(Vi, `${l}px`),
                i.classList.add(De);
            })(),
          this.initLayout(),
          this.scale();
        let t = () => {
          this.initCarousel(this.userSlides),
            (this.state = O.Ready),
            this.attachEvents(),
            this.emit("ready"),
            setTimeout(() => {
              this.container && this.container.setAttribute(Xe, "false");
            }, 16);
        };
        this.option("Fullscreen.autoStart") && G && !G.isFullscreen()
          ? G.request()
              .then(() => {
                (this.startedFs = !0), t();
              })
              .catch(() => t())
          : t();
      }
      initLayout() {
        var t, e;
        let i = this.option("parentEl") || document.body,
          n = S(this.localize(this.option("tpl.main") || ""));
        if (n) {
          if (
            (n.setAttribute("id", `fancybox-${this.id}`),
            n.setAttribute("aria-label", this.localize("{{MODAL}}")),
            n.classList.toggle(Yi, this.isCompact),
            v(n, this.option("mainClass") || ""),
            v(n, Te),
            (this.container = n),
            (this.footer = n.querySelector(".fancybox__footer")),
            i.appendChild(n),
            v(document.documentElement, Ii),
            (N && et) ||
              ((N = document.createElement("span")),
              v(N, "fancybox-focus-guard"),
              N.setAttribute(tt, "0"),
              N.setAttribute(Xe, "true"),
              N.setAttribute("aria-label", "Focus guard"),
              (et = N.cloneNode()),
              (t = n.parentElement) === null ||
                t === void 0 ||
                t.insertBefore(N, n),
              (e = n.parentElement) === null || e === void 0 || e.append(et)),
            n.addEventListener("mousedown", (o) => {
              (Gi = o.pageX), (Ni = o.pageY), U(n, Ge);
            }),
            this.option("closeExisting"))
          )
            for (let o of ct.values()) o.id !== this.id && o.close();
          else
            this.option("animated") &&
              (v(n, Ne),
              setTimeout(() => {
                this.isClosing() || U(n, Ne);
              }, 350));
          this.emit("initLayout");
        }
      }
      initCarousel(t) {
        let e = this.container;
        if (!e) return;
        let i = e.querySelector(".fancybox__carousel");
        if (!i) return;
        let n = (this.carousel = new dt(
          i,
          V(
            {},
            {
              slides: t,
              transition: "fade",
              Panzoom: {
                lockAxis: this.option("dragToClose") ? "xy" : "x",
                infinite: !!this.option("dragToClose") && "y",
              },
              Dots: !1,
              Navigation: {
                classes: {
                  container: "fancybox__nav",
                  button: "f-button",
                  isNext: "is-next",
                  isPrev: "is-prev",
                },
              },
              initialPage: this.option("startIndex"),
              l10n: this.option("l10n"),
            },
            this.option("Carousel") || {}
          )
        ));
        n.on("*", (o, l, ...c) => {
          this.emit(`Carousel.${l}`, o, ...c);
        }),
          n.on(["ready", "change"], () => {
            this.manageCaption();
          }),
          this.on("Carousel.removeSlide", (o, l, c) => {
            this.clearContent(c), (c.state = void 0);
          }),
          n.on("Panzoom.touchStart", () => {
            var o, l;
            this.isCompact || this.endIdle(),
              !((o = document.activeElement) === null || o === void 0) &&
                o.closest(".f-thumbs") &&
                ((l = this.container) === null || l === void 0 || l.focus());
          }),
          n.on("settle", () => {
            this.idleTimer ||
              this.isCompact ||
              !this.option("idle") ||
              this.setIdle(),
              this.option("autoFocus") && !this.isClosing && this.checkFocus();
          }),
          this.option("dragToClose") &&
            (n.on("Panzoom.afterTransform", (o, l) => {
              let c = this.getSlide();
              if (c && Se(c.el)) return;
              let u = this.container;
              if (u) {
                let m = Math.abs(l.current.f),
                  s =
                    m < 1
                      ? ""
                      : Math.max(
                          0.5,
                          Math.min(1, 1 - (m / l.contentRect.fitHeight) * 1.5)
                        );
                u.style.setProperty("--fancybox-ts", s ? "0s" : ""),
                  u.style.setProperty("--fancybox-opacity", s + "");
              }
            }),
            n.on("Panzoom.touchEnd", (o, l, c) => {
              var u;
              let m = this.getSlide();
              if (
                (m && Se(m.el)) ||
                (l.isMobile &&
                  document.activeElement &&
                  ["TEXTAREA", "INPUT"].indexOf(
                    (u = document.activeElement) === null || u === void 0
                      ? void 0
                      : u.nodeName
                  ) !== -1)
              )
                return;
              let s = Math.abs(l.dragOffset.y);
              l.lockedAxis === "y" &&
                (s >= 200 || (s >= 50 && l.dragOffset.time < 300)) &&
                (c && c.cancelable && c.preventDefault(),
                this.close(
                  c,
                  "f-throwOut" + (l.current.f < 0 ? "Up" : "Down")
                ));
            })),
          n.on("change", (o) => {
            var l;
            let c =
              (l = this.getSlide()) === null || l === void 0
                ? void 0
                : l.triggerEl;
            if (c) {
              let u = new CustomEvent("slideTo", {
                bubbles: !0,
                cancelable: !0,
                detail: o.page,
              });
              c.dispatchEvent(u);
            }
          }),
          n.on(["refresh", "change"], (o) => {
            let l = this.container;
            if (!l) return;
            for (let m of l.querySelectorAll("[data-fancybox-current-index]"))
              m.innerHTML = o.page + 1;
            for (let m of l.querySelectorAll("[data-fancybox-count]"))
              m.innerHTML = o.pages.length;
            if (!o.isInfinite) {
              for (let m of l.querySelectorAll("[data-fancybox-next]"))
                o.page < o.pages.length - 1
                  ? (m.removeAttribute(rt), m.removeAttribute(tt))
                  : (m.setAttribute(rt, ""), m.setAttribute(tt, "-1"));
              for (let m of l.querySelectorAll("[data-fancybox-prev]"))
                o.page > 0
                  ? (m.removeAttribute(rt), m.removeAttribute(tt))
                  : (m.setAttribute(rt, ""), m.setAttribute(tt, "-1"));
            }
            let c = this.getSlide();
            if (!c) return;
            let u = c.downloadSrc || "";
            u || c.type !== "image" || c.error || !K(c[lt]) || (u = c[lt]);
            for (let m of l.querySelectorAll("[data-fancybox-download]")) {
              let s = c.downloadFilename;
              u
                ? (m.removeAttribute(rt),
                  m.removeAttribute(tt),
                  m.setAttribute(Ae, u),
                  m.setAttribute(Di, s || u),
                  m.setAttribute("target", "_blank"))
                : (m.setAttribute(rt, ""),
                  m.setAttribute(tt, "-1"),
                  m.removeAttribute(Ae),
                  m.removeAttribute(Di));
            }
          }),
          this.emit("initCarousel");
      }
      attachEvents() {
        let t = this,
          e = t.container;
        if (!e) return;
        e.addEventListener("click", t.onClick, { passive: !1, capture: !1 }),
          e.addEventListener("wheel", t.onWheel, { passive: !1, capture: !1 }),
          document.addEventListener("keydown", t.onKeydown, {
            passive: !1,
            capture: !0,
          }),
          document.addEventListener(
            "visibilitychange",
            t.onVisibilityChange,
            !1
          ),
          document.addEventListener("mousemove", t.onMousemove),
          t.option("trapFocus") &&
            document.addEventListener("focus", t.onFocus, !0),
          window.addEventListener("resize", t.onResize);
        let i = window.visualViewport;
        i &&
          (i.addEventListener("scroll", t.onResize),
          i.addEventListener("resize", t.onResize));
      }
      detachEvents() {
        let t = this,
          e = t.container;
        if (!e) return;
        document.removeEventListener("keydown", t.onKeydown, {
          passive: !1,
          capture: !0,
        }),
          e.removeEventListener("wheel", t.onWheel, {
            passive: !1,
            capture: !1,
          }),
          e.removeEventListener("click", t.onClick, {
            passive: !1,
            capture: !1,
          }),
          document.removeEventListener("mousemove", t.onMousemove),
          window.removeEventListener("resize", t.onResize);
        let i = window.visualViewport;
        i &&
          (i.removeEventListener("resize", t.onResize),
          i.removeEventListener("scroll", t.onResize)),
          document.removeEventListener(
            "visibilitychange",
            t.onVisibilityChange,
            !1
          ),
          document.removeEventListener("focus", t.onFocus, !0);
      }
      scale() {
        let t = this.container;
        if (!t) return;
        let e = window.visualViewport,
          i = Math.max(1, e?.scale || 1),
          n = "",
          o = "",
          l = "";
        if (e && i > 1) {
          let c = `${e.offsetLeft}px`,
            u = `${e.offsetTop}px`;
          (n = e.width * i + "px"),
            (o = e.height * i + "px"),
            (l = `translate3d(${c}, ${u}, 0) scale(${1 / i})`);
        }
        (t.style.transform = l), (t.style.width = n), (t.style.height = o);
      }
      onClick(t) {
        var e;
        let { container: i, isCompact: n } = this;
        if (!i || this.isClosing()) return;
        !n && this.option("idle") && this.resetIdle();
        let o = t.composedPath()[0];
        if (
          o.closest(".fancybox-spinner") ||
          o.closest("[data-fancybox-close]")
        )
          return t.preventDefault(), void this.close(t);
        if (o.closest("[data-fancybox-prev]"))
          return t.preventDefault(), void this.prev();
        if (o.closest("[data-fancybox-next]"))
          return t.preventDefault(), void this.next();
        if (
          (t.type === "click" && t.detail === 0) ||
          Math.abs(t.pageX - Gi) > 30 ||
          Math.abs(t.pageY - Ni) > 30
        )
          return;
        let l = document.activeElement;
        if (Xi() && l && i.contains(l)) return;
        if (
          n &&
          ((e = this.getSlide()) === null || e === void 0 ? void 0 : e.type) ===
            "image"
        )
          return void (this.clickTimer
            ? (clearTimeout(this.clickTimer), (this.clickTimer = null))
            : (this.clickTimer = setTimeout(() => {
                this.toggleIdle(), (this.clickTimer = null);
              }, 350)));
        if ((this.emit("click", t), t.defaultPrevented)) return;
        let c = !1;
        if (o.closest(".fancybox__content")) {
          if (l) {
            if (l.closest("[contenteditable]")) return;
            o.matches(Ie) || l.blur();
          }
          if (Xi()) return;
          c = this.option("contentClick");
        } else
          o.closest(".fancybox__carousel") &&
            !o.matches(Ie) &&
            (c = this.option("backdropClick"));
        c === "close"
          ? (t.preventDefault(), this.close(t))
          : c === "next"
          ? (t.preventDefault(), this.next())
          : c === "prev" && (t.preventDefault(), this.prev());
      }
      onWheel(t) {
        let e = t.target,
          i = this.option("wheel", t);
        e.closest(".fancybox__thumbs") && (i = "slide");
        let n = i === "slide",
          o = [-t.deltaX || 0, -t.deltaY || 0, -t.detail || 0].reduce(function (
            u,
            m
          ) {
            return Math.abs(m) > Math.abs(u) ? m : u;
          }),
          l = Math.max(-1, Math.min(1, o)),
          c = Date.now();
        this.pwt && c - this.pwt < 300
          ? n && t.preventDefault()
          : ((this.pwt = c),
            this.emit("wheel", t, l),
            t.defaultPrevented ||
              (i === "close"
                ? (t.preventDefault(), this.close(t))
                : i === "slide" &&
                  (St(e) ||
                    (t.preventDefault(), this[l > 0 ? "prev" : "next"]()))));
      }
      onScroll() {
        window.scrollTo(Ti, Ai);
      }
      onKeydown(t) {
        if (!this.isTopmost()) return;
        this.isCompact ||
          !this.option("idle") ||
          this.isClosing() ||
          this.resetIdle();
        let e = t.key,
          i = this.option("keyboard");
        if (!i) return;
        let n = t.composedPath()[0],
          o = document.activeElement && document.activeElement.classList,
          l =
            (o && o.contains("f-button")) ||
            n.dataset.carouselPage ||
            n.dataset.carouselIndex;
        if (
          (e !== "Escape" &&
            !l &&
            R(n) &&
            (n.isContentEditable ||
              ["TEXTAREA", "OPTION", "INPUT", "SELECT", "VIDEO"].indexOf(
                n.nodeName
              ) !== -1)) ||
          (t.key === "Tab" ? v(this.container, Ge) : U(this.container, Ge),
          t.ctrlKey || t.altKey || t.shiftKey)
        )
          return;
        this.emit("keydown", e, t);
        let c = i[e];
        c && typeof this[c] == "function" && (t.preventDefault(), this[c]());
      }
      onResize() {
        let t = this.container;
        if (!t) return;
        let e = this.isCompact;
        t.classList.toggle(Yi, e),
          this.manageCaption(this.getSlide()),
          this.isCompact ? this.clearIdle() : this.endIdle(),
          this.scale(),
          this.emit("resize");
      }
      onFocus(t) {
        this.isTopmost() && this.checkFocus(t);
      }
      onMousemove(t) {
        (this.prevMouseMoveEvent = t),
          !this.isCompact && this.option("idle") && this.resetIdle();
      }
      onVisibilityChange() {
        document.visibilityState === "visible"
          ? this.checkFocus()
          : this.endIdle();
      }
      manageCloseBtn(t) {
        let e = this.optionFor(t, "closeButton") || !1;
        if (e === "auto") {
          let n = this.plugins.Toolbar;
          if (n && n.state === nt.Ready) return;
        }
        if (!e || !t.contentEl || t.closeBtnEl) return;
        let i = this.option("tpl.closeButton");
        if (i) {
          let n = S(this.localize(i));
          (t.closeBtnEl = t.contentEl.appendChild(n)),
            t.el && v(t.el, "has-close-btn");
        }
      }
      manageCaption(t = void 0) {
        var e, i;
        let n = "fancybox__caption",
          o = this.container;
        if (!o) return;
        U(o, At);
        let l = this.isCompact || this.option("commonCaption"),
          c = !l;
        if (
          (this.caption && this.stop(this.caption),
          c && this.caption && (this.caption.remove(), (this.caption = null)),
          l && !this.caption)
        )
          for (let r of ((e = this.carousel) === null || e === void 0
            ? void 0
            : e.slides) || [])
            r.captionEl &&
              (r.captionEl.remove(),
              (r.captionEl = void 0),
              U(r.el, At),
              (i = r.el) === null ||
                i === void 0 ||
                i.removeAttribute("aria-labelledby"));
        if ((t || (t = this.getSlide()), !t || (l && !this.isCurrentSlide(t))))
          return;
        let u = t.el,
          m = this.optionFor(t, "caption", "");
        if (!m)
          return void (
            l &&
            this.caption &&
            this.animate(this.caption, "f-fadeOut", () => {
              this.caption && (this.caption.innerHTML = "");
            })
          );
        let s = null;
        if (c) {
          if (((s = t.captionEl || null), u && !s)) {
            let r = n + `_${this.id}_${t.index}`;
            (s = document.createElement("div")),
              v(s, n),
              s.setAttribute("id", r),
              (t.captionEl = u.appendChild(s)),
              v(u, At),
              u.setAttribute("aria-labelledby", r);
          }
        } else
          (s = this.caption),
            s || (s = o.querySelector("." + n)),
            !s &&
              ((s = document.createElement("div")),
              (s.dataset.fancyboxCaption = ""),
              v(s, n),
              (this.footer || o).prepend(s)),
            v(o, At),
            (this.caption = s);
        s &&
          ((s.innerHTML = ""),
          K(m) || typeof m == "number"
            ? (s.innerHTML = m + "")
            : m instanceof HTMLElement && s.appendChild(m));
      }
      checkFocus(t) {
        this.focus(t);
      }
      focus(t) {
        var e;
        if (this.ignoreFocusChange) return;
        let i = document.activeElement || null,
          n = t?.target || null,
          o = this.container,
          l =
            (e = this.carousel) === null || e === void 0 ? void 0 : e.viewport;
        if (!o || !l || (!t && i && o.contains(i))) return;
        let c = this.getSlide(),
          u = c && c.state === I.Ready ? c.el : null;
        if (!u || u.contains(i) || o === i) return;
        t && t.cancelable && t.preventDefault(), (this.ignoreFocusChange = !0);
        let m = Array.from(o.querySelectorAll(Ie)),
          s = [],
          r = null;
        for (let h of m) {
          let f = !h.offsetParent || !!h.closest('[aria-hidden="true"]'),
            b = u && u.contains(h),
            p = !l.contains(h);
          if (h === o || ((b || p) && !f)) {
            s.push(h);
            let g = h.dataset.origTabindex;
            g !== void 0 && g && (h.tabIndex = parseFloat(g)),
              h.removeAttribute("data-orig-tabindex"),
              (!h.hasAttribute("autoFocus") && r) || (r = h);
          } else {
            let g =
              h.dataset.origTabindex === void 0
                ? h.getAttribute("tabindex") || ""
                : h.dataset.origTabindex;
            g && (h.dataset.origTabindex = g), (h.tabIndex = -1);
          }
        }
        let d = null;
        t
          ? (!n || s.indexOf(n) < 0) &&
            ((d = r || o),
            s.length &&
              (i === et
                ? (d = s[0])
                : (this.lastFocus !== o && i !== N) || (d = s[s.length - 1])))
          : (d = c && c.type === "image" ? o : r || o),
          d && wi(d),
          (this.lastFocus = document.activeElement),
          (this.ignoreFocusChange = !1);
      }
      next() {
        let t = this.carousel;
        t && t.pages.length > 1 && t.slideNext();
      }
      prev() {
        let t = this.carousel;
        t && t.pages.length > 1 && t.slidePrev();
      }
      jumpTo(...t) {
        this.carousel && this.carousel.slideTo(...t);
      }
      isTopmost() {
        var t;
        return (
          ((t = a.getInstance()) === null || t === void 0 ? void 0 : t.id) ==
          this.id
        );
      }
      animate(t = null, e = "", i) {
        if (!t || !e) return void (i && i());
        this.stop(t);
        let n = (o) => {
          o.target === t &&
            t.dataset.animationName &&
            (t.removeEventListener("animationend", n),
            delete t.dataset.animationName,
            i && i(),
            U(t, e));
        };
        (t.dataset.animationName = e),
          t.addEventListener("animationend", n),
          v(t, e);
      }
      stop(t) {
        t &&
          t.dispatchEvent(
            new CustomEvent("animationend", {
              bubbles: !1,
              cancelable: !0,
              currentTarget: t,
            })
          );
      }
      setContent(t, e = "", i = !0) {
        if (this.isClosing()) return;
        let n = t.el;
        if (!n) return;
        let o = null;
        if (
          (R(e)
            ? (o = e)
            : ((o = S(e + "")),
              R(o) ||
                ((o = document.createElement("div")), (o.innerHTML = e + ""))),
          ["img", "picture", "iframe", "video", "audio"].includes(
            o.nodeName.toLowerCase()
          ))
        ) {
          let l = document.createElement("div");
          l.appendChild(o), (o = l);
        }
        R(o) && t.filter && !t.error && (o = o.querySelector(t.filter)),
          o && R(o)
            ? (v(o, "fancybox__content"),
              t.id && o.setAttribute("id", t.id),
              n.classList.add(`has-${t.error ? "error" : t.type || "unknown"}`),
              n.prepend(o),
              o.style.display === "none" && (o.style.display = ""),
              getComputedStyle(o).getPropertyValue("display") === "none" &&
                (o.style.display =
                  t.display || this.option("defaultDisplay") || "flex"),
              (t.contentEl = o),
              i && this.revealContent(t),
              this.manageCloseBtn(t),
              this.manageCaption(t))
            : this.setError(t, "{{ELEMENT_NOT_FOUND}}");
      }
      revealContent(t, e) {
        let i = t.el,
          n = t.contentEl;
        i &&
          n &&
          (this.emit("reveal", t),
          this.hideLoading(t),
          (t.state = I.Opening),
          (e = this.isOpeningSlide(t)
            ? e === void 0
              ? this.optionFor(t, "showClass")
              : e
            : "f-fadeIn")
            ? this.animate(n, e, () => {
                this.done(t);
              })
            : this.done(t));
      }
      done(t) {
        this.isClosing() ||
          ((t.state = I.Ready),
          this.emit("done", t),
          v(t.el, "is-done"),
          this.isCurrentSlide(t) &&
            this.option("autoFocus") &&
            queueMicrotask(() => {
              var e;
              (e = t.panzoom) === null || e === void 0 || e.updateControls(),
                this.option("autoFocus") && this.focus();
            }),
          this.isOpeningSlide(t) &&
            (U(this.container, Te),
            !this.isCompact && this.option("idle") && this.setIdle()));
      }
      isCurrentSlide(t) {
        let e = this.getSlide();
        return !(!t || !e) && e.index === t.index;
      }
      isOpeningSlide(t) {
        var e, i;
        return (
          ((e = this.carousel) === null || e === void 0
            ? void 0
            : e.prevPage) === null &&
          t &&
          t.index ===
            ((i = this.getSlide()) === null || i === void 0 ? void 0 : i.index)
        );
      }
      showLoading(t) {
        t.state = I.Loading;
        let e = t.el;
        e &&
          (v(e, _i),
          this.emit("loading", t),
          t.spinnerEl ||
            setTimeout(() => {
              if (!this.isClosing() && !t.spinnerEl && t.state === I.Loading) {
                let i = S(Pe);
                v(i, "fancybox-spinner"),
                  (t.spinnerEl = i),
                  e.prepend(i),
                  this.animate(i, "f-fadeIn");
              }
            }, 250));
      }
      hideLoading(t) {
        let e = t.el;
        if (!e) return;
        let i = t.spinnerEl;
        this.isClosing()
          ? i?.remove()
          : (U(e, _i),
            i &&
              this.animate(i, "f-fadeOut", () => {
                i.remove();
              }),
            t.state === I.Loading &&
              (this.emit("loaded", t), (t.state = I.Ready)));
      }
      setError(t, e) {
        if (this.isClosing()) return;
        let i = new Event("error", { bubbles: !0, cancelable: !0 });
        if ((this.emit("error", i, t), i.defaultPrevented)) return;
        (t.error = e), this.hideLoading(t), this.clearContent(t);
        let n = document.createElement("div");
        n.classList.add("fancybox-error"),
          (n.innerHTML = this.localize(e || "<p>{{ERROR}}</p>")),
          this.setContent(t, n);
      }
      clearContent(t) {
        if (t.state === void 0) return;
        this.emit("clearContent", t),
          t.contentEl && (t.contentEl.remove(), (t.contentEl = void 0));
        let e = t.el;
        e &&
          (U(e, "has-error"),
          U(e, "has-unknown"),
          U(e, `has-${t.type || "unknown"}`)),
          t.closeBtnEl && t.closeBtnEl.remove(),
          (t.closeBtnEl = void 0),
          t.captionEl && t.captionEl.remove(),
          (t.captionEl = void 0),
          t.spinnerEl && t.spinnerEl.remove(),
          (t.spinnerEl = void 0);
      }
      getSlide() {
        var t;
        let e = this.carousel;
        return (
          ((t = e?.pages[e?.page]) === null || t === void 0
            ? void 0
            : t.slides[0]) || void 0
        );
      }
      close(t, e) {
        if (this.isClosing()) return;
        let i = new Event("shouldClose", { bubbles: !0, cancelable: !0 });
        if ((this.emit("shouldClose", i, t), i.defaultPrevented)) return;
        t && t.cancelable && (t.preventDefault(), t.stopPropagation());
        let n = () => {
          this.proceedClose(t, e);
        };
        this.startedFs && G && G.isFullscreen()
          ? Promise.resolve(G.exit()).then(() => n())
          : n();
      }
      clearIdle() {
        this.idleTimer && clearTimeout(this.idleTimer), (this.idleTimer = null);
      }
      setIdle(t = !1) {
        let e = () => {
          this.clearIdle(),
            (this.idle = !0),
            v(this.container, "is-idle"),
            this.emit("setIdle");
        };
        if ((this.clearIdle(), !this.isClosing()))
          if (t) e();
          else {
            let i = this.option("idle");
            i && (this.idleTimer = setTimeout(e, i));
          }
      }
      endIdle() {
        this.clearIdle(),
          this.idle &&
            !this.isClosing() &&
            ((this.idle = !1),
            U(this.container, "is-idle"),
            this.emit("endIdle"));
      }
      resetIdle() {
        this.endIdle(), this.setIdle();
      }
      toggleIdle() {
        this.idle ? this.endIdle() : this.setIdle(!0);
      }
      toggleFullscreen() {
        G &&
          (G.isFullscreen()
            ? G.exit()
            : G.request().then(() => {
                this.startedFs = !0;
              }));
      }
      isClosing() {
        return [O.Closing, O.CustomClosing, O.Destroy].includes(this.state);
      }
      proceedClose(t, e) {
        var i, n;
        (this.state = O.Closing), this.clearIdle(), this.detachEvents();
        let o = this.container,
          l = this.carousel,
          c = this.getSlide(),
          u =
            c && this.option("placeFocusBack")
              ? c.triggerEl || this.option("triggerEl")
              : null;
        if (
          (u && (zi(u) ? wi(u) : u.focus()),
          o &&
            (U(o, Te),
            v(o, "is-closing"),
            o.setAttribute(Xe, "true"),
            this.option("animated") && v(o, Ne),
            (o.style.pointerEvents = "none")),
          l)
        ) {
          l.clearTransitions(),
            (i = l.panzoom) === null || i === void 0 || i.destroy(),
            (n = l.plugins.Navigation) === null || n === void 0 || n.detach();
          for (let m of l.slides) {
            (m.state = I.Closing), this.hideLoading(m);
            let s = m.contentEl;
            s && this.stop(s);
            let r = m?.panzoom;
            r && (r.stop(), r.detachEvents(), r.detachObserver()),
              this.isCurrentSlide(m) || l.emit("removeSlide", m);
          }
        }
        (Ti = window.scrollX),
          (Ai = window.scrollY),
          window.addEventListener("scroll", this.onScroll),
          this.emit("close", t),
          this.state !== O.CustomClosing
            ? (e === void 0 && c && (e = this.optionFor(c, "hideClass")),
              e && c
                ? (this.animate(c.contentEl, e, () => {
                    l && l.emit("removeSlide", c);
                  }),
                  setTimeout(() => {
                    this.destroy();
                  }, 500))
                : this.destroy())
            : setTimeout(() => {
                this.destroy();
              }, 500);
      }
      destroy() {
        var t;
        if (this.state === O.Destroy) return;
        window.removeEventListener("scroll", this.onScroll),
          (this.state = O.Destroy),
          (t = this.carousel) === null || t === void 0 || t.destroy();
        let e = this.container;
        e && e.remove(), ct.delete(this.id);
        let i = a.getInstance();
        i
          ? i.focus()
          : (N && (N.remove(), (N = null)),
            et && (et.remove(), (et = null)),
            U(document.documentElement, Ii),
            (() => {
              if (!Ft) return;
              let n = document,
                o = n.body;
              o.classList.remove(De),
                o.style.setProperty(Vi, ""),
                n.documentElement.style.setProperty(Ri, "");
            })(),
            this.emit("destroy"));
      }
      static bind(t, e, i) {
        if (!Ft) return;
        let n,
          o = "",
          l = {};
        if (
          (t === void 0
            ? (n = document.body)
            : K(t)
            ? ((n = document.body),
              (o = t),
              typeof e == "object" && (l = e || {}))
            : ((n = t), K(e) && (o = e), typeof i == "object" && (l = i || {})),
          !n || !R(n))
        )
          return;
        o = o || "[data-fancybox]";
        let c = a.openers.get(n) || new Map();
        c.set(o, l),
          a.openers.set(n, c),
          c.size === 1 && n.addEventListener("click", a.fromEvent);
      }
      static unbind(t, e) {
        let i,
          n = "";
        if (
          (K(t) ? ((i = document.body), (n = t)) : ((i = t), K(e) && (n = e)),
          !i)
        )
          return;
        let o = a.openers.get(i);
        o && n && o.delete(n),
          (n && o) ||
            (a.openers.delete(i), i.removeEventListener("click", a.fromEvent));
      }
      static destroy() {
        let t;
        for (; (t = a.getInstance()); ) t.destroy();
        for (let e of a.openers.keys())
          e.removeEventListener("click", a.fromEvent);
        a.openers = new Map();
      }
      static fromEvent(t) {
        if (
          t.defaultPrevented ||
          (t.button && t.button !== 0) ||
          t.ctrlKey ||
          t.metaKey ||
          t.shiftKey
        )
          return;
        let e = t.composedPath()[0],
          i = e.closest("[data-fancybox-trigger]");
        if (i) {
          let f = i.dataset.fancyboxTrigger || "",
            b = document.querySelectorAll(`[data-fancybox="${f}"]`),
            p = parseInt(i.dataset.fancyboxIndex || "", 10) || 0;
          e = b[p] || e;
        }
        if (!(e && e instanceof Element)) return;
        let n, o, l, c;
        if (
          ([...a.openers].reverse().find(
            ([f, b]) =>
              !(
                !f.contains(e) ||
                ![...b].reverse().find(([p, g]) => {
                  let Q = e.closest(p);
                  return !!Q && ((n = f), (o = p), (l = Q), (c = g), !0);
                })
              )
          ),
          !n || !o || !l)
        )
          return;
        (c = c || {}), t.preventDefault(), (e = l);
        let u = [],
          m = V({}, Je, c);
        (m.event = t), (m.triggerEl = e), (m.delegate = i);
        let s = m.groupAll,
          r = m.groupAttr,
          d = r && e ? e.getAttribute(`${r}`) : "";
        if (
          ((!e || d || s) && (u = [].slice.call(n.querySelectorAll(o))),
          e &&
            !s &&
            (u = d ? u.filter((f) => f.getAttribute(`${r}`) === d) : [e]),
          !u.length)
        )
          return;
        let h = a.getInstance();
        return h && h.options.triggerEl && u.indexOf(h.options.triggerEl) > -1
          ? void 0
          : (e && (m.startIndex = u.indexOf(e)), a.fromNodes(u, m));
      }
      static fromSelector(t, e, i) {
        let n = null,
          o = "",
          l = {};
        if (
          (K(t)
            ? ((n = document.body),
              (o = t),
              typeof e == "object" && (l = e || {}))
            : t instanceof HTMLElement &&
              K(e) &&
              ((n = t), (o = e), typeof i == "object" && (l = i || {})),
          !n || !o)
        )
          return !1;
        let c = a.openers.get(n);
        return (
          !!c &&
          ((l = V({}, c.get(o) || {}, l)),
          !!l && a.fromNodes(Array.from(n.querySelectorAll(o)), l))
        );
      }
      static fromNodes(t, e) {
        e = V({}, Je, e || {});
        let i = [];
        for (let n of t) {
          let o = n.dataset || {},
            l =
              o[lt] ||
              n.getAttribute(Ae) ||
              n.getAttribute("currentSrc") ||
              n.getAttribute(lt) ||
              void 0,
            c,
            u = e.delegate,
            m;
          u &&
            i.length === e.startIndex &&
            (c =
              u instanceof HTMLImageElement
                ? u
                : u.querySelector("img:not([aria-hidden])")),
            c ||
              (c =
                n instanceof HTMLImageElement
                  ? n
                  : n.querySelector("img:not([aria-hidden])")),
            c &&
              ((m = c.currentSrc || c[lt] || void 0),
              !m &&
                c.dataset &&
                (m = c.dataset.lazySrc || c.dataset[lt] || void 0));
          let s = {
            src: l,
            triggerEl: n,
            thumbEl: c,
            thumbElSrc: m,
            thumbSrc: m,
          };
          for (let r in o) {
            let d = o[r] + "";
            (d = d !== "false" && (d === "true" || d)), (s[r] = d);
          }
          i.push(s);
        }
        return new a(i, e);
      }
      static getInstance(t) {
        return t
          ? ct.get(t)
          : Array.from(ct.values())
              .reverse()
              .find((e) => !e.isClosing() && e) || null;
      }
      static getSlide() {
        var t;
        return (
          ((t = a.getInstance()) === null || t === void 0
            ? void 0
            : t.getSlide()) || null
        );
      }
      static show(t = [], e = {}) {
        return new a(t, e);
      }
      static next() {
        let t = a.getInstance();
        t && t.next();
      }
      static prev() {
        let t = a.getInstance();
        t && t.prev();
      }
      static close(t = !0, ...e) {
        if (t) for (let i of ct.values()) i.close(...e);
        else {
          let i = a.getInstance();
          i && i.close(...e);
        }
      }
    };
  Object.defineProperty(E, "version", {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: "5.0.36",
  }),
    Object.defineProperty(E, "defaults", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: Je,
    }),
    Object.defineProperty(E, "Plugins", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: bs,
    }),
    Object.defineProperty(E, "openers", {
      enumerable: !0,
      configurable: !0,
      writable: !0,
      value: new Map(),
    });
  var Ke = class extends _ {
    expandImage(a) {
      new E([{ src: a.target.src }], {
        backdropClick: !1,
        contentClick: !1,
        mainClass: "fancybox-darkerbg",
        Toolbar: {
          display: {
            left: [],
            middle: [],
            right: ["zoomIn", "zoomOut", "close"],
          },
        },
      });
    }
    showImage(a) {
      let t = a.target;
      "clicks" in t.dataset
        ? t.setAttribute("data-clicks", parseInt(t.dataset.clicks) + 1)
        : t.setAttribute("data-clicks", 1);
      let e = parseInt(t.dataset.clicks),
        i = t.dataset.image,
        n = "image";
      i.includes("https://") || (n = "inline"),
        `image${e}` in t.dataset &&
          ((i = t.dataset[`image${e}`]),
          i.includes("https://") || (n = "inline")),
        "imagemax" in t.dataset &&
          "imageoverflow" in t.dataset &&
          e > parseInt(t.dataset.imagemax) &&
          ((i = t.dataset.imageoverflow), (n = "inline"), this.audioEnded()),
        n == "inline"
          ? new E([{ src: `#${i}`, type: "inline" }], {
              backdropClick: !1,
              Toolbar: { display: { left: [], middle: [], right: ["close"] } },
              on: {
                reveal: (o) => {
                  for (let c of o
                    .getSlide()
                    .contentEl.querySelectorAll("video"))
                    c.play();
                  let l = this.application.getControllerForElementAndIdentifier(
                    document.getElementById("desk_frame"),
                    "secrets"
                  );
                  "bgm" in o.getSlide().contentEl.dataset &&
                    l.playBGM(o.getSlide().contentEl.dataset.bgm);
                  for (let c of o
                    .getSlide()
                    .contentEl.querySelectorAll("audio")) {
                    let u = document.querySelector("audio.playing");
                    u && c.id != u.id && u.pause(), l.playAudio(c.id);
                  }
                },
                close: (o) => {
                  for (let u of o
                    .getSlide()
                    .contentEl.querySelectorAll("video"))
                    u.pause();
                  let l = this.application.getControllerForElementAndIdentifier(
                      document.getElementById("desk_frame"),
                      "secrets"
                    ),
                    c = document.querySelector("audio.playing");
                  c && !c.classList.contains("keep-playing") && c.pause();
                },
              },
            })
          : new E([{ src: i }], {
              backdropClick: !1,
              contentClick: !1,
              Toolbar: {
                display: {
                  left: [],
                  middle: [],
                  right: ["zoomIn", "zoomOut", "close"],
                },
              },
            });
    }
    showContent(a) {
      let t = a.target.dataset.content;
      document.getElementById(t)
        ? this.fancyContent(t)
        : fetch(t).then(async (i) => {
            let n = document.createElement("div");
            n.setAttribute("id", t),
              n.classList.add("hidden", "html"),
              (n.innerHTML = await i.text()),
              document.body.appendChild(n),
              this.fancyContent(t);
          });
    }
    fancyContent(a) {
      new E([{ src: `#${a}`, type: "inline" }], {
        backdropClick: !1,
        Toolbar: { display: { left: [], middle: [], right: ["close"] } },
      });
    }
    fancyImage(a) {
      let t = document.getElementById(a);
      new E([{ src: t.src, type: "image" }], {
        backdropClick: !1,
        contentClick: !1,
        Toolbar: {
          display: {
            left: [],
            middle: [],
            right: ["zoomIn", "zoomOut", "close"],
          },
        },
      });
    }
    randomLink(a) {
      let t = a.target.dataset.links.split(";");
      for (let e of t) {
        let i = Math.floor(Math.random() * t.length);
        window.open(e, "_blank").focus();
      }
    }
    closeAll() {
      E.close();
    }
    playSound(a) {
      this.application
        .getControllerForElementAndIdentifier(
          document.getElementById("desk_frame"),
          "secrets"
        )
        .playSound(a.params.sound);
    }
    playAudio(a) {
      let t = a.target.dataset.audio,
        e = document.getElementById(t);
      if (e.paused) {
        this.application
          .getControllerForElementAndIdentifier(
            document.getElementById("desk_frame"),
            "secrets"
          )
          .playAudio(t);
        let n = a.target.parentElement.querySelector(".audio-speaker");
        n && n.classList.add("speaker-visible");
      } else e.pause();
    }
    audioEnded() {
      this.application
        .getControllerForElementAndIdentifier(
          document.getElementById("desk_frame"),
          "secrets"
        )
        .audioEnded();
    }
    audioPaused() {
      this.application
        .getControllerForElementAndIdentifier(
          document.getElementById("desk_frame"),
          "secrets"
        )
        .audioPaused();
    }
    printImage(a) {
      let t = document.getElementById(a.target.dataset.print);
      if (t) {
        let e = window.open("about:blank", "_new");
        e.document.open(),
          e.document.write(
            `<html><head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head><body onload="window.print(); window.close()" onafterprint="window.close()"><img src="${t.src}" style="width: 100%; height: auto" /></body></html>`
          ),
          e.document.close();
      }
    }
    nextImage(a) {
      let t = document.getElementById(a.target.dataset.next);
      a.target.classList.add("hidden"), t.classList.remove("hidden");
    }
    replaceSources(a) {
      this.application
        .getControllerForElementAndIdentifier(
          document.getElementById("desk_frame"),
          "secrets"
        )
        .replaceSources(a.params.replacements);
    }
  };
  var ti = {};
  ne(ti, { default: () => qe });
  var qe = class extends _ {
    flipImage(a) {
      for (let t of document.querySelectorAll(`#${a.params.image}`)) {
        if (t.classList.contains("animate-flip-in")) return !1;
        t.classList.remove("animate-flip-out"),
          t.classList.add("animate-flip-in"),
          setTimeout(function () {
            let e = t.src,
              i = t.dataset.back;
            (t.src = i),
              t.setAttribute("data-back", e),
              t.classList.remove("animate-flip-in"),
              t.classList.add("animate-flip-out");
          }, 150);
      }
    }
  };
  var ei = {};
  ne(ei, { default: () => vt });
  var L = pn(tn());
  var vt = class extends _ {
    connect() {
      this.hasVideo1Target &&
        this.loaded1Value == !1 &&
        ((this.badCodes = []),
        this.video1Target.load(),
        this.video2Target.load(),
        this.initiateSFX(),
        this.initiateBGM());
    }
    initiateSFX() {
      (this.sfx = {}),
        (this.sfx.begin = new L.Howl({ src: ["/assets/sfx/begin.mp3"] })),
        (this.sfx.bubble = new L.Howl({ src: ["/assets/sfx/bubble.mp3"] })),
        (this.sfx.button = new L.Howl({
          src: ["/assets/sfx/button.mp3"],
          html5: !0,
        })),
        (this.sfx.reveal = new L.Howl({
          src: ["/assets/sfx/content-reveal.mp3"],
        })),
        (this.sfx.unreveal = new L.Howl({
          src: ["/assets/sfx/content-unreveal.mp3"],
        })),
        (this.sfx.error = new L.Howl({ src: ["/assets/sfx/error.mp3"] })),
        (this.sfx.pop = new L.Howl({ src: ["/assets/sfx/pop.mp3"] })),
        (this.sfx.lose = new L.Howl({ src: ["/assets/sfx/lose.mp3"] })),
        (this.sfx.soul = new L.Howl({ src: ["/assets/sfx/soul.mp3"] })),
        (this.sfx.thunder1 = new L.Howl({ src: ["/assets/sfx/thunder1.mp3"] })),
        (this.sfx.thunder2 = new L.Howl({ src: ["/assets/sfx/thunder2.mp3"] })),
        (this.sfx.static1 = new L.Howl({
          src: ["/assets/sfx/static1.mp3"],
          loop: !0,
        })),
        (this.sfx.static2 = new L.Howl({
          src: ["/assets/sfx/static2.mp3"],
          loop: !0,
        })),
        (this.sfx.static3 = new L.Howl({
          src: ["/assets/sfx/static3.mp3"],
          loop: !0,
        }));
    }
    stopAllSFX() {
      for (let a of this.sfx) a.stop();
    }
    initiateBGM() {
      (this.bgm = {}),
        (this.bgm.info = new L.Howl({
          src: ["/assets/info.mp3"],
          loop: !0,
          volume: this.volumeValue,
        })),
        (this.bgm.ominous = new L.Howl({
          src: ["/assets/ominous.mp3"],
          loop: !0,
          volume: this.volumeValue,
        })),
        (this.bgm.rain = new L.Howl({
          src: ["/assets/rain.mp3"],
          loop: !0,
          volume: this.volumeValue,
        })),
        (this.bgm.tone = new L.Howl({
          src: ["/assets/tone.mp3"],
          loop: !0,
          volume: this.volumeValue,
        })),
        (this.bgm.upbeat = new L.Howl({
          src: ["/assets/upbeat.mp3"],
          loop: !0,
          volume: this.volumeValue,
        }));
    }
    bubble() {
      this.sfx.bubble.play();
    }
    hoverButton() {
      this.buttonOverlayTarget.classList.add("hovered");
    }
    unhoverButton() {
      this.buttonOverlayTarget.classList.remove("hovered");
    }
    pressButton() {
      this.buttonOverlayTarget.classList.add("pressed");
    }
    unpressButton() {
      this.buttonOverlayTarget.classList.remove("pressed");
    }
    screenOccupiedValueChanged() {
      this.screenOccupiedValue
        ? this.buttonOverlayTarget.classList.add("occupied")
        : this.buttonOverlayTarget.classList.remove("occupied");
    }
    expandImage(a) {
      new E([{ src: a.target.src }], {
        backdropClick: !1,
        contentClick: !1,
        mainClass: "fancybox-darkerbg",
        Toolbar: {
          display: {
            left: [],
            middle: [],
            right: ["zoomIn", "zoomOut", "close"],
          },
        },
      });
    }
    showImage(a) {
      let t = a.target;
      "clicks" in t.dataset
        ? t.setAttribute("data-clicks", parseInt(t.dataset.clicks) + 1)
        : t.setAttribute("data-clicks", 1);
      let e = parseInt(t.dataset.clicks),
        i = t.dataset.image;
      `image${e}` in t.dataset && (i = t.dataset[`image${e}`]),
        new E([{ src: i }], {
          backdropClick: !1,
          contentClick: !1,
          Toolbar: {
            display: {
              left: [],
              middle: [],
              right: ["zoomIn", "zoomOut", "close"],
            },
          },
        });
    }
    showContent(a) {
      let t = a.target.dataset.content;
      document.getElementById(t)
        ? this.fancyContent(t)
        : fetch(t).then(async (i) => {
            let n = document.createElement("div");
            n.setAttribute("id", t),
              n.classList.add("hidden", "html"),
              (n.innerHTML = await i.text()),
              document.body.appendChild(n),
              this.fancyContent(t);
          });
    }
    fancyContent(a) {
      let t = document.getElementById(a),
        e = t.querySelector("[data-imageshown]"),
        i = !1,
        n = !1,
        o = !1;
      if (e) {
        let c = parseInt(e.dataset.imageshown),
          u = e.querySelectorAll("img");
        for (let s of u) s.classList.add("hidden");
        u[c].classList.remove("hidden"),
          "text" in u[c].dataset && (n = u[c].dataset.text),
          "audio" in u[c].dataset && (i = u[c].dataset.audio),
          "video" in u[c].dataset && (o = u[c].dataset.video);
        let m = c + 1;
        m > u.length - 1 && (m = u.length - 1), (e.dataset.imageshown = m);
      }
      let l = t.querySelector("[data-multiimage]");
      if (n) this.showText(n);
      else if (o) this.playVideo(o);
      else if (l) {
        let c = [],
          u = l.dataset.multiimage;
        for (let m of document.querySelectorAll(`[data-fancybox='${u}']`))
          c.push({ src: m.src, type: "image" });
        new E(c, {
          backdropClick: !1,
          contentClick: !1,
          Thumbs: !1,
          Toolbar: {
            display: {
              left: [],
              middle: [],
              right: ["zoomIn", "zoomOut", "close"],
            },
          },
          on: {
            reveal: (m) => {
              this.sfx !== void 0 && this.sfx.reveal.play();
            },
            close: (m) => {
              this.sfx !== void 0 && this.sfx.unreveal.play();
            },
          },
        });
      } else
        (t.classList.contains("html") ||
          t.classList.contains("text") ||
          t.classList.contains("link") ||
          t.classList.contains("image") ||
          t.classList.contains("video") ||
          t.classList.contains("audio")) &&
          new E([{ src: `#${a}`, type: "inline" }], {
            backdropClick: !1,
            Toolbar: { display: { left: [], middle: [], right: ["close"] } },
            on: {
              reveal: (c) => {
                this.sfx !== void 0 &&
                  (i ? this.sfx[i].play() : this.sfx.reveal.play()),
                  this.bgm !== void 0 &&
                    c.getSlide().contentEl.children.length > 0 &&
                    "bgm" in c.getSlide().contentEl.children[0].dataset &&
                    this.playBGM(
                      c.getSlide().contentEl.children[0].dataset.bgm
                    );
                for (let u of c.getSlide().contentEl.querySelectorAll("video"))
                  u.play();
              },
              close: (c) => {
                this.sfx !== void 0 && this.sfx.unreveal.play(),
                  this.bgm !== void 0 &&
                    this.bgmPlayingValue != "rain" &&
                    this.playBGM("rain");
                for (let m of c.getSlide().contentEl.querySelectorAll("video"))
                  m.pause();
                let u = document.querySelector("audio.playing");
                u && (u.pause(), (u.currentTime = 0));
              },
            },
          });
      this.unpressButton();
    }
    fancyImage(a) {
      let t = document.getElementById(a);
      new E([{ src: t.src, type: "image" }], {
        backdropClick: !1,
        contentClick: !1,
        Toolbar: {
          display: {
            left: [],
            middle: [],
            right: ["zoomIn", "zoomOut", "close"],
          },
        },
        on: {
          reveal: () => {
            this.sfx !== void 0 && this.sfx.reveal.play();
          },
          close: () => {
            this.sfx !== void 0 && this.sfx.unreveal.play();
          },
        },
      }),
        this.unpressButton();
    }
    waiting() {
      (this.waitingValue = !0),
        this.loaderTarget.classList.add("!opacity-100"),
        this.checkLoaded();
    }
    loaded1() {
      (this.loaded1Value = !0), this.checkLoaded();
    }
    loaded2() {
      (this.loaded2Value = !0), this.checkLoaded();
    }
    checkLoaded() {
      this.loaded1Value && this.loaded2Value && (this.readyValue = !0),
        this.readyValue && this.waitingValue && this.begin();
    }
    begin() {
      this.loaderTarget.classList.add("!duration-100"),
        this.loaderTarget.classList.remove("!opacity-100"),
        this.startScreenTarget.classList.add(
          "pointer-events-none",
          "opacity-0"
        ),
        this.startScreenTarget.pause(),
        this.shadowTarget.classList.add("!shadow-darken"),
        this.video1Target.play(),
        this.video2Target.play(),
        this.volumeTarget.classList.remove("!opacity-0"),
        this.titleTarget.classList.remove("!opacity-0"),
        this.begunValue ||
          (this.sfx.button.play(), this.sfx.begin.play(), this.playBGM("rain")),
        (this.begunValue = !0);
    }
    submit(a) {
      if (
        (a.preventDefault(), this.buttonTarget.classList.contains("disabled"))
      )
        return !1;
      if (
        (this.fieldTarget.classList.remove("animate-error"),
        this.fieldTarget.classList.add("loading"),
        this.badOverlayTarget.classList.remove("animate-flash"),
        this.sfx.button.play(),
        this.screenOccupiedValue)
      )
        return this.resetScreen(), !1;
      let t = a.target.code.value;
      (t = t.toLowerCase()),
        (t = t.replace(/[^a-z0-9?]/gi, "")),
        window.hasOwnProperty("plausible") &&
          window.plausible("Code", { props: { code: t } });
      let e = document.getElementById(t);
      if (e)
        e.classList.contains("part-of-ui")
          ? this.flashError()
          : e.classList.contains("text")
          ? this.randomText(t)
          : e.classList.contains("link")
          ? this.randomLink(t)
          : e.classList.contains("image")
          ? this.fancyImage(t)
          : e.classList.contains("video")
          ? this.playVideo(t)
          : e.classList.contains("audio")
          ? this.playAudio(t)
          : e.classList.contains("overlays")
          ? this.randomOverlay(t)
          : e.classList.contains("replacements")
          ? this.replaceSources(t)
          : this.fancyContent(t),
          this.fieldTarget.removeAttribute("readonly"),
          this.fieldTarget.classList.remove("loading"),
          this.buttonTarget.removeAttribute("disabled"),
          this.unpressButton();
      else if (this.badCodes.includes(t) || t.length < 2)
        this.flashError(),
          this.fieldTarget.removeAttribute("readonly"),
          this.fieldTarget.classList.remove("loading"),
          this.buttonTarget.removeAttribute("disabled"),
          this.unpressButton();
      else {
        this.buttonOverlayTarget.classList.add("pressed"),
          this.fieldTarget.setAttribute("readonly", !0),
          this.buttonTarget.setAttribute("disabled", !0);
        let i = new FormData();
        i.append("code", t),
          fetch("https://codes.thisisnotawebsitedotcom.com/", {
            method: "POST",
            body: i,
          }).then(async (n) => {
            if (!n.ok)
              this.flashError(),
                n.status == "429"
                  ? this.disableForm(3e4)
                  : n.status == "404"
                  ? this.badCodes.push(t)
                  : this.disableForm(250);
            else {
              let o = n.headers.get("content-type");
              if (o == "text/html") {
                let l = document.createElement("div");
                l.setAttribute("id", t),
                  (l.innerHTML = await n.text()),
                  l.children[0].classList.contains("has-text")
                    ? (l.classList.add("hidden", "text"),
                      document.body.appendChild(l),
                      this.randomText(t))
                    : l.children[0].classList.contains("has-link")
                    ? (l.classList.add("hidden", "link"),
                      document.body.appendChild(l),
                      this.randomLink(t))
                    : l.children[0].classList.contains("audio")
                    ? (l.children[0].setAttribute("id", t),
                      document.body.appendChild(l.children[0]),
                      this.playAudio(t))
                    : l.children[0].classList.contains("has-overlays")
                    ? (l.children[0].setAttribute("id", t),
                      l.classList.add("hidden", "overlays"),
                      document.body.appendChild(l),
                      this.randomOverlay(t))
                    : l.children[0].classList.contains("has-replacements")
                    ? (l.children[0].setAttribute("id", t),
                      l.classList.add("hidden", "replacements"),
                      document.body.appendChild(l),
                      this.replaceSources(t))
                    : (l.classList.add("hidden", "html"),
                      document.body.appendChild(l),
                      this.fancyContent(t));
              } else if (o == "video/mp4") {
                let l = await n.blob(),
                  c = URL.createObjectURL(l),
                  u = document.createElement("video"),
                  m = document.createElement("source");
                u.setAttribute("id", t),
                  u.classList.add("hidden", "video"),
                  (m.src = c),
                  m.setAttribute("type", "video/mp4"),
                  document.getElementById("desk_frame").appendChild(u),
                  u.appendChild(m),
                  this.playVideo(t);
              } else if (o == "audio/mpeg") {
                let l = await n.blob(),
                  c = URL.createObjectURL(l),
                  u = document.createElement("audio"),
                  m = document.createElement("source");
                u.setAttribute("id", t),
                  u.classList.add("hidden", "audio"),
                  u.setAttribute(
                    "data-action",
                    "ended->secrets#audioEnded pause->secrets#audioEnded"
                  ),
                  (m.src = c),
                  m.setAttribute("type", "audio/mpeg"),
                  document.getElementById("desk_frame").appendChild(u),
                  u.appendChild(m),
                  this.playAudio(t);
              } else {
                let l = await n.blob(),
                  c = URL.createObjectURL(l),
                  u = document.createElement("img");
                u.setAttribute("id", t),
                  (u.src = c),
                  u.classList.add("hidden", "image"),
                  document.body.appendChild(u),
                  this.fancyImage(t);
              }
            }
            this.fieldTarget.removeAttribute("readonly"),
              this.fieldTarget.classList.remove("loading"),
              this.buttonTarget.removeAttribute("disabled"),
              this.unpressButton();
          });
      }
    }
    resetScreen() {
      (this.screenLoopsValue = 0),
        this.audioEnded(),
        this.screenTarget.pause(),
        this.videoEnded(),
        (this.textVisibleForSeconds = 0),
        (this.screenTextTarget.innerHTML = ""),
        this.screenTextTarget.classList.remove("!opacity-100"),
        this.screenOverlayTarget.classList.remove("!opacity-100"),
        this.screenStaticTarget.classList.remove("!opacity-100"),
        this.fieldTarget.classList.remove("loading"),
        (this.screenOccupiedValue = !1);
    }
    flashError() {
      this.fieldTarget.offsetHeight,
        this.fieldTarget.classList.remove("loading"),
        this.fieldTarget.classList.add("animate-error"),
        this.badOverlayTarget.offsetHeight,
        this.badOverlayTarget.classList.add("animate-flash"),
        this.sfx.error.play();
    }
    disableForm(a = 1e3) {
      this.buttonTarget.classList.add("disabled"),
        a > 1e3 &&
          (this.buttonOverlayTarget.classList.add("disabled"),
          this.fieldTarget.setAttribute("disabled", !0),
          this.buttonTarget.setAttribute("disabled", !0)),
        setTimeout(this.enableForm.bind(this), a);
    }
    enableForm() {
      this.buttonOverlayTarget.classList.remove("disabled"),
        this.fieldTarget.removeAttribute("disabled"),
        this.buttonTarget.removeAttribute("disabled"),
        this.buttonTarget.classList.remove("disabled");
    }
    adjustVolume() {
      if (
        ((this.volumeValue = this.volumeSliderTarget.value / 100),
        this.volumeValue > 0)
      ) {
        if (
          ((this.mutedValue = !1),
          (this.screenTarget.volume = this.volumeValue),
          L.Howler.volume(this.volumeValue),
          this.audioPlayingValue)
        ) {
          let a = document.querySelector("audio.playing");
          a.volume = this.volumeValue;
        }
      } else this.mutedValue = !0;
    }
    toggleMute() {
      this.mutedValue = !this.mutedValue;
    }
    mutedValueChanged() {
      if (
        (this.hasMuteButtonTarget &&
          (this.mutedValue
            ? (this.muteButtonTarget.classList.add("muted"),
              this.muteButtonTarget.classList.remove("unmuted"))
            : (this.muteButtonTarget.classList.remove("muted"),
              this.muteButtonTarget.classList.add("unmuted"))),
        this.hasScreenTarget &&
          (this.mutedValue
            ? ((this.screenTarget.volume = 0), (this.screenTarget.muted = !0))
            : ((this.screenTarget.volume = this.volumeValue),
              (this.screenTarget.muted = !1))),
        this.mutedValue)
      ) {
        if ((L.Howler.mute(!0), L.Howler.volume(0), this.audioPlayingValue)) {
          let a = document.querySelector("audio.playing");
          a.volume = 0;
        }
      } else if (
        (L.Howler.mute(!1),
        L.Howler.volume(this.volumeValue),
        this.audioPlayingValue)
      ) {
        let a = document.querySelector("audio.playing");
        a.volume = this.volumeValue;
      }
    }
    playVideo(a = "") {
      if (this.screenOccupiedValue)
        this.videoPlayingValue.includes("static") &&
          (this.screenTarget.pause(), this.videoEnded());
      else {
        if (typeof a == "string") {
          let t = document.getElementById(a),
            e = t.querySelector("source").src;
          (this.videoPlayingValue = e),
            "linkatend" in t.dataset &&
              "endsat" in t.dataset &&
              setTimeout(function () {
                window.open(t.dataset.linkatend, "_blank");
              }, parseInt(t.dataset.endsat));
        } else {
          let t = Math.floor(Math.random() * 7) + 1;
          this.videoPlayingValue = `/assets/static-${t}.mp4`;
        }
        this.screenOverlayTarget.classList.add("!opacity-100"),
          this.screenStaticTarget.classList.add("!opacity-100"),
          this.screenTarget.classList.add("!opacity-100"),
          this.screenSourceTarget.setAttribute("src", this.videoPlayingValue),
          this.screenTarget.load(),
          (this.screenTarget.currentTime = 0),
          this.screenTarget.play(),
          this.videoPlayingValue.includes("static") && this.staticSFX(),
          this.pauseBGM(),
          (this.screenOccupiedValue = !0);
      }
    }
    videoEnded() {
      this.videoPlayingValue &&
        (this.screenLoopsValue > 0
          ? ((this.screenLoopsValue -= 1),
            (this.screenTarget.currentTime = 0),
            this.screenTarget.play())
          : ((this.videoPlayingValue = ""),
            this.screenOverlayTarget.classList.remove("!opacity-100"),
            this.screenStaticTarget.classList.remove("!opacity-100"),
            this.screenTarget.classList.remove("!opacity-100"),
            this.staticPlayingValue && this.sfx[this.staticPlayingValue].stop(),
            this.resumeBGM(),
            (this.screenOccupiedValue = !1)));
    }
    videoLoop() {
      (this.video1Target.currentTime = 0),
        (this.video2Target.currentTime = 0),
        this.video1Target.play(),
        this.video2Target.play(),
        Math.floor(Math.random() * 6) + 1 > 4
          ? (this.video2Target.classList.remove("hidden"),
            setTimeout(this.lightningSFX.bind(this), 2500))
          : this.video2Target.classList.add("hidden");
    }
    staticSFX() {
      this.staticPlayingValue && this.sfx[this.staticPlayingValue].stop();
      let a = Math.floor(Math.random() * 3) + 1;
      (this.staticPlayingValue = `static${a}`),
        this.sfx[this.staticPlayingValue].play();
    }
    lightningSFX() {
      let a = Math.floor(Math.random() * 2) + 1;
      this.sfx[`thunder${a}`].play();
    }
    playBGM(a) {
      this.bgmPlayingValue &&
        this.bgmPlayingValue != a &&
        this.bgm[this.bgmPlayingValue].stop(),
        (this.bgmPlayingValue = a),
        this.resumeBGM();
    }
    pauseBGM() {
      this.bgmPlayingValue &&
        this.bgm[this.bgmPlayingValue].playing() &&
        this.bgm[this.bgmPlayingValue].pause();
    }
    resumeBGM() {
      this.bgmPlayingValue &&
        !this.bgm[this.bgmPlayingValue].playing() &&
        this.bgm[this.bgmPlayingValue].play();
    }
    playAudio(a) {
      if (!this.screenOccupiedValue) {
        this.audioPlayingValue = a;
        let t = document.getElementById(a);
        (t.volume = this.volumeValue),
          t.classList.add("playing"),
          "audiolog" in t.dataset
            ? this.playVideo("audiolog")
            : "music" in t.dataset
            ? this.playVideo("music")
            : this.playVideo("small"),
          (this.screenLoopsValue = 99),
          t.play(),
          this.pauseBGM(),
          (this.screenOccupiedValue = !0);
      }
    }
    playSound(a) {
      this.sfx !== void 0 && a in this.sfx && this.sfx[a].play();
    }
    triggerSound(a) {
      this.sfx !== void 0 &&
        a.params.sound in this.sfx &&
        this.sfx[a.params.sound].play();
    }
    audioEnded() {
      let a = document.getElementById(this.audioPlayingValue);
      if (a) {
        (a.currentTime = 0),
          a.pause(),
          a.classList.remove("playing"),
          (this.audioPlayingValue = "");
        let t = document.querySelector(".speaker-visible");
        t && t.classList.remove("speaker-visible"),
          this.videoPlayingValue &&
            ((this.screenLoopsValue = 0), this.videoEnded()),
          this.resumeBGM(),
          (this.screenOccupiedValue = !1);
      }
    }
    audioPaused() {
      let a = document.getElementById(this.audioPlayingValue);
      if (a) {
        a.pause(), a.classList.remove("playing"), (this.audioPlayingValue = "");
        let t = document.querySelector(".speaker-visible");
        t && t.classList.remove("speaker-visible"),
          this.videoPlayingValue &&
            ((this.screenLoopsValue = 0), this.videoEnded()),
          this.resumeBGM(),
          (this.screenOccupiedValue = !1);
      }
    }
    randomLink(a) {
      let t = document.getElementById(a).children[0],
        e = t.dataset.links.split(";"),
        i = Math.floor(Math.random() * e.length),
        n = e[i];
      if ("inorder" in t.dataset) {
        let o = 0;
        "next" in t.dataset && (o = parseInt(t.dataset.next)),
          (n = e[o]),
          (o += 1),
          o > e.length - 1 && (o -= 1),
          t.setAttribute("data-next", o);
      }
      if (n.includes("https")) {
        let o = document.createElement("a");
        o.classList.add("hidden"),
          o.setAttribute("href", n),
          o.setAttribute("target", "_blank"),
          o.setAttribute("rel", "noopener"),
          document.body.appendChild(o),
          setTimeout(function () {
            o.click(), document.body.removeChild(o);
          }, 100);
      } else {
        let o = document.getElementById(n);
        if (document.getElementById(`${n}_wrapper`))
          this.fancyContent(`${n}_wrapper`);
        else {
          let c = document.createElement("div");
          c.setAttribute("id", `${n}_wrapper`),
            c.appendChild(o),
            c.classList.add("hidden", "html"),
            document.body.appendChild(c),
            o.classList.remove("hidden"),
            this.fancyContent(`${n}_wrapper`);
        }
      }
    }
    randomText(a) {
      let t = document.getElementById(a).children[0],
        e = t.dataset.text.split(";"),
        i = Math.floor(Math.random() * e.length),
        n = e[i];
      if ("inorder" in t.dataset) {
        let o = 0;
        "next" in t.dataset && (o = parseInt(t.dataset.next)),
          (n = e[o]),
          (o += 1),
          o > e.length - 1 && (o = 0),
          t.setAttribute("data-next", o);
      }
      (this.screenTextTarget.innerHTML = n),
        this.screenTextTarget.classList.add("!opacity-100"),
        this.screenOverlayTarget.classList.add("!opacity-100"),
        this.screenStaticTarget.classList.add("!opacity-100"),
        (this.textVisibleForSeconds = Math.ceil(n.length / 5)),
        this.screenTextTarget.classList.remove("lotsa-text"),
        n.length > 30 && this.screenTextTarget.classList.add("lotsa-text"),
        (this.screenOccupiedValue = !0),
        setTimeout(this.textCountdown.bind(this), 1e3);
    }
    randomOverlay(a) {
      let t = document.getElementById(a).children[0],
        e = t.querySelectorAll(".overlay:not(.overlaid)");
      if (e.length > 0) {
        let i = Math.floor(Math.random() * e.length),
          n = e[i];
        n.classList.add("overlaid");
        let o = document.createElement("div");
        o.classList.add(
          "absolute",
          "top-0",
          "right-0",
          "left-0",
          "bottom-0",
          "opacity-0",
          "pointer-events-none",
          "z-30",
          "animate-overlay",
          "origin-center"
        ),
          o.appendChild(n),
          document.getElementById("desk_form").appendChild(o),
          this.sfx.pop.play();
      } else "alloverlays" in t.dataset && this.showText(t.dataset.alloverlays);
    }
    showText(a) {
      (this.screenTextTarget.innerHTML = a),
        this.screenTextTarget.classList.add("!opacity-100"),
        this.screenOverlayTarget.classList.add("!opacity-100"),
        this.screenStaticTarget.classList.add("!opacity-100"),
        (this.textVisibleForSeconds = Math.ceil(a.length / 5)),
        this.screenTextTarget.classList.remove("lotsa-text"),
        a.length > 35 && this.screenTextTarget.classList.add("lotsa-text"),
        (this.screenOccupiedValue = !0),
        setTimeout(this.textCountdown.bind(this), 1e3);
    }
    textCountdown() {
      this.textVisibleForSeconds > 0 && (this.textVisibleForSeconds -= 1),
        this.textVisibleForSeconds > 0
          ? setTimeout(this.textCountdown.bind(this), 1e3)
          : this.videoPlayingValue || this.resetScreen();
    }
    inputUpdate(a) {
      a.target.value.length > 0
        ? this.clearButtonTarget.classList.add("active")
        : this.clearButtonTarget.classList.remove("active");
    }
    clearForm() {
      (this.fieldTarget.value = ""),
        this.fieldTarget.focus(),
        this.clearButtonTarget.classList.remove("active");
    }
    replaceSources(a) {
      let t = [];
      a.includes(",")
        ? (t = a.split(";"))
        : (t = document
            .getElementById(a)
            .children[0].dataset.replacements.split(";"));
      for (let e of t) {
        let i = e.split(","),
          n = i[0],
          o = i[1];
        if (n.includes("sfx_"))
          this.sfx[n.replace("sfx_", "")].unload(),
            (this.sfx[n.replace("sfx_", "")] = new L.Howl({
              src: [o],
              loop: !0,
            }));
        else {
          let l = document.getElementById(n),
            c = l.children[0];
          c.src != o &&
            (n.includes("desk") &&
              (this.startScreenTarget.classList.remove("opacity-0"),
              this.startScreenTarget.play(),
              this.shadowTarget.classList.remove("!shadow-darken")),
            n == "desk1" && (this.loaded1Value = !1),
            n == "desk2" && (this.loaded2Value = !1),
            (c.src = o),
            l.load());
        }
      }
    }
  };
  se(vt, "targets", [
    "button",
    "field",
    "clearButton",
    "buttonOverlay",
    "badOverlay",
    "screenOverlay",
    "screenText",
    "screen",
    "screenStatic",
    "screenSource",
    "startScreen",
    "video1",
    "video2",
    "shadow",
    "volume",
    "volumeSlider",
    "muteButton",
    "loader",
    "title",
  ]),
    se(vt, "values", {
      volume: { type: Number, default: 0.25 },
      muted: { type: Boolean, default: !1 },
      bgmPlaying: { type: String, default: "" },
      audioPlaying: { type: String, default: "" },
      staticPlaying: { type: String, default: "" },
      videoPlaying: { type: String, default: "" },
      loaded1: { type: Boolean, default: !1 },
      loaded2: { type: Boolean, default: !1 },
      waiting: { type: Boolean, default: !1 },
      ready: { type: Boolean, default: !1 },
      begun: { type: Boolean, default: !1 },
      screenLoops: { type: Number, default: 0 },
      textVisibleForSeconds: { type: Number, default: 0 },
      screenOccupied: { type: Boolean, default: !1 },
    });
  var Qs = {
      "./controllers/content_controller.js": $e,
      "./controllers/flip_controller.js": ti,
      "./controllers/secrets_controller.js": ei,
    },
    en = Qs;
  window.Stimulus = kt.start();
  Object.entries(en).forEach(([a, t]) => {
    if (a.includes("_controller.") || a.includes("-controller.")) {
      let e = a
        .replace("./controllers/", "")
        .replace(/[_-]controller\..*$/, "")
        .replace(/_/g, "-")
        .replace(/\//g, "--");
      Stimulus.register(e, t.default);
    }
  });
})();
/*! Bundled license information:

howler/dist/howler.js:
  (*!
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
  (*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
*/
