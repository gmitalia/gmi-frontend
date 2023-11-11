(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
  [195],
  {
    3986: function (e, r, s) {
      (window.__NEXT_P = window.__NEXT_P || []).push([
        "/blog",
        function () {
          return s(4178);
        },
      ]);
    },
    8429: function (e, r, s) {
      "use strict";
      var t = s(5893),
        n = s(3774);
      r.Z = function (e) {
        var r,
          s,
          i = e.post,
          c = i.categories[0].toLowerCase().replace(" ", "-");
        return (0, t.jsxs)("section", {
          className: "blog-card blog-card--".concat(c),
          children: [
            (0, t.jsx)("div", {
              className: "blog-card__image",
              style: {
                backgroundImage: "url(".concat(
                  null ===
                    (r = (0, n.uH)(
                      null === i || void 0 === i ? void 0 : i.mainImage
                    )) || void 0 === r
                    ? void 0
                    : r.url()
                ),
              },
            }),
            (0, t.jsx)("div", {
              className: "blog-card__category",
              children: c,
            }),
            (0, t.jsxs)("div", {
              className: "blog-card__body",
              children: [
                (0, t.jsx)("div", {
                  children: (0, t.jsx)("a", {
                    className: "blog-card__link",
                    href: "/posts/".concat(
                      null === i || void 0 === i ? void 0 : i.slug.current
                    ),
                    title: null === i || void 0 === i ? void 0 : i.title,
                    children: (0, t.jsx)("h2", {
                      className: "blog-card__title",
                      children: null === i || void 0 === i ? void 0 : i.title,
                    }),
                  }),
                }),
                (0, t.jsx)("div", {
                  className: "blog-card__description",
                  children: null === i || void 0 === i ? void 0 : i.description,
                }),
              ],
            }),
            (0, t.jsxs)("div", {
              className: "blog-card__author",
              children: [
                "di ",
                null === i ||
                void 0 === i ||
                null === (s = i.author) ||
                void 0 === s
                  ? void 0
                  : s.name,
              ],
            }),
          ],
        });
      };
    },
    4344: function (e, r, s) {
      "use strict";
      s.d(r, {
        Z: function () {
          return a;
        },
      });
      var t = s(5893),
        n = function () {
          return (0, t.jsx)("div", {
            children: (0, t.jsx)("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              children: (0, t.jsx)("path", {
                fill: "currentColor",
                d: "M19.27 5.33C17.94 4.71 16.5 4.26 15 4a.09.09 0 0 0-.07.03c-.18.33-.39.76-.53 1.09a16.09 16.09 0 0 0-4.8 0c-.14-.34-.35-.76-.54-1.09c-.01-.02-.04-.03-.07-.03c-1.5.26-2.93.71-4.27 1.33c-.01 0-.02.01-.03.02c-2.72 4.07-3.47 8.03-3.1 11.95c0 .02.01.04.03.05c1.8 1.32 3.53 2.12 5.24 2.65c.03.01.06 0 .07-.02c.4-.55.76-1.13 1.07-1.74c.02-.04 0-.08-.04-.09c-.57-.22-1.11-.48-1.64-.78c-.04-.02-.04-.08-.01-.11c.11-.08.22-.17.33-.25c.02-.02.05-.02.07-.01c3.44 1.57 7.15 1.57 10.55 0c.02-.01.05-.01.07.01c.11.09.22.17.33.26c.04.03.04.09-.01.11c-.52.31-1.07.56-1.64.78c-.04.01-.05.06-.04.09c.32.61.68 1.19 1.07 1.74c.03.01.06.02.09.01c1.72-.53 3.45-1.33 5.25-2.65c.02-.01.03-.03.03-.05c.44-4.53-.73-8.46-3.1-11.95c-.01-.01-.02-.02-.04-.02zM8.52 14.91c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.84 2.12-1.89 2.12zm6.97 0c-1.03 0-1.89-.95-1.89-2.12s.84-2.12 1.89-2.12c1.06 0 1.9.96 1.89 2.12c0 1.17-.83 2.12-1.89 2.12z",
              }),
            }),
          });
        },
        i = function () {
          return (0, t.jsx)("div", {
            children: (0, t.jsx)("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              children: (0, t.jsx)("path", {
                fill: "currentColor",
                d: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584l-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
              }),
            }),
          });
        },
        c = function () {
          return (0, t.jsx)("div", {
            children: (0, t.jsxs)("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              width: "24",
              height: "24",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                (0, t.jsx)("path", {
                  d: "M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17",
                }),
                (0, t.jsx)("path", { d: "m10 15 5-3-5-3z" }),
              ],
            }),
          });
        },
        o = function (e) {
          var r = e.social;
          return (0, t.jsx)("a", {
            href: (function (e) {
              switch (e) {
                case "Twitter":
                  return "https://twitter.com/GameMakerIta";
                case "Discord":
                  return "https://discord.gg/0wKBBPIbX2r3S32a";
                case "YouTube":
                  return "https://www.youtube.com/channel/UCee7hFC_VtQ_gnX5J2tMTHg";
              }
            })(r),
            title: r,
            children: (function (e) {
              switch (e) {
                case "Twitter":
                  return (0, t.jsx)(i, {});
                case "Discord":
                  return (0, t.jsx)(n, {});
                case "YouTube":
                  return (0, t.jsx)(c, {});
              }
            })(r),
          });
        },
        a = function () {
          return (0, t.jsx)("div", {
            className: "footer",
            children: (0, t.jsx)("div", {
              className: "footer__body",
              children: (0, t.jsxs)("div", {
                className: "footer__social",
                children: [
                  (0, t.jsx)("div", { children: "Seguici su:" }),
                  (0, t.jsx)(o, { social: "YouTube" }),
                  (0, t.jsx)(o, { social: "Twitter" }),
                  (0, t.jsx)(o, { social: "Discord" }),
                ],
              }),
            }),
          });
        };
    },
    6952: function (e, r, s) {
      "use strict";
      s.d(r, {
        Z: function () {
          return l;
        },
      });
      var t = s(5893),
        n = s(7294),
        i = s(1664),
        c = s.n(i),
        o = function (e) {
          var r = e.openMenu,
            s = (e.setOpenMenu, (0, n.useState)(!1)),
            i = s[0],
            o = s[1];
          return (
            (0, n.useEffect)(function () {
              var e =
                window.innerWidth < 768
                  ? function () {
                      return o(!0);
                    }
                  : function () {
                      return o(!1);
                    };
              return (
                e(),
                window.addEventListener("resize", e),
                function () {
                  return window.removeEventListener("resize", e);
                }
              );
            }),
            (0, t.jsx)(t.Fragment, {
              children:
                ((i && r) || !i) &&
                (0, t.jsxs)("ul", {
                  className:
                    "ml-0 text-md flex flex-col items-start md:flex-row md:justify-end md:items-center space-x-5 flex-1 z-1 md:z-auto absolute md:static w-full bg-white left-0",
                  children: [
                    (0, t.jsx)("li", {
                      className:
                        "border-transparent w-full md:w-auto hover:underline decoration-2 duration-500 my-6 ml-5 md:my-0",
                      children: (0, t.jsx)(c(), {
                        href: "/blog",
                        children: "Blog",
                      }),
                    }),
                    (0, t.jsx)("li", {
                      className:
                        "border-transparent w-full md:w-auto hover:underline decoration-2 duration-500 my-6 md:my-0",
                      children: (0, t.jsx)(c(), {
                        href: "/competizioni",
                        children: "Competizioni",
                      }),
                    }),
                    (0, t.jsx)("li", {
                      className:
                        "border-transparent w-full md:w-auto hover:underline decoration-2 duration-500 my-6 md:my-0",
                      children: (0, t.jsx)(c(), {
                        href: "https://gmiscores.altervista.org",
                        children: "GMIScores",
                      }),
                    }),
                    (0, t.jsx)("li", {
                      className:
                        "border-transparent w-full md:w-auto hover:underline decoration-2 duration-500 my-6 md:my-0",
                      children: (0, t.jsx)(c(), {
                        href: "https://gmitalia.altervista.org/site/risorse-2/",
                        children: "Risorse",
                      }),
                    }),
                    (0, t.jsx)("li", {
                      className: "my-6 md:my-0",
                      children: (0, t.jsx)("div", {
                        className: "items-center justify-end",
                        children: (0, t.jsx)("div", {
                          className:
                            "flex justify-center items-center text-white bg-gray-800 px-4 py-2 rounded-full leading-none hover:shadow-lg hover:contrast-200 transition-all",
                          children: (0, t.jsx)(c(), {
                            href: "https://discord.gg/0wKBBPIbX2r3S32a",
                            children: "Entra su Discord",
                          }),
                        }),
                      }),
                    }),
                  ],
                }),
            })
          );
        };
      var a = function (e) {
          return (0, t.jsx)("svg", {
            xmlns: "http://www.w3.org/2000/svg",
            version: "1.1",
            viewBox: "0 0 28.7 28.7",
            xmlSpace: "preserve",
            className: e.className,
            children: (0, t.jsxs)("g", {
              fillOpacity: "1",
              strokeDasharray: "none",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              strokeOpacity: "1",
              transform: "translate(-1.65 -1.65)",
              children: [
                (0, t.jsx)("path", {
                  fill: "#f20d0d",
                  stroke: "none",
                  strokeWidth: "1",
                  d: "M12 6l4-4 14 14h-8z",
                  vectorEffect: "non-scaling-stroke",
                }),
                (0, t.jsx)("path", {
                  fill: "#1eb464",
                  stroke: "none",
                  strokeWidth: "1",
                  d: "M6 12l14 14-4 4L2 16z",
                  vectorEffect: "non-scaling-stroke",
                }),
                (0, t.jsx)("path", {
                  fill: "#fff",
                  stroke: "none",
                  strokeWidth: "1",
                  d: "M10 16l6-6-4-4-6 6zm6 6v-6h6v8l-2 2z",
                  vectorEffect: "non-scaling-stroke",
                }),
                (0, t.jsx)("path", {
                  fill: "none",
                  stroke: "#000",
                  strokeWidth: "0.7",
                  d: "M16 2l14 14h-8l-6-6-6 6 6 6v-6h6v8l-6 6L2 16z",
                }),
              ],
            }),
          });
        },
        l = function () {
          var e = (0, n.useState)(!1),
            r = e[0],
            s = e[1];
          return (0, t.jsx)("header", {
            className: "bg-white",
            children: (0, t.jsx)("div", {
              className: "md:flex md:justify-between p-5 max-w-7xl mx-auto",
              children: (0, t.jsxs)("div", {
                className:
                  "block md:flex md:space-x-5 items-center w-full gap-5",
                children: [
                  (0, t.jsxs)("div", {
                    className: "flex items-center justify-between space-x-5",
                    children: [
                      (0, t.jsxs)("a", {
                        href: "/",
                        title: "GameMaker Italia Home Page",
                        className: "flex gap-2",
                        children: [
                          (0, t.jsx)(a, {
                            className: "w-9 object-contain cursor-pointer",
                          }),
                          (0, t.jsx)("span", {
                            className: "text-3xl hidden lg:block ",
                            children: "GameMaker Italia",
                          }),
                        ],
                      }),
                      (0, t.jsx)("button", {
                        className: "md:hidden relative",
                        onClick: function () {
                          return s(!r);
                        },
                        children: (0, t.jsxs)("div", {
                          className: "space-y-2",
                          children: [
                            (0, t.jsx)("div", {
                              className: "w-8 h-0.5 bg-gray-600",
                            }),
                            (0, t.jsx)("div", {
                              className: "w-8 h-0.5 bg-gray-600",
                            }),
                            (0, t.jsx)("div", {
                              className: "w-8 h-0.5 bg-gray-600",
                            }),
                          ],
                        }),
                      }),
                    ],
                  }),
                  (0, t.jsx)(o, { openMenu: r, setOpenMenu: s }),
                ],
              }),
            }),
          });
        };
    },
    4178: function (e, r, s) {
      "use strict";
      s.r(r),
        s.d(r, {
          __N_SSG: function () {
            return l;
          },
          default: function () {
            return d;
          },
        });
      var t = s(5893),
        n = s(9008),
        i = s.n(n),
        c = s(6952),
        o = s(8429),
        a = s(4344),
        l = !0;
      function d(e) {
        var r = e.posts;
        return (0, t.jsxs)("div", {
          children: [
            (0, t.jsxs)(i(), {
              children: [
                (0, t.jsx)("title", { children: "GameMaker Italia | Blog" }),
                (0, t.jsx)("link", { rel: "icon", href: "/favicon.ico" }),
                (0, t.jsx)("meta", {
                  property: "og:title",
                  content: "GameMaker Italia | Blog",
                }),
                (0, t.jsx)("meta", {
                  property: "og:description",
                  content: "Sviluppatori per passione",
                }),
                (0, t.jsx)(
                  "meta",
                  { name: "description", content: "Sviluppatori per passione" },
                  "desc"
                ),
                (0, t.jsx)("meta", {
                  property: "og:image",
                  content: "../public/images/gmi_logo.png",
                }),
              ],
            }),
            (0, t.jsx)(c.Z, {}),
            (0, t.jsxs)("div", {
              className: "max-w-7xl mx-auto p-5 blog-section",
              children: [
                (0, t.jsx)("h2", {
                  className: "text-3xl mb-3",
                  children: "Blog",
                }),
                (0, t.jsx)("div", {
                  className:
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 py-3",
                  children: r.map(function (e) {
                    return (0,
                    t.jsx)(o.Z, { post: e }, null === e || void 0 === e ? void 0 : e._id);
                  }),
                }),
              ],
            }),
            (0, t.jsx)(a.Z, {}),
          ],
        });
      }
    },
    3774: function (e, r, s) {
      "use strict";
      s.d(r, {
        uH: function () {
          return o;
        },
        vc: function () {
          return c;
        },
      });
      var t = s(1561),
        n = s(6803),
        i = s.n(n),
        c = {
          dataset: "production",
          projectId: "idfqw720",
          userCdn: !0,
          apiVersion: "2021-12-28",
        },
        o =
          ((0, t.eI)(c),
          function (e) {
            return i()(c).image(e);
          });
      (0, t.Iy)(c);
    },
  },
  function (e) {
    e.O(0, [935, 774, 888, 179], function () {
      return (r = 3986), e((e.s = r));
      var r;
    });
    var r = e.O();
    _N_E = r;
  },
]);
