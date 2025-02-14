/* eslint-disable react/no-find-dom-node */
(window.webpackJsonp = window.webpackJsonp || []).push([
  ["chart-bottom-toolbar"],
  {
    "+GaQ": function (e, t, n) {
      "use strict";
      function i(e) {
        return e.map ? a.Children.toArray(e.children).map(e.map) : e.children;
      }
      var a;
      n.d(t, "a", function () {
        return i;
      }),
        (a = n("q1tI"));
    },
    "2mG+": function (e, t, n) {
      e.exports = { button: "button-37qwTsBL-" };
    },
    "5o6O": function (e, t, n) {
      e.exports = {
        tabs: "tabs-1LGqoVz6-",
        tab: "tab-1Yr0rq0J-",
        noBorder: "noBorder-oc3HwerO-",
        disabled: "disabled-s8cEYElA-",
        active: "active-37sipdzm-",
        defaultCursor: "defaultCursor-Np9BHjTg-",
        slider: "slider-1-X4lOmE-",
        content: "content-2asssfGq-",
      };
    },
    ApAi: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"><path fill="none" stroke="currentColor" d="M11 1.5h3.5a2 2 0 0 1 2 2V7m0 5v2.5a2 2 0 0 1-2 2H11m-4 0H3.5a2 2 0 0 1-2-2V11m0-4V3.5a2 2 0 0 1 2-2H7"/></svg>';
    },
    J3OW: function (e, t, n) {
      e.exports = { button: "button-1VVj8kLG-" };
    },
    K3s3: function (e, t, n) {
      "use strict";
      function i(e) {
        var t,
          n = s(
            e.className,
            c.tab,
            (((t = {})[c.active] = e.isActive),
            (t[c.disabled] = e.isDisabled),
            (t[c.defaultCursor] = !!e.shouldUseDefaultCursor),
            (t[c.noBorder] = !!e.noBorder),
            t)
          );
        return r.createElement("div", { className: n, onClick: e.onClick, ref: e.reference }, e.children);
      }
      function a(e) {
        return (function (t) {
          function n() {
            var e = (null !== t && t.apply(this, arguments)) || this;
            return (e.activeTab = { current: null }), e;
          }
          return (
            o.__extends(n, t),
            (n.prototype.componentDidUpdate = function () {
              var e = Object(l.ensureNotNull)(this._slider),
                t = e.style;
              (t.transition = "transform 350ms"), this._componentDidUpdate();
            }),
            (n.prototype.componentDidMount = function () {
              this._componentDidUpdate();
            }),
            (n.prototype.render = function () {
              var t = this,
                n = this.props.className,
                i = this._generateTabs();
              return r.createElement(
                "div",
                { className: s(n, c.tabs) },
                i,
                r.createElement(e, {
                  reference: function (e) {
                    t._slider = e;
                  },
                })
              );
            }),
            (n.prototype._generateTabs = function () {
              var e = this;
              return (
                (this.activeTab.current = null),
                r.Children.map(this.props.children, function (t) {
                  var n = t,
                    i = Boolean(n.props.isActive),
                    a = {
                      reference: function (t) {
                        i && (e.activeTab.current = t), n.props.reference && n.props.reference(t);
                      },
                    };
                  return r.cloneElement(n, a);
                })
              );
            }),
            (n.prototype._componentDidUpdate = function () {
              var e,
                t,
                n = Object(l.ensureNotNull)(this._slider),
                i = n.style;
              this.activeTab.current
                ? ((e = this.activeTab.current.offsetWidth),
                  (t = this.activeTab.current.offsetLeft),
                  (i.transform = "translateX(" + t + "px)"),
                  (i.width = e + "px"),
                  (i.opacity = "1"))
                : (i.opacity = "0");
            }),
            n
          );
        })(r.PureComponent);
      }
      var o, r, s, l, c, u;
      n.d(t, "a", function () {
        return u;
      }),
        n.d(t, "b", function () {
          return i;
        }),
        n.d(t, "c", function () {
          return a;
        }),
        (o = n("mrSG")),
        (r = n("q1tI")),
        (s = n("TSYQ")),
        (l = n("Eyy1")),
        (c = n("5o6O")),
        (u = c),
        a(function (e) {
          return r.createElement("div", { className: c.slider, ref: e.reference });
        });
    },
    MfqI: function (e, t, n) {
      "use strict";
      function i(e) {
        var t;
        return (
          ((t = (function (t) {
            function n(e, n) {
              var i,
                a = t.call(this, e, n) || this;
              return (
                (a._handleUpdate = function (e) {
                  a.setState(e);
                }),
                (a._handleSelectRange = function (e) {
                  a._binding.selectRange(e);
                }),
                S.has(n.chartWidget) || S.set(n.chartWidget, new E(n)),
                (i = a._binding = Object(v.ensureDefined)(S.get(n.chartWidget))),
                (a.state = i.state()),
                a
              );
            }
            return (
              u.__extends(n, t),
              (n.prototype.componentDidMount = function () {
                this._binding.onChange().subscribe(this, this._handleUpdate);
              }),
              (n.prototype.componentWillUnmount = function () {
                this._binding.onChange().unsubscribe(this, this._handleUpdate);
              }),
              (n.prototype.render = function () {
                return l.createElement(e, {
                  goToDateButton: this.props.goToDateButton,
                  className: this.props.className,
                  ranges: this.state.ranges,
                  activeRange: this.state.activeRange,
                  onSelectRange: this._handleSelectRange,
                });
              }),
              n
            );
          })(l.PureComponent)).contextTypes = { availableTimeFrames: d.any.isRequired, chartWidget: d.any.isRequired }),
          t
        );
      }
      function a(e) {
        var t,
          n = h(M.item, (((t = {})[M.isActive] = e.isActive), (t[M.isFirst] = e.isFirst), (t[M.isLast] = e.isLast), t));
        return l.createElement("div", { className: n, onClick: e.onClick, ref: e.reference }, e.children);
      }
      function o(e) {
        var t = e.reference,
          n = e.className,
          i = e.children,
          a = u.__rest(e, ["reference", "className", "children"]);
        return l.createElement(
          "button",
          u.__assign({}, a, { className: h(n, H.button), ref: t }),
          l.createElement("span", { className: H.inner }, i)
        );
      }
      function r(e) {
        return l.createElement("span", { className: h($.separator, e.className) });
      }
      function s(e) {
        0;
      }
      var l,
        c,
        u,
        d,
        h,
        p,
        m,
        g,
        f,
        _,
        b,
        v,
        C,
        y,
        S,
        E,
        x,
        R,
        W,
        w,
        N,
        A,
        T,
        M,
        k,
        B,
        D,
        z,
        F,
        P,
        j,
        I,
        L,
        O,
        q,
        U,
        H,
        G,
        V,
        Z,
        K,
        Q,
        Y,
        J,
        X,
        $,
        ee,
        te,
        ne,
        ie,
        ae,
        oe,
        re,
        se,
        le,
        ce,
        ue,
        de,
        he,
        pe,
        me,
        ge,
        fe,
        _e,
        be,
        ve,
        Ce,
        ye,
        Se,
        Ee,
        xe;
      n.r(t),
        (l = n("q1tI")),
        (c = n("i8i4")),
        (u = n("mrSG")),
        (d = n("17x9")),
        n("YFKU"),
        (h = n("TSYQ")),
        (p = n("XmVn")),
        (m = n("Kxc7")),
        (g = n("82wv")),
        (f = n("Iksw")),
        (_ = n("N5tr")),
        (b = n("dfhE")),
        (v = n("Eyy1")),
        (C = n("aIyQ")),
        (y = n.n(C)),
        (S = new WeakMap()),
        (E = (function () {
          function e(e) {
            var t,
              n = this;
            (this._state = { ranges: [] }),
              (this._change = new y.a()),
              (t = (this._context = e).chartWidget).withModel(null, function () {
                var e = t.model(),
                  i = e.mainSeries();
                i.onStatusChanged().subscribe(n, n._updateAvailableRanges),
                  m.enabled("update_timeframes_set_on_symbol_resolve") &&
                    i.dataEvents().symbolResolved().subscribe(n, n._updateAvailableRanges),
                  i.priceScale().properties().lockScale.subscribe(n, n._updateAvailableRanges),
                  i.onIntervalChanged().subscribe(n, n._onRangeChanged),
                  e.model().onResetScales().subscribe(n, n._resetActiveInterval),
                  i.dataEvents().symbolResolved().subscribe(n, n._resetActiveInterval),
                  i.properties().extendedHours.subscribe(n, n._resetActiveInterval),
                  n._updateAvailableRanges();
              }),
              t.onScroll().subscribe(this, this._resetActiveInterval);
          }
          return (
            (e.prototype.state = function () {
              return this._state;
            }),
            (e.prototype.onChange = function () {
              return this._change;
            }),
            (e.prototype.selectRange = function (e) {
              var t, n;
              this._setState({ activeRange: e.value }),
                (t = this._context.chartWidget),
                (n = { val: e.value, res: e.targetResolution }),
                t.loadRange(n);
            }),
            (e.prototype.destroy = function () {
              var e = this,
                t = this._context.chartWidget;
              t.withModel(null, function () {
                var n = t.model(),
                  i = n.mainSeries();
                i.onStatusChanged().unsubscribe(e, e._updateAvailableRanges),
                  m.enabled("update_timeframes_set_on_symbol_resolve") &&
                    i.dataEvents().symbolResolved().unsubscribe(e, e._updateAvailableRanges),
                  i.priceScale().properties().lockScale.unsubscribe(e, e._updateAvailableRanges),
                  i.onIntervalChanged().unsubscribe(e, e._onRangeChanged),
                  n.model().onResetScales().unsubscribe(e, e._resetActiveInterval),
                  i.dataEvents().symbolResolved().unsubscribe(e, e._resetActiveInterval),
                  i.properties().extendedHours.unsubscribe(e, e._resetActiveInterval);
              }),
                t.onScroll().unsubscribe(this, this._resetActiveInterval),
                this._change.destroy();
            }),
            (e.prototype._setState = function (e) {
              (this._state = Object.assign({}, this._state, e)), this._change.fire(this._state);
            }),
            (e.prototype._onRangeChanged = function (e, t) {
              this._setState({ activeRange: t.timeframe });
            }),
            (e.prototype._resetActiveInterval = function () {
              this._setState({ activeRange: void 0 });
            }),
            (e.prototype._updateAvailableRanges = function () {
              var e,
                t,
                n,
                i = this._context,
                a = i.availableTimeFrames,
                o = i.chartWidget;
              o.model() &&
                (t = (e = o.model().mainSeries()).status()) !== b.STATUS_LOADING &&
                t !== b.STATUS_RESOLVING &&
                0 !== (n = a(e.symbolInfo(), e.status())).length &&
                this._setState({ ranges: n });
            }),
            e
          );
        })()),
        (x = n("KKsp")),
        (R = n("cdbK")),
        (W = n("J3OW")),
        (w = { title: window.t("Date Range"), goToDate: window.t("Go to...") }),
        (N = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._handleGoToDateClick = function () {
                var e = t.context.chartWidget;
                Object(R.showGoToDateDialog)(e.model());
              }),
              (t._handleRangeSelect = function (e) {
                e && t.props.onSelectRange && t.props.onSelectRange(e);
              }),
              t
            );
          }
          return (
            u.__extends(t, e),
            (t.prototype.render = function () {
              var e = this,
                t = this.props,
                n = t.ranges,
                i = t.activeRange,
                a = t.goToDateButton;
              return l.createElement(
                g.a,
                {
                  className: W.button,
                  content: w.title,
                  arrow: !0,
                  verticalAttachEdge: f.a.Top,
                  verticalDropDirection: f.b.FromBottomToTop,
                  horizontalMargin: 4,
                },
                n.map(function (t) {
                  return l.createElement(_.a, {
                    key: t.value,
                    label: t.description || t.text,
                    isActive: i === t.value,
                    onClick: e._handleRangeSelect,
                    onClickArg: t,
                  });
                }),
                a && l.createElement(x.a, null),
                a && l.createElement(_.a, { label: w.goToDate, onClick: this._handleGoToDateClick })
              );
            }),
            (t.contextTypes = { chartWidget: d.any.isRequired }),
            t
          );
        })(l.PureComponent)),
        (A = i(N)),
        (T = n("K3s3")),
        (M = n("W9Y+")),
        (k = n("nPPD")),
        (B = n("RZ2Z")),
        (D = Object(k.a)(T.a, B)),
        (z = n("qSb5")),
        (F = Object(T.c)(function (e) {
          return l.createElement(
            "div",
            { className: D.slider, ref: e.reference },
            l.createElement("div", { className: D.inner })
          );
        })),
        (P = i(function (e) {
          var t = e.className,
            n = e.ranges,
            i = e.activeRange,
            o = e.onSelectRange;
          return l.createElement(
            F,
            { className: h(z.sliderRow, t) },
            n.map(function (e, t) {
              return l.createElement(
                a,
                {
                  key: e.value,
                  isFirst: 0 === t,
                  isLast: t === n.length - 1,
                  isActive: i === e.value,
                  onClick: o && o.bind(null, e),
                },
                l.createElement("div", { title: e.description || e.text, className: "apply-common-tooltip" }, e.text)
              );
            })
          );
        })),
        (j = n("ei7k")),
        (I = n("c7H2")),
        (L = { title: window.t("Go to...") }),
        (O = Object(j.b)({ keys: ["Alt", "G"], text: "{0} + {1}" })),
        (q = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._handleClick = function () {
                var e = t.context.chartWidget;
                Object(R.showGoToDateDialog)(e.model());
              }),
              t
            );
          }
          return (
            u.__extends(t, e),
            (t.prototype.render = function () {
              var e = this.props,
                t = e.className;
              return (
                e.ranges.length > 0 &&
                l.createElement(
                  "div",
                  {
                    className: h("apply-common-tooltip", I.button, t),
                    "data-tooltip-hotkey": O,
                    onClick: this._handleClick,
                  },
                  L.title
                )
              );
            }),
            (t.contextTypes = { chartWidget: d.any.isRequired }),
            t
          );
        })(l.PureComponent)),
        (U = i(q)),
        (H = n("URQ3")),
        (G = n("U/gD")),
        (V = n("4kQX")),
        (Z = n("7KDR")),
        (K = n("5VQP")),
        (Q = (function (e) {
          function t(t) {
            var n = e.call(this, t) || this;
            return (
              (n._element = null),
              (n._menu = null),
              (n._handleRef = function (e) {
                n._element = e;
              }),
              (n._showMenu = function () {
                var e, t, i, a;
                if (n._menu && n._menu.isShown()) return n._menu.hide(), void n._menu.destroy();
                (t = (e = n.props).getActions),
                  (i = e.right),
                  (a = Object(v.ensureNotNull)(n._element)),
                  K.ContextMenuManager.createMenu(t()).then(function (e) {
                    (n._menu = e),
                      e.show(function (e, t) {
                        var n = a.getBoundingClientRect();
                        return {
                          clientX: i ? n.right - e : n.left,
                          clientY: n.top - Math.min(t, n.top),
                          overrideHeight: n.top < t ? n.top : void 0,
                        };
                      }, n._element || void 0);
                  });
              }),
              n
            );
          }
          return (
            u.__extends(t, e),
            (t.prototype.render = function () {
              var e = this.props.children;
              return l.createElement("span", { onClick: this._showMenu, ref: this._handleRef }, e);
            }),
            t
          );
        })(l.PureComponent)),
        (Y = n("2mG+")),
        (J = { hint: window.t("Timezone") }),
        (X = (function (e) {
          function t(t, n) {
            var i = e.call(this, t, n) || this;
            return (
              (i._timeFormatter = new V.TimeFormatter()),
              (i._tickInterval = void 0),
              (i._tickClock = function () {
                var e,
                  t,
                  n = i.context.chartApiInstance,
                  a = i._timezoneOffset;
                void 0 !== a &&
                  ((e = 1e3 * n.serverTimeOffset()),
                  (t = new Date(Date.now() + a + e)),
                  i.setState({ time: i._timeFormatter.format(t) }));
              }),
              (i._getActions = function () {
                return (function (e) {
                  e.updateActions();
                  var t = e.actions();
                  return t && t.applyTimeZone instanceof Z.Action ? t.applyTimeZone.getSubItems() : [];
                })(i.context.chartWidget);
              }),
              (i.state = { time: "", timezone: "" }),
              i
            );
          }
          return (
            u.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              var e = this,
                t = this.context.chartWidget;
              this.props.withMenu;
              (this._tickInterval = setInterval(this._tickClock, 1e3)),
                t.withModel(null, function () {
                  var n = t.model();
                  n.model().mainSeries().dataEvents().symbolResolved().subscribe(e, e.updateTimezonesButton),
                    n.model().properties().timezone.subscribe(e, e.updateTimezonesButton);
                });
            }),
            (t.prototype.componentWillUnmount = function () {
              var e = this,
                t = this.context.chartWidget;
              clearInterval(this._tickInterval),
                t.withModel(null, function () {
                  var n = t.model();
                  n.model().mainSeries().dataEvents().symbolResolved().unsubscribe(e, e.updateTimezonesButton),
                    n.model().properties().timezone.unsubscribe(e, e.updateTimezonesButton);
                });
            }),
            (t.prototype.render = function () {
              var e = this.props,
                t = e.className,
                n = e.isDisabled,
                i = this.state,
                a = i.time,
                r = i.timezone;
              return l.createElement(
                Q,
                { getActions: this._getActions },
                l.createElement(
                  o,
                  { className: h(t, Y.button, "apply-common-tooltip"), title: J.hint, disabled: n },
                  a && r && a + " (" + r + ")"
                )
              );
            }),
            (t.prototype.updateTimezonesButton = function () {
              var e,
                t,
                n,
                i = this.context.chartWidget;
              i.model() &&
                null !== i.model().mainSeries().symbolInfo() &&
                ("exchange" === (e = i.model().model().timezone()) &&
                  (t = Object(v.ensureNotNull)(i.model().mainSeries().symbolInfo()).timezone) &&
                  (e = t),
                (n = Object(G.a)(e)),
                (this._timezoneOffset = n.offset),
                this.setState({ timezone: n.string }),
                this._tickClock());
            }),
            (t.contextTypes = { chartWidget: d.any.isRequired, chartApiInstance: d.any.isRequired }),
            t
          );
        })(l.PureComponent)),
        ($ = n("z6ID")),
        (ee = n("tU7i")),
        (te = n("+GaQ")),
        (ne = n("XAms")),
        (ie = n("T4/F")),
        (ae = n("ApAi")),
        (oe = n("PP+v")),
        (ce = {
          extLabel: window.t("ext"),
          extHint: window.t("Extended Hours is available only for intraday charts"),
          percentageHint: window.t("Toggle Percentage"),
          logLabel: window.t("log", { context: "scale" }),
          logHint: window.t("Toggle Log Scale"),
          autoLabel: window.t("auto", { context: "scale" }),
          autoHint: window.t("Toggle Auto Scale"),
          fullscreenHint: window.t("Toggle Maximize Chart"),
          adjLabel: window.t("adj", { context: "adjustments" }),
          adjHint: window.t("Adjust data for dividends"),
          adjForDividendsOnlyHint: window.t("Data is adjusted for dividends only"),
          adjForSplitsOnlyHint: window.t("Data is adjusted for splits only"),
        }),
        ce.adjForDividendsOnlyHint,
        ce.adjForSplitsOnlyHint,
        (Se = function (e) {
          return l.createElement(ee.a, {
            text: ce.logLabel,
            title: ce.logHint,
            className: e.className,
            isActive: e.isLogarithm,
            isGrouped: !0,
            onClick: e.onClick,
          });
        }),
        ((Ee = (function (e) {
          function t(t, n) {
            var i = e.call(this, t, n) || this;
            return (
              (i._priceScale = null),
              (i._handleSelect = function () {
                var e = i.context.chartWidget,
                  t = e.model(),
                  n = Object(v.ensureNotNull)(i.state.series),
                  a = n.priceScale(),
                  o = a.mode();
                n.priceScale().isLockScale() || t.setPriceScaleMode({ log: !o.log }, a, window.t("Toggle Log Scale"));
              }),
              (i.state = { isActive: !1, series: null }),
              i
            );
          }
          return (
            u.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              var e = this,
                t = this.context.chartWidget;
              t.withModel(null, function () {
                var n = t.model().mainSeries(),
                  i = n.priceScale();
                e._handleMainSeriesPriceScaleChanged(i),
                  n.priceScaleChanged().subscribe(e, e._handleMainSeriesPriceScaleChanged),
                  e._handleModeChanged({}, i.mode()),
                  e.setState({ isActive: n.priceScale().isLog(), series: n });
              });
            }),
            (t.prototype.componentWillUnmount = function () {
              var e = this,
                t = this.context.chartWidget;
              t.withModel(null, function () {
                t.model().mainSeries().priceScaleChanged().unsubscribe(e, e._handleMainSeriesPriceScaleChanged);
              }),
                null !== this._priceScale &&
                  (this._priceScale.modeChanged().unsubscribeAll(this), (this._priceScale = null));
            }),
            (t.prototype.render = function () {
              var e = this.props.className,
                t = this.state,
                n = t.isActive,
                i = t.series;
              return l.createElement(Se, {
                className: e,
                isLogarithm: n,
                isDisabled: null === i,
                onClick: this._handleSelect,
              });
            }),
            (t.prototype._handleMainSeriesPriceScaleChanged = function (e) {
              var t = {};
              null !== this._priceScale &&
                ((t = this._priceScale.mode()),
                this._priceScale.modeChanged().unsubscribe(this, this._handleModeChanged)),
                (this._priceScale = e),
                this._priceScale.modeChanged().subscribe(this, this._handleModeChanged),
                this._handleModeChanged(t, e.mode());
            }),
            (t.prototype._handleModeChanged = function (e, t) {
              e.log !== t.log && this.setState({ isActive: t.log });
            }),
            t
          );
        })(l.PureComponent)).contextTypes = { chartWidget: d.any.isRequired }),
        (ue = Ee),
        (de = (function (e) {
          var t;
          return (
            ((t = (function (t) {
              function n(e, n) {
                var i = t.call(this, e, n) || this;
                return (
                  (i._priceScale = null),
                  (i._handleSelect = function () {
                    var e = i.context.chartWidget,
                      t = e.model(),
                      n = Object(v.ensureNotNull)(i.state.series),
                      a = n.priceScale(),
                      o = a.mode();
                    t.setPriceScaleMode({ autoScale: !o.autoScale }, a, window.t("Toggle Auto Scale"));
                  }),
                  (i.state = { isActive: !1, series: null }),
                  i
                );
              }
              return (
                u.__extends(n, t),
                (n.prototype.componentDidMount = function () {
                  var e = this,
                    t = this.context.chartWidget;
                  t.withModel(null, function () {
                    var n = t.model().mainSeries(),
                      i = n.priceScale();
                    e._handleMainSeriesPriceScaleChanged(i),
                      n.priceScaleChanged().subscribe(e, e._handleMainSeriesPriceScaleChanged),
                      e._handleModeChanged({}, i.mode()),
                      e.setState({ isActive: n.priceScale().isAutoScale(), series: n });
                  });
                }),
                (n.prototype.componentWillUnmount = function () {
                  var e = this,
                    t = this.context.chartWidget;
                  t.withModel(null, function () {
                    t.model().mainSeries().priceScaleChanged().unsubscribe(e, e._handleMainSeriesPriceScaleChanged);
                  }),
                    null !== this._priceScale &&
                      (this._priceScale.modeChanged().unsubscribeAll(this), (this._priceScale = null));
                }),
                (n.prototype.render = function () {
                  var t = this.props.className,
                    n = this.state,
                    i = n.isActive,
                    a = n.series;
                  return l.createElement(e, {
                    className: t,
                    isAuto: i,
                    isDisabled: null === a,
                    onClick: this._handleSelect,
                  });
                }),
                (n.prototype._handleMainSeriesPriceScaleChanged = function (e) {
                  var t = {};
                  null !== this._priceScale &&
                    ((t = this._priceScale.mode()),
                    this._priceScale.modeChanged().unsubscribe(this, this._handleModeChanged)),
                    (this._priceScale = e),
                    this._priceScale.modeChanged().subscribe(this, this._handleModeChanged),
                    this._handleModeChanged(t, e.mode());
                }),
                (n.prototype._handleModeChanged = function (e, t) {
                  e.autoScale !== t.autoScale && this.setState({ isActive: t.autoScale });
                }),
                n
              );
            })(l.PureComponent)).contextTypes = { chartWidget: d.any.isRequired }),
            t
          );
        })(function (e) {
          return l.createElement(ee.a, {
            text: ce.autoLabel,
            title: ce.autoHint,
            className: e.className,
            isActive: e.isAuto,
            isGrouped: !0,
            onClick: e.onClick,
          });
        })),
        (he = (function (e) {
          var t;
          return (
            ((t = (function (t) {
              function n(e, n) {
                var i = t.call(this, e, n) || this;
                return (
                  (i._priceScale = null),
                  (i._handleSelect = function () {
                    var e = i.context.chartWidget,
                      t = e.model(),
                      n = Object(v.ensureNotNull)(i.state.series),
                      a = n.priceScale(),
                      o = a.mode();
                    n.priceScale().isLockScale() ||
                      t.setPriceScaleMode({ percentage: !o.percentage }, a, window.t("Toggle Percentage Scale"));
                  }),
                  (i.state = { isActive: !1, series: null }),
                  i
                );
              }
              return (
                u.__extends(n, t),
                (n.prototype.componentDidMount = function () {
                  var e = this,
                    t = this.context.chartWidget;
                  t.withModel(null, function () {
                    var n = t.model().mainSeries(),
                      i = n.priceScale();
                    e._handleMainSeriesPriceScaleChanged(i),
                      n.priceScaleChanged().subscribe(e, e._handleMainSeriesPriceScaleChanged),
                      e._handleScaleChange({}, i.mode()),
                      e.setState({ isActive: n.priceScale().isPercentage(), series: n });
                  });
                }),
                (n.prototype.componentWillUnmount = function () {
                  var e = this,
                    t = this.context.chartWidget;
                  t.withModel(null, function () {
                    t.model().mainSeries().priceScaleChanged().unsubscribe(e, e._handleMainSeriesPriceScaleChanged);
                  }),
                    null !== this._priceScale &&
                      (this._priceScale.modeChanged().unsubscribeAll(this), (this._priceScale = null));
                }),
                (n.prototype.render = function () {
                  var t = this.props.className,
                    n = this.state,
                    i = n.isActive,
                    a = n.series;
                  return l.createElement(e, {
                    className: t,
                    isPercentage: i,
                    isDisabled: null === a,
                    onClick: this._handleSelect,
                  });
                }),
                (n.prototype._handleMainSeriesPriceScaleChanged = function (e) {
                  var t = {};
                  null !== this._priceScale &&
                    ((t = this._priceScale.mode()),
                    this._priceScale.modeChanged().unsubscribe(this, this._handleScaleChange)),
                    (this._priceScale = e),
                    this._priceScale.modeChanged().subscribe(this, this._handleScaleChange),
                    this._handleScaleChange(t, e.mode());
                }),
                (n.prototype._handleScaleChange = function (e, t) {
                  e.percentage !== t.percentage && this.setState({ isActive: t.percentage });
                }),
                n
              );
            })(l.PureComponent)).contextTypes = { chartWidget: d.any.isRequired }),
            t
          );
        })(function (e) {
          return l.createElement(ee.a, {
            icon: ie,
            title: ce.percentageHint,
            className: e.className,
            isActive: e.isPercentage,
            isDisabled: e.isDisabled,
            isGrouped: !0,
            onClick: e.onClick,
          });
        })),
        (pe = Object(j.b)({
          keys: ["Alt", "Enter"],
          text: "{0} + {1}",
        })),
        (me = (function (e) {
          var t;
          return (
            ((t = (function (t) {
              function n(e, n) {
                var i,
                  a = t.call(this, e, n) || this;
                return (
                  (a._handleClick = function (e) {
                    var t = a.context,
                      n = t.resizerDetacher;
                    t.chartWidgetCollection,
                      e.shiftKey && n.detachable.value()
                        ? n.detach()
                        : a.state.isFullscreen
                        ? n.exitFullscreen()
                        : n.requestFullscreen();
                  }),
                  (a._handleLayoutChange = function (e) {
                    a.setState({ isFullscreen: e });
                  }),
                  (a._handlePhoneSize = function () {}),
                  (i = n.resizerDetacher),
                  (a.state = { isFullscreen: i.fullscreen.value(), isChangeLayoutButton: a._isChangeLayoutButton() }),
                  a
                );
              }
              return (
                u.__extends(n, t),
                (n.prototype.componentDidMount = function () {
                  var e = this.context,
                    t = e.resizerDetacher;
                  e.chartWidgetCollection,
                    this.props.mobileChangeLayoutEnabled,
                    t.fullscreen.subscribe(this._handleLayoutChange);
                }),
                (n.prototype.componentWillUnmount = function () {
                  var e = this.context,
                    t = e.resizerDetacher;
                  e.chartWidgetCollection,
                    this.props.mobileChangeLayoutEnabled,
                    t.fullscreen.unsubscribe(this._handleLayoutChange);
                }),
                (n.prototype.render = function () {
                  var t = this.props.className,
                    n = this.state,
                    i = n.isFullscreen;
                  return (
                    n.isChangeLayoutButton,
                    l.createElement(e, { className: t, isFullscreen: i, onClick: this._handleClick })
                  );
                }),
                (n.prototype._isChangeLayoutButton = function () {
                  return !1;
                }),
                n
              );
            })(l.PureComponent)).contextTypes = {
              chartWidgetCollection: d.any.isRequired,
              resizerDetacher: d.any.isRequired,
            }),
            t
          );
        })(function (e) {
          return l.createElement(ee.a, {
            icon: ae,
            title: ce.fullscreenHint,
            className: e.className,
            isActive: e.isFullscreen,
            onClick: e.onClick,
            "data-tooltip-hotkey": pe,
          });
        })),
        ((re = {}).properties = !0),
        (re.fullscreen = !0),
        (re.preventPhoneLayout = !0),
        (ge = re),
        ((se = {}).fullscreen = Number.MIN_SAFE_INTEGER),
        (se.preventPhoneLayout = Number.MIN_SAFE_INTEGER),
        (se.properties = Number.MIN_SAFE_INTEGER),
        (se.timeZones = -1),
        (se.auto = 0),
        (se.logarithm = 1),
        (se.percentage = 2),
        (se.ext = 3),
        (se.adj = 4),
        (fe = se),
        (xe = new Map()).set(ue, "logarithm"),
        xe.set(he, "percentage"),
        xe.set(de, "auto"),
        xe.set(me, "fullscreen"),
        (_e = xe),
        ((le = { dateRangeMode: "hidden" }).timeZones = !0),
        (le.fullscreen = !0),
        (le.preventPhoneLayout = !0),
        (le.properties = !0),
        (le.auto = !0),
        (le.logarithm = !0),
        (le.percentage = !0),
        (le.ext = !0),
        (le.adj = !0),
        (be = le),
        (ve = (function (e) {
          function t(t, n) {
            var i,
              a,
              o,
              r = e.call(this, t, n) || this;
            return (
              (r._timezoneButtonRef = null),
              (r._layout = Object.assign({}, be)),
              (r._raf = null),
              (r._toolbar = null),
              (r._rangeExpanded = null),
              (r._rangeCollapsed = null),
              (r._seriesComponents = {}),
              (r._injector =
                ((a = function () {
                  return r._layout;
                }),
                (o = function (e, t) {
                  return (r._seriesComponents[t] = e);
                }),
                function (e, t, n) {
                  var i, r, c, u;
                  return l.isValidElement(e) && "string" != typeof e.type && "string" == typeof (i = e.props).className
                    ? ((r = { className: h(i.className, 0 === t && oe.first, t === n.length - 1 && oe.last) }),
                      (c = a()),
                      (u = Object(v.ensureDefined)(_e.get(e.type))),
                      l.createElement(
                        "div",
                        {
                          key: null === e.key ? void 0 : e.key,
                          className: h(oe.inline, c[u] && oe.collapsed),
                          ref: function (e) {
                            return o(e, u);
                          },
                          onClick: function () {
                            return s();
                          },
                        },
                        l.cloneElement(e, r)
                      ))
                    : e;
                })),
              (r._handleResize = function () {
                null === r._raf &&
                  (r._raf = requestAnimationFrame(function () {
                    var e,
                      t,
                      n,
                      i,
                      a,
                      o,
                      s,
                      l,
                      u,
                      d,
                      h,
                      p,
                      m = r._layout,
                      g = Object(v.ensureNotNull)(r._toolbar),
                      f = Object(v.ensureNotNull)(r._rangeExpanded),
                      _ =
                        ((h = r._seriesComponents),
                        (p = {}),
                        Object.keys(h).forEach(function (e) {
                          var t,
                            n = h[e];
                          null !== n && null !== (t = c.findDOMNode(n)) && (p[e] = t);
                        }),
                        (d = p),
                        Object.keys(d)
                          .map(function (e) {
                            return { name: e, width: d[e].offsetWidth };
                          })
                          .sort(function (e, t) {
                            return fe[e.name] - fe[t.name];
                          })),
                      b = g.offsetWidth,
                      C = _.reduce(function (e, t) {
                        return e + t.width;
                      }, 0),
                      y = f.offsetWidth,
                      S = Boolean(f.textContent),
                      E = b - C - y <= 0,
                      x = !S || E ? "collapsed" : "expanded";
                    if ((Object.assign(m, { dateRangeMode: x }), "expanded" !== x)) {
                      for (
                        i = b - Object(v.ensureNotNull)(r._rangeCollapsed).offsetWidth - 0, a = 0, o = 0, s = 0, l = _;
                        s < l.length;
                        s++
                      )
                        (a += (u = l[s]).width),
                          u.name in ge
                            ? ((o += u.width), Object.assign(m, (((e = {})[u.name] = !1), e)))
                            : Object.assign(m, (((t = {})[u.name] = i <= a), t));
                      i <= o && Object.assign(m, { dateRangeMode: "hidden" });
                    } else Object.assign(m, (((n = {}).timeZones = !1), (n.fullscreen = !1), (n.preventPhoneLayout = !1), (n.properties = !1), (n.auto = !1), (n.logarithm = !1), (n.percentage = !1), (n.ext = !1), (n.adj = !1), n));
                    r._applyResizing(), (r._raf = null);
                  }));
              }),
              (r._handleTimezoneButtonRef = function (e) {
                r._timezoneButtonRef = e;
              }),
              (r._handleMeasure = function () {
                null !== r._toolbar && r.resizeUI();
              }),
              (r._handleFullscreenableChange = function (e) {
                r._setStateWithResize({ isFullscreenable: e });
              }),
              (r._handlePreventPhoneLayoutButtonVisibility = function () {
                0;
              }),
              (r._handleToolbarRef = function (e) {
                return (r._toolbar = e);
              }),
              (r._handleRangeCollapsedRef = function (e) {
                return (r._rangeCollapsed = e);
              }),
              (r._handleRangeExpandedRef = function (e) {
                return (r._rangeExpanded = e);
              }),
              (r._handleTimeZonesRef = function (e) {
                r._seriesComponents.timeZones = e;
              }),
              (i = r.context.resizerDetacher),
              (r.state = {
                isFullscreenable: i.fullscreenable.value(),
                isPreventPhoneLayoutButton: r._isPreventPhoneLayoutButton(),
              }),
              r
            );
          }
          return (
            u.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              var e = this.context,
                t = e.onContentBoxChanged,
                n = e.resizerDetacher;
              e.chartWidgetCollection, e.chartWidget;
              t.subscribe(this, this._handleResize),
                n.fullscreenable.subscribe(this._handleFullscreenableChange),
                this.updateTimezonesButton(),
                this.resizeUI();
            }),
            (t.prototype.componentWillUnmount = function () {
              var e = this.context,
                t = e.onContentBoxChanged,
                n = e.resizerDetacher;
              e.chartWidgetCollection, e.chartWidget;
              t.unsubscribe(this, this._handleResize),
                n.fullscreenable.unsubscribe(this._handleFullscreenableChange),
                null !== this._raf && (cancelAnimationFrame(this._raf), (this._raf = null));
            }),
            (t.prototype.render = function () {
              var e = this._layout;
              return l.createElement(
                "div",
                { className: oe.toolbar, ref: this._handleToolbarRef, onContextMenu: ne.a },
                this.props.timeFramesWidgetEnabled &&
                  l.createElement(
                    te.a,
                    null,
                    l.createElement(
                      "div",
                      {
                        className: h(oe.dateRangeWrapper, "collapsed" !== e.dateRangeMode && oe.collapsed),
                        ref: this._handleRangeCollapsedRef,
                      },
                      l.createElement(
                        "div",
                        { className: h(oe.dateRangeCollapsed) },
                        l.createElement(A, { goToDateButton: this.props.goToDateEnabled })
                      )
                    ),
                    l.createElement(
                      p,
                      { onMeasure: this._handleMeasure },
                      l.createElement(
                        "div",
                        {
                          className: h(oe.dateRangeWrapper, "expanded" !== e.dateRangeMode && oe.collapsed),
                          ref: this._handleRangeExpandedRef,
                        },
                        l.createElement(
                          "div",
                          { className: h(oe.dateRangeExpanded) },
                          l.createElement(P, null),
                          this.props.goToDateEnabled && l.createElement(r, null),
                          this.props.goToDateEnabled && l.createElement(U, null)
                        )
                      )
                    )
                  ),
                l.createElement(
                  "div",
                  { className: oe.seriesControlWrapper },
                  this.props.timeWidgetEnabled &&
                    l.createElement(
                      p,
                      { onMeasure: this._handleMeasure },
                      l.createElement(
                        "div",
                        { className: h(oe.inline, e.timeZones && oe.collapsed), ref: this._handleTimeZonesRef },
                        l.createElement(
                          "div",
                          { className: oe.inline, onClick: this._trackTimezonesButtonClick },
                          l.createElement(X, {
                            className: oe.timezone,
                            withMenu: this.props.timezoneMenuEnabled,
                            ref: this._handleTimezoneButtonRef,
                          })
                        ),
                        l.createElement("div", { className: oe.inline }, l.createElement(r, null))
                      )
                    ),
                  l.createElement(
                    te.a,
                    { map: this._injector },
                    !1,
                    !1,
                    this.props.percentageScaleButtonEnabled &&
                      !m.enabled("fundamental_widget") &&
                      l.createElement(he, { className: oe.icon }),
                    this.props.logScaleButtonEnabled && l.createElement(ue, { className: oe.item }),
                    this.props.autoScaleButtonEnabled && l.createElement(de, { className: oe.item }),
                    this.props.fullscreenButtonEnabled &&
                      this.state.isFullscreenable &&
                      l.createElement(me, {
                        className: oe.icon,
                        mobileChangeLayoutEnabled: this.props.mobileChangeLayoutEnabled,
                      }),
                    !1
                  )
                )
              );
            }),
            (t.prototype.updateTimezonesButton = function () {
              null !== this._timezoneButtonRef && this._timezoneButtonRef.updateTimezonesButton();
            }),
            (t.prototype.resizeUI = function () {
              this._handleResize();
            }),
            (t.prototype._updateButtonsVisibility = function (e) {
              0;
            }),
            (t.prototype._trackTimezonesButtonClick = function () {
              s();
            }),
            (t.prototype._setStateWithResize = function (e) {
              var t = this;
              Object.assign(this._layout, be),
                this._applyResizing(),
                this.setState(e, function () {
                  return t._handleResize();
                });
            }),
            (t.prototype._applyResizing = function () {
              var e = this,
                t = this._layout,
                n = t.dateRangeMode,
                i = u.__rest(t, ["dateRangeMode"]);
              this._rangeExpanded && this._rangeExpanded.classList.toggle(oe.collapsed, "expanded" !== n),
                this._rangeCollapsed && this._rangeCollapsed.classList.toggle(oe.collapsed, "collapsed" !== n),
                Object.keys(i).forEach(function (t) {
                  var n = t,
                    a = e._seriesComponents[n];
                  a && a.classList.toggle(oe.collapsed, i[n]);
                });
            }),
            (t.prototype._isPreventPhoneLayoutButton = function () {
              return !1;
            }),
            (t.contextTypes = {
              onContentBoxChanged: d.any.isRequired,
              chartApiInstance: d.any.isRequired,
              chartWidget: d.any.isRequired,
              chartWidgetCollection: d.any.isRequired,
              resizerDetacher: d.any.isRequired,
            }),
            t
          );
        })(l.PureComponent)),
        (Ce = (function (e) {
          function t(t) {
            var n = e.call(this, t) || this;
            return (
              (n._setActiveChart = function (e) {
                n.setState({ chartWidget: e });
              }),
              (n.state = { chartWidget: t.chartWidgetCollection.activeChartWidget.value() }),
              n
            );
          }
          return (
            u.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              this.props.chartWidgetCollection.activeChartWidget.subscribe(this._setActiveChart);
            }),
            (t.prototype.componentWillUnmount = function () {
              this.props.chartWidgetCollection.activeChartWidget.unsubscribe(this._setActiveChart);
            }),
            (t.prototype.getChildContext = function () {
              var e = this.state.chartWidget,
                t = this.props,
                n = t.onContentBoxChanged,
                i = t.computeContentBox,
                a = t.chartApiInstance,
                o = t.chartWidgetCollection,
                r = t.options,
                s = r.timeFramesWidgetEnabled,
                l = r.timeFramesWidget,
                c = s ? l.availableTimeFrames : void 0;
              return {
                onContentBoxChanged: n,
                computeContentBox: i,
                chartWidget: e,
                availableTimeFrames: c,
                chartApiInstance: a,
                chartWidgetCollection: o,
                resizerDetacher: e.getResizerDetacher(),
              };
            }),
            (t.prototype.render = function () {
              var e,
                t,
                n = this.state.chartWidget;
              return n
                ? ((t = {
                    timeFramesWidgetEnabled: (e = this.props.options).timeFramesWidgetEnabled,
                    goToDateEnabled: e.timeFramesWidget.goToDateEnabled,
                    timeWidgetEnabled: e.timeWidgetEnabled,
                    timezoneMenuEnabled: e.timeWidget && e.timeWidget.timezoneMenuEnabled,
                    extendedHoursButtonEnabled: e.extendedHoursButtonEnabled,
                    adjustForDividendsButtonEnabled: e.adjustForDividendsButtonEnabled,
                    logScaleButtonEnabled: e.logScaleButtonEnabled,
                    percentageScaleButtonEnabled: e.percentageScaleButtonEnabled,
                    autoScaleButtonEnabled: e.autoScaleButtonEnabled,
                    fullscreenButtonEnabled: e.fullscreenButtonEnabled,
                    mobileChangeLayoutEnabled: e.mobileChangeLayoutEnabled,
                  }),
                  l.createElement(ve, u.__assign({ key: n.id() }, t)))
                : null;
            }),
            (t.childContextTypes = {
              onContentBoxChanged: d.any,
              computeContentBox: d.any,
              chartWidget: d.any,
              chartApiInstance: d.any,
              chartWidgetCollection: d.any,
              resizerDetacher: d.any,
              availableTimeFrames: d.any,
            }),
            t
          );
        })(l.PureComponent)),
        n.d(t, "BottomToolbarRenderer", function () {
          return ye;
        }),
        (ye = (function () {
          function e(e, t, n, i, a, o, r) {
            this._container = e;
            var s = l.createElement(Ce, {
              onContentBoxChanged: t,
              computeContentBox: n,
              chartWidgetCollection: i,
              chartApiInstance: a,
              chartWidgetOptions: o,
              options: r,
            });
            c.render(s, e), e.setAttribute("data-initialized", "true");
          }
          return (
            (e.prototype.destroy = function () {
              c.unmountComponentAtNode(this._container), this._container.removeAttribute("data-initialized");
            }),
            e
          );
        })());
    },
    "PP+v": function (e, t, n) {
      e.exports = {
        toolbar: "toolbar-2MJefnwP-",
        dateRangeWrapper: "dateRangeWrapper-yS_7EK1i-",
        seriesControlWrapper: "seriesControlWrapper-1c7dZFwu-",
        dateRangeExpanded: "dateRangeExpanded-Eh9SAOEe-",
        dateRangeCollapsed: "dateRangeCollapsed-1-pFg0M1-",
        item: "item-2cWFW_ze-",
        first: "first-1XNI05qr-",
        last: "last-2VBe7EFW-",
        inline: "inline-2rwBBIxN-",
        timezone: "timezone-34WAZb8x-",
        icon: "icon-3VRthUnU-",
        hidden: "hidden-3Tq8Bf9V-",
        collapsed: "collapsed-2lhil-Rc-",
      };
    },
    RZ2Z: function (e, t, n) {
      e.exports = { slider: "slider-1ealLtjI-", inner: "inner-3lmAEIjy-" };
    },
    "T4/F": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"><g fill="none" stroke="currentColor"><circle cx="3.5" cy="3.5" r="2"/><circle cx="10.5" cy="10.5" r="2"/><path stroke-linecap="square" d="M9.5 1.5l-5 11"/></g></svg>';
    },
    URQ3: function (e, t, n) {
      e.exports = { button: "button-88UE6omC-", hover: "hover-3_vVP91F-", inner: "inner-2FptJsfC-" };
    },
    "W9Y+": function (e, t, n) {
      e.exports = {
        item: "item-3cgIlGYO-",
        hover: "hover-2y46_KNk-",
        isActive: "isActive-2M6dwA7--",
        isFirst: "isFirst-2kfAV5tf-",
        isLast: "isLast-voJ1bqZh-",
      };
    },
    c7H2: function (e, t, n) {
      e.exports = { button: "button-2gir_Bbb-", hover: "hover-SrAyrKlT-" };
    },
    qSb5: function (e, t, n) {
      e.exports = { sliderRow: "sliderRow-Tv1W7hM5-" };
    },
    z6ID: function (e, t, n) {
      e.exports = { separator: "separator-3bp1jCsV-" };
    },
  },
]);
