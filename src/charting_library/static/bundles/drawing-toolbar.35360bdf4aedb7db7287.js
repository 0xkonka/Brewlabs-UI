/* eslint-disable react/no-find-dom-node */
(window.webpackJsonp = window.webpackJsonp || []).push([
  ["drawing-toolbar"],
  {
    "5f7t": function (e, t, o) {
      "use strict";
      function n(e) {
        var t = e.direction,
          o = e.theme,
          n = void 0 === o ? D : o;
        return u.createElement(
          "svg",
          {
            xmlns: M,
            width: "9",
            height: "27",
            viewBox: "0 0 9 27",
            className: m(n.container, "right" === t ? n.mirror : null),
            onContextMenu: L.a,
          },
          u.createElement(
            "g",
            { fill: "none", fillRule: "evenodd" },
            u.createElement("path", {
              className: n.background,
              d: "M4.5.5a4 4 0 0 1 4 4v18a4 4 0 1 1-8 0v-18a4 4 0 0 1 4-4z",
            }),
            u.createElement("path", { className: n.arrow, d: "M5.5 10l-2 3.5 2 3.5" })
          )
        );
      }
      function i(e) {
        var t,
          o = e.id,
          n = e.activeClass,
          i = e.children,
          r = e.className,
          a = e.icon,
          s = e.isActive,
          l = e.isGrayed,
          c = e.isHidden,
          d = e.isTransparent,
          p = e.theme,
          h = void 0 === p ? H : p,
          f = e.onClick,
          g = e.title,
          v = e.buttonHotKey;
        return u.createElement(
          "div",
          {
            id: o,
            className: m(
              h.button,
              r,
              s && n,
              ((t = {}),
              (t["apply-common-tooltip common-tooltip-vertical"] = Boolean(g)),
              (t[h.isActive] = s),
              (t[h.isGrayed] = l),
              (t[h.isHidden] = c),
              (t[h.isTransparent] = d),
              t)
            ),
            onClick: f,
            title: g,
            "data-tooltip-hotkey": v,
          },
          u.createElement(
            "div",
            { className: h.bg },
            a &&
              ("string" == typeof a
                ? u.createElement(B.a, { className: h.icon, icon: a })
                : u.createElement("span", { className: h.icon }, a)),
            i
          )
        );
      }
      function r(e) {
        var t = e.id,
          o = e.action,
          n = e.isActive,
          r = e.isHidden,
          a = e.isTransparent,
          s = e.toolName;
        return u.createElement(i, {
          id: t,
          icon: T.a[s].icon,
          isActive: n,
          isHidden: r,
          isTransparent: a,
          onClick: o,
          title: T.a[s].localizedName,
        });
      }
      function a() {
        Object(ne.saveDefaultProperties)(!0),
          v.properties().childs().magnet.setValue(!v.properties().childs().magnet.value()),
          Object(ne.saveDefaultProperties)(!1);
      }
      function s() {
        Object(ye.trackEvent)("GUI", "Magnet mode", "Weak"),
          Object(ne.saveDefaultProperties)(!0),
          v.properties().childs().magnetMode.setValue(we.MagnetMode.WeakMagnet),
          v.properties().childs().magnet.setValue(!0),
          Object(ne.saveDefaultProperties)(!1);
      }
      function l() {
        Object(ye.trackEvent)("GUI", "Magnet mode", "Strong"),
          Object(ne.saveDefaultProperties)(!0),
          v.properties().childs().magnetMode.setValue(we.MagnetMode.StrongMagnet),
          v.properties().childs().magnet.setValue(!0),
          Object(ne.saveDefaultProperties)(!1);
      }
      var c,
        u,
        d,
        p,
        h,
        m,
        f,
        g,
        v,
        b,
        _,
        y,
        w,
        T,
        C,
        k,
        S,
        E,
        L,
        D,
        A,
        M,
        N,
        O,
        P,
        W,
        x,
        B,
        V,
        I,
        F,
        R,
        j,
        z,
        U,
        G,
        H,
        K,
        q,
        Q,
        J,
        Y,
        X,
        Z,
        $,
        ee,
        te,
        oe,
        ne,
        ie,
        re,
        ae,
        se,
        le,
        ce,
        ue,
        de,
        pe,
        he,
        me,
        fe,
        ge,
        ve,
        be,
        _e,
        ye,
        we,
        Te,
        Ce,
        ke,
        Se,
        Ee,
        Le,
        De,
        Ae;
      o.r(t),
        (c = o("mrSG")),
        (u = o("q1tI")),
        (d = o("i8i4")),
        (p = o("Eyy1")),
        o("YFKU"),
        o("bf9a"),
        (h = o("17x9")),
        (m = o("TSYQ")),
        (f = o("Vdly")),
        (g = o("Kxc7")),
        (v = o("mMWL")),
        (b = o("FQhm")),
        (_ = o("aIyQ")),
        (y = o.n(_)),
        (w = o("qFKp")),
        (T = o("MP+M")),
        (C = (function () {
          function e(e) {
            this._drawingsAccess = e || { tools: [], type: "black" };
          }
          return (
            (e.prototype.isToolEnabled = function (e) {
              var t = this._findTool(e);
              return !(!t || !t.grayed) || ("black" === this._drawingsAccess.type ? !t : !!t);
            }),
            (e.prototype.isToolGrayed = function (e) {
              var t = this._findTool(e);
              return Boolean(t && t.grayed);
            }),
            (e.prototype._findTool = function (e) {
              return this._drawingsAccess.tools.find(function (t) {
                return t.name === e;
              });
            }),
            e
          );
        })()),
        (k = [
          {
            title: window.t("Cursors"),
            items: [{ name: "cursor" }, { name: "dot" }, { name: "arrow" }, { name: "eraser" }],
          },
          {
            title: window.t("Trend Line Tools"),
            items: [
              { name: "LineToolTrendLine" },
              { name: "LineToolInfoLine" },
              { name: "LineToolTrendAngle" },
              {
                name: "LineToolHorzLine",
                shortcut: { keys: "Alt+H", immediately: !0 },
              },
              { name: "LineToolHorzRay" },
              { name: "LineToolVertLine", shortcut: { keys: "Alt+V", immediately: !0 } },
              { name: "LineToolCrossLine", shortcut: { keys: "Alt+C", immediately: !0 } },
              { name: "LineToolArrow" },
              { name: "LineToolRay" },
              { name: "LineToolExtended" },
              { name: "LineToolParallelChannel" },
              { name: "LineToolDisjointAngle" },
              { name: "LineToolFlatBottom" },
              null,
            ].filter(Boolean),
          },
          {
            title: window.t("Gann and Fibonacci Tools"),
            items: [
              { name: "LineToolPitchfork" },
              { name: "LineToolSchiffPitchfork2" },
              { name: "LineToolSchiffPitchfork" },
              { name: "LineToolInsidePitchfork" },
              { name: "LineToolPitchfan" },
              { name: "LineToolGannSquare" },
              { name: "LineToolGannComplex" },
              { name: "LineToolGannFixed" },
              { name: "LineToolGannFan" },
              { name: "LineToolFibRetracement" },
              { name: "LineToolTrendBasedFibExtension" },
              { name: "LineToolFibSpeedResistanceFan" },
              { name: "LineToolFibTimeZone" },
              { name: "LineToolTrendBasedFibTime" },
              { name: "LineToolFibCircles" },
              { name: "LineToolFibSpiral" },
              { name: "LineToolFibSpeedResistanceArcs" },
              { name: "LineToolFibWedge" },
              { name: "LineToolFibChannel" },
            ],
          },
          {
            title: window.t("Geometric Shapes"),
            items: [
              { name: "LineToolBrush" },
              { name: "LineToolRectangle" },
              { name: "LineToolRotatedRectangle" },
              { name: "LineToolEllipse" },
              { name: "LineToolTriangle" },
              { name: "LineToolPolyline" },
              { name: "LineToolBezierQuadro" },
              { name: "LineToolBezierCubic" },
              { name: "LineToolArc" },
            ],
          },
          {
            title: window.t("Annotation Tools"),
            items: [
              { name: "LineToolText" },
              { name: "LineToolTextAbsolute" },
              { name: "LineToolNote" },
              { name: "LineToolNoteAbsolute" },
              { name: "LineToolCallout" },
              { name: "LineToolBalloon" },
              { name: "LineToolPriceLabel" },
              { name: "LineToolArrowMarkLeft" },
              { name: "LineToolArrowMarkRight" },
              { name: "LineToolArrowMarkUp" },
              { name: "LineToolArrowMarkDown" },
              { name: "LineToolFlagMark" },
            ],
          },
          {
            title: window.t("Patterns"),
            items: [
              { name: "LineTool5PointsPattern" },
              { name: "LineToolCypherPattern" },
              { name: "LineToolABCD" },
              { name: "LineToolTrianglePattern" },
              { name: "LineToolThreeDrivers" },
              { name: "LineToolHeadAndShoulders" },
              { name: "LineToolElliottImpulse" },
              { name: "LineToolElliottTriangle" },
              { name: "LineToolElliottTripleCombo" },
              { name: "LineToolElliottCorrection" },
              { name: "LineToolElliottDoubleCombo" },
              { name: "LineToolCircleLines" },
              { name: "LineToolTimeCycles" },
              { name: "LineToolSineLine" },
            ],
          },
          {
            title: window.t("Prediction and Measurement Tools"),
            items: [
              { name: "LineToolRiskRewardLong" },
              { name: "LineToolRiskRewardShort" },
              { name: "LineToolPrediction" },
              { name: "LineToolDateRange" },
              { name: "LineToolPriceRange" },
              { name: "LineToolDateAndPriceRange" },
              { name: "LineToolBarsPattern" },
              { name: "LineToolGhostFeed" },
              { name: "LineToolProjection" },
            ],
          },
        ]),
        (S = o("OiSa")),
        (E = o("nPPD")),
        (L = o("XAms")),
        (A = D = o("Wz44")),
        (M = "http://www.w3.org/2000/svg"),
        (N = o("ybOa")),
        (O = Object(E.a)(A, N)),
        (P = { hide: window.t("Hide Drawings Toolbar"), show: window.t("Show Drawings Toolbar") }),
        (W = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._toggleVisibility = function () {
                S.isDrawingToolbarVisible.setValue(!S.isDrawingToolbarVisible.value());
              }),
              t
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.render = function () {
              var e = this.props.toolbarVisible;
              return u.createElement(
                "div",
                {
                  className: m(O.toggleButton, "apply-common-tooltip common-tooltip-vertical", !e && O.collapsed),
                  onClick: this._toggleVisibility,
                  title: e ? P.hide : P.show,
                },
                u.createElement(n, { direction: e ? "left" : "right", theme: e ? void 0 : O })
              );
            }),
            t
          );
        })(u.PureComponent)),
        (x = o("XmVn")),
        (B = o("jjrI")),
        (V = o("beCu")),
        (I = o("uJ8n")),
        (F = o("j1f4")),
        (R = o("Vike")),
        (j = (function (e) {
          function t(t) {
            var o = e.call(this, t) || this;
            return (
              (o._scroll = null),
              (o._handleScrollTop = function () {
                o.animateTo(Math.max(0, o.currentPosition() - (o.state.heightWrap - 50)));
              }),
              (o._handleScrollBot = function () {
                o.animateTo(
                  Math.min(
                    (o.state.heightContent || 0) - (o.state.heightWrap || 0),
                    o.currentPosition() + (o.state.heightWrap - 50)
                  )
                );
              }),
              (o._handleResizeWrap = function (e) {
                var t = e.height;
                o.setState({ heightWrap: t });
              }),
              (o._handleResizeContent = function (e) {
                var t = e.height;
                o.setState({ heightContent: t });
              }),
              (o._handleScroll = function () {
                var e = o.props.onScroll;
                e && e(o.currentPosition(), o.isAtTop(), o.isAtBot()), o._checkButtonsVisibility();
              }),
              (o._checkButtonsVisibility = function () {
                var e, t, n, i, r;
                (o.props.isVisibleButtons || o.props.isVisibleFade) &&
                  ((t = (e = o.state).isVisibleTopButton),
                  (n = e.isVisibleBotButton),
                  (i = o.isAtTop()),
                  (r = o.isAtBot()),
                  i || t ? i && t && o.setState({ isVisibleTopButton: !1 }) : o.setState({ isVisibleTopButton: !0 }),
                  r || n ? r && n && o.setState({ isVisibleBotButton: !1 }) : o.setState({ isVisibleBotButton: !0 }));
              }),
              (o.state = { heightContent: 0, heightWrap: 0, isVisibleBotButton: !1, isVisibleTopButton: !1 }),
              o
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              this._checkButtonsVisibility();
            }),
            (t.prototype.componentDidUpdate = function (e, t) {
              (t.heightWrap === this.state.heightWrap && t.heightContent === this.state.heightContent) ||
                this._handleScroll();
            }),
            (t.prototype.currentPosition = function () {
              return this._scroll ? this._scroll.scrollTop : 0;
            }),
            (t.prototype.isAtTop = function () {
              return this.currentPosition() <= 1;
            }),
            (t.prototype.isAtBot = function () {
              return this.currentPosition() + this.state.heightWrap >= this.state.heightContent - 1;
            }),
            (t.prototype.animateTo = function (e, t) {
              if ((void 0 === t && (t = F.dur), this._scroll)) {
                var o = d.findDOMNode(this._scroll);
                Object(V.doAnimate)({
                  onStep: function (e, t) {
                    o.scrollTop = t;
                  },
                  from: o.scrollTop,
                  to: Math.round(e),
                  easing: F.easingFunc.easeInOutCubic,
                  duration: t,
                });
              }
            }),
            (t.prototype.render = function () {
              var e,
                t,
                o,
                n,
                i,
                r = this,
                a = this.props,
                s = a.children,
                l = a.isVisibleScrollbar,
                c = a.isVisibleFade,
                d = a.isVisibleButtons,
                p = this.state,
                h = p.heightContent,
                f = p.heightWrap,
                g = p.isVisibleBotButton,
                v = p.isVisibleTopButton;
              return u.createElement(
                x,
                { whitelist: ["height"], onMeasure: this._handleResizeWrap },
                u.createElement(
                  "div",
                  { className: I.wrap },
                  u.createElement(
                    "div",
                    {
                      className: m(I.scrollWrap, ((e = {}), (e[I.noScrollBar] = !l), e)),
                      onScroll: this._handleScroll,
                      ref: function (e) {
                        return (r._scroll = e);
                      },
                    },
                    u.createElement(
                      x,
                      { onMeasure: this._handleResizeContent, whitelist: ["height"] },
                      u.createElement("div", { className: I.content }, s)
                    )
                  ),
                  c &&
                    u.createElement("div", { className: m(I.fadeTop, ((t = {}), (t[I.isVisible] = v && h > f), t)) }),
                  c &&
                    u.createElement("div", { className: m(I.fadeBot, ((o = {}), (o[I.isVisible] = g && h > f), o)) }),
                  d &&
                    u.createElement(
                      "div",
                      {
                        className: m(I.scrollTop, ((n = {}), (n[I.isVisible] = v && h > f), n)),
                        onClick: this._handleScrollTop,
                      },
                      u.createElement(
                        "div",
                        { className: I.iconWrap },
                        u.createElement(B.a, { icon: R, className: I.icon })
                      )
                    ),
                  d &&
                    u.createElement(
                      "div",
                      {
                        className: m(I.scrollBot, ((i = {}), (i[I.isVisible] = g && h > f), i)),
                        onClick: this._handleScrollBot,
                      },
                      u.createElement(
                        "div",
                        { className: I.iconWrap },
                        u.createElement(B.a, { icon: R, className: I.icon })
                      )
                    )
                )
              );
            }),
            (t.defaultProps = { isVisibleScrollbar: !0 }),
            t
          );
        })(u.PureComponent)),
        (z = o("ycI/")),
        (U = o("WUqb")),
        (G = o("tWVy")),
        (H = o("gb5g")),
        (K = o("wZIs")),
        (q = o("3mf1")),
        (Q = o("9dlw")),
        (J = o("hn2c")),
        (Y = o("KmEK")),
        (X = (function (e) {
          function t(t) {
            var o = e.call(this, t) || this;
            return (
              (o._toggleDropdown = function (e) {
                o.setState({ isOpened: void 0 !== e ? e : !o.state.isOpened });
              }),
              (o._handleClose = function () {
                o._toggleDropdown(!1);
              }),
              (o._getDropdownPosition = function () {
                if (!o._control) return { x: 0, y: 0 };
                var e = o._control.getBoundingClientRect();
                return { x: e.left + e.width + 1, y: e.top - 6 };
              }),
              (o._handleClickArrow = function () {
                o._toggleDropdown();
              }),
              (o._handleTouchStart = function () {
                o.props.onClickButton(), o._toggleDropdown();
              }),
              (o._handlePressStart = function () {
                if (Modernizr.mobiletouch && !o.props.checkable) o._longPressDelay || o.props.onClickButton();
                else {
                  if (o._doubleClickDelay)
                    return clearTimeout(o._doubleClickDelay), delete o._doubleClickDelay, void o._toggleDropdown(!0);
                  o._doubleClickDelay = setTimeout(function () {
                    delete o._doubleClickDelay, o._longPressDelay || o.props.onClickButton();
                  }, 175);
                }
                o._longPressDelay = setTimeout(function () {
                  delete o._longPressDelay, o._toggleDropdown(!0);
                }, 300);
              }),
              (o._handlePressEnd = function () {
                o._longPressDelay &&
                  (clearTimeout(o._longPressDelay),
                  delete o._longPressDelay,
                  o.state.isOpened
                    ? o._toggleDropdown(!1)
                    : o.props.checkable ||
                      o.state.isOpened ||
                      !o.props.isActive ||
                      Modernizr.mobiletouch ||
                      o._toggleDropdown(!0));
              }),
              (o.state = { isOpened: !1 }),
              o
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.render = function () {
              var e,
                t = this,
                o = this.props,
                n = o.buttonActiveClass,
                r = o.buttonClass,
                a = o.buttonIcon,
                s = o.buttonTitle,
                l = o.buttonHotKey,
                c = o.dropdownTooltip,
                d = o.children,
                p = o.isActive,
                h = o.isGrayed,
                f = o.onClickWhenGrayed,
                g = o.checkable,
                v = this.state.isOpened;
              return u.createElement(
                "div",
                {
                  className: m(
                    Y.dropdown,
                    ((e = {}), (e[Y.isGrayed] = h), (e[Y.isActive] = p), (e[Y.isOpened] = v), e)
                  ),
                  onClick: h ? f : void 0,
                },
                u.createElement(
                  "div",
                  {
                    ref: function (e) {
                      return (t._control = e);
                    },
                    className: Y.control,
                  },
                  u.createElement(
                    "div",
                    {
                      className: m(Y.buttonWrap, { "apply-common-tooltip common-tooltip-vertical": Boolean(s || l) }),
                      "data-tooltip-hotkey": l,
                      "data-tooltip-delay": 1500,
                      title: s,
                      onMouseDown: h || Modernizr.mobiletouch ? void 0 : this._handlePressStart,
                      onMouseUp: h || Modernizr.mobiletouch ? void 0 : this._handlePressEnd,
                      onTouchStart: !h && g && Modernizr.mobiletouch ? this._handlePressStart : void 0,
                      onTouchEnd: !h && g && Modernizr.mobiletouch ? this._handlePressEnd : void 0,
                      onClick: h || g || !Modernizr.mobiletouch ? void 0 : this._handleTouchStart,
                    },
                    u.createElement(i, {
                      activeClass: n,
                      className: r,
                      icon: a,
                      isActive: p,
                      isGrayed: h,
                      isTransparent: !g,
                    })
                  ),
                  !h &&
                    !Modernizr.mobiletouch &&
                    u.createElement(
                      "div",
                      {
                        className: m(Y.arrow, c && "apply-common-tooltip common-tooltip-vertical"),
                        title: c,
                        onClick: this._handleClickArrow,
                      },
                      u.createElement(B.a, { className: Y.arrowIcon, icon: J })
                    )
                ),
                !h &&
                  u.createElement(
                    Q.a,
                    {
                      doNotCloseOn: this,
                      isOpened: v,
                      onClose: this._handleClose,
                      position: this._getDropdownPosition,
                    },
                    d
                  )
              );
            }),
            t
          );
        })(u.PureComponent)),
        (Z = o("KKsp")),
        ($ = o("EA32")),
        (ee = { icon: window.t("Icon"), dropdownTooltip: window.t("Icons") }),
        (te = 10),
        (oe = (function (e) {
          function t(t) {
            var o = e.call(this, t) || this;
            return (
              (o._renderItem = function (e) {
                return u.createElement(
                  "div",
                  {
                    className: $.item,
                    key: e,
                    onClick: function () {
                      o._handleSelect(e), Object(G.b)();
                    },
                  },
                  String.fromCharCode(e)
                );
              }),
              (o._onChangeDrawingState = function () {
                o.setState({ isActive: o._isActive() });
              }),
              (o._handleSelect = function (e) {
                var t, n;
                Object(K.saveDefaults)("linetoolicon", c.__assign({}, Object(K.defaults)("linetoolicon"), { icon: e })),
                  v.tool.setValue("LineToolIcon"),
                  -1 !== (n = (t = o.state.recents).indexOf(e)) && t.splice(n, 1),
                  (t = [e].concat(t.slice(0, te - 1))),
                  Object(f.setJSON)("linetoolicon.recenticons", t),
                  o.setState({ current: e, recents: t });
              }),
              (o.state = {
                current: Object(K.defaults)("linetoolicon").icon,
                recents: Object(f.getJSON)("linetoolicon.recenticons") || [],
              }),
              o
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              v.tool.subscribe(this._onChangeDrawingState), f.onSync.subscribe(this, this._onSyncSettings);
            }),
            (t.prototype.componentWillUnmount = function () {
              v.tool.unsubscribe(this._onChangeDrawingState), f.onSync.unsubscribe(this, this._onSyncSettings);
            }),
            (t.prototype.render = function () {
              var e = this,
                t = this.props,
                o = t.isGrayed,
                n = t.toolName,
                i = this.state,
                r = i.current,
                a = i.isActive,
                s = i.recents;
              return u.createElement(
                X,
                {
                  buttonClass: $.button,
                  buttonIcon: u.createElement(
                    "div",
                    { className: $.buttonIcon },
                    String.fromCharCode(r || q.availableIcons[0])
                  ),
                  buttonTitle: ee.icon,
                  dropdownTooltip: ee.dropdownTooltip,
                  isActive: a,
                  isGrayed: o,
                  onClickButton: function () {
                    return e._handleSelect(r || q.availableIcons[0]);
                  },
                  onClickWhenGrayed: function () {
                    return Object(b.emit)("onGrayedObjectClicked", { type: "drawing", name: T.a[n].localizedName });
                  },
                },
                s && [
                  u.createElement("div", { key: "recent", className: $.wrap }, s.map(this._renderItem)),
                  u.createElement(Z.a, { key: "separator" }),
                ],
                u.createElement("div", { key: "all", className: $.wrap }, q.availableIcons.map(this._renderItem))
              );
            }),
            (t.prototype._isActive = function () {
              return v.tool.value() === this.props.toolName;
            }),
            (t.prototype._onSyncSettings = function () {
              this.setState({ recents: Object(f.getJSON)("linetoolicon.recenticons") });
            }),
            t
          );
        })(u.Component)),
        (ne = o("Ocx9")),
        (ie = (function (e) {
          function t(t) {
            var o = e.call(this, t) || this;
            return (
              (o._handleClick = function () {
                o.props.saveDefaultOnChange && Object(ne.saveDefaultProperties)(!0),
                  o.props.property.setValue(!o.props.property.value()),
                  o.props.saveDefaultOnChange && Object(ne.saveDefaultProperties)(!1);
              }),
              (o.state = { isActive: o.props.property.value() }),
              o
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              this.props.property.subscribe(this, this._onChange);
            }),
            (t.prototype.componentWillUnmount = function () {
              this.props.property.unsubscribe(this, this._onChange);
            }),
            (t.prototype.render = function () {
              var e = this.props.toolName,
                t = this.state.isActive,
                o = T.a[e];
              return u.createElement(i, {
                icon: t && o.iconActive ? o.iconActive : o.icon,
                isActive: t,
                onClick: this._handleClick,
                title: o.localizedName,
              });
            }),
            (t.prototype._onChange = function (e) {
              this.setState({ isActive: e.value() });
            }),
            t
          );
        })(u.PureComponent)),
        (re = (function (e) {
          function t(t) {
            var o = e.call(this, t) || this;
            return (
              (o._handleClick = function () {
                v.tool.setValue(o.props.toolName);
              }),
              (o._onChange = function () {
                o.setState({ isActive: v.tool.value() === o.props.toolName });
              }),
              (o.state = { isActive: v.tool.value() === o.props.toolName }),
              o
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              v.tool.subscribe(this._onChange);
            }),
            (t.prototype.componentWillUnmount = function () {
              v.tool.unsubscribe(this._onChange);
            }),
            (t.prototype.render = function () {
              var e = this.props.toolName,
                t = this.state.isActive,
                o = T.a[e];
              return u.createElement(i, {
                icon: T.a[e].icon,
                isActive: t,
                isTransparent: !0,
                onClick: this._handleClick,
                title: o.localizedName,
                buttonHotKey: o.hotKey,
              });
            }),
            t
          );
        })(u.PureComponent)),
        (ae = (function (e) {
          function t(t) {
            var o = e.call(this, t) || this;
            return (
              (o._boundUndoModel = null),
              (o._handleClick = function () {
                var e = o._activeChartWidget().model();
                e && e.zoomFromViewport();
              }),
              (o._syncUnzoomButton = function () {
                var e = o._activeChartWidget(),
                  t = e.model(),
                  n = !1;
                t
                  ? (o._boundUndoModel !== t &&
                      (o._boundUndoModel &&
                        o._boundUndoModel.zoomStack().onChange().unsubscribe(null, o._syncUnzoomButton),
                      t.zoomStack().onChange().subscribe(null, o._syncUnzoomButton),
                      (o._boundUndoModel = t)),
                    (n = !t.zoomStack().isEmpty()))
                  : e.withModel(null, o._syncUnzoomButton),
                  o.setState({ isVisible: n });
              }),
              (o.state = { isVisible: !1 }),
              o
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              this.props.chartWidgetCollection.activeChartWidget.subscribe(this._syncUnzoomButton, {
                callWithLast: !0,
              });
            }),
            (t.prototype.componentWillUnmount = function () {
              this.props.chartWidgetCollection.activeChartWidget.unsubscribe(this._syncUnzoomButton);
            }),
            (t.prototype.render = function () {
              return this.state.isVisible
                ? u.createElement(r, { action: this._handleClick, isTransparent: !0, toolName: "zoom-out" })
                : u.createElement("div", null);
            }),
            (t.prototype._activeChartWidget = function () {
              return this.props.chartWidgetCollection.activeChartWidget.value();
            }),
            t
          );
        })(u.PureComponent)),
        (se = o("b2d7")),
        (le = o("pr86")),
        (ce = o("N5tr")),
        (ue = o("Bruo")),
        (de = (function (e) {
          function t() {
            return (null !== e && e.apply(this, arguments)) || this;
          }
          return (
            c.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              ue.bind(this.props.keys, this.props.handler);
            }),
            (t.prototype.componentDidUpdate = function (e) {
              (this.props.keys === e.keys && this.props.handler === e.handler) ||
                (ue.unbind(e.keys), ue.bind(this.props.keys, this.props.handler));
            }),
            (t.prototype.componentWillUnmount = function () {
              ue.unbind(this.props.keys);
            }),
            (t.prototype.render = function () {
              return null;
            }),
            t
          );
        })(u.PureComponent)),
        (pe = (function (e) {
          function t(t) {
            var o,
              n = e.call(this, t) || this;
            return (
              (n._onChangeDrawingState = function () {
                var e = n._getActiveToolIndex();
                n.setState({ current: -1 !== e ? e : n.state.current, isActive: -1 !== e });
              }),
              (n._handleClickButton = function () {
                var e = n._getCurrentToolName();
                n._selectTool(e);
              }),
              (n._handleClickItem = function (e) {
                n._selectTool(e);
              }),
              (n._handleGrayedClick = function (e) {
                Object(b.emit)("onGrayedObjectClicked", { type: "drawing", name: T.a[e].localizedName });
              }),
              (n._handleShortcut = function (e) {
                var t = n.props.lineTools.find(function (t) {
                    return t.name === e;
                  }),
                  o = t && t.shortcut;
                o && o.immediately ? n._drawLinetoolImmediately(e) : n._selectTool(e);
              }),
              (n._drawLinetoolImmediately = function (e) {
                var t = n.props.chartWidgetCollection.activeChartWidget.value();
                t.activePaneWidget && t.activePaneWidget.drawRightThere(e);
              }),
              (n._handleClickFavorite = function (e) {
                n.state.favState && n.state.favState[e] ? se.a.removeFavorite(e) : se.a.addFavorite(e);
              }),
              (n._onAddFavorite = function (e) {
                var t;
                n.setState({ favState: c.__assign({}, n.state.favState, ((t = {}), (t[e] = !0), t)) });
              }),
              (n._onRemoveFavorite = function (e) {
                var t;
                n.setState({ favState: c.__assign({}, n.state.favState, ((t = {}), (t[e] = !1), t)) });
              }),
              (n._onSyncFavorites = function () {
                n.setState({ favState: n._composeFavState() });
              }),
              (o = n._getActiveToolIndex()),
              (n.state = {
                current: -1 === o ? n._firstNonGrayedTool() : o,
                favState: n._composeFavState(),
                isActive: -1 !== o,
              }),
              n
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              v.tool.subscribe(this._onChangeDrawingState),
                se.a.favoriteAdded.subscribe(null, this._onAddFavorite),
                se.a.favoriteRemoved.subscribe(null, this._onRemoveFavorite),
                se.a.favoritesSynced.subscribe(null, this._onSyncFavorites);
            }),
            (t.prototype.componentWillUnmount = function () {
              v.tool.unsubscribe(this._onChangeDrawingState),
                se.a.favoriteAdded.unsubscribe(null, this._onAddFavorite),
                se.a.favoriteRemoved.unsubscribe(null, this._onRemoveFavorite),
                se.a.favoritesSynced.unsubscribe(null, this._onSyncFavorites);
            }),
            (t.prototype.componentDidUpdate = function (e, t) {
              e.lineTools !== this.props.lineTools && this.setState({ favState: this._composeFavState() });
            }),
            (t.prototype.render = function () {
              var e = this,
                t = this.props,
                o = t.favoriting,
                n = t.grayedTools,
                i = t.lineTools,
                r = t.dropdownTooltip,
                a = this.state,
                s = a.current,
                l = a.favState,
                c = a.isActive,
                d = this._getCurrentToolName(),
                p = T.a[d],
                h = this._showShortcuts();
              return u.createElement(
                "span",
                null,
                u.createElement(
                  X,
                  {
                    buttonIcon: p.icon,
                    buttonTitle: p.localizedName,
                    buttonHotKey: p.hotKey,
                    dropdownTooltip: r,
                    isActive: c,
                    onClickButton: this._handleClickButton,
                  },
                  i.map(function (t, i) {
                    var r = t.name,
                      a = T.a[r],
                      d = n[r];
                    return u.createElement(ce.a, {
                      key: r,
                      dontClosePopup: d,
                      forceShowShortcuts: h,
                      shortcut: t.shortcut && t.shortcut.keys,
                      icon: a.icon,
                      isActive: c && s === i,
                      appearAsDisabled: d,
                      label: a.localizedName,
                      onClick: d ? e._handleGrayedClick : e._handleClickItem,
                      onClickArg: r,
                      showToolboxOnHover: !l[r],
                      toolbox:
                        o && !d
                          ? u.createElement(le.a, { isFilled: l[r], onClick: e._handleClickFavorite, onClickArg: r })
                          : void 0,
                    });
                  })
                ),
                i.map(function (t, o) {
                  var n = t.name,
                    i = t.shortcut;
                  return (
                    i &&
                    u.createElement(de, {
                      handler: function (t) {
                        t.preventDefault(), e._handleShortcut(n);
                      },
                      key: n,
                      keys: i.keys,
                    })
                  );
                })
              );
            }),
            (t.prototype._getCurrentToolName = function () {
              var e = this.state.current,
                t = this.props.lineTools;
              return t[e || 0].name;
            }),
            (t.prototype._firstNonGrayedTool = function () {
              var e = this.props,
                t = e.grayedTools;
              return e.lineTools.findIndex(function (e) {
                return !t[e.name];
              });
            }),
            (t.prototype._getActiveToolIndex = function () {
              return this.props.lineTools.findIndex(function (e) {
                return e.name === v.tool.value();
              });
            }),
            (t.prototype._showShortcuts = function () {
              return this.props.lineTools.some(function (e) {
                return "shortcut" in e;
              });
            }),
            (t.prototype._selectTool = function (e) {
              v.tool.setValue(e);
            }),
            (t.prototype._composeFavState = function () {
              var e = {};
              return (
                this.props.lineTools.forEach(function (t) {
                  e[t.name] = se.a.isFavorite(t.name);
                }),
                e
              );
            }),
            t
          );
        })(u.PureComponent)),
        (he = {
          all: window.t("Remove Drawing Tools & Indicators"),
          drawings: window.t("Remove Drawing Tools"),
          studies: window.t("Remove Indicators"),
        }),
        (me = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._handleRemoveToolClick = function () {
                Modernizr.mobiletouch || t._handleRemoveDrawings();
              }),
              (t._handleRemoveDrawings = function () {
                t.props.chartWidgetCollection.activeChartWidget.value().removeAllDrawingTools();
              }),
              (t._handleRemoveStudies = function () {
                t.props.chartWidgetCollection.activeChartWidget.value().removeAllStudies();
              }),
              (t._handleRemoveAll = function () {
                t.props.chartWidgetCollection.activeChartWidget.value().removeAllStudiesDrawingTools();
              }),
              t
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.render = function () {
              return u.createElement(
                X,
                {
                  buttonIcon: T.a[this.props.toolName].icon,
                  buttonTitle: he.drawings,
                  onClickButton: this._handleRemoveToolClick,
                },
                u.createElement(ce.a, { label: he.drawings, onClick: this._handleRemoveDrawings }),
                u.createElement(ce.a, { label: he.studies, onClick: this._handleRemoveStudies }),
                u.createElement(ce.a, { label: he.all, onClick: this._handleRemoveAll })
              );
            }),
            t
          );
        })(u.PureComponent)),
        (fe = o("g5Qf")),
        (ge = o("85c9")),
        (ve = window.t("Show Favorite Drawings Toolbar")),
        (be = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._instance = null),
              (t._promise = null),
              (t._bindedForceUpdate = function () {
                return t.forceUpdate();
              }),
              (t._handleClick = function () {
                null !== t._instance && (t._instance.isVisible() ? t._instance.hide() : t._instance.show());
              }),
              t
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              var e = this,
                t = (this._promise = Object(p.ensureNotNull)(Object(fe.getFavoriteDrawingToolbarPromise)()));
              t.then(function (o) {
                e._promise === t &&
                  ((e._instance = o),
                  e._instance.canBeShown().subscribe(e._bindedForceUpdate),
                  e._instance.visibility().subscribe(e._bindedForceUpdate),
                  e.forceUpdate());
              });
            }),
            (t.prototype.componentWillUnmount = function () {
              (this._promise = null),
                null !== this._instance &&
                  (this._instance.canBeShown().unsubscribe(this._bindedForceUpdate),
                  this._instance.visibility().unsubscribe(this._bindedForceUpdate),
                  (this._instance = null));
            }),
            (t.prototype.render = function () {
              return null !== this._instance && this._instance.canBeShown().value()
                ? u.createElement(i, {
                    id: this.props.id,
                    icon: ge,
                    isActive: this._instance.isVisible(),
                    onClick: this._handleClick,
                    title: ve,
                  })
                : null;
            }),
            t
          );
        })(u.PureComponent)),
        (_e = o("Ijvb")),
        (ye = o("tITk")),
        (we = o("4o++")),
        (Te = o("7RN7")),
        (function (e) {
          (e.Screenshot = "drawing-toolbar-screenshot"),
            (e.FavoriteDrawings = "drawing-toolbar-favorite-drawings"),
            (e.ObjectTree = "drawing-toolbar-object-tree");
        })(Ce || (Ce = {})),
        (ke = o("JQKp")),
        (Se = { weakMagnet: window.t("Weak Magnet"), strongMagnet: window.t("Strong Magnet") }),
        (Ee = Object(w.onWidget)()),
        (Le = new y.a()),
        (De = (function (e) {
          function t(t) {
            var o = e.call(this, t) || this;
            return (
              (o._grayedTools = {}),
              (o._handleChangeVisibility = function (e) {
                o.setState({ isVisible: e });
              }),
              (o._handleEsc = function () {
                v.resetToCursor(!0), Object(G.b)();
              }),
              v.init(),
              (o._toolsFilter = new C(o.props.drawingsAccess)),
              (o._filteredLineTools = k
                .map(function (e) {
                  return {
                    title: e.title,
                    items: e.items.filter(function (e) {
                      return o._toolsFilter.isToolEnabled(T.a[e.name].localizedName);
                    }),
                  };
                })
                .filter(function (e) {
                  return 0 !== e.items.length;
                })),
              o._filteredLineTools.forEach(function (e) {
                return e.items.forEach(function (e) {
                  o._grayedTools[e.name] = o._toolsFilter.isToolGrayed(T.a[e.name].localizedName);
                });
              }),
              (o.state = {
                isVisible: S.isDrawingToolbarVisible.value(),
                magnet: v.properties().childs().magnet.value(),
                magnetMode: v.properties().childs().magnetMode.value(),
              }),
              (o._features = {
                favoriting: !Ee && g.enabled("items_favoriting"),
                multicharts: g.enabled("support_multicharts"),
                tools: !Ee || g.enabled("charting_library_base"),
              }),
              o._negotiateResizer(),
              o
            );
          }
          return (
            c.__extends(t, e),
            (t.prototype.getChildContext = function () {
              return { chartWidgetCollection: this.props.chartWidgetCollection, customCloseDelegate: Le };
            }),
            (t.prototype.componentDidMount = function () {
              S.isDrawingToolbarVisible.subscribe(this._handleChangeVisibility),
                d.findDOMNode(this).addEventListener("contextmenu", function (e) {
                  return e.preventDefault();
                }),
                G.a.subscribe(this, this._handleGlobalClose),
                v.properties().childs().magnet.subscribe(this, this._updateMagnetEnabled),
                v.properties().childs().magnetMode.subscribe(this, this._updateMagnetMode);
            }),
            (t.prototype.componentWillUnmount = function () {
              S.isDrawingToolbarVisible.unsubscribe(this._handleChangeVisibility),
                G.a.unsubscribe(this, this._handleGlobalClose),
                v.properties().childs().magnet.unsubscribe(this, this._updateMagnetEnabled),
                v.properties().childs().magnetMode.unsubscribe(this, this._updateMagnetMode);
            }),
            (t.prototype.componentDidUpdate = function (e, t) {
              var o = this.state.isVisible;
              o !== t.isVisible &&
                (b.emit("toggle_sidebar", !o),
                f.setValue("ChartDrawingToolbarWidget.visible", o),
                this._negotiateResizer());
            }),
            (t.prototype.render = function () {
              var e,
                t = this,
                o = this.props,
                n = o.bgColor,
                i = o.chartWidgetCollection,
                c = o.readOnly,
                d = (o.hideMainMenu, this.state),
                p = d.isVisible,
                h = d.magnet,
                f = d.magnetMode,
                g = { backgroundColor: n && "#" + n };
              return u.createElement(
                "div",
                {
                  className: m(ke.drawingToolbar, ((e = {}), (e[ke.isHidden] = !p), e)),
                  style: g,
                  onClick: this.props.onClick,
                },
                u.createElement(
                  j,
                  {
                    onScroll: this._handleGlobalClose,
                    isVisibleFade: Modernizr.mobiletouch,
                    isVisibleButtons: !Modernizr.mobiletouch,
                    isVisibleScrollbar: !1,
                  },
                  u.createElement(
                    "div",
                    { className: ke.inner },
                    !1,
                    !c &&
                      u.createElement(
                        "div",
                        { className: ke.group, style: g },
                        this._filteredLineTools.map(function (e, o) {
                          return u.createElement(pe, {
                            chartWidgetCollection: i,
                            favoriting: t._features.favoriting,
                            grayedTools: t._grayedTools,
                            key: o,
                            dropdownTooltip: e.title,
                            lineTools: e.items,
                          });
                        }),
                        this._toolsFilter.isToolEnabled("Font Icons") &&
                          u.createElement(oe, { isGrayed: this._grayedTools["Font Icons"], toolName: "LineToolIcon" })
                      ),
                    !c &&
                      u.createElement(
                        "div",
                        { className: ke.group, style: g },
                        u.createElement(re, { toolName: "measure" }),
                        u.createElement(re, { toolName: "zoom" }),
                        u.createElement(ae, { chartWidgetCollection: i })
                      ),
                    !c &&
                      u.createElement(
                        "div",
                        { className: ke.group, style: g },
                        u.createElement(
                          X,
                          {
                            buttonIcon: f === we.MagnetMode.StrongMagnet ? _e.a.strongMagnet : _e.a.magnet,
                            buttonTitle: T.a.magnet.localizedName,
                            isActive: h,
                            onClickButton: a,
                            checkable: !0,
                          },
                          u.createElement(ce.a, {
                            key: "weakMagnet",
                            icon: _e.a.magnet,
                            isActive: h && f !== we.MagnetMode.StrongMagnet,
                            label: Se.weakMagnet,
                            onClick: s,
                          }),
                          u.createElement(ce.a, {
                            key: "strongMagnet",
                            icon: _e.a.strongMagnet,
                            isActive: h && f === we.MagnetMode.StrongMagnet,
                            label: Se.strongMagnet,
                            onClick: l,
                          })
                        ),
                        this._features.tools &&
                          u.createElement(ie, {
                            property: v.properties().childs().stayInDrawingMode,
                            saveDefaultOnChange: !0,
                            toolName: "drawginmode",
                          }),
                        this._features.tools &&
                          u.createElement(ie, { property: v.lockDrawings(), toolName: "lockAllDrawings" }),
                        this._features.tools &&
                          u.createElement(ie, { property: v.hideAllDrawings(), toolName: "hideAllDrawings" }),
                        !1
                      ),
                    !c &&
                      this._features.tools &&
                      u.createElement(
                        "div",
                        { className: ke.group, style: g },
                        u.createElement(me, { chartWidgetCollection: i, toolName: "removeAllDrawingTools" })
                      ),
                    u.createElement("div", { className: ke.fill, style: g }),
                    !c &&
                      (this._features.tools || !1) &&
                      u.createElement(
                        "div",
                        { className: m(ke.group, ke.lastGroup), style: g },
                        !1,
                        this._features.tools &&
                          this._features.favoriting &&
                          u.createElement(be, { id: Ce.FavoriteDrawings }),
                        this._features.tools &&
                          u.createElement(r, {
                            id: Ce.ObjectTree,
                            action: function () {
                              return t._activeChartWidget().showObjectsTreeDialog();
                            },
                            toolName: "showObjectsTree",
                          })
                      )
                  )
                ),
                u.createElement(W, { toolbarVisible: p }),
                u.createElement(z.a, { keyCode: U.a.Escape, handler: this._handleEsc })
              );
            }),
            (t.prototype._activeChartWidget = function () {
              return this.props.chartWidgetCollection.activeChartWidget.value();
            }),
            (t.prototype._negotiateResizer = function () {
              this.props.resizerBridge.negotiateWidth(this.state.isVisible ? Te.b : Te.a);
            }),
            (t.prototype._handleGlobalClose = function () {
              Le.fire();
            }),
            (t.prototype._updateMagnetEnabled = function () {
              var e = { magnet: v.properties().childs().magnet.value() };
              this.setState(e);
            }),
            (t.prototype._updateMagnetMode = function () {
              var e = { magnetMode: v.properties().childs().magnetMode.value() };
              this.setState(e);
            }),
            (t.childContextTypes = { chartWidgetCollection: h.any.isRequired, customCloseDelegate: h.any.isRequired }),
            t
          );
        })(u.PureComponent)),
        o.d(t, "DrawingToolbarRenderer", function () {
          return Ae;
        }),
        (Ae = (function () {
          function e(e, t) {
            var o = this;
            (this._component = null),
              (this._handleRef = function (e) {
                o._component = e;
              }),
              (this._container = e),
              d.render(u.createElement(De, c.__assign({}, t, { ref: this._handleRef })), this._container);
          }
          return (
            (e.prototype.destroy = function () {
              d.unmountComponentAtNode(this._container);
            }),
            (e.prototype.getComponent = function () {
              return Object(p.ensureNotNull)(this._component);
            }),
            e
          );
        })());
    },
    "85c9": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="19" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M9.103.687a1 1 0 0 1 1.794 0l2.374 4.81 5.309.772a1 1 0 0 1 .554 1.706l-3.841 3.745.906 5.287a1 1 0 0 1-1.45 1.054L10 15.565 5.252 18.06A1 1 0 0 1 3.8 17.007l.907-5.287L.866 7.975a1 1 0 0 1 .554-1.706l5.31-.771L9.102.688zM10 1.13L7.393 6.412l-5.829.847 4.218 4.111-.996 5.806L10 14.436l5.214 2.74-.996-5.805 4.218-4.112-5.83-.847L10 1.13z"/></svg>';
    },
    "9dlw": function (e, t, o) {
      "use strict";
      var n, i, r, a, s, l, c, u, d;
      o.d(t, "a", function () {
        return d;
      }),
        (n = o("mrSG")),
        (i = o("bf9a")),
        (r = o("q1tI")),
        (a = o("i8i4")),
        (s = o("17x9")),
        (l = o("RgaO")),
        (c = o("AiMB")),
        (u = o("DTHj")),
        (d = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._handleClose = function () {
                t.props.onClose();
              }),
              (t._handleClickOutside = function (e) {
                var o,
                  n = t.props,
                  i = n.closeOnClickOutside,
                  r = n.onClickOutside,
                  s = n.doNotCloseOn;
                r && r(e),
                  i &&
                    ((s &&
                      e.target instanceof Node &&
                      (o = a.findDOMNode(s)) instanceof Node &&
                      o.contains(e.target)) ||
                      t._handleClose());
              }),
              (t._handleScroll = function (e) {
                var o = t.props.onScroll;
                o && o(e), e.stopPropagation();
              }),
              t
            );
          }
          return (
            n.__extends(t, e),
            (t.prototype.componentWillReceiveProps = function (e) {
              this.props.isOpened && !e.isOpened && this.setState({ isMeasureValid: void 0 });
            }),
            (t.prototype.render = function () {
              var e = this.props,
                t = e.children,
                o = e.isOpened,
                i =
                  (e.closeOnClickOutside,
                  e.doNotCloseOn,
                  e.onClickOutside,
                  e.onClose,
                  n.__rest(e, [
                    "children",
                    "isOpened",
                    "closeOnClickOutside",
                    "doNotCloseOn",
                    "onClickOutside",
                    "onClose",
                  ]));
              return o
                ? r.createElement(
                    c.a,
                    null,
                    r.createElement(
                      l.a,
                      { handler: this._handleClickOutside, mouseDown: !0, touchStart: !0 },
                      r.createElement(
                        u.a,
                        n.__assign({}, i, {
                          isOpened: o,
                          onClose: this._handleClose,
                          onScroll: this._handleScroll,
                          customCloseDelegate: this.context.customCloseDelegate,
                        }),
                        t
                      )
                    )
                  )
                : null;
            }),
            (t.contextTypes = { customCloseDelegate: s.any }),
            (t.defaultProps = { closeOnClickOutside: !0 }),
            t
          );
        })(r.PureComponent));
    },
    AiMB: function (e, t, o) {
      "use strict";
      var n, i, r, a, s, l, c, u;
      o.d(t, "a", function () {
        return c;
      }),
        o.d(t, "b", function () {
          return u;
        }),
        (n = o("mrSG")),
        (i = o("q1tI")),
        (r = o("i8i4")),
        (a = o("0waE")),
        (s = o("jAh7")),
        (l = o("+EG+")),
        (c = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (t._uuid = Object(a.guid)()), t;
          }
          return (
            n.__extends(t, e),
            (t.prototype.componentWillUnmount = function () {
              this._manager().removeWindow(this._uuid);
            }),
            (t.prototype.render = function () {
              return r.createPortal(
                i.createElement(u.Provider, { value: this }, this.props.children),
                this._manager().ensureWindow(this._uuid)
              );
            }),
            (t.prototype.moveToTop = function () {
              this._manager().moveToTop(this._uuid);
            }),
            (t.prototype._manager = function () {
              return null === this.context ? Object(s.getRootOverlapManager)() : this.context;
            }),
            (t.contextType = l.b),
            t
          );
        })(i.PureComponent)),
        (u = i.createContext(null));
    },
    EA32: function (e, t, o) {
      e.exports = {
        wrap: "wrap-2I6DAtXG-",
        buttonIcon: "buttonIcon-2rBwJ1QM-",
        item: "item-31XunD5q-",
        hovered: "hovered-2A1Cpat5-",
        button: "button-21ihqWJ8-",
      };
    },
    GWvR: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path d="M9.901 9.639c-.102-.797.218-1.775.77-2.356l1.438-1.527-2.07-.395c-.784-.142-1.615-.742-2.008-1.446L7.003 2.06 5.97 3.917c-.391.702-1.222 1.301-2 1.443l-2.08.396 1.44 1.526c.547.577.866 1.549.77 2.353l-.262 2.086 1.93-.897a2.95 2.95 0 0 1 1.233-.254c.44 0 .87.085 1.233.254l1.93.897-.263-2.082zm.992-.127l.458 3.624c.014.105-.006.16-.02.176-.028.03-.109.005-.182-.03L7.812 11.73a1.973 1.973 0 0 0-.811-.16c-.302 0-.59.057-.81.16l-3.338 1.552c-.118.056-.164.051-.182.03-.014-.016-.034-.07-.02-.178L3.11 9.51c.06-.503-.162-1.18-.505-1.54L.087 5.302c-.085-.091-.09-.148-.086-.158.003-.01.04-.053.16-.077l3.621-.689c.491-.09 1.069-.506 1.315-.948L7.004 0l1.902 3.43c.246.442.824.859 1.312.947l3.617.69c.123.024.162.068.164.077.003.01-.003.066-.089.157L11.4 7.97c-.348.367-.57 1.045-.506 1.543z"/></svg>';
    },
    HHbT: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 14" width="14" height="14"><path d="M10.893 9.512l.458 3.624c.014.105-.006.16-.02.176-.028.03-.109.005-.182-.03L7.812 11.73a1.973 1.973 0 0 0-.811-.16c-.302 0-.59.057-.81.16l-3.338 1.552c-.118.056-.164.051-.182.03-.014-.016-.034-.07-.02-.178L3.11 9.51c.06-.503-.162-1.18-.505-1.54L.087 5.302c-.085-.091-.09-.148-.086-.158.003-.01.04-.053.16-.077l3.621-.689c.491-.09 1.069-.506 1.315-.948L7.004 0l1.902 3.43c.246.442.824.859 1.312.947l3.617.69c.123.024.162.068.164.077.003.01-.003.066-.089.157L11.4 7.97c-.348.367-.57 1.045-.506 1.543z"/></svg>';
    },
    JQKp: function (e, t, o) {
      e.exports = {
        drawingToolbar: "drawingToolbar-U3_QXRof-",
        isHidden: "isHidden-2d-PYkzV-",
        inner: "inner-1xuW-gY4-",
        group: "group-2JyOhh7Z-",
        noGroupPadding: "noGroupPadding-1TTjVKWk-",
        lastGroup: "lastGroup-O75UB5Xa-",
        fill: "fill-1djIbBXv-",
        separator: "separator-1BAqp1-l-",
      };
    },
    KKsp: function (e, t, o) {
      "use strict";
      function n(e) {
        return i.createElement("div", { className: r.separator });
      }
      var i, r;
      o.d(t, "a", function () {
        return n;
      }),
        (i = o("q1tI")),
        (r = o("NOPy"));
    },
    KmEK: function (e, t, o) {
      e.exports = {
        dropdown: "dropdown-3_ASLzSj-",
        buttonWrap: "buttonWrap-3fZWypJl-",
        control: "control-1TyEfSIx-",
        arrow: "arrow-1cFKS5Ok-",
        arrowIcon: "arrowIcon-2wA7q8om-",
        isOpened: "isOpened-22vLOY9o-",
        isGrayed: "isGrayed-xr-mULNo-",
      };
    },
    N5tr: function (e, t, o) {
      "use strict";
      function n(e) {
        return a.createElement(e.href ? "a" : "div", e);
      }
      function i(e) {
        e.stopPropagation();
      }
      var r, a, s, l, c, u, d, p;
      o.d(t, "a", function () {
        return p;
      }),
        (r = o("mrSG")),
        (a = o("q1tI")),
        (s = o("TSYQ")),
        (l = o("tWVy")),
        (c = o("tITk")),
        (u = o("QpNh")),
        (d = o("v1bN")),
        (p = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._handleClick = function (e) {
                var o = t.props,
                  n = o.dontClosePopup,
                  i = o.isDisabled,
                  r = o.onClick,
                  a = o.onClickArg,
                  s = o.trackEventObject;
                i || (s && Object(c.trackEvent)(s.category, s.event, s.label), r && r(a, e), n || Object(l.b)());
              }),
              (t._handleMouseUp = function (e) {
                var o = t.props,
                  n = o.link,
                  i = o.trackEventObject;
                1 === e.button && n && i && Object(c.trackEvent)(i.category, i.event, i.label);
              }),
              (t._formatShortcut = function (e) {
                return e && e.split("+").join(" + ");
              }),
              t
            );
          }
          return (
            r.__extends(t, e),
            (t.prototype.render = function () {
              var e,
                t,
                o = this.props,
                l = o.className,
                c = o.shortcut,
                p = o.forceShowShortcuts,
                h = o.icon,
                m = o.isActive,
                f = o.isDisabled,
                g = o.isHovered,
                v = o.appearAsDisabled,
                b = o.label,
                _ = o.link,
                y = o.showToolboxOnHover,
                w = o.target,
                T = o.toolbox,
                C = o.theme,
                k = void 0 === C ? d : C,
                S = Object(u.a)(this.props);
              return a.createElement(
                n,
                r.__assign({}, S, {
                  className: s(
                    l,
                    k.item,
                    h && k.withIcon,
                    ((e = {}), (e[k.isActive] = m), (e[k.isDisabled] = f || v), (e[k.hovered] = g), e)
                  ),
                  href: _,
                  target: w,
                  onClick: this._handleClick,
                  onMouseUp: this._handleMouseUp,
                }),
                void 0 !== h && a.createElement("div", { className: k.icon, dangerouslySetInnerHTML: { __html: h } }),
                a.createElement("div", { className: k.labelRow }, a.createElement("div", { className: k.label }, b)),
                (void 0 !== c || p) && a.createElement("div", { className: k.shortcut }, this._formatShortcut(c)),
                void 0 !== T &&
                  a.createElement(
                    "div",
                    { onClick: i, className: s(k.toolbox, ((t = {}), (t[k.showOnHover] = y), t)) },
                    T
                  )
              );
            }),
            t
          );
        })(a.PureComponent));
    },
    NOPy: function (e, t, o) {
      e.exports = { separator: "separator-25lkUpN--" };
    },
    QpNh: function (e, t, o) {
      "use strict";
      function n(e) {
        var t,
          o,
          n,
          r,
          a,
          s = Object.entries(e).filter(i),
          l = {};
        for (t = 0, o = s; t < o.length; t++) (r = (n = o[t])[0]), (a = n[1]), (l[r] = a);
        return l;
      }
      function i(e) {
        var t = e[0],
          o = e[1];
        return 0 === t.indexOf("data-") && "string" == typeof o;
      }
      o.d(t, "a", function () {
        return n;
      });
    },
    Vike: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 10" width="20" height="10"><path fill="none" stroke="currentColor" stroke-width="1.5" d="M2 1l8 8 8-8"/></svg>';
    },
    WUqb: function (e, t, o) {
      "use strict";
      var n, i;
      o.d(t, "a", function () {
        return i;
      }),
        o("mrSG"),
        (n = o("q1tI")),
        (function (e) {
          (e[(e.Enter = 13)] = "Enter"),
            (e[(e.Space = 32)] = "Space"),
            (e[(e.Backspace = 8)] = "Backspace"),
            (e[(e.DownArrow = 40)] = "DownArrow"),
            (e[(e.UpArrow = 38)] = "UpArrow"),
            (e[(e.RightArrow = 39)] = "RightArrow"),
            (e[(e.LeftArrow = 37)] = "LeftArrow"),
            (e[(e.Escape = 27)] = "Escape"),
            (e[(e.Tab = 9)] = "Tab");
        })(i || (i = {}));
    },
    Wz44: function (e, t, o) {
      e.exports = {
        container: "container-3_8ayT2Q-",
        mirror: "mirror-crJbq8d0-",
        background: "background-Q1Fcmxly-",
        arrow: "arrow-WcYWFXUn-",
      };
    },
    fEjm: function (e, t, o) {
      e.exports = { star: "star-uhAI7sV4-", checked: "checked-2bhy04CF-" };
    },
    gb5g: function (e, t, o) {
      e.exports = {
        button: "button-263WXsg--",
        bg: "bg-1kRv1Pf2-",
        icon: "icon-1Y-3MM9F-",
        isActive: "isActive-2mI1-NUL-",
        isTransparent: "isTransparent-sRmateFl-",
        isGrayed: "isGrayed-1kWObWVr-",
        isHidden: "isHidden-2VzaskeU-",
      };
    },
    hn2c: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 16" width="10" height="16"><path d="M.6 1.4l1.4-1.4 8 8-8 8-1.4-1.4 6.389-6.532-6.389-6.668z"/></svg>';
    },
    nPPD: function (e, t, o) {
      "use strict";
      function n(e, t, o) {
        var n, i, r, a, s;
        for (void 0 === o && (o = {}), n = Object.assign({}, t), i = 0, r = Object.keys(t); i < r.length; i++)
          (s = o[(a = r[i])] || a) in e && (n[a] = [e[s], t[a]].join(" "));
        return n;
      }
      function i(e, t, o) {
        return void 0 === o && (o = {}), Object.assign({}, e, n(e, t, o));
      }
      o.d(t, "b", function () {
        return n;
      }),
        o.d(t, "a", function () {
          return i;
        });
    },
    pr86: function (e, t, o) {
      "use strict";
      var n, i, r, a, s, l, c, u;
      o.d(t, "a", function () {
        return u;
      }),
        (n = o("mrSG")),
        o("YFKU"),
        (i = o("q1tI")),
        (r = o("TSYQ")),
        (a = o("fEjm")),
        (s = o("HHbT")),
        (l = o("GWvR")),
        (c = { add: window.t("Add to favorites"), remove: window.t("Remove from favorites") }),
        (u = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._handleClick = function (e) {
                var o = t.props,
                  n = o.onClick,
                  i = o.onClickArg;
                n && n(i, e);
              }),
              t
            );
          }
          return (
            n.__extends(t, e),
            (t.prototype.render = function () {
              var e,
                t = this.props.isFilled;
              return i.createElement("span", {
                className: r(a.star, "apply-common-tooltip", ((e = {}), (e[a.checked] = t), e)),
                dangerouslySetInnerHTML: { __html: t ? s : l },
                onClick: this._handleClick,
                title: t ? c.remove : c.add,
              });
            }),
            t
          );
        })(i.PureComponent));
    },
    uJ8n: function (e, t, o) {
      e.exports = {
        wrap: "wrap-1h7U5nKd-",
        scrollWrap: "scrollWrap-3gtPS0Fe-",
        noScrollBar: "noScrollBar-ieMwbfur-",
        content: "content-YhoA_L2m-",
        icon: "icon-2xObs8DI-",
        scrollBot: "scrollBot-2HHpZNuf-",
        scrollTop: "scrollTop-1eXi8ltS-",
        isVisible: "isVisible-3zZOL3TO-",
        iconWrap: "iconWrap-2Q69rfEO-",
        fadeBot: "fadeBot-3JstnoWq-",
        fadeTop: "fadeTop-3oJzNyTq-",
      };
    },
    v1bN: function (e, t, o) {
      e.exports = {
        item: "item-2xPVYue0-",
        hovered: "hovered-1uf45E05-",
        isDisabled: "isDisabled-1wLqKupj-",
        isActive: "isActive-2j-GhQs_-",
        icon: "icon-2Qm7YIcz-",
        shortcut: "shortcut-30pveiCO-",
        toolbox: "toolbox-3ulPxfe--",
        withIcon: "withIcon-1xBjf-oB-",
        labelRow: "labelRow-3Q0rdE8--",
        label: "label-3Xqxy756-",
        showOnHover: "showOnHover-1q6ySzZc-",
      };
    },
    ybOa: function (e, t, o) {
      e.exports = {
        toggleButton: "toggleButton-3TAD9tll-",
        collapsed: "collapsed-2PwwPYYB-",
        background: "background-1bSnR2Ey-",
        arrow: "arrow-liYbPQ3o-",
      };
    },
    "ycI/": function (e, t, o) {
      "use strict";
      var n, i, r;
      o.d(t, "a", function () {
        return r;
      }),
        (n = o("mrSG")),
        (i = o("q1tI")),
        (r = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._handleKeyDown = function (e) {
                e.keyCode === t.props.keyCode && t.props.handler(e);
              }),
              t
            );
          }
          return (
            n.__extends(t, e),
            (t.prototype.componentDidMount = function () {
              document.addEventListener(this.props.eventType || "keydown", this._handleKeyDown, !1);
            }),
            (t.prototype.componentWillUnmount = function () {
              document.removeEventListener(this.props.eventType || "keydown", this._handleKeyDown, !1);
            }),
            (t.prototype.render = function () {
              return null;
            }),
            t
          );
        })(i.PureComponent));
    },
  },
]);
