/* eslint-disable react/no-find-dom-node */
(window.webpackJsonp = window.webpackJsonp || []).push([
  ["new-edit-object-dialog"],
  {
    "/Hwa": function (e, t, n) {
      "use strict";
      var r, o, i;
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (r = n("mrSG")),
        (o = n("q1tI")),
        (i = n("17x9")),
        (t.makeSwitchGroupItem = function (e) {
          return (
            ((t = (function (t) {
              function n() {
                var e = (null !== t && t.apply(this, arguments)) || this;
                return (
                  (e._onChange = function (t) {
                    e.context.switchGroupContext.getOnChange()(t);
                  }),
                  (e._onUpdate = function (t) {
                    t.includes(e.props.value) && e.forceUpdate();
                  }),
                  e
                );
              }
              return (
                r.__extends(n, t),
                (n.prototype.componentDidMount = function () {
                  this.context.switchGroupContext.subscribe(this._onUpdate);
                }),
                (n.prototype.render = function () {
                  return o.createElement(
                    e,
                    r.__assign({}, this.props, {
                      name: this._getName(),
                      onChange: this._onChange,
                      checked: this._isChecked(),
                    })
                  );
                }),
                (n.prototype.componentWillUnmount = function () {
                  this.context.switchGroupContext.unsubscribe(this._onUpdate);
                }),
                (n.prototype._getName = function () {
                  return this.context.switchGroupContext.getName();
                }),
                (n.prototype._isChecked = function () {
                  return this.context.switchGroupContext.getValues().includes(this.props.value);
                }),
                n
              );
            })(o.PureComponent)).contextTypes = { switchGroupContext: i.any.isRequired }),
            t
          );
          var t;
        });
    },
    "/YRR": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l5-5a1.414 1.414 0 0 1 2 0m11-1l-5 5a1.414 1.414 0 0 1-2 0"/><path fill="currentColor" d="M14 5h1v2h-1zM14 10h1v2h-1zM14 15h1v2h-1zM14 20h1v2h-1z"/></svg>';
    },
    "01Ho": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14.354 6.646L14 6.293l-.354.353-7 7-.353.354.353.354 7 7 .354.353.354-.353 7-7 .353-.354-.353-.354-7-7z"/></svg>';
    },
    "0Mig": function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n("mrSG");
      r.__exportStar(n("omE6"), t), r.__exportStar(n("/Hwa"), t);
    },
    "1Kfe": function (e, t, n) {
      e.exports = {
        container: "container-3jqXx6VY-",
        sectionTitle: "sectionTitle-14f4vHhw-",
        separator: "separator-37206dUD-",
        customButton: "customButton-1OVL2GM7-",
      };
    },
    "4Njr": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14 21l7.424-6.114a.5.5 0 0 0-.318-.886H18.5V7h-9v7H6.894a.5.5 0 0 0-.318.886L14 21z"/></svg>';
    },
    "4ZyK": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M8.5 22v-5.5m0 0v-8L12 7l4 2.5 3.5-1v8l-3.5 1-4-2.5-3.5 1.5z"/></svg>';
    },
    "5VK0": function (e, t, n) {
      e.exports = {
        scrollWrap: "scrollWrap-hMorJ3oa-",
        tabsWrap: "tabsWrap-DW4tJckL-",
        tabs: "tabs-2ZEU3acm-",
        tab: "tab-1l4dFt6c-",
        withHover: "withHover-1_-qVdZP-",
        headerBottomSeparator: "headerBottomSeparator-1v9qLLAy-",
      };
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
    "6ix9": function (e, t, n) {
      e.exports = {
        content: "content-jw-2aYgg-",
        cell: "cell-hIDC3uV--",
        inner: "inner--hn7i_PK-",
        first: "first-2n3flLMC-",
        fill: "fill-1Pff_fQf-",
        last: "last-3u0rzQsJ-",
        top: "top-E6bk4zZh-",
        grouped: "grouped-HUhXUUdM-",
        separator: "separator-27YVz1Zr-",
        groupSeparator: "groupSeparator-3LbEcdXc-",
        adaptive: "adaptive-3nNVfvpI-",
      };
    },
    "7yjv": function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n("TSYQ");
      t.getButtonClasses = function (e, t) {
        var n = t.intent,
          o = void 0 === n ? "primary" : n,
          i = t.size,
          a = void 0 === i ? "m" : i,
          s = t.appearance,
          l = void 0 === s ? "default" : s,
          c = t.useFullWidth,
          u = void 0 !== c && c,
          p = t.tabIndex,
          d = void 0 === p ? 0 : p,
          h = t.icon,
          m = t.className;
        return r(
          m,
          e.button,
          e["size-" + a],
          e["intent-" + o],
          e["appearance-" + l],
          u && e["full-width"],
          -1 === d && e.noOutline,
          h && "s" !== a && e["with-icon"]
        );
      };
    },
    "8E5s": function (e) {
      e.exports = {
        switcherWrapper: "switcherWrapper-1wFH-_jm-",
        input: "input-J7QIcTTo-",
        switcherThumbWrapper: "switcherThumbWrapper-2u191lDO-",
        switcherTrack: "switcherTrack-2XruDVTa-",
        switcherThumb: "switcherThumb-2yuEucci-",
        focus: "focus-uZMRkCO0-",
      };
    },
    "9+jD": function (e, t, n) {
      e.exports = { scrollable: "scrollable-2JmGKstT-" };
    },
    "91aW": function (e, t, n) {
      e.exports = {
        colorPickerWrap: "colorPickerWrap-g7MZN9Dl-",
        isFocused: "isFocused-3wuPc5Da-",
        readonly: "readonly-2Xub3oHm-",
        disabled: "disabled-24dvPoDK-",
        error: "error-31TTEMpu-",
        input: "input-2GDyVcsR-",
        colorPicker: "colorPicker-2OGp6qQ6-",
        swatch: "swatch-3YbCY5LA-",
        white: "white-LBubMjih-",
        opacitySwatch: "opacitySwatch-rUAVaCZe-",
        colorLine: "colorLine-2IHeLUz--",
        thicknessContainer: "thicknessContainer-1FjUUtPP-",
        thicknessTitle: "thicknessTitle-2dGkHaSV-",
      };
    },
    "95N5": function (e, t, n) {
      e.exports = {
        wrap: "wrap-3KIz6IQG-",
        thicknessItem: "thicknessItem-1D40arGe-",
        checked: "checked-pDy7EtmX-",
        radio: "radio-mk150mXO-",
        bar: "bar-3l4jwcsX-",
      };
    },
    "9FXF": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M6.5 12.5v8h3v-8h-3zM12.5 7.5v13h3v-13h-3zM18.5 15.5v5h3v-5h-3z"/></svg>';
    },
    "9XXR": function (e, t, n) {
      "use strict";
      function r(e, t) {
        var n, r;
        return (
          void 0 === t && (t = "&nbsp;"),
          -1 !== (n = e + "").indexOf("e") &&
            (n = (function (e) {
              return Object(o.fixComputationError)(e)
                .toFixed(10)
                .replace(/\.?0+$/, "");
            })(Number(e))),
          (r = n.split("."))[0].replace(/\B(?=(\d{3})+(?!\d))/g, t) + (r[1] ? "." + r[1] : "")
        );
      }
      var o;
      n.r(t),
        n.d(t, "splitThousands", function () {
          return r;
        }),
        (o = n("ivNn"));
    },
    "9dlw": function (e, t, n) {
      "use strict";
      var r, o, i, a, s, l, c, u, p;
      n.d(t, "a", function () {
        return p;
      }),
        (r = n("mrSG")),
        (o = n("bf9a")),
        (i = n("q1tI")),
        (a = n("i8i4")),
        (s = n("17x9")),
        (l = n("RgaO")),
        (c = n("AiMB")),
        (u = n("DTHj")),
        (p = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._handleClose = function () {
                t.props.onClose();
              }),
              (t._handleClickOutside = function (e) {
                var n,
                  r = t.props,
                  o = r.closeOnClickOutside,
                  i = r.onClickOutside,
                  s = r.doNotCloseOn;
                i && i(e),
                  o &&
                    ((s &&
                      e.target instanceof Node &&
                      (n = a.findDOMNode(s)) instanceof Node &&
                      n.contains(e.target)) ||
                      t._handleClose());
              }),
              (t._handleScroll = function (e) {
                var n = t.props.onScroll;
                n && n(e), e.stopPropagation();
              }),
              t
            );
          }
          return (
            r.__extends(t, e),
            (t.prototype.componentWillReceiveProps = function (e) {
              this.props.isOpened && !e.isOpened && this.setState({ isMeasureValid: void 0 });
            }),
            (t.prototype.render = function () {
              var e = this.props,
                t = e.children,
                n = e.isOpened,
                o =
                  (e.closeOnClickOutside,
                  e.doNotCloseOn,
                  e.onClickOutside,
                  e.onClose,
                  r.__rest(e, [
                    "children",
                    "isOpened",
                    "closeOnClickOutside",
                    "doNotCloseOn",
                    "onClickOutside",
                    "onClose",
                  ]));
              return n
                ? i.createElement(
                    c.a,
                    null,
                    i.createElement(
                      l.a,
                      { handler: this._handleClickOutside, mouseDown: !0, touchStart: !0 },
                      i.createElement(
                        u.a,
                        r.__assign({}, o, {
                          isOpened: n,
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
        })(i.PureComponent));
    },
    CZlE: function (e, t, n) {
      "use strict";
      var r, o, i, a;
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (r = n("mrSG")),
        (o = n("q1tI")),
        (i = n("TSYQ")),
        (a = n("OxS6")),
        n("mR1d"),
        (t.makeIcon = function (e) {
          return (function (t) {
            function n() {
              return (null !== t && t.apply(this, arguments)) || this;
            }
            return (
              r.__extends(n, t),
              (n.prototype.render = function () {
                var t = i(a.icon, this.props.className);
                return o.createElement("div", { className: t, dangerouslySetInnerHTML: { __html: e } });
              }),
              n
            );
          })(o.PureComponent);
        });
    },
    Ce4d: function (e, t, n) {
      e.exports = {
        container: "container-AqxbM340-",
        isFocused: "isFocused-7mTKfuzg-",
        readonly: "readonly-3YlYTz9Q-",
        disabled: "disabled-3kisU58M-",
        error: "error-2iYMTIjO-",
        input: "input-1U-fFP73-",
        placeholder: "placeholder-3IHl8nis-",
        selected: "selected-2IjEMdXr-",
        hiddenArrow: "hiddenArrow-1HtcxiMc-",
        button: "button-yGQ2leGL-",
        isOpen: "isOpen-2Z30Tav4-",
        icon: "icon-1UiKQ-Y--",
      };
    },
    D2im: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M17 8.5h7M20.5 12V5M10 19.5h7M13.5 23v-7M3 12.5h7M6.5 16V9"/></svg>';
    },
    DXuF: function (e, t, n) {
      e.exports = {
        swatches: "swatches-2NO2y7Xs-",
        swatch: "swatch-CMyFZXry-",
        empty: "empty-1lteEy1B-",
        white: "white-RBcZELAh-",
        selected: "selected-3mQR-gqr-",
      };
    },
    Dj0x: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M11 18.5h-.5V8.793l.146-.147 3-3L14 5.293l.354.353 3 3 .146.147V18.5H11z"/></svg>';
    },
    FgZj: function (e, t, n) {},
    "H+g1": function (e, t, n) {
      "use strict";
      var r, o, i, a, s, l, c;
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (r = n("mrSG")),
        (o = n("q1tI")),
        (i = n("TSYQ")),
        (a = n("0Mig")),
        (s = n("Lv+c")),
        (l = n("eHOe")),
        n("FgZj"),
        (c = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._onChange = function () {
                t.props.onChange && t.props.onChange(t.props.value);
              }),
              t
            );
          }
          return (
            r.__extends(t, e),
            (t.prototype.render = function () {
              var e,
                t,
                n,
                r = i(
                  this.props.className,
                  l.checkbox,
                  (((e = {})[l.reverse] = Boolean(this.props.labelPositionReverse)), e)
                ),
                a = i(
                  l.box,
                  (((t = {})[l.check] = !Boolean(this.props.indeterminate)),
                  (t[l.dot] = Boolean(this.props.indeterminate)),
                  (t[l.noOutline] = -1 === this.props.tabIndex),
                  t)
                ),
                c = i(l.label, (((n = {})[l.disabled] = this.props.disabled), n)),
                u = null;
              return (
                this.props.label && (u = o.createElement("span", { className: c }, this.props.label)),
                o.createElement(
                  "label",
                  { className: r },
                  o.createElement(
                    "div",
                    { className: l.wrapper, title: this.props.title },
                    o.createElement("input", {
                      id: this.props.id,
                      tabIndex: this.props.tabIndex,
                      className: l.input,
                      type: "checkbox",
                      name: this.props.name,
                      checked: this.props.checked,
                      disabled: this.props.disabled,
                      value: this.props.value,
                      autoFocus: this.props.autoFocus,
                      role: this.props.role,
                      onChange: this._onChange,
                      ref: this.props.reference,
                    }),
                    o.createElement("div", { className: a }, o.createElement(s.CheckIcon, { className: l.icon }))
                  ),
                  u
                )
              );
            }),
            (t.defaultProps = { value: "on" }),
            t
          );
        })(o.PureComponent)),
        (t.Checkbox = c),
        (t.GroupedCheckbox = a.makeSwitchGroupItem(c));
    },
    Hk3L: function (e, t, n) {
      e.exports = {
        container: "container-2kDJVADV-",
        isFocused: "isFocused-ypbVKrsj-",
        readonly: "readonly-3PcaDYes-",
        disabled: "disabled-3y5wOPXy-",
        error: "error-3omEaj9F-",
        input: "input-1Fp9QlzO-",
        thickBorder: "thickBorder-3W4KWCy_-",
        "intent-success": "intent-success-2qRddKlF-",
        "intent-warning": "intent-warning-3nKtF1a7-",
        "intent-danger": "intent-danger-2UcBu3hY-",
        "intent-primary": "intent-primary-1GPjPo8I-",
        icon: "icon-1S_6X6gw-",
        iconRight: "iconRight-yLWVMTca-",
      };
    },
    K3s3: function (e, t, n) {
      "use strict";
      function r(e) {
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
        return a.createElement("div", { className: n, onClick: e.onClick, ref: e.reference }, e.children);
      }
      function o(e) {
        return (function (t) {
          function n() {
            var e = (null !== t && t.apply(this, arguments)) || this;
            return (e.activeTab = { current: null }), e;
          }
          return (
            i.__extends(n, t),
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
                r = this._generateTabs();
              return a.createElement(
                "div",
                { className: s(n, c.tabs) },
                r,
                a.createElement(e, {
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
                a.Children.map(this.props.children, function (t) {
                  var n = t,
                    r = Boolean(n.props.isActive),
                    o = {
                      reference: function (t) {
                        r && (e.activeTab.current = t), n.props.reference && n.props.reference(t);
                      },
                    };
                  return a.cloneElement(n, o);
                })
              );
            }),
            (n.prototype._componentDidUpdate = function () {
              var e,
                t,
                n = Object(l.ensureNotNull)(this._slider),
                r = n.style;
              this.activeTab.current
                ? ((e = this.activeTab.current.offsetWidth),
                  (t = this.activeTab.current.offsetLeft),
                  (r.transform = "translateX(" + t + "px)"),
                  (r.width = e + "px"),
                  (r.opacity = "1"))
                : (r.opacity = "0");
            }),
            n
          );
        })(a.PureComponent);
      }
      var i, a, s, l, c, u;
      n.d(t, "a", function () {
        return u;
      }),
        n.d(t, "b", function () {
          return r;
        }),
        n.d(t, "c", function () {
          return o;
        }),
        (i = n("mrSG")),
        (a = n("q1tI")),
        (s = n("TSYQ")),
        (l = n("Eyy1")),
        (c = n("5o6O")),
        (u = c),
        o(function (e) {
          return a.createElement("div", { className: c.slider, ref: e.reference });
        });
    },
    KKsp: function (e, t, n) {
      "use strict";
      function r(e) {
        return o.createElement("div", { className: i.separator });
      }
      var o, i;
      n.d(t, "a", function () {
        return r;
      }),
        (o = n("q1tI")),
        (i = n("NOPy"));
    },
    KLV3: function (e) {
      e.exports = {
        button: "button-1iktpaT1-",
        content: "content-2PGssb8d-",
        noOutline: "noOutline-d9Yp4qvi-",
        "appearance-default": "appearance-default-dMjF_2Hu-",
        "intent-primary": "intent-primary-1-IOYcbg-",
        "intent-success": "intent-success-25a4XZXM-",
        "intent-default": "intent-default-2ZbSqQDs-",
        "intent-warning": "intent-warning-24j5HMi0-",
        "intent-danger": "intent-danger-1EETHCla-",
        "appearance-stroke": "appearance-stroke-12lxiUSM-",
        "appearance-text": "appearance-text-DqKJVT3U-",
        "size-s": "size-s-3mait84m-",
        "size-m": "size-m-2G7L7Qat-",
        "size-l": "size-l-2NEs9_xt-",
        "full-width": "full-width-1wU8ljjC-",
        "with-icon": "with-icon-yumghDr--",
        icon: "icon-1grlgNdV-",
      };
    },
    "Lv+c": function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }), n("mrSG").__exportStar(n("mD/u"), t);
    },
    Ly1u: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M7.5 7.5h13v13h-13z"/></svg>';
    },
    N5tr: function (e, t, n) {
      "use strict";
      function r(e) {
        return a.createElement(e.href ? "a" : "div", e);
      }
      function o(e) {
        e.stopPropagation();
      }
      var i, a, s, l, c, u, p, d;
      n.d(t, "a", function () {
        return d;
      }),
        (i = n("mrSG")),
        (a = n("q1tI")),
        (s = n("TSYQ")),
        (l = n("tWVy")),
        (c = n("tITk")),
        (u = n("QpNh")),
        (p = n("v1bN")),
        (d = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._handleClick = function (e) {
                var n = t.props,
                  r = n.dontClosePopup,
                  o = n.isDisabled,
                  i = n.onClick,
                  a = n.onClickArg,
                  s = n.trackEventObject;
                o || (s && Object(c.trackEvent)(s.category, s.event, s.label), i && i(a, e), r || Object(l.b)());
              }),
              (t._handleMouseUp = function (e) {
                var n = t.props,
                  r = n.link,
                  o = n.trackEventObject;
                1 === e.button && r && o && Object(c.trackEvent)(o.category, o.event, o.label);
              }),
              (t._formatShortcut = function (e) {
                return e && e.split("+").join(" + ");
              }),
              t
            );
          }
          return (
            i.__extends(t, e),
            (t.prototype.render = function () {
              var e,
                t,
                n = this.props,
                l = n.className,
                c = n.shortcut,
                d = n.forceShowShortcuts,
                h = n.icon,
                m = n.isActive,
                f = n.isDisabled,
                v = n.isHovered,
                _ = n.appearAsDisabled,
                g = n.label,
                y = n.link,
                b = n.showToolboxOnHover,
                C = n.target,
                w = n.toolbox,
                E = n.theme,
                S = void 0 === E ? p : E,
                x = Object(u.a)(this.props);
              return a.createElement(
                r,
                i.__assign({}, x, {
                  className: s(
                    l,
                    S.item,
                    h && S.withIcon,
                    ((e = {}), (e[S.isActive] = m), (e[S.isDisabled] = f || _), (e[S.hovered] = v), e)
                  ),
                  href: y,
                  target: C,
                  onClick: this._handleClick,
                  onMouseUp: this._handleMouseUp,
                }),
                void 0 !== h && a.createElement("div", { className: S.icon, dangerouslySetInnerHTML: { __html: h } }),
                a.createElement("div", { className: S.labelRow }, a.createElement("div", { className: S.label }, g)),
                (void 0 !== c || d) && a.createElement("div", { className: S.shortcut }, this._formatShortcut(c)),
                void 0 !== w &&
                  a.createElement(
                    "div",
                    { onClick: o, className: s(S.toolbox, ((t = {}), (t[S.showOnHover] = b), t)) },
                    w
                  )
              );
            }),
            t
          );
        })(a.PureComponent));
    },
    NOPy: function (e, t, n) {
      e.exports = { separator: "separator-25lkUpN--" };
    },
    OP2o: function (e, t, n) {
      e.exports = {
        wrapper: "wrapper-3Sj-FzgR-",
        hovered: "hovered-1G0yygIe-",
        labelRow: "labelRow-3h7cSJ_L-",
        label: "label-3iLxp29M-",
        labelOn: "labelOn-10QGwv2n-",
        labelHint: "labelHint-3qxeiVfa-",
      };
    },
    Oqo1: function (e, t, n) {
      e.exports = {
        opacity: "opacity-2aYjtVUz-",
        opacitySlider: "opacitySlider-2S5vLqQZ-",
        opacitySliderGradient: "opacitySliderGradient-1uUWtQAG-",
        pointer: "pointer-3pBhp8nL-",
        dragged: "dragged-1FWLoCMd-",
        opacityPointerWrap: "opacityPointerWrap-133eLPOE-",
        opacityInputWrap: "opacityInputWrap-1okRhpq9-",
        opacityInput: "opacityInput-1A9bqplo-",
        opacityInputPercent: "opacityInputPercent-n0mDvs0P-",
      };
    },
    OxS6: function (e) {
      e.exports = { icon: "icon-3qYrZx7p-" };
    },
    "R4+T": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 8" width="16" height="8"><path fill="currentColor" d="M0 1.475l7.396 6.04.596.485.593-.49L16 1.39 14.807 0 7.393 6.122 8.58 6.12 1.186.08z"/></svg>';
    },
    UXdH: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path fill="currentColor" d="M4 13h5v1H4v-1zM12 13h5v1h-5v-1zM20 13h5v1h-5v-1z"/></svg>';
    },
    V1YL: function (e, t, n) {
      e.exports = {
        recalculateCheckbox: "recalculateCheckbox-1Xa1TR7D-",
        descriptionCell: "descriptionCell-3oIbGAm4-",
      };
    },
    VKCZ: function (e, t, n) {
      "use strict";
      var r, o, i, a;
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (r = n("mrSG")),
        (o = n("q1tI")),
        (i = n("7yjv")),
        (a = n("KLV3")),
        n("cEAz"),
        (t.Button = function (e) {
          var t = e.intent,
            n = e.size,
            s = e.appearance,
            l = e.disabled,
            c = e.useFullWidth,
            u = e.reference,
            p = e.icon,
            d = e.children,
            h = e.tabIndex,
            m = r.__rest(e, [
              "intent",
              "size",
              "appearance",
              "disabled",
              "useFullWidth",
              "reference",
              "icon",
              "children",
              "tabIndex",
            ]),
            f = i.getButtonClasses(a, {
              intent: t,
              size: n,
              appearance: s,
              disabled: l,
              useFullWidth: c,
              tabIndex: h,
              icon: p,
            });
          return o.createElement(
            "button",
            r.__assign({ className: f, disabled: l, ref: u, tabIndex: h }, m),
            p && "s" !== n && o.createElement("span", { className: a.icon }, p),
            o.createElement("span", { className: a.content }, d)
          );
        });
    },
    WIlE: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }), n("mrSG").__exportStar(n("l5G/"), t);
    },
    "XhS/": function (e, t, n) {
      "use strict";
      var r, o, i, a;
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (r = n("mrSG")),
        (o = n("q1tI")),
        (i = n("7yjv")),
        (a = n("KLV3")),
        n("cEAz"),
        (t.AnchorButton = function (e) {
          var t = e.intent,
            n = e.size,
            s = e.appearance,
            l = e.disabled,
            c = e.useFullWidth,
            u = e.reference,
            p = e.icon,
            d = e.children,
            h = e.href,
            m = e.tabIndex,
            f = r.__rest(e, [
              "intent",
              "size",
              "appearance",
              "disabled",
              "useFullWidth",
              "reference",
              "icon",
              "children",
              "href",
              "tabIndex",
            ]),
            v = i.getButtonClasses(a, {
              intent: t,
              size: n,
              appearance: s,
              disabled: l,
              useFullWidth: c,
              tabIndex: m,
              icon: p,
            });
          return o.createElement(
            "a",
            r.__assign({ className: v, href: l ? void 0 : h, "aria-disabled": l, ref: u, tabIndex: m }, f),
            p && "s" !== n && o.createElement("span", { className: a.icon }, p),
            o.createElement("span", { className: a.content }, d)
          );
        });
    },
    ZOCd: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 9" width="11" height="9" fill="none"><path stroke-width="2" d="M0.999878 4L3.99988 7L9.99988 1"/></svg>';
    },
    "ZSM+": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor"><circle cx="9" cy="14" r="1"/><circle cx="4" cy="14" r="1"/><circle cx="14" cy="14" r="1"/><circle cx="19" cy="14" r="1"/><circle cx="24" cy="14" r="1"/></svg>';
    },
    "ZgM/": function (e, t, n) {
      e.exports = {
        inputWithErrorWrapper: "inputWithErrorWrapper-3VldItns-",
        disabled: "disabled-1H5pTmbC-",
        thickBorder: "thickBorder-17UV-SuS-",
        readonly: "readonly-3wmbSVwP-",
        focused: "focused-3rk113Ah-",
        innerInput: "innerInput-29Ku0bwF-",
        error: "error-32uXEKXM-",
        inputWithError: "inputWithError-1wKt_k8s-",
        inputContainer: "inputContainer-2JfcvOzg-",
        inputContainerFix: "inputContainerFix-3bYyvsOT-",
        innerInputContainer: "innerInputContainer-FSOtBYl0-",
        innerInputFix: "innerInputFix-3nQEuMmn-",
        errorMessage: "errorMessage-3U3e1ayv-",
        iconBlock: "iconBlock-1uOkuIhU-",
      };
    },
    ZtdB: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M4.5 20v-7m3 7V10m3 10V8m3 12V10m3 10v-8m3 8V10m3 10V8"/></svg>';
    },
    bQEj: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M4 13.5h20"/></svg>';
    },
    br6c: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><circle stroke="currentColor" cx="14" cy="14" r="6.5"/></svg>';
    },
    cEAz: function (e, t, n) {},
    chcq: function (e, t, n) {},
    dMmr: function (e, t, n) {
      e.exports = { slider: "slider-2TOmsMP8-", inner: "inner-21p4mP7K-" };
    },
    dWaX: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 }), n("mrSG").__exportStar(n("H+g1"), t);
    },
    eHOe: function (e) {
      e.exports = {
        checkbox: "checkbox-3xZUD-2M-",
        input: "input-ly-CSnj5-",
        box: "box-20C92a5S-",
        reverse: "reverse-3xeTx96y-",
        label: "label-cyItEVpF-",
        wrapper: "wrapper-1AZBBaMW-",
        icon: "icon-3dOOKDQo-",
        noOutline: "noOutline-3wgQ5xZI-",
        check: "check-13mv3fTM-",
        dot: "dot-3FRmUbXl-",
      };
    },
    flzi: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M19.424 16.735l.478.765H8.098l.478-.765 5-8L14 8.057l.424.678 5 8z"/></svg>';
    },
    iB0j: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M9 9l11 11M9 20L20 9"/></svg>';
    },
    "jpE+": function (e, t, n) {
      e.exports = {
        hue: "hue-2mlXxlkM-",
        pointer: "pointer-3fNcCimp-",
        pointerContainer: "pointerContainer-1T_sOwrr-",
      };
    },
    kMtk: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M11 8.5h-.5v9.707l.146.147 3 3 .354.353.354-.353 3-3 .146-.147V8.5H11z"/></svg>';
    },
    "l5G/": function (e, t, n) {
      "use strict";
      var r, o, i, a, s;
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (r = n("mrSG")),
        (o = n("q1tI")),
        (i = n("TSYQ")),
        (a = n("8E5s")),
        n("chcq"),
        (s = (function (e) {
          function t() {
            return (null !== e && e.apply(this, arguments)) || this;
          }
          return (
            r.__extends(t, e),
            (t.prototype.render = function () {
              var e = this.props,
                t = e.className,
                n = e.reference,
                s = r.__rest(e, ["className", "reference"]),
                l = i(a.input, -1 !== this.props.tabIndex && a.focus);
              return o.createElement(
                "div",
                { className: i(t, a.switcherWrapper) },
                o.createElement("input", r.__assign({}, s, { type: "checkbox", className: l, ref: n })),
                o.createElement(
                  "div",
                  { className: a.switcherThumbWrapper },
                  o.createElement("div", { className: a.switcherTrack }),
                  o.createElement("div", { className: a.switcherThumb })
                )
              );
            }),
            t
          );
        })(o.PureComponent)),
        (t.Switch = s);
    },
    lOpG: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M14 7l7.424 6.114a.5.5 0 0 1-.318.886H18.5v7h-9v-7H6.894a.5.5 0 0 1-.318-.886L14 7z"/></svg>';
    },
    lY1a: function (e, t, n) {
      e.exports = { saturation: "saturation-2SLmW8C--", pointer: "pointer-2fX2g8ap-" };
    },
    leq5: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M19.424 11.265l.478-.765H8.098l.478.765 5 8 .424.678.424-.678 5-8z"/></svg>';
    },
    "m+Gx": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28"><path stroke="currentColor" d="M9 14.5h11M14.5 20V9"/></svg>';
    },
    "mD/u": function (e, t, n) {
      "use strict";
      var r, o;
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (r = n("CZlE")),
        (o = n("ZOCd")),
        (t.CheckIcon = r.makeIcon(o));
    },
    mPKq: function (e, t, n) {
      e.exports = {
        itemWrap: "itemWrap-1l2e2sHG-",
        item: "item-Nzo-hGTv-",
        icon: "icon-P5EULTkT-",
        selected: "selected-1XdidPev-",
        label: "label-1SpxmZgG-",
      };
    },
    mR1d: function (e, t, n) {},
    mZ7d: function (e, t, n) {
      e.exports = {
        dialog: "dialog-JRH26tka-",
        wrapper: "wrapper-2B9fDla2-",
        header: "header-1kCeIimW-",
        title: "title-PguUJuCM-",
        ellipsis: "ellipsis-2RjgOBwv-",
        defaultsButtonText: "defaultsButtonText-1AOMd0Vb-",
        defaultsButtonItem: "defaultsButtonItem-28r4w14T-",
        closeButton: "closeButton-2hAsmqaP-",
        okButton: "okButton-1Y7fzF0C-",
        footer: "footer-2ulFfvmF-",
        footerLeft: "footerLeft-3evpQgST-",
      };
    },
    nc0P: function (e, t, n) {
      var r;
      !(function (o) {
        "use strict";
        function i(e, t, n, r) {
          var o = e.c,
            i = e.e + t + 1;
          if (i < o.length) {
            if (1 === n) r = o[i] >= 5;
            else if (2 === n) r = o[i] > 5 || (5 == o[i] && (r || i < 0 || o[i + 1] !== g || 1 & o[i - 1]));
            else if (3 === n) r = r || !!o[0];
            else if (((r = !1), 0 !== n)) throw Error(v);
            if (i < 1) (o.length = 1), r ? ((e.e = -t), (o[0] = 1)) : (o[0] = e.e = 0);
            else {
              if (((o.length = i--), r)) for (; ++o[i] > 9; ) (o[i] = 0), i-- || (++e.e, o.unshift(1));
              for (i = o.length; !o[--i]; ) o.pop();
            }
          } else if (n < 0 || n > 3 || n !== ~~n) throw Error(v);
          return e;
        }
        function a(e, t, n, r) {
          var o,
            a,
            s = e.constructor,
            l = !e.c[0];
          if (n !== g) {
            if (n !== ~~n || n < (3 == t) || n > u) throw Error(3 == t ? m + "precision" : f);
            for (
              n = r - (e = new s(e)).e, e.c.length > ++r && i(e, n, s.RM), 2 == t && (r = e.e + n + 1);
              e.c.length < r;

            )
              e.c.push(0);
          }
          if (
            ((o = e.e),
            (n = (a = e.c.join("")).length),
            2 != t && (1 == t || (3 == t && r <= o) || o <= s.NE || o >= s.PE))
          )
            a = a.charAt(0) + (n > 1 ? "." + a.slice(1) : "") + (o < 0 ? "e" : "e+") + o;
          else if (o < 0) {
            for (; ++o; ) a = "0" + a;
            a = "0." + a;
          } else if (o > 0)
            if (++o > n) for (o -= n; o--; ) a += "0";
            else o < n && (a = a.slice(0, o) + "." + a.slice(o));
          else n > 1 && (a = a.charAt(0) + "." + a.slice(1));
          return e.s < 0 && (!l || 4 == t) ? "-" + a : a;
        }
        var s,
          l = 20,
          c = 1,
          u = 1e6,
          p = -7,
          d = 21,
          h = "[big.js] ",
          m = h + "Invalid ",
          f = m + "decimal places",
          v = m + "rounding mode",
          _ = {},
          g = void 0,
          y = /^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
        (_.abs = function () {
          var e = new this.constructor(this);
          return (e.s = 1), e;
        }),
          (_.cmp = function (e) {
            var t,
              n = this,
              r = n.c,
              o = (e = new n.constructor(e)).c,
              i = n.s,
              a = e.s,
              s = n.e,
              l = e.e;
            if (!r[0] || !o[0]) return r[0] ? i : o[0] ? -a : 0;
            if (i != a) return i;
            if (((t = i < 0), s != l)) return (s > l) ^ t ? 1 : -1;
            for (a = (s = r.length) < (l = o.length) ? s : l, i = -1; ++i < a; )
              if (r[i] != o[i]) return (r[i] > o[i]) ^ t ? 1 : -1;
            return s == l ? 0 : (s > l) ^ t ? 1 : -1;
          }),
          (_.div = function (e) {
            var t,
              n,
              r,
              o,
              a,
              s,
              l,
              c,
              p,
              d,
              h,
              m,
              v,
              _,
              y = this,
              b = y.constructor,
              C = y.c,
              w = (e = new b(e)).c,
              E = y.s == e.s ? 1 : -1,
              S = b.DP;
            if (S !== ~~S || S < 0 || S > u) throw Error(f);
            if (!w[0]) throw Error("[big.js] Division by zero");
            if (!C[0]) return new b(0 * E);
            for (
              s = w.slice(),
                l = t = w.length,
                c = C.length,
                d = (p = C.slice(0, t)).length,
                m = (h = e).c = [],
                v = 0,
                _ = S + (h.e = y.e - e.e) + 1,
                h.s = E,
                E = _ < 0 ? 0 : _,
                s.unshift(0);
              d++ < t;

            )
              p.push(0);
            do {
              for (r = 0; r < 10; r++) {
                if (t != (d = p.length)) o = t > d ? 1 : -1;
                else
                  for (a = -1, o = 0; ++a < t; )
                    if (w[a] != p[a]) {
                      o = w[a] > p[a] ? 1 : -1;
                      break;
                    }
                if (!(o < 0)) break;
                for (n = d == t ? w : s; d; ) {
                  if (p[--d] < n[d]) {
                    for (a = d; a && !p[--a]; ) p[a] = 9;
                    --p[a], (p[d] += 10);
                  }
                  p[d] -= n[d];
                }
                for (; !p[0]; ) p.shift();
              }
              (m[v++] = o ? r : ++r), p[0] && o ? (p[d] = C[l] || 0) : (p = [C[l]]);
            } while ((l++ < c || p[0] !== g) && E--);
            return m[0] || 1 == v || (m.shift(), h.e--), v > _ && i(h, S, b.RM, p[0] !== g), h;
          }),
          (_.eq = function (e) {
            return !this.cmp(e);
          }),
          (_.gt = function (e) {
            return this.cmp(e) > 0;
          }),
          (_.gte = function (e) {
            return this.cmp(e) > -1;
          }),
          (_.lt = function (e) {
            return this.cmp(e) < 0;
          }),
          (_.lte = function (e) {
            return this.cmp(e) < 1;
          }),
          (_.minus = _.sub =
            function (e) {
              var t,
                n,
                r,
                o,
                i,
                a,
                s,
                l,
                c = this,
                u = c.constructor,
                p = c.s,
                d = (e = new u(e)).s;
              if (p != d) return (e.s = -d), c.plus(e);
              if (((i = c.c.slice()), (a = c.e), (s = e.c), (l = e.e), !i[0] || !s[0]))
                return s[0] ? ((e.s = -d), e) : new u(i[0] ? c : 0);
              if ((p = a - l)) {
                for ((o = p < 0) ? ((p = -p), (r = i)) : ((l = a), (r = s)), r.reverse(), d = p; d--; ) r.push(0);
                r.reverse();
              } else
                for (n = ((o = i.length < s.length) ? i : s).length, p = d = 0; d < n; d++)
                  if (i[d] != s[d]) {
                    o = i[d] < s[d];
                    break;
                  }
              if ((o && ((r = i), (i = s), (s = r), (e.s = -e.s)), (d = (n = s.length) - (t = i.length)) > 0))
                for (; d--; ) i[t++] = 0;
              for (d = t; n > p; ) {
                if (i[--n] < s[n]) {
                  for (t = n; t && !i[--t]; ) i[t] = 9;
                  --i[t], (i[n] += 10);
                }
                i[n] -= s[n];
              }
              for (; 0 === i[--d]; ) i.pop();
              for (; 0 === i[0]; ) i.shift(), --l;
              return i[0] || ((e.s = 1), (i = [(l = 0)])), (e.c = i), (e.e = l), e;
            }),
          (_.mod = function (e) {
            var t,
              n = this,
              r = n.constructor,
              o = n.s,
              i = (e = new r(e)).s;
            if (!e.c[0]) throw Error("[big.js] Division by zero");
            return (
              (n.s = e.s = 1),
              (t = 1 == e.cmp(n)),
              (n.s = o),
              (e.s = i),
              t
                ? new r(n)
                : ((o = r.DP),
                  (i = r.RM),
                  (r.DP = r.RM = 0),
                  (n = n.div(e)),
                  (r.DP = o),
                  (r.RM = i),
                  this.minus(n.times(e)))
            );
          }),
          (_.plus = _.add =
            function (e) {
              var t,
                n,
                r,
                o,
                i,
                a = this,
                s = a.constructor,
                l = a.s,
                c = (e = new s(e)).s;
              if (l != c) return (e.s = -c), a.minus(e);
              if (((n = a.e), (r = a.c), (o = e.e), (i = e.c), !r[0] || !i[0]))
                return i[0] ? e : new s(r[0] ? a : 0 * l);
              if (((r = r.slice()), (l = n - o))) {
                for (l > 0 ? ((o = n), (t = i)) : ((l = -l), (t = r)), t.reverse(); l--; ) t.push(0);
                t.reverse();
              }
              for (r.length - i.length < 0 && ((t = i), (i = r), (r = t)), l = i.length, c = 0; l; r[l] %= 10)
                c = ((r[--l] = r[l] + i[l] + c) / 10) | 0;
              for (c && (r.unshift(c), ++o), l = r.length; 0 === r[--l]; ) r.pop();
              return (e.c = r), (e.e = o), e;
            }),
          (_.pow = function (e) {
            var t = this,
              n = new t.constructor(1),
              r = n,
              o = e < 0;
            if (e !== ~~e || e < -1e6 || e > 1e6) throw Error(m + "exponent");
            for (o && (e = -e); 1 & e && (r = r.times(t)), (e >>= 1); ) t = t.times(t);
            return o ? n.div(r) : r;
          }),
          (_.round = function (e, t) {
            var n = this.constructor;
            if (e === g) e = 0;
            else if (e !== ~~e || e < -u || e > u) throw Error(f);
            return i(new n(this), e, t === g ? n.RM : t);
          }),
          (_.sqrt = function () {
            var e,
              t,
              n,
              r = this,
              o = r.constructor,
              a = r.s,
              s = r.e,
              l = new o(0.5);
            if (!r.c[0]) return new o(r);
            if (a < 0) throw Error(h + "No square root");
            0 === (a = Math.sqrt(r + "")) || a === 1 / 0
              ? (((t = r.c.join("")).length + s) & 1 || (t += "0"),
                (a = Math.sqrt(t)),
                (s = (((s + 1) / 2) | 0) - (s < 0 || 1 & s)),
                (e = new o((a == 1 / 0 ? "1e" : (a = a.toExponential()).slice(0, a.indexOf("e") + 1)) + s)))
              : (e = new o(a)),
              (s = e.e + (o.DP += 4));
            do {
              (n = e), (e = l.times(n.plus(r.div(n))));
            } while (n.c.slice(0, s).join("") !== e.c.slice(0, s).join(""));
            return i(e, (o.DP -= 4), o.RM);
          }),
          (_.times = _.mul =
            function (e) {
              var t,
                n = this,
                r = n.constructor,
                o = n.c,
                i = (e = new r(e)).c,
                a = o.length,
                s = i.length,
                l = n.e,
                c = e.e;
              if (((e.s = n.s == e.s ? 1 : -1), !o[0] || !i[0])) return new r(0 * e.s);
              for (
                e.e = l + c,
                  a < s && ((t = o), (o = i), (i = t), (c = a), (a = s), (s = c)),
                  t = new Array((c = a + s));
                c--;

              )
                t[c] = 0;
              for (l = s; l--; ) {
                for (s = 0, c = a + l; c > l; )
                  (s = t[c] + i[l] * o[c - l - 1] + s), (t[c--] = s % 10), (s = (s / 10) | 0);
                t[c] = (t[c] + s) % 10;
              }
              for (s ? ++e.e : t.shift(), l = t.length; !t[--l]; ) t.pop();
              return (e.c = t), e;
            }),
          (_.toExponential = function (e) {
            return a(this, 1, e, e);
          }),
          (_.toFixed = function (e) {
            return a(this, 2, e, this.e + e);
          }),
          (_.toPrecision = function (e) {
            return a(this, 3, e, e - 1);
          }),
          (_.toString = function () {
            return a(this);
          }),
          (_.valueOf = _.toJSON =
            function () {
              return a(this, 4);
            }),
          ((s = (function e() {
            function t(n) {
              var r = this;
              if (!(r instanceof t)) return n === g ? e() : new t(n);
              n instanceof t
                ? ((r.s = n.s), (r.e = n.e), (r.c = n.c.slice()))
                : (function (e, t) {
                    var n, r, o;
                    if (0 === t && 1 / t < 0) t = "-0";
                    else if (!y.test((t += ""))) throw Error(m + "number");
                    for (
                      e.s = "-" == t.charAt(0) ? ((t = t.slice(1)), -1) : 1,
                        (n = t.indexOf(".")) > -1 && (t = t.replace(".", "")),
                        (r = t.search(/e/i)) > 0
                          ? (n < 0 && (n = r), (n += +t.slice(r + 1)), (t = t.substring(0, r)))
                          : n < 0 && (n = t.length),
                        o = t.length,
                        r = 0;
                      r < o && "0" == t.charAt(r);

                    )
                      ++r;
                    if (r == o) e.c = [(e.e = 0)];
                    else {
                      for (; o > 0 && "0" == t.charAt(--o); );
                      for (e.e = n - r - 1, e.c = [], n = 0; r <= o; ) e.c[n++] = +t.charAt(r++);
                    }
                  })(r, n),
                (r.constructor = t);
            }
            return (t.prototype = _), (t.DP = l), (t.RM = c), (t.NE = p), (t.PE = d), (t.version = "5.2.2"), t;
          })()).default = s.Big =
            s),
          void 0 ===
            (r = function () {
              return s;
            }.call(t, n, t, e)) || (e.exports = r);
      })();
    },
    omE6: function (e, t, n) {
      "use strict";
      var r, o, i, a;
      Object.defineProperty(t, "__esModule", { value: !0 }),
        (r = n("mrSG")),
        (o = n("q1tI")),
        (i = n("17x9")),
        (a = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._subscriptions = new Set()),
              (t._getName = function () {
                return t.props.name;
              }),
              (t._getValues = function () {
                return t.props.values;
              }),
              (t._getOnChange = function () {
                return t.props.onChange;
              }),
              (t._subscribe = function (e) {
                t._subscriptions.add(e);
              }),
              (t._unsubscribe = function (e) {
                t._subscriptions.delete(e);
              }),
              t
            );
          }
          return (
            r.__extends(t, e),
            (t.prototype.getChildContext = function () {
              return {
                switchGroupContext: {
                  getName: this._getName,
                  getValues: this._getValues,
                  getOnChange: this._getOnChange,
                  subscribe: this._subscribe,
                  unsubscribe: this._unsubscribe,
                },
              };
            }),
            (t.prototype.render = function () {
              return this.props.children;
            }),
            (t.prototype.componentDidUpdate = function (e) {
              this._notify(this._getUpdates(this.props.values, e.values));
            }),
            (t.prototype._notify = function (e) {
              this._subscriptions.forEach(function (t) {
                return t(e);
              });
            }),
            (t.prototype._getUpdates = function (e, t) {
              return t.concat(e).filter(function (n) {
                return t.includes(n) ? !e.includes(n) : e.includes(n);
              });
            }),
            (t.childContextTypes = { switchGroupContext: i.any.isRequired }),
            t
          );
        })(o.PureComponent)),
        (t.SwitchGroup = a);
    },
    rbFW: function (e, t, n) {
      e.exports = { focusedInput: "focusedInput-3Maf-avB-", clock: "clock-2kk8-9TY-" };
    },
    "rlj/": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 17v5.5h4v-18h4v12h4v-9h4V21"/></svg>';
    },
    "sPU+": function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M10.5 13a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM16.5 19a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0zM22.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z"/></svg>';
    },
    tDS2: function (e, t, n) {
      e.exports = {
        input: "input-2M6pUl-Q-",
        checkbox: "checkbox-15VqCFje-",
        label: "label-3rCCk0Td-",
        symbolInput: "symbolInput-1r0O05gG-",
        isFocused: "isFocused-3ps_uNFG-",
        readonly: "readonly-3HE9PFCu-",
        disabled: "disabled-3omO9UCm-",
        error: "error-3HEkUG-H-",
        dropdownMenu: "dropdownMenu-sPl98nIf-",
        sessionStart: "sessionStart-20Y_zZKF-",
        sessionEnd: "sessionEnd-Biyt0SRM-",
        sessionDash: "sessionDash-3i8ftDqe-",
        inputGroup: "inputGroup-13um8mnj-",
      };
    },
    tH7p: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 13.52v4.98a1 1 0 0 0 1 1h15a1 1 0 0 0 1-1V8.914c0-.89-1.077-1.337-1.707-.707l-4.66 4.66a1 1 0 0 1-1.332.074l-3.716-2.973a1 1 0 0 0-1.198-.039l-3.96 2.772a1 1 0 0 0-.427.82z"/></svg>';
    },
    tQCG: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M13 11.5l-1.915-1.532a1 1 0 0 0-1.198-.039l-3.96 2.772a1 1 0 0 0-.427.82V18.5a1 1 0 0 0 1 1H13m3.5-7l4.293-4.293c.63-.63 1.707-.184 1.707.707V18.5a1 1 0 0 1-1 1H16"/><path fill="currentColor" d="M14 6h1v2h-1zM14 11h1v2h-1zM14 16h1v2h-1zM14 21h1v2h-1z"/></svg>';
    },
    uJfL: function (e, t, n) {
      e.exports = {
        container: "container-1-OmVBa--",
        form: "form-1PwJY7C7-",
        swatch: "swatch-1yekatxU-",
        inputWrap: "inputWrap-11zHN5-G-",
        inputHash: "inputHash-2IZ-P-A4-",
        input: "input-35LrVJJj-",
        buttonWrap: "buttonWrap-37bmOXG9-",
        hueSaturationWrap: "hueSaturationWrap-2qtz1WJa-",
        saturation: "saturation-3duvfnxs-",
        hue: "hue-31zIOKyJ-",
      };
    },
    uZsJ: function (e, t, n) {
      e.exports = {
        controlWrapper: "controlWrapper-skuqZLfC-",
        hidden: "hidden-3NLdXwWA-",
        control: "control-1HTkHp6S-",
        controlIncrease: "controlIncrease-2YFIq5Gk-",
        controlDecrease: "controlDecrease-3RZJUOOQ-",
        increaseControlIcon: "increaseControlIcon-1tvvZsEf-",
        decreaseControlIcon: "decreaseControlIcon-O8mAFFIw-",
      };
    },
    v1bN: function (e, t, n) {
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
    vWed: function (e, t, n) {
      "use strict";
      Object.defineProperty(t, "__esModule", { value: !0 });
      var r = n("mrSG");
      r.__exportStar(n("VKCZ"), t), r.__exportStar(n("XhS/"), t);
    },
    wwEg: function (e, t, n) {
      e.exports = {
        smallStyleControl: "smallStyleControl-1XGqoHgA-",
        additionalSelect: "additionalSelect-1RoWzlTA-",
        childRowContainer: "childRowContainer-_iCnmDPI-",
        defaultSelect: "defaultSelect-DeTJWnAh-",
        defaultSelectItem: "defaultSelectItem-1jN74NCa-",
        block: "block-3Tp_jRog-",
        group: "group-2HQIdqE5-",
        wrapGroup: "wrapGroup-3gHGJIrr-",
        textMarkGraphicBlock: "textMarkGraphicBlock-1nDopgxR-",
        textMarkGraphicWrapGroup: "textMarkGraphicWrapGroup-3QaIoY03-",
      };
    },
    xHjM: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none"><path stroke="currentColor" d="M5.5 16.5l4.586-4.586a2 2 0 0 1 2.828 0l3.172 3.172a2 2 0 0 0 2.828 0L23.5 10.5"/></svg>';
    },
    yWQr: function (e, t, n) {
      "use strict";
      function r(e) {
        var t;
        return (
          ((t = (function (t) {
            function n() {
              var e = (null !== t && t.apply(this, arguments)) || this;
              return (
                (e._onChange = function (t, n, r) {
                  var o = e.context.setValue,
                    i = e.props.onChange;
                  o(n, t, r), i && i(t, n, r);
                }),
                e
              );
            }
            return (
              P.__extends(n, t),
              (n.prototype.render = function () {
                var t = this.props.input,
                  n = this.context.values;
                return b.createElement(e, P.__assign({}, this.props, { value: n[t.id], onChange: this._onChange }));
              }),
              n
            );
          })(b.PureComponent)).contextType = oe),
          t
        );
      }
      function o(e, t) {
        return (
          void 0 === t && (t = ae),
          (function (n) {
            function r(e) {
              var r = n.call(this, e) || this;
              return (
                (r._onChange = function (e, n, o) {
                  var i = t.change;
                  i
                    ? (clearTimeout(r._timeout),
                      r.setState({ value: e }, function () {
                        i !== 1 / 0 &&
                          (r._timeout = setTimeout(function () {
                            return r._flush();
                          }, i));
                      }))
                    : r._flush(e);
                }),
                (r._onBlur = function () {
                  r._debounce(t.blur);
                  var e = r.props.onBlur;
                  e && e();
                }),
                (r._onKeyDown = function (e) {
                  13 === e.keyCode && r._debounce(t.commit);
                }),
                (r.state = { prevValue: e.value, value: e.value }),
                r
              );
            }
            return (
              P.__extends(r, n),
              (r.prototype.componentWillUnmount = function () {
                this._flush();
              }),
              (r.prototype.render = function () {
                var t = this.state.value;
                return b.createElement(
                  e,
                  P.__assign({}, this.props, {
                    value: t,
                    onChange: this._onChange,
                    onBlur: this._onBlur,
                    onKeyDown: this._onKeyDown,
                  })
                );
              }),
              (r.getDerivedStateFromProps = function (e, t) {
                return e.value === t.prevValue ? t : { prevValue: e.value, value: e.value };
              }),
              (r.prototype._debounce = function (e) {
                var t = this;
                e
                  ? (clearTimeout(this._timeout),
                    e !== 1 / 0 &&
                      (this._timeout = setTimeout(function () {
                        return t._flush();
                      }, e)))
                  : this.setState(function (e) {
                      t._flush(e.value);
                    });
              }),
              (r.prototype._flush = function (e) {
                var t,
                  n = this.props,
                  r = n.input,
                  o = r.id,
                  i = r.name,
                  a = n.onChange,
                  s = this.state,
                  l = s.prevValue,
                  c = s.value;
                clearTimeout(this._timeout), (t = void 0 !== e ? e : c), a && void 0 !== t && t !== l && a(t, o, i);
              }),
              r
            );
          })(b.PureComponent)
        );
      }
      function i(e) {
        var t = k(he.control, he.controlIncrease),
          n = k(he.control, he.controlDecrease);
        return b.createElement(
          "div",
          { className: k(he.controlWrapper, !e.visible && he.hidden) },
          b.createElement(
            "div",
            { className: t, onClick: e.increaseValue },
            b.createElement(A.a, { icon: z, className: he.increaseControlIcon })
          ),
          b.createElement(
            "div",
            { className: n, onClick: e.decreaseValue },
            b.createElement(A.a, { icon: z, className: he.decreaseControlIcon })
          )
        );
      }
      function a(e, t) {
        return void 0 === t && (t = Ce), null !== e ? t.format(e) : "";
      }
      function s(e) {
        var t = e.borderStyle,
          n = void 0 === t ? "thin" : t,
          r = e.intent,
          o = void 0 === r ? "default" : r,
          i = e.className,
          a = e.disabled,
          s = e.readonly,
          l = e.icon,
          c = e.iconPosition,
          u = e.reference,
          p = e.onFocus,
          d = e.onClick,
          h = e.onBlur,
          m = P.__rest(e, [
            "borderStyle",
            "intent",
            "className",
            "disabled",
            "readonly",
            "icon",
            "iconPosition",
            "reference",
            "onFocus",
            "onClick",
            "onBlur",
          ]),
          f = Object(b.useRef)(null),
          v = (function (e) {
            var t = Object(b.useState)(!1),
              n = t[0],
              r = t[1],
              o = {
                onFocus: Object(b.useCallback)(
                  function (t) {
                    (void 0 !== e && e.current !== t.target) || r(!0);
                  },
                  [e]
                ),
                onBlur: Object(b.useCallback)(
                  function (t) {
                    (void 0 !== e && e.current !== t.target) || r(!1);
                  },
                  [e]
                ),
              };
            return [n, o];
          })(),
          _ = v[0],
          g = v[1];
        return C.a.createElement(
          "span",
          {
            className: k(
              De.container,
              i,
              De["intent-" + o],
              2 === c && De.iconRight,
              "thick" === n && De.thickBorder,
              a && De.disabled,
              s && De.readonly,
              _ && De.isFocused
            ),
            onClick: function (e) {
              var t = Object(V.ensureNotNull)(f.current);
              e.target !== t && t.focus(), d && d(e);
            },
          },
          l && C.a.createElement("span", { className: De.icon }, l),
          C.a.createElement(
            "input",
            P.__assign({}, m, {
              className: De.input,
              disabled: a,
              readOnly: s,
              onFocus: function (e) {
                g.onFocus(e), p && p(e);
              },
              onBlur: function (e) {
                g.onBlur(e), h && h(e);
              },
              ref: function (e) {
                (f.current = e), u && u(e);
              },
            })
          )
        );
      }
      function l(e, t) {
        var n = t.resolvedSymbolInfoBySymbol(e);
        return n && (n.ticker || n.full_name) ? n.ticker || n.full_name : e;
      }
      function c(e) {
        return b.createElement("div", { className: Se.inputGroup }, e.children);
      }
      function u(e) {
        return null === e ? Ge()({ hour: 0, minute: 0 }) : e;
      }
      function p(e) {
        void 0 === e && (e = "");
        var t = e.match(/^(\d\d)(\d\d)-(\d\d)(\d\d)/) || [0, 0, 0, 0, 0],
          n = t[1],
          r = t[2],
          o = t[3],
          i = t[4];
        return { startTime: Ge()({ hour: n, minute: r }), endTime: Ge()({ hour: o, minute: i }) };
      }
      function d(e) {
        return { msGridRow: e };
      }
      function h(e) {
        var t = e.property,
          n = e.model,
          r = e.inputs,
          o = e.study;
        return b.createElement(ie, { property: t.inputs, model: n, study: o }, b.createElement(It, { inputs: r }));
      }
      function m(e) {
        return "strategy_props" === e.groupId;
      }
      function f(e) {
        var t = e.study,
          n = e.model,
          r = e.inputs,
          o = e.property;
        return b.createElement(
          ie,
          { property: o, study: t, model: n },
          r.map(function (e) {
            return "bool" === e.type
              ? b.createElement(Ht, { key: e.id, label: window.t(e.name, { context: "input" }), input: e })
              : b.createElement(wt, { labelAlign: "session" === e.type ? "adaptive" : void 0, key: e.id, input: e });
          })
        );
      }
      function v(e) {
        var t,
          n,
          r,
          o,
          i,
          a,
          s,
          l,
          c,
          u,
          p,
          d,
          h,
          m = "Invalid RGB color: " + e;
        if (null === e) throw new Error(m);
        if (null === (t = e.match(/^#?([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i))) throw new Error(m);
        if (((n = t[1]), (r = t[2]), (o = t[3]), !n || !r || !o)) throw new Error(m);
        if (
          ((i = parseInt(n, 16) / 255),
          (a = parseInt(r, 16) / 255),
          (s = parseInt(o, 16) / 255),
          (d = l = Math.max(i, a, s)),
          (h = l - (c = Math.min(i, a, s))),
          (p = 0 === l ? 0 : h / l),
          l === c)
        )
          u = 0;
        else {
          switch (l) {
            case i:
              u = (a - s) / h + (a < s ? 6 : 0);
              break;
            case a:
              u = (s - i) / h + 2;
              break;
            case s:
              u = (i - a) / h + 4;
              break;
            default:
              u = 0;
          }
          u /= 6;
        }
        return { h: u, s: p, v: d };
      }
      function _(e) {
        var t = e.name,
          n = e.values,
          r = e.selectedValues,
          o = e.onChange,
          i = n.map(function (e, t) {
            return b.createElement(Yn, { key: t, value: e.toString() });
          }),
          a = r.map(function (e) {
            return e.toString();
          }),
          s = function (e) {
            o(parseInt(e));
          };
        return b.createElement(
          "div",
          { className: qn.wrap },
          b.createElement(Kn.SwitchGroup, { name: t, onChange: s, values: a }, i)
        );
      }
      function g(e) {
        return Br[e];
      }
      var y,
        b,
        C,
        w,
        E,
        S,
        x,
        P,
        k,
        N,
        O,
        T,
        I,
        M,
        D,
        j,
        L,
        B,
        V,
        R,
        F,
        A,
        W,
        H,
        z,
        U,
        G,
        K,
        q,
        Y,
        X,
        Z,
        Q,
        J,
        $,
        ee,
        te,
        ne,
        re,
        oe,
        ie,
        ae,
        se,
        le,
        ce,
        ue,
        pe,
        de,
        he,
        me,
        fe,
        ve,
        _e,
        ge,
        ye,
        be,
        Ce,
        we,
        Ee,
        Se,
        xe,
        Pe,
        ke,
        Ne,
        Oe,
        Te,
        Ie,
        Me,
        De,
        je,
        Le,
        Be,
        Ve,
        Re,
        Fe,
        Ae,
        We,
        He,
        ze,
        Ue,
        Ge,
        Ke,
        qe,
        Ye,
        Xe,
        Ze,
        Qe,
        Je,
        $e,
        et,
        tt,
        nt,
        rt,
        ot,
        it,
        at,
        st,
        lt,
        ct,
        ut,
        pt,
        dt,
        ht,
        mt,
        ft,
        vt,
        _t,
        gt,
        yt,
        bt,
        Ct,
        wt,
        Et,
        St,
        xt,
        Pt,
        kt,
        Nt,
        Ot,
        Tt,
        It,
        Mt,
        Dt,
        jt,
        Lt,
        Bt,
        Vt,
        Rt,
        Ft,
        At,
        Wt,
        Ht,
        zt,
        Ut,
        Gt,
        Kt,
        qt,
        Yt,
        Xt,
        Zt,
        Qt,
        Jt,
        $t,
        en,
        tn,
        nn,
        rn,
        on,
        an,
        sn,
        ln,
        cn,
        un,
        pn,
        dn,
        hn,
        mn,
        fn,
        vn,
        _n,
        gn,
        yn,
        bn,
        Cn,
        wn,
        En,
        Sn,
        xn,
        Pn,
        kn,
        Nn,
        On,
        Tn,
        In,
        Mn,
        Dn,
        jn,
        Ln,
        Bn,
        Vn,
        Rn,
        Fn,
        An,
        Wn,
        Hn,
        zn,
        Un,
        Gn,
        Kn,
        qn,
        Yn,
        Xn,
        Zn,
        Qn,
        Jn,
        $n,
        er,
        tr,
        nr,
        rr,
        or,
        ir,
        ar,
        sr,
        lr,
        cr,
        ur,
        pr,
        dr,
        hr,
        mr,
        fr,
        vr,
        _r,
        gr,
        yr,
        br,
        Cr,
        wr,
        Er,
        Sr,
        xr,
        Pr,
        kr,
        Nr,
        Or,
        Tr,
        Ir,
        Mr,
        Dr,
        jr,
        Lr,
        Br,
        Vr,
        Rr,
        Fr,
        Ar,
        Wr,
        Hr,
        zr,
        Ur,
        Gr,
        Kr,
        qr,
        Yr,
        Xr,
        Zr,
        Qr,
        Jr,
        $r,
        eo,
        to,
        no,
        ro,
        oo,
        io,
        ao,
        so,
        lo,
        co,
        uo,
        po,
        ho,
        mo,
        fo,
        vo,
        _o,
        go,
        yo,
        bo,
        Co,
        wo,
        Eo,
        So,
        xo,
        Po,
        ko,
        No,
        Oo,
        To,
        Io,
        Mo,
        Do,
        jo;
      for (
        n.r(t),
          n("YFKU"),
          y = n("i8i4"),
          b = n("q1tI"),
          C = n.n(b),
          n("bSeV"),
          w = n("Vdly"),
          E = n("Kxc7"),
          S = n("FQhm"),
          x = n("tITk"),
          P = n("mrSG"),
          n("bf9a"),
          k = n("TSYQ"),
          N = n.n(k),
          O = n("K3s3"),
          T = n("nPPD"),
          I = n("dMmr"),
          M = Object(T.a)(O.a, I),
          D = n("4Cm8"),
          j = n("5VK0"),
          L = Object(O.c)(function (e) {
            return b.createElement(
              "div",
              { className: M.slider, ref: e.reference },
              b.createElement("div", { className: M.inner })
            );
          }),
          B = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._createClickHandler = function (e) {
                  return function () {
                    t.props.onSelect(e);
                  };
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this._generateDialogTabs();
                return b.createElement(
                  "div",
                  { className: j.scrollWrap },
                  b.createElement("div", { className: j.headerBottomSeparator }),
                  b.createElement(
                    D.a,
                    {
                      isVisibleFade: Modernizr.mobiletouch,
                      isVisibleButtons: !Modernizr.mobiletouch,
                      isVisibleScrollbar: !1,
                    },
                    b.createElement("div", { className: j.tabsWrap }, b.createElement(L, { className: j.tabs }, e))
                  )
                );
              }),
              (t.prototype._generateDialogTabs = function () {
                var e = this,
                  t = this.props,
                  n = t.activeTabId,
                  r = t.tabs;
                return r.allIds.map(function (t) {
                  var o = n === t;
                  return b.createElement(
                    O.b,
                    { key: t, className: k(j.tab, !o && j.withHover), isActive: o, onClick: e._createClickHandler(t) },
                    r.byId[t].title
                  );
                });
              }),
              t
            );
          })(b.PureComponent),
          V = n("Eyy1"),
          R = n("vWed"),
          F = n("WXjp"),
          A = n("jjrI"),
          W = n("N5tr"),
          H = n("9dlw"),
          z = n("R4+T"),
          U = n("Ce4d"),
          G = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._container = null),
                (n._refContainer = function (e) {
                  n._container = e;
                }),
                (n._getPosition = function () {
                  var e = Object(V.ensureNotNull)(n._container).getBoundingClientRect();
                  return { x: e.left, y: e.top + e.height };
                }),
                (n._onItemClick = function (e) {
                  var t = n.props,
                    r = t.onChange,
                    o = t.onChangeArg;
                  r && r(e, o);
                }),
                (n._close = function () {
                  return n.setState({ isOpen: !1 });
                }),
                (n._toggle = function () {
                  return n.setState({ isOpen: !n.state.isOpen });
                }),
                (n.state = { isOpen: !1 }),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this,
                  t = this.props,
                  n = t.value,
                  r = t.className,
                  o = t.menuClassName,
                  i = t.menuItemClassName,
                  a = t.placeholder,
                  s = t.disabled,
                  l = t.hideArrowButton,
                  c = t.error,
                  u = this.props.items,
                  p = this.state.isOpen;
                return (
                  a && (u = [{ content: a }].concat(u)),
                  b.createElement(
                    b.Fragment,
                    null,
                    b.createElement(
                      "div",
                      {
                        tabIndex: s ? void 0 : -1,
                        className: k(
                          U.container,
                          r,
                          p && U.isFocused,
                          p && U.isOpen,
                          s && U.disabled,
                          c && U.error,
                          c && "apply-common-tooltip"
                        ),
                        ref: this._refContainer,
                        onClick: s ? void 0 : this._toggle,
                        title: c,
                      },
                      this._renderSelected(),
                      !l &&
                        b.createElement(
                          "div",
                          { className: U.button },
                          b.createElement(A.a, { className: U.icon, icon: z })
                        )
                    ),
                    b.createElement(
                      H.a,
                      {
                        className: o,
                        isOpened: p,
                        position: this._getPosition,
                        onClose: this._close,
                        doNotCloseOn: this._container,
                      },
                      u.map(function (t, r) {
                        return t.readonly
                          ? b.createElement(b.Fragment, { key: "readonly_item_" + r }, t.content)
                          : b.createElement(W.a, {
                              key: t.value || "",
                              className: i,
                              isActive: n === t.value,
                              label: t.content,
                              onClick: e._onItemClick,
                              onClickArg: t.value,
                            });
                      })
                    )
                  )
                );
              }),
              (t.prototype._renderSelected = function () {
                var e,
                  t = this.props,
                  n = t.value,
                  r = t.items,
                  o = t.placeholder,
                  i = t.hideArrowButton,
                  a = r.find(function (e) {
                    return e.value === n;
                  });
                return a
                  ? "string" == typeof (e = a.selectedContent || a.content)
                    ? b.createElement("div", { className: k(U.selected, i && U.hiddenArrow) }, e)
                    : b.createElement("div", { className: k(U.selected, i && U.hiddenArrow) }, b.cloneElement(e))
                  : b.createElement("div", { className: k(U.placeholder, i && U.hiddenArrow) }, o);
              }),
              t
            );
          })(b.PureComponent),
          K = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._handleChange = function () {
                  n.forceUpdate();
                }),
                (n.state = { query: window.matchMedia(n.props.rule) }),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.componentDidMount = function () {
                this._subscribe(this.state.query);
              }),
              (t.prototype.componentDidUpdate = function (e, t) {
                this.state.query !== t.query && (this._unsubscribe(t.query), this._subscribe(this.state.query));
              }),
              (t.prototype.componentWillUnmount = function () {
                this._unsubscribe(this.state.query);
              }),
              (t.prototype.render = function () {
                return this.props.children(this.state.query.matches);
              }),
              (t.getDerivedStateFromProps = function (e, t) {
                return e.rule !== t.query.media ? { query: window.matchMedia(e.rule) } : null;
              }),
              (t.prototype._subscribe = function (e) {
                e.addListener(this._handleChange);
              }),
              (t.prototype._unsubscribe = function (e) {
                e.removeListener(this._handleChange);
              }),
              t
            );
          })(b.PureComponent),
          q = n("zztK"),
          Y = n("mZ7d"),
          X = {
            ok: window.t("Ok"),
            cancel: window.t("Cancel"),
            reset: window.t("Reset Settings"),
            saveAsDefault: window.t("Save As Default"),
            defaults: window.t("Defaults"),
          },
          Z = { vertical: 20 },
          Q = { vertical: 0 },
          J = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._reference = null),
                (t._handleReference = function (e) {
                  return (t._reference = e);
                }),
                (t._handleCancel = function () {
                  t.props.onCancel(), t.props.onClose();
                }),
                (t._handleSubmit = function () {
                  t.props.onSubmit(), t.props.onClose();
                }),
                (t._handleKeyDown = function (e) {
                  var n, r;
                  switch (e.keyCode) {
                    case 27:
                      (n = document.activeElement),
                        (r = Object(V.ensureNotNull)(t._reference)),
                        null !== n && (r === n ? t._handleSubmit() : r.contains(n) && r.focus());
                  }
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this,
                  t = this.props,
                  n = t.isOpened,
                  r = t.title;
                return b.createElement(K, { rule: "screen and (max-height: 360px)" }, function (t) {
                  return b.createElement(K, { rule: "screen and (max-width: 419px)" }, function (o) {
                    return b.createElement(
                      F.a,
                      {
                        className: Y.dialog,
                        isOpened: n,
                        reference: e._handleReference,
                        onClickOutside: e._handleSubmit,
                        onKeyDown: e._handleKeyDown,
                        shouldForceFocus: !0,
                        fullscreen: o,
                        guard: t ? Q : Z,
                        boundByScreen: o,
                      },
                      b.createElement(
                        "div",
                        { className: Y.wrapper, "data-name": "indicator-properties-dialog" },
                        b.createElement(
                          "div",
                          { className: Y.header },
                          b.createElement(
                            "div",
                            { "data-dragg-area": !0, className: Y.title },
                            b.createElement("div", { className: Y.ellipsis }, r)
                          ),
                          b.createElement(A.a, {
                            className: Y.closeButton,
                            icon: q,
                            onClick: e._handleSubmit,
                            "data-name": "close",
                            "data-role": "button",
                          })
                        ),
                        e.props.children,
                        b.createElement(
                          "div",
                          { className: Y.footer },
                          b.createElement(
                            "div",
                            { className: Y.footerLeft },
                            !o && b.createElement($, { model: e.props.model, source: e.props.source })
                          ),
                          b.createElement(
                            "div",
                            null,
                            b.createElement(
                              R.Button,
                              { name: "cancel", appearance: "stroke", onClick: e._handleCancel },
                              X.cancel
                            ),
                            b.createElement(
                              "span",
                              { className: Y.okButton },
                              b.createElement(R.Button, { name: "ok", onClick: e._handleSubmit }, X.ok)
                            )
                          )
                        )
                      )
                    );
                  });
                });
              }),
              t
            );
          })(b.PureComponent),
          $ = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._handleResetToDefaults = function () {
                  n.props.model.restorePropertiesForSource(n.props.source);
                }),
                (n._handleSaveAsDefaults = function () {
                  n.props.source.properties().saveDefaults();
                }),
                (n._propertyItems = [
                  { value: "defaults", readonly: !0, content: "", selectedContent: X.defaults },
                  {
                    value: "reset",
                    readonly: !0,
                    content: b.createElement(W.a, {
                      className: Y.defaultsButtonItem,
                      isActive: !1,
                      label: X.reset,
                      onClick: n._handleResetToDefaults,
                    }),
                  },
                  {
                    value: "save",
                    readonly: !0,
                    content: b.createElement(W.a, {
                      className: Y.defaultsButtonItem,
                      isActive: !1,
                      label: X.saveAsDefault,
                      onClick: n._handleSaveAsDefaults,
                    }),
                  },
                ]),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                return b.createElement(G, {
                  className: Y.defaultsButtonText,
                  items: this._propertyItems,
                  value: "defaults",
                });
              }),
              t
            );
          })(b.PureComponent),
          ee = n("pafz"),
          te = n("tWVy"),
          ne = n("9+jD"),
          re = (function (e) {
            function t(t) {
              var n,
                r,
                o,
                i = e.call(this, t) || this;
              return (
                (i._controller = null),
                (i._handleSelect = function (e) {
                  i.setState({ activeTabId: e }, i._requestResize),
                    i.props.onActiveTabChanged && i.props.onActiveTabChanged(e);
                }),
                (i._handleScroll = function () {
                  te.a.fire();
                }),
                (i._renderTabs = function (e) {
                  return (
                    (i._controller = e),
                    b.createElement(B, {
                      activeTabId: i.state.activeTabId,
                      onSelect: i._handleSelect,
                      tabs: i.props.pages,
                    })
                  );
                }),
                (i._closePopupDialog = function () {
                  i.setState({ dialogIsOpened: !1 }), i.props.onClose();
                }),
                (i._requestResize = function () {
                  null !== i._controller && i._controller.recalculateBounds();
                }),
                (r = (n = i.props).pages),
                (o = n.initialActiveTab),
                (i.state = { dialogIsOpened: !0, activeTabId: r.allIds.includes(o) ? o : r.allIds[0] }),
                i
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props.pages.byId[this.state.activeTabId].Component;
                return b.createElement(
                  J,
                  {
                    model: this.props.model,
                    source: this.props.source,
                    title: this.props.title,
                    isOpened: this.state.dialogIsOpened,
                    onSubmit: this.props.onSubmit,
                    onCancel: this.props.onCancel,
                    onClose: this._closePopupDialog,
                  },
                  b.createElement(ee.a.Consumer, null, this._renderTabs),
                  b.createElement(
                    "div",
                    { className: ne.scrollable, onScroll: this._handleScroll },
                    b.createElement(e, { source: this.props.source, model: this.props.model })
                  )
                );
              }),
              t
            );
          })(b.PureComponent),
          oe = b.createContext(null),
          ie = (function (e) {
            function t(t) {
              var n,
                r,
                o = e.call(this, t) || this;
              return (
                (o._setValue = function (e, t, n) {
                  var r = o.props,
                    i = r.property,
                    a = r.model,
                    s = Object(V.ensureDefined)(i.child(e));
                  a.setProperty(s, t, "Change " + n);
                }),
                (n = t.property),
                (r = {}),
                n.childNames().forEach(function (e) {
                  var t = Object(V.ensureDefined)(n.child(e));
                  r.hasOwnProperty(e) || (r[e] = t.value());
                }),
                (o.state = r),
                o
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.componentDidMount = function () {
                var e = this,
                  t = this.props.property,
                  n = t.childNames();
                n.forEach(function (n) {
                  Object(V.ensureDefined)(t.child(n)).subscribe(e, function (t) {
                    var r;
                    e.setState((((r = {})[n] = t.value()), r));
                  });
                });
              }),
              (t.prototype.componentWillUnmount = function () {
                var e = this,
                  t = this.props.property,
                  n = t.childNames();
                n.forEach(function (n) {
                  Object(V.ensureDefined)(t.child(n)).unsubscribeAll(e);
                });
              }),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.study,
                  n = e.model,
                  r = e.children,
                  o = { study: t, model: n, values: this.state, setValue: this._setValue };
                return b.createElement(oe.Provider, { value: o }, r);
              }),
              t
            );
          })(b.PureComponent),
          ae = { blur: 0, commit: 0, change: 1 / 0 },
          se = n("kSQs"),
          le = n("Ialn"),
          ce = n("qFKp"),
          ue = n("ZgM/"),
          pe = {
            attachment: { horizontal: "left", vertical: "bottom" },
            targetAttachment: { horizontal: "left", vertical: "top" },
          },
          de = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._input = null),
                (n._buttons = null),
                (n._container = null),
                (n._onBlur = function (e) {
                  n.setState({ focused: !1 }), n.props.onBlur && n.props.onBlur(e);
                }),
                (n._onFocus = function (e) {
                  n.setState({ focused: !0 }), n.props.onFocus && n.props.onFocus(e);
                }),
                (n._containerFocus = function (e) {
                  !Modernizr.mobiletouch &&
                    n._buttons &&
                    n._buttons.contains(e.target) &&
                    Object(V.ensureNotNull)(n._input).focus();
                }),
                (n._setContainerRef = function (e) {
                  (n._container = e), n.props.containerReference && n.props.containerReference(e);
                }),
                (n._setInputRef = function (e) {
                  (n._input = e), n.props.inputReference && n.props.inputReference(e);
                }),
                (n._setButtonsRef = function (e) {
                  n._buttons = e;
                }),
                (n.state = { focused: !1 }),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props.borderStyle,
                  t = void 0 === e ? "thick" : e,
                  n = k(
                    ue.inputWithErrorWrapper,
                    "thick" === t && ue.thickBorder,
                    this.props.className,
                    this.state.focused && !this.props.disabled && ue.focused,
                    this.props.error && ue.error,
                    this.props.disabled && ue.disabled,
                    this.props.readOnly && ue.readonly
                  );
                return b.createElement(
                  "div",
                  { className: n },
                  b.createElement(
                    "div",
                    {
                      className: ue.inputWithError,
                      ref: this._setContainerRef,
                      onMouseOver: this.props.onMouseOver,
                      onMouseOut: this.props.onMouseOut,
                      onClick: this.props.onClick,
                      onFocus: this._containerFocus,
                      onWheel: this.props.onWheel,
                    },
                    b.createElement(
                      "div",
                      { className: k(ue.inputContainer, le.IS_RTL && !ce.isChrome && ue.inputContainerFix) },
                      b.createElement(
                        "div",
                        { className: ue.innerInputContainer },
                        b.createElement("input", {
                          ref: this._setInputRef,
                          className: k(ue.innerInput, le.IS_RTL && !ce.isChrome && ue.innerInputFix),
                          type: this.props.type || "text",
                          value: this.props.value,
                          placeholder: this.props.placeholder,
                          readOnly: this.props.readOnly,
                          disabled: this.props.disabled,
                          onBlur: this._onBlur,
                          onChange: this.props.onChange,
                          onClick: this.props.onInputClick,
                          onFocus: this._onFocus,
                          onKeyDown: this.props.onKeyDown,
                          onKeyUp: this.props.onKeyUp,
                        })
                      ),
                      b.createElement(
                        "div",
                        {
                          className: ue.iconBlock,
                          onClick: this.props.onButtonClick,
                          tabIndex: -1,
                          ref: this._setButtonsRef,
                        },
                        this.props.button
                      )
                    ),
                    this.props.children
                  ),
                  this._renderError()
                );
              }),
              (t.prototype._renderError = function () {
                return void 0 !== this.props.errorMessage
                  ? b.createElement(
                      se.a,
                      {
                        root: "document",
                        show: !0,
                        isOpened: this.props.showErrorMessage,
                        targetAttachment: pe.targetAttachment,
                        attachment: pe.attachment,
                        target: this._container || void 0,
                        inheritWidthFromTarget: !0,
                        customErrorClass: ue.errorMessage,
                      },
                      [this.props.errorMessage]
                    )
                  : void 0;
              }),
              t
            );
          })(b.PureComponent),
          he = n("uZsJ"),
          me = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._onMouseOver = function (e) {
                  n.setState({ mouseOver: !0 });
                }),
                (n._onMouseOut = function (e) {
                  n.setState({ mouseOver: !1 });
                }),
                (n._handleKeyDown = function (e) {
                  var t, r;
                  n.props.disabled ||
                    ((t = [38]),
                    (r = [40]),
                    n.props.controlDecKeyCodes && (r = r.concat(n.props.controlDecKeyCodes)),
                    n.props.controlIncKeyCodes && (t = t.concat(n.props.controlIncKeyCodes)),
                    (r.includes(e.keyCode) || t.includes(e.keyCode)) &&
                      (e.preventDefault(), n.props.onValueByStepChange(r.includes(e.keyCode) ? -1 : 1)),
                    n.props.onKeyDown && n.props.onKeyDown(e));
                }),
                (n._increaseValueOnClick = function (e) {
                  n.props.disabled || n.props.onValueByStepChange(1);
                }),
                (n._decreaseValueOnClick = function (e) {
                  n.props.disabled || n.props.onValueByStepChange(-1);
                }),
                (n._onWheel = function (e) {
                  n.props.disabled ||
                    (!1 !== n.props.focused &&
                      (e.deltaY < 0 ? n.props.onValueByStepChange(1) : n.props.onValueByStepChange(-1)));
                }),
                (n.state = { mouseOver: !1 }),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                return b.createElement(de, {
                  borderStyle: this.props.borderStyle,
                  value: this.props.value,
                  className: this.props.className,
                  button: this._renderControls(),
                  disabled: this.props.disabled,
                  placeholder: this.props.placeholder,
                  containerReference: this.props.containerReference,
                  inputReference: this.props.inputReference,
                  error: this.props.error,
                  errorMessage: this.props.errorMessage,
                  showErrorMessage: this.props.error && this.state.mouseOver,
                  onClick: this.props.onClick,
                  onFocus: this.props.onFocus,
                  onBlur: this.props.onBlur,
                  onChange: this.props.onValueChange,
                  onMouseOver: this._onMouseOver,
                  onMouseOut: this._onMouseOut,
                  onKeyDown: this._handleKeyDown,
                  onWheel: this._onWheel,
                });
              }),
              (t.prototype._renderControls = function () {
                var e = this.props,
                  t = e.button,
                  n = e.forceShowControls,
                  r = e.focused,
                  o = e.disabled,
                  a = this.state.mouseOver;
                return o
                  ? void 0
                  : b.createElement(
                      b.Fragment,
                      null,
                      t ||
                        b.createElement(i, {
                          visible: !Modernizr.mobiletouch && (n || r || a),
                          increaseValue: this._increaseValueOnClick,
                          decreaseValue: this._decreaseValueOnClick,
                        })
                    );
              }),
              t
            );
          })(b.PureComponent),
          fe = n("9XXR"),
          ve = (function () {
            function e(e) {
              void 0 === e && (e = " "), (this._divider = e);
            }
            return (
              (e.prototype.format = function (e) {
                var t = Object(fe.splitThousands)(e, this._divider);
                return le.IS_RTL && ce.isChrome ? Object(le.startWithLTR)(t) : t;
              }),
              (e.prototype.parse = function (e) {
                var t = Object(le.stripLTRMarks)(e).split(this._divider).join(""),
                  n = Number(t);
                return isNaN(n) || /e/i.test(t) ? { res: !1 } : { res: !0, price: n, suggest: this.format(n) };
              }),
              e
            );
          })(),
          _e = n("nc0P"),
          ge = window.t("Number format is invalid."),
          ye = window.t("Specified value is less that the instrument minimum."),
          be = window.t("Specified value is more than the instrument maximum."),
          Ce = new ve(),
          we = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._defaultMax = 9e15),
                (n._defaultFormatter = Ce),
                (n._onFocus = function (e) {
                  n.setState({ focused: !0 }), n.props.onFocus && n.props.onFocus(e);
                }),
                (n._onBlur = function (e) {
                  n.setState({ displayValue: a(n.props.value, n.props.formatter), focused: !1 }),
                    n.props.errorHandler && n.props.errorHandler(!1),
                    n.props.onBlur && n.props.onBlur(e);
                }),
                (n._onKeyDown = function (e) {
                  var t = [38, 40];
                  n.props.controlDecKeyCodes && (t = t.concat(n.props.controlDecKeyCodes)),
                    n.props.controlIncKeyCodes && (t = t.concat(n.props.controlIncKeyCodes)),
                    n.setState({ focused: !t.includes(e.keyCode) }),
                    n.props.onKeyDown && n.props.onKeyDown(e);
                }),
                (n._onValueChange = function (e) {
                  var t = e.target.value,
                    r = (n.props.formatter || n._defaultFormatter).parse(t),
                    o = r.res ? n._checkValueBoundaries(r.price) : { value: !1 },
                    i = r.res && !o.value;
                  n.setState({
                    displayValue: r.res && r.suggest && !n.state.focused ? r.suggest : t,
                    errorMsg: i && o.msg ? o.msg : ge,
                    focused: !0,
                  }),
                    r.res && o.value && n.props.onValueChange(r.price, "input"),
                    n.props.errorHandler && n.props.errorHandler(!r.res || i);
                }),
                (n._onValueByStepChange = function (e) {
                  var t,
                    r,
                    o,
                    i,
                    a = n.props.step || 1,
                    s = (n.props.formatter || n._defaultFormatter).parse(n.state.displayValue),
                    l = a;
                  s.res &&
                    ((t = new _e.Big(s.price)),
                    (r = new _e.Big(a)),
                    (i = void 0),
                    (i = (o = t.mod(r)).eq(0)
                      ? t.plus(e * a)
                      : t
                          .plus(e * a)
                          .plus((e > 0 ? 0 : 1) * a)
                          .minus(o)),
                    (l = Number(i))),
                    n._checkValueBoundaries(l).value &&
                      (n.setState({ displayValue: (n.props.formatter || n._defaultFormatter).format(l) }),
                      n.props.onValueChange(l, "step")),
                    n.props.errorHandler && n.props.errorHandler(!1);
                }),
                (n.state = {
                  value: n.props.value,
                  displayValue: a(n.props.value, n.props.formatter),
                  focused: !1,
                  errorMsg: ge,
                }),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                return b.createElement(me, {
                  borderStyle: this.props.borderStyle,
                  value: this.state.displayValue,
                  focused: this.state.focused,
                  forceShowControls: this.props.forceShowControls,
                  className: this.props.className,
                  button: this.props.button,
                  placeholder: this.props.placeholder,
                  disabled: this.props.disabled,
                  error: this.props.error,
                  errorMessage: this.props.errorMessage || this.state.errorMsg,
                  onValueChange: this._onValueChange,
                  onValueByStepChange: this._onValueByStepChange,
                  containerReference: this.props.containerReference,
                  inputReference: this.props.inputReference,
                  onClick: this.props.onClick,
                  onFocus: this._onFocus,
                  onBlur: this._onBlur,
                  onKeyDown: this._onKeyDown,
                  controlDecKeyCodes: this.props.controlDecKeyCodes,
                  controlIncKeyCodes: this.props.controlIncKeyCodes,
                });
              }),
              (t.getDerivedStateFromProps = function (e, t) {
                if ((t.focused && !e.alwaysUpdateValueFromProps) || t.value === e.value) return null;
                var n = a(e.value, e.formatter);
                return P.__assign({}, t, { value: e.value, displayValue: n });
              }),
              (t.prototype._checkValueBoundaries = function (e) {
                var t,
                  n = this.props,
                  r = n.min,
                  o = n.max,
                  i = void 0 === r || e >= r,
                  a = void 0 !== o ? e <= o : e <= this._defaultMax;
                return i || (t = ye), a || (t = be), { value: i && a, msg: t };
              }),
              t
            );
          })(b.PureComponent),
          Ee = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._container = null),
                (t._handleContainerRef = function (e) {
                  return (t._container = e);
                }),
                (t._onChange = function (e, n) {
                  var r = t.props,
                    o = r.input,
                    i = o.id,
                    a = o.name,
                    s = r.onChange,
                    l = r.onBlur;
                  s(e, i, a), "step" === n && l && l();
                }),
                (t._onBlur = function (e) {
                  var n,
                    r = t.props.onBlur;
                  r &&
                    ((n = Object(V.ensureNotNull)(t._container)).contains(document.activeElement) ||
                      n.contains(e.relatedTarget) ||
                      r());
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.input,
                  n = t.defval,
                  r = t.min,
                  o = t.max,
                  i = t.step,
                  a = e.value,
                  s = e.disabled,
                  l = e.onKeyDown,
                  c = e.className;
                return b.createElement(we, {
                  className: c,
                  value: Number(void 0 === a ? n : a),
                  min: r,
                  max: o,
                  step: i,
                  borderStyle: "thin",
                  onBlur: this._onBlur,
                  onValueChange: this._onChange,
                  onKeyDown: l,
                  disabled: s,
                  containerReference: this._handleContainerRef,
                  forceShowControls: !0,
                });
              }),
              t
            );
          })(b.PureComponent),
          Se = n("tDS2"),
          xe = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                return b.createElement(Ee, P.__assign({}, this.props, { className: Se.input }));
              }),
              t
            );
          })(b.PureComponent),
          Pe = o(xe, { change: 1 / 0, commit: 0, blur: 0 }),
          ke = r(Pe),
          Ne = o(
            (function (e) {
              function t() {
                return (null !== e && e.apply(this, arguments)) || this;
              }
              return (
                P.__extends(t, e),
                (t.prototype.render = function () {
                  return b.createElement(Ee, P.__assign({}, this.props, { className: Se.input }));
                }),
                t
              );
            })(b.PureComponent),
            { change: 1 / 0, commit: 0, blur: 0 }
          ),
          Oe = r(Ne),
          Te = n("dWaX"),
          Ie = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onChange = function () {
                  var e = t.props,
                    n = e.input,
                    r = n.id,
                    o = n.name,
                    i = e.value;
                  (0, e.onChange)(!i, r, o);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.input.defval,
                  n = e.value,
                  r = e.disabled,
                  o = e.label,
                  i = void 0 === n ? t : n;
                return b.createElement(Te.Checkbox, {
                  className: Se.checkbox,
                  disabled: r,
                  checked: i,
                  onChange: this._onChange,
                  label: b.createElement("span", { className: Se.label }, o),
                });
              }),
              t
            );
          })(b.PureComponent),
          Me = r(Ie),
          De = n("Hk3L"),
          je = o(
            (function (e) {
              function t() {
                var t = (null !== e && e.apply(this, arguments)) || this;
                return (
                  (t._onChange = function (e) {
                    var n = t.props,
                      r = n.input,
                      o = r.id,
                      i = r.name;
                    (0, n.onChange)(e.currentTarget.value, o, i);
                  }),
                  t
                );
              }
              return (
                P.__extends(t, e),
                (t.prototype.render = function () {
                  var e = this.props,
                    t = e.input.defval,
                    n = e.value,
                    r = e.disabled,
                    o = e.onBlur,
                    i = e.onKeyDown;
                  return b.createElement(s, {
                    className: Se.input,
                    value: void 0 === n ? t : n,
                    onChange: this._onChange,
                    onBlur: o,
                    onKeyDown: i,
                    disabled: r,
                  });
                }),
                t
              );
            })(b.PureComponent)
          ),
          Le = r(je),
          Be = n("pZll"),
          Ve = n("0waE"),
          Re = n("jAh7"),
          Fe = n("+EG+"),
          Ae = n("RgaO"),
          We = (function (e) {
            function t(t) {
              var n,
                r = e.call(this, t) || this;
              return (
                (r._input = null),
                (r._popup = null),
                (r._uuid = Object(Ve.guid)()),
                (r._onChange = function (e) {
                  r.setState({ value: e.currentTarget.value });
                }),
                (r._updateSymbolName = function () {
                  r._onSetSymbol(r.state.value);
                }),
                (r._onSetSymbol = function (e) {
                  var t = r.props.study,
                    n = l(e, t),
                    o = r.props,
                    i = o.input,
                    a = i.id,
                    s = i.name,
                    c = o.onChange;
                  c(n, a, s), r.setState({ value: n });
                }),
                (r._refInput = function (e) {
                  r._input = e;
                }),
                (r._handleOutsideClick = function (e) {
                  null !== r._input &&
                    document.activeElement === r._input &&
                    e.target instanceof Node &&
                    null !== r._popup &&
                    !r._popup.contains(e.target) &&
                    r._input.blur();
                }),
                (n = t.value),
                (r.state = { value: n || "" }),
                r
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.componentDidMount = function () {
                var e = this,
                  t = this.props.study,
                  n = this.context || Object(Re.getRootOverlapManager)();
                Object(Be.symbolSearchUIService)().bindToInput(Object(V.ensureNotNull)(this._input), {
                  syncWithChartWidget: !1,
                  syncOnBlur: !0,
                  callback: this._onSetSymbol,
                  onPopupOpen: function (t) {
                    (e._popup = n.ensureWindow(e._uuid)), t.appendTo(e._popup);
                  },
                  onPopupClose: function () {
                    (e._popup = null), n.removeWindow(e._uuid);
                  },
                }),
                  t.symbolsResolved().subscribe(this, this._updateSymbolName);
              }),
              (t.prototype.componentWillUnmount = function () {
                this.props.study.symbolsResolved().unsubscribe(this, this._updateSymbolName);
              }),
              (t.prototype.render = function () {
                var e = this.props.disabled,
                  t = this.state.value;
                return b.createElement(
                  Ae.a,
                  { mouseDown: !0, touchStart: !0, handler: this._handleOutsideClick },
                  b.createElement(s, {
                    className: Se.input,
                    value: t,
                    onChange: this._onChange,
                    disabled: e,
                    reference: this._refInput,
                  })
                );
              }),
              (t.contextType = Fe.b),
              t
            );
          })(b.PureComponent),
          He = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.input.defval,
                  n = e.value,
                  r = n || t || "",
                  o = Object(V.ensureDefined)(this.context.study);
                return b.createElement(We, P.__assign({}, this.props, { value: l(r, o), study: o }));
              }),
              (t.contextType = oe),
              t
            );
          })(b.PureComponent),
          ze = r(He),
          Ue = n("ldgD"),
          Ge = n.n(Ue),
          Ke = n("75D8"),
          qe = n("yd0C"),
          Ye = n("rbFW"),
          Xe = window.t("Invalid time"),
          Ze = "HH:mm",
          Qe = (function (e) {
            function t(t) {
              var n,
                r,
                o = e.call(this, t) || this;
              return (
                (o._container = null),
                (o._refContainer = function (e) {
                  o._container = e;
                }),
                (o._getPosition = function () {
                  var e = Object(V.ensureNotNull)(o._container).getBoundingClientRect();
                  return { x: e.left, y: e.top + e.height };
                }),
                (o._onSelect = function (e) {
                  var t = o.props,
                    n = t.name;
                  (0, t.onChange)(e, n), o.setState({ inputValue: e.format(Ze), inputError: null, isOpened: !1 });
                }),
                (o._toggleMenu = function () {
                  o.setState({ isOpened: !o.state.isOpened });
                }),
                (o._inputFocusHandler = function (e) {
                  e.target.blur(), o._toggleMenu();
                }),
                (o._handleChange = function () {}),
                t.value.isValid() ? ((n = t.value.format(Ze)), (r = null)) : ((n = ""), (r = Xe)),
                (o.state = { inputValue: n, inputError: r, prevValue: n, isOpened: !1 }),
                o
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.className,
                  n = e.value,
                  r = this.state,
                  o = r.inputValue,
                  i = r.isOpened,
                  a = b.createElement(A.a, { icon: qe });
                return b.createElement(
                  b.Fragment,
                  null,
                  b.createElement(
                    "div",
                    { ref: this._refContainer },
                    b.createElement(s, {
                      className: k(t, i && Ye.focusedInput),
                      icon: a,
                      iconPosition: 2,
                      value: o,
                      onFocus: this._inputFocusHandler,
                      onChange: this._handleChange,
                    })
                  ),
                  b.createElement(
                    H.a,
                    { isOpened: i, position: this._getPosition, onClose: this._toggleMenu, doNotCloseOn: this },
                    b.createElement(Ke.a, { className: Ye.clock, selectedTime: n, onSelect: this._onSelect })
                  )
                );
              }),
              (t.getDerivedStateFromProps = function (e, t) {
                var n = e.value.format(Ze);
                return n === t.prevValue ? t : P.__assign({}, t, { inputValue: n, prevValue: n });
              }),
              t
            );
          })(b.PureComponent),
          Je = (function (e) {
            function t(t) {
              var n,
                r = e.call(this, t) || this;
              return (
                (r._onStartPick = function (e) {
                  r.setState({ startTime: u(e) }, r._onChange);
                }),
                (r._onEndPick = function (e) {
                  r.setState({ endTime: u(e) }, r._onChange);
                }),
                (r._onChange = function () {
                  var e = r.props,
                    t = e.input,
                    n = t.id,
                    o = t.name,
                    i = e.onChange,
                    a = r.state,
                    s = a.startTime,
                    l = a.endTime,
                    c = Object(V.ensureDefined)(s).format("HHmm") + "-" + Object(V.ensureDefined)(l).format("HHmm");
                  i(c, n, o);
                }),
                (n = t.value || t.input.defval),
                (r.state = P.__assign({ prevValue: n }, p(n))),
                r
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.state,
                  t = e.startTime,
                  n = e.endTime;
                return b.createElement(
                  c,
                  null,
                  b.createElement(
                    "div",
                    { className: Se.sessionStart },
                    b.createElement(Qe, {
                      className: Se.input,
                      name: "start",
                      value: Object(V.ensureDefined)(t),
                      onChange: this._onStartPick,
                    }),
                    b.createElement("span", { className: Se.sessionDash }, " – ")
                  ),
                  b.createElement(
                    "div",
                    { className: Se.sessionEnd },
                    b.createElement(Qe, {
                      className: Se.input,
                      name: "end",
                      value: Object(V.ensureDefined)(n),
                      onChange: this._onEndPick,
                    })
                  )
                );
              }),
              (t.getDerivedStateFromProps = function (e, t) {
                return e.value === t.prevValue ? t : P.__assign({ prevValue: e.value }, p(e.value));
              }),
              t
            );
          })(b.PureComponent),
          $e = r(Je),
          et = n("0YCj"),
          tt = n.n(et),
          nt = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onChange = function (e) {
                  var n = t.props,
                    r = n.input,
                    o = r.id,
                    i = r.name;
                  (0, n.onChange)(e, o, i);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.input,
                  n = t.defval,
                  r = t.options,
                  o = t.optionsTitles,
                  i = e.value,
                  a = e.disabled,
                  s = r.map(function (e) {
                    var t = o && o[e] ? o[e] : e;
                    return { value: e, content: window.t(t, { context: "input" }) };
                  }),
                  l = void 0 !== i && r.includes(i) ? i : n;
                return b.createElement(G, {
                  className: Se.input,
                  menuClassName: Se.dropdownMenu,
                  value: l,
                  items: s,
                  onChange: this._onChange,
                  disabled: a,
                });
              }),
              t
            );
          })(b.PureComponent),
          rt = r(nt),
          ot = {
            open: window.t("open"),
            high: window.t("high"),
            low: window.t("low"),
            close: window.t("close"),
            hl2: window.t("hl2"),
            hlc3: window.t("hlc3"),
            ohlc4: window.t("ohlc4"),
          },
          it = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e,
                  t,
                  n,
                  r,
                  o,
                  i = this.props.input,
                  a = this.context,
                  s = a.study,
                  l = a.model,
                  c = P.__assign({}, ot);
                return (
                  s &&
                    s.isChildStudy() &&
                    ((t = (e = s.parentSource()).title()),
                    (n = tt.a.getChildSourceInputTitles(i, e.metaInfo(), t)),
                    (c = P.__assign({}, c, n))),
                  E.enabled("study_on_study") &&
                    s &&
                    (s.isChildStudy() || tt.a.canBeChild(s.metaInfo())) &&
                    ((r = [s].concat(s.getAllChildren())),
                    l
                      .model()
                      .allStudies()
                      .filter(function (e) {
                        return e.canHaveChildren() && !r.includes(e);
                      })
                      .forEach(function (e) {
                        var t,
                          n = e.title(!0, void 0, !0),
                          r = e.sourceId() || "#" + e.id(),
                          o = e.metaInfo(),
                          i = o.styles,
                          a = o.plots || [];
                        1 === a.length
                          ? (c[r + "$0"] = n)
                          : a.length > 1 &&
                            ((t = a.reduce(function (e, t, o) {
                              var a, s;
                              if (!tt.a.canPlotBeSourceOfChildStudy(t.type)) return e;
                              try {
                                s = Object(V.ensureDefined)(Object(V.ensureDefined)(i)[t.id]).title;
                              } catch (e) {
                                s = t.id;
                              }
                              return P.__assign({}, e, (((a = {})[r + "$" + o] = n + ": " + s), a));
                            }, {})),
                            (c = P.__assign({}, c, t)));
                      })),
                  (o = P.__assign({}, i, { type: "text", options: Object.keys(c), optionsTitles: c })),
                  b.createElement(rt, P.__assign({}, this.props, { input: o }))
                );
              }),
              (t.contextType = oe),
              t
            );
          })(b.PureComponent),
          at = n("LxhU"),
          st = n("pPtI"),
          ct = (lt = ["1", "3", "5", "15", "30", "45", "60", "120", "180", "240", "1D", "1W", "1M"]).map(function (e) {
            return { value: e, content: Object(st.getTranslatedResolutionModel)(e).hint };
          }),
          ut = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onChange = function (e) {
                  var n = t.props,
                    r = n.input,
                    o = r.id,
                    i = r.name;
                  (0, n.onChange)(e, o, i);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.input,
                  n = e.value,
                  r = e.disabled,
                  o = at.Interval.parse(void 0 === n ? t.defval : n),
                  i = o.multiplier(),
                  a = o.value();
                return (
                  (i && lt.includes(a)) || (a = lt[0]),
                  b.createElement(G, {
                    className: Se.input,
                    menuClassName: Se.dropdownMenu,
                    items: ct,
                    value: a,
                    onChange: this._onChange,
                    disabled: r,
                  })
                );
              }),
              t
            );
          })(b.PureComponent),
          pt = r(ut),
          dt = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onChange = function (e) {
                  var n = t.props,
                    r = n.input,
                    o = r.id,
                    i = r.name;
                  (0, n.onChange)(e, o, i);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.input,
                  n = t.defval,
                  r = t.min,
                  o = t.max,
                  i = e.value,
                  a = e.disabled;
                return b.createElement(we, {
                  className: Se.input,
                  value: Number(void 0 === i ? n : i),
                  min: r,
                  max: o,
                  borderStyle: "thin",
                  onValueChange: this._onChange,
                  disabled: a,
                });
              }),
              t
            );
          })(b.PureComponent),
          ht = r(dt),
          mt = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e,
                  t = this.props,
                  n = t.input,
                  r = t.disabled,
                  o = t.onChange;
                if (
                  ["text", "integer", "float", "session", "resolution"].includes((e = n).type) &&
                  e.hasOwnProperty("options")
                )
                  return b.createElement(rt, { input: n, disabled: r, onChange: o });
                switch (n.type) {
                  case "integer":
                    return b.createElement(ke, { input: n, disabled: r, onChange: o });
                  case "float":
                    return b.createElement(Oe, { input: n, disabled: r, onChange: o });
                  case "bool":
                    return b.createElement(Me, { input: n, disabled: r, onChange: o });
                  case "text":
                    return b.createElement(Le, { input: n, disabled: r, onChange: o });
                  case "symbol":
                    return b.createElement(ze, { input: n, disabled: r, onChange: o });
                  case "session":
                    return b.createElement($e, { input: n, disabled: r, onChange: o });
                  case "source":
                    return b.createElement(it, { input: n, disabled: r, onChange: o });
                  case "resolution":
                    return b.createElement(pt, { input: n, disabled: r, onChange: o });
                  case "time":
                    return b.createElement(ht, { input: n, disabled: r, onChange: o });
                  default:
                    return null;
                }
              }),
              t
            );
          })(b.PureComponent),
          ft = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.input,
                  n = e.value,
                  r = e.onChange,
                  o = e.onBlur,
                  i = e.onKeyDown,
                  a = t.options.reduce(function (e, t) {
                    return (e[t] = "NONE" === t ? window.t("Default") : t), e;
                  }, {}),
                  s = P.__assign({}, t, { optionsTitles: a });
                return b.createElement(nt, { input: s, value: n, onChange: r, onBlur: o, onKeyDown: i });
              }),
              t
            );
          })(b.PureComponent),
          vt = r(ft),
          _t = n("6ix9"),
          gt = b.createContext(null),
          yt = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (t._rows = new WeakMap()), (t._rowCount = 1), t;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                return b.createElement(
                  gt.Provider,
                  { value: this },
                  b.createElement("div", { className: _t.content }, this.props.children)
                );
              }),
              (t.prototype.getRowIndex = function (e) {
                var t = this._rows.get(e);
                return void 0 === t && ((t = this._rowCount++), this._rows.set(e, t)), t;
              }),
              t
            );
          })(b.PureComponent),
          bt = b.createContext(0),
          Ct = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                return b.createElement(
                  bt.Provider,
                  { value: Object(V.ensureNotNull)(this.context).getRowIndex(this) },
                  this.props.children
                );
              }),
              (t.contextType = gt),
              t
            );
          })(b.PureComponent),
          yt.Row = Ct,
          yt.Cell = function (e) {
            var t = k(
              _t.cell,
              e.grouped && _t.grouped,
              "top" === e.verticalAlign && _t.top,
              "adaptive" === e.verticalAlign && _t.adaptive,
              2 === e.colSpan && _t.fill,
              "first" === e.placement && 2 !== e.colSpan && _t.first,
              "last" === e.placement && 2 !== e.colSpan && _t.last
            );
            return b.createElement(bt.Consumer, null, function (n) {
              return b.createElement(
                "div",
                { className: t, style: d(n) },
                b.createElement("div", { className: k(_t.inner, e.className) }, e.children)
              );
            });
          },
          yt.Separator = function (e) {
            return b.createElement(
              yt.Row,
              null,
              b.createElement(bt.Consumer, null, function (e) {
                return b.createElement("div", { className: k(_t.cell, _t.separator, _t.fill), style: d(e) });
              })
            );
          },
          yt.GroupSeparator = function (e) {
            return b.createElement(
              yt.Row,
              null,
              b.createElement(bt.Consumer, null, function (e) {
                return b.createElement("div", { className: k(_t.cell, _t.groupSeparator, _t.fill), style: d(e) });
              })
            );
          },
          wt = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.label,
                  n = e.children,
                  r = e.input,
                  o = e.disabled,
                  i = e.onChange,
                  a = e.labelAlign,
                  s = e.grouped;
                return b.createElement(
                  yt.Row,
                  null,
                  b.createElement(
                    yt.Cell,
                    { placement: "first", verticalAlign: a, grouped: s },
                    void 0 !== t ? t : window.t(Object(V.ensureDefined)(r).name, { context: "input" })
                  ),
                  b.createElement(
                    yt.Cell,
                    { placement: "last", grouped: s },
                    n || b.createElement(mt, { input: Object(V.ensureDefined)(r), onChange: i, disabled: o })
                  )
                );
              }),
              t
            );
          })(b.PureComponent),
          n("HbRj"),
          Et = b.createContext(null),
          St = window.t("{currency} per order"),
          xt = window.t("{currency} per contract"),
          Pt = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e,
                  t = this.props.input,
                  n = Object(V.ensureNotNull)(this.context),
                  r =
                    (((e = {}).percent = "%"),
                    (e.cash_per_order = St.format({ currency: n })),
                    (e.cash_per_contract = xt.format({ currency: n })),
                    e),
                  o = P.__assign({}, t, { optionsTitles: r });
                return b.createElement(rt, { input: o });
              }),
              (t.contextType = Et),
              t
            );
          })(b.PureComponent),
          kt = window.t("Contracts"),
          Nt = window.t("% of equity"),
          Ot = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e,
                  t = this.props.input,
                  n = Object(V.ensureNotNull)(this.context),
                  r = (((e = {}).fixed = kt), (e.cash_per_order = n), (e.percent_of_equity = Nt), e),
                  o = P.__assign({}, t, { optionsTitles: r });
                return b.createElement(rt, { input: o });
              }),
              (t.contextType = Et),
              t
            );
          })(b.PureComponent),
          Tt = n("V1YL"),
          It = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props.inputs;
                return b.createElement(
                  yt,
                  null,
                  b.createElement(
                    wt,
                    { label: window.t("Initial capital") },
                    b.createElement(mt, { input: e.initial_capital })
                  ),
                  b.createElement(wt, { label: window.t("Base currency") }, b.createElement(vt, { input: e.currency })),
                  b.createElement(
                    wt,
                    { label: window.t("Order size"), labelAlign: "adaptive" },
                    b.createElement(
                      c,
                      null,
                      b.createElement(mt, { input: e.default_qty_value }),
                      b.createElement(Ot, { input: e.default_qty_type })
                    )
                  ),
                  b.createElement(
                    wt,
                    { label: window.t("Pyramiding") },
                    b.createElement("span", null, b.createElement(mt, { input: e.pyramiding })),
                    b.createElement(
                      "span",
                      { className: Tt.descriptionCell },
                      window.t("orders", { context: "Pyramiding: count orders" })
                    )
                  ),
                  b.createElement(yt.Separator, null),
                  b.createElement(
                    wt,
                    { label: window.t("Commission"), labelAlign: "adaptive" },
                    b.createElement(
                      c,
                      null,
                      b.createElement(mt, { input: e.commission_value }),
                      b.createElement(Pt, { input: e.commission_type })
                    )
                  ),
                  b.createElement(
                    wt,
                    { label: window.t("Verify Price for Limit Orders") },
                    b.createElement("span", null, b.createElement(mt, { input: e.backtest_fill_limits_assumption })),
                    b.createElement(
                      "span",
                      { className: Tt.descriptionCell },
                      window.t("ticks", { context: "slippage ... ticks" })
                    )
                  ),
                  b.createElement(
                    wt,
                    { label: window.t("Slippage") },
                    b.createElement("span", null, b.createElement(mt, { input: e.slippage })),
                    b.createElement(
                      "span",
                      { className: Tt.descriptionCell },
                      window.t("ticks", { context: "slippage ... ticks" })
                    )
                  ),
                  b.createElement(yt.Separator, null),
                  b.createElement(
                    wt,
                    { label: window.t("Recalculate"), labelAlign: "top" },
                    b.createElement(
                      "div",
                      null,
                      b.createElement(
                        "div",
                        { className: Tt.recalculateCheckbox },
                        b.createElement(Me, { label: window.t("After Order filled"), input: e.calc_on_order_fills })
                      ),
                      b.createElement(
                        "div",
                        { className: Tt.recalculateCheckbox },
                        b.createElement(Me, { label: window.t("On Every Tick"), input: e.calc_on_every_tick })
                      )
                    )
                  )
                );
              }),
              (t.contextType = oe),
              t
            );
          })(b.PureComponent),
          Mt = n("23IT"),
          Dt = n("ogJP"),
          jt = n("uOxu"),
          Lt = n("W5mg"),
          Vt = Object(jt.getLogger)("Platform.GUI.PropertyDialog.Indicators.MetaInfo"),
          Rt = (function () {
            function e(e) {
              this._metaInfo = e;
            }
            return (
              (e.prototype.hasUserEditableInputs = function () {
                return this._metaInfo.inputs.some(Lt.a);
              }),
              (e.prototype.getUserEditableInputs = function () {
                return this._metaInfo.inputs.filter(Lt.a);
              }),
              (e.prototype.hasUserEditableProperties = function () {
                return tt.a.isScriptStrategy(this._metaInfo);
              }),
              (e.prototype.getUserEditablePlots = function () {
                var e = new Set(),
                  t = this._metaInfo;
                return t.plots.filter(function (n) {
                  var r, o, i;
                  return (
                    !(
                      Object(Mt.isColorerPlot)(n) ||
                      Object(Mt.isTextColorerPlot)(n) ||
                      Object(Mt.isDataOffsetPlot)(n) ||
                      Object(Mt.isOhlcColorerPlot)(n)
                    ) &&
                    (Object(Mt.isOhlcPlot)(n)
                      ? ((r = n.target),
                        !e.has(r) &&
                          (e.add(r),
                          (o = Object(V.ensureDefined)(t.ohlcPlots)),
                          !Object(V.ensureDefined)(o[r]).isHidden))
                      : void 0 === (i = t.styles ? t.styles[n.id] : void 0) || !i.isHidden)
                  );
                });
              }),
              (e.prototype.getStrategyProperties = function () {
                var e,
                  t,
                  n,
                  r,
                  o,
                  i = this._metaInfo,
                  a = i.inputs.filter(m),
                  s = P.__assign({}, Ft);
                for (e = 0, t = a; e < t.length; e++)
                  (s[(r = (n = t[e]).internalID)] = n),
                    Ft.hasOwnProperty(r) || Vt.logWarn("Unknown strategy input internal id " + r + " in " + i.fullId);
                return Object(Dt.clone)(((o = s), Object.values(o).forEach(V.ensureDefined), o));
              }),
              e
            );
          })(),
          (Bt = {}).currency = void 0,
          Bt.backtest_fill_limits_assumption = void 0,
          Bt.calc_on_every_tick = void 0,
          Bt.calc_on_order_fills = void 0,
          Bt.commission_value = void 0,
          Bt.commission_type = void 0,
          Bt.initial_capital = void 0,
          Bt.pyramiding = void 0,
          Bt.slippage = void 0,
          Bt.default_qty_type = void 0,
          Bt.default_qty_value = void 0,
          Ft = Bt,
          At = Object(jt.getLogger)("Platform.GUI.PropertyDialog.Indicators.StrategyPage"),
          Wt = (function (e) {
            function t(t) {
              var n,
                r,
                o,
                i = e.call(this, t) || this;
              return (
                (i._handleWatchedDataChange = function () {
                  i.setState({ currency: i._getCurrency() });
                }),
                (n = i.props.source),
                (i._source = n),
                (i._properties = n.properties()),
                (r = n.metaInfo()),
                (o = new Rt(r)),
                (i._inputs = o.getStrategyProperties()),
                (i.state = { currency: i._getCurrency() }),
                i
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.componentDidMount = function () {
                this._source.watchedData.subscribe(this._handleWatchedDataChange);
              }),
              (t.prototype.componentWillUnmount = function () {
                this._source.watchedData.unsubscribe(this._handleWatchedDataChange);
              }),
              (t.prototype.render = function () {
                return b.createElement(
                  Et.Provider,
                  { value: this.state.currency },
                  b.createElement(h, {
                    inputs: this._inputs,
                    property: this._properties,
                    model: this.props.model,
                    study: this.props.source,
                  })
                );
              }),
              (t.prototype._getCurrency = function () {
                var e = this._source,
                  t = e.reportData();
                return null === t || void 0 === t.currency
                  ? ((void 0 !== this.state && null === this.state.currency) ||
                      At.logWarn("Can't obtain currency from strategy report"),
                    null)
                  : t.currency;
              }),
              t
            );
          })(b.PureComponent),
          Ht = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.label,
                  n = e.input;
                return b.createElement(
                  yt.Row,
                  null,
                  b.createElement(
                    yt.Cell,
                    { placement: "first", colSpan: 2 },
                    b.createElement(Me, { label: t, input: n })
                  )
                );
              }),
              t
            );
          })(b.PureComponent),
          zt = { offset: window.t("Offset") },
          Ut = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this,
                  t = this.props,
                  n = t.inputs,
                  r = t.property,
                  o = t.study,
                  i = t.model,
                  a = r.offset,
                  s = r.offsets;
                return b.createElement(
                  yt,
                  null,
                  b.createElement(f, { study: o, model: i, property: r.inputs, inputs: n }),
                  a && this._createOffsetSection(a),
                  s &&
                    s.childNames().map(function (t) {
                      var n = s.childs()[t];
                      return e._createOffsetSection(n);
                    })
                );
              }),
              (t.prototype._createOffsetSection = function (e) {
                var t = e.childs();
                return b.createElement(f, {
                  key: "offset_" + t.title.value(),
                  study: this.props.study,
                  model: this.props.model,
                  inputs: [
                    (function (e) {
                      return {
                        id: "val",
                        name: e.title.value() || zt.offset,
                        defval: e.val.value(),
                        type: "integer",
                        min: e.min.value(),
                        max: e.max.value(),
                      };
                    })(t),
                  ],
                  property: e,
                });
              }),
              t
            );
          })(b.PureComponent),
          Gt = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._properties = n.props.source.properties()),
                (n._inputs = new Rt(n.props.source.metaInfo()).getUserEditableInputs()),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                return b.createElement(Ut, {
                  property: this._properties,
                  model: this.props.model,
                  study: this.props.source,
                  inputs: this._inputs,
                });
              }),
              t
            );
          })(b.PureComponent),
          Kt = b.createContext(null),
          qt = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._setValue = function (e, n, r) {
                  t.props.model.setProperty(e, n, r);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.componentDidMount = function () {
                var e = this,
                  t = this.props.property;
                t.subscribe(this, function () {
                  e.forceUpdate();
                });
              }),
              (t.prototype.componentWillUnmount = function () {
                this.props.property.unsubscribeAll(this);
              }),
              (t.prototype.render = function () {
                var e = { setValue: this._setValue };
                return b.createElement(Kt.Provider, { value: e }, this.props.children);
              }),
              t
            );
          })(b.PureComponent),
          Yt = window.t("Change Visibility"),
          Xt = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.visible;
                  r &&
                    (Array.isArray(r)
                      ? r.forEach(function (t) {
                          n(t, e, Yt);
                        })
                      : n(r, e, Yt));
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.id,
                  n = e.title,
                  r = e.visible,
                  o = e.disabled,
                  i = window.t(n, { context: "input" });
                return b.createElement(Ie, {
                  label: i,
                  disabled: o,
                  input: { id: t, type: "bool", defval: !0, name: "visible" },
                  value: !r || (Array.isArray(r) ? r[0].value() : r.value()),
                  onChange: this._onChange,
                });
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          Zt = n("KKsp"),
          Qt = n("WIlE"),
          Jt = n("OP2o"),
          $t = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onChange = function (e) {
                  var n = e.target.checked;
                  void 0 !== t.props.onChange && t.props.onChange(n);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e,
                  t,
                  n = this.props,
                  r = n.className,
                  o = n.checked,
                  i = n.id,
                  a = n.label,
                  s = n.labelDescription,
                  l = n.value,
                  c = n.preventLabelHighlight,
                  u = n.reference,
                  p = n.switchReference,
                  d = k(Jt.label, (((e = {})[Jt.labelOn] = o && !c), e)),
                  h = k(r || "", Jt.wrapper, (((t = {})[Jt.wrapperWithOnLabel] = o), t));
                return b.createElement(
                  "label",
                  { className: h, htmlFor: i, ref: u },
                  b.createElement(
                    "div",
                    { className: Jt.labelRow },
                    b.createElement("div", { className: d }, a),
                    s && b.createElement("div", { className: Jt.labelHint }, s)
                  ),
                  b.createElement(Qt.Switch, {
                    reference: p,
                    checked: o,
                    onChange: this._onChange,
                    value: l,
                    tabIndex: -1,
                    id: i,
                  })
                );
              }),
              t
            );
          })(b.PureComponent),
          en = n("xHjM"),
          tn = n("/YRR"),
          nn = n("rlj/"),
          rn = n("ZtdB"),
          on = n("D2im"),
          an = n("tH7p"),
          sn = n("tQCG"),
          ln = n("9FXF"),
          cn = n("sPU+"),
          un = n("mPKq"),
          (pn = {})[Mt.LineStudyPlotStyle.Line] = {
            type: Mt.LineStudyPlotStyle.Line,
            order: 0,
            icon: en,
            label: window.t("Line"),
          },
          pn[Mt.LineStudyPlotStyle.LineWithBreaks] = {
            type: Mt.LineStudyPlotStyle.LineWithBreaks,
            order: 1,
            icon: tn,
            label: window.t("Line With Breaks"),
          },
          pn[Mt.LineStudyPlotStyle.StepLine] = {
            type: Mt.LineStudyPlotStyle.StepLine,
            order: 2,
            icon: nn,
            label: window.t("Step Line"),
          },
          pn[Mt.LineStudyPlotStyle.Histogram] = {
            type: Mt.LineStudyPlotStyle.Histogram,
            order: 3,
            icon: rn,
            label: window.t("Histogram"),
          },
          pn[Mt.LineStudyPlotStyle.Cross] = {
            type: Mt.LineStudyPlotStyle.Cross,
            order: 4,
            icon: on,
            label: window.t("Cross", { context: "chart_type" }),
          },
          pn[Mt.LineStudyPlotStyle.Area] = {
            type: Mt.LineStudyPlotStyle.Area,
            order: 5,
            icon: an,
            label: window.t("Area"),
          },
          pn[Mt.LineStudyPlotStyle.AreaWithBreaks] = {
            type: Mt.LineStudyPlotStyle.AreaWithBreaks,
            order: 6,
            icon: sn,
            label: window.t("Area With Breaks"),
          },
          pn[Mt.LineStudyPlotStyle.Columns] = {
            type: Mt.LineStudyPlotStyle.Columns,
            order: 7,
            icon: ln,
            label: window.t("Columns"),
          },
          pn[Mt.LineStudyPlotStyle.Circles] = {
            type: Mt.LineStudyPlotStyle.Circles,
            order: 8,
            icon: cn,
            label: window.t("Circles"),
          },
          dn = pn,
          hn = Object.values(dn)
            .sort(function (e, t) {
              return e.order - t.order;
            })
            .map(function (e) {
              return {
                value: e.type,
                selectedContent: b.createElement(
                  "div",
                  { className: N()(un.item, un.selected) },
                  b.createElement(A.a, { className: un.icon, icon: e.icon })
                ),
                content: b.createElement(
                  "div",
                  { className: un.item },
                  b.createElement(A.a, { className: un.icon, icon: e.icon }),
                  b.createElement("div", { className: un.label }, e.label)
                ),
              };
            }),
          mn = window.t("Price Line"),
          fn = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.plotType,
                  n = e.className,
                  r = e.priceLine,
                  o = e.plotTypeChange,
                  i = e.priceLineChange,
                  a = e.disabled,
                  s = {
                    readonly: !0,
                    content: b.createElement(
                      b.Fragment,
                      null,
                      b.createElement($t, {
                        id: "PlotTypePriceLineSwitch",
                        checked: r,
                        label: mn,
                        preventLabelHighlight: !0,
                        value: "priceLineSwitcher",
                        onChange: i,
                      }),
                      b.createElement(Zt.a, null)
                    ),
                  };
                return b.createElement(G, {
                  disabled: a,
                  className: n,
                  menuItemClassName: un.itemWrap,
                  hideArrowButton: !0,
                  items: [s].concat(hn),
                  value: t,
                  onChange: o,
                });
              }),
              t
            );
          })(b.PureComponent),
          vn = n("eJTA"),
          _n = n("Tmoa"),
          gn = n("6Kf3"),
          yn = gn.a["color-white"],
          bn = [
            "ripe-red",
            "tan-orange",
            "banana-yellow",
            "iguana-green",
            "minty-green",
            "sky-blue",
            "tv-blue",
            "deep-blue",
            "grapes-purple",
            "berry-pink",
          ],
          (Cn = [200, 300, 400, 500, 600, 700, 800, 900].map(function (e) {
            return "color-cold-gray-" + e;
          })).unshift("color-white"),
          Cn.push("color-black"),
          bn.forEach(function (e) {
            Cn.push("color-" + e + "-500");
          }),
          wn = Cn.map(function (e) {
            return gn.a[e];
          }),
          En = [],
          [100, 200, 300, 400, 700, 900].forEach(function (e) {
            bn.forEach(function (t) {
              En.push("color-" + t + "-" + e);
            });
          }),
          Sn = En.map(function (e) {
            return gn.a[e];
          }),
          xn = n("DXuF"),
          Pn = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onClick = function () {
                  var e = t.props,
                    n = e.color;
                  (0, e.onSelect)(n);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.color,
                  n = e.selected;
                return b.createElement("div", {
                  style: t ? { color: t } : void 0,
                  className: k(xn.swatch, n && xn.selected, !t && xn.empty, String(t).toLowerCase() === yn && xn.white),
                  onClick: this._onClick,
                });
              }),
              t
            );
          })(b.PureComponent),
          kn = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onSelect = function (e) {
                  var n = t.props.onSelect;
                  n && n(e);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e,
                  t = this,
                  n = this.props,
                  r = n.colors,
                  o = n.color,
                  i = n.children;
                return r
                  ? ((e = Object(vn.parseRgb)(String(o))),
                    b.createElement(
                      "div",
                      { className: xn.swatches },
                      r.map(function (n, r) {
                        return b.createElement(Pn, {
                          key: String(n) + r,
                          color: n,
                          selected: Object(vn.areEqualRgb)(e, Object(vn.parseRgb)(String(n))),
                          onSelect: t._onSelect,
                        });
                      }),
                      i
                    ))
                  : null;
              }),
              t
            );
          })(b.PureComponent),
          Nn = n("Hr11"),
          On = n("Oqo1"),
          Tn = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._container = null),
                (n._pointer = null),
                (n._raf = null),
                (n._refContainer = function (e) {
                  n._container = e;
                }),
                (n._refPointer = function (e) {
                  n._pointer = e;
                }),
                (n._handlePosition = function (e) {
                  null === n._raf &&
                    (n._raf = requestAnimationFrame(function () {
                      var t = Object(V.ensureNotNull)(n._container),
                        r = Object(V.ensureNotNull)(n._pointer),
                        o = t.getBoundingClientRect(),
                        i = r.offsetWidth,
                        a = e.clientX - i / 2 - o.left,
                        s = Object(Nn.clamp)(a / (o.width - i), 0, 1);
                      n.setState({ inputOpacity: Math.round(100 * s).toString() }),
                        n.props.onChange(s),
                        (n._raf = null);
                    }));
                }),
                (n._onSliderClick = function (e) {
                  n._handlePosition(e.nativeEvent), n._dragSubscribe();
                }),
                (n._mouseUp = function (e) {
                  n.setState({ isPointerDragged: !1 }), n._dragUnsubscribe(), n._handlePosition(e);
                }),
                (n._mouseMove = function (e) {
                  n.setState({ isPointerDragged: !0 }), n._handlePosition(e);
                }),
                (n._onTouchStart = function (e) {
                  n._handlePosition(e.nativeEvent.touches[0]);
                }),
                (n._handleTouch = function (e) {
                  n.setState({ isPointerDragged: !0 }), n._handlePosition(e.nativeEvent.touches[0]);
                }),
                (n._handleTouchEnd = function () {
                  n.setState({ isPointerDragged: !1 });
                }),
                (n._handleInput = function (e) {
                  var t = e.currentTarget.value,
                    r = Number(t) / 100;
                  n.setState({ inputOpacity: t }), Number.isNaN(r) || r > 1 || n.props.onChange(r);
                }),
                (n.state = { inputOpacity: Math.round(100 * t.opacity).toString(), isPointerDragged: !1 }),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.componentWillUnmount = function () {
                null !== this._raf && (cancelAnimationFrame(this._raf), (this._raf = null)), this._dragUnsubscribe();
              }),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.color,
                  n = e.opacity,
                  r = this.state,
                  o = r.inputOpacity,
                  i = r.isPointerDragged,
                  a = { color: t || void 0 };
                return b.createElement(
                  "div",
                  { className: On.opacity },
                  b.createElement(
                    "div",
                    {
                      className: On.opacitySlider,
                      style: a,
                      ref: this._refContainer,
                      onMouseDown: this._onSliderClick,
                      onTouchStart: this._onTouchStart,
                      onTouchMove: this._handleTouch,
                      onTouchEnd: this._handleTouchEnd,
                    },
                    b.createElement("div", {
                      className: On.opacitySliderGradient,
                      style: { backgroundImage: "linear-gradient(90deg, transparent, " + t + ")" },
                    }),
                    b.createElement(
                      "div",
                      { className: On.opacityPointerWrap },
                      b.createElement("div", {
                        className: k(On.pointer, i && On.dragged),
                        style: { left: 100 * n + "%" },
                        ref: this._refPointer,
                      })
                    )
                  ),
                  b.createElement(
                    "div",
                    { className: On.opacityInputWrap },
                    b.createElement("input", {
                      type: "text",
                      className: On.opacityInput,
                      value: o,
                      onChange: this._handleInput,
                    }),
                    b.createElement("span", { className: On.opacityInputPercent }, "%")
                  )
                );
              }),
              (t.prototype._dragSubscribe = function () {
                var e = Object(V.ensureNotNull)(this._container).ownerDocument;
                e && (e.addEventListener("mouseup", this._mouseUp), e.addEventListener("mousemove", this._mouseMove));
              }),
              (t.prototype._dragUnsubscribe = function () {
                var e = Object(V.ensureNotNull)(this._container).ownerDocument;
                e &&
                  (e.removeEventListener("mousemove", this._mouseMove),
                  e.removeEventListener("mouseup", this._mouseUp));
              }),
              t
            );
          })(b.PureComponent),
          In = n("PoSe"),
          Mn = n.n(In),
          Dn = n("lY1a"),
          jn = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._container = null),
                (t._refContainer = function (e) {
                  t._container = e;
                }),
                (t._handlePosition = function (e) {
                  var n,
                    r,
                    o,
                    i,
                    a,
                    s = t.props,
                    l = s.hsv.h,
                    c = s.onChange;
                  c &&
                    ((n = Object(V.ensureNotNull)(t._container).getBoundingClientRect()),
                    (r = e.clientX - n.left),
                    (o = e.clientY - n.top),
                    (i = r / n.width) < 0 ? (i = 0) : i > 1 && (i = 1),
                    (a = 1 - o / n.height) < 0 ? (a = 0) : a > 1 && (a = 1),
                    c({ h: l, s: i, v: a }));
                }),
                (t._mouseDown = function (e) {
                  window.addEventListener("mouseup", t._mouseUp), window.addEventListener("mousemove", t._mouseMove);
                }),
                (t._mouseUp = function (e) {
                  window.removeEventListener("mousemove", t._mouseMove),
                    window.removeEventListener("mouseup", t._mouseUp),
                    t._handlePosition(e);
                }),
                (t._mouseMove = Mn()(t._handlePosition, 100)),
                (t._handleTouch = function (e) {
                  t._handlePosition(e.nativeEvent.touches[0]);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.className,
                  n = e.hsv,
                  r = n.h,
                  o = n.s,
                  i = n.v,
                  a = "hsl(" + 360 * r + ", 100%, 50%)";
                return b.createElement(
                  "div",
                  {
                    className: N()(Dn.saturation, t),
                    style: { backgroundColor: a },
                    ref: this._refContainer,
                    onMouseDown: this._mouseDown,
                    onTouchStart: this._handleTouch,
                    onTouchMove: this._handleTouch,
                  },
                  b.createElement("div", {
                    className: Dn.pointer,
                    style: { left: 100 * o + "%", top: 100 * (1 - i) + "%" },
                  })
                );
              }),
              t
            );
          })(b.PureComponent),
          Ln = n("jpE+"),
          Bn = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._container = null),
                (t._refContainer = function (e) {
                  t._container = e;
                }),
                (t._handlePosition = function (e) {
                  var n,
                    r,
                    o,
                    i = t.props,
                    a = i.hsv,
                    s = a.s,
                    l = a.v,
                    c = i.onChange;
                  c &&
                    ((n = Object(V.ensureNotNull)(t._container).getBoundingClientRect()),
                    (r = e.clientY - n.top) >= n.top && (r = n.top - 1),
                    (o = r / n.height) < 0 ? (o = 0) : o > 1 && (o = 1),
                    c({ h: o, s: s, v: l }));
                }),
                (t._mouseDown = function (e) {
                  window.addEventListener("mouseup", t._mouseUp), window.addEventListener("mousemove", t._mouseMove);
                }),
                (t._mouseUp = function (e) {
                  window.removeEventListener("mousemove", t._mouseMove),
                    window.removeEventListener("mouseup", t._mouseUp),
                    t._handlePosition(e);
                }),
                (t._mouseMove = Mn()(t._handlePosition, 100)),
                (t._handleTouch = function (e) {
                  t._handlePosition(e.nativeEvent.touches[0]);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.className,
                  n = e.hsv.h;
                return b.createElement(
                  "div",
                  { className: N()(Ln.hue, t) },
                  b.createElement(
                    "div",
                    {
                      className: Ln.pointerContainer,
                      ref: this._refContainer,
                      onMouseDown: this._mouseDown,
                      onTouchStart: this._handleTouch,
                      onTouchMove: this._handleTouch,
                    },
                    b.createElement("div", { className: Ln.pointer, style: { top: 100 * n + "%" } })
                  )
                );
              }),
              t
            );
          })(b.PureComponent),
          Vn = n("uJfL"),
          Rn = "#000000",
          Fn = window.t("Add", { context: "Color Picker" }),
          An = (function (e) {
            function t(t) {
              var n,
                r = e.call(this, t) || this;
              return (
                (r._handleHSV = function (e) {
                  var t =
                    (function (e) {
                      var t,
                        n,
                        r,
                        o = e.h,
                        i = e.s,
                        a = e.v,
                        s = Math.floor(6 * o),
                        l = 6 * o - s,
                        c = a * (1 - i),
                        u = a * (1 - l * i),
                        p = a * (1 - (1 - l) * i);
                      switch (s % 6) {
                        case 0:
                          (t = a), (n = p), (r = c);
                          break;
                        case 1:
                          (t = u), (n = a), (r = c);
                          break;
                        case 2:
                          (t = c), (n = a), (r = p);
                          break;
                        case 3:
                          (t = c), (n = u), (r = a);
                          break;
                        case 4:
                          (t = p), (n = c), (r = a);
                          break;
                        case 5:
                          (t = a), (n = c), (r = u);
                          break;
                        default:
                          (t = 0), (n = 0), (r = 0);
                      }
                      return (
                        "#" +
                        [255 * t, 255 * n, 255 * r]
                          .map(function (e) {
                            return ("0" + Math.round(e).toString(16)).replace(/.+?([a-f0-9]{2})$/i, "$1");
                          })
                          .join("")
                      );
                    })(e) || Rn;
                  r.setState({ color: t, inputColor: t.replace(/^#/, ""), hsv: e });
                }),
                (r._handleInput = function (e) {
                  var t,
                    n = e.currentTarget.value;
                  try {
                    (t = v(n)), r.setState({ color: "#" + n, inputColor: n, hsv: t });
                  } catch (e) {
                    r.setState({ inputColor: n });
                  }
                }),
                (r._handleButton = function () {
                  r.props.onSelect(r.state.color);
                }),
                (n = t.color || Rn),
                (r.state = { color: n, inputColor: n.replace(/^#/, ""), hsv: v(n) }),
                r
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.state,
                  t = e.color,
                  n = e.hsv,
                  r = e.inputColor;
                return b.createElement(
                  "div",
                  { className: Vn.container },
                  b.createElement(
                    "div",
                    { className: Vn.form },
                    b.createElement("div", { className: Vn.swatch, style: { backgroundColor: t } }),
                    b.createElement(
                      "div",
                      { className: Vn.inputWrap },
                      b.createElement("span", { className: Vn.inputHash }, "#"),
                      b.createElement("input", {
                        type: "text",
                        className: Vn.input,
                        value: r,
                        onChange: this._handleInput,
                      })
                    ),
                    b.createElement(
                      "div",
                      { className: Vn.buttonWrap },
                      b.createElement(R.Button, { size: "s", onClick: this._handleButton }, Fn)
                    )
                  ),
                  b.createElement(
                    "div",
                    { className: Vn.hueSaturationWrap },
                    b.createElement(jn, { className: Vn.saturation, hsv: n, onChange: this._handleHSV }),
                    b.createElement(Bn, { className: Vn.hue, hsv: n, onChange: this._handleHSV })
                  )
                );
              }),
              t
            );
          })(b.PureComponent),
          Wn = n("1Kfe"),
          Hn = window.t("Add Custom Color", { context: "Color Picker" }),
          zn = window.t("Opacity", { context: "Color Picker" }),
          Un = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._handleColor = function (e) {
                  var t = n.props.onColorChange;
                  t && t(e);
                }),
                (n._handleCustomClick = function () {
                  n.setState({ isCustom: !0 }), n._onToggleCustom(!0);
                }),
                (n._onAddColor = function (e) {
                  n.setState({ isCustom: !1 }), n._onToggleCustom(!1);
                  var t = n.props,
                    r = t.onColorChange,
                    o = t.onAddColor;
                  r && r(e), o && o(e);
                }),
                (n._handleOpacity = function (e) {
                  var t = n.props.onOpacityChange;
                  t && t(e);
                }),
                (n.state = { isCustom: !1 }),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.color,
                  n = e.opacity,
                  r = e.selectCustom,
                  o = e.selectOpacity,
                  i = e.customColors,
                  a = this.state.isCustom,
                  s = "number" == typeof n ? n : 1;
                return a
                  ? b.createElement(An, { color: t, onSelect: this._onAddColor })
                  : b.createElement(
                      "div",
                      { className: Wn.container },
                      b.createElement(kn, { colors: wn, color: t, onSelect: this._handleColor }),
                      b.createElement(kn, { colors: Sn, color: t, onSelect: this._handleColor }),
                      b.createElement("div", { className: Wn.separator }),
                      b.createElement(
                        kn,
                        { colors: i, color: t, onSelect: this._handleColor },
                        r &&
                          b.createElement("div", {
                            className: N()(Wn.customButton, "apply-common-tooltip"),
                            onClick: this._handleCustomClick,
                            title: Hn,
                          })
                      ),
                      o &&
                        b.createElement(
                          b.Fragment,
                          null,
                          b.createElement("div", { className: Wn.sectionTitle }, zn),
                          b.createElement(Tn, { color: t, opacity: s, onChange: this._handleOpacity })
                        )
                    );
              }),
              (t.prototype._onToggleCustom = function (e) {
                var t = this.props.onToggleCustom;
                t && t(e);
              }),
              t
            );
          })(b.PureComponent),
          Gn = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._button = null),
                (n._refButton = function (e) {
                  n._button = e;
                }),
                (n._togglePopup = function () {
                  n.props.disabled ||
                    n.setState(function (e) {
                      return { isOpened: !e.isOpened, isCustom: !1 };
                    });
                }),
                (n._getPopupPosition = function () {
                  var e = Object(V.ensureNotNull)(n._button).getBoundingClientRect();
                  return { x: e.left, y: e.top + e.height };
                }),
                (n._toggleCustom = function (e) {
                  n.setState({ isCustom: e });
                }),
                (n.state = { isOpened: !1, isCustom: !1 }),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.button,
                  n = e.children,
                  r = P.__rest(e, ["button", "children"]),
                  o = this.state,
                  i = o.isOpened,
                  a = o.isCustom;
                return b.createElement(
                  "div",
                  { className: Wn.popupButtonWrap },
                  b.createElement(
                    "div",
                    { tabIndex: this.props.disabled ? void 0 : -1, ref: this._refButton, onClick: this._togglePopup },
                    "function" == typeof t ? t(i) : t
                  ),
                  b.createElement(
                    H.a,
                    {
                      isOpened: i,
                      onClose: this._togglePopup,
                      position: this._getPopupPosition,
                      doNotCloseOn: this._button,
                    },
                    b.createElement(Un, P.__assign({}, r, { onToggleCustom: this._toggleCustom })),
                    !a && n
                  )
                );
              }),
              t
            );
          })(b.PureComponent),
          Kn = n("0Mig"),
          qn = n("95N5"),
          Yn = Object(Kn.makeSwitchGroupItem)(
            (function (e) {
              function t() {
                var t = (null !== e && e.apply(this, arguments)) || this;
                return (
                  (t._onChange = function () {
                    t.props.onChange && t.props.onChange(t.props.value);
                  }),
                  t
                );
              }
              return (
                P.__extends(t, e),
                (t.prototype.render = function () {
                  var e,
                    t,
                    n = this.props,
                    r = n.name,
                    o = n.checked,
                    i = n.value,
                    a = k(qn.thicknessItem, (((e = {})[qn.checked] = o), e)),
                    s = k(qn.bar, (((t = {})[qn.checked] = o), t)),
                    l = { borderTopWidth: parseInt(i) };
                  return b.createElement(
                    "div",
                    { className: a },
                    b.createElement("input", {
                      type: "radio",
                      className: qn.radio,
                      name: r,
                      value: i,
                      onChange: this._onChange,
                      checked: o,
                    }),
                    b.createElement("div", { className: s, style: l }, " ")
                  );
                }),
                t
              );
            })(b.PureComponent)
          ),
          Xn = n("91aW"),
          Zn = [1, 2, 3, 4],
          Qn = window.t("Thickness", { context: "Color Picker" }),
          Jn = window.t("Change Color"),
          $n = window.t("Change Opacity"),
          er = window.t("Change Thickness"),
          tr = "add_new_custom_color",
          nr = 29,
          rr = (function (e) {
            function t(t) {
              var n = e.call(this, t) || this;
              return (
                (n._handleAddColor = function (e) {
                  var t = n.state.customColors,
                    r = e ? Object(vn.parseRgb)(e) : null,
                    o = t.some(function (e) {
                      return null !== e && null !== r && Object(vn.areEqualRgb)(Object(vn.parseRgb)(e), r);
                    });
                  o ||
                    (S.emit(tr, e),
                    Object(w.setJSON)("pickerCustomColors", n._addCustomColorToArray(e, t), { forceFlush: !0 }));
                }),
                (n._globalAddCustomColorHandler = function (e) {
                  var t = n.state.customColors;
                  n.setState({ customColors: n._addCustomColorToArray(e, t) });
                }),
                (n._onColorChange = function (e) {
                  var t = n.props,
                    r = t.color,
                    o = t.transparency,
                    i = n._getPropertyValue(r),
                    a = o ? o.value() : 0,
                    s = Object(_n.isHexColor)(i) ? a : Object(_n.alphaToTransparency)(Object(vn.parseRgba)(i)[3]);
                  n._setProperty(r, Object(_n.generateColor)(String(e), s, !0), Jn);
                }),
                (n._onOpacityChange = function (e) {
                  var t = n.props.color,
                    r = n._getPropertyValue(t);
                  n._setProperty(t, Object(_n.generateColor)(r, Object(_n.alphaToTransparency)(e), !0), $n);
                }),
                (n._onThicknessChange = function (e) {
                  var t = n.props.thickness;
                  t && n._setProperty(t, e, er);
                }),
                (n._addCustomColorToArray = function (e, t) {
                  var n = t.slice();
                  return n.length < nr ? n.push(e) : n.unshift(e), n.slice(0, nr);
                }),
                (n.state = { customColors: Object(w.getJSON)("pickerCustomColors", []) }),
                n
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.componentDidMount = function () {
                S.subscribe(tr, this._globalAddCustomColorHandler, null);
              }),
              (t.prototype.componentWillUnmount = function () {
                S.unsubscribe(tr, this._globalAddCustomColorHandler, null);
              }),
              (t.prototype.render = function () {
                var e = this,
                  t = this.props,
                  n = t.color,
                  r = t.selectOpacity,
                  o = void 0 === r || r,
                  i = t.transparency,
                  a = t.thickness,
                  s = t.disabled,
                  l = this.state.customColors,
                  c = this._getPropertyValue(n),
                  u = i ? i.value() : 0,
                  p = Object(_n.isHexColor)(c) ? Object(_n.transparencyToAlpha)(u) : Object(vn.parseRgba)(c)[3],
                  d = Object(_n.generateColor)(c, u),
                  h = Object(_n.isHexColor)(c) ? c : Object(vn.rgbToHexString)(Object(vn.parseRgb)(c)),
                  m = h.toLowerCase() === yn;
                return b.createElement(
                  Gn,
                  {
                    disabled: s,
                    color: h,
                    selectOpacity: o,
                    opacity: p,
                    selectCustom: !0,
                    customColors: l,
                    onColorChange: this._onColorChange,
                    onOpacityChange: this._onOpacityChange,
                    onAddColor: this._handleAddColor,
                    button: function (t) {
                      return b.createElement(
                        "div",
                        { className: k(Xn.colorPickerWrap, t && Xn.isFocused, s && Xn.disabled) },
                        b.createElement(
                          "div",
                          { className: k(Xn.colorPicker, s && Xn.disabled) },
                          b.createElement(
                            "div",
                            { className: Xn.opacitySwatch },
                            b.createElement("div", {
                              style: { backgroundColor: d },
                              className: k(Xn.swatch, p >= 0.95 && m && Xn.white),
                            })
                          ),
                          a &&
                            b.createElement("span", {
                              className: k(Xn.colorLine, m && Xn.white),
                              style: { height: e._getPropertyValue(a), backgroundColor: d },
                            })
                        )
                      );
                    },
                  },
                  a &&
                    b.createElement(
                      "div",
                      { className: Xn.thicknessContainer },
                      b.createElement("div", { className: Xn.thicknessTitle }, Qn),
                      b.createElement(_, {
                        name: "color_picker_thickness_select",
                        onChange: this._onThicknessChange,
                        values: Zn,
                        selectedValues: [this._getPropertyValue(a)],
                      })
                    )
                );
              }),
              (t.prototype._setProperty = function (e, t, n) {
                var r = this.context.setValue;
                Array.isArray(e)
                  ? e.forEach(function (e) {
                      r(e, t, n);
                    })
                  : r(e, t, n);
              }),
              (t.prototype._getPropertyValue = function (e) {
                return Array.isArray(e) ? e[0].value() : e.value();
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          or = n("wwEg"),
          ir = window.t("Change Plot Type"),
          ar = window.t("Change Price Line"),
          sr = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onPlotTypeChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.styleProp.plottype;
                  r && n(r, e, ir);
                }),
                (t._onPriceLineChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.styleProp.trackPrice;
                  r && n(r, e, ar);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.paletteColor,
                  n = e.paletteColorProps,
                  r = e.styleProp,
                  o = e.isLine,
                  i = e.hasPlotTypeSelect,
                  a = e.grouped,
                  s = n.childs();
                return b.createElement(
                  wt,
                  { grouped: a, label: b.createElement("div", { className: or.childRowContainer }, t.name) },
                  b.createElement(rr, {
                    disabled: !r.visible.value(),
                    color: s.color,
                    transparency: r.transparency,
                    thickness: o ? s.width : void 0,
                  }),
                  o && i && r.plottype && r.trackPrice
                    ? b.createElement(fn, {
                        disabled: !r.visible.value(),
                        className: or.smallStyleControl,
                        plotType: r.plottype.value(),
                        priceLine: r.trackPrice.value(),
                        plotTypeChange: this._onPlotTypeChange,
                        priceLineChange: this._onPriceLineChange,
                      })
                    : null
                );
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          lr = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.plot,
                  n = e.area,
                  r = e.palette,
                  o = e.paletteProps,
                  i = e.hideVisibilitySwitch,
                  a = e.styleProp,
                  s = t ? t.id : Object(V.ensureDefined)(n).id,
                  l = s.startsWith("fill"),
                  c = !l && t && Object(Mt.isLinePlot)(t);
                return b.createElement(
                  b.Fragment,
                  null,
                  !i &&
                    b.createElement(
                      yt.Row,
                      null,
                      b.createElement(
                        yt.Cell,
                        { placement: "first", colSpan: 2, grouped: !0 },
                        b.createElement(Xt, { id: s, title: n ? n.title : a.title.value(), visible: a.visible })
                      )
                    ),
                  (function (e, t, n, r) {
                    var o = e.colors,
                      i = t.colors;
                    return Object.keys(o).map(function (e, t) {
                      return b.createElement(sr, {
                        key: e,
                        grouped: !0,
                        paletteColor: Object(V.ensureDefined)(o[e]),
                        paletteColorProps: Object(V.ensureDefined)(i[e]),
                        styleProp: n,
                        isLine: r,
                        hasPlotTypeSelect: 0 === t,
                      });
                    });
                  })(r, o, a, c),
                  b.createElement(yt.GroupSeparator, null)
                );
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          cr = window.t("Change Plot Type"),
          ur = window.t("Change Price Line"),
          pr = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onPlotTypeChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.property.plottype;
                  r && n(r, e, cr);
                }),
                (t._onPriceLineChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.property.trackPrice;
                  r && n(r, e, ur);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.id,
                  n = e.property,
                  r = n.title,
                  o = n.color,
                  i = n.plottype,
                  a = n.linewidth,
                  s = n.transparency,
                  l = n.trackPrice,
                  c = n.visible;
                return b.createElement(
                  wt,
                  { label: b.createElement(Xt, { id: t, title: r.value(), visible: c }) },
                  b.createElement(rr, { disabled: !c.value(), color: o, transparency: s, thickness: a }),
                  b.createElement(fn, {
                    disabled: !c.value(),
                    className: or.smallStyleControl,
                    plotType: i.value(),
                    priceLine: l.value(),
                    plotTypeChange: this._onPlotTypeChange,
                    priceLineChange: this._onPriceLineChange,
                  })
                );
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          dr = b.createContext(null),
          hr = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.id,
                  n = e.property,
                  r = n.colorup,
                  o = n.colordown,
                  i = n.transparency,
                  a = n.visible;
                return b.createElement(dr.Consumer, null, function (e) {
                  return b.createElement(
                    wt,
                    {
                      label: b.createElement(Xt, {
                        id: t,
                        title: (function (e, t) {
                          var n = Object(V.ensureDefined)(e.metaInfo().styles),
                            r = Object(V.ensureDefined)(n[t]).title;
                          return Object(V.ensureDefined)(r);
                        })(Object(V.ensureNotNull)(e), t),
                        visible: a,
                      }),
                    },
                    b.createElement(rr, { disabled: !a.value(), color: r, transparency: i }),
                    b.createElement(
                      "span",
                      { className: or.additionalSelect },
                      b.createElement(rr, { disabled: !a.value(), color: o, transparency: i })
                    )
                  );
                });
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          (fr = {})[(mr = n("972a")).MarkLocation.AboveBar] = {
            value: mr.MarkLocation.AboveBar,
            content: window.t("Above Bar"),
            order: 0,
          },
          fr[mr.MarkLocation.BelowBar] = { value: mr.MarkLocation.BelowBar, content: window.t("Below Bar"), order: 1 },
          fr[mr.MarkLocation.Top] = { value: mr.MarkLocation.Top, content: window.t("Top"), order: 2 },
          fr[mr.MarkLocation.Bottom] = { value: mr.MarkLocation.Bottom, content: window.t("Bottom"), order: 3 },
          fr[mr.MarkLocation.Absolute] = { value: mr.MarkLocation.Absolute, content: window.t("Absolute"), order: 4 },
          vr = fr,
          _r = Object.values(vr).sort(function (e, t) {
            return e.order - t.order;
          }),
          gr = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.shapeLocation,
                  n = e.className,
                  r = e.menuItemClassName,
                  o = e.shapeLocationChange,
                  i = e.disabled;
                return b.createElement(G, {
                  disabled: i,
                  className: n,
                  menuItemClassName: r,
                  items: _r,
                  value: t,
                  onChange: o,
                });
              }),
              t
            );
          })(b.PureComponent),
          yr = window.t("Change Char"),
          br = window.t("Change Location"),
          Cr = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onCharChange = function (e) {
                  var n = t.context.setValue,
                    r = e.currentTarget.value.trim(),
                    o = r.length ? r[r.length - 1] : "",
                    i = t.props.property.char;
                  n(i, o, yr);
                }),
                (t._onLocationChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.property.location;
                  n(r, e, br);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.id,
                  n = e.property,
                  r = n.title,
                  o = n.color,
                  i = n.transparency,
                  a = n.char,
                  l = n.location,
                  c = n.visible,
                  u = e.hasPalette;
                return b.createElement(
                  wt,
                  { grouped: u, label: b.createElement(Xt, { id: t, title: r.value(), visible: c }) },
                  !u && b.createElement(rr, { disabled: !c.value(), color: o, transparency: i }),
                  b.createElement(s, {
                    disabled: !c.value(),
                    className: or.smallStyleControl,
                    value: a.value(),
                    onChange: this._onCharChange,
                  }),
                  b.createElement(gr, {
                    disabled: !c.value(),
                    className: k(or.defaultSelect, or.additionalSelect),
                    menuItemClassName: or.defaultSelectItem,
                    shapeLocation: l.value(),
                    shapeLocationChange: this._onLocationChange,
                  })
                );
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          wr = n("Nu4p"),
          Er = n("4Njr"),
          Sr = n("lOpG"),
          xr = n("br6c"),
          Pr = n("m+Gx"),
          kr = n("01Ho"),
          Nr = n("4ZyK"),
          Or = n("kMtk"),
          Tr = n("Dj0x"),
          Ir = n("Ly1u"),
          Mr = n("leq5"),
          Dr = n("flzi"),
          jr = n("iB0j"),
          (Lr = {}).arrow_down = Er,
          Lr.arrow_up = Sr,
          Lr.circle = xr,
          Lr.cross = Pr,
          Lr.diamond = kr,
          Lr.flag = Nr,
          Lr.label_down = Or,
          Lr.label_up = Tr,
          Lr.square = Ir,
          Lr.triangle_down = Mr,
          Lr.triangle_up = Dr,
          Lr.x_cross = jr,
          Br = Lr,
          Vr = [],
          Object.keys(wr.plotShapesData).forEach(function (e) {
            var t = wr.plotShapesData[e];
            Vr.push({
              value: t.id,
              selectedContent: b.createElement(
                "div",
                { className: N()(un.item, un.selected) },
                b.createElement(A.a, { className: un.icon, icon: g(t.icon) })
              ),
              content: b.createElement(
                "div",
                { className: un.item },
                b.createElement(A.a, { className: un.icon, icon: g(t.icon) }),
                b.createElement("div", { className: un.label }, t.guiName)
              ),
            });
          }),
          Rr = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.shapeStyleId,
                  n = e.className,
                  r = e.shapeStyleChange,
                  o = e.disabled;
                return b.createElement(G, {
                  disabled: o,
                  className: n,
                  menuItemClassName: un.itemWrap,
                  hideArrowButton: !0,
                  items: Vr,
                  value: t,
                  onChange: r,
                });
              }),
              t
            );
          })(b.PureComponent),
          Fr = window.t("Change Shape"),
          Ar = window.t("Change Location"),
          Wr = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onPlotTypeChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.property.plottype;
                  n(r, e, Fr);
                }),
                (t._onLocationChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.property.location;
                  n(r, e, Ar);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.id,
                  n = e.hasPalette,
                  r = e.property,
                  o = r.title,
                  i = r.color,
                  a = r.transparency,
                  s = r.plottype,
                  l = r.location,
                  c = r.visible;
                return b.createElement(
                  wt,
                  {
                    grouped: n,
                    label: b.createElement(Xt, { id: t, title: o.value(), visible: c }),
                  },
                  !n && b.createElement(rr, { disabled: !c.value(), color: i, transparency: a }),
                  b.createElement(Rr, {
                    disabled: !c.value(),
                    className: or.smallStyleControl,
                    shapeStyleId: s.value(),
                    shapeStyleChange: this._onPlotTypeChange,
                  }),
                  b.createElement(gr, {
                    disabled: !c.value(),
                    className: k(or.defaultSelect, or.additionalSelect),
                    menuItemClassName: or.defaultSelectItem,
                    shapeLocation: l.value(),
                    shapeLocationChange: this._onLocationChange,
                  })
                );
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          Hr = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.id,
                  n = e.title,
                  r = e.visible,
                  o = e.color,
                  i = e.transparency,
                  a = e.thickness,
                  s = e.children,
                  l = e.switchable,
                  c = void 0 === l || l;
                return b.createElement(
                  wt,
                  { label: c ? b.createElement(Xt, { id: t, title: n, visible: r }) : n },
                  b.createElement(rr, {
                    disabled: r && !(Array.isArray(r) ? r[0].value() : r.value()),
                    color: o,
                    transparency: i,
                    thickness: a,
                  }),
                  s
                );
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          zr = Object(jt.getLogger)("Chart.Study.PropertyPage"),
          Ur = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e,
                  t,
                  n,
                  r,
                  o,
                  i = this.props,
                  a = i.plot,
                  s = i.palette,
                  l = i.paletteProps,
                  c = i.study,
                  u = a.id,
                  p = c.properties().styles,
                  d = p[u],
                  h = a.type;
                return "line" === h || "bar_colorer" === h || "bg_colorer" === h
                  ? s && l
                    ? b.createElement(lr, { plot: a, palette: s, paletteProps: l, styleProp: d })
                    : b.createElement(pr, { id: u, property: d })
                  : "arrows" === h
                  ? b.createElement(hr, { id: u, property: d })
                  : "chars" === h || "shapes" === h
                  ? b.createElement(
                      b.Fragment,
                      null,
                      "chars" === h
                        ? b.createElement(Cr, { id: u, property: d, hasPalette: Boolean(s) })
                        : b.createElement(Wr, { id: u, property: d, hasPalette: Boolean(s) }),
                      s &&
                        l &&
                        b.createElement(lr, {
                          plot: a,
                          palette: s,
                          paletteProps: l,
                          hideVisibilitySwitch: !0,
                          styleProp: d,
                        })
                    )
                  : Object(Mt.isOhlcPlot)(a)
                  ? ((e = a.target),
                    (t = Object(V.ensureDefined)(c.metaInfo().defaults.ohlcPlots)[e]),
                    (n = c.properties().ohlcPlots[e]),
                    (r = void 0),
                    (r =
                      s && l
                        ? b.createElement(lr, { plot: a, palette: s, paletteProps: l, styleProp: n })
                        : b.createElement(Hr, {
                            id: e,
                            title: n.title.value(),
                            color: n.color,
                            visible: n.visible,
                            transparency: n.transparency,
                          })),
                    (o = void 0),
                    void 0 !== t &&
                      Object(Mt.isOhlcPlotStyleCandles)(t) &&
                      (o = b.createElement(Hr, {
                        id: e,
                        title: window.t("Wick"),
                        visible: n.drawWick,
                        color: n.wickColor,
                        transparency: n.transparency,
                      })),
                    b.createElement(b.Fragment, null, r, o))
                  : (zr.logError("Unknown plot type: " + h), null);
              }),
              t
            );
          })(b.PureComponent),
          Gr = n("8Uy/"),
          Kr = n("bQEj"),
          qr = n("UXdH"),
          Yr = n("ZSM+"),
          Xr = window.t("Change Line Style"),
          Zr = [
            { type: Gr.LINESTYLE_SOLID, icon: Kr, label: window.t("Line") },
            { type: Gr.LINESTYLE_DASHED, icon: qr, label: window.t("Dashed Line") },
            { type: Gr.LINESTYLE_DOTTED, icon: Yr, label: window.t("Dotted Line") },
          ],
          Qr = Zr.map(function (e) {
            return {
              value: e.type,
              selectedContent: b.createElement(
                "div",
                { className: N()(un.item, un.selected) },
                b.createElement(A.a, { className: un.icon, icon: e.icon })
              ),
              content: b.createElement(
                "div",
                { className: un.item },
                b.createElement(A.a, { className: un.icon, icon: e.icon }),
                b.createElement("div", { className: un.label }, e.label)
              ),
            };
          }),
          Jr = window.t("Show Price"),
          $r = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onLineStyleChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.lineStyle;
                  n(r, e, Xr);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.lineStyle,
                  n = e.className,
                  r = e.disabled,
                  o = e.showPrice,
                  i = e.showPriceChange,
                  a = Qr;
                return (
                  void 0 !== o &&
                    i &&
                    (a = [
                      {
                        readonly: !0,
                        content: b.createElement(
                          b.Fragment,
                          null,
                          b.createElement($t, {
                            checked: o,
                            label: Jr,
                            preventLabelHighlight: !0,
                            value: "showPriceSwitcher",
                            onChange: i,
                          }),
                          b.createElement(Zt.a, null)
                        ),
                      },
                    ].concat(a)),
                  b.createElement(G, {
                    disabled: r,
                    className: n,
                    menuItemClassName: un.itemWrap,
                    hideArrowButton: !0,
                    items: a,
                    value: t.value(),
                    onChange: this._onLineStyleChange,
                  })
                );
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          eo = window.t("Change Value"),
          to = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onValueChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.property.value;
                  n(r, e, eo);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.id,
                  n = e.property,
                  r = n.name,
                  o = n.color,
                  i = n.linestyle,
                  a = n.linewidth,
                  s = n.transparency,
                  l = n.value,
                  c = n.visible;
                return b.createElement(
                  wt,
                  { labelAlign: "adaptive", label: b.createElement(Xt, { id: t, title: r.value(), visible: c }) },
                  b.createElement(
                    "div",
                    { className: or.block },
                    b.createElement(
                      "div",
                      { className: or.group },
                      b.createElement(rr, { disabled: !c.value(), color: o, transparency: s, thickness: a }),
                      b.createElement($r, { disabled: !c.value(), className: or.smallStyleControl, lineStyle: i })
                    ),
                    b.createElement(
                      "div",
                      { className: k(or.wrapGroup, or.defaultSelect, or.additionalSelect) },
                      b.createElement(Pe, {
                        input: { id: "", name: "", type: "integer", defval: 0 },
                        value: l.value(),
                        disabled: !c.value(),
                        onChange: this._onValueChange,
                      })
                    )
                  )
                );
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          no = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props.orders,
                  t = e.visible,
                  n = e.showLabels,
                  r = e.showQty;
                return b.createElement(
                  b.Fragment,
                  null,
                  b.createElement(
                    yt.Row,
                    null,
                    b.createElement(
                      yt.Cell,
                      { placement: "first", colSpan: 2 },
                      b.createElement(Xt, { id: "chart-orders-switch", title: window.t("Trades on Chart"), visible: t })
                    )
                  ),
                  b.createElement(
                    yt.Row,
                    null,
                    b.createElement(
                      yt.Cell,
                      { placement: "first", colSpan: 2 },
                      b.createElement(Xt, {
                        id: "chart-orders-labels-switch",
                        title: window.t("Signal Labels"),
                        visible: n,
                      })
                    )
                  ),
                  b.createElement(
                    yt.Row,
                    null,
                    b.createElement(
                      yt.Cell,
                      { placement: "first", colSpan: 2 },
                      b.createElement(Xt, { id: "chart-orders-qty-switch", title: window.t("Quantity"), visible: r })
                    )
                  )
                );
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          ro = window.t("Change Font"),
          oo = ["Verdana", "Courier New", "Times New Roman", "Arial"].map(function (e) {
            return { value: e, content: e };
          }),
          io = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onFontFamilyChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.fontFamily;
                  n(r, e, ro);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.fontFamily,
                  n = e.className,
                  r = e.disabled;
                return b.createElement(G, {
                  disabled: r,
                  className: N()(n, or.defaultSelect),
                  menuItemClassName: or.defaultSelectItem,
                  items: oo,
                  value: t.value(),
                  onChange: this._onFontFamilyChange,
                });
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          ao = window.t("Change Font Size"),
          so = [10, 11, 12, 14, 16, 20, 24, 28, 32, 40].map(function (e) {
            return { value: e, content: e.toString() };
          }),
          lo = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onFontSizeChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.fontSize;
                  n(r, e, ao);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props,
                  t = e.fontSize,
                  n = e.className,
                  r = e.disabled;
                return b.createElement(G, {
                  disabled: r,
                  className: N()(n, or.defaultSelect),
                  menuItemClassName: or.defaultSelectItem,
                  items: so,
                  value: t.value(),
                  onChange: this._onFontSizeChange,
                });
              }),
              (t.contextType = Kt),
              t
            );
          })(b.PureComponent),
          co = window.t("Change Visibility"),
          uo = window.t("Labels Font"),
          po = window.t("Show Labels"),
          ho = {
            Traditional: new Set(["S5/R5", "S4/R4", "S3/R3", "S2/R2", "S1/R1", "P"]),
            Fibonacci: new Set(["S3/R3", "S2/R2", "S1/R1", "P"]),
            Woodie: new Set(["S4/R4", "S3/R3", "S2/R2", "S1/R1", "P"]),
            Classic: new Set(["S4/R4", "S3/R3", "S2/R2", "S1/R1", "P"]),
            DM: new Set(["S1/R1", "P"]),
            DeMark: new Set(["S1/R1", "P"]),
            Camarilla: new Set(["S4/R4", "S3/R3", "S2/R2", "S1/R1", "P"]),
          },
          mo = (function (e) {
            function t() {
              var t = (null !== e && e.apply(this, arguments)) || this;
              return (
                (t._onChange = function (e) {
                  var n = t.context.setValue,
                    r = t.props.property.childs().levelsStyle,
                    o = r.childs().showLabels;
                  n(o, e, co);
                }),
                t
              );
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this.props.property.childs(),
                  t = e.font,
                  n = e.fontsize,
                  r = e.levelsStyle;
                return C.a.createElement(
                  C.a.Fragment,
                  null,
                  C.a.createElement(
                    wt,
                    { labelAlign: "adaptive", label: C.a.createElement("span", null, uo) },
                    C.a.createElement(
                      "div",
                      { className: or.block },
                      C.a.createElement("div", { className: or.group }, C.a.createElement(io, { fontFamily: t })),
                      C.a.createElement(
                        "div",
                        { className: k(or.wrapGroup, or.additionalSelect) },
                        C.a.createElement(lo, { fontSize: n })
                      )
                    )
                  ),
                  C.a.createElement(
                    yt.Row,
                    null,
                    C.a.createElement(
                      yt.Cell,
                      { placement: "first", colSpan: 2 },
                      C.a.createElement(Ie, {
                        label: po,
                        input: { id: "ShowLabels", type: "bool", defval: !0, name: "visible" },
                        value: r.childs().showLabels.value(),
                        onChange: this._onChange,
                      })
                    )
                  ),
                  this._renderColors()
                );
              }),
              (t.prototype._renderColors = function () {
                var e = this.props.property.childs(),
                  t = e.levelsStyle,
                  n = e.inputs,
                  r = t.childs(),
                  o = r.colors,
                  i = r.widths,
                  a = r.visibility,
                  s = n.childs().kind,
                  l = Object(V.ensureDefined)(ho[s.value()]);
                return o
                  .childNames()
                  .filter(function (e) {
                    return l.has(e);
                  })
                  .map(function (e) {
                    return C.a.createElement(Hr, {
                      key: e,
                      id: e,
                      title: e,
                      color: o.childs()[e],
                      visible: a.childs()[e],
                      thickness: i.childs()[e],
                    });
                  });
              }),
              (t.contextType = Kt),
              t
            );
          })(C.a.PureComponent),
          fo = {
            PivotPointsStandard: function () {
              var e = Object(V.ensureNotNull)(Object(b.useContext)(dr)),
                t = e.properties();
              return C.a.createElement(mo, { property: t });
            },
          },
          vo = (function (e) {
            function t() {
              return (null !== e && e.apply(this, arguments)) || this;
            }
            return (
              P.__extends(t, e),
              (t.prototype.render = function () {
                var e = this,
                  t = this.props.model;
                return b.createElement(dr.Consumer, null, function (n) {
                  return b.createElement(
                    qt,
                    { property: Object(V.ensureNotNull)(n).properties(), model: t },
                    b.createElement(yt, null, e._renderCustomContent(Object(V.ensureNotNull)(n).metaInfo().shortId))
                  );
                });
              }),
              (t.prototype._renderCustomContent = function (e) {
                var t = fo[e];
                return t ? b.createElement(t, null) : null;
              }),
              t
            );
          })(b.PureComponent),
          _o = window.t("Default"),
          go = window.t("Precision"),
          yo = window.t("Change Precision"),
          bo = [{ value: "default", content: _o }],
          Co = 0;
        Co <= 8;
        Co++
      )
        bo.push({ value: Co, content: Co.toString() });
      for (
        wo = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._onChange = function (e) {
                var n = t.context.setValue,
                  r = t.props.precision;
                n(r, e, yo);
              }),
              t
            );
          }
          return (
            P.__extends(t, e),
            (t.prototype.render = function () {
              var e = this.props.precision;
              return b.createElement(
                wt,
                { label: go },
                b.createElement(G, {
                  className: or.defaultSelect,
                  menuItemClassName: or.defaultSelectItem,
                  items: bo,
                  value: e.value(),
                  onChange: this._onChange,
                })
              );
            }),
            (t.contextType = Kt),
            t
          );
        })(b.PureComponent),
          Eo = window.t("Default"),
          So = window.t("Override Min Tick"),
          xo = window.t("Change Min Tick"),
          Po = [
            { priceScale: 1, minMove: 1, frac: !1 },
            { priceScale: 10, minMove: 1, frac: !1 },
            { priceScale: 100, minMove: 1, frac: !1 },
            { priceScale: 1e3, minMove: 1, frac: !1 },
            { priceScale: 1e4, minMove: 1, frac: !1 },
            { priceScale: 1e5, minMove: 1, frac: !1 },
            { priceScale: 1e6, minMove: 1, frac: !1 },
            { priceScale: 1e7, minMove: 1, frac: !1 },
            { priceScale: 1e8, minMove: 1, frac: !1 },
            { priceScale: 2, minMove: 1, frac: !0 },
            { priceScale: 4, minMove: 1, frac: !0 },
            { priceScale: 8, minMove: 1, frac: !0 },
            { priceScale: 16, minMove: 1, frac: !0 },
            { priceScale: 32, minMove: 1, frac: !0 },
            { priceScale: 64, minMove: 1, frac: !0 },
            { priceScale: 128, minMove: 1, frac: !0 },
            { priceScale: 320, minMove: 1, frac: !0 },
          ],
          ko = [{ value: "default", content: Eo }],
          No = 0;
        No < Po.length;
        No++
      )
        (Oo = Po[No]),
          ko.push({
            value: Oo.priceScale + "," + Oo.minMove + "," + Oo.frac,
            content: Oo.minMove + "/" + Oo.priceScale,
          });
      (To = (function (e) {
        function t() {
          var t = (null !== e && e.apply(this, arguments)) || this;
          return (
            (t._onChange = function (e) {
              var n = t.context.setValue,
                r = t.props.minTick;
              n(r, e, xo);
            }),
            t
          );
        }
        return (
          P.__extends(t, e),
          (t.prototype.render = function () {
            var e = this.props.minTick;
            return b.createElement(
              wt,
              { label: So },
              b.createElement(G, {
                className: or.defaultSelect,
                menuItemClassName: or.defaultSelectItem,
                items: ko,
                value: e.value(),
                onChange: this._onChange,
              })
            );
          }),
          (t.contextType = Kt),
          t
        );
      })(b.PureComponent)),
        (Io = "Background"),
        (Mo = (function (e) {
          function t() {
            var t = (null !== e && e.apply(this, arguments)) || this;
            return (
              (t._findPlotPalette = function (e) {
                var n = t.props.study,
                  r = n.metaInfo(),
                  o = Object(V.ensureDefined)(r.palettes);
                return Object(Mt.isBarColorerPlot)(e) || Object(Mt.isBgColorerPlot)(e)
                  ? { palette: o[e.palette], paletteProps: n.properties().palettes[e.palette] }
                  : t._findPaletteByTargetId(e.id);
              }),
              t
            );
          }
          return (
            P.__extends(t, e),
            (t.prototype.render = function () {
              var e,
                t,
                n,
                r,
                o,
                i,
                a,
                s,
                l,
                c,
                u,
                p,
                d,
                h = this,
                m = this.props,
                f = m.study,
                v = m.model,
                _ = f.metaInfo();
              return (
                (d = _.shortId),
                Object.keys(fo).includes(d)
                  ? b.createElement(vo, { model: v })
                  : ((e = new Rt(_).getUserEditablePlots()),
                    (t = f.properties()),
                    (n = t.bands),
                    (r = t.bandsBackground),
                    (o = t.areaBackground),
                    (i = t.precision),
                    (a = t.strategy),
                    (s = t.minTick),
                    (l = _.filledAreas),
                    (c = _.graphics),
                    (u = e.length > 0 || (c && Object.keys(c).length > 0)),
                    (p = f.canOverrideMinTick()),
                    b.createElement(
                      qt,
                      { property: t, model: v },
                      b.createElement(
                        yt,
                        null,
                        e.map(function (e) {
                          var t = Object(Mt.isOhlcPlot)(e) ? P.__assign({}, e, { id: e.target }) : e,
                            n = h._findPlotPalette(t),
                            r = n.palette,
                            o = n.paletteProps;
                          return b.createElement(Ur, { key: e.id, plot: e, palette: r, paletteProps: o, study: f });
                        }),
                        n &&
                          n.childNames().map(function (e, t) {
                            var r = n.child(e);
                            if (!r.isHidden || !r.isHidden.value())
                              return b.createElement(to, { key: t, id: r.name.value(), property: r });
                          }),
                        r &&
                          b.createElement(Hr, {
                            id: "bandsBackground",
                            title: Io,
                            visible: r.fillBackground,
                            color: r.backgroundColor,
                            transparency: r.transparency,
                          }),
                        o &&
                          b.createElement(Hr, {
                            id: "areaBackground",
                            title: Io,
                            visible: o.fillBackground,
                            color: o.backgroundColor,
                            transparency: o.transparency,
                          }),
                        l &&
                          l.map(function (e) {
                            var t, n, r;
                            if (!e.isHidden)
                              return (
                                (t = f.properties().filledAreasStyle[e.id]),
                                (n = e.title || Io),
                                e.palette
                                  ? ((r = h._findPaletteByTargetId(e.id)),
                                    b.createElement(lr, {
                                      key: e.id,
                                      area: e,
                                      palette: Object(V.ensureDefined)(r.palette),
                                      paletteProps: Object(V.ensureDefined)(r.paletteProps),
                                      styleProp: t,
                                    }))
                                  : b.createElement(Hr, {
                                      key: e.id,
                                      id: e.id,
                                      title: n,
                                      color: t.color,
                                      visible: t.visible,
                                      transparency: t.transparency,
                                    })
                              );
                          }),
                        !1,
                        u && b.createElement(wo, { precision: i }),
                        p && b.createElement(To, { minTick: s }),
                        tt.a.isScriptStrategy(_) && b.createElement(no, { orders: a.orders })
                      )
                    ))
              );
            }),
            (t.prototype._findPaletteByTargetId = function (e) {
              var t,
                n,
                r,
                o = this.props.study,
                i = o.metaInfo(),
                a = i.plots,
                s = Object(V.ensureDefined)(i.palettes);
              for (t = 0, n = a; t < n.length; t++)
                if (((r = n[t]), (Object(Mt.isColorerPlot)(r) || Object(Mt.isOhlcColorerPlot)(r)) && r.target === e))
                  return { palette: s[r.palette], paletteProps: o.properties().palettes[r.palette] };
              return {};
            }),
            t
          );
        })(b.PureComponent)),
        (Do = (function (e) {
          function t() {
            return (null !== e && e.apply(this, arguments)) || this;
          }
          return (
            P.__extends(t, e),
            (t.prototype.render = function () {
              return b.createElement(
                dr.Provider,
                { value: this.props.source },
                b.createElement(Mo, { study: this.props.source, model: this.props.model })
              );
            }),
            t
          );
        })(b.PureComponent)),
        n.d(t, "NewEditObjectDialog", function () {
          return jo;
        }),
        (jo = (function () {
          function e(e, t, n) {
            var r = this;
            (this._container = document.createElement("div")),
              (this._isVisible = !1),
              (this._handleClose = function () {
                y.unmountComponentAtNode(r._container), (r._isVisible = !1);
              }),
              (this._handleCancel = function () {
                r._model.undoToCheckpoint(r._checkpoint);
              }),
              (this._handleSubmit = function () {}),
              (this._handleActiveTabChanged = function (e) {
                w.setValue(r._activeTabSettingsName(), e);
              }),
              (this._source = e),
              (this._model = t),
              (this._checkpoint = this._ensureCheckpoint(n));
          }
          return (
            (e.prototype.hide = function (e) {
              e ? this._handleCancel() : this._handleSubmit(), this._handleClose();
            }),
            (e.prototype.isVisible = function () {
              return this._isVisible;
            }),
            (e.prototype.focusOnText = function () {}),
            (e.prototype.show = function (e) {
              var t, n, r, o;
              void 0 === e && (e = {}),
                E.enabled("property_pages") &&
                  ((t =
                    !this._source.isPine() || this._source.isStandardPine()
                      ? this._source.metaInfo().description
                      : "Custom Pine"),
                  Object(x.trackEvent)("GUI", "Study Properties", t),
                  this._model.model().addSourceToSelection(this._source),
                  (n = {
                    byId: {
                      inputs: { title: window.t("Inputs"), Component: Gt },
                      style: { title: window.t("Style"), Component: Do },
                      properties: { title: window.t("Properties"), Component: Wt },
                    },
                    allIds: [],
                  }),
                  (r = new Rt(this._source.metaInfo())).hasUserEditableInputs() && n.allIds.push("inputs"),
                  r.hasUserEditableProperties() && n.allIds.push("properties"),
                  n.allIds.push("style"),
                  (o = e.initialTab || w.getValue(this._activeTabSettingsName()) || "inputs"),
                  y.render(
                    b.createElement(re, {
                      title: this._source.metaInfo().shortDescription,
                      model: this._model,
                      source: this._source,
                      initialActiveTab: n.allIds.includes(o) ? o : n.allIds[0],
                      pages: n,
                      onSubmit: this._handleSubmit,
                      onCancel: this._handleCancel,
                      onClose: this._handleClose,
                      onActiveTabChanged: this._handleActiveTabChanged,
                    }),
                    this._container
                  ),
                  (this._isVisible = !0),
                  S.emit("edit_object_dialog", { objectType: "study", scriptTitle: this._source.title() }));
            }),
            (e.prototype._activeTabSettingsName = function () {
              return "properties_dialog.active_tab.study";
            }),
            (e.prototype._ensureCheckpoint = function (e) {
              return void 0 === e && (e = this._model.createUndoCheckpoint()), e;
            }),
            e
          );
        })());
    },
    yd0C: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 17" width="17" height="17"><path fill="currentColor" d="M1 8.5a7.5 7.5 0 1 1 15 0 7.5 7.5 0 0 1-15 0zM8.5 0a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17zM9 9V3H8v5H5v1h4z"/></svg>';
    },
    zztK: function (e, t) {
      e.exports =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="23" height="23" fill="none"><path stroke="currentColor" stroke-width="1.2" d="M1 1l21 21m0-21L1 22"/></svg>';
    },
  },
]);
