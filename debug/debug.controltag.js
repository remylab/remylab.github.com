(function() {
    var m, z;
    (function() {
        var b = this, e = {};
        m = function(c, a) {
            m[c] = a
        };
        z = function(c) {
            if (z[c] === e)
                throw "Circular require";
            if (!m[c])
                throw "Unknown require: " + c;
            
            var zDebug1 = z[c];
            var zDebug2 = (z[c] = e) && (z[c] = new function() {
                return m[c](this, z, b) || this
            });
            
            if ( zDebug1 !== undefined && zDebug1.init !== undefined) {
            	return zDebug1;
            } else {
            	return zDebug2;
            }
            
            //return z[c] || (z[c] = e) && (z[c] = new function() {
            //    return m[c](this, z, b) || this
            //})
        }
    })();
    m("adm-events", function(b, e) {
        var c = e("util"), a = e("store"), g = e("routes"), i = b.COOKIE_SERVICE_TTL = 30 * a.MINUTES, d = b.EVENT_TTL = 2 * a.DAYS, f = b.prefix = "e_", j = b.knownEventIds = [];
        b.addEventId = function(a) {
            c.contains(j, a) || j.push(a)
        };
        var k = b.parse = function(a) {
            a = a.split("&");
            return {id: a.shift(),
                attrs: c.parseKeyValues(a.join("&"))}
        }, h = b.stringify = function(a) {
            return a.id + "&" + c.paramString(a.attrs)
        }, p = b.storeEvent = function(c, b) {
            b = b || 0;
            a.set(f + h(c), 1, d - b)
        }, r = b.processEvent = function(a) {
            var f = "event_" + a.id;
            c.set(f, !0);
            c.eachHash(a.attrs, function(a, b) {
                var d = f + "_attr_" + a, d = c.get(d) || c.set(d, []);
                c.contains(d, b) || d.push(b)
            })
        }, l = b.readFromStore = function() {
            var b = a.namespace(f);
            c.eachHash(b, function(a) {
                r(k(a))
            })
        }, n = b.process3rdParty = function(a) {
            var b = /^e_(.*)/, f;
            c.eachHash(a, function(d) {
                if (f = d.match(b)) {
                    var h = 
                    k(f[1].replace(/\^/g, "&").replace(/\|/g, "="));
                    c.contains(j, h.id) && (d = (new Date - new Date(parseInt(a[d], 10))) / 1E3, p(h, d), r(h))
                }
            })
        };
        b.check3rdParty = function() {
            j.length && !a.get("event3p") && e("http").jsonp({url: c.get("url_cookies") || "//beacon.krxd.net/cookie2json",callback: "kxjsonp_3pevents",done: function(c) {
                    a.set("event3p", "1", i);
                    n(c)
                }})
        };
        l();
        g.simple("admEvent", function(a, f) {
            var b = {id: a,attrs: f};
            p(b);
            r(b);
            e("http").pixel({url: c.get("url_event"),data: c.extend({event_id: a,pub_id: c.get("pubid")}, f)})
        })
    });
    m("browser-sniff", function(b, e, c) {
        var a = e("util"), g = {ANDROID: "Android",CHROME: "Chrome",FIREFOX: "Firefox",IE: "Internet Explorer",OPERA: "Opera",OTHER: "Other",SAFARI: "Safari"}, b = function(b) {
            var b = b || a.deref(c, "navigator.userAgent"), d = a.partial(a.matchAll, b), b = d("Chrome", "OPR"), f = d("Chrome") && !b, j = d("Trident", "WOW") || d("MSIE"), k = d("Linux", "Android"), h = !b && !f && !j && !k && d("Safari", "like Gecko"), d = d("Gecko", "Firefox");
            return f ? g.CHROME : j ? g.IE : h ? g.SAFARI : b ? g.OPERA : d ? g.FIREFOX : k ? g.ANDROID : g.OTHER
        };
        return a.extend({Browsers: g,
            is: b(),parse: b})
    });
    m("class", function(b, e) {
        var c = e("util"), a = b.beget = function(a, b) {
            function d() {
                this.constructor = b
            }
            c.extend(b, a);
            d.prototype = a.prototype;
            b.prototype = new d;
            return b
        };
        (b.Class = c.extend(function() {
            var a = arguments;
            c.each(this._class.initializers, function(b, c) {
                c.apply(this, a)
            }, this)
        }, {extensions: {extension: [/^extension_(.+)/, function(a, b) {
                        var d = {};
                        d[a[1]] = b;
                        this.extensions = c.extend(this.extensions || {}, d)
                    }]},mixin: function(a) {
                c.isFunction(a) ? a(this) : c.each(a, c.bind(this.mixinProperty, this))
            },
            mixinProperty: function(a, b) {
                var d;
                c.some(this.extensions, function(c, j) {
                    if (d = a.match(j[0]))
                        return j[1].call(this, d, b) || !0
                }, this) || (this.prototype[a] = b)
            }})).mixin({_bind: function(a) {
                c.each(a.split(" "), function(a) {
                    this[a] = c.bind(this[a], this)
                }, this)
            },_apply: function(a, b) {
                this[a].apply(this, b)
            },_super: function(a, b) {
                var d, f = this._superctx;
                this._superctx = (this._superctx || this)._superproto;
                c.isString(a) ? d = this._superctx[a].apply(this, b || []) : this._superctx.constructor.apply(this, a || []);
                this._superctx = f;
                return d
            },extension_classMethod: [/^__(.+)/, function(a, b) {
                    this[a[1]] = b
                }],extension_initialier: [/^_init_(.+)/, function(a, b) {
                    var d = {};
                    d[a[1]] = b;
                    this.initializers = c.extend(this.initializers || {}, d)
                }],__extend: function(b) {
                a(this, b).construct(this, c.rest(arguments, 1));
                return b
            },__construct: function(a, b) {
                this.prototype._superproto = a.prototype;
                this.prototype._class = this;
                if (!this.name) {
                    var d = this.toString().match(/function\s+([^\(]+)/);
                    d && (this.name = d[1])
                }
                c.each(b, function(a) {
                    this.mixin(a)
                }, this);
                this.init()
            },
            __init: function() {
            }})
    });
    m("client-type", function() {
        return {PUBLISHER: 0,MARKETER: 1}
    });
    m("config", function(b, e) {
        var c = e("util"), a = e("store"), g = e("stateful").Stateful, i = g.extend(function(a) {
            this._super(arguments);
            this._type = "Config";
            this._handles = [];
            this._persisted = [];
            this._defaults = {confid: "no-confid"}
        }, {get: function(a) {
                a = this._pointerPair(a);
                return c.isString(a[1]) ? c.deref(a[0], a[1]) : a[0]
            },set: function(a, b) {
                var d = this._pointerPair(a), h;
                c.isString(d[1]) ? (h = c.deref(d[0], d[1]), d[0][d[1]] = b, this._fire("set", 
                a, h, b)) : this._super("set", arguments);
                return this
            },remove: function(a) {
                var b = this._pointerPair(a), d;
                c.isString(b[1]) ? (d = c.deref(b[0], b[1]), delete b[0][b[1]], this._fire("remove", a, d, c.UNDEFINED)) : this._super("remove", arguments);
                return this
            },has: function(a) {
                return this._has(a) || c.existy(this.get(a))
            },persist: function(b) {
                var b = c.difference(c.toArray(arguments), this._persisted), d = this, k = function(b) {
                    d.has(b, !0) && a.set(b, d.get(b))
                };
                this._handles.push.apply(this._handles, c.map(b, function(b) {
                    var d = c.partial(k, 
                    b);
                    d();
                    return c.compose(this.watch("set:" + b, d), this.watch("remove:" + b, function() {
                        a.remove(b)
                    }, this))
                }, this));
                this._persisted.push.apply(this._persisted, b)
            },destroy: function() {
                c.forEach(this._handles, function(a) {
                    a()
                });
                return this
            },toJSON: function() {
                return c.extend({}, this._defaults, this._raw)
            },_has: function() {
                return g.prototype.has.apply(this, arguments)
            },_pointerPair: function(a) {
                var b = !1, d = a, h, e;
                0 < a.indexOf(".") && !this._has(a) && (h = a.split("."), d = h[0], b = !0);
                a = g.prototype.get.call(this, d);
                b && ((b = h.slice(1, 
                h.length - 2).join(".")) && (a = c.deref(a, b)), e = h.pop());
                return [a, e]
            }}), d;
        return c.extend(function(a) {
            if (a || !d)
                d = new i(a);
            return d
        }, {Config: i}, b)
    });
    m("context-terms", function(b, e, c) {
        var a = e("util"), g = c.document, c = "a form script noscript style select textarea button".split(" "), i = RegExp("<(" + c.join("|") + ")\\b", "i"), d = RegExp("^(" + c.join("|") + ")$", "i");
        b.process = function(b) {
            for (var c = [g.body], f = "", e; e = c.shift(); )
                3 === e.nodeType ? f += e.nodeValue : 1 === e.nodeType && !d.test(e.nodeName) && (i.test(e.innerHTML) ? [].unshift.apply(c, 
                a.toArray(e.childNodes)) : f += e.innerText || e.textContent);
            f = f.replace(/\s\s+/g, " ");
            a.each(b, function(b) {
                b.matches = 0;
                var c = RegExp("\\b" + a.escapeRegexp(b.value) + "\\b", "ig");
                f.replace(c, function() {
                    b.matches++
                })
            });
            b = a.filter(b, function(b) {
                return a.set("context_term_" + b.id, b.matches)
            });
            a.set("context_terms_processed", !0);
            a.set("page_attr_kx_context_terms", b);
            a.set("context_terms", a.map(b, function(a) {
                return a.id
            }));
            return {text: f,terms: b}
        };
        var f = e("pixel"), b = b.pixelFormatter = function(b) {
            return a.map(b, function(a) {
                return a.id + 
                f.tuppleSeparator + a.matches
            }).join(",")
        };
        f.addFormatter("_kpa_kx_context_terms", b)
    });
    m("crypto-util", function(b, e) {
        var c = e("util"), a = function(a, b, c) {
            return (a | b << 24 - 8 * (c % 4)) >>> 0
        }, g = function(a) {
            for (var b = [], c = 0; c < a.length; c += 8)
                b.push(a.substr(c, 8));
            return b
        };
        return b = {BITS_PER_BYTE: 8,BITS_PER_WORD: 32,BYTES_PER_WORD: 4,MAX_BYTE: 255,MAX_WORD: 4294967295,WORD_SIZE: 32,pad: function(a, b, c) {
                for (var b = b || "0", j = [], c = (c || 32) - a.length, k = 0; k < c; ++k)
                    j.push(b);
                return j.join("") + a
            },fromWordToBytesArray: function(a) {
                return c.map(c.range(4), 
                function(b) {
                    return a >>> 24 - 8 * (b % 4) & 255
                })
            },fromBytesArrayToWord: function(b) {
                return c.reduce(b, a, 0)
            },toWord: function(a) {
                return b.pad(Number(a).toString(2))
            },fromWord: function(a) {
                return parseInt(a, 2)
            },toHex: function(a) {
                return Number(a).toString(16)
            },fromHex: function(a) {
                return parseInt(a, 16)
            },rotl: function(a, b, c) {
                return a << b | a >>> (c || 32) - b
            },rotr: function(a, b, c) {
                return a >>> b | a << (c || 32) - b
            },fromWordsToLatin1: function(a) {
                return c.map(a, function(a) {
                    return c.reduce(b.fromWordToBytesArray(a), function(a, b) {
                        return a + 
                        String.fromCharCode(b)
                    }, "")
                }).join("")
            },fromLatin1ToWords: function(a) {
                for (var b = [], c = 0, j = a.length; c < j; c++)
                    b[c >>> 2] |= (a.charCodeAt(c) & 255) << 24 - 8 * (c % 4);
                return b
            },fromWordsToUtf8: function(a) {
                try {
                    return decodeURIComponent(escape(b.fromWordsToLatin1(a)))
                } catch (c) {
                    throw Error("Malformed UTF-8 data");
                }
            },fromUtf8ToWords: function(a) {
                return b.fromLatin1ToWords(unescape(encodeURIComponent(a)))
            },fromWordsToHex: function(a) {
                for (var c = b.calculateSigBytesForWords(a), f = [], j = 0; j < c; j++) {
                    var k = a[j >>> 2] >>> 24 - 8 * (j % 4) & 
                    255;
                    f.push((k >>> 4).toString(16));
                    f.push((k & 15).toString(16))
                }
                return f.join("")
            },fromHexToWords: function(a) {
                return c.map(g(a), b.fromHex)
            },calculateSigBytesForWords: function(a) {
                return c.sum(c.map(a, function(a) {
                    return c.filter(b.fromWordToBytesArray(a), c.identity).length
                }))
            }}
    });
    m("data-rewrite", function(b, e) {
        var c = e("util"), a = e("expression"), g = c.rewriter({country: "user_attr_kx_geo_country",sub_section: "subsection",segment: "user_segments"}), i = c.rewriter({"=": "is","!=": "isnt",before: "<",after: ">"}), d = 
        b.expression = function(b) {
            var d = i(b.operator), k = g(b.name), h = b.delimiter;
            c.isArray(b.value) ? b = "[" + b.value.join(",") + "]" : (b = b.value, b = String(b), b = b.match(/,/) ? "[" + b.split(", ").join(",") + "]" : b);
            var e = function(a, b, d) {
                return c.map(a, function(a) {
                    return [b, "$" + d, a]
                })
            }, r = c.isArray(a.get(k, h)), l = a.parse(b);
            if (c.isArray(l)) {
                if ("is" === d && (d = r ? "intersects" : "memberOf"), "isnt" === d && (d = r ? "notIntersects" : "notMemberOf"), "url" === k && !r) {
                    if ("contains" === d)
                        return ["or"].concat(e(l, d, k));
                    if ("notContains" === d)
                        return ["and"].concat(e(l, 
                        d, k))
                }
            } else
                r && ("is" === d && (d = "contains"), "isnt" === d && (d = "notContains"));
            return [d, "$" + k + (h ? ":" + h : ""), b]
        };
        b.tag = function(a) {
            a = c.extend({}, a, {criteria: ["and"].concat(c.map(a.criteria, d))});
            a.freq_cap && a.criteria.push(["<", "$tag_deliveries_today", a.freq_cap]);
            a.user_percent && a.criteria.push(["<", ["random"], a.user_percent / 100]);
            delete a.rules;
            /^\s*\/\/@eval\b/.test(a.content) && (a.method = "eval");
            a.name = a.name || "Anonymous";
            a.timing = a.timing || "onload";
            return a
        };
        a.setDelimiter("user_segments", ",");
        b.contextTermExpression = 
        function(a) {
            if ("is" === i(a.operator))
                var b = a.occurrences.min || 1, a = ["or"].concat(c.map(a.values.split(","), function(a) {
                    return [">=", "$context_term_" + a, b]
                }));
            else
                a = ["and"].concat(c.map(a.values.split(","), function(a) {
                    return ["is", "$context_term_" + a, 0]
                }));
            return ["and", "$context_terms_processed", a]
        }
    });
    m("data", function(b, e, c) {
        var a = e("util"), g = b.root = {}, i = b.defs = {};
        a.get = b.get = function(a) {
            return g[a.match(/_/) ? a : "_" + a]
        };
        a.set = b.set = function(b, c) {
            if (!a.isString(b))
                return a.each(b, a.set);
            b = b.match(/_/) ? b : 
            "_" + b;
            g[b] = c;
            a.fire("data:change", {key: b,value: c});
            return c
        };
        a.removeData = b.remove = function(a) {
            delete g[a]
        };
        b.raw = function() {
            return g
        };
        var d = b.define = function(b, c) {
            if (!a.isString(b))
                return a.each(b, d);
            i[b] = c
        }, f = b.defaults = function(b, c) {
            if (!a.isString(b))
                return a.each(b, f);
            var d = a.get(b);
            return null == d ? a.set(b, c) : d
        }, j = b.namespace = function(b, c) {
            var d = b + "_", f, j = RegExp(d + "(.+)"), e = a.attributes({get: function(b) {
                    return a.get(d + b)
                },set: function(b, c) {
                    return a.set(d + b, c)
                },all: function() {
                    var b = {};
                    a.eachHash(g, 
                    function(a, c) {
                        if (null != (f = a.match(j)))
                            b[f[1]] = c
                    });
                    return b
                },values: c}), i;
            e.change = function(b) {
                i || (i = [], a.on("data:change", function(b) {
                    null != (f = b.key.match(j)) && a.each(i, function(a) {
                        a(b)
                    })
                }));
                i.push(b)
            };
            return e
        };
        b.user_attr = j("user_attr");
        b.page_attr = j("page_attr");
        e("routes").simple("set", a.set);
        e("routes").simple("get", a.get);
        e("routes").regexp(/data:(.+)/, function(a, b) {
            return j(a[1], b)
        });
        e = c.navigator;
        if (e = e.language || e.browserLanguage || e.userLanguage || e.systemLanguage)
            e = e.replace("_", "-"), e = e.toLowerCase();
        b.user_attr("kx_lang", e);
        b.user_attr("kx_tech_browser_language", e)
    });
    m("dataprovider", function(b, e) {
        var c = e("http"), a = e("util"), g = b.userMatch = function(b, f, j) {
            c.pixel({url: a.get("url_um"),data: {partner: b,r: f,_kdpid: j}})
        }, i = b.exelate = function() {
            g("exelate", "//loadm.exelator.com/load/", "e4942ff0-4070-4896-a7ef-e6a5a30ce9f9")
        };
        e("routes").simple("dataprovider.exelate", i)
    });
    m("dom-iframe", function(b, e, c) {
        var a = e("util"), g = function(b) {
            this.options = a.extend({}, i, b || {});
            this.node = e("dom").createElement("iframe", 
            this.options.attr);
            this.insert();
            if (!this.options.attr.src || this.options.html)
                this.html(this.options.html || "")
        }, i = {target: null,targetAction: "append",html: "",attr: {}};
        g.prototype = {insert: function() {
                var a = this.options, b = a.targetAction, a = a.target || c.document.body;
                e("dom").insert(b, a, this.node);
                this.win = g.window(this.node);
                this.doc = g.document(this.node)
            },html: function(a) {
                var b = this.doc;
                a.match(/^<html>/) || (a = "<html><head></head><body>" + a + "</body></html>");
                b.open();
                b.write(a);
                b.close()
            }};
        g.window = function(a) {
            return a.contentWindow
        };
        g.document = function(a) {
            return g.window(a).document
        };
        b.IFrame = g
    });
    m("dom", function(b, e, c) {
        function a(b, c, h) {
            var j = b.tagName, f = b.attributes || {}, b = b.children || [], c = c || [], h = h || 0, e = k[j];
            c("<", j);
            d.each(f, function(a, b) {
                c(" ", a, '="', b, '" ')
            });
            if (e)
                return c("/>");
            c(">");
            d.isString(b) ? c(b) : d.each(b, function(b) {
                a(b, c, h + 1)
            });
            e || c("</", j, ">")
        }
        function g(b, c, h) {
            b = d.isString(b) ? {tagName: b,attributes: c,children: h} : b;
            c = new r;
            a(b, c);
            return c.data()
        }
        function i() {
            try {
                j.documentElement.doScroll("left")
            } catch (a) {
                f(i, 
                1);
                return
            }
            d.fireOnce("dom:ready")
        }
        var d = e("util"), f = c.setTimeout;
        d.extend(b, e("dom-iframe"));
        var j = c.document, k = new d.Set("area base basefont br col frame hr img input isindex link meta param embed".split(" ")), h = b.attr = function(a, b, c) {
            var d;
            if (void 0 === c)
                try {
                    return a.getAttribute(b) || null != (d = a.attributes[b]) && d.value || ""
                } catch (h) {
                    return ""
                }
            else {
                try {
                    a.setAttribute(b, c)
                } catch (j) {
                    throw Error("Failed to set: " + b);
                }
                return a
            }
        };
        b.removeAttr = function(a, b) {
            try {
                a.removeAttribute(b)
            } catch (c) {
                throw Error("Failed to remove: " + 
                b);
            }
        };
        var p = b.text = function(a) {
            return a.innerText || a.textContent
        };
        b.value = function(a) {
            var b = a.nodeName;
            return "INPUT" === b ? h(a, "value") : "TEXTAREA" === b && p(a)
        };
        var r = b.StringStream = function() {
            function a() {
                b.push.apply(b, arguments);
                return a
            }
            var b = [];
            a.data = function() {
                return b.join("")
            };
            return a
        }, l = b.createElement = function() {
            var a = g.apply(null, arguments), b = j.createElement("div");
            b.innerHTML = a;
            return b.childNodes[0]
        };
        b.create = l;
        b.byId = function(a) {
            return a && a.nodeType ? a : j.getElementById(a)
        };
        var n = b.head = 
        function(a) {
            a = a || j;
            return a.head || a.getElementsByTagName("head")[0]
        };
        b.document = function(a) {
            return a.document || a.ownerDocument || a
        };
        b.window = function(a) {
            a = b.document(a);
            return a.parentWindow || a.defaultView
        };
        var u = b.remove = function(a) {
            a.parentNode.removeChild(a)
        };
        b.isNode = function(a) {
            return !!a.nodeType
        };
        var o = b.before = function(a, b) {
            a.parentNode.insertBefore(b, a)
        }, q = b.append = function(a, b) {
            a.appendChild(b)
        };
        b.after = function(a, b) {
            var c = a.nextSibling;
            c ? o(c, b) : q(a.parentNode, b)
        };
        b.prepend = function(a, b) {
            var c = 
            a.firstChild;
            c ? o(c, b) : q(a, b)
        };
        b.insert = function(a, c, d) {
            if (3 === arguments.length)
                b[a](c, d);
            else {
                var d = a, h = j.getElementsByTagName("script")[0];
                h.parentNode.insertBefore(d, h)
            }
        };
        b.replace = function(a, b) {
            o(a, b);
            u(a)
        };
        b.scriptEval = function(a) {
            var b = j.createElement("script");
            b.text = a;
            n(j).appendChild(b)
        };
        b.winEval = function(a, b) {
            a.kxeval || (a.execScript ? a.execScript("(function(){\n  var win = this;\n  win.kxeval = win.execScript ? \n    function(expr){return win.execScript(expr);} :\n    function(expr){return win.eval(expr);};\n})();") : 
            a.eval("(function(){\n  var win = this;\n  win.kxeval = win.execScript ? \n    function(expr){return win.execScript(expr);} :\n    function(expr){return win.eval(expr);};\n})();"));
            return a.kxeval(b)
        };
        b.childElements = function(a) {
            var b = [];
            d.each(a.childNodes, function(a) {
                1 === a.nodeType && b.push(a)
            });
            return b
        };
        b.onload = function(a, b) {
            d.isFunction(b) && (b = {done: b});
            var c = d.once(b.done || d.doNothing), h = d.once(b.fail || d.doNothing), j = a.attachEvent ? "attachEvent" : "addEventListener", f = a.attachEvent ? "on" : "";
            d.each({load: c,
                error: h,readystatechange: function() {
                    a.readyState && a.readyState.match(/complete|loaded/) && c()
                }}, function(b, c) {
                a[j](f + b, c, !0)
            })
        };
        var v = 1, s = b.hash = function(a) {
            return a._krux_hash || (a._krux_hash = v++)
        }, t = {};
        b.meta = function(a) {
            var b = s(a);
            return t[b] || (t[b] = {node: a,hash: b})
        };
        l = c.navigator;
        b.ie = !!l.userAgent.match(/MSIE /);
        var w = b.ff = !!l.userAgent.match(/Firefox/);
        b.ua = l.userAgent.toLowerCase();
        var y = b.ua.match(/(webkit)[ \/]([\w.]+)/) || b.ua.match(/(opera)(?:.*version)?[ \/]([\w.]+)/) || b.ua.match(/(msie) ([\w.]+)/) || 
        0 > b.ua.indexOf("compatible") && b.ua.match(/(mozilla)(?:.*? rv:([\w.]+))?/) || ["unknown", "unknown", 0];
        b.browser = y[1];
        b.version = parseFloat((y[2] || "0").match(/^[0-9]+[.0-9]*/)[0], 10);
        b.msie = "msie" === y[1];
        b.mozilla = "mozilla" === y[1];
        b.webkit = "webkit" === y[1];
        b.opera = "opera" === y[1];
        b.gecko = -1 !== b.ua.indexOf("gecko/");
        b.chrome = !!c.chrome;
        b.ie6 = b.msie && "6" === b.version;
        b.ie7 = b.msie && "7" === b.version;
        b.ie8 = b.msie && "8" === b.version;
        b.ie9 = b.msie && "9" === b.version;
        b.browserBucket = b.msie ? "IE." + b.version : w ? "Firefox." + 
        (4 > b.version ? "3x" : "4plus") : b.opera ? "Opera" : b.chrome ? "Chrome" : b.webkit ? "Webkit" : "Other";
        b.lang = (l.language || l.systemLanguage || l.browserLanguage || l.userLanguage || "").substring(0, 2);
        e("events");
        var x = !!c.window.attachEvent, C = b._on_ = x ? "attachEvent" : "addEventListener", l = b.type = {ready: {target: c.document},load: {target: c},unload: {target: c},beforeunload: {target: c}}, B = b.on = function(a, b, c, d) {
            b = (x ? "on" : "") + b;
            a[C](b, c, d || !1)
        };
        b.d2on = c.addEventListener ? function(a, b, c) {
            a.addEventListener(b, c, !1);
            return {remove: function() {
                    a.removeEventListener(b, 
                    c)
                }}
        } : function(a, b, c) {
            a.attachEvent(b, c);
            return {remove: function() {
                    a.detachEvent(b, c)
                }}
        };
        d.each(l, function(a, c) {
            c.nativeName = "ready" !== a ? a : x ? "readystatechanged" : "DOMContentLoaded";
            b[a] = function(b) {
                d.onOnce("dom:" + a, b)
            }
        });
        var A = function(a) {
            return "load" !== a ? function() {
                d.fireOnce("dom:" + a)
            } : function() {
                d.fireOnce("dom:ready");
                d.fireOnce("dom:load")
            }
        };
        b.createHead = function(a, c) {
            var h = e("sizzle"), j = d.first(h.find('div[data-id="' + a + '"]'));
            if (j)
                return j;
            b.kxhead = j = b.create("div", {"class": "kxhead","data-id": a,
                style: "display:none;"});
            c ? b.before(c, j) : b.insert(j);
            var f = b.insert;
            b.insert = function(a) {
                1 === arguments.length ? b.append(j, a) : f.apply(b, arguments)
            };
            return j
        };
        b.kruxDomain = function(a) {
            var b = 2, a = a.match(/^([^:]+)/)[1];
            if (!a.match(/(?:\d{1,3}\.){3}\d{1,3}/))
                return a = a.split(".").reverse(), a[1] && a[1].match(/com?/) && (b = 3), a.slice(0, Math.min(b, a.length)).reverse().join(".")
        };
        b.safeMode = function() {
            return -1 < c.location.href.indexOf("krux_safe") || b.ie && 6 >= b.version || b.gecko && 4 > b.version || !c.document.readyState
        };
        if (/^(complete|loaded)$/.test(c.document.readyState))
            A("load")();
        else {
            if (b.ie) {
                B(c, l.load.nativeName, A("ready"));
                w = !1;
                try {
                    w = null == c.window.frameElement
                } catch (E) {
                }
                j.documentElement.doScroll && w && i()
            }
            d.each(l, function(a, b) {
                B(b.target, b.nativeName, A(a), !1)
            })
        }
        f(d.bind(d.fireOnce, null, "dom:load", {timedout: !0}), 6E3)
    });
    m("events", function(b, e) {
        var c = e("util"), a = e("class").Class, a = b.Events = a.extend(function() {
            this._handlers = {ALL: []};
            this._happened = {};
            this._super(arguments)
        }, {on: function(a, b) {
                if (c.isString(a))
                    (this._handlers[a] || 
                    (this._handlers[a] = [])).push(b);
                else if (c.isFunction(a))
                    this._handlers.ALL.push(a);
                else
                    this.on(function(c) {
                        a.test(c.type) && b(c)
                    })
            },off: function(a, b) {
                this._handlers[a] = b ? c.remove(this._handlers[a], b) : []
            },fire: function(a, b) {
                b = b || {};
                b.type || (b.type = a);
                this._happened[a] = b;
                "data:change" !== b.type && c.log(b);
                var f = function(a) {
                    a(b)
                };
                c.each(this._handlers[a], f);
                c.each(this._handlers.ALL, f);
                return b
            },onOnce: function(a, b) {
                var f;
                return (f = this._happened[a]) ? c.defer(b, f) : this.on(a, c.once(b))
            },fireOnce: function(a, 
            b) {
                return !this._happened[a] && this.fire(a, b)
            },onOnceAll: function(a, b) {
                var a = a.split(" "), b = c.once(b), f = c.bind(function() {
                    c.all(a, function(a) {
                        return this._happened[a]
                    }, this) && b()
                }, this);
                c.each(a, function(a) {
                    this.onOnce(a, f)
                }, this)
            },happened: function(a) {
                return this._happened[a]
            },clear: function(a) {
                this._happened = c.reduce(this._happened, function(b, c, j) {
                    a && 0 !== c.indexOf(a) && (b[c] = j);
                    return b
                }, {})
            }}), g = b.instance = new a;
        g._bind("on off fire onOnce fireOnce onOnceAll happened");
        c.each("on off fire onOnce fireOnce onOnceAll happened".split(" "), 
        function(a) {
            c[a] = g[a]
        })
    });
    m("expression", function(b, e) {
        var c = e("util"), a = c.isArray, g = c.isString, i = {}, d = {}, f, j = b.getDelimiter = function(a) {
            return c.get(a + "DELIM")
        }, k = b.setDelimiter = function(a, b) {
            j(a) !== b && c.set(a + "DELIM", b)
        }, h = b.get = function(a, b) {
            var d = c.get(a);
            b && k(a, b);
            b = j(a);
            return c.isArray(d) ? d : b ? d ? d.split(b) : [] : d
        }, p = b.parse = function(a) {
            var b;
            return !c.isString(a) ? a : (b = a.match(/^\$([^:]+)(?::(.*))?$/)) ? h(b[1], b[2]) : (b = a.match(/^\[\s*(.*)\s*\]$/)) ? c.map(b[1].split(/\s*,\s*/), p) : (b = a.match(/^"(.*)"$/)) ? 
            b[1] : a
        }, r = function(a) {
            var b;
            b = (b = f(a[0])) && (i[b] || d[b]);
            return b.apply(this, b.isMacro ? c.rest(a) : c.map(c.rest(a), f))
        };
        f = b.eval = function(b) {
            return a(b) ? r(b) : g(b) ? p(b) : b
        };
        c.extend(i, {is: function(a, b) {
                return c.isString(a) ? a.toLowerCase() === String(b).toLowerCase() : a === b
            },matches: function(a, b) {
                return RegExp(b).test(a)
            },startsWith: function(a, b) {
                return i.matches(a, "^" + c.escapeRegexp(b))
            },endsWith: function(a, b) {
                return i.matches(a, c.escapeRegexp(b) + "$")
            },contains: function(a, b) {
                var a = a || [], d = ("" + b).toLowerCase();
                return c.isArray(a) ? c.any(a, function(a) {
                    return ("" + a).toLowerCase() === d
                }) : 0 <= ("" + a).toLowerCase().indexOf(d)
            },memberOf: function(a, b) {
                return i.contains(b, a)
            },intersection: function(a, b) {
                return c.intersection(a, b)
            },intersects: function(a, b) {
                a = c.isArray(a) ? a : [a];
                b = c.isArray(b) ? b : [b];
                return c.any(a, function(a) {
                    return i.contains(b, a)
                })
            },random: function() {
                return Math.random()
            },now: function() {
                return new Date
            }});
        c.each(["<", ">", "<=", ">="], function(a) {
            i[a] = new Function("a", "b", "return a " + a + " b")
        });
        c.extend(i, 
        {isnt: c.negate(i.is),notMemberOf: c.negate(i.memberOf),notContains: c.negate(i.contains),notIntersects: c.negate(i.intersects)});
        c.extend(d, {and: function() {
                return c.every(arguments, f)
            },or: function() {
                return c.any(arguments, f)
            }});
        c.each(d, function(a, b) {
            b.isMacro = !0
        })
    });
    m("feature", function(b, e) {
        var c = e("browser-sniff");
        return {hasThirdPartyCookies: function() {
                return c.is !== c.Browsers.SAFARI
            }}
    });
    m("fingerprint-scraper", function(b, e) {
        var c = e("util"), a = b.all = function(a, b) {
            var b = b || c.yes, d = [], h = c.deref(a), e;
            for (e in h) {
                var r = h[e];
                b(r, e, h) && null != r && d.push(r)
            }
            return d
        };
        b.path = c.deref;
        var g = function(a) {
            return function(b, d) {
                return a(b, function(a, b) {
                    return c.contains(d, b)
                })
            }
        };
        b.keys = g(a);
        var i = b.pluckAll = function(a, b) {
            var b = b || c.yes, d = c.deref(a);
            return c.reduce(d.length ? d : c.values(d), function(a, c) {
                var d, e;
                for (e in c)
                    c.hasOwnProperty(e) && b(d = c[e], e, c) && a.push(d);
                return a
            }, [])
        }, d = b.pluckKeys = g(i);
        b.pluckKeysWhere = function(a, b, e) {
            return c.filter(d(a, b), e)
        };
        b.primitives = c.partial(a, c._, c.isPrimitive);
        b.serializable = 
        c.partial(a, c._, c.isSerializable)
    });
    m("fingerprint", function(b, e, c) {
        var a = e("util");
        e("data");
        e("dom");
        var g = e("fingerprint-scraper"), i = e("sha1"), e = a.partial(g.keys, "navigator"), d = a.partial(g.keys, "screen"), f = function(a) {
            return a[0] * a[1]
        }, j = a.compose(d, f), k = a.partial(a.deref, c);
        b.canvas = function() {
            var a = document.createElement("canvas"), b = a.getContext("2d");
            b.textBaseline = "top";
            b.font = "14px 'Arial'";
            b.textBaseline = "alphabetic";
            b.fillStyle = "#f60";
            b.fillRect(125, 1, 62, 20);
            b.fillStyle = "#069";
            b.fillText("F1ng3r Print", 
            2, 15);
            b.fillStyle = "rgba(102, 204, 0, 0.7)";
            b.fillText("F1ng3r Print", 4, 17);
            return [a.toDataURL()]
        };
        b.winSize = function() {
            return a.map([["innerHeight", "innerWidth"], ["outerHeight", "outerWidth"]], function(b) {
                return f(a.map(b, k))
            })
        };
        b.mimeTypes = a.partial(g.pluckKeysWhere, "navigator.mimeTypes", ["type", "description", "suffixes"], function(b) {
            return "" !== b && a.isString(b) || a.isNumber(b) && !a.isNaN(b)
        });
        b.navigatorPrimitives = a.partial(e, "onLine product appCodeName platform appVersion appName vendorSub vendor productSub cookieEnabled language".split(" "));
        b.plugins = a.partial(g.pluckKeys, "navigator.plugins", ["name", "filename", "description"]);
        b.screenDepth = a.partial(d, ["pixelDepth", "colorDepth"]);
        b.screenResolution = a.partial(j, ["availWidth", "availHeight"]);
        b.screenSize = a.partial(j, ["width", "height"]);
        b.timezone = function() {
            return [(new Date).getTimezoneOffset()]
        };
        b.ua = function() {
            var a = g.path("navigator.userAgent");
            return [String(a).replace(/([a-z0-9]){8}\-(\1{4})\-\2\-\2\-\1{12}/i, "")]
        };
        var h = function() {
            return a.reduce(b, function(a, b, c) {
                var d;
                try {
                    d = c(), 
                    a.push.apply(a, d)
                } catch (h) {
                }
                return a
            }, [])
        };
        return a.extend(function(b) {
            var c = b.get("fp"), b = b.get("fp_id"), d = i(h().sort().join(""));
            d !== c ? (a.set("fp", d), a.set("fp_id", b), a.set("fp_sent", !0)) : a.set("fp_sent", !1);
            return d
        }, b, {raw: h})
    });
    m("geo", function(b, e) {
        var c = e("util");
        e("json");
        var a = e("config"), g = e("privacy"), i = e("store");
        e("data");
        e("events");
        var d = function(a) {
            c.forEach(a, function(b, c) {
                var d = String(b).toLowerCase();
                d !== b && (delete a[b], a[d] = c)
            });
            return a
        }, f = function(a) {
            i.impl && i.set("geo", c.paramString(a), 
            30 * i.MINUTES)
        };
        return b = c.extend(function() {
            var d = a();
            if (c.isConfigValueTrue(d.get("params.no_pii")) || g.isOptOut())
                return c.forEach(b, function(a, d) {
                    c.isFunction(d) && (b[a] = c.doNothing)
                }), d.set("geo", {}), b;
            var k = d.get("geo");
            c.isString(k) && d.set("geo", k = e("json").JSON.parse(k));
            c.isEmpty(k) ? (c.on("user_data_response", function(a) {
                a = (a || {}).geo || {};
                f(a);
                b.receive(a)
            }), d = i.impl ? c.parseParams(i.get("geo")) : {}, c.isEmpty(d) || b.receive(d)) : (b.receive(k), f(k));
            return b
        }, {get: function(a) {
                var b = c.get("geo") || 
                {};
                return a ? b[String(a).toLowerCase()] : b
            },set: function(a, e) {
                1 === arguments.length ? c.set("geo", d(a)) : c.get("geo")[String(a).toLowerCase()] = e;
                return b
            },receive: function(a) {
                b.set(a);
                c.forEach(["country", "region", "city", "dma"], function(b) {
                    c.set("user_attr_kx_geo_" + b, a[b] || a[b.toUpperCase()])
                });
                c.fireOnce("geo:ready", b);
                return b
            }})
    });
    m("hash-set", function(b, e) {
        function c(b, c) {
            this._hash = function(c) {
                var e = a.isFunction(b) ? b(c) : c;
                return String(void 0 !== e ? e : String(c))
            };
            this._q = [];
            this.put.apply(this, a.tail(arguments));
            this._items = {}
        }
        var a = e("util");
        c.prototype._thunk = function() {
            var b = this._q, c = this._hash;
            a.forEach(b.splice(0, b.length), function(a) {
                this._items[c(a)] = a
            }, this);
            return this
        };
        c.prototype.put = function(a) {
            this._q.push.apply(this._q, arguments);
            return this
        };
        c.prototype.get = function(a) {
            this._thunk();
            return this._items[this._hash(a)]
        };
        c.prototype.has = function(a) {
            this._thunk();
            return this._hash(a) in this._items
        };
        c.prototype.remove = function(b) {
            this._thunk();
            a.forEach(arguments, function(a) {
                delete this._items[this._hash(a)]
            }, 
            this);
            return this
        };
        c.prototype.toArray = function() {
            this._thunk();
            return a.values(this._items)
        };
        c.prototype.toString = function() {
            this._thunk();
            return a.keys(this._items).join(",")
        };
        return a.extend(function(b, e) {
            var d = new c(b);
            d.put.apply(d, a.tail(arguments));
            return d
        }, {HashSet: c})
    });
    (function() {
        function b(b, f) {
            var b = b || "", f = f || {}, h;
            for (h in e)
                e.hasOwnProperty(h) && (f.autoFix && (f["fix_" + h] = !0), f.fix = f.fix || f["fix_" + h]);
            var p = {comment: /^<\!--/,endTag: /^<\//,atomicTag: /^<\s*(script|style|noscript|iframe|textarea)[\s\/>]/i,
                startTag: /^</,chars: /^[^<]/}, r = {comment: function() {
                    var a = b.indexOf("--\>");
                    if (0 <= a)
                        return {content: b.substr(4, a),length: a + 3}
                },endTag: function() {
                    var c = b.match(a);
                    if (c)
                        return {tagName: c[1],length: c[0].length}
                },atomicTag: function() {
                    var a = r.startTag();
                    if (a) {
                        var c = b.slice(a.length);
                        if (c.match(RegExp("</\\s*" + a.tagName + "\\s*>", "i")) && (c = c.match(RegExp("([\\s\\S]*?)</\\s*" + a.tagName + "\\s*>", "i"))))
                            return {tagName: a.tagName,attrs: a.attrs,content: c[1],length: c[0].length + a.length}
                    }
                },startTag: function() {
                    var a = 
                    b.match(c);
                    if (a) {
                        var d = {};
                        a[2].replace(g, function(a, b, c, e, h) {
                            a = c || e || h || i.test(b) && b || null;
                            d[b] = "string" === typeof a ? a.replace(/(&#\d{1,4};)/gm, function(a) {
                                a = a.substring(2, a.length - 1);
                                return String.fromCharCode(a)
                            }) : a
                        });
                        return {tagName: a[1],attrs: d,unary: !!a[3],length: a[0].length}
                    }
                },chars: function() {
                    var a = b.indexOf("<");
                    return {length: 0 <= a ? a : b.length}
                }}, l = function() {
                for (var a in p)
                    if (p[a].test(b)) {
                        d && console.log("suspected " + a);
                        var c = r[a]();
                        return c ? (d && console.log("parsed " + a, c), c.type = c.type || a, c.text = 
                        b.substr(0, c.length), b = b.slice(c.length), c) : null
                    }
            };
            if (f.fix) {
                var n = /^(AREA|BASE|BASEFONT|BR|COL|FRAME|HR|IMG|INPUT|ISINDEX|LINK|META|PARAM|EMBED)$/i, u = /^(COLGROUP|DD|DT|LI|OPTIONS|P|TD|TFOOT|TH|THEAD|TR)$/i, o = [];
                o.last = function() {
                    return this[this.length - 1]
                };
                o.lastTagNameEq = function(a) {
                    var b = this.last();
                    return b && b.tagName && b.tagName.toUpperCase() === a.toUpperCase()
                };
                o.containsTagName = function(a) {
                    for (var b = 0, c; c = this[b]; b++)
                        if (c.tagName === a)
                            return !0;
                    return !1
                };
                var q = function(a) {
                    a && "startTag" === a.type && 
                    (a.unary = n.test(a.tagName) || a.unary);
                    return a
                }, v = l, s = function() {
                    b = "</" + o.pop().tagName + ">" + b
                }, t = {startTag: function(a) {
                        var c = a.tagName;
                        "TR" === c.toUpperCase() && o.lastTagNameEq("TABLE") ? (b = "<TBODY>" + b, w()) : f.fix_selfClose && u.test(c) && o.containsTagName(c) ? o.lastTagNameEq(c) ? s() : (b = "</" + a.tagName + ">" + b, w()) : a.unary || o.push(a)
                    },endTag: function(a) {
                        o.last() ? f.fix_tagSoup && !o.lastTagNameEq(a.tagName) ? s() : o.pop() : f.fix_tagSoup && (v(), w())
                    }}, w = function() {
                    var a = b, c = q(v());
                    b = a;
                    if (c && t[c.type])
                        t[c.type](c)
                }, l = function() {
                    w();
                    return q(v())
                }
            }
            return {append: function(a) {
                    b += a
                },readToken: l,readTokens: function(a) {
                    for (var b; (b = l()) && !(a[b.type] && !1 === a[b.type](b)); )
                        ;
                },clear: function() {
                    var a = b;
                    b = "";
                    return a
                },rest: function() {
                    return b
                },stack: []}
        }
        var e = function() {
            var a = {}, b = this.document.createElement("div");
            b.innerHTML = "<P><I></P></I>";
            a.tagSoup = "<P><I></P></I>" !== b.innerHTML;
            b.innerHTML = "<P><i><P></P></i></P>";
            a.selfClose = 2 === b.childNodes.length;
            return a
        }(), c = /^<([\-A-Za-z0-9_]+)((?:\s+[\w\-]+(?:\s*=?\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/, 
        a = /^<\/([\-A-Za-z0-9_]+)[^>]*>/, g = /([\-A-Za-z0-9_]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g, i = /^(checked|compact|declare|defer|disabled|ismap|multiple|nohref|noresize|noshade|nowrap|readonly|selected)$/i, d = !1;
        b.supports = e;
        b.tokenToString = function(a) {
            var b = {comment: function(a) {
                    return "<--" + a.content + "--\>"
                },endTag: function(a) {
                    return "</" + a.tagName + ">"
                },atomicTag: function(a) {
                    console.log(a);
                    return b.startTag(a) + a.content + b.endTag(a)
                },startTag: function(a) {
                    var b = "<" + a.tagName, 
                    c;
                    for (c in a.attrs)
                        var d = a.attrs[c], b = b + (" " + c + '="' + (d ? d.replace(/(^|[^\\])"/g, '$1\\"') : "") + '"');
                    return b + (a.unary ? "/>" : ">")
                },chars: function(a) {
                    return a.text
                }};
            return b[a.type](a)
        };
        b.escapeAttributes = function(a) {
            var b = {}, c;
            for (c in a) {
                var d = a[c];
                b[c] = d && d.replace(/(^|[^\\])"/g, '$1\\"')
            }
            return b
        };
        for (var f in e)
            b.browserHasFlaw = b.browserHasFlaw || !e[f] && f;
        this.htmlParser = b
    })();
    m("http-jsonp", function(b, e, c) {
        var a = e("class").Class, g = e("util"), i = e("ns"), d = c.document, f = i.self.inFlightKeys = i.self.inFlightKeys || 
        {}, j = b.Request = a.extend(function(a) {
            a.data = a.data || {};
            this.options = a;
            if (!a.callback)
                throw "Callback name is required";
            g.extend(this, a);
            this.self && (this.done = g.bind(this.done, this.self), this.fail = g.bind(this.fail, this.self));
            this.plantReceiver();
            this.src = e("http").src(this);
            this._class.all.push(this)
        }, {fail: function(a) {
                g.fire("error", {message: "jsonp failed with status " + (a && a.status || "unknown") + " src: " + this.src})
            },done: function() {
            },receive: function(a) {
                this.time.end = new Date;
                return a.status ? 200 == a.status ? 
                this.done(a.body) : this.fail(a) : this.done(a)
            },plantReceiver: function() {
                var a = this.options.callback;
                this.data.callback = i.path + "." + a;
                f[a] = f[a] || 0;
                f[a]++;
                i.self[a] = g.bind(function() {
                    f[a]--;
                    0 === f[a] && delete i.self[a];
                    this.receive.apply(this, arguments)
                }, this)
            },sendInline: function() {
                d.write('<script src="' + this.src + '" type="text/javascript"><\/script>')
            },send: function() {
                this.time = {start: new Date};
                if (this.inline)
                    return this.sendInline();
                var a = d.createElement("script");
                a.type = "text/javascript";
                a.src = this.src;
                var b = d.getElementsByTagName("script")[0];
                b.parentNode.insertBefore(a, b);
                return this
            },__all: []});
        b.call = function(a) {
            return (new j(a)).send()
        }
    });
    m("http", function(b, e, c) {
        var a = e("util"), g = e("json").JSON, i = b.protocol = "https:" === c.location.protocol ? "https:" : "http:", d = e("dom");
        b.maxUrlLength = d.msie ? 2048 : 8E4;
        var f = b.param = function(b, c) {
            var d = a.isString(c) || a.isNumber(c) ? c : g.stringify(c);
            return encodeURIComponent(b) + "=" + encodeURIComponent(d)
        }, j = b.src = function(c) {
            c.url = c.url || "no_url";
            var d = c.url;
            d.match(/^\/\//) && 
            (d = i + d);
            var e = a.map(c.data, f);
            if (!c.noClip)
                for (; (d + "?" + e.join("&")).length > b.maxUrlLength; )
                    e.pop();
            return d + "?" + e.join("&")
        };
        b.willClip = function(c) {
            c = b.src(a.extend({noClip: !0}, c));
            return c.length > b.maxUrlLength && c.length - b.maxUrlLength
        };
        b.pixel = function(b) {
            try {
                (new c.Image).src = j(b), a.fire("http:pixel", b)
            } catch (d) {
            }
        };
        b.jsonp = function(a) {
            return e("http-jsonp").call(a)
        }
    });
    m("impression", function(b, e) {
        var c = e("util"), a = e("pixel");
        e("data");
        var g = b.send = function(b) {
            c.set("url_pixel", b.url);
            a.sendImpl(b)
        };
        b.init = function(a) {
            g(a)
        }
    });
    m("index", function(b, e) {
        e("init")
    });
    var D = window.postscribe;
    window.postscribe = null;
    m("init", function(b, e, c) {
        var a = c.Krux || ((c.Krux = function() {
            c.Krux.q.push(arguments)
        }).q = []);
        if (!a.commit || a.ns)
            a.commit = a.commit || 1, a.postscribe = c.postscribe, c.postscribe = D, c.Krux = function(b, i) {
                var d;
                i.params = i.params || {};
                d = i.params.control_tag_namespace;
                c.Krux = a;
                var eDebug = e("ns");
                
                eDebug.init(d, function() { return e("routes").call });
                
                (d = e("ns").init(d, function() {
                    return e("routes").call
                })) && e("marketer" === i.params.client_type ? "marketer" : "publisher")(d, i)
            }
    });
    m("jslog", 
    function(b, e, c) {
        function a(a) {
            f && c.console && c.console.log("Error:", a);
            g.happened("jslog.pixel") ? a.msg !== k[k.length - 1] && !(k.length > 10 * Math.random()) && (k.push(a.msg), a.type += "-postload", j.push(a), d.pixel(n()), j = []) : j.push(a)
        }
        var g = e("util"), i = e("dom"), d = e("http"), f = -1 < c.location.search.indexOf("kxdebug"), j = [], k = [], h = b.errorTypes = ["controltag", "tag", "test", "js"], p = c.onerror || function() {
            return !1
        };
        c.onerror = function(b, d, e) {
            try {
                if ("string" !== typeof b)
                    return p.apply(c, arguments);
                var f;
                var h = /https*:\/\/([^\/]+)\/([^?\/]+)/.exec(d);
                f = h && "apiservices.krxd.net" === h[1] ? "service:" + h[2] : h && -1 < h[1].indexOf("krxd.net") ? "controltag" : "";
                a({type: f || "js",url: d,line: e,msg: b});
                return p.apply(c, arguments)
            } catch (t) {
                c.console && c.console.log("Error in the error handler", t)
            }
            return p.apply(c, arguments)
        };
        var r = b.sortByPriority = function(a) {
            function b(a) {
                a = g.indexOf(h, a.type);
                return -1 !== a ? a : h.length
            }
            return g.clone(a).sort(function(a, c) {
                var d = b(a), e = b(c);
                return d < e ? -1 : d > e ? 1 : 0
            })
        };
        g.on("tag:fail", function(b) {
            a({type: "tag",tagid: b.id,msg: b.error})
        });
        g.on("test:fail", function(b) {
            a({type: "test",msg: b.code + ":" + b.data})
        });
        var l, n = b.getPixelOptions = function(a) {
            for (var a = a || {url: g.get("url_log"),data: {control_tag_version: c.Krux.version,commit: c.Krux.commit,pubid: g.get("pubid"),siteid: g.get("siteid"),site_name: g.get("site"),browser_bucket: i.browserBucket,version_bucket: l,lang: i.lang,log_version: 1.1,errors: r(j)}}, b = a.data.errors; d.willClip(a) && b.length; )
                b.pop();
            return a
        };
        g.on("test:all_done", function() {
            if (!(1 > j.length)) {
                var a = 0;
                l = g.get("config_param_control_tag_version");
                a = "alpha" === l ? 1 : 0.1;
                Math.random() > a || (d.pixel(n()), g.fire("jslog.pixel", {errors: j.length}), j = [])
            }
        })
    });
    m("json", function(b, e, c) {
        var a = e("util"), g, i, d, f, j = function(a) {
            return '"' + a.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") + '"'
        };
        f = function(b) {
            ++d;
            b = d <= g && a.isNull(b) ? "null" : a.isUndefined(b) ? "null" : a.isBoolean(b) ? !0 === b ? "true" : !1 === b ? "false" : "" + b : a.isString(b) ? j(b) : a.isNumber(b) ? "" + b : a.isArray(b) ? "[" + a.map(b, f).join(",") + "]" : a.isArguments(b) ? 
            "[" + a.map(b, f).join(",") + "]" : "{" + a.map(b, function(a, b) {
                return (i ? "\n" + Array(d + 1).join("  ") : "") + j("" + a) + ":" + f(b)
            }).join(",") + (i ? "\n" + Array(d + 1).join("  ") : "") + "}";
            --d;
            return b
        };
        b.myJSON = {stringify: function(a, b) {
                b = b || {};
                i = b.pretty || !1;
                g = b.maxdepth || 15;
                d = 0;
                return f(a)
            }};
        b.JSON = c.JSON || b.myJSON
    });
    m("kxinterchange", function(b, e, c) {
        var b = function(a) {
            var b, a = "kx" + a;
            return ((b = this.localStorage) ? b[a] || "" : (b = c.document.cookie) && (b = b.match("\\b" + a + "=([^;]*)")) && decodeURIComponent(b[1])) || ""
        }, a = e("util"), g = c.Krux, 
        i = g.user, d = g.segments, f = b("user"), j = b("segs");
        e("test").module("kxinterchange-support-snippet", function(b) {
            b.eq("Krux.user exported", i, f);
            b.eq("Krux.segments exported", d, j && j.split(",") || []);
            a.each(d, function(a) {
                b("Krux.dartKeyValues contains segment " + a, 0 <= g.dartKeyValues.indexOf("ksgmnt=" + a))
            });
            f && b("Krux.dartKeyValues contains user", 0 <= g.dartKeyValues.indexOf("u=" + f))
        })
    });
    m("marketer", function(b, e, c) {
        var a = e("util"), g = e("config"), i = e("dom");
        e("events");
        var d = e("fingerprint"), f = e("impression"), 
        j = e("privacy"), k = e("routes"), h = e("sizzle"), p = e("store"), r = e("tag"), l = e("timing"), n = /^https?:\/\/([a-z0-9_\-\.]+\.)?krxd\.net(:\d{1,5})?(\/|$)/i, u = b.getParams = function(b) {
            return a.urlParams(i.attr(b, "src"))
        }, o = b.next = function(b) {
            var c = a.find(h.find("script[src*=" + b + "]"), function(a) {
                return !i.attr(a, "data-kx-id") && n.test(a.src)
            });
            if (!c)
                throw Error("No node found for " + b);
            return c
        };
        return a.extend(function(b, h) {
            var s = new Date, t = g(h), w = t.get("confid");
            i.createHead(w);
            var n = w + "-" + s.getTime();
            l.start();
            r.claimOneTimers(t.get("tags"));
            a.set("tags", t.get("tags") || []);
            e("jslog");
            s = e("data");
            s.user_attr = s.namespace("user_attr");
            s.page_attr = s.namespace("page_attr");
            e("scrape");
            e("dataprovider");
            e("events");
            var x = o(w);
            i.attr(x, "data-kx-id", n);
            n = u(x);
            if ((x = t.get("services")) && x.impression)
                n.url = x.impression;
            else
                throw Error("impression service not specified");
            a.set("confid", w);
            a.set("pubid", a.get("pubid") || t.get("publisher.uuid"));
            t.get("params.no_pii") && (a.set("pixel_data__knopii", 1), s.user_attr("kx_lang", 
            null), s.user_attr("kx_tech_browser_language", null));
            e("test").init();
            e("test-visualtags").init();
            a.set("tags", t.get("tags"));
            a.set("config", t.toJSON());
            a.set("version_bucket", t.get("params.control_tag_version"));
            a.set("max_segments", t.get("params.max_segments"));
            a.set("prioritized_segments", t.get("prioritized_segments"));
            s.namespace("config_param", t.get("params"));
            w = !/localStorage/.test(a.get("config_param_client_side_storage"));
            e("store").init(w);
            j();
            e("geo")();
            if (i.safeMode())
                a.onOnce("dom:load", 
                a.bind(a.fireOnce, null, "report"));
            else {
                t.get("params.fingerprint") && !j.isOptOut() && d(p);
                w = a.map(a.get("tags"), e("data-rewrite").tag);
                a.set("tags", w);
                a.set("config_segments", t.get("realtime_segments"));
                a.onOnceAll("dom:load tag:all_done", function() {
                    a.fireOnce("report");
                    t.get("params.remove_kxhead") && setTimeout(function() {
                        i.remove(i.kxhead)
                    }, 250)
                });
                e("adm-events").check3rdParty();
                e("stats");
                e("social");
                k.api();
                if (t.has("context_terms"))
                    a.onOnce("dom:load", function() {
                        e("context-terms").process(t.get("context_terms"))
                    });
                n._kpid = a.get("pubid");
                f.init(n);
                c.setTimeout(r.init, 250)
            }
            l.end()
        }, b)
    });
    m("ns", function(b, e, c) {
        var a = e("util"), g = e("version"), i = c.Krux, d = b.NS_RE = /^ns:([\w\W]+)/, f = b.DEFAULT_NS = "_default", j = b.parseArgs = function(b) {
            var c = b[0];
            (c = c.match(d)) ? (c = c[1], b = a.rest(b)) : c = f;
            return {nsName: c,rest: b}
        }, k;
        if (!(k = i.nsRouter)) {
            var h = function() {
                var b = j(arguments), c = h.ns[b.nsName];
                if (!b.rest.length)
                    return c;
                if (c)
                    return c.apply(c, b.rest);
                h.q.push(arguments);
                return a.UNDEFINED
            };
            h.ns = {};
            h.q = [];
            h.defineNamespace = function(b, 
            c) {
                var d = b || f;
                if (h.ns[d])
                    return h.ns[d];
                var e = h.ns[d] = c(b);
                a.extend(e, {nsName: d,isDefault: d === f,path: "Krux.ns." + d});
                h.creator = h.creator || e;
                d = h.q.splice(0, h.q.length);
                a.each(d, function(a) {
                    h.apply(null, a)
                });
                return e
            };
            h.nsRouter = h;
            a.extend(h, i);
            k = c.Krux = h
        }
        b.router = k;
        b.init = function(d, f) {
            var h = b.self = b.router.defineNamespace(d, f);
            if (h) {
                b.name = h.nsName;
                b.isDefault = h.isDefault;
                b.path = h.path;
                var j = {version: g.version,commit: g.commit,require: e,define: m,_: a};
                a.extend(h, j);
                h.isDefault && a.extend(c.Krux, j)
            }
            return h
        }
    });
    m("pixel", function(b, e, c) {
        var a = e("util"), g = e("http"), i = e("dom"), d = e("data"), f = e("store"), j = c.Krux, k = b.sendImpl = function(b) {
            var c = {};
            a.eachHash(b, function(a, b) {
                if (b = l(a, b))
                    c[a] = b
            });
            var b = a.get("config_param_control_tag_pixel_throttle"), d = 100 * Math.random();
            b && b < d || g.pixel({url: a.get("url_pixel"),data: c})
        }, h = b.stringifyValue = function(b) {
            return null != b && (a.isArray(b) ? a.map(b, h).join(n) : b.toString())
        }, p = b.formatters = [], r = b.addFormatter = function(a, b) {
            p.push({test: a,formatter: b})
        }, l = b.format = function(b, 
        c) {
            var d = a.find(p, function(c) {
                return a.isString(c.test) ? c.test === b : c.test.test(b)
            });
            return (d ? d.formatter : h)(c)
        };
        b.tuppleSeparator = ":";
        var n = b.arraySeparator = ",", u = b.send = function(b, c) {
            var d = o(b, c);
            k(d);
            a.fireOnce("pixel", {phase: b,data: d})
        }, o = b.gather = function(b, h) {
            var q = {source: "smarttag",fired: b,confid: a.get("confid"),_kpid: a.get("pubid"),_kcp_s: a.get("site"),_kcp_sc: a.get("section"),_kcp_ssc: a.get("subsection"),_kcp_d: a.get("domain"),_knifr: c.frames.length,_kpref_: c.document.referrer};
            !1 === h && (q.pageview = 
            String(h));
            1 !== a.get("pixel_data__knopii") && (q.geo_country = a.get("user_attr_kx_geo_country"), q.geo_region = a.get("user_attr_kx_geo_region"), q.geo_city = a.get("user_attr_kx_geo_city"), q.geo_dma = a.get("user_attr_kx_geo_dma"));
            a.size(a.get("config_segments")) && (q.rtsegs = e("segments").realtime());
            var l = function(b, c) {
                a.eachHash(c, function(a, c) {
                    q[b + a] = c
                })
            };
            l("_kua_", d.user_attr());
            l("_kpa_", d.page_attr());
            l("", d.namespace("pixel_data")());
            var k = c.performance, g = k && k.navigation, p = k && k.timing;
            g && (p && !(i.gecko && 
            9 > i.version)) && (k = function(a, b) {
                if (!b) {
                    b = a + "End";
                    a = a + "Start"
                }
                var c = p[a] && p[b] && p[b] - p[a];
                return c == null || c < 0 || c > 3E4 ? -1 : c
            }, a.extend(q, {t_navigation_type: g.type,t_dns: k("domainLookup"),t_tcp: k("connect"),t_http_request: k("request"),t_http_response: k("response"),t_content_ready: k("navigationStart", "domInteractive"),t_window_load: k("navigationStart", "loadEventStart"),t_redirect: k("redirect")}));
            var g = e("scrape"), k = a.happened("user_data_response"), n = e("ns"), n = n.isDefault ? j : j[n.name] || {};
            a.extend(q, {interchange_ran: n.hasOwnProperty("user"),
                store_user: n.user,store_segs: n.segments,dart_user: g.dart("u"),dart_segs: g.dart("ksgmnt") || g.dart("ksg"),userdata_was_requested: !!a.happened("user_data_request"),userdata_did_respond: !!k,store_user_after: f.get("user"),store_segs_after: f.get("segs")});
            k && a.extend(q, {userdata_user: [k.kuid, k.kuid_long],userdata_segs: k.segments});
            g = f.get("org_user_id");
            a.existy(g) && a.extend(q, {_kuid: g});
            a.each({user: "_kua_",page: "_kpa_"}, function(b, c) {
                a.each(d[b + "_attr"](), function(a, b) {
                    q[c + a] = b
                })
            });
            if (g = c.sessionStorage)
                try {
                    q.sview = 
                    g.krux_views = +(g.krux_views || 0) + 1
                } catch (o) {
                }
            g = a.get("tags");
            g = a.filter(g, function(a) {
                return a.time && a.time.end
            });
            a.each(g, function(a, b) {
                q["kplt" + b] = a.id;
                l("tag" + a.id + "_timing", {duration: a.time.duration})
            });
            r(/tag.*_timing/i, function() {
                return false
            });
            q.jsonp_requests = a.map(e("http-jsonp").Request.all, function(a) {
                return [a.url, a.time.end - a.time.start]
            });
            return q
        }, q = b.sendOnce = a.once(u);
        b.init = function() {
            a.onOnce("report", function() {
                var b = a.bind(q, null, "report");
                a.happened("user_data_fetch_scheduled") ? 
                (a.onOnce("user_data_response", function() {
                    a.defer(b)
                }), c.setTimeout(function() {
                    q("user_data_timeout")
                }, 300)) : b()
            });
            a.onOnce("dom:beforeunload", function() {
                q("dom:beforeunload")
            });
            a.onOnce("dom:unload", function() {
                q("dom:unload")
            });
            a.on("navigation", function(b) {
                b = {source: "smarttag",type: "navigation",_kpid: a.get("pubid"),_kcp_s: a.get("site"),_kcp_sc: b.section,_kcp_ssc: b.subsection};
                k(b)
            });
            e("test").module("pixel", function(b) {
                b("pixel", a.happened("pixel"))
            })
        }
    });
    (function() {
        function b() {
        }
        function e(a) {
            return a !== 
            j && null !== a
        }
        function c(a, b, c) {
            var d, e = a && a.length || 0;
            for (d = 0; d < e; d++)
                b.call(c, a[d], d)
        }
        function a(a, b, c) {
            for (var d in a)
                a.hasOwnProperty(d) && b.call(c, d, a[d])
        }
        function g(b, c) {
            a(c, function(a, c) {
                b[a] = c
            });
            return b
        }
        function i(a) {
            try {
                return k.call(a)
            } catch (b) {
                var d = [];
                c(a, function(a) {
                    d.push(a)
                });
                return d
            }
        }
        var d = {afterAsync: b,afterDequeue: b,afterStreamStart: b,afterWrite: b,beforeEnqueue: b,beforeWrite: function(a) {
                return a
            },done: b,error: function(a) {
                throw a;
            },releaseAsync: !1}, f = this, j = void 0;
        if (!f.postscribe) {
            var k = 
            Array.prototype.slice, h = function(a, b, c) {
                var d = r + b;
                if (2 === arguments.length)
                    return d = a.getAttribute(d), !e(d) ? d : String(d);
                e(c) && "" !== c ? a.setAttribute(d, c) : a.removeAttribute(d)
            }, p = function(a, b) {
                var c = a.ownerDocument;
                g(this, {root: a,options: b,win: c.defaultView || c.parentWindow,doc: c,parser: htmlParser("", {autoFix: !0}),actuals: [a],proxyHistory: "",proxyRoot: c.createElement(a.nodeName),scriptStack: [],writeQueue: []});
                h(this.proxyRoot, "proxyof", 0)
            }, r = "data-ps-";
            p.prototype.write = function() {
                [].push.apply(this.writeQueue, 
                arguments);
                for (var a; !this.deferredRemote && this.writeQueue.length; )
                    a = this.writeQueue.shift(), "function" === typeof a ? this.callFunction(a) : this.writeImpl(a)
            };
            p.prototype.callFunction = function(a) {
                var b = {type: "function",value: a.name || a.toString()};
                this.onScriptStart(b);
                a.call(this.win, this.doc);
                this.onScriptDone(b)
            };
            p.prototype.writeImpl = function(a) {
                this.parser.append(a);
                for (var b, a = [], c, d; (b = this.parser.readToken()) && !(c = !b || !("tagName" in b) ? !1 : !!~b.tagName.toLowerCase().indexOf("script")) && !(d = !b || !("tagName" in 
                b) ? !1 : !!~b.tagName.toLowerCase().indexOf("style")); )
                    a.push(b);
                this.writeStaticTokens(a);
                c && this.handleScriptToken(b);
                d && this.handleStyleToken(b)
            };
            p.prototype.writeStaticTokens = function(a) {
                a = this.buildChunk(a);
                if (a.actual)
                    return a.html = this.proxyHistory + a.actual, this.proxyHistory += a.proxy, this.proxyRoot.innerHTML = a.html, this.walkChunk(), a
            };
            p.prototype.buildChunk = function(a) {
                var b = this.actuals.length, d = [], e = [], f = [];
                c(a, function(a) {
                    d.push(a.text);
                    if (a.attrs) {
                        if (!/^noscript$/i.test(a.tagName)) {
                            var c = 
                            b++;
                            e.push(a.text.replace(/(\/?>)/, " " + r + "id=" + c + " $1"));
                            "ps-script" !== a.attrs.id && "ps-style" !== a.attrs.id && f.push("atomicTag" === a.type ? "" : "<" + a.tagName + " " + r + "proxyof=" + c + (a.unary ? " />" : ">"))
                        }
                    } else
                        e.push(a.text), f.push("endTag" === a.type ? a.text : "")
                });
                return {tokens: a,raw: d.join(""),actual: e.join(""),proxy: f.join("")}
            };
            p.prototype.walkChunk = function() {
                for (var a, b = [this.proxyRoot]; e(a = b.shift()); ) {
                    var c = 1 === a.nodeType;
                    if (!c || !h(a, "proxyof"))
                        c && (this.actuals[h(a, "id")] = a, h(a, "id", null)), (c = a.parentNode && 
                        h(a.parentNode, "proxyof")) && this.actuals[c].appendChild(a);
                    b.unshift.apply(b, i(a.childNodes))
                }
            };
            p.prototype.handleScriptToken = function(a) {
                var b = this.parser.clear();
                b && this.writeQueue.unshift(b);
                a.src = a.attrs.src || a.attrs.SRC;
                if (a.src && this.scriptStack.length)
                    this.deferredRemote = a;
                else
                    this.onScriptStart(a);
                var c = this;
                this.writeScriptToken(a, function() {
                    c.onScriptDone(a)
                })
            };
            p.prototype.handleStyleToken = function(a) {
                var b = this.parser.clear();
                b && this.writeQueue.unshift(b);
                a.type = a.attrs.type || a.attrs.TYPE || 
                "text/css";
                this.writeStyleToken(a);
                b && this.write()
            };
            p.prototype.writeStyleToken = function(a) {
                var b = this.buildStyle(a);
                this.insertStyle(b);
                a.content && (b.styleSheet && !b.sheet ? b.styleSheet.cssText = a.content : b.appendChild(this.doc.createTextNode(a.content)))
            };
            p.prototype.buildStyle = function(b) {
                var c = this.doc.createElement(b.tagName);
                c.setAttribute("type", b.type);
                a(b.attrs, function(a, b) {
                    c.setAttribute(a, b)
                });
                return c
            };
            p.prototype.insertStyle = function(a) {
                this.writeImpl('<span id="ps-style"/>');
                var b = this.doc.getElementById("ps-style");
                b.parentNode.replaceChild(a, b)
            };
            p.prototype.onScriptStart = function(a) {
                a.outerWrites = this.writeQueue;
                this.writeQueue = [];
                this.scriptStack.unshift(a)
            };
            p.prototype.onScriptDone = function(a) {
                a !== this.scriptStack[0] ? this.options.error({message: "Bad script nesting or script finished twice"}) : (this.scriptStack.shift(), this.write.apply(this, a.outerWrites), !this.scriptStack.length && this.deferredRemote && (this.onScriptStart(this.deferredRemote), this.deferredRemote = null))
            };
            p.prototype.writeScriptToken = function(a, 
            b) {
                var c = this.buildScript(a), d = this.shouldRelease(c), e = this.options.afterAsync;
                a.src && (c.src = a.src, this.scriptLoadHandler(c, !d ? function() {
                    b();
                    e()
                } : e));
                try {
                    this.insertScript(c), (!a.src || d) && b()
                } catch (f) {
                    this.options.error(f), b()
                }
            };
            p.prototype.buildScript = function(b) {
                var c = this.doc.createElement(b.tagName);
                a(b.attrs, function(a, b) {
                    c.setAttribute(a, b)
                });
                b.content && (c.text = b.content);
                return c
            };
            p.prototype.insertScript = function(a) {
                this.writeImpl('<span id="ps-script"/>');
                var b = this.doc.getElementById("ps-script");
                b.parentNode.replaceChild(a, b)
            };
            p.prototype.scriptLoadHandler = function(a, b) {
                function c() {
                    a = a.onload = a.onreadystatechange = a.onerror = null
                }
                var d = this.options.error;
                g(a, {onload: function() {
                        c();
                        b()
                    },onreadystatechange: function() {
                        /^(loaded|complete)$/.test(a.readyState) && (c(), b())
                    },onerror: function() {
                        var e = {message: "remote script failed " + a.src};
                        c();
                        d(e);
                        b()
                    }})
            };
            p.prototype.shouldRelease = function(a) {
                return !/^script$/i.test(a.nodeName) || !(!this.options.releaseAsync || !a.src || !a.hasAttribute("async"))
            };
            var l, 
            n = function() {
                var a = v.shift(), b;
                a && (b = a[a.length - 1], b.afterDequeue(), a.stream = u.apply(null, a), b.afterStreamStart())
            }, u = function(a, c, d) {
                function e(a) {
                    a = d.beforeWrite(a);
                    s.write(a);
                    d.afterWrite(a)
                }
                s = new p(a, d);
                s.id = q++;
                s.name = d.name || s.id;
                o.streams[s.name] = s;
                var f = a.ownerDocument, h = {close: f.close,open: f.open,write: f.write,writeln: f.writeln};
                g(f, {close: b,open: b,write: function() {
                        return e(i(arguments).join(""))
                    },writeln: function() {
                        return e(i(arguments).join("") + "\n")
                    }});
                var j = s.win.onerror || b;
                s.win.onerror = 
                function(a, b, c) {
                    d.error({msg: a + " - " + b + ":" + c});
                    j.apply(s.win, arguments)
                };
                s.write(c, function() {
                    g(f, h);
                    s.win.onerror = j;
                    d.done();
                    s = null;
                    n()
                });
                return s
            }, o = function(c, h, q) {
                "function" === typeof q && (q = {done: q});
                var j = q, j = j || {};
                a(d, function(a, b) {
                    e(j[a]) || (j[a] = b)
                });
                var q = j, c = /^#/.test(c) ? f.document.getElementById(c.substr(1)) : c.jquery ? c[0] : c, l = [c, h, q];
                c.postscribe = {cancel: function() {
                        l.stream ? l.stream.abort() : l[1] = b
                    }};
                q.beforeEnqueue(l);
                v.push(l);
                s || n();
                return c.postscribe
            }, q = 0, v = [], s = null;
            l = g(o, {streams: {},
                queue: v,WriteStream: p});
            f.postscribe = l
        }
    })();
    m("privacy", function(b, e) {
        var c = e("util"), a = e("config");
        e("events");
        var g = e("http"), i = e("store");
        e("data");
        var d = {REQUEST: "optout_check_request",RESPONSE: "optout_check_response"};
        b.Events = c.clone(d);
        var f = !1, j = b.fetch = function(b) {
            c.fire(d.REQUEST);
            g.jsonp({callback: "kxjsonp_optOutCheck",done: b,url: a().get("services.optout")})
        }, k = b.optOut = function(b) {
            f = c.existy(b) ? b : !0;
            a().set("dnt", f);
            f && (i.clear(), c.set("user", "OPTOUT"));
            i.set("optout", f)
        };
        b.isOptOut = function() {
            return !(!f && 
            !a().get("dnt") && !(c.isFunction(i.get) && "true" === i.get("optout") || /^(?:yes|1)$/.test(c.G.navigator.doNotTrack)))
        };
        b.handler = function(a) {
            c.fire(d.RESPONSE, a);
            a.optout || /^(?:OPTOUT|DNT)$/i.test(a._kuid_ || "") ? k() : (!a || c.existy(a.optout) || c.existy(a._kuid_)) && k(!1)
        };
        return c.extend(function() {
            j(b.handler)
        }, b)
    });
    m("publisher", function(b, e, c) {
        var a = c.location, g = e("config"), i = c.document;
        e("dom");
        var d = e("feature"), f = e("fingerprint"), j = e("privacy"), k = e("store"), h = e("util"), p = e("timing");
        return function(b, 
        l) {
            p.start();
            var n = g(l), u = e("dom");
            e("jslog");
            var o = e("data");
            o.user_attr = o.namespace("user_attr");
            o.page_attr = o.namespace("page_attr");
            var q = e("routes");
            e("scrape");
            e("dataprovider");
            e("events");
            i.getElementById("kxinterchange") && e("kxinterchange");
            var v = n.get("confid");
            u.createHead(v);
            h.set("confid", v);
            h.set("pubid", h.get("pubid") || n.get("publisher.uuid"));
            h.set("domain", u.kruxDomain(a.host));
            h.set("site", h.get("site") || n.get("site.name") || h.get("domain"));
            h.set("siteid", h.get("siteid") || n.get("site.id"));
            n.get("params.no_pii") && (h.set("pixel_data__knopii", 1), o.user_attr("kx_lang", null), o.user_attr("kx_tech_browser_language", null));
            e("pixel").init();
            e("test").init();
            e("test-visualtags").init();
            h.set("tags", n.get("tags"));
            h.set("url", c.location.href);
            h.set("config", n.toJSON());
            h.set("version_bucket", n.get("params.control_tag_version"));
            h.set("max_segments", n.get("params.max_segments"));
            h.set("prioritized_segments", n.get("prioritized_segments"));
            o.namespace("url", n.get("services"));
            o.namespace("config_param", 
            n.get("params"));
            o = !/localStorage/.test(h.get("config_param_client_side_storage"));
            o = k.init(o);
            j();
            e("geo")();
            if (u.safeMode())
                c.console && c.console.log("Krux running in safe mode, no tags will be delivered"), h.onOnce("dom:load", h.bind(h.fireOnce, null, "report"));
            else {
                n.get("params.fingerprint") && !j.isOptOut() && f(k);
                var v = n.get("params.user_id_cookie"), s = k.cookie.get(v);
                h.existy(v) && s && !d.hasThirdPartyCookies() ? (o.set("org_user_id", s), h.set("user", s)) : o.remove("org_user_id");
                o = h.map(h.get("tags"), e("data-rewrite").tag);
                h.set("tags", o);
                h.set("config_segments", n.get("realtime_segments"));
                h.onOnceAll("dom:load tag:all_done", function() {
                    h.fireOnce("report");
                    n.get("params.remove_kxhead") && setTimeout(function() {
                        u.remove(u.kxhead)
                    }, 250)
                });
                e("adm-events").check3rdParty();
                e("stats");
                e("social");
                q.api();
                if (n.get("context_terms"))
                    h.onOnce("dom:load", function() {
                        e("context-terms").process(n.get("context_terms"))
                    });
                e("tag").init();
                n.get("params.recommend") && e("recommend")
            }
            p.end()
        }
    });
    m("routes", function(b, e, c) {
        var a = e("util"), 
        g = e("ns"), i = b.routes = [], d = b.q = c.Krux && c.Krux.q || [], f = b.getHandler = function(b) {
            return a.find(i, function(a) {
                return a[0].test(b)
            })
        }, j = b.call = function(b) {
            var c = arguments, h;
            if (g.NS_RE.test(b))
                return h = g.router(b), 1 < a.size(c) ? h.apply(h, a.tail(c)) : h;
            if (a.isFunction(b))
                return b.call(null, e);
            if (h = f(b))
                return h[1].apply(null, c);
            d.push(a.toArray(c));
            return a.UNDEFINED
        }, k = b.understands = function(a) {
            return !!f(a)
        }, h = b.replay = function() {
            var b = a.clone(d);
            d.length = 0;
            a.each(b, function(a) {
                j.apply(null, a)
            })
        }, p = b.add = 
        function(a, b) {
            i.push([a, b]);
            h()
        }, r = b.regexp = function(b, c) {
            p(b, function(d) {
                return c.apply(this, [d.match(b)].concat(a.rest(arguments)))
            })
        }, l = b.simple = function(b, c) {
            r(RegExp("^" + b + "$"), function() {
                return c.apply(null, a.rest(arguments))
            })
        };
        b.once = function(c, d) {
            var e = function() {
                i = b.routes = a.remove(i, e);
                return d.apply(this, arguments)
            };
            l(c, e)
        };
        b.namespace = function(b, c) {
            r(RegExp("^" + b + "\\.(.*)"), function(b) {
                c[b[1]].apply(c, a.rest(arguments))
            })
        };
        b.api = function() {
            r(/^fire:(.+)/, function(b, c) {
                return a.fire(b[1], 
                c)
            });
            r(/^on:(.+)/, function(b, c) {
                return a.on(b[1], c)
            });
            r(/^fireOnce:(.+)/, function(b, c) {
                return a.fireOnce(b[1], c)
            });
            r(/^onOnce:(.+)/, function(b, c) {
                return a.onOnce(b[1], c)
            });
            r(/^require:?(.*)/, function(a, b) {
                return a[1] ? e(a[1]) : b ? e(b) : e
            });
            l("define", m);
            l("JSON.stringify", e("json").JSON.stringify);
            l("log", a.log);
            l("page:load", function(b, d) {
                var f = e("pixel");
                try {
                    a.set("url", String(c.location)), j("tag:reload", function(a) {
                        b && b(a);
                        f.send("ajax", d && d.pageView)
                    })
                } catch (q) {
                    b(q)
                }
            })
        };
        l("understands", k)
    });
    m("scrape", 
    function(b, e, c) {
        var a = e("util"), g = e("data"), i = e("sizzle"), d = e("routes"), f = e("dom"), j = b.defaultExcludes = "sz dcopt ord tile pos uri click ksgmnt null undefined".split(" "), k = b._dart = function() {
            function d(a) {
                return i.find("script[src*=" + e + "]", a).concat(i.find("iframe[src*=" + e + "]", a))
            }
            var e = ".doubleclick.net", f = {}, h = [], h = h.concat(d(c.document)), q = i.find("iframe[src*=://" + c.location.hostname + "]").concat(i.find("iframe[src^=/]"));
            a.each(q, function(a) {
                try {
                    h = h.concat(d(a.contentWindow.document))
                } catch (b) {
                }
            });
            b.dartElements = h;
            a.each(h, function(b) {
                var c, b = (c = i.attr(b, "src").match(/[^;]*;(.*)/)) && c[1];
                c = a.parseKeyValues(b, ";");
                a.eachHash(c, function(b, c) {
                    var d = f[b];
                    d && d !== c ? (a.isArray(d) || (d = [d]), a.isArray(c) ? d = d.concat(c) : d.push(c), f[b] = a.uniq(d)) : f[b] = c
                })
            });
            if (h[0]) {
                var j, q = (j = i.attr(h[0], "src").match(/\.doubleclick\.net(\/[^;]*)/)) ? j[1] : "";
                g.page_attr({dfpsite: q.split("/")[2],dfpzone: q.split("/")[3]})
            }
            return f
        }, h, p = b.extensions = {}, e = b.extension = function(a, c) {
            p[a] = b[a] = c;
            d.simple("scrape." + a, c);
            return c
        };
        a.eachHash({dart: function(b) {
                if (!h || a.isEmpty(h))
                    h = k();
                var c = new a.Set(b && b._excludes || j);
                return null == b ? h : a.isString(b) ? h[b] : a.eachHash(b, function(b, d) {
                    var e = g.namespace(b);
                    a.isArray(d) ? a.each(d, function(a) {
                        h[a] && e(a, h[a])
                    }) : "*" === d ? a.eachHash(h, function(a, b) {
                        c[a] || e(a, b)
                    }) : a.set(b, h[d])
                })
            },dom: function(a) {
                var b = a.match(/^(.+):([^:]+)$/), a = i.find(b[1])[0], b = b[2];
                return a && b && ("text" === b ? f.text(a) : "value" === b ? f.value(a) : "@" === b.charAt(0) && f.attr(a, b.substr(1)))
            },link_rel: function(a) {
                return b.dom("link[rel=" + 
                a + "]:@href")
            },link_rev: function(a) {
                return b.dom("link[rev=" + a + "]:@href")
            },meta_name: function(a) {
                return b.dom("meta[name=" + a + "]:@content")
            },meta_property: function(a) {
                return b.dom("meta[property=" + a + "]:@content")
            },opengraph: function(a) {
                return b.meta_property("og:" + a)
            },url_path: function(a) {
                return b.location.pathname.split("/")[a]
            },url_param: function(a) {
                var c;
                return (c = b.location.href.match("\\b" + a + "(?:=|\\b)([^&]*)")) && (decodeURIComponent(c[1]) || !0)
            },url_hash: function(a) {
                return [""].concat(String(c.location.hash).replace(/^(?:#|\/){0,}/, 
                "").split("/"))[a]
            },url_host: function(a) {
                return b.location.hostname.split(".").reverse()[a - 1]
            },url_domain: function(c) {
                return a.last(b.location.hostname.split("."), c).join(".")
            },cookie: function(a) {
                var b;
                return (b = c.document.cookie) && (b = b.match("\\b" + a + "=([^;]*)")) && decodeURIComponent(b[1])
            },data: function(b) {
                return a.get(b)
            },javascript: function(b) {
                try {
                    return c.eval(b)
                } catch (d) {
                    a.fire("error", d)
                }
            },js_global: function(a) {
                try {
                    for (var b = c, d = a.split("."); b && d[0]; )
                        b = b[d.shift()];
                    return b
                } catch (e) {
                }
            }}, e);
        b.location = 
        c.location;
        var r = b.scrape = function(b) {
            var c = {};
            a.eachHash(b, function(d, e) {
                var f = a.findHash(e, function(a) {
                    return p[a] && a
                });
                if (!f)
                    return a.fire("error", {message: "No extension found",scrape: b});
                f = p[f](e[f]);
                c[d] = f
            });
            return c
        };
        d.simple("scrape", function(b) {
            b = r(b);
            a.set(b);
            return b
        })
    });
    m("segments", function(b, e) {
        var c = e("util"), a = e("config")(), g = e("data"), i = e("privacy"), d = e("store"), f = c.param("segs");
        f && c.set("user_segments", f.split(","));
        var j = b.allRealtime = c.pluck(c.get("config_segments"), "id"), k = e("expression").eval, 
        h = b.realtime = function() {
            if (i.isOptOut())
                return [];
            for (var a = [], b = c.get("config_segments") || [], e = 24 * d.HOURS, f = 0, h = b.length, j, g; f < h; ++f)
                j = b[f], g = "rt_" + j.id, k(j.test) && d.set(g, "1", e), d.get(g) && a.push(j.id);
            return a
        }, p = b.prioritizedSegments = function() {
            return c.get("prioritized_segments") || []
        }, r = b.maxSegments = function() {
            return c.get("max_segments") || 0
        }, l = b.compute = function() {
            if (i.isOptOut())
                c.set("user_segments", []), d.set("segs", "");
            else if (!f) {
                var a;
                a = (a = d.get("segs")) ? a.split(",") : [];
                a = c.difference(a, 
                j);
                c.set("user_segments", a);
                var b = h().concat(a);
                c.set("user_segments", b);
                d.set("segs", b.join(","));
                var e = p();
                a = r();
                0 < e.length && 0 < a && (e = c.filter(e, function(a) {
                    return c.contains(b, a)
                }), e = e.slice(0, a), c.set("user_segments", e), d.set("segs", e.join(",")))
            }
        }, n = b.handleUserDataResponse = function(a) {
            a.segments && d.set("segs", a.segments.join(","), 72 * d.HOURS);
            a.prvx_segments && (d.set("prvx_segs", a.prvx_segments.join(","), 72 * d.HOURS), c.set("user_prvx_segments", a.prvx_segments));
            a.shared_segments && (d.set("shared_segments", 
            a.shared_segments.join(","), 72 * d.HOURS), c.set("user_shared_segments", a.shared_segments));
            a.kuid && (d.set("user", a.kuid, 180 * d.DAYS), c.set("user", a.kuid));
            a.technographics && (d.set("tech", c.paramString(a.technographics), 30 * d.DAYS), u());
            a.fp_id && d.set("fp_id", a.fp_id);
            l();
            c.fire("user_data_response", a)
        }, u = b.readTechFromStore = function() {
            var a = d.get("tech");
            return a ? (1 !== c.get("pixel_data__knopii") && c.eachHash(c.parseKeyValues(a), function(a, b) {
                c.set("user_attr_kx_tech_" + a, b)
            }), !0) : !1
        }, o = {url: c.get("url_userData"),
            data: {pubid: c.get("pubid")},callback: "kxjsonp_userData",done: n};
        if (n = d.get("org_user_id"))
            o.data._kuid = n;
        a.get("params.fingerprint") && c.get("fp_sent") && c.extend(o.data, {fp_id: c.get("fp_id"),fp: c.get("fp")});
        u() || (o.data.technographics = 1);
        a = b.fetch = function() {
            c.fireOnce("user_data_request");
            e("http").jsonp(o)
        };
        c.get("segWait") || (c.set("segWait", 1, 5 * d.MINUTES), c.onOnce("dom:load", a), c.fire("user_data_fetch_scheduled"));
        d.get("segs");
        l();
        a = [];
        d.get("prvx_segs") && (a = d.get("prvx_segs").split(","));
        c.set("user_prvx_segments", 
        a);
        a = [];
        d.get("shared_segments") && (a = d.get("shared_segments").split(","));
        c.set("user_shared_segments", a);
        a = c.throttle(l, 100);
        g.user_attr.change(a);
        g.page_attr.change(a);
        g.namespace("event").change(l);
        e("test").module("segments", function(a) {
            c.happened("user_data_fetch_scheduled") && a("user_data_response", c.happened("user_data_response"))
        })
    });
    m("sha1", function(b, e) {
        var c = e("crypto-util"), a = e("class").Class, g = e("routes"), i = [], d = {20: 1518500249,40: 1859775393,60: 1894007588,80: 899497514}, f = a.extend(function(a) {
            this._message = 
            "";
            this.reset();
            this._append(a)
        }, {_minBufferSize: 0,finalize: function() {
                var a = this._data, b = 8 * c.calculateSigBytesForWords(a);
                a[b >>> 5] |= 128 << 24 - b % 32;
                a[(b + 64 >>> 9 << 4) + 14] = Math.floor(b / c.MAX_WORD);
                a[(b + 64 >>> 9 << 4) + 15] = b;
                this._process();
                return String(this)
            },toString: function() {
                return c.fromWordsToHex(this._hash)
            },clone: function() {
                var a = new f(this._message);
                a._hash = this._hash.slice(0);
                return a
            },reset: function() {
                this._hash = this._getInitial();
                this._data = [];
                return this
            },update: function(a) {
                this._append(a);
                return this
            },
            _append: function(a) {
                this._message += a;
                a = c.fromUtf8ToWords(a);
                this._data.push.apply(this._data, a);
                return this
            },_process: function() {
                var a = this._data, b = 16 * (a.length * c.BYTES_PER_WORD / 64), d;
                if (b) {
                    for (d = 0; d < b; d += 16)
                        this._processBlock(a, d);
                    d = a.splice(0, b)
                }
                return d
            },_processBlock: function(a, b) {
                for (var c = this._hash, e = c[0], f = c[1], g = c[2], n = c[3], u = c[4], o = 0; 80 > o; o++) {
                    if (16 > o)
                        i[o] = a[b + o] | 0;
                    else {
                        var q = i[o - 3] ^ i[o - 8] ^ i[o - 14] ^ i[o - 16];
                        i[o] = q << 1 | q >>> 31
                    }
                    q = (e << 5 | e >>> 27) + u + i[o];
                    q = 20 > o ? q + ((f & g | ~f & n) + d["20"]) : 40 > o ? q + ((f ^ g ^ 
                    n) + d["40"]) : 60 > o ? q + ((f & g | f & n | g & n) - d["60"]) : q + ((f ^ g ^ n) - d["80"]);
                    u = n;
                    n = g;
                    g = f << 30 | f >>> 2;
                    f = e;
                    e = q
                }
                c[0] = c[0] + e | 0;
                c[1] = c[1] + f | 0;
                c[2] = c[2] + g | 0;
                c[3] = c[3] + n | 0;
                c[4] = c[4] + u | 0
            },_getInitial: function() {
                var a = [1732584193, 4023233417, 2562383102, 271733878, 3285377520];
                return function() {
                    return a.slice(0)
                }
            }()}), a = function(a) {
            return (new f(a)).finalize()
        };
        g.simple("hash:sha1", a);
        return a
    });
    m("sizzle", function(b, e, c) {
        var a = e("util"), e = e("dom"), g = /^(?:(\w+)|(\*(?=\W|$))|\.([\w\-]+)|#([\w\-]+))([#\.\w\-]*)/, i = /^\[([\w\-]+)(?:(\W?=)(["']?)([^\]]*)\3(["']?))?\]/, 
        d = b.attr = e.attr, f = b.hasAttr = function(a, b) {
            var c;
            return a.hasAttribute ? a.hasAttribute(b) : !(!(c = a.attributes[b]) || !c.nodeValue)
        }, j = function(b, c, e, j) {
            var g = function(a) {
                return function(b) {
                    return !!d(b, c).match(a)
                }
            }, k = j && a.escapeRegexp(j), e = !e ? function(a) {
                return f(a, c)
            } : "=" === e ? function(a) {
                return d(a, c) === j
            } : "!=" === e ? function(a) {
                return d(a, c) !== j
            } : "*=" === e ? function(a) {
                return 0 <= d(a, c).indexOf(j)
            } : "~=" === e ? g("(^|\\s)" + k + "(\\s|$)") : "|=" === e ? g("^" + k + "\\b") : "$=" === e ? g(k + "$") : "^=" === e ? g("^" + k) : "false";
            return a.filter(b, 
            e)
        }, k = b.getElementsByClassName = function(b, d) {
            a.isString(b) && (d = b, b = c.document);
            return b.getElementsByClassName ? b.getElementsByClassName(d) : j(b.getElementsByTagName("*"), "class", "~=", d)
        };
        b.find = function(b, d) {
            d = d || c.document;
            a.isArray(d) || (d = [d]);
            for (var e = d, f = [], n, u = 0, o = function(b, c) {
                return c[1] ? a.toArray(b.getElementsByTagName(c[1])) : c[2] ? a.toArray(b.getElementsByTagName("*")) : c[3] ? a.toArray(k(b, c[3])) : c[4] && (c = b.getElementById(c[4])) ? [c] : []
            }, q = function() {
                f = f.concat(e === d ? [] : e);
                e = d
            }, v = function(a, 
            b) {
                return function() {
                    var c = n.match(a);
                    if (!c)
                        return 0;
                    b(c);
                    return c[0].length
                }
            }, s = v(g, function(b) {
                var c = [];
                a.each(e, function(a) {
                    c = c.concat(o(a, b))
                });
                e = c;
                for (var d, f = b[5] || ""; d = f.match(/^([\.#])([\w\-]+)/); )
                    e = "." === d[1] ? j(e, "class", "~=", d[2]) : j(e, "id", "=", d[2]), f = f.slice(d[0].length);
                if (f)
                    throw "parse error";
            }), t = v(i, function(a) {
                e = j(e, a[1], a[2], a[4])
            }), w = v(/\s*/, function() {
            }), v = v(/,/, q); n = b.slice(u); ) {
                var m;
                if (!(m = s()))
                    if (!(m = t()))
                        if (!(m = v()))
                            if (!(m = w()))
                                throw "selector parse error";
                u += m
            }
            q();
            return f
        }
    });
    m("social", function(b, e, c) {
        var a = e("util");
        a.on("social", function(b) {
            var d = a.rewriter({facebook: "fb",twitter: "twttr"});
            e("http").pixel({url: a.get("url_social"),data: {_kpid: a.get("pubid"),_kcp_s: a.get("site"),_ksoc_t: d(b.provider),_ksoc_e: b.action,_ksoc_url: b.url,_kpa_title: c.document.title}})
        });
        var g = function(b, c) {
            a.fire("social", {provider: "facebook",action: b,url: c})
        }, i = b.init_facebook = function() {
            var b = (b = c.FB) && (b = b.Event) && b.subscribe && a.bind(b.subscribe, b);
            b ? (b("edge.create", a.bind(g, null, "like")), 
            b("edge.remove", a.bind(g, null, "unlike")), b("message.send", a.bind(g, null, "send")), b = "done") : b = "fail";
            a.fire("social.init_facebook", {status: b})
        }, d = b.init_twitter = function() {
            var b = (b = c.twttr) && (b = b.events) && b.bind && a.bind(b.bind, b);
            b ? (b("tweet", function(b) {
                a.fire("social", {provider: "twitter",action: "tweet",url: b && b.target && "IFRAME" === b.target.nodeName ? b.target.src : null})
            }), b = "done") : b = "fail";
            a.fire("social.init_twitter", {status: b})
        };
        e("routes").simple("social.init", function() {
            c.setTimeout(function() {
                i();
                d()
            }, 1E3)
        })
    });
    m("stateful", function(b, e) {
        var c = e("util"), a = e("class").Class, g = e("json").JSON, i = /(?:([a-z]*):)?([^:]+)$/i, d = a.extend(function(a, b) {
            this._type = "Stateful";
            this._raw = a || {};
            this._defaults = b || {};
            this._handlers = {all: []}
        }, {get: function(a) {
                var b = this._raw[a];
                return c.existy(b) ? b : this._defaults[a]
            },set: function(a, b) {
                var c = this._raw[a];
                this._raw[a] = b;
                this._fire("set", a, c, b);
                return this
            },has: function(a, b) {
                return c.existy(this._raw[a]) || b && c.existy(this._defaults[a])
            },remove: function(a, b) {
                var d = 
                this._raw[a];
                delete this._raw[a];
                c.existy(d) && this._fire("remove", a, d, c.UNDEFINED);
                b && (d = this._defaults[a], delete this._defaults[a], c.existy(d) && this._fire("removeDefault", a, d, c.UNDEFINED));
                return this
            },watch: function(a, b, d) {
                if (!c.isFunction(b))
                    throw Error("watch expected function, but got: " + String(b) + "\nContext: " + String(this));
                var e, g;
                g = a.match(i);
                "all" === a ? (g = "", e = a) : !g[1] || "all" === g[1] ? (g = g[2], e = "all", a = e + ":" + g) : (e = g[1], g = g[2]);
                var r = this._mkRemover(a, b);
                this._addHandler(a, {context: d,fn: b,key: g,
                    remove: r,type: e});
                return r
            },toString: function() {
                return String(this._type) + g.stringify(this._raw)
            },_fire: function(a, b, d, e, g) {
                var i = this._handlers;
                c.forEach(i.all.concat(i["all:" + b] || []).concat(i[a + ":" + b] || []), function(a) {
                    a = a.fn.call(a.context || null, b, d, e);
                    c.existy(a) && ((g || this._raw)[b] = a)
                }, this);
                return this
            },_addHandler: function(a, b) {
                var c = this._handlers[a];
                c || (c = this._handlers[a] = []);
                c.push(b);
                return this
            },_mkRemover: function(a, b) {
                var d = this;
                return function() {
                    d._handlers[a] = c.filter(d._handlers[a], 
                    function(a) {
                        return a.fn !== b
                    })
                }
            }});
        return c.extend(function(a, b) {
            return new d(a, b)
        }, {Stateful: d}, b)
    });
    m("stats", function(b, e) {
        var c = e("util");
        e("events");
        e("data");
        var a = {counter: {},time: {}}, g = b.get = function(b, c) {
            return a[b][c]
        }, i = b.set = function(b, c, d) {
            a[b][c] = d
        };
        b.time = function(a, b) {
            i("time", a, b)
        };
        var d = b.inc = function(a) {
            var b = g("counter", a) || 0;
            i("counter", a, b + 1)
        }, f = b.incPath = function(a) {
            var b = a.split(".");
            c.times(b.length, function(a) {
                d(c.first(b, a + 1).join("."))
            })
        }, j = "." + e("dom").browserBucket, k = 
        "." + c.get("config_param_control_tag_version"), h = k + j;
        f("views" + h);
        c.get("config_param_control_tag_stats_prefix");
        c.on("social", function(a) {
            d(a.provider + "." + a.action)
        });
        c.on("tag:done", function() {
            f("tags_delivered" + h)
        });
        var p = 0;
        c.on("error", function() {
            try {
                10 < p || (p++, f("js_errors" + h))
            } catch (a) {
            }
        });
        if (Math.random() < (".alpha" === k ? 1 : ".beta" === k || ".stable" === k ? 0.01 : 0.001))
            c.onOnce("tag:all_done", function() {
                function b(a, c) {
                    return "controltagv2." + a + ":" + c + "|" + this
                }
                var d = c.map(a.counter, c.bind(b, "c")).concat(c.map(a.time, 
                c.bind(b, "ms"))).join(",");
                e("http").pixel({url: c.get("url_stats"),data: {q: d,format: "gif"}})
            })
    });
    m("store", function(b, e, c) {
        var a = e("util"), g = c.localStorage, i = c.document, d = ["set", "get", "remove", "namespace", "clear"], f = b.SECONDS = 1, f = b.MINUTES = 60 * f, f = b.HOURS = 60 * f;
        b.DAYS = 24 * f;
        var j = function(a) {
            b.prefix && 0 !== a.indexOf(n) && (a = n + a);
            return a
        }, k = {domain: function(a) {
                return "; domain=" + a
            }}, h = b.cookie = {set: function(a, b, c, d) {
                c = c ? "; expires=" + (new Date(+new Date + 1E3 * c)).toUTCString() : "";
                a = a + "=" + encodeURIComponent(b) + 
                h._optionsToCookie(d) + ";path=/" + c;
                return i.cookie = a
            },get: function(a) {
                var b;
                return i.cookie && (b = i.cookie.match("\\b" + a + "=([^;]*)")) && c.decodeURIComponent(b[1])
            },remove: function(a) {
                this.set(a, 0, -1)
            },namespace: function(a) {
                var b = {};
                i.cookie.replace(RegExp("\\b" + a + "([^=]*)=([^;]*)", "g"), function(a, c) {
                    b[decodeURIComponent(a)] = decodeURIComponent(c)
                });
                return b
            },clear: function() {
                a.forEach(i.cookie.split(/\s*;\s*/), function(a) {
                    h.remove(j(a.split("=")[0]))
                })
            },_optionsToCookie: function(b) {
                var c = "";
                a.forEach(b, 
                function(a, b) {
                    a in k && (c += k[a](b))
                });
                return c
            }};
        if (f = g) {
            var p = {set: function(a, b, c) {
                    g.setItem(a, b);
                    c && g.setItem("_" + a, +new Date(+new Date + 1E3 * c))
                },get: function(a) {
                    var b = g.getItem(a), a = g.getItem("_" + a);
                    return !a ? b : a > new Date ? b : null
                },remove: function(a) {
                    g.removeItem(a);
                    g.removeItem("_" + a)
                },namespace: function(a) {
                    var c = {}, d, e;
                    for (e in g)
                        if (d = e.match("^" + a + "(.*)"))
                            c[d[1]] = b.get(d[1]);
                    return c
                },clear: function() {
                    for (var a in g)
                        l.remove(j(a))
                }}, r = {};
            a.each(d, function(a) {
                r[a] = function() {
                    try {
                        return p[a].apply(p, 
                        arguments)
                    } catch (b) {
                    }
                }
            });
            f = r
        }
        var l = b.local = f, e = e("ns"), n = b.prefix = "kx" + (e.isDefault ? "" : e.name + "_");
        b.init = function(c) {
            var e;
            if (l && !c)
                try {
                    l.set("kxtest", "test"), e = "test" === l.get("kxtest") && l, l.remove("kxtest")
                } catch (f) {
                }
            var g = e = e || h, i = {};
            a.each(d, function(b) {
                i[b] = function(c) {
                    return g[b].apply(g, [j(c || "")].concat(a.rest(arguments)))
                }
            });
            var k = b.impl = i;
            a.each(d, function(a) {
                b[a] = k[a]
            });
            return k
        }
    });
    m("tag-actions", function(b, e) {
        var c = e("util"), a = e("tag-delivery"), g = e("tag-delivery-timing"), i = e("events").instance;
        b.DEFAULT = "all";
        var d = c.yes;
        b[b.DEFAULT] = function(b) {
            i.clear("tag");
            var e = c.filter(c.get("tags"), function(b) {
                var c = d(b);
                c && a.forget(b);
                return c
            });
            g(e);
            var k;
            c.on("tag:all_done", k = function() {
                b(null);
                c.off("tag:all_done", k)
            })
        }
    });
    m("tag-delivery-timing", function(b, e) {
        var c = e("util"), a = e("tag-delivery"), g = e("dom");
        e("store");
        var i = b.isDone = function(a) {
            return !!(a.time && a.time.end || a.error || !1 === a.metCriteria)
        };
        return c.extend(function(b) {
            c.each(b, a.uniqueName);
            var e, j = function() {
                c.all(b, i) && (j = c.doNothing, 
                c.fireOnce("tag:all_done"))
            };
            c.on("tag:done", function() {
                j()
            });
            c.on("tag:fail", function() {
                j()
            });
            j();
            var k = function(h) {
                e = c.filter(b, function(a) {
                    return a.timing === h
                });
                c.each(e, function(b) {
                    a.meetsCriteria(b) && a.deliver(b)
                });
                j()
            }, h = c.once(k, null, "onload"), p = c.once(k, null, "onready");
            k("asap");
            g.ready(p);
            g.load(h);
            a.init();
            return {deliver: k,isDone: function() {
                    return j !== c.doNothing
                }}
        }, b, a)
    });
    m("tag-delivery", function(b, e, c) {
        var a = e("util"), g = c.document, i = e("dom"), d = e("geo"), f = e("hash-set"), j = e("ns");
        e("sizzle");
        var k = e("store"), h = e("x-frame");
        e("data");
        var p = new Date, p = new Date(+p + 864E5), r = new Date(p.getFullYear(), p.getMonth(), p.getDate()), l = b.mode = "1" === a.param("writeCapture") ? "writeCapture" : "1" === a.param("writeNativeIframe") ? "nativeIframe" : "1" === a.param("writeOld") ? "old" : "newWriter";
        b.forget = function(a) {
            delete a.metCriteria;
            a.time = {};
            return a
        };
        var n = {};
        a.set("tagsByName", n);
        var m = b.uniqueName = function(a) {
            if (!a.named) {
                for (var b = a.name, c = 1; n[b]; )
                    c++, b = a.name + "_" + c;
                a.name = b;
                a.named = !0;
                n[b] = a
            }
        }, o = function(a, 
        b, d, e) {
            a.root = b;
            var f = w(a.content), h = c.Krux, q = function() {
                j.isDefault || (c.Krux = j.self)
            }, g = function() {
                j.isDefault || (c.Krux = h)
            }, i = function() {
                d()
            };
            "writeCapture" === l ? (c.$(b).attr("data-writeCapture", "true"), c.$(b).writeCapture().html(f, {done: i})) : "nativeIframe" === a.method || "native" === l && a.target ? (b.ownerDocument.write(f), d()) : c.Krux.postscribe(b, f, {afterDequeue: q,afterStreamStart: g,done: i,error: e,name: a.name,releaseAsync: !0})
        };
        e("routes").simple("nativeTag", function(c) {
            "native" === l && b.deliver(a.get("tagsByName")[c])
        });
        e("routes").simple("writeHtml", function(a, c, d) {
            b.deliver({name: d || "Anonymous",content: c,target: a[0] || a})
        });
        var q = function(a, b) {
            var c;
            if (a.target) {
                c = a.target;
                var d;
                c = c && c.nodeType ? c : c && (d = c.match(/^(head|body)$/)) ? g[d[1]] : g.getElementById(c)
            } else
                c = i.kxhead || g.getElementsByTagName("script")[0].parentNode;
            if (d = c)
                i[a.target_action || "append"](d, b);
            return d
        }, v = function(a) {
            var b = {"class": "kxtag","data-id": a.id,"data-alias": a.name};
            b["class"] += a.target ? " kxtargeted" : " kxinvisible";
            return b
        }, s = {eval: function(b, 
            c, d) {
                var e;
                try {
                    e = a.globalEval(b.content)
                } catch (f) {
                    d(f)
                }
                c();
                return e
            },apply: function(a, b, c) {
                var d;
                try {
                    d = a.content.apply(null)
                } catch (e) {
                    c(e)
                }
                b();
                return d
            },document: function(a, b, c) {
                var d = i.createElement("span", v(a));
                q(a, d) ? o(a, d, b, c) : b();
                return d
            },iframeCommon: function(a, b, d, e) {
                var f = v(a);
                f.width = f.height = 0;
                f.scrolling = "no";
                f.style = "overflow:hidden;";
                var h = a.name.match(/(\d+)x(\d+)/);
                h && (f.width = h[1] + "px", f.height = h[2] + "px");
                f = i.createElement("iframe", f);
                if (q(a, f)) {
                    h = f.contentWindow.document;
                    h.open();
                    h.write('<html><head></head><body style="margin:0;">');
                    e.leaveOpen || h.close();
                    if (e.onIframe)
                        e.onIframe(f);
                    f.contentWindow.Krux = c.Krux;
                    o(a, f.contentWindow.document.body, b, d)
                } else
                    b();
                return f
            },nativeIframe: function(a, b, c, d) {
                d.leaveOpen = !0;
                return s.iframeCommon(a, b, c, d)
            },iframe: function(a, b, c, d) {
                return s.iframeCommon(a, b, c, d)
            }}, t = b.templateData = function() {
            return {pubid: a.get("pubid"),site: a.get("site"),geo: d.get(),now: new Date}
        }, w = b.runTemplate = function(b, c) {
            e("underscore").templateSettings = {evaluate: /\{%([\s\S]+?)%\}/g,
                interpolate: /\{\{([\s\S]+?)\}\}/g,escape: /\{%-([\s\S]+?)%\}/g};
            t.now = new Date;
            return a.template(b, c || t())
        };
        b.meetsCriteria = function(b) {
            if (b.once_per_page && x.has(b))
                return b.metCriteria = !1;
            if (!b.criteria)
                return b.metCriteria = !0;
            if ("native" === l && b.target)
                return b.metCriteria = !1;
            a.set("now", new Date);
            if (b.freq_cap) {
                var c = +k.get("tag" + b.id + ".day") || 0;
                a.set("tag_deliveries_today", c)
            }
            return b.metCriteria = e("expression").eval(b.criteria)
        };
        var y = 0, x = j.self._oneTimeTags = j.self._oneTimeTags || f(function(a) {
            return a.id
        });
        b.deliver = function(b, c) {
            var d = b.once_per_page;
            if (d && x.has(b))
                return x.get(b).id;
            c = c || {};
            m(b);
            b.id = b.id || y++;
            b.time = {mode: "async",start: a.ms()};
            b.method = b.method || (a.isFunction(b.content) ? "apply" : "document");
            "nativeIframe" === l && b.target && (b.method = "nativeIframe");
            var e = function(c) {
                b.error = c && c.message && c || {message: "unknown error"};
                a.fire("tag:fail", {id: b.id,alias: b.name,error: b.error.message})
            };
            a.fire("tag:started", {id: b.id,alias: b.name});
            var f;
            try {
                return f = s[b.method](b, function() {
                    b.time.end = a.ms();
                    b.time.duration = b.time.end - b.time.start;
                    if (b.freq_cap) {
                        var c = "tag" + b.id + ".day", d = +k.get(c) || 0;
                        k.set(c, d + 1, (r - new Date) / 1E3)
                    }
                    a.fire("tag:done", {id: b.id,alias: b.name})
                }, e, c), d && x.put({id: b.id}), f
            } catch (h) {
                return e(h), null
            }
        };
        b.claimOneTimers = function(b) {
            var b = a.filter(b, function(a) {
                return a.once_per_page
            }), c = a.now(), d = a.map(b, function(a) {
                return {id: a.id,claimId: c}
            });
            d.length && (h.broadcast({tags: d}), h.listen(function(b) {
                b = b.data.tags;
                b = a.filter(b, function(b) {
                    var c = a.find(d, function(a) {
                        return a.id === b.id
                    });
                    return b.claimId < c.claimId
                });
                x.put.apply(x, b)
            }))
        };
        b.init = a.once(function() {
            e("test").module("tag-delivery", function(b) {
                var c = {};
                a.each(a.get("tags"), function(d) {
                    !a.happened("dom:beforeunload") && !a.happened("dom:unload") && b("tag_considered", null != d.metCriteria, d.name);
                    if (d.metCriteria) {
                        var e = d.time || {}, f = e.start;
                        b("tag_delivered", e.end, d.name);
                        e = d.timing;
                        b("tag_valid_timing_name", e, e);
                        e = c[e] = c[e] || {lastStart: 0};
                        b("tag_order", f >= e.lastStart, d.name);
                        e.lastStart = f
                    }
                })
            })
        })
    });
    m("tag", function(b, e) {
        var c = 
        e("util"), a = e("tag-actions"), g = e("tag-delivery-timing"), i = e("routes"), d = e("store");
        e("x-frame");
        e("data");
        c.extend(b, g, {Timing: g});
        b.init = function() {
            var a = d.get("org_user_id") || d.get("kuid");
            a && c.set("user", a);
            c.onOnce("user_data_response", function() {
                var a = c.get("user");
                a && d.set("kuid", a)
            });
            g(c.get("tags"))
        };
        i.regexp(/^tag:reload:?(.*)$/, function(b, c) {
            var d = b[1] || a.DEFAULT;
            if (d in a)
                try {
                    a[d](c)
                } catch (e) {
                    c(e)
                }
            else
                c(new TypeError("Krux('tags') has no method: " + d))
        })
    });
    m("test-visualtags", function(b, 
    e) {
        function c(a) {
            return -1 < ("" + a).indexOf("px") ? parseInt(a.replace("px", ""), 10) || 0 : 0
        }
        function a(a, b) {
            return Math.floor(100 * (Math.abs(a - b) / b))
        }
        function g(a, b) {
            return b["offset" + ("width" === a ? "Width" : "Height")] || 0
        }
        function i(a, b) {
            j++;
            if (1E3 < j)
                return 0;
            for (var c = 0, d = "offset" + ("width" === a ? "Width" : "Height"), e = 0; e < b.childNodes.length; e++)
                c = Math.max(c, b.childNodes[e][d] || 0), b.childNodes[e].childNodes.length && (c = Math.max(c, i(a, b.childNodes[e])));
            return c
        }
        var d = e("util"), f = e("sizzle").find;
        b.init = function() {
            e("test").module("visualtags", 
            function(b) {
                for (var e = f(".kxtargeted"), j = 0, r = e.length; j < r; j++) {
                    var l = e[j].getAttribute("data-id"), n = e[j].getAttribute("data-alias");
                    a: {
                        var m = d.get("tagsByName"), o = void 0;
                        for (o in m)
                            if (m[o].id === l) {
                                l = m[o].target || "";
                                break a
                            }
                        l = ""
                    }
                    l = f("#" + l);
                    l = 1 === l.length ? l[0] : e[j].parentNode;
                    m = Math.max(g("width", e[j]), i("width", l));
                    o = Math.max(g("height", e[j]), i("height", l));
                    b("visualtag-not-blank", m * o, "Tag area appears to be empty (" + n + ")");
                    l.style && c(l.style.width) && b("visualtag-expected-width", 10 > a(c(l.style.width), 
                    m), "Tag width ain't right (" + n + ")");
                    l.style && c(l.style.height) && b("visualtag-expected-height", 10 > a(c(l.style.height), o), "Tag height ain't right (" + n + ")")
                }
            })
        };
        var j = 0
    });
    m("test", function(b, e, c) {
        var a = e("util"), g = {}, i = "test";
        b.status = "NOT_STARTED";
        var d = b.test = function(c, d, e) {
            var f = d ? "pass" : "fail";
            b.results.push({module: i,code: c,data: e,assertion: d,time: new Date,status: f});
            a.fire("test:" + f, {code: c,data: e});
            return d
        }, f = function(b, c) {
            return a.isArray(b) && a.isArray(c) ? b.length === c.length && a.all(b, function(a, 
            b) {
                return f(a, c[b])
            }) : b === c
        };
        d.eq = function(a, b, c) {
            return d(a, f(b, c), {actual: b,expected: c})
        };
        b.module = function(a, c) {
            "NOT_STARTED" !== b.status && d("tests_not_started", !1, b.status);
            g[a] = c
        };
        var j = function(a, b) {
            i = a;
            try {
                b(d)
            } catch (c) {
                d("tests_module_threw", !1, "module_" + a + "_threw:" + c.message)
            }
        }, k = b.run = function() {
            b.results = [];
            b.failureGroup = null;
            d("tests_to_run", !a.isEmpty(g));
            a.eachHash(g, j);
            var e = b.report = a.groupBy(b.results, "status");
            e.total = b.results.length;
            e.toString = function() {
                try {
                    var d = [], e = function() {
                        d.push(Array.prototype.join.call(arguments, 
                        ""))
                    };
                    e("Test Summary: " + b.status);
                    e("Version: " + c.Krux.version + ", " + c.Krux.commit);
                    b.failureGroup && e("Failure Group :" + b.failureGroup);
                    e("Phase: " + b.phase);
                    e("Status,Code,Data");
                    a.each(b.results, function(a) {
                        e(a.status, ",", a.code, ",", a.data)
                    });
                    return d.join("\n")
                } catch (f) {
                    return "report.toString failed: " + f
                }
            };
            var f = b.status = e.status = e.fail ? "FAIL" : "PASS";
            if ("PASS" !== f) {
                var i = -1, k, n = 1E3, m = [], o = {tests_to_run: n--,tests_module_threw: n--,pixel: n--,tag_delivered: n--};
                a.each(e.fail, function(a) {
                    var b = o[a.code] || 
                    0;
                    m.push(a.code + ": " + a.data);
                    b > i && (i = b, k = a)
                });
                b.failureGroup = k.code + (k.data ? ":" + k.data : "");
                b.phase = a.happened("dom:load") ? "after_load" : a.happened("dom:ready") ? "after_ready_before_load" : "before_ready"
            }
            a.fire("test:all_done", {status: f})
        };
        b.init = function() {
            var b = a.once(k);
            a.on("pixel", b);
            a.on("dom:beforeunload", b);
            a.on("dom:unload", b)
        }
    });
    m("timing", function(b, e) {
        var c = e("data"), a = Date.now || function() {
            return (new Date).getTime()
        }, g = function(b) {
            return function() {
                c.set(b, a())
            }
        };
        return {start: g("started"),
            end: g("ended")}
    });
    m("underscore", function(b, e, c) {
        var a = b, g = {}, i = Array.prototype, d = Object.prototype, f = i.slice, j = d.toString, k = d.hasOwnProperty, h = i.map, p = i.filter, r = i.every, l = i.some, n = i.indexOf, i = Array.isArray, m = a.each = a.forEach = function(a, b, c) {
            if (null != a)
                if (a.length === +a.length)
                    for (var d = 0, e = a.length; d < e && !(d in a && b.call(c, a[d], d, a) === g); d++)
                        ;
                else
                    for (d in a)
                        if (k.call(a, d) && b.call(c, d, a[d], a) === g)
                            break
        };
        a.map = function(a, b, c) {
            var d = [];
            if (null == a)
                return d;
            if (h && a.map === h)
                return a.map(b, c);
            m(a, function(a, 
            e, f) {
                d[d.length] = b.call(c, a, e, f)
            });
            return d
        };
        a.find = a.detect = function(a, b, c) {
            var d;
            o(a, function(a, e, f) {
                if (b.call(c, a, e, f))
                    return d = a, !0
            });
            return d
        };
        a.every = a.all = function(a, b, c) {
            var d = !0;
            if (null == a)
                return d;
            if (r && a.every === r)
                return a.every(b, c);
            m(a, function(a, e, f) {
                if (!(d = d && b.call(c, a, e, f)))
                    return g
            });
            return d
        };
        var o = a.some = a.any = function(b, c, d) {
            var c = c || a.identity, e = !1;
            if (null == b)
                return e;
            if (l && b.some === l)
                return b.some(c, d);
            m(b, function(a, b, f) {
                if (e || (e = c.call(d, a, b, f)))
                    return g
            });
            return !!e
        };
        a.include = 
        a.contains = function(a, b) {
            var c = !1;
            return null == a ? c : n && a.indexOf === n ? -1 != a.indexOf(b) : c = o(a, function(a) {
                return a === b
            })
        };
        a.filter = a.select = function(a, b, c) {
            var d = [];
            if (null == a)
                return d;
            if (p && a.filter === p)
                return a.filter(b, c);
            m(a, function(a, e, f) {
                b.call(c, a, e, f) && (d[d.length] = a)
            });
            return d
        };
        a.reduce = a.foldl = a.inject = function(a, b, c, d) {
            var e = 2 < arguments.length;
            null == a && (a = []);
            m(a, function(a, f, h) {
                e ? c = b.call(d, c, a, f, h) : (c = a, e = !0)
            });
            if (!e)
                throw new TypeError("Reduce of empty array with no initial value");
            return c
        };
        a.indexOf = function(b, c, d) {
            if (null == b)
                return -1;
            var e;
            if (d)
                return d = a.sortedIndex(b, c), b[d] === c ? d : -1;
            if (n && b.indexOf === n)
                return b.indexOf(c);
            d = 0;
            for (e = b.length; d < e; d++)
                if (d in b && b[d] === c)
                    return d;
            return -1
        };
        a.uniq = a.unique = function(b, c, d) {
            var d = d ? a.map(b, d) : b, e = [];
            3 > b.length && (c = !0);
            a.reduce(d, function(d, f, h) {
                if (c ? a.last(d) !== f || !d.length : !a.include(d, f))
                    d.push(f), e.push(b[h]);
                return d
            }, []);
            return e
        };
        a.difference = function(b) {
            var c = a.flatten(f.call(arguments, 1), !0);
            return a.filter(b, function(b) {
                return !a.include(c, 
                b)
            })
        };
        a.flatten = function(b, c) {
            return a.reduce(b, function(b, d) {
                if (a.isArray(d))
                    return b.concat(c ? d : a.flatten(d));
                b[b.length] = d;
                return b
            }, [])
        };
        a.intersection = a.intersect = function(b) {
            var c = f.call(arguments, 1);
            return a.filter(a.uniq(b), function(b) {
                return a.every(c, function(c) {
                    return 0 <= a.indexOf(c, b)
                })
            })
        };
        a.groupBy = function(b, c) {
            var d = {}, e = a.isFunction(c) ? c : function(a) {
                return a[c]
            };
            m(b, function(a, b) {
                var c = e(a, b);
                (d[c] || (d[c] = [])).push(a)
            });
            return d
        };
        a.compact = function(b) {
            return a.filter(b, function(a) {
                return !!a
            })
        };
        a.invoke = function(b, c) {
            var d = f.call(arguments, 2);
            return a.map(b, function(b) {
                return (a.isFunction(c) ? c || b : b[c]).apply(b, d)
            })
        };
        a.pluck = function(b, c) {
            return a.map(b, function(a) {
                return a[c]
            })
        };
        a.identity = function(a) {
            return a
        };
        a.values = function(b) {
            return a.map(b, a.identity)
        };
        a.times = function(a, b, c) {
            for (var d = 0; d < a; d++)
                b.call(c, d)
        };
        a.clone = function(b) {
            return !a.isObject(b) ? b : a.isArray(b) ? b.slice() : a.extend({}, b)
        };
        a.extend = function(a) {
            m(f.call(arguments, 1), function(b) {
                for (var c in b)
                    void 0 !== b[c] && (a[c] = b[c])
            });
            return a
        };
        a.defaults = function(a) {
            m(f.call(arguments, 1), function(b) {
                for (var c in b)
                    null == a[c] && (a[c] = b[c])
            });
            return a
        };
        a.first = a.head = function(a, b, c) {
            return null != b && !c ? f.call(a, 0, b) : a[0]
        };
        a.initial = function(a, b, c) {
            return f.call(a, 0, a.length - (null == b || c ? 1 : b))
        };
        a.last = function(a, b, c) {
            return null != b && !c ? f.call(a, Math.max(a.length - b, 0)) : a[a.length - 1]
        };
        a.rest = a.tail = function(a, b, c) {
            return f.call(a, null == b || c ? 1 : b)
        };
        a.size = function(b) {
            return null == b ? 0 : b.length === +b.length ? b.length : a.keys(b).length
        };
        a.toArray = 
        function(b) {
            return !b ? [] : b.toArray ? b.toArray() : a.isArray(b) || a.isArguments(b) ? f.call(b) : a.values(b)
        };
        a.escape = function(a) {
            return ("" + a).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;").replace(/\//g, "&#x2F;")
        };
        a.template = function(b, c) {
            var d = a.templateSettings, d = "var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push('" + b.replace(/\\/g, "\\\\").replace(/'/g, "\\'").replace(d.escape, function(a, b) {
                return "',_.escape(" + 
                b.replace(/\\'/g, "'") + "),'"
            }).replace(d.interpolate, function(a, b) {
                return "'," + b.replace(/\\'/g, "'") + ",'"
            }).replace(d.evaluate || null, function(a, b) {
                return "');" + b.replace(/\\'/g, "'").replace(/[\r\n\t]/g, " ") + ";__p.push('"
            }).replace(/\r/g, "\\r").replace(/\n/g, "\\n").replace(/\t/g, "\\t") + "');}return __p.join('');", e = new Function("obj", "_", d);
            return c ? e(c, a) : function(b) {
                return e.call(this, b, a)
            }
        };
        a.isEmpty = function(b) {
            if (a.isArray(b) || a.isString(b))
                return 0 === b.length;
            for (var c in b)
                if (k.call(b, c))
                    return !1;
            return !0
        };
        a.isElement = function(a) {
            return !!(a && 1 == a.nodeType)
        };
        a.isArray = i || function(a) {
            return "[object Array]" == j.call(a)
        };
        a.isObject = function(a) {
            return a === Object(a)
        };
        a.isArguments = "[object Arguments]" == j.call(arguments) ? function(a) {
            return "[object Arguments]" == j.call(a)
        } : function(a) {
            return !(!a || !k.call(a, "callee"))
        };
        a.isFunction = function(a) {
            return "[object Function]" == j.call(a)
        };
        a.isString = function(a) {
            return "[object String]" == j.call(a)
        };
        a.isNumber = function(a) {
            return "[object Number]" == j.call(a)
        };
        a.isNaN = 
        function(a) {
            return a !== a
        };
        a.isBoolean = function(a) {
            return !0 === a || !1 === a || "[object Boolean]" == j.call(a)
        };
        a.isDate = function(a) {
            return "[object Date]" == j.call(a)
        };
        a.isRegExp = function(a) {
            return "[object RegExp]" == j.call(a)
        };
        a.isNull = function(a) {
            return null === a
        };
        a.isUndefined = function(a) {
            return void 0 === a
        };
        a.range = function(a, b, c) {
            1 >= arguments.length && (b = a || 0, a = 0);
            for (var c = arguments[2] || 1, d = Math.max(Math.ceil((b - a) / c), 0), e = 0, f = Array(d); e < d; )
                f[e++] = a, a += c;
            return f
        };
        a.now = Date.now || function() {
            return (new Date).getTime()
        };
        a.throttle = function(b, c, d) {
            var e, f, h, j = null, g = 0;
            d || (d = {});
            var i = function() {
                g = !1 === d.leading ? 0 : a.now();
                j = null;
                h = b.apply(e, f);
                e = f = null
            };
            return function() {
                var k = a.now();
                !g && !1 === d.leading && (g = k);
                var l = c - (k - g);
                e = this;
                f = arguments;
                0 >= l ? (clearTimeout(j), j = null, g = k, h = b.apply(e, f), e = f = null) : !j && !1 !== d.trailing && (j = setTimeout(i, l));
                return h
            }
        };
        a.partial = function(b) {
            var c = f.call(arguments, 1);
            return function() {
                for (var d = 0, e = c.slice(), f = 0, h = e.length; f < h; f++)
                    e[f] === a && (e[f] = arguments[d++]);
                for (; d < arguments.length; )
                    e.push(arguments[d++]);
                return b.apply(this, e)
            }
        };
        a.compose = function() {
            var a = arguments;
            return function() {
                for (var b = arguments, c = a.length - 1; 0 <= c; c--)
                    b = [a[c].apply(this, b)];
                return b[0]
            }
        }
    });
    m("util", function(b, e, c) {
        var a = e("underscore");
        a.extend(b, a, {_: a});
        a = b;
        a.UNDEFINED = void 0;
        a.globalEval = function(a, b) {
            b = b || c;
            a && /\S/.test(a) && b.eval.call(b, a)
        };
        a.parseParams = a.parseKeyValues = function(b, c, e, g) {
            var c = c || "&", e = e || "=", g = g || decodeURIComponent, h = {};
            if ("string" !== typeof b)
                return h;
            b.replace(RegExp(c + "*([^" + e + c + "]+)" + e + "([^" + c + "]+)" + 
            c + "*", "g"), function(b, c, d) {
                d = g(d);
                h[c] = !h[c] ? d : a.isArray(h[c]) ? h[c].concat([d]) : [h[c], d]
            });
            return h
        };
        a.urlParams = function(b) {
            b = (b || c.location.href).match(/[^\#?]+(?:\?([^#]*))?(?:#(.*))?/);
            return a.parseParams(a.compact(b.slice(1)).join("&"))
        };
        a.paramString = function(b, c, e, g) {
            var c = c || "&", e = e || "=", g = g || encodeURIComponent, h = [];
            a.eachHash(b, function(b, c) {
                c = a.isArray(c) ? c : [c];
                a.each(c, function(a) {
                    null != a && "" !== a && h.push(g(b) + e + g(a))
                })
            });
            return h.join(c)
        };
        a.isPrimitive = function(b) {
            return null == b || !/^object|function$/.test(typeof b) && 
            !a.isNaN(b)
        };
        a.isSerializable = function(b) {
            return a.isPrimitive(b) || !/[object [^\]]*]/.test(String(b))
        };
        a.without = a.remove = function(b, c) {
            return a.filter(b, function(a) {
                return a !== c
            })
        };
        var g = RegExp("(\\/|\\.|\\*|\\+|\\?|\\||\\(|\\)|\\[|\\]|\\{|\\}|\\\\)", "g");
        a.escapeRegexp = function(a) {
            return ("" + a).replace(g, "\\$1")
        };
        a.doNothing = a.noop = function() {
        };
        a.defer = function(b) {
            var e = a.rest(arguments);
            c.setTimeout(function() {
                b.apply(null, e)
            }, 0)
        };
        var i = [];
        i.toString = function() {
            return e("json").JSON.stringify(i)
        };
        a.log = function(b) {
            if (a.isString(b))
                c.console && console.log(b);
            else if (b)
                b.time = new Date, i.push(b);
            else
                return i
        };
        a.Set = function(a) {
            for (var b = 0; b < a.length; b++)
                this[a[b]] = !0
        };
        a.negate = function(a) {
            return function() {
                return !a.apply(this, arguments)
            }
        };
        a.G = c;
        a.bind = function(b, c) {
            if (b.isBound && 3 > arguments.length)
                return b;
            var e = a.rest(arguments, 2), g = function() {
                return b.apply(c, e.concat(a.toArray(arguments)))
            };
            g.actual = b;
            g.isBound = !0;
            return g
        };
        a.bindMethod = function(b, c) {
            a.each(b.split(" "), function(b) {
                c[b] = a.bind(c[b], 
                c)
            })
        };
        a.interpolate = function(a, b) {
            return b.replace(/\$\{([^{}]*)\}/g, function(b, c) {
                var e = a[c];
                return "string" === typeof e || "number" === typeof e ? e : b
            })
        };
        a.rewriter = function(a) {
            return function(b) {
                return a[b] || b
            }
        };
        a.extend(a, {max: Math.max,min: Math.min});
        a.once = function(b) {
            if (b.isOnce && 3 > arguments.length)
                return b;
            var c = !1, b = a.bind.apply(null, arguments), e = function() {
                return !c && (c = !0) && b.apply(null, arguments)
            };
            e.isOnce = !0;
            e.actual = b;
            return e
        };
        a.ms = function() {
            return new Date - a.get("started")
        };
        a.param = function(a) {
            var b;
            return (b = c.location.href.match("\\bkx" + a + "(?:=|\\b)([^&#]*)")) && (b[1] || !0)
        };
        a.eachHash = a.each;
        a.mapHash = function(b, c, e) {
            var g = {};
            a.eachHash(b, function(a, i) {
                var m = c.call(e, a, i, b);
                g[m[0]] = m[1]
            });
            return g
        };
        a.anyHash = a.any;
        a.findHash = a.find;
        a.keys = function(b) {
            return a.map(b, function(a) {
                return a
            })
        };
        a.values = function(b) {
            return a.map(b, function(a, b) {
                return b
            })
        };
        a.say = function() {
        };
        a.property = function(a) {
            var b = function(a) {
                return arguments.length ? b.set(a) : b.get()
            };
            b.get = a.get;
            b.set = a.set;
            a.value && b.set(a.value);
            return b
        };
        a.attributes = function(b) {
            var c = function(b, d) {
                var e = arguments.length;
                return 0 === e ? c.all() : !a.isString(b) ? c.set(b) : 1 === e ? c.get(b) : c.set(b, d)
            };
            c.get = b.get;
            c.all = b.all;
            c.set = function(c, e) {
                return 1 === arguments.length ? a.each(c, b.set) : b.set(c, e)
            };
            b.values && c.set(b.values);
            return c
        };
        a.range = function(a, b, c) {
            1 >= arguments.length && (b = a || 0, a = 0);
            for (var c = arguments[2] || 1, e = Math.max(Math.ceil((b - a) / c), 0), g = 0, i = Array(e); g < e; )
                i[g++] = a, a += c;
            return i
        };
        a.deref = a.dereference = function(b, e) {
            1 === arguments.length && 
            (e = b, b = c);
            try {
                return a.reduce(e.split("."), function(a, b) {
                    return a[b]
                }, b)
            } catch (g) {
            }
        };
        a.sum = function(b) {
            a.isArray(b) || (b = a.toArray(arguments));
            return a.reduce(b, function(a, b) {
                return a + b
            }, 0)
        };
        a.yes = function() {
            return !0
        };
        a.isConfigValueTrue = function(a) {
            return !!a && /^(?:true|1)$/.test(String(a))
        };
        a.kruxDomain = function(a) {
            a = String(a).replace(/:\d+$/, "");
            return /(?:\d{1,3}\.){3}\d{1,3}/.test(a) ? "" : a.replace(/.*?((?:(^|\.)[^\.]+){1,2}(?:\.com)?)$/, "$1").replace(/^\./, "")
        };
        a.existy = function(b) {
            return null !== 
            b && b !== a.UNDEFINED
        };
        a.matchAll = function(b, c) {
            return a.all(a.toArray(arguments).slice(1), function(c) {
                return a.isFunction(c.test) ? c.test(b) : -1 !== b.indexOf(c)
            })
        }
    });
    m("version", function(b) {
        b.version = "5.29.18.5";
        b.commit = "baf420deddffcfc23daad352f804746b83dc14dc"
    });
    m("x-frame", function(b, e, c) {
        var a = e("util"), g = e("dom"), i = e("json").JSON, d = g.d2on, f = c.location.origin, j = b.isFramed = function() {
            return c.top !== c
        }, k = b.send = function(b, c, d) {
            if (a.isFunction(b.postMessage))
                try {
                    "document" in b && b.postMessage(i.stringify(c), 
                    d)
                } catch (e) {
                }
        };
        b.broadcast = function(b, d) {
            var d = a.defaults(d || {}, {container: !0,domain: f,self: !1}), e = j() ? c.parent : c;
            d.container && (j() || d.self) && k(e, b, d.domain);
            for (var g = 0, e = e.frames, i = e.length; g < i; ++g)
                (e[g] !== c || d.self) && k(e[g], b, d.domain)
        };
        b.listen = function(b, e) {
            var g = a.defaults(e || {}, {origin: f,strict: !0,win: c.window});
            return d(g.win, "message", function(c) {
                if (!g.strict || 0 === String(c.origin || "").indexOf(g.origin))
                    b.call(this, {data: a.isString(c.data) ? i.parse(c.data) : c.data,event: c})
            })
        };
        b.init = function(a) {
            f = 
            a
        }
    });
    z("index")
})();

