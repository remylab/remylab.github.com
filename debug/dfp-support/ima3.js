 // Copyright 2011 Google Inc. All Rights Reserved.
(function() {
    var g, l = this, p = function(a) {
        return void 0 !== a
    }, q = function(a, b, c) {
        a = a.split(".");
        c = c || l;
        a[0] in c || !c.execScript || c.execScript("var " + a[0]);
        for (var d; a.length && (d = a.shift()); )
            !a.length && p(b) ? c[d] = b : c[d] ? c = c[d] : c = c[d] = {}
    }, aa = function(a, b) {
        for (var c = a.split("."), d = b || l, e; e = c.shift(); )
            if (null != d[e])
                d = d[e];
            else
                return null;
        return d
    }, ba = function(a) {
        var b = typeof a;
        if ("object" == b)
            if (a) {
                if (a instanceof Array)
                    return "array";
                if (a instanceof Object)
                    return b;
                var c = Object.prototype.toString.call(a);
                if ("[object Window]" == 
                c)
                    return "object";
                if ("[object Array]" == c || "number" == typeof a.length && "undefined" != typeof a.splice && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("splice"))
                    return "array";
                if ("[object Function]" == c || "undefined" != typeof a.call && "undefined" != typeof a.propertyIsEnumerable && !a.propertyIsEnumerable("call"))
                    return "function"
            } else
                return "null";
        else if ("function" == b && "undefined" == typeof a.call)
            return "object";
        return b
    }, r = function(a) {
        return "array" == ba(a)
    }, ca = function(a) {
        var b = ba(a);
        return "array" == 
        b || "object" == b && "number" == typeof a.length
    }, t = function(a) {
        return "string" == typeof a
    }, da = function(a) {
        return "number" == typeof a
    }, ea = function(a) {
        return "function" == ba(a)
    }, fa = function(a) {
        var b = typeof a;
        return "object" == b && null != a || "function" == b
    }, ga = function(a, b, c) {
        return a.call.apply(a.bind, arguments)
    }, ha = function(a, b, c) {
        if (!a)
            throw Error();
        if (2 < arguments.length) {
            var d = Array.prototype.slice.call(arguments, 2);
            return function() {
                var c = Array.prototype.slice.call(arguments);
                Array.prototype.unshift.apply(c, d);
                return a.apply(b, 
                c)
            }
        }
        return function() {
            return a.apply(b, arguments)
        }
    }, u = function(a, b, c) {
        u = Function.prototype.bind && -1 != Function.prototype.bind.toString().indexOf("native code") ? ga : ha;
        return u.apply(null, arguments)
    }, ia = function(a, b) {
        var c = Array.prototype.slice.call(arguments, 1);
        return function() {
            var b = c.slice();
            b.push.apply(b, arguments);
            return a.apply(this, b)
        }
    }, ja = Date.now || function() {
        return +new Date
    }, v = function(a, b) {
        function c() {
        }
        c.prototype = b.prototype;
        a.T = b.prototype;
        a.prototype = new c;
        a.sd = function(a, c, f) {
            return b.prototype[c].apply(a, 
            Array.prototype.slice.call(arguments, 2))
        }
    };
    Function.prototype.bind = Function.prototype.bind || function(a, b) {
        if (1 < arguments.length) {
            var c = Array.prototype.slice.call(arguments, 1);
            c.unshift(this, a);
            return u.apply(null, c)
        }
        return u(this, a)
    };
    var ka;
    var la = function(a) {
        return /^[\s\xa0]*$/.test(a)
    }, ma = String.prototype.trim ? function(a) {
        return a.trim()
    } : function(a) {
        return a.replace(/^[\s\xa0]+|[\s\xa0]+$/g, "")
    }, ua = function(a) {
        if (!na.test(a))
            return a;
        -1 != a.indexOf("&") && (a = a.replace(oa, "&amp;"));
        -1 != a.indexOf("<") && (a = a.replace(pa, "&lt;"));
        -1 != a.indexOf(">") && (a = a.replace(qa, "&gt;"));
        -1 != a.indexOf('"') && (a = a.replace(ra, "&quot;"));
        -1 != a.indexOf("'") && (a = a.replace(sa, "&#39;"));
        -1 != a.indexOf("\x00") && (a = a.replace(ta, "&#0;"));
        return a
    }, oa = /&/g, pa = /</g, 
    qa = />/g, ra = /"/g, sa = /'/g, ta = /\x00/g, na = /[\x00&<>"']/, w = function(a, b) {
        return -1 != a.toLowerCase().indexOf(b.toLowerCase())
    }, va = function(a) {
        return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, "\\$1").replace(/\x08/g, "\\x08")
    }, wa = function(a) {
        return null == a ? "" : String(a)
    }, ya = function(a, b) {
        for (var c = 0, d = ma(String(a)).split("."), e = ma(String(b)).split("."), f = Math.max(d.length, e.length), h = 0; 0 == c && h < f; h++) {
            var k = d[h] || "", n = e[h] || "", m = RegExp("(\\d*)(\\D*)", "g"), s = RegExp("(\\d*)(\\D*)", "g");
            do {
                var F = m.exec(k) || 
                ["", "", ""], C = s.exec(n) || ["", "", ""];
                if (0 == F[0].length && 0 == C[0].length)
                    break;
                c = xa(0 == F[1].length ? 0 : parseInt(F[1], 10), 0 == C[1].length ? 0 : parseInt(C[1], 10)) || xa(0 == F[2].length, 0 == C[2].length) || xa(F[2], C[2])
            } while (0 == c)
        }
        return c
    }, xa = function(a, b) {
        return a < b ? -1 : a > b ? 1 : 0
    }, za = 2147483648 * Math.random() | 0, Aa = function() {
        return "transform".replace(/\-([a-z])/g, function(a, b) {
            return b.toUpperCase()
        })
    }, Ca = function(a) {
        var b = t(void 0) ? va(void 0) : "\\s";
        return a.replace(new RegExp("(^" + (b ? "|[" + b + "]+" : "") + ")([a-z])", "g"), 
        function(a, b, e) {
            return b + e.toUpperCase()
        })
    };
    var Da = function(a) {
        Da[" "](a);
        return a
    };
    Da[" "] = function() {
    };
    var Ea = function(a, b) {
        try {
            return Da(a[b]), !0
        } catch (c) {
        }
        return !1
    };
    var Fa = function(a) {
        try {
            return !!a && null != a.location.href && Ea(a, "foo")
        } catch (b) {
            return !1
        }
    };
    var Ga = document, x = window;
    var Ha = function(a) {
        var b = a.toString();
        a.name && -1 == b.indexOf(a.name) && (b += ": " + a.name);
        a.message && -1 == b.indexOf(a.message) && (b += ": " + a.message);
        if (a.stack) {
            a = a.stack;
            var c = b;
            try {
                -1 == a.indexOf(c) && (a = c + "\n" + a);
                for (var d; a != d; )
                    d = a, a = a.replace(/((https?:\/..*\/)[^\/:]*:\d+(?:.|\n)*)\2/, "$1");
                b = a.replace(/\n */g, "\n")
            } catch (e) {
                b = c
            }
        }
        return b
    };
    var Ia = function(a, b) {
        for (var c in a)
            Object.prototype.hasOwnProperty.call(a, c) && b.call(null, a[c], c, a)
    }, Ka = function(a) {
        if (!a)
            return !1;
        var b = !0;
        Ia(Ja.prototype, function(c, d) {
            b && d in a && typeof c == typeof a[d] || (b = !1)
        });
        return b
    };
    var La = !!window.g, Ma = La && window.parent || window, Na = function() {
        if (La && !Fa(Ma)) {
            for (var a = "." + Ga.domain; 2 < a.split(".").length && !Fa(Ma); )
                Ga.domain = a = a.substr(a.indexOf(".") + 1), Ma = window.parent;
            Fa(Ma) || (Ma = window)
        }
        return Ma
    };
    var Oa = Array.prototype, Pa = function(a, b) {
        if (t(a))
            return t(b) && 1 == b.length ? a.indexOf(b, 0) : -1;
        for (var c = 0; c < a.length; c++)
            if (c in a && a[c] === b)
                return c;
        return -1
    }, y = function(a, b, c) {
        for (var d = a.length, e = t(a) ? a.split("") : a, f = 0; f < d; f++)
            f in e && b.call(c, e[f], f, a)
    }, Qa = function(a, b, c) {
        for (var d = a.length, e = [], f = 0, h = t(a) ? a.split("") : a, k = 0; k < d; k++)
            if (k in h) {
                var n = h[k];
                b.call(c, n, k, a) && (e[f++] = n)
            }
        return e
    }, Ra = function(a, b, c) {
        for (var d = a.length, e = Array(d), f = t(a) ? a.split("") : a, h = 0; h < d; h++)
            h in f && (e[h] = b.call(c, f[h], 
            h, a));
        return e
    }, Sa = function(a, b, c) {
        for (var d = a.length, e = t(a) ? a.split("") : a, f = 0; f < d; f++)
            if (f in e && b.call(c, e[f], f, a))
                return !0;
        return !1
    }, Ua = function(a, b, c) {
        b = Ta(a, b, c);
        return 0 > b ? null : t(a) ? a.charAt(b) : a[b]
    }, Ta = function(a, b, c) {
        for (var d = a.length, e = t(a) ? a.split("") : a, f = 0; f < d; f++)
            if (f in e && b.call(c, e[f], f, a))
                return f;
        return -1
    }, Wa = function() {
        var a = Va;
        if (!r(a))
            for (var b = a.length - 1; 0 <= b; b--)
                delete a[b];
        a.length = 0
    }, Xa = function(a) {
        return Oa.concat.apply(Oa, arguments)
    }, Ya = function(a) {
        var b = a.length;
        if (0 < b) {
            for (var c = 
            Array(b), d = 0; d < b; d++)
                c[d] = a[d];
            return c
        }
        return []
    }, Za = function(a, b) {
        for (var c = 1; c < arguments.length; c++) {
            var d = arguments[c], e;
            if (r(d) || (e = ca(d)) && Object.prototype.hasOwnProperty.call(d, "callee"))
                a.push.apply(a, d);
            else if (e)
                for (var f = a.length, h = d.length, k = 0; k < h; k++)
                    a[f + k] = d[k];
            else
                a.push(d)
        }
    }, $a = function(a, b, c) {
        return 2 >= arguments.length ? Oa.slice.call(a, b) : Oa.slice.call(a, b, c)
    }, ab = function(a) {
        for (var b = [], c = 0; c < arguments.length; c++) {
            var d = arguments[c];
            if (r(d))
                for (var e = 0; e < d.length; e += 8192)
                    for (var f = 
                    ab.apply(null, $a(d, e, e + 8192)), h = 0; h < f.length; h++)
                        b.push(f[h]);
            else
                b.push(d)
        }
        return b
    };
    var Ja = function(a) {
        this.b = {};
        for (var b = 0, c = arguments.length; b < c; ++b)
            this.b[arguments[b]] = ""
    };
    Ja.prototype.yb = function(a) {
        return this.b.hasOwnProperty(a) ? this.b[a] : ""
    };
    Ja.prototype.geil = Ja.prototype.yb;
    var bb = !0, cb = {}, fb = function(a, b, c, d) {
        var e = db, f, h = bb;
        try {
            f = b()
        } catch (k) {
            try {
                var n = Ha(k);
                b = "";
                k.fileName && (b = k.fileName);
                var m = -1;
                k.lineNumber && (m = k.lineNumber);
                h = e(a, n, b, m, c)
            } catch (s) {
                try {
                    var F = Ha(s);
                    a = "";
                    s.fileName && (a = s.fileName);
                    c = -1;
                    s.lineNumber && (c = s.lineNumber);
                    db("pAR", F, a, c, void 0, void 0)
                } catch (C) {
                    eb({context: "mRE",msg: C.toString() + "\n" + (C.stack || "")}, void 0)
                }
            }
            if (!h)
                throw k;
        }finally {
            if (d)
                try {
                    d()
                } catch (Ba) {
                }
        }
        return f
    }, db = function(a, b, c, d, e, f) {
        var h = {};
        if (e)
            try {
                e(h)
            } catch (k) {
            }
        h.context = a;
        h.msg = 
        b.substring(0, 512);
        c && (h.file = c);
        0 < d && (h.line = d.toString());
        h.url = Ga.URL.substring(0, 512);
        h.ref = Ga.referrer.substring(0, 512);
        gb(h);
        eb(h, f);
        return bb
    }, eb = function(a, b) {
        try {
            if (Math.random() < (b || .01)) {
                var c = "/pagead/gen_204?id=jserror" + hb(a), d = "http" + ("http:" == x.location.protocol ? "" : "s") + "://pagead2.googlesyndication.com" + c, c = d = d.substring(0, 2E3);
                x.google_image_requests || (x.google_image_requests = []);
                var e = x.document.createElement("img");
                e.src = c;
                x.google_image_requests.push(e)
            }
        } catch (f) {
        }
    }, gb = function(a) {
        var b = 
        a || {};
        Ia(cb, function(a, d) {
            b[d] = x[a]
        })
    }, ib = function(a, b, c, d, e) {
        return function() {
            var f = arguments;
            return fb(a, function() {
                return b.apply(c, f)
            }, d, e)
        }
    }, jb = function(a, b) {
        return ib(a, b, void 0, void 0, void 0)
    }, hb = function(a) {
        var b = "";
        Ia(a, function(a, d) {
            if (0 === a || a)
                b += "&" + d + "=" + ("function" == typeof encodeURIComponent ? encodeURIComponent(a) : escape(a))
        });
        return b
    };
    var kb = function(a) {
        for (var b = a, c = 0; a != a.parent; )
            a = a.parent, c++, Fa(a) && (b = a);
        return b
    };
    var nb = function(a) {
        this.S = a;
        z(this, 3, null);
        z(this, 4, 0);
        z(this, 5, 0);
        z(this, 6, 0);
        z(this, 15, 0);
        z(this, 7, "C" == Na().google_pstate_rc_expt ? (new Date).getTime() : Math.floor(Math.random() * Math.pow(2, 43)));
        z(this, 8, {});
        z(this, 9, {});
        z(this, 10, {});
        z(this, 11, []);
        z(this, 12, 0);
        z(this, 16, null);
        a = Na();
        if (lb(a)) {
            var b;
            b = a.b || {};
            b = this.S[mb(14)] = b;
            a.b = b
        } else
            z(this, 14, {})
    }, ob = {}, lb = function(a) {
        return "E" == a.google_pstate_expt || "EU" == a.google_pstate_expt
    }, qb = function() {
        var a = Na();
        if (lb(a)) {
            var b;
            t: {
                var c, d;
                try {
                    var e = 
                    a.google_pstate;
                    if (c = pb(e)) {
                        e.C = (e.C || 0) + 1;
                        b = e;
                        break t
                    }
                } catch (f) {
                    d = Ha(f)
                }
                eb({context: "ps::eg",msg: d,L: p(c) ? c ? 1 : 0 : 2,url: a.location.href}, 1);
                b = a.google_pstate = new nb({})
            }
            return b
        }
        b = La ? "google_persistent_state_async" : "google_persistent_state";
        if (ob[b])
            return ob[b];
        c = "google_persistent_state_async" == b ? {} : a;
        d = a[b];
        return pb(d) ? ob[b] = d : a[b] = ob[b] = new nb(c)
    }, pb = function(a) {
        return "object" == typeof a && "object" == typeof a.S
    }, mb = function(a) {
        switch (a) {
            case 3:
                return "google_exp_persistent";
            case 4:
                return "google_num_sdo_slots";
            case 5:
                return "google_num_0ad_slots";
            case 6:
                return "google_num_ad_slots";
            case 7:
                return "google_correlator";
            case 8:
                return "google_prev_ad_formats_by_region";
            case 9:
                return "google_prev_ad_slotnames_by_region";
            case 10:
                return "google_num_slots_by_channel";
            case 11:
                return "google_viewed_host_channels";
            case 12:
                return "google_num_slot_to_show";
            case 14:
                return "gaGlobal";
            case 15:
                return "google_num_reactive_ad_slots";
            case 16:
                return "google_persistent_language"
        }
        throw Error("unexpected state");
    }, z = function(a, b, c) {
        a = a.S;
        b = mb(b);
        void 0 === a[b] && (a[b] = c)
    };
    var rb, sb = function() {
        if (rb)
            return !0;
        var a;
        a = qb();
        var b = mb(3);
        return (a = a.S[b]) && a && ("object" == typeof a || "function" == typeof a) && Ka(a) ? (rb = a, !0) : !1
    };
    var ub = "StopIteration" in l ? l.StopIteration : Error("StopIteration"), vb = function() {
    };
    vb.prototype.next = function() {
        throw ub;
    };
    vb.prototype.wa = function() {
        return this
    };
    var wb = function(a) {
        if (a instanceof vb)
            return a;
        if ("function" == typeof a.wa)
            return a.wa(!1);
        if (ca(a)) {
            var b = 0, c = new vb;
            c.next = function() {
                for (; ; ) {
                    if (b >= a.length)
                        throw ub;
                    if (b in a)
                        return a[b++];
                    b++
                }
            };
            return c
        }
        throw Error("Not implemented");
    }, xb = function(a, b, c) {
        if (ca(a))
            try {
                y(a, b, c)
            } catch (d) {
                if (d !== ub)
                    throw d;
            }
        else {
            a = wb(a);
            try {
                for (; ; )
                    b.call(c, a.next(), void 0, a)
            } catch (e) {
                if (e !== ub)
                    throw e;
            }
        }
    };
    var yb = function(a, b, c) {
        for (var d in a)
            b.call(c, a[d], d, a)
    }, Ab = function(a) {
        var b = zb, c;
        for (c in b)
            if (a.call(void 0, b[c], c, b))
                return !0;
        return !1
    }, Bb = function(a) {
        var b = [], c = 0, d;
        for (d in a)
            b[c++] = a[d];
        return b
    }, Cb = function(a) {
        var b = [], c = 0, d;
        for (d in a)
            b[c++] = d;
        return b
    }, Eb = function(a) {
        var b = Db, c;
        for (c in b)
            if (a.call(void 0, b[c], c, b))
                return c
    }, Fb = function(a) {
        var b = {}, c;
        for (c in a)
            b[c] = a[c];
        return b
    }, Gb = "constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" "), 
    Hb = function(a, b) {
        for (var c, d, e = 1; e < arguments.length; e++) {
            d = arguments[e];
            for (c in d)
                a[c] = d[c];
            for (var f = 0; f < Gb.length; f++)
                c = Gb[f], Object.prototype.hasOwnProperty.call(d, c) && (a[c] = d[c])
        }
    };
    var A = function(a, b) {
        this.g = {};
        this.b = [];
        this.j = this.h = 0;
        var c = arguments.length;
        if (1 < c) {
            if (c % 2)
                throw Error("Uneven number of arguments");
            for (var d = 0; d < c; d += 2)
                Ib(this, arguments[d], arguments[d + 1])
        } else if (a) {
            a instanceof A ? (c = a.ka(), d = a.ba()) : (c = Cb(a), d = Bb(a));
            for (var e = 0; e < c.length; e++)
                Ib(this, c[e], d[e])
        }
    };
    g = A.prototype;
    g.ga = function() {
        return this.h
    };
    g.ba = function() {
        Jb(this);
        for (var a = [], b = 0; b < this.b.length; b++)
            a.push(this.g[this.b[b]]);
        return a
    };
    g.ka = function() {
        Jb(this);
        return this.b.concat()
    };
    g.isEmpty = function() {
        return 0 == this.h
    };
    g.clear = function() {
        this.g = {};
        this.j = this.h = this.b.length = 0
    };
    var Lb = function(a, b) {
        Kb(a.g, b) && (delete a.g[b], a.h--, a.j++, a.b.length > 2 * a.h && Jb(a))
    }, Jb = function(a) {
        if (a.h != a.b.length) {
            for (var b = 0, c = 0; b < a.b.length; ) {
                var d = a.b[b];
                Kb(a.g, d) && (a.b[c++] = d);
                b++
            }
            a.b.length = c
        }
        if (a.h != a.b.length) {
            for (var e = {}, c = b = 0; b < a.b.length; )
                d = a.b[b], Kb(e, d) || (a.b[c++] = d, e[d] = 1), b++;
            a.b.length = c
        }
    };
    A.prototype.get = function(a, b) {
        return Kb(this.g, a) ? this.g[a] : b
    };
    var Ib = function(a, b, c) {
        Kb(a.g, b) || (a.h++, a.b.push(b), a.j++);
        a.g[b] = c
    };
    A.prototype.forEach = function(a, b) {
        for (var c = this.ka(), d = 0; d < c.length; d++) {
            var e = c[d], f = this.get(e);
            a.call(b, f, e, this)
        }
    };
    A.prototype.clone = function() {
        return new A(this)
    };
    A.prototype.wa = function(a) {
        Jb(this);
        var b = 0, c = this.b, d = this.g, e = this.j, f = this, h = new vb;
        h.next = function() {
            for (; ; ) {
                if (e != f.j)
                    throw Error("The map has changed since the iterator was created");
                if (b >= c.length)
                    throw ub;
                var h = c[b++];
                return a ? h : d[h]
            }
        };
        return h
    };
    var Kb = function(a, b) {
        return Object.prototype.hasOwnProperty.call(a, b)
    };
    var B;
    t: {
        var Mb = l.navigator;
        if (Mb) {
            var Nb = Mb.userAgent;
            if (Nb) {
                B = Nb;
                break t
            }
        }
        B = ""
    }
    var D = function(a) {
        return -1 != B.indexOf(a)
    };
    var Ob, Pb, Qb = D("Opera") || D("OPR"), E = D("Trident") || D("MSIE"), Rb = D("Gecko") && !w(B, "WebKit") && !(D("Trident") || D("MSIE")), Sb = w(B, "WebKit"), Tb = B;
    Ob = !!Tb && -1 != Tb.indexOf("Android");
    Pb = !!Tb && -1 != Tb.indexOf("iPhone");
    var Ub = !!Tb && -1 != Tb.indexOf("iPad"), Vb = function() {
        var a = l.document;
        return a ? a.documentMode : void 0
    }, Wb = function() {
        var a = "", b;
        if (Qb && l.opera)
            return a = l.opera.version, ea(a) ? a() : a;
        Rb ? b = /rv\:([^\);]+)(\)|;)/ : E ? b = /\b(?:MSIE|rv)[: ]([^\);]+)(\)|;)/ : Sb && (b = /WebKit\/(\S+)/);
        b && (a = (a = b.exec(B)) ? a[1] : "");
        return E && (b = Vb(), b > parseFloat(a)) ? String(b) : a
    }(), Xb = {}, G = function(a) {
        return Xb[a] || (Xb[a] = 0 <= ya(Wb, a))
    }, Yb = l.document, Zb = Yb && E ? Vb() || ("CSS1Compat" == Yb.compatMode ? parseInt(Wb, 10) : 5) : void 0;
    var $b = /^(?:([^:/?#.]+):)?(?:\/\/(?:([^/?#]*)@)?([^/#?]*?)(?::([0-9]+))?(?=[/#?]|$))?([^?#]+)?(?:\?([^#]*))?(?:#(.*))?$/, bc = function(a) {
        if (ac) {
            ac = !1;
            var b = l.location;
            if (b) {
                var c = b.href;
                if (c && (c = (c = bc(c)[3] || null) ? decodeURI(c) : c) && c != b.hostname)
                    throw ac = !0, Error();
            }
        }
        return a.match($b)
    }, ac = Sb, cc = /#|$/;
    var dc = function(a, b) {
        var c;
        a instanceof dc ? (this.fa = p(b) ? b : a.fa, ec(this, a.ea), this.Fa = a.Fa, this.aa = a.aa, fc(this, a.Ea), this.ua = a.ua, gc(this, a.b.clone()), this.Da = a.Da) : a && (c = bc(String(a))) ? (this.fa = !!b, ec(this, c[1] || "", !0), this.Fa = hc(c[2] || ""), this.aa = hc(c[3] || "", !0), fc(this, c[4]), this.ua = hc(c[5] || "", !0), gc(this, c[6] || "", !0), this.Da = hc(c[7] || "")) : (this.fa = !!b, this.b = new ic(null, 0, this.fa))
    };
    g = dc.prototype;
    g.ea = "";
    g.Fa = "";
    g.aa = "";
    g.Ea = null;
    g.ua = "";
    g.Da = "";
    g.fa = !1;
    g.toString = function() {
        var a = [], b = this.ea;
        b && a.push(jc(b, kc, !0), ":");
        if (b = this.aa) {
            a.push("//");
            var c = this.Fa;
            c && a.push(jc(c, kc, !0), "@");
            a.push(encodeURIComponent(String(b)).replace(/%25([0-9a-fA-F]{2})/g, "%$1"));
            b = this.Ea;
            null != b && a.push(":", String(b))
        }
        if (b = this.ua)
            this.aa && "/" != b.charAt(0) && a.push("/"), a.push(jc(b, "/" == b.charAt(0) ? lc : mc, !0));
        (b = this.b.toString()) && a.push("?", b);
        (b = this.Da) && a.push("#", jc(b, nc));
        return a.join("")
    };
    g.clone = function() {
        return new dc(this)
    };
    var ec = function(a, b, c) {
        a.ea = c ? hc(b, !0) : b;
        a.ea && (a.ea = a.ea.replace(/:$/, ""))
    }, oc = function(a) {
        return a.aa
    }, fc = function(a, b) {
        if (b) {
            b = Number(b);
            if (isNaN(b) || 0 > b)
                throw Error("Bad port number " + b);
            a.Ea = b
        } else
            a.Ea = null
    }, gc = function(a, b, c) {
        b instanceof ic ? (a.b = b, pc(a.b, a.fa)) : (c || (b = jc(b, qc)), a.b = new ic(b, 0, a.fa))
    }, hc = function(a, b) {
        return a ? b ? decodeURI(a) : decodeURIComponent(a) : ""
    }, jc = function(a, b, c) {
        return t(a) ? (a = encodeURI(a).replace(b, rc), c && (a = a.replace(/%25([0-9a-fA-F]{2})/g, "%$1")), a) : null
    }, rc = function(a) {
        a = 
        a.charCodeAt(0);
        return "%" + (a >> 4 & 15).toString(16) + (a & 15).toString(16)
    }, kc = /[#\/\?@]/g, mc = /[\#\?:]/g, lc = /[\#\?]/g, qc = /[\#\?@]/g, nc = /#/g, ic = function(a, b, c) {
        this.h = a || null;
        this.j = !!c
    }, tc = function(a) {
        if (!a.b && (a.b = new A, a.g = 0, a.h))
            for (var b = a.h.split("&"), c = 0; c < b.length; c++) {
                var d = b[c].indexOf("="), e = null, f = null;
                0 <= d ? (e = b[c].substring(0, d), f = b[c].substring(d + 1)) : e = b[c];
                e = decodeURIComponent(e.replace(/\+/g, " "));
                e = sc(a, e);
                d = a;
                f = f ? decodeURIComponent(f.replace(/\+/g, " ")) : "";
                tc(d);
                d.h = null;
                var e = sc(d, e), 
                h = d.b.get(e);
                h || Ib(d.b, e, h = []);
                h.push(f);
                d.g++
            }
    };
    ic.prototype.b = null;
    ic.prototype.g = null;
    ic.prototype.ga = function() {
        tc(this);
        return this.g
    };
    var uc = function(a, b) {
        tc(a);
        b = sc(a, b);
        Kb(a.b.g, b) && (a.h = null, a.g -= a.b.get(b).length, Lb(a.b, b))
    };
    ic.prototype.clear = function() {
        this.b = this.h = null;
        this.g = 0
    };
    ic.prototype.isEmpty = function() {
        tc(this);
        return 0 == this.g
    };
    var vc = function(a, b) {
        tc(a);
        b = sc(a, b);
        return Kb(a.b.g, b)
    };
    g = ic.prototype;
    g.ka = function() {
        tc(this);
        for (var a = this.b.ba(), b = this.b.ka(), c = [], d = 0; d < b.length; d++)
            for (var e = a[d], f = 0; f < e.length; f++)
                c.push(b[d]);
        return c
    };
    g.ba = function(a) {
        tc(this);
        var b = [];
        if (t(a))
            vc(this, a) && (b = Xa(b, this.b.get(sc(this, a))));
        else {
            a = this.b.ba();
            for (var c = 0; c < a.length; c++)
                b = Xa(b, a[c])
        }
        return b
    };
    g.get = function(a, b) {
        var c = a ? this.ba(a) : [];
        return 0 < c.length ? String(c[0]) : b
    };
    g.toString = function() {
        if (this.h)
            return this.h;
        if (!this.b)
            return "";
        for (var a = [], b = this.b.ka(), c = 0; c < b.length; c++)
            for (var d = b[c], e = encodeURIComponent(String(d)), d = this.ba(d), f = 0; f < d.length; f++) {
                var h = e;
                "" !== d[f] && (h += "=" + encodeURIComponent(String(d[f])));
                a.push(h)
            }
        return this.h = a.join("&")
    };
    g.clone = function() {
        var a = new ic;
        a.h = this.h;
        this.b && (a.b = this.b.clone(), a.g = this.g);
        return a
    };
    var sc = function(a, b) {
        var c = String(b);
        a.j && (c = c.toLowerCase());
        return c
    }, pc = function(a, b) {
        b && !a.j && (tc(a), a.h = null, a.b.forEach(function(a, b) {
            var e = b.toLowerCase();
            b != e && (uc(this, b), uc(this, e), 0 < a.length && (this.h = null, Ib(this.b, sc(this, e), Ya(a)), this.g += a.length))
        }, a));
        a.j = b
    };
    var wc = function(a) {
        var b;
        if (sb())
            b = rb;
        else {
            b = qb();
            var c = new Ja(2, 1, 3, 4, 7, 10, 12, 13, 14, 16, 17, 19, 20, 23, 24, 26, 29);
            b = rb = b.S[mb(3)] = c
        }
        b = b.yb(10);
        if ("317150305" == b || "317150306" == b)
            return null;
        if (b = Na().h)
            if (c = b[3], a && (c = b[4]), c)
                return c + "";
        return null
    };
    function xc(a, b) {
        var c = wc();
        return c ? c : b ? a.referrer : a.URL
    }
    ;
    var H = function(a, b, c) {
        this.j = b;
        this.b = c;
        this.h = a
    };
    g = H.prototype;
    g.Qa = function() {
        return this.g
    };
    g.Ab = function() {
        return this.j
    };
    g.zb = function() {
        return this.b
    };
    g.qc = function() {
        return 1E3 > this.b ? this.b : 900
    };
    g.rc = function() {
        return this.h
    };
    g.toString = function() {
        return "AdError " + this.zb() + ": " + this.Ab() + (null != this.Qa() ? " Caused by: " + this.Qa() : "")
    };
    var yc = function() {
        this.P = this.P;
        this.o = this.o
    };
    yc.prototype.P = !1;
    yc.prototype.G = function() {
        this.P || (this.P = !0, this.B())
    };
    var zc = function(a, b) {
        a.o || (a.o = []);
        a.o.push(p(void 0) ? u(b, void 0) : b)
    };
    yc.prototype.B = function() {
        if (this.o)
            for (; this.o.length; )
                this.o.shift()()
    };
    var Ac = function(a) {
        a && "function" == typeof a.G && a.G()
    };
    var I = function(a, b) {
        this.type = a;
        this.b = this.target = b;
        this.wb = !0
    };
    I.prototype.G = function() {
    };
    I.prototype.h = function() {
        this.wb = !1
    };
    var Bc = function(a, b) {
        I.call(this, "adError");
        this.g = a;
        this.j = b ? b : null
    };
    v(Bc, I);
    Bc.prototype.k = function() {
        return this.g
    };
    Bc.prototype.o = function() {
        return this.j
    };
    var J = function() {
        this.h = "always";
        this.k = 4;
        this.b = !1;
        this.g = !0;
        this.o = !1;
        this.j = "en"
    }, Cc = "af am ar bg bn ca cs da de el en en_gb es es_419 et eu fa fi fil fr fr_ca gl gu he hi hr hu id in is it iw ja kn ko lt lv ml mr ms nb nl no pl pt_br pt_pt ro ru sk sl sr sv sw ta te th tr uk ur vi zh_cn zh_hk zh_tw zu".split(" ");
    g = J.prototype;
    g.cd = function(a) {
        this.h = a
    };
    g.$a = function() {
        return this.h
    };
    g.dd = function(a) {
        this.k = a
    };
    g.ab = function() {
        return this.k
    };
    g.ed = function(a) {
        this.l = a
    };
    g.bb = function() {
        return this.l
    };
    g.od = function(a) {
        this.b = a
    };
    g.bd = function(a) {
        this.g = a
    };
    g.cb = function() {
        return this.g
    };
    g.nd = function(a) {
        this.o = a
    };
    g.ta = function() {
        return this.o
    };
    g.md = function(a) {
        if (null != a) {
            a = a.toLowerCase().replace("-", "_");
            if (!(0 <= Pa(Cc, a) || (a = (a = a.match(/^\w{2,3}([-_]|$)/)) ? a[0].replace(/[_-]/g, "") : "", 0 <= Pa(Cc, a))))
                return;
            this.j = a
        }
    };
    g.Wa = function() {
        return this.j
    };
    var Dc = new J;
    var Db = {Cb: "start",FIRST_QUARTILE: "firstquartile",MIDPOINT: "midpoint",THIRD_QUARTILE: "thirdquartile",COMPLETE: "complete",jc: "metric",Bb: "pause",lc: "resume",SKIPPED: "skip",nc: "viewable_impression",kc: "mute",mc: "unmute",FULLSCREEN: "fullscreen",ic: "exitfullscreen"}, Ec = {Qd: -1,Cb: 0,FIRST_QUARTILE: 1,MIDPOINT: 2,THIRD_QUARTILE: 3,COMPLETE: 4,jc: 5,Bb: 6,lc: 7,SKIPPED: 8,nc: 9,kc: 10,mc: 11,FULLSCREEN: 12,ic: 13};
    var K = function(a, b) {
        this.x = p(a) ? a : 0;
        this.y = p(b) ? b : 0
    };
    K.prototype.clone = function() {
        return new K(this.x, this.y)
    };
    K.prototype.floor = function() {
        this.x = Math.floor(this.x);
        this.y = Math.floor(this.y);
        return this
    };
    K.prototype.round = function() {
        this.x = Math.round(this.x);
        this.y = Math.round(this.y);
        return this
    };
    K.prototype.scale = function(a, b) {
        var c = da(b) ? b : a;
        this.x *= a;
        this.y *= c;
        return this
    };
    var L = function(a, b) {
        this.width = a;
        this.height = b
    };
    g = L.prototype;
    g.clone = function() {
        return new L(this.width, this.height)
    };
    g.isEmpty = function() {
        return !(this.width * this.height)
    };
    g.floor = function() {
        this.width = Math.floor(this.width);
        this.height = Math.floor(this.height);
        return this
    };
    g.round = function() {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this
    };
    g.scale = function(a, b) {
        var c = da(b) ? b : a;
        this.width *= a;
        this.height *= c;
        return this
    };
    var Fc = !E || E && 9 <= Zb;
    !Rb && !E || E && E && 9 <= Zb || Rb && G("1.9.1");
    E && G("9");
    var Ic = function(a) {
        return a ? new Gc(Hc(a)) : ka || (ka = new Gc)
    }, Jc = function() {
        var a = document;
        return a.querySelectorAll && a.querySelector ? a.querySelectorAll("SCRIPT") : a.getElementsByTagName("SCRIPT")
    }, Lc = function(a, b) {
        yb(b, function(b, d) {
            "style" == d ? a.style.cssText = b : "class" == d ? a.className = b : "for" == d ? a.htmlFor = b : d in Kc ? a.setAttribute(Kc[d], b) : 0 == d.lastIndexOf("aria-", 0) || 0 == d.lastIndexOf("data-", 0) ? a.setAttribute(d, b) : a[d] = b
        })
    }, Kc = {cellpadding: "cellPadding",cellspacing: "cellSpacing",colspan: "colSpan",frameborder: "frameBorder",
        height: "height",maxlength: "maxLength",role: "role",rowspan: "rowSpan",type: "type",usemap: "useMap",valign: "vAlign",width: "width"}, Mc = function(a) {
        var b = Sb || "CSS1Compat" != a.compatMode ? a.body || a.documentElement : a.documentElement;
        a = a.parentWindow || a.defaultView;
        return E && G("10") && a.pageYOffset != b.scrollTop ? new K(b.scrollLeft, b.scrollTop) : new K(a.pageXOffset || b.scrollLeft, a.pageYOffset || b.scrollTop)
    }, M = function(a) {
        return a ? a.parentWindow || a.defaultView : window
    }, Oc = function(a, b, c) {
        var d = arguments, e = document, 
        f = d[0], h = d[1];
        if (!Fc && h && (h.name || h.type)) {
            f = ["<", f];
            h.name && f.push(' name="', ua(h.name), '"');
            if (h.type) {
                f.push(' type="', ua(h.type), '"');
                var k = {};
                Hb(k, h);
                delete k.type;
                h = k
            }
            f.push(">");
            f = f.join("")
        }
        f = e.createElement(f);
        h && (t(h) ? f.className = h : r(h) ? f.className = h.join(" ") : Lc(f, h));
        2 < d.length && Nc(e, f, d);
        return f
    }, Nc = function(a, b, c) {
        function d(c) {
            c && b.appendChild(t(c) ? a.createTextNode(c) : c)
        }
        for (var e = 2; e < c.length; e++) {
            var f = c[e];
            !ca(f) || fa(f) && 0 < f.nodeType ? d(f) : y(Pc(f) ? Ya(f) : f, d)
        }
    }, Qc = function(a) {
        a && 
        a.parentNode && a.parentNode.removeChild(a)
    }, Rc = function(a, b) {
        if (a.contains && 1 == b.nodeType)
            return a == b || a.contains(b);
        if ("undefined" != typeof a.compareDocumentPosition)
            return a == b || Boolean(a.compareDocumentPosition(b) & 16);
        for (; b && a != b; )
            b = b.parentNode;
        return b == a
    }, Hc = function(a) {
        return 9 == a.nodeType ? a : a.ownerDocument || a.document
    }, Sc = function(a) {
        return a.contentWindow || M(a.contentDocument || a.contentWindow.document)
    }, Pc = function(a) {
        if (a && "number" == typeof a.length) {
            if (fa(a))
                return "function" == typeof a.item || 
                "string" == typeof a.item;
            if (ea(a))
                return "function" == typeof a.item
        }
        return !1
    }, Gc = function(a) {
        this.b = a || l.document || document
    }, Tc = function(a) {
        return Mc(a.b)
    };
    Gc.prototype.appendChild = function(a, b) {
        a.appendChild(b)
    };
    Gc.prototype.contains = Rc;
    var Uc = function(a, b, c, d) {
        this.top = a;
        this.right = b;
        this.bottom = c;
        this.left = d
    };
    g = Uc.prototype;
    g.clone = function() {
        return new Uc(this.top, this.right, this.bottom, this.left)
    };
    g.contains = function(a) {
        return this && a ? a instanceof Uc ? a.left >= this.left && a.right <= this.right && a.top >= this.top && a.bottom <= this.bottom : a.x >= this.left && a.x <= this.right && a.y >= this.top && a.y <= this.bottom : !1
    };
    g.floor = function() {
        this.top = Math.floor(this.top);
        this.right = Math.floor(this.right);
        this.bottom = Math.floor(this.bottom);
        this.left = Math.floor(this.left);
        return this
    };
    g.round = function() {
        this.top = Math.round(this.top);
        this.right = Math.round(this.right);
        this.bottom = Math.round(this.bottom);
        this.left = Math.round(this.left);
        return this
    };
    g.scale = function(a, b) {
        var c = da(b) ? b : a;
        this.left *= a;
        this.right *= a;
        this.top *= c;
        this.bottom *= c;
        return this
    };
    var Vc = function(a, b) {
        var c;
        t: {
            c = Hc(a);
            if (c.defaultView && c.defaultView.getComputedStyle && (c = c.defaultView.getComputedStyle(a, null))) {
                c = c[b] || c.getPropertyValue(b) || "";
                break t
            }
            c = ""
        }
        return c || (a.currentStyle ? a.currentStyle[b] : null) || a.style && a.style[b]
    }, Wc = function(a) {
        var b;
        try {
            b = a.getBoundingClientRect()
        } catch (c) {
            return {left: 0,top: 0,right: 0,bottom: 0}
        }
        E && a.ownerDocument.body && (a = a.ownerDocument, b.left -= a.documentElement.clientLeft + a.body.clientLeft, b.top -= a.documentElement.clientTop + a.body.clientTop);
        return b
    }, Xc = function(a) {
        if (E && !(E && 8 <= Zb))
            return a.offsetParent;
        var b = Hc(a), c = Vc(a, "position"), d = "fixed" == c || "absolute" == c;
        for (a = a.parentNode; a && a != b; a = a.parentNode)
            if (c = Vc(a, "position"), d = d && "static" == c && a != b.documentElement && a != b.body, !d && (a.scrollWidth > a.clientWidth || a.scrollHeight > a.clientHeight || "fixed" == c || "absolute" == c || "relative" == c))
                return a;
        return null
    }, Yc = function(a) {
        var b, c = Hc(a), d = Vc(a, "position"), e = Rb && c.getBoxObjectFor && !a.getBoundingClientRect && "absolute" == d && (b = c.getBoxObjectFor(a)) && 
        (0 > b.screenX || 0 > b.screenY), f = new K(0, 0), h;
        b = c ? Hc(c) : document;
        (h = !E || E && 9 <= Zb) || (h = "CSS1Compat" == Ic(b).b.compatMode);
        h = h ? b.documentElement : b.body;
        if (a == h)
            return f;
        if (a.getBoundingClientRect)
            b = Wc(a), a = Tc(Ic(c)), f.x = b.left + a.x, f.y = b.top + a.y;
        else if (c.getBoxObjectFor && !e)
            b = c.getBoxObjectFor(a), a = c.getBoxObjectFor(h), f.x = b.screenX - a.screenX, f.y = b.screenY - a.screenY;
        else {
            b = a;
            do {
                f.x += b.offsetLeft;
                f.y += b.offsetTop;
                b != a && (f.x += b.clientLeft || 0, f.y += b.clientTop || 0);
                if (Sb && "fixed" == Vc(b, "position")) {
                    f.x += c.body.scrollLeft;
                    f.y += c.body.scrollTop;
                    break
                }
                b = b.offsetParent
            } while (b && b != a);
            if (Qb || Sb && "absolute" == d)
                f.y -= c.body.offsetTop;
            for (b = a; (b = Xc(b)) && b != c.body && b != h; )
                f.x -= b.scrollLeft, Qb && "TR" == b.tagName || (f.y -= b.scrollTop)
        }
        return f
    }, Zc = /matrix\([0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, [0-9\.\-]+, ([0-9\.\-]+)p?x?, ([0-9\.\-]+)p?x?\)/;
    var $c = !E || E && 9 <= Zb, ad = E && !G("9");
    !Sb || G("528");
    Rb && G("1.9b") || E && G("8") || Qb && G("9.5") || Sb && G("528");
    Rb && !G("8") || E && G("9");
    var bd = function(a, b) {
        I.call(this, a ? a.type : "");
        this.b = this.target = null;
        this.button = this.screenY = this.screenX = this.clientY = this.clientX = 0;
        this.metaKey = this.shiftKey = this.altKey = this.ctrlKey = !1;
        this.g = this.state = null;
        if (a) {
            this.type = a.type;
            this.target = a.target || a.srcElement;
            this.b = b;
            var c = a.relatedTarget;
            c && Rb && Ea(c, "nodeName");
            this.clientX = void 0 !== a.clientX ? a.clientX : a.pageX;
            this.clientY = void 0 !== a.clientY ? a.clientY : a.pageY;
            this.screenX = a.screenX || 0;
            this.screenY = a.screenY || 0;
            this.button = a.button;
            this.ctrlKey = 
            a.ctrlKey;
            this.altKey = a.altKey;
            this.shiftKey = a.shiftKey;
            this.metaKey = a.metaKey;
            this.state = a.state;
            this.g = a;
            a.defaultPrevented && this.h()
        }
    };
    v(bd, I);
    bd.prototype.h = function() {
        bd.T.h.call(this);
        var a = this.g;
        if (a.preventDefault)
            a.preventDefault();
        else if (a.returnValue = !1, ad)
            try {
                if (a.ctrlKey || 112 <= a.keyCode && 123 >= a.keyCode)
                    a.keyCode = -1
            } catch (b) {
            }
    };
    var cd = "closure_listenable_" + (1E6 * Math.random() | 0), dd = function(a) {
        return !(!a || !a[cd])
    }, gd = 0;
    var hd = function(a, b, c, d, e) {
        this.listener = a;
        this.b = null;
        this.src = b;
        this.type = c;
        this.Aa = !!d;
        this.Ga = e;
        this.Pa = ++gd;
        this.ma = this.Ba = !1
    }, id = function(a) {
        a.ma = !0;
        a.listener = null;
        a.b = null;
        a.src = null;
        a.Ga = null
    };
    var jd = function(a) {
        this.src = a;
        this.b = {};
        this.g = 0
    }, ld = function(a, b, c, d, e, f) {
        var h = b.toString();
        b = a.b[h];
        b || (b = a.b[h] = [], a.g++);
        var k = kd(b, c, e, f);
        -1 < k ? (a = b[k], d || (a.Ba = !1)) : (a = new hd(c, a.src, h, !!e, f), a.Ba = d, b.push(a));
        return a
    }, md = function(a, b) {
        var c = b.type;
        if (!(c in a.b))
            return !1;
        var d = a.b[c], e = Pa(d, b), f;
        (f = 0 <= e) && Oa.splice.call(d, e, 1);
        f && (id(b), 0 == a.b[c].length && (delete a.b[c], a.g--));
        return f
    }, nd = function(a, b, c, d, e) {
        a = a.b[b.toString()];
        b = -1;
        a && (b = kd(a, c, d, e));
        return -1 < b ? a[b] : null
    }, kd = function(a, 
    b, c, d) {
        for (var e = 0; e < a.length; ++e) {
            var f = a[e];
            if (!f.ma && f.listener == b && f.Aa == !!c && f.Ga == d)
                return e
        }
        return -1
    };
    var od = "closure_lm_" + (1E6 * Math.random() | 0), pd = {}, qd = 0, rd = function(a, b, c, d, e) {
        if (r(b)) {
            for (var f = 0; f < b.length; f++)
                rd(a, b[f], c, d, e);
            return null
        }
        c = sd(c);
        return dd(a) ? a.r(b, c, d, e) : td(a, b, c, !1, d, e)
    }, td = function(a, b, c, d, e, f) {
        if (!b)
            throw Error("Invalid event type");
        var h = !!e, k = ud(a);
        k || (a[od] = k = new jd(a));
        c = ld(k, b, c, d, e, f);
        if (c.b)
            return c;
        d = vd();
        c.b = d;
        d.src = a;
        d.listener = c;
        a.addEventListener ? a.addEventListener(b.toString(), d, h) : a.attachEvent(wd(b.toString()), d);
        qd++;
        return c
    }, vd = function() {
        var a = xd, b = $c ? 
        function(c) {
            return a.call(b.src, b.listener, c)
        } : function(c) {
            c = a.call(b.src, b.listener, c);
            if (!c)
                return c
        };
        return b
    }, yd = function(a, b, c, d, e) {
        if (r(b)) {
            for (var f = 0; f < b.length; f++)
                yd(a, b[f], c, d, e);
            return null
        }
        c = sd(c);
        return dd(a) ? ld(a.X, String(b), c, !0, d, e) : td(a, b, c, !0, d, e)
    }, zd = function(a, b, c, d, e) {
        if (r(b))
            for (var f = 0; f < b.length; f++)
                zd(a, b[f], c, d, e);
        else
            c = sd(c), dd(a) ? a.Ca(b, c, d, e) : a && (a = ud(a)) && (b = nd(a, b, c, !!d, e)) && Ad(b)
    }, Ad = function(a) {
        if (da(a) || !a || a.ma)
            return !1;
        var b = a.src;
        if (dd(b))
            return md(b.X, a);
        var c = 
        a.type, d = a.b;
        b.removeEventListener ? b.removeEventListener(c, d, a.Aa) : b.detachEvent && b.detachEvent(wd(c), d);
        qd--;
        (c = ud(b)) ? (md(c, a), 0 == c.g && (c.src = null, b[od] = null)) : id(a);
        return !0
    }, wd = function(a) {
        return a in pd ? pd[a] : pd[a] = "on" + a
    }, Cd = function(a, b, c, d) {
        var e = 1;
        if (a = ud(a))
            if (b = a.b[b.toString()])
                for (b = b.concat(), a = 0; a < b.length; a++) {
                    var f = b[a];
                    f && f.Aa == c && !f.ma && (e &= !1 !== Bd(f, d))
                }
        return Boolean(e)
    }, Bd = function(a, b) {
        var c = a.listener, d = a.Ga || a.src;
        a.Ba && Ad(a);
        return c.call(d, b)
    }, xd = function(a, b) {
        if (a.ma)
            return !0;
        if (!$c) {
            var c = b || aa("window.event"), d = new bd(c, this), e = !0;
            if (!(0 > c.keyCode || void 0 != c.returnValue)) {
                t: {
                    var f = !1;
                    if (0 == c.keyCode)
                        try {
                            c.keyCode = -1;
                            break t
                        } catch (h) {
                            f = !0
                        }
                    if (f || void 0 == c.returnValue)
                        c.returnValue = !0
                }
                c = [];
                for (f = d.b; f; f = f.parentNode)
                    c.push(f);
                for (var f = a.type, k = c.length - 1; 0 <= k; k--)
                    d.b = c[k], e &= Cd(c[k], f, !0, d);
                for (k = 0; k < c.length; k++)
                    d.b = c[k], e &= Cd(c[k], f, !1, d)
            }
            return e
        }
        return Bd(a, new bd(b, this))
    }, ud = function(a) {
        a = a[od];
        return a instanceof jd ? a : null
    }, Dd = "__closure_events_fn_" + (1E9 * Math.random() >>> 
    0), sd = function(a) {
        if (ea(a))
            return a;
        a[Dd] || (a[Dd] = function(b) {
            return a.handleEvent(b)
        });
        return a[Dd]
    };
    var N = function() {
        yc.call(this);
        this.X = new jd(this);
        this.pa = this;
        this.$ = null
    };
    v(N, yc);
    N.prototype[cd] = !0;
    g = N.prototype;
    g.addEventListener = function(a, b, c, d) {
        rd(this, a, b, c, d)
    };
    g.removeEventListener = function(a, b, c, d) {
        zd(this, a, b, c, d)
    };
    g.dispatchEvent = function(a) {
        var b, c = this.$;
        if (c)
            for (b = []; c; c = c.$)
                b.push(c);
        var c = this.pa, d = a.type || a;
        if (t(a))
            a = new I(a, c);
        else if (a instanceof I)
            a.target = a.target || c;
        else {
            var e = a;
            a = new I(d, c);
            Hb(a, e)
        }
        var e = !0, f;
        if (b)
            for (var h = b.length - 1; 0 <= h; h--)
                f = a.b = b[h], e = Ed(f, d, !0, a) && e;
        f = a.b = c;
        e = Ed(f, d, !0, a) && e;
        e = Ed(f, d, !1, a) && e;
        if (b)
            for (h = 0; h < b.length; h++)
                f = a.b = b[h], e = Ed(f, d, !1, a) && e;
        return e
    };
    g.B = function() {
        N.T.B.call(this);
        if (this.X) {
            var a = this.X, b = 0, c;
            for (c in a.b) {
                for (var d = a.b[c], e = 0; e < d.length; e++)
                    ++b, id(d[e]);
                delete a.b[c];
                a.g--
            }
        }
        this.$ = null
    };
    g.r = function(a, b, c, d) {
        return ld(this.X, String(a), b, !1, c, d)
    };
    g.Ca = function(a, b, c, d) {
        var e;
        e = this.X;
        a = String(a).toString();
        if (a in e.b) {
            var f = e.b[a];
            b = kd(f, b, c, d);
            -1 < b ? (id(f[b]), Oa.splice.call(f, b, 1), 0 == f.length && (delete e.b[a], e.g--), e = !0) : e = !1
        } else
            e = !1;
        return e
    };
    var Ed = function(a, b, c, d) {
        b = a.X.b[String(b)];
        if (!b)
            return !0;
        b = b.concat();
        for (var e = !0, f = 0; f < b.length; ++f) {
            var h = b[f];
            if (h && !h.ma && h.Aa == c) {
                var k = h.listener, n = h.Ga || h.src;
                h.Ba && md(a.X, h);
                e = !1 !== k.call(n, d) && e
            }
        }
        return e && 0 != d.wb
    };
    var O = function(a, b) {
        N.call(this);
        this.h = a || 1;
        this.g = b || l;
        this.k = u(this.m, this);
        this.l = ja()
    };
    v(O, N);
    O.prototype.j = !1;
    O.prototype.b = null;
    O.prototype.m = function() {
        if (this.j) {
            var a = ja() - this.l;
            0 < a && a < .8 * this.h ? this.b = this.g.setTimeout(this.k, this.h - a) : (this.b && (this.g.clearTimeout(this.b), this.b = null), this.dispatchEvent("tick"), this.j && (this.b = this.g.setTimeout(this.k, this.h), this.l = ja()))
        }
    };
    O.prototype.start = function() {
        this.j = !0;
        this.b || (this.b = this.g.setTimeout(this.k, this.h), this.l = ja())
    };
    var Fd = function(a) {
        a.j = !1;
        a.b && (a.g.clearTimeout(a.b), a.b = null)
    };
    O.prototype.B = function() {
        O.T.B.call(this);
        Fd(this);
        delete this.g
    };
    var Gd = function(a, b, c) {
        if (ea(a))
            c && (a = u(a, c));
        else if (a && "function" == typeof a.handleEvent)
            a = u(a.handleEvent, a);
        else
            throw Error("Invalid listener argument");
        return 2147483647 < b ? -1 : l.setTimeout(a, b || 0)
    };
    var Hd = !1, Id = function(a) {
        if (a = a.match(/[\d]+/g))
            a.length = 3
    };
    if (navigator.plugins && navigator.plugins.length) {
        var Jd = navigator.plugins["Shockwave Flash"];
        Jd && (Hd = !0, Jd.description && Id(Jd.description));
        navigator.plugins["Shockwave Flash 2.0"] && (Hd = !0)
    } else if (navigator.mimeTypes && navigator.mimeTypes.length) {
        var Kd = navigator.mimeTypes["application/x-shockwave-flash"];
        (Hd = Kd && Kd.enabledPlugin) && Id(Kd.enabledPlugin.description)
    } else
        try {
            var Ld = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7"), Hd = !0;
            Id(Ld.GetVariable("$version"))
        } catch (Md) {
            try {
                Ld = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6"), 
                Hd = !0
            } catch (Nd) {
                try {
                    Ld = new ActiveXObject("ShockwaveFlash.ShockwaveFlash"), Hd = !0, Id(Ld.GetVariable("$version"))
                } catch (Od) {
                }
            }
        }
    var Pd = Hd;
    var Qd, Rd, Sd, Td, Ud, Vd, Wd;
    Wd = Vd = Ud = Td = Sd = Rd = Qd = !1;
    var Xd = B;
    Xd && (-1 != Xd.indexOf("Firefox") ? Qd = !0 : -1 != Xd.indexOf("Camino") ? Rd = !0 : -1 != Xd.indexOf("iPhone") || -1 != Xd.indexOf("iPod") ? Sd = !0 : -1 != Xd.indexOf("iPad") ? Td = !0 : -1 != Xd.indexOf("Chrome") ? Vd = !0 : -1 != Xd.indexOf("Android") ? Ud = !0 : -1 != Xd.indexOf("Safari") && (Wd = !0));
    var Yd = Qd, Zd = Rd, $d = Sd, ae = Td, be = Ud, ce = Vd, de = Wd;
    if (Ga && Ga.URL)
        var ee = Ga.URL, bb = !(ee && (0 < ee.indexOf("?google_debug") || 0 < ee.indexOf("&google_debug")));
    var fe = function(a, b, c, d) {
        c = ib(d || "osd_or_lidar::" + b, c, void 0, void 0, void 0);
        a.addEventListener ? a.addEventListener(b, c, !1) : a.attachEvent && a.attachEvent("on" + b, c);
        return c
    };
    var ge = {};
    q("gteh", ib("osd_or_lidar::gteh_ex", function(a, b) {
        var c = ge[a];
        ea(c) && c(b)
    }), void 0);
    var he = function(a, b) {
        var c = a || x;
        c.top != c && (c = c.top);
        try {
            var d;
            if (c.document && !c.document.body)
                d = new L(-1, -1);
            else {
                var e;
                if (b)
                    e = new L(c.innerWidth, c.innerHeight);
                else {
                    var f = (c || window).document, h = "CSS1Compat" == f.compatMode ? f.documentElement : f.body;
                    e = new L(h.clientWidth, h.clientHeight)
                }
                d = e
            }
            return d
        } catch (k) {
            return new L(-12245933, -12245933)
        }
    }, ie = 0, ne = function() {
        var a = 0 <= je ? P() - je : -1, b = ke ? P() - le : -1, c = 0 <= me ? P() - me : -1, d, e;
        d = [2E3, 4E3];
        e = [250, 500, 1E3];
        var f = a;
        -1 != b && b < a && (f = b);
        for (var h, a = 0; a < d.length; ++a)
            if (f < 
            d[a]) {
                h = e[a];
                break
            }
        void 0 === h && (h = e[d.length]);
        return -1 != c && 1500 < c && 4E3 > c ? 500 : h
    }, oe = (new Date).getTime(), je = -1, ke = !1, le = -1, me = -1, P = function() {
        return (new Date).getTime() - oe
    }, pe = function(a) {
        var b = [];
        yb(a, function(a, d) {
            d in Object.prototype || "undefined" == typeof a || (r(a) && (a = a.join(",")), b.push([d, "=", a].join("")))
        });
        return b.join("&")
    };
    var se = function(a, b, c, d, e, f, h, k, n) {
        this.b = qe.clone();
        this.j = this.P = 0;
        this.Ra = this.Ta = this.Ha = -1;
        this.R = [0, 0, 0, 0, 0];
        this.A = [0, 0, 0, 0, 0];
        this.k = [0, 0, 0, 0, 0];
        this.ha = [0, 0, 0, 0, 0];
        this.w = d;
        this.F = this.oa = -1;
        this.M = e;
        this.Sa = function() {
        };
        this.pa = this.g = c;
        this.Eb = 0;
        this.Db = -1;
        this.N = n || qe;
        this.l = "";
        this.Ib = null;
        this.Jb = "";
        this.h = {};
        this.h.le = 0;
        this.h.nt = 2;
        this.h.Fr = 3;
        this.o = this.Va = this.Ua = this.ja = null;
        this.W = 0;
        this.$ = !1;
        this.ia = null;
        this.na = !1;
        this.Gb = f;
        this.Hb = !1;
        this.Fb = void 0;
        this.Y = [];
        this.U = void 0;
        this.Z = 
        !1;
        this.D = void 0;
        this.Ja = 0;
        this.O = -1;
        this.Ia = this.K = 0;
        this.J = void 0;
        this.m = 0;
        this.q = !1;
        re(this, a, f)
    }, qe = new Uc(0, 0, 0, 0), ue = function(a, b, c, d, e) {
        if (!(0 > a.w)) {
            var f = x.innerWidth, h = x.innerHeight, k = new Uc(Math.round(x.mozInnerScreenY), Math.round(x.mozInnerScreenX + f), Math.round(x.mozInnerScreenY + h), Math.round(x.mozInnerScreenX));
            c = new Uc(x.screenY + d, x.screenX + c.width, x.screenY + c.height, x.screenX);
            e || (d = new Uc(k.top - c.top, k.right - c.left, k.bottom - c.top, k.left - c.left), d.top > a.b.top ? a.b = d : (a.b.right = a.b.left + 
            f, a.b.bottom = a.b.top + h), a.P = f * h);
            te(a, k, c, b, e, !0)
        }
    }, we = function(a, b, c) {
        var d = ve(a, x && x.document);
        if (d) {
            c || re(a, x, !0);
            var e = Math.floor((a.b.left + a.b.right) / 2), f = Math.floor((a.b.top + a.b.bottom) / 2), h = Mc(document), d = d(e - h.x, f - h.y) ? .5 : 0;
            te(a, a.b, d, b, c, !0)
        }
    }, ve = function(a, b) {
        xe(a);
        if (!a.ja) {
            var c = [];
            y(Cb(a.h), function(a) {
                c[this.h[a] + 1] = a
            }, a);
            var d = c.join(""), d = b && b[d];
            a.ja = d && u(d, b)
        }
        return a.ja
    }, xe = function(a) {
        a.h.e = -1;
        a.h.i = 6;
        a.h.n = 7;
        a.h.t = 8
    }, ze = function(a, b, c, d) {
        var e = ye;
        0 > a.w || (d || re(a, x, e), Boolean(null) && 
        d && (x.clearInterval(a.Ua), a.Ua = null), Boolean(null) && d && (x.clearInterval(a.Va), a.Va = null), null != a.ia && (d ? (x.clearInterval(a.o), a.o = null, a.$ = !1) : a.na && !a.o && (a.o = x.setInterval(jb("osd_or_lidar::adblock::iem_int", u(a.ob, a, x, 1E3)), 1E3), a.ob(x))), te(a, a.b, c, b, d, !1))
    }, te = function(a, b, c, d, e, f) {
        var h = d - a.w || 1, k = null;
        da(c) ? b = Ae(a, c) : (k = c, b = Ae(a, b, k));
        if (!a.U) {
            c = b;
            var n = a.oa, m = k;
            f = f && -1 != n && 2 >= n;
            var s = -1 == n || -1 == c ? -1 : Math.max(n, c);
            f = f ? s : n;
            -1 != f && (a.R[f] += h);
            (m = m || null) ? (-1 != f && 2 >= f && -1 != a.F && (a.ha[a.F] += h), 
            m = 100 * a.P / ((m.bottom - m.top) * (m.right - m.left)), a.F = 20 <= m ? 0 : 10 <= m ? 1 : 5 <= m ? 2 : 2.5 <= m ? 3 : 4) : a.F = -1;
            if (7 == a.M) {
                m = Be(a);
                n = -1 != f && 2 >= f;
                !n && p(a.J) && 0 < a.J && (a.K += h);
                a.K > a.Ia && (a.Ia = a.K);
                if (n || !p(m) || 0 >= m)
                    a.K = 0;
                a.J = m
            }
            for (m = f; 0 <= m && 4 >= m; m++)
                a.k[m] += h, a.k[m] > a.A[m] && (a.A[m] = a.k[m]);
            for (m = 0; m < a.k.length; ++m)
                if (m < c || e || -1 == c)
                    a.k[m] = 0
        }
        a.oa = e ? -1 : b;
        a.w = d;
        -1 != b && (0 > a.Ha && (a.Ha = d), a.Ra = d);
        -1 == a.Ta && 1E3 <= Math.max(a.k[2], a.A[2]) && (a.Ta = d);
        a.Sa(a, k || qe)
    }, Ae = function(a, b, c) {
        if (a.q && 7 == a.M)
            return a.j = 1, Ce(a.j);
        var d = null;
        if (da(b))
            a.j = 
            b;
        else {
            c = new Uc(Math.max(b.top, c.top), Math.min(b.right, c.right), Math.min(b.bottom, c.bottom), Math.max(b.left, c.left));
            if (0 >= a.P || c.top >= c.bottom || c.left >= c.right)
                return a.j = 0, -1;
            var d = c.clone(), e = -b.left;
            b = -b.top;
            e instanceof K ? (d.left += e.x, d.right += e.x, d.top += e.y, d.bottom += e.y) : (d.left += e, d.right += e, da(b) && (d.top += b, d.bottom += b));
            d = (c.bottom - c.top) * (c.right - c.left);
            a.j = d / a.P
        }
        return Ce(a.j)
    }, Ce = function(a) {
        var b = -1;
        1 <= a ? b = 0 : .75 <= a ? b = 1 : .5 <= a ? b = 2 : .25 <= a ? b = 3 : 0 < a && (b = 4);
        return b
    };
    se.prototype.ob = function(a, b) {
        var c = ve(this, a && a.document);
        if (c) {
            re(this, a, !0);
            var d = Math.floor((this.b.left + this.b.right) / 2), e = Math.floor((this.b.top + this.b.bottom) / 2), f = Mc(document), c = Boolean(c(d - f.x, e - f.y)), d = b || 0;
            c ? (this.W += this.$ ? d : 0, this.$ = !0) : (this.W = 0, this.$ = !1);
            1E3 <= this.W && (a.clearInterval(this.o), this.o = null, this.na = !1, this.ia = "v");
            re(this, a, !1)
        } else
            a.clearInterval(this.o), this.o = null, this.na = !1, this.ia = "i"
    };
    var re = function(a, b, c) {
        b = c ? b : b.top;
        try {
            var d = qe.clone(), e = new K(0, 0);
            if (a.pa) {
                var d = a.pa.getBoundingClientRect(), f = a.pa, h = new K(0, 0), k = M(Hc(f));
                do {
                    var n;
                    if (k == b)
                        n = Yc(f);
                    else {
                        var m = f, s = void 0;
                        if (m.getBoundingClientRect)
                            var F = Wc(m), s = new K(F.left, F.top);
                        else
                            var C = Tc(Ic(m)), Ba = Yc(m), s = new K(Ba.x - C.x, Ba.y - C.y);
                        c = void 0;
                        if (Rb && !G(12)) {
                            var tb = void 0;
                            var Fe, ed = void 0;
                            i: {
                                var Ge = Aa();
                                if (void 0 === m.style[Ge]) {
                                    var Og = (Sb ? "Webkit" : Rb ? "Moz" : E ? "ms" : Qb ? "O" : null) + Ca(Ge);
                                    if (void 0 !== m.style[Og]) {
                                        ed = (Sb ? "-webkit" : 
                                        Rb ? "-moz" : E ? "-ms" : Qb ? "-o" : null) + "-transform";
                                        break i
                                    }
                                }
                                ed = "transform"
                            }
                            if (Fe = Vc(m, ed) || Vc(m, "transform"))
                                var fd = Fe.match(Zc), tb = fd ? new K(parseFloat(fd[1]), parseFloat(fd[2])) : new K(0, 0);
                            else
                                tb = new K(0, 0);
                            c = new K(s.x + tb.x, s.y + tb.y)
                        } else
                            c = s;
                        n = c
                    }
                    c = n;
                    h.x += c.x;
                    h.y += c.y
                } while (k && k != b && (f = k.frameElement) && (k = k.parent));
                e = h
            }
            var Pg = d.right - d.left, Qg = d.bottom - d.top, He = e.x + a.N.left, Ie = e.y + a.N.top, Rg = a.N.right || Pg, Sg = a.N.bottom || Qg;
            a.b = new Uc(Math.round(Ie), Math.round(He + Rg), Math.round(Ie + Sg), Math.round(He))
        } catch (hi) {
            a.b = 
            a.N
        }finally {
            a.h.Po = 5, a.h.me = 1, a.h.om = 4
        }
        a.P = (a.b.bottom - a.b.top) * (a.b.right - a.b.left);
        a.Hb = 2 != a.M && 3 != a.M && 6 != a.M || 0 != a.P ? !1 : !0
    }, De = function(a, b) {
        var c = a.Ja;
        ke || a.U || -1 == a.O || (c += b - a.O);
        return c
    }, Be = function(a) {
        if (a.g && a.g.sdkVolume && ea(a.g.sdkVolume))
            try {
                return Number(a.g.sdkVolume())
            } catch (b) {
                return -1
            }
    }, Ee = function(a, b) {
        for (var c = b - a.Y.length + 1, d = [], e = 0; e < c; e++)
            d[e] = 0;
        Za(a.Y, d);
        a.Y[b] = (100 * a.j | 0) / 100
    }, R = function(a) {
        if (a.Gb)
            return {"if": 0};
        var b = a.b.clone();
        b.round();
        var c = Ra(a.Y, function(a) {
            return 100 * 
            a | 0
        }), b = {"if": ye ? 1 : void 0,sdk: a.D ? a.D : void 0,p: [b.top, b.left, b.bottom, b.right],tos: a.R,mtos: a.A,ps: void 0,pt: c,vht: De(a, P()),mut: a.Ia};
        Je && (b.ps = [Je.width, Je.height]);
        a.Z && (b.ven = "1");
        a.m && (b.vds = a.m);
        Q() ? b.c = (100 * a.j | 0) / 100 : b.tth = P() - ie;
        return b
    };
    var Ke = function() {
        return D("iPad") || D("Android") && !D("Mobile") || D("Silk")
    };
    var Le = null, Me = null, Ne = null, Oe = !1, Re = function() {
        Pe(!1);
        Qe()
    }, Qe = function() {
        S(T, !1)
    }, af = function() {
        Se && (Te = he(x, Se));
        var a = Te, b = Ue, c = Ve;
        if (We) {
            a = b;
            Pe(!1);
            var d = Xe, e = d.height - a;
            0 >= e && (e = d.height, a = 0);
            Te = new L(d.width, e);
            e = new Ye;
            e.o = !0;
            e.j = Te;
            e.h = d;
            e.g = a;
            return e
        }
        if (c)
            return a = new Ye, a.k = !0, a;
        if (Ze)
            return a = new Ye, a.l = !0, a;
        if ($e)
            return a = new Ye, a.q = !0, a;
        t: {
            b = new Ye;
            b.j = a;
            b.b = !1;
            if (null != a && -1 != a.width && -1 != a.height && -12245933 != a.width && -12245933 != a.height) {
                try {
                    var c = Se, f = x || x, f = f.top, e = a || he(f, c), h = 
                    Tc(Ic(f.document)), d = -1 == e.width || -12245933 == e.width ? new Uc(e.width, e.width, e.width, e.width) : new Uc(h.y, h.x + e.width, h.y + e.height, h.x)
                } catch (k) {
                    a = b;
                    break t
                }
                b.m = d;
                b.b = !0
            }
            a = b
        }
        return a
    }, S = function(a, b) {
        if (!bf)
            if (window.clearTimeout(cf), cf = null, 0 == a.length)
                b || df();
            else {
                var c = af();
                try {
                    var d = P();
                    if (c.o)
                        for (var e = 0; e < a.length; e++)
                            ue(a[e], d, c.h, c.g, b);
                    else if (c.k)
                        for (e = 0; e < a.length; e++)
                            we(a[e], d, b);
                    else if ($e)
                        y(a, function() {
                        });
                    else if (c.l)
                        y(a, function() {
                        });
                    else if (c.b)
                        for (e = 0; e < a.length; e++)
                            ze(a[e], d, c.m, 
                            b);
                    ++ef
                }finally {
                    b ? y(a, function(a) {
                        a.j = 0
                    }) : df()
                }
            }
    }, ff = function() {
        var a = Q();
        if (a) {
            if (!ke) {
                var b = P();
                le = b;
                y(T, function(a) {
                    a.Ja = De(a, b)
                })
            }
            ke = !0;
            Pe(!0)
        } else
            b = P(), ke = !1, ie = b, y(T, function(a) {
                0 <= a.w && (a.O = b)
            });
        S(T, !a)
    }, Q = function() {
        if (gf())
            return !0;
        var a;
        a = x.document;
        a = {visible: 1,hidden: 2,prerender: 3,preview: 4}[a.webkitVisibilityState || a.mozVisibilityState || a.visibilityState || ""] || 0;
        return 1 == a || 0 == a
    }, df = function() {
        x && (cf = x.setTimeout(jb("osd_or_lidar::psamp_to", function() {
            S(T, !1)
        }), ne()))
    }, hf = function(a) {
        return null != 
        Ua(T, function(b) {
            return b.g == a
        })
    }, T = [], bf = !1, Te = null, Xe = null, Je = null, cf = null, ye = !Fa(x.top), Ue = 0, We = !1, Ve = !1, Ze = !1, $e = !1, Se = Ke() || !Ke() && (D("iPod") || D("iPhone") || D("Android") || D("IEMobile")), ef = 0, jf = function() {
        var a = x.document;
        return a.body && a.body.getBoundingClientRect ? !0 : !1
    }, Pe = function(a) {
        Te = he(x, Se);
        if (!a) {
            Xe = x.outerWidth ? new L(x.outerWidth, x.outerHeight) : new L(-12245933, -12245933);
            a = x;
            a.top != a && (a = a.top);
            var b = 0, c = 0, d = Te;
            try {
                var e = a.document, f = e.body, h = e.documentElement;
                if ("CSS1Compat" == e.compatMode && 
                h.scrollHeight)
                    b = h.scrollHeight != d.height ? h.scrollHeight : h.offsetHeight, c = h.scrollWidth != d.width ? h.scrollWidth : h.offsetWidth;
                else {
                    var k = h.scrollHeight, n = h.scrollWidth, m = h.offsetHeight, s = h.offsetWidth;
                    h.clientHeight != m && (k = f.scrollHeight, n = f.scrollWidth, m = f.offsetHeight, s = f.offsetWidth);
                    k > d.height ? k > m ? (b = k, c = n) : (b = m, c = s) : k < m ? (b = k, c = n) : (b = m, c = s)
                }
                Je = new L(c, b)
            } catch (F) {
                Je = new L(-12245933, -12245933)
            }
        }
    }, kf = function(a) {
        y(a, function(a) {
            hf(a.g) || T.push(a)
        })
    }, gf = function() {
        return Sa(T, function(a) {
            return a.q
        })
    }, 
    Ye = function() {
        this.h = this.j = null;
        this.g = 0;
        this.m = null;
        this.b = this.q = this.l = this.k = this.o = !1
    };
    var lf = function(a) {
        a = String(a);
        if (/^\s*$/.test(a) ? 0 : /^[\],:{}\s\u2028\u2029]*$/.test(a.replace(/\\["\\\/bfnrtu]/g, "@").replace(/"[^"\\\n\r\u2028\u2029\x00-\x08\x0a-\x1f]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:[\s\u2028\u2029]*\[)+/g, "")))
            try {
                return eval("(" + a + ")")
            } catch (b) {
            }
        throw Error("Invalid JSON string: " + a);
    }, of = function(a) {
        var b = [];
        mf(new nf, a, b);
        return b.join("")
    }, nf = function() {
    }, mf = function(a, b, c) {
        switch (typeof b) {
            case "string":
                pf(b, c);
                break;
            case "number":
                c.push(isFinite(b) && 
                !isNaN(b) ? b : "null");
                break;
            case "boolean":
                c.push(b);
                break;
            case "undefined":
                c.push("null");
                break;
            case "object":
                if (null == b) {
                    c.push("null");
                    break
                }
                if (r(b)) {
                    var d = b.length;
                    c.push("[");
                    for (var e = "", f = 0; f < d; f++)
                        c.push(e), mf(a, b[f], c), e = ",";
                    c.push("]");
                    break
                }
                c.push("{");
                d = "";
                for (e in b)
                    Object.prototype.hasOwnProperty.call(b, e) && (f = b[e], "function" != typeof f && (c.push(d), pf(e, c), c.push(":"), mf(a, f, c), d = ","));
                c.push("}");
                break;
            case "function":
                break;
            default:
                throw Error("Unknown type: " + typeof b);
        }
    }, qf = {'"': '\\"',
        "\\": "\\\\","/": "\\/","\b": "\\b","\f": "\\f","\n": "\\n","\r": "\\r","\t": "\\t","\x0B": "\\u000b"}, rf = /\uffff/.test("\uffff") ? /[\\\"\x00-\x1f\x7f-\uffff]/g : /[\\\"\x00-\x1f\x7f-\xff]/g, pf = function(a, b) {
        b.push('"', a.replace(rf, function(a) {
            if (a in qf)
                return qf[a];
            var b = a.charCodeAt(0), e = "\\u";
            16 > b ? e += "000" : 256 > b ? e += "00" : 4096 > b && (e += "0");
            return qf[a] = e + b.toString(16)
        }), '"')
    };
    var sf = function(a, b) {
        return a.dataset ? b in a.dataset ? a.dataset[b] : null : a.getAttribute("data-" + String(b).replace(/([A-Z])/g, "-$1").toLowerCase())
    };
    var tf = !1, uf = function() {
        if (!Oe) {
            Oe = !0;
            Le = Le || fe(x, "scroll", Qe, "osd_or_lidar::scroll");
            Me = Me || fe(x, "resize", Re, "osd_or_lidar::resize");
            var a;
            Ga.mozVisibilityState ? a = "mozvisibilitychange" : Ga.webkitVisibilityState ? a = "webkitvisibilitychange" : Ga.visibilityState && (a = "visibilitychange");
            a && (Ne = Ne || fe(Ga, a, ff, "osd_or_lidar::visibility"));
            ff()
        }
    };
    var vf = !1, wf = function() {
        vf = !0;
        try {
            je = P(), kb(x), Pe(!1), jf() ? (window.setTimeout(function() {
            }, 1), uf()) : tf = !0
        } catch (a) {
            throw T = [], a;
        }
    }, Lf = function(a, b, c) {
        vf || wf();
        var d = {};
        Hb(d, {opt_videoAdElement: void 0,opt_VideoAdLength: void 0,opt_fullscreen: void 0}, c || {});
        var e = a.toLowerCase();
        if (a = Eb(function(a) {
            return a == e
        })) {
            a = {e: Ec[a],hd: bf ? "1" : "0",v: "232v",hdr: void 0,a: void 0};
            if (tf)
                return a.msg = "ue", pe(a);
            b = xf(b, d);
            if (!b)
                return a.msg = "nf", pe(a);
            c = d.opt_fullscreen;
            p(c) && (b.q = Boolean(c));
            a.a = Be(b);
            p(b.J) && (a.la = 
            b.J);
            c = {};
            c.start = yf;
            c.firstquartile = zf;
            c.midpoint = Af;
            c.thirdquartile = Bf;
            c.complete = Cf;
            c.metric = Df;
            c.pause = Ef;
            c.resume = Ff;
            c.skip = Gf;
            c.viewable_impression = Df;
            c.mute = Hf;
            c.unmute = If;
            c.fullscreen = Jf;
            c.exitfullscreen = Kf;
            if (c = c[e]) {
                d = c(b, d);
                if (!p(d) || t(d))
                    return d;
                Hb(a, d);
                return pe(a)
            }
        }
    }, yf = function(a, b) {
        bf = !1;
        Mf(a, b);
        Ee(a, 0);
        return R(a)
    }, zf = function(a) {
        Ee(a, 1);
        S([a], !Q());
        return R(a)
    }, Af = function(a) {
        Ee(a, 2);
        S([a], !Q());
        return R(a)
    }, Bf = function(a) {
        Ee(a, 3);
        S([a], !Q());
        return R(a)
    }, Cf = function(a) {
        Ee(a, 4);
        S([a], !Q());
        var b = R(a);
        a.q = !1;
        Nf(a.l);
        return b
    }, Ef = function(a) {
        a.Ja = De(a, P());
        var b = !Q();
        S([a], b);
        a.U = !0;
        return R(a)
    }, Ff = function(a) {
        var b = Q();
        a.U && !b && (a.O = P());
        S([a], !b);
        a.U = !1;
        return R(a)
    }, Df = function(a) {
        return R(a)
    }, Gf = function(a) {
        var b = !Q();
        S([a], b);
        b = R(a);
        a.q = !1;
        Nf(a.l);
        return b
    }, Hf = function(a) {
        S([a], !Q());
        return R(a)
    }, If = function(a) {
        S([a], !Q());
        return R(a)
    }, Jf = function(a) {
        a.q = !0;
        S([a], !Q());
        return R(a)
    }, Kf = function(a) {
        a.q = !1;
        S([a], !Q());
        return R(a)
    }, Mf = function(a, b) {
        b && b.opt_VideoAdLength && 
        (a.Fb = b.opt_VideoAdLength);
        var c = P();
        me = c;
        a.R = [0, 0, 0, 0, 0];
        a.A = [0, 0, 0, 0, 0];
        a.k = [0, 0, 0, 0, 0];
        a.ha = [0, 0, 0, 0, 0];
        a.w = -1;
        a.Ha = -1;
        a.Ra = -1;
        a.Eb = 0;
        a.Db = -1;
        a.oa = -1;
        a.F = -1;
        a.j = 0;
        a.w = c;
        var d = !1;
        Q() || (d = !0, a.O = c);
        S([a], d)
    }, Nf = function(a) {
        if (t(a)) {
            var b = Ta(T, function(b) {
                return b.l == a
            });
            0 <= b && Oa.splice.call(T, b, 1)
        }
    }, xf = function(a, b) {
        if (b.opt_videoAdElement)
            return Of(a, b.opt_videoAdElement);
        var c = Pf(a);
        return c ? c : c = Ua(T, function(b) {
            return b.l == a
        })
    }, Of = function(a, b) {
        var c = Ua(T, function(a) {
            return a.g == b
        });
        c || (c = Qf(b), 
        c.l = a, c.D = "h");
        return c
    }, Pf = function(a) {
        var b = Ua(T, function(b) {
            return b.g ? Rf(b.g) == a : !1
        });
        if (b)
            return b;
        b = Sf();
        b = Ua(b, function(b) {
            return Rf(b) == a
        });
        if (!b)
            return null;
        b = Qf(b);
        b.D = "as";
        Tf(b);
        return b
    }, Tf = function(a) {
        var b = Rf(a.g);
        t(b) && (a.l = b)
    }, Sf = function() {
        var a = x.document, b = ab(Ra(["embed", "object"], function(b) {
            return Ya(a.getElementsByTagName(b))
        }));
        return b = Qa(b, function(a) {
            if (!a || !fa(a) || 1 != a.nodeType)
                return !1;
            var b = a.getBoundingClientRect();
            return 0 != b.width && 0 != b.height && a.metricID && ea(a.metricID) ? 
            !0 : !1
        })
    }, Rf = function(a) {
        if (!a || !a.metricID || !ea(a.metricID))
            return null;
        var b;
        try {
            b = a.metricID()
        } catch (c) {
            return null
        }
        return b.queryID
    }, Qf = function(a) {
        var b = P();
        sf(a, "admeta") || sf(a, "admetaDfp");
        var c = sf(a, "ord") || "", d;
        t: if (c) {
            d = x.document.getElementsByTagName("script");
            for (var c = new RegExp(".doubleclick.net/(N.+/)?(pf)?(ad[ijx])/.*;ord=" + va(c)), e = 0; e < d.length; e++) {
                var f = d[e];
                if (f && f.src && c.test(f.src)) {
                    d = f.src;
                    break t
                }
            }
            d = x != x.top && c.test(x.location.href) ? x.location.href : ""
        } else
            d = "";
        a = new se(x, 0, 
        a, b, 7, ye);
        b = d.match(/.doubleclick.net\/(N.+\/)?(pf)?(ad[ijx])\//);
        a.Ib = b ? {adi: "adi",adj: "adj",adx: "adx"}[b[3]] : "";
        if (d) {
            t: {
                if (d && (b = d.match(/\/\/.*(;u=xb[^;\?]*)/i)) && (b = b[b.length - 1].split("=")) && 2 == b.length) {
                    b = b[1];
                    break t
                }
                b = null
            }
            a.Jb = b
        }
        a.Sa = Uf;
        kf([a]);
        uf();
        return a
    }, Uf = function(a) {
        if (2E3 <= Math.max(a.k[2], a.A[2]) && !a.Z && !ye) {
            var b = "as" == a.D, c = "h" == a.D, d = aa("ima.common.triggerViewEvent"), e = R(a);
            e.e = 9;
            try {
                var f = pe(e);
                c ? ea(d) ? (d(a.l, f), a.Z = !0) : a.m = 4 : b ? a.g && a.g.triggerViewEvent ? (a.g.triggerViewEvent(f), 
                a.Z = !0) : a.m = 1 : a.m = 5
            } catch (h) {
                a.m = a.m || 2
            }
        } else
            a.m = 3
    };
    q("Goog_AdSense_Lidar_startMetricMeasurement", ib("lidar::startmm_ex", function(a, b) {
        var c = b || {};
        if (!t(a)) {
            var d = xf(a, c);
            d && Mf(d, c)
        }
    }), void 0);
    q("Goog_AdSense_Lidar_stopMetricMeasurement", ib("lidar::stopmm_ex", Nf), void 0);
    q("Goog_AdSense_Lidar_getMetric", ib("lidar::getmetric_ex", function(a) {
        var b = Ua(T, function(b) {
            return b.l === a
        });
        if (!b)
            return "-1";
        var c = {xsj: b.R,mkdj: b.A};
        Q() ? c.c7 = (100 * b.j | 0) / 100 : c.ftr = P() - ie;
        return of(c)
    }), void 0);
    q("Goog_AdSense_Lidar_sendVastMessage", ib("lidar::handlevast_ex", Lf), void 0);
    var U = function(a, b, c) {
        I.call(this, a);
        this.k = b;
        this.j = null != c ? c : null
    };
    v(U, I);
    U.prototype.l = function() {
        return this.k
    };
    U.prototype.m = function() {
        return this.j
    };
    var V = function(a) {
        yc.call(this);
        this.j = a;
        this.g = {}
    };
    v(V, yc);
    var Vf = [];
    V.prototype.r = function(a, b, c, d) {
        return Wf(this, a, b, c, d)
    };
    var Wf = function(a, b, c, d, e, f) {
        r(c) || (c && (Vf[0] = c.toString()), c = Vf);
        for (var h = 0; h < c.length; h++) {
            var k = rd(b, c[h], d || a.handleEvent, e || !1, f || a.j || a);
            if (!k)
                break;
            a.g[k.Pa] = k
        }
        return a
    }, Xf = function(a, b, c, d, e, f) {
        if (r(c))
            for (var h = 0; h < c.length; h++)
                Xf(a, b, c[h], d, e, f);
        else
            (b = yd(b, c, d || a.handleEvent, e, f || a.j || a)) && (a.g[b.Pa] = b)
    };
    V.prototype.Ca = function(a, b, c, d, e) {
        if (r(b))
            for (var f = 0; f < b.length; f++)
                this.Ca(a, b[f], c, d, e);
        else
            c = c || this.handleEvent, e = e || this.j || this, c = sd(c), d = !!d, b = dd(a) ? nd(a.X, String(b), c, d, e) : a ? (a = ud(a)) ? nd(a, b, c, d, e) : null : null, b && (Ad(b), delete this.g[b.Pa]);
        return this
    };
    V.prototype.B = function() {
        V.T.B.call(this);
        yb(this.g, Ad);
        this.g = {}
    };
    V.prototype.handleEvent = function() {
        throw Error("EventHandler.handleEvent not implemented");
    };
    var Yf = function(a) {
        return (a = a.exec(B)) ? a[1] : ""
    };
    (function() {
        if (Yd)
            return Yf(/Firefox\/([0-9.]+)/);
        if (E || Qb)
            return Wb;
        if (ce)
            return Yf(/Chrome\/([0-9.]+)/);
        if (de)
            return Yf(/Version\/([0-9.]+)/);
        if ($d || ae) {
            var a;
            if (a = /Version\/(\S+).*Mobile\/(\S+)/.exec(B))
                return a[1] + "." + a[2]
        } else {
            if (be)
                return (a = Yf(/Android\s+([0-9.]+)/)) ? a : Yf(/Version\/([0-9.]+)/);
            if (Zd)
                return Yf(/Camino\/([0-9.]+)/)
        }
        return ""
    })();
    var Zf = {}, $f = "", ag = /OS (\S+) like/, bg = /Android (\S+);/, cg = function() {
        return Ob || w(B, "Mobile")
    }, dg = function() {
        return Pb || w(B, "iPod")
    }, eg = function() {
        return dg() || Ub
    }, fg = function(a, b) {
        if (null == Zf[b]) {
            var c;
            la($f) && (c = a.exec(B)) && ($f = c[1]);
            (c = $f) ? (c = c.replace(/_/g, "."), Zf[b] = 0 <= ya(c, b)) : Zf[b] = !1
        }
        return Zf[b]
    }, gg = function() {
        var a = B;
        return a ? w(a, "AppleTV") || w(a, "GoogleTV") || w(a, "HbbTV") || w(a, "NetCast.TV") || w(a, "POV_TV") || w(a, "SMART-TV") || w(a, "SmartTV") || Ob && w(a, "AFT") : !1
    };
    var hg = function() {
        N.call(this);
        this.b = null;
        this.j = new V(this);
        zc(this, ia(Ac, this.j));
        this.h = new A;
        this.g = !1
    };
    v(hg, N);
    var ig = null, jg = function() {
        null != ig || (ig = new hg);
        return ig
    }, kg = function(a) {
        if (null == a)
            return !1;
        if (dg() && null != a.webkitDisplayingFullscreen)
            return a.webkitDisplayingFullscreen;
        var b = window.screen.availWidth || window.screen.width, c = window.screen.availHeight || window.screen.height;
        a = ea(a.getBoundingClientRect) ? a.getBoundingClientRect() : {width: a.offsetWidth,height: a.offsetHeight};
        return 0 >= b - a.width && 42 >= c - a.height
    }, lg = function(a, b, c, d, e) {
        if (a.g) {
            var f = {};
            if (a = d ? a.h.get(d) : Dc.m)
                f.opt_videoAdElement = a, f.opt_fullscreen = 
                kg(a);
            e && (f.opt_fullscreen = e);
            return Lf(b, c, f) || ""
        }
        return ""
    };
    hg.prototype.k = function(a) {
        var b = a.I, c = b.queryId, d = {};
        d.timeoutId = b.timeoutId;
        switch (a.H) {
            case "getViewability":
                d.viewabilityString = lg(this, "metric", c) || "";
                this.b.send("activityMonitor", "viewability", d);
                break;
            case "reportVastEvent":
                d.viewabilityString = lg(this, b.vastEvent, c, b.osdId, b.isFullscreen), this.b.send("activityMonitor", "viewability", d)
        }
    };
    q("ima.common.sdkVolume", function() {
        var a = -1;
        null != (jg(), null) && (a = (jg(), null)());
        return a
    }, void 0);
    q("ima.common.triggerViewEvent", function(a, b) {
        var c = {};
        c.queryId = a;
        c.viewabilityString = b;
        var d;
        (d = jg().b) ? d.send("activityMonitor", "viewableImpression", c) : jg().dispatchEvent(new U("viewable_impression", null, c))
    }, void 0);
    var mg = function(a, b, c) {
        this.g = c;
        0 == b.length && (b = [[]]);
        this.b = Ra(b, function(b) {
            b = a.concat(b);
            for (var c = [], f = 0, h = 0; f < b.length; ) {
                var k = b[f++];
                if (128 > k)
                    c[h++] = String.fromCharCode(k);
                else if (191 < k && 224 > k) {
                    var n = b[f++];
                    c[h++] = String.fromCharCode((k & 31) << 6 | n & 63)
                } else {
                    var n = b[f++], m = b[f++];
                    c[h++] = String.fromCharCode((k & 15) << 12 | (n & 63) << 6 | m & 63)
                }
            }
            return new RegExp(c.join(""))
        })
    };
    mg.prototype.match = function(a) {
        return Sa(this.b, function(b) {
            b = a.match(b);
            return null == b ? !1 : !this.g || 1 <= b.length && "3.1.76" == b[1] || 2 <= b.length && "3.1.76" == b[2] ? !0 : !1
        }, this)
    };
    var ng = [104, 116, 116, 112, 115, 63, 58, 47, 47, 105, 109, 97, 115, 100, 107, 46, 103, 111, 111, 103, 108, 101, 97, 112, 105, 115, 46, 99, 111, 109, 47, 106, 115, 47, 40, 115, 100, 107, 108, 111, 97, 100, 101, 114, 124, 99, 111, 114, 101, 41, 47], og = [104, 116, 116, 112, 115, 63, 58, 47, 47, 115, 48, 46, 50, 109, 100, 110, 46, 110, 101, 116, 47, 105, 110, 115, 116, 114, 101, 97, 109, 47, 104, 116, 109, 108, 53, 47], pg = [[97, 102, 105, 92, 46, 106, 115], [105, 109, 97, 51, 92, 46, 106, 115], [105, 109, 97, 51, 95, 100, 101, 98, 117, 103, 92, 46, 106, 115], [105, 109, 97, 51, 95, 116, 101, 115, 116, 46, 106, 115], [105, 109, 
            97, 51, 95, 108, 111, 97, 100, 101, 114, 92, 46, 106, 115], [105, 109, 97, 51, 95, 108, 111, 97, 100, 101, 114, 95, 100, 101, 98, 117, 103, 92, 46, 106, 115]], qg = [[98, 114, 105, 100, 103, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 40, 95, 91, 97, 45, 122, 93, 91, 97, 45, 122, 93, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108], [98, 114, 105, 100, 103, 101, 40, 91, 48, 45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 95, 100, 101, 98, 117, 103, 40, 95, 91, 97, 45, 122, 93, 91, 97, 45, 122, 93, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108], [98, 114, 105, 100, 103, 101, 40, 91, 48, 
            45, 57, 93, 43, 92, 46, 91, 48, 45, 57, 92, 46, 93, 43, 41, 95, 116, 101, 115, 116, 40, 95, 91, 97, 45, 122, 93, 91, 97, 45, 122, 93, 41, 123, 48, 44, 50, 125, 92, 46, 104, 116, 109, 108]], rg = new mg(ng, pg, !1), sg = new mg(ng, qg, !0), tg = new mg(og, pg, !1), ug = new mg(og, qg, !0), vg = new mg([104, 116, 116, 112, 115, 63, 58, 47, 47, 119, 119, 119, 46, 103, 115, 116, 97, 116, 105, 99, 46, 99, 111, 109, 47, 97, 100, 109, 111, 98, 47, 106, 115, 47, 97, 112, 118, 95, 116, 101, 109, 112, 108, 97, 116, 101, 115, 46, 106, 115], [], !1), wg = new mg([104, 116, 116, 112, 115, 63, 58, 47, 47, 109, 105, 110, 116, 45, 109, 97, 100, 46, 
        115, 97, 110, 100, 98, 111, 120, 46, 103, 111, 111, 103, 108, 101, 46, 99, 111, 109, 47, 109, 97, 100, 115, 47, 115, 116, 97, 116, 105, 99, 47, 102, 111, 114, 109, 97, 116, 115, 47, 97, 112, 118, 95, 116, 101, 109, 112, 108, 97, 116, 101, 115, 46, 106, 115], [], !1), xg = new mg([104, 116, 116, 112, 115, 63, 58, 47, 47, 103, 111, 111, 103, 108, 101, 97, 100, 115, 46, 103, 46, 100, 111, 117, 98, 108, 101, 99, 108, 105, 99, 107, 46, 110, 101, 116, 47, 109, 97, 100, 115, 47, 115, 116, 97, 116, 105, 99], [], !1), yg = new mg([104, 116, 116, 112, 115, 63, 58, 47, 47, 118, 105, 100, 101, 111, 45, 97, 100, 45, 116, 101, 115, 116, 46, 
        97, 112, 112, 115, 112, 111, 116, 46, 99, 111, 109, 47], [], !1), zb = {o: rg,k: sg,m: tg,l: ug,b: vg,g: wg,h: xg,j: yg};
    var zg = ["://secure-...imrworldwide.com/", "://cdn.imrworldwide.com/", "://aksecure.imrworldwide.com/", "www.google.com/pagead/sul", "www.youtube.com/gen_204\\?a=sul"], Ag = function(a) {
        return la(wa(a)) ? !1 : null != Ua(zg, function(b) {
            return null != a.match(b)
        })
    }, Bg = function(a) {
        a = Ag(a) ? 'javascript:"data:text/html,<body><img src=\\"' + a + '\\"></body>"' : a;
        var b = Oc("iframe", {src: a,style: "display:none"});
        a = Hc(b).body;
        var c, d = Gd(function() {
            Ad(c);
            Qc(b)
        }, 15E3);
        c = yd(b, ["load", "error"], function() {
            Gd(function() {
                l.clearTimeout(d);
                Qc(b)
            }, 5E3)
        });
        a.appendChild(b)
    };
    var Cg = {Fd: "video/mp4",Hd: "video/mpeg",Cd: "application/x-mpegURL",Id: "video/ogg",Od: "video/3gpp",Sd: "video/webm",Ed: "audio/mpeg",Gd: "audio/mp4"};
    var Dg = ["*.googlesyndication.com"], Eg = ["*.youtu.be", "*.youtube.com"], Fg = "ad.doubleclick.net bid.g.doubleclick.net corp.google.com ggpht.com google.co.uk google.com googleads.g.doubleclick.net googleads4.g.doubleclick.net googleadservices.com googlesyndication.com googleusercontent.com gstatic.com prod.google.com pubads.g.doubleclick.net s0.2mdn.net static.doubleclick.net static.doubleclick.net surveys.g.doubleclick.net youtube.com ytimg.com".split(" "), Hg = function(a, b) {
        try {
            var c = oc(new dc(b)), c = c.replace(/^www./i, 
            "");
            return Sa(a, function(a) {
                return Gg(a, c)
            })
        } catch (d) {
            return !1
        }
    }, Gg = function(a, b) {
        if (la(wa(b)))
            return !1;
        a = a.toLowerCase();
        b = b.toLowerCase();
        return "*." == a.substr(0, 2) ? (a = a.substr(2), a.length > b.length ? !1 : b.substr(-a.length) == a && (b.length == a.length || "." == b.charAt(b.length - a.length - 1))) : a == b
    }, Ig = function(a) {
        var b;
        if (b = "https:" == window.location.protocol)
            b = (new RegExp("^https?://([a-z0-9-]{1,63}\\.)*(" + Fg.join("|").replace(/\./g, ".") + ")(:[0-9]+)?([/?#]|$)", "i")).test(a);
        return b ? (a = new dc(a), ec(a, "https"), 
        a.toString()) : a
    };
    var Jg = function(a) {
        a = Ig(a);
        Bg(a)
    };
    var Kg = function() {
        this.g = .05 > Math.random();
        this.b = Math.floor(4503599627370496 * Math.random())
    };
    Kg.getInstance = function() {
        return Kg.b ? Kg.b : Kg.b = new Kg
    };
    var Ng = function(a, b, c, d) {
        if (!(eg() && fg(ag, 8) || !a.g && !d)) {
            c = c || {};
            c.lid = b;
            c = Lg(a, c);
            var e = new dc("http://pagead2.googlesyndication.com/pagead/gen_204");
            yb(c, function(a, b) {
                var c = e.b, d = b, m = null != a ? "boolean" == typeof a ? a ? "t" : "f" : "" + a : "";
                tc(c);
                c.h = null;
                d = sc(c, d);
                vc(c, d) && (c.g -= c.b.get(d).length);
                Ib(c.b, d, [m]);
                c.g++
            }, a);
            a = Mg();
            ec(e, a.ea);
            Jg(e.toString())
        }
    }, Lg = function(a, b) {
        b.id = "ima_html5";
        var c = Mg();
        b.c = a.b;
        b.domain = c.aa;
        return b
    }, Mg = function() {
        var a = M(), b = document;
        return new dc(a.parent == a ? a.location.href : 
        b.referrer)
    };
    var Tg = function() {
        this.b = -1
    }, Ug = new Tg;
    Tg.prototype.clear = function() {
    };
    var Vg = function(a) {
        this.g = a
    };
    Vg.prototype.b = function() {
        return this.g
    };
    var Wg = function() {
        N.call(this);
        this.currentTime = 0
    };
    v(Wg, N);
    var Xg = function(a, b) {
        this.message = a;
        this.errorCode = b
    }, Yg = new Xg("Invalid usage of the API. Cause: {0}", 900), Zg = new Xg("The provided {0} information: {1} is invalid.", 1101), $g = function(a, b, c) {
        var d;
        d = b || null;
        if (!(d instanceof H)) {
            var e = a.errorCode, f = a.message, h = $a(arguments, 2);
            if (0 < h.length)
                for (var k = 0; k < h.length; k++)
                    f = f.replace(new RegExp("\\{" + k + "\\}", "ig"), h[k]);
            e = new H("adPlayError", f, e);
            e.g = d;
            d = e
        }
        return d
    };
    var ah = function(a) {
        Wg.call(this);
        this.currentTime = a.currentTime;
        if (!("currentTime" in a) || isNaN(a.currentTime))
            throw $g(Zg, null, "content", "currentTime");
        this.g = a;
        this.b = new O(250);
        this.h = new V(this);
        Wf(this.h, this.b, "tick", this.j, !1, this)
    };
    v(ah, Wg);
    ah.prototype.start = function() {
        this.b.start()
    };
    ah.prototype.B = function() {
        ah.T.B.call(this);
        this.h.G();
        this.b.G()
    };
    ah.prototype.j = function() {
        if ("currentTime" in this.g && !isNaN(this.g.currentTime)) {
            var a = this.currentTime;
            this.currentTime = this.g.currentTime;
            a != this.currentTime && this.dispatchEvent(new I("currentTimeUpdate"))
        } else
            this.dispatchEvent(new I("contentWrapperError")), Fd(this.b)
    };
    var bh = function(a, b) {
        U.call(this, "adMetadata", a);
        this.g = b || null
    };
    v(bh, U);
    bh.prototype.o = function() {
        return this.g
    };
    var ch = function() {
        N.call(this);
        this.k = this.l = this.m = !1;
        this.b = 0;
        this.g = [];
        this.q = !1;
        this.j = {}
    };
    v(ch, N);
    var eh = function(a, b) {
        null == b || a.m || (a.h = b, dh(a), a.m = !0)
    }, gh = function(a) {
        null != a.h && a.m && (fh(a), a.m = !1, a.l = !1, a.k = !1, a.b = 0, a.g = [], a.q = !1)
    }, dh = function(a) {
        fh(a);
        a.j = a.h instanceof N || !eg() ? {click: u(a.w, a)} : {touchstart: u(a.D, a),touchmove: u(a.F, a),touchend: u(a.A, a)};
        yb(a.j, function(a, c) {
            this.h.addEventListener(c, a, !1)
        }, a)
    }, fh = function(a) {
        yb(a.j, function(a, c) {
            this.h.removeEventListener(c, a, !1)
        }, a);
        a.j = {}
    };
    ch.prototype.D = function(a) {
        this.l = !0;
        this.b = a.touches.length;
        this.q = hh(this, a.touches) || 1 != a.touches.length;
        ih(this, a.touches)
    };
    ch.prototype.F = function(a) {
        this.k = !0;
        this.b = a.touches.length
    };
    ch.prototype.A = function(a) {
        this.l && 1 == this.b && !this.k && !this.q && hh(this, a.changedTouches) && this.dispatchEvent(new I("click"));
        this.b = a.touches.length;
        0 == this.b && (this.k = this.l = !1, this.g = [])
    };
    ch.prototype.w = function() {
        this.dispatchEvent(new I("click"))
    };
    var ih = function(a, b) {
        a.g = [];
        y(b, function(a) {
            var b = this.g;
            a = a.identifier;
            0 <= Pa(b, a) || b.push(a)
        }, a)
    }, hh = function(a, b) {
        return Sa(b, function(a) {
            return 0 <= Pa(this.g, a.identifier)
        }, a)
    };
    ch.prototype.B = function() {
        gh(this);
        ch.T.B.call(this)
    };
    var jh = function() {
        this.b = [];
        this.g = []
    };
    g = jh.prototype;
    g.ga = function() {
        return this.b.length + this.g.length
    };
    g.isEmpty = function() {
        return 0 == this.b.length && 0 == this.g.length
    };
    g.clear = function() {
        this.b = [];
        this.g = []
    };
    g.contains = function(a) {
        return 0 <= Pa(this.b, a) || 0 <= Pa(this.g, a)
    };
    g.ba = function() {
        for (var a = [], b = this.b.length - 1; 0 <= b; --b)
            a.push(this.b[b]);
        for (var c = this.g.length, b = 0; b < c; ++b)
            a.push(this.g[b]);
        return a
    };
    var kh = function() {
    }, lh = {Bd: "Image",wd: "Flash",hc: "All"}, mh = {xd: "Html",yd: "IFrame",Nd: "Static",hc: "All"}, nh = {zd: "IgnoreSize",Kd: "SelectExactMatch",Ld: "SelectNearMatch"};
    var ph = function(a, b) {
        if (null == a || 0 >= a.width || 0 >= a.height)
            throw $g(Zg, null, "ad slot size", a.toString());
        this.g = a;
        this.b = null != b ? b : new kh;
        this.k = oh(mh, this.b.j) ? this.b.j : "All";
        this.j = oh(lh, this.b.h) ? this.b.h : "All";
        this.l = oh(nh, this.b.k) ? this.b.k : "SelectExactMatch";
        this.h = null != this.b.g ? this.b.g : [];
        this.o = da(this.b.b) && 0 < this.b.b && 100 >= this.b.b ? this.b.b : 90
    }, sh = function(a, b) {
        var c = [];
        y(b, function(a) {
            !la(a.b) && (isNaN(a.o) || isNaN(a.k) || a.k == a.o) && qh(this, a) ? c.push(a) : (a = rh(this, a), null != a && !la(a.b) && c.push(a))
        }, 
        a);
        return c
    }, qh = function(a, b) {
        var c;
        if (c = "Flash" != b.g() || Pd) {
            if (c = "All" == a.k || a.k == b.A)
                c = b.g(), c = null != c ? "All" == a.j || a.j == c : !0;
            c && (c = b.P, c = 0 == a.h.length ? !0 : null != c ? 0 <= Pa(a.h, c) : !1)
        }
        if (c) {
            c = b.h;
            var d;
            (d = "IgnoreSize" == a.l) || (d = a.g, d = d == c ? !0 : d && c ? d.width == c.width && d.height == c.height : !1);
            c = d ? !0 : "SelectNearMatch" == a.l && (c.width > a.g.width || c.height > a.g.height || c.width < a.o / 100 * a.g.width || c.height < a.o / 100 * a.g.height ? !1 : !0)
        } else
            c = !1;
        return c
    }, rh = function(a, b) {
        var c = b.j;
        return null != c ? Ua(c, function(a) {
            return qh(this, 
            a)
        }, a) : null
    }, oh = function(a, b) {
        var c;
        if (c = null != b)
            t: {
                for (var d in a)
                    if (a[d] == b) {
                        c = !0;
                        break t
                    }
                c = !1
            }
        return c
    };
    var th = function(a) {
        var b = {};
        y(a.split(","), function(a) {
            var d = a.split("=");
            2 == d.length && (a = ma(d[0]), d = ma(d[1]), 0 < a.length && (b[a] = d))
        });
        return b
    };
    var W = function() {
        this.o = 1;
        this.h = -1;
        this.b = 1;
        this.k = this.j = 0;
        this.g = !1
    };
    g = W.prototype;
    g.xc = function() {
        return this.o
    };
    g.uc = function() {
        return this.h
    };
    g.sc = function() {
        return this.b
    };
    g.vc = function() {
        return this.j
    };
    g.wc = function() {
        return this.k
    };
    g.tc = function() {
        return this.g
    };
    var X = function(a) {
        this.b = a.content;
        this.l = a.contentType;
        this.h = a.size;
        this.k = a.masterSequenceNumber;
        this.A = a.resourceType;
        this.o = a.sequenceNumber;
        this.P = a.adSlotId;
        this.j = [];
        a = a.backupCompanions;
        null != a && (this.j = Ra(a, function(a) {
            return new X(a)
        }))
    };
    X.prototype.m = function() {
        return this.b
    };
    X.prototype.g = function() {
        return this.l
    };
    X.prototype.w = function() {
        return this.h.width
    };
    X.prototype.q = function() {
        return this.h.height
    };
    var Y = function(a) {
        this.b = a
    };
    g = Y.prototype;
    g.yc = function() {
        return this.b.adId
    };
    g.Ac = function() {
        return this.b.adSystem
    };
    g.xb = function() {
        return this.b.clickThroughUrl
    };
    g.Jc = function() {
        return this.b.adWrapperIds
    };
    g.Kc = function() {
        return this.b.adWrapperSystems
    };
    g.Lc = function() {
        return this.b.linear
    };
    g.Mc = function() {
        return this.b.skippable
    };
    g.Cc = function() {
        return this.b.contentType
    };
    g.oc = function() {
        return this.b.description
    };
    g.pc = function() {
        return this.b.title
    };
    g.hb = function() {
        return this.b.duration
    };
    g.Ic = function() {
        return this.b.width
    };
    g.Dc = function() {
        return this.b.height
    };
    g.Hc = function() {
        return this.b.uiElements
    };
    g.Ec = function() {
        return this.b.minSuggestedDuration
    };
    g.zc = function() {
        var a = this.b.adPodInfo, b = new W;
        b.j = a.podIndex;
        b.k = a.timeOffset;
        b.o = a.totalAds;
        b.b = a.adPosition;
        b.g = a.isBumper;
        b.h = a.maxDuration;
        return b
    };
    g.Bc = function(a, b, c) {
        var d = Ra(this.b.companions, function(a) {
            return new X(a)
        });
        return sh(new ph(new L(a, b), c), d)
    };
    g.Fc = function() {
        return th(wa(this.b.traffickingParameters))
    };
    g.Gc = function() {
        return this.b.traffickingParameters
    };
    var Z = function(a, b, c, d) {
        N.call(this);
        this.b = a;
        this.h = null;
        this.N = d;
        this.J = !1;
        this.O = 1;
        this.W = b;
        this.D = -1;
        this.g = this.j = null;
        this.l = new jh;
        this.M = !1;
        this.q = new A;
        this.w = this.K = !1;
        this.F = c && null != this.b.g;
        this.A = new V(this);
        this.A.r(this.N, "adsManager", this.U)
    };
    v(Z, N);
    Z.prototype.U = function(a) {
        switch (a.H) {
            case "error":
                a = a.I;
                var b = new Bc(uh(a));
                this.M ? (this.dispatchEvent(b), this.j = null) : this.l.g.push(b);
                Ng(Kg.getInstance(), 7, {error: a.errorCode}, !0);
                break;
            case "contentPauseRequested":
                b = this.b.j;
                this.b.o() && null != this.h && this.h.restoreCustomPlaybackStateOnAdBreakComplete && null != b.Ya && b.Ya();
                this.k(a.H, a.I);
                break;
            case "contentResumeRequested":
                a = u(Z.prototype.k, this, a.H, a.I);
                b = this.b.j;
                this.b.o() && null != this.h && this.h.restoreCustomPlaybackStateOnAdBreakComplete && null != 
                b.Xa ? b.Xa(a) : a();
                break;
            case "remainingTime":
                b = a.I;
                this.D = b.remainingTime;
                break;
            case "skip":
                this.k(a.H, a.I);
                break;
            case "log":
                b = a.I;
                this.k(a.H, b.adData, b.logData);
                break;
            case "companionBackfill":
                a = aa("window.google_show_companion_ad");
                null != a && a();
                break;
            case "skipshown":
                this.J = !0;
                this.k(a.H, a.I);
                break;
            default:
                this.k(a.H, a.I)
        }
    };
    Z.prototype.k = function(a, b, c) {
        if (null == b.companions) {
            var d = this.q.get(b.adId);
            b.companions = null != d ? d : []
        }
        d = null != b.adData ? new Y(b.adData) : null;
        switch (a) {
            case "adBreakReady":
                a = new U(a, null, b);
                break;
            case "adMetadata":
                a = null;
                null != b.adCuePoints && (a = new Vg(b.adCuePoints));
                a = new bh(d, a);
                break;
            case "allAdsCompleted":
                this.K = !0;
                a = new U(a, d);
                break;
            case "contentPauseRequested":
                this.w = !1;
                a = new U(a, d);
                break;
            case "contentResumeRequested":
                this.w = !0;
                a = new U(a, d);
                break;
            case "loaded":
                this.j = d;
                this.D = d.hb();
                a = new U(a, 
                d, b.adData);
                break;
            case "start":
                Ib(this.q, b.adId, b.companions);
                null != vh(this.b) && (null != this.g ? gh(this.g) : (this.g = new ch, this.A.r(this.g, "click", this.Ub)), eh(this.g, vh(this.b)));
                a = new U(a, d);
                break;
            case "complete":
                null != this.g && gh(this.g);
                this.j = null;
                Lb(this.q, b.adId);
                a = new U(a, d);
                break;
            case "log":
                b = {adError: uh(c)};
                a = new U(a, d, b);
                break;
            case "urlNavigationRequested":
                a = new U(a, d, b.urlNavigationData);
                break;
            default:
                a = new U(a, d)
        }
        this.dispatchEvent(a);
        this.K && this.w && this.ib()
    };
    var uh = function(a) {
        var b = new H(a.type, a.errorMessage, a.errorCode);
        null != a.innerError && (b.g = Error(a.innerError));
        return b
    }, $ = function(a, b, c) {
        a.N.send("adsManager", b, c)
    };
    g = Z.prototype;
    g.fc = function() {
        $(this, "contentTimeUpdate", {currentTime: this.R.currentTime})
    };
    g.Xc = function() {
        $(this, "sendImpressionUrls")
    };
    g.Uc = function(a, b, c) {
        if (this.l.isEmpty())
            this.M = !0, this.mb(a, b, c), $(this, "init", {width: a,height: b,viewMode: c});
        else {
            for (; !this.l.isEmpty(); )
                a = this.l, 0 == a.b.length && (a.b = a.g, a.b.reverse(), a.g = []), a = a.b.pop(), this.dispatchEvent(a);
            this.G()
        }
    };
    g.ld = function() {
        return this.b.o()
    };
    g.kd = function() {
        return this.F
    };
    g.Sc = function() {
        return this.D
    };
    g.Pc = function() {
        return this.J
    };
    g.$c = function() {
        $(this, "skip")
    };
    g.start = function() {
        var a = this.b;
        a.m = this.F && null != a.g;
        this.b.k.g.style.opacity = 1;
        $(this, "start")
    };
    g.Ub = function() {
        if ((null == this.h || !this.h.disableClickThrough) && null != this.j) {
            var a = this.j.xb();
            null != a && window.open(Ig(a), "_blank")
        }
    };
    g.mb = function(a, b, c) {
        var d = this.b, e = d.h;
        null != e && (-1 == a ? (e.style.right = 0, e.style.left = 0) : e.style.width = a + "px", -1 == b ? (e.style.bottom = 0, e.style.top = 0) : e.style.height = b + "px");
        null != d.k && (d = d.k, d.g.width = -1 == a ? "100%" : a, d.g.height = -1 == b ? "100%" : b);
        $(this, "resize", {width: a,height: b,viewMode: c})
    };
    g.ad = function() {
        $(this, "stop")
    };
    g.Oc = function() {
        $(this, "expand")
    };
    g.Nc = function() {
        $(this, "collapse")
    };
    g.Tc = function() {
        return this.O
    };
    g.Zc = function(a) {
        this.O = a;
        var b = this.b.j;
        null != b && b.Oa(a);
        $(this, "volume", {volume: a})
    };
    g.Yc = function(a) {
        $(this, "mediaUrl", {mediaUrl: a})
    };
    g.Vc = function() {
        $(this, "pause")
    };
    g.Wc = function() {
        $(this, "resume")
    };
    g.ib = function() {
        this.G()
    };
    g.Qc = function() {
        return this.W
    };
    g.Rc = function() {
        return this.j
    };
    g.B = function() {
        $(this, "destroy");
        null != this.g && this.g.G();
        this.A.G();
        this.l.clear();
        this.m && (Fd(this.m.b), this.m.G());
        Z.T.B.call(this)
    };
    var wh = function() {
    };
    wh.prototype.disableClickThrough = !1;
    wh.prototype.mimeTypes = null;
    wh.prototype.restoreCustomPlaybackStateOnAdBreakComplete = !1;
    var xh = function(a, b, c) {
        I.call(this, "adsManagerLoaded");
        this.g = a;
        this.j = b;
        this.m = c || ""
    };
    v(xh, I);
    xh.prototype.k = function(a, b) {
        var c = this.g;
        c.R = a;
        null != b && (c.h = b);
        null != a.currentTime && (c.m = new ah(a), c.m.r("currentTimeUpdate", c.fc, !1, c), c.m.start());
        var d = {};
        null != b && Hb(d, b);
        c.F && (d.useVideoAdUi = !1, d.disableClickThrough = !0);
        $(c, "configure", {adsRenderingSettings: d});
        return this.g
    };
    xh.prototype.l = function() {
        return this.j
    };
    xh.prototype.o = function() {
        return this.m
    };
    var yh = function(a) {
        N.call(this);
        this.g = a || "goog_" + za++;
        this.b = []
    };
    v(yh, N);
    yh.prototype.k = !1;
    yh.prototype.connect = function() {
        for (this.k = !0; 0 != this.b.length; ) {
            var a = this.b.shift();
            zh(this, a.name, a.type, a.data)
        }
    };
    yh.prototype.send = function(a, b, c) {
        this.k ? zh(this, a, b, c) : this.b.push({name: a,type: b,data: c})
    };
    var Ah = function(a, b, c, d, e) {
        I.call(this, a);
        this.H = b;
        this.I = c;
        this.ya = d;
        this.gb = e
    };
    v(Ah, I);
    Ah.prototype.toString = function() {
        return ""
    };
    var Bh = function(a, b) {
        yh.call(this, b);
        this.h = a;
        this.V = null;
        this.j = new V(this);
        this.j.r(M(), "message", this.l)
    };
    v(Bh, yh);
    var Ch = function(a) {
        if (null == a || !t(a) || 0 != a.lastIndexOf("ima://", 0))
            return null;
        a = a.substr(6);
        try {
            return lf(a)
        } catch (b) {
            return null
        }
    }, zh = function(a, b, c, d) {
        null != a.V && null != a.V.postMessage && a.V.postMessage(Dh(a, b, c, d), "*");
        null != a.V && null == a.V.postMessage && Ng(Kg.getInstance(), 11)
    };
    Bh.prototype.B = function() {
        this.j.G();
        Bh.T.B.call(this)
    };
    Bh.prototype.l = function(a) {
        a = a.g;
        var b = Ch(a.data);
        if (null != b) {
            if (null == this.V)
                this.V = a.source;
            else if (this.V != a.source)
                return;
            var c = b.channel;
            null != c && c == this.h && (c = b.sid, null != c && ("*" != this.g && c != this.g || this.dispatchEvent(new Ah(b.name, b.type, b.data || {}, b.sid, a.origin))))
        }
    };
    var Dh = function(a, b, c, d) {
        var e = {};
        e.name = b;
        e.type = c;
        null != d && (e.data = d);
        e.sid = a.g;
        e.channel = a.h;
        return "ima://" + of(e)
    };
    var Eh = function(a, b) {
        N.call(this);
        this.j = a;
        this.h = b;
        this.b = {};
        this.g = new V(this);
        this.g.r(M(), "message", this.k)
    };
    v(Eh, N);
    Eh.prototype.send = function(a) {
        var b = a.g;
        this.b.hasOwnProperty(b) && this.b[b].send(a.type, a.H, a.I)
    };
    var Gh = function(a, b, c, d) {
        a.b.hasOwnProperty(b) || (c = new Bh(b, c), a.g.r(c, a.j, function(a) {
            this.dispatchEvent(new Fh(a.type, a.H, a.I, a.ya, a.gb, b))
        }), c.V = d, c.connect(), a.b[b] = c)
    };
    Eh.prototype.B = function() {
        this.g.G();
        for (var a in this.b)
            Ac(this.b[a]);
        Eh.T.B.call(this)
    };
    Eh.prototype.k = function(a) {
        a = a.g;
        var b = Ch(a.data);
        if (null != b) {
            var c = b.channel;
            if (this.h && !this.b.hasOwnProperty(c)) {
                var d = b.sid;
                Gh(this, c, d, a.source);
                this.dispatchEvent(new Fh(b.name, b.type, b.data || {}, d, a.origin, c))
            }
        }
    };
    var Fh = function(a, b, c, d, e, f) {
        Ah.call(this, a, b, c, d, e);
        this.g = f
    };
    v(Fh, Ah);
    var Ih = function() {
        var a = aa("google.ima.gptProxyInstance", M());
        if (null != a)
            return a;
        V.call(this);
        this.h = new Eh("gpt", !0);
        zc(this, ia(Ac, this.h));
        this.r(this.h, "gpt", this.l);
        this.b = null;
        Hh() || M().top === M() || (this.b = new Eh("gpt", !1), zc(this, ia(Ac, this.b)), this.r(this.b, "gpt", this.k))
    };
    v(Ih, V);
    var Hh = function() {
        return !!aa("googletag.cmd", M())
    }, Jh = function() {
        var a = aa("googletag.console", M());
        return null != a ? a : null
    };
    Ih.prototype.l = function(a) {
        var b = a.gb, c = bc("//imasdk.googleapis.com"), b = bc(b);
        if (c[3] == b[3] && c[4] == b[4])
            if (null != this.b)
                Gh(this.b, a.g, a.ya, M().parent), null != this.b && this.b.send(a);
            else if (c = a.I, null != c && p(c.scope)) {
                var b = c.scope, c = c.args, d;
                if ("proxy" == b)
                    c = a.H, "isGptPresent" == c ? d = Hh() : "isConsolePresent" == c && (d = null != Jh());
                else if (Hh())
                    if ("pubads" == b || "companionAds" == b) {
                        d = a.H;
                        var e, f = M().googletag;
                        if (null != f && null != f[b] && (f = f[b](), null != f && (d = f[d], null != d)))
                            try {
                                e = d.apply(f, c)
                            } catch (h) {
                            }
                        d = e
                    } else if ("console" == 
                    b) {
                        if (f = a.H, e = Jh(), null != e && (f = e[f], null != f))
                            try {
                                f.apply(e, c)
                            } catch (k) {
                            }
                    } else if (null === b) {
                        e = a.H;
                        d = M();
                        if (0 <= Pa(["googleGetCompanionAdSlots", "googleSetCompanionAdContents"], e) && (e = d[e], null != e))
                            try {
                                f = e.apply(d, c)
                            } catch (n) {
                            }
                        d = f
                    }
                p(d) && (a.I.returnValue = d, this.h.send(a))
            }
    };
    Ih.prototype.k = function(a) {
        this.h.send(a)
    };
    var Kh = function() {
        N.call(this)
    };
    v(Kh, N);
    var Lh = {td: "beginFullscreen",CLICK: "click",ud: "end",vd: "endFullscreen",ERROR: "error",Dd: "mediaLoadTimeout",Bb: "pause",Jd: "play",Md: "skip",Cb: "start",Pd: "timeUpdate",Rd: "volumeChange"};
    var Mh = function(a, b, c, d, e, f, h, k) {
        this.h = a;
        this.j = b;
        this.k = c;
        this.o = h;
        this.l = d;
        this.m = e;
        this.b = f;
        this.g = k
    };
    var Oh = function(a, b) {
        var c = Array.prototype.slice.call(arguments), d = c.shift();
        if ("undefined" == typeof d)
            throw Error("[goog.string.format] Template required");
        return d.replace(/%([0\-\ \+]*)(\d+)?(\.(\d+))?([%sfdiu])/g, function(a, b, d, k, n, m, s, F) {
            if ("%" == m)
                return "%";
            var C = c.shift();
            if ("undefined" == typeof C)
                throw Error("[goog.string.format] Not enough arguments");
            arguments[0] = C;
            return Nh[m].apply(null, arguments)
        })
    }, Nh = {s: function(a, b, c) {
            return isNaN(c) || "" == c || a.length >= c ? a : a = -1 < b.indexOf("-", 0) ? a + Array(c - 
            a.length + 1).join(" ") : Array(c - a.length + 1).join(" ") + a
        },f: function(a, b, c, d, e) {
            d = a.toString();
            isNaN(e) || "" == e || (d = a.toFixed(e));
            var f;
            f = 0 > a ? "-" : 0 <= b.indexOf("+") ? "+" : 0 <= b.indexOf(" ") ? " " : "";
            0 <= a && (d = f + d);
            if (isNaN(c) || d.length >= c)
                return d;
            d = isNaN(e) ? Math.abs(a).toString() : Math.abs(a).toFixed(e);
            a = c - d.length - f.length;
            return d = 0 <= b.indexOf("-", 0) ? f + d + Array(a + 1).join(" ") : f + Array(a + 1).join(0 <= b.indexOf("0", 0) ? "0" : " ") + d
        },d: function(a, b, c, d, e, f, h, k) {
            return Nh.f(parseInt(a, 10), b, c, d, 0, f, h, k)
        }};
    Nh.i = Nh.d;
    Nh.u = Nh.d;
    var Qh = function(a, b) {
        N.call(this);
        this.j = new V(this);
        this.q = !1;
        this.w = "goog_" + za++;
        this.l = new A;
        var c = this.w, c = Oc("iframe", {src: ("https:" == document.location.protocol ? "https:" : "http:") + Oh("//imasdk.googleapis.com/js/core/bridge3.1.76_%s.html", Dc.Wa()) + "#" + c,style: "border:0; opacity:0; margin:0; padding:0; position:relative;"});
        Xf(this.j, c, "load", this.Lb, void 0);
        a.appendChild(c);
        this.g = c;
        this.k = Ph(this);
        this.m = b;
        this.b = this.m.j;
        this.h = null;
        this.j.r(this.k, "mouse", this.A);
        this.j.r(this.k, "touch", this.Ob);
        null != this.b && (this.j.r(this.k, "displayContainer", this.Mb), this.j.r(this.k, "videoDisplay", this.Nb), this.j.r(this.b, Bb(Lh), this.Pb));
        var c = M(), d = aa("google.ima.gptProxyInstance", c);
        null == d && (d = new Ih, q("google.ima.gptProxyInstance", d, c))
    };
    v(Qh, N);
    var Ph = function(a, b) {
        var c = b || "*", d = a.l.get(c);
        null == d && (d = new Bh(a.w, c), a.q && (d.V = Sc(a.g), d.connect()), Ib(a.l, c, d));
        return d
    };
    Qh.prototype.B = function() {
        this.j.G();
        null !== this.h && (this.h.G(), this.h = null);
        xb(this.l.wa(!1), function(a) {
            a.G()
        });
        this.l.clear();
        Qc(this.g);
        Qh.T.B.call(this)
    };
    Qh.prototype.A = function(a) {
        var b = a.I, c = Yc(this.g), d = document.createEvent("MouseEvent");
        d.initMouseEvent(a.H, !0, !0, window, b.detail, b.screenX, b.screenY, b.clientX + c.x, b.clientY + c.y, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, b.button, null);
        if (!de || eg() || 0 == document.webkitIsFullScreen)
            this.g.blur(), window.focus();
        this.g.dispatchEvent(d)
    };
    var Rh = function(a, b) {
        var c = Yc(a.g), d = Ra(b, function(a) {
            return document.createTouch(window, this.g, a.identifier, a.pageX + c.x, a.pageY + c.y, a.screenX, a.screenY)
        }, a);
        return document.createTouchList.apply(document, d)
    };
    g = Qh.prototype;
    g.Ob = function(a) {
        var b = a.I, c = Yc(this.g), d = document.createEvent("TouchEvent");
        d.initTouchEvent(a.H, !0, !0, window, b.detail, b.screenX, b.screenY, b.clientX + c.x, b.clientY + c.y, b.ctrlKey, b.altKey, b.shiftKey, b.metaKey, Rh(this, b.touches), Rh(this, b.targetTouches), Rh(this, b.changedTouches), b.scale, b.rotation);
        this.g.dispatchEvent(d)
    };
    g.Nb = function(a) {
        if (null != this.b) {
            var b = a.I;
            switch (a.H) {
                case "startTracking":
                    this.b.ub();
                    break;
                case "stopTracking":
                    this.b.qa();
                    break;
                case "exitFullscreen":
                    this.b.rb();
                    break;
                case "play":
                    this.b.za();
                    break;
                case "pause":
                    this.b.tb();
                    break;
                case "load":
                    this.b.sb(b.videoUrl, b.mimeType);
                    break;
                case "setCurrentTime":
                    this.b.va(b.currentTime);
                    break;
                case "setPlaybackOptions":
                    a = b.playbackOptions, this.b.vb(new Mh(a.adFormat, a.adSenseAgcid, a.ctaAnnotationTrackingEvents, a.showAnnotations, a.viewCountsDisabled, a.loadVideoTimeout, 
                    a.ibaDisabled, a.enablePreloading))
            }
        }
    };
    g.Pb = function(a) {
        var b = {};
        switch (a.type) {
            case "beginFullscreen":
                a = "fullscreen";
                break;
            case "endFullscreen":
                a = "exitFullscreen";
                break;
            case "click":
                a = "click";
                break;
            case "end":
                a = "end";
                break;
            case "error":
                a = "error";
                break;
            case "mediaLoadTimeout":
                a = "mediaLoadTimeout";
                break;
            case "pause":
                a = "pause";
                b.ended = this.b.xa();
                break;
            case "play":
                a = "play";
                break;
            case "skip":
                a = "skip";
                break;
            case "start":
                a = "start";
                break;
            case "timeUpdate":
                a = "timeupdate";
                b.currentTime = this.b.da();
                b.duration = this.b.Na();
                break;
            case "volumeChange":
                a = 
                "volumeChange";
                b.volume = this.b.pb();
                break;
            default:
                return
        }
        this.k.send("videoDisplay", a, b)
    };
    g.Mb = function(a) {
        switch (a.H) {
            case "showVideo":
                null != this.h ? gh(this.h) : (this.h = new ch, this.j.r(this.h, "click", this.cc));
                eh(this.h, vh(this.m));
                a = this.m;
                null != a.b && (a = a.b.b, null != a && (a.style.display = "block"));
                break;
            case "hide":
                null !== this.h && (this.h.G(), this.h = null), a = this.m, null != a.b && (a = a.b.b, null != a && (a.style.display = "none"))
        }
    };
    g.cc = function() {
        this.k.send("displayContainer", "videoClick")
    };
    g.Lb = function() {
        xb(this.l.wa(!1), function(a) {
            a.V = Sc(this.g);
            a.connect()
        }, this);
        this.q = !0
    };
    (function() {
        if (!Ab(function(a) {
            return a.match(M().location.href)
        })) {
            var a = Jc();
            if (null == Ua(a, function(a) {
                //return Ab(function(c) {
                //    return c.match(a.src)
                //})
		return true;
            }))
                throw Error("IMA SDK is either not loaded from a google domain or is not a supported version.");
        }
    })();
    var Sh = function(a) {
        N.call(this);
        this.b = a;
        this.h = new A;
        this.g = this.b.k;
        this.j = new V(this);
        if (this.g) {
            a = jg();
            var b = Ph(this.g);
            a.g || (a.b = b || null, a.b && a.j.r(a.b, "activityMonitor", a.k), a.g = !0);
            b = String(Math.floor(1E9 * Math.random()));
            Ib(a.h, b, this.b.w);
            this.k = b
        }
        var c;
        t: {
            try {
                c = window.top.location.href
            } catch (d) {
                c = 2;
                break t
            }
            c = null != c ? c == window.document.location.href ? 0 : 1 : 2
        }
        Ug.b = c
    };
    v(Sh, N);
    g = Sh.prototype;
    g.B = function() {
        this.j.G();
        var a = jg();
        Lb(a.h, this.k);
        Sh.T.B.call(this)
    };
    g.gd = function() {
        this.G()
    };
    g.jd = function(a, b) {
        a.adTagUrl && Ng(Kg.getInstance(), 8, {adtagurl: a.adTagUrl,customPlayback: this.b.o(),customClick: null != this.b.g,restrict: Dc.ta()});
        var c;
        try {
            c = window.top.location.href
        } catch (d) {
            c = window.location.href
        }
        a.location = c;
        a.referrer = window.document.referrer;
        a.supportsYouTubeHosted = this.b.q();
        c = a.adTagUrl;
        var e;
        if (e = null != c) {
            e = c.search(cc);
            var f;
            n: {
                for (f = 0; 0 <= (f = c.indexOf("client", f)) && f < e; ) {
                    var h = c.charCodeAt(f - 1);
                    if (38 == h || 63 == h)
                        if (h = c.charCodeAt(f + 6), !h || 61 == h || 38 == h || 35 == h)
                            break n;
                    f += 7
                }
                f = 
                -1
            }
            if (0 > f)
                c = null;
            else {
                h = c.indexOf("&", f);
                if (0 > h || h > e)
                    h = e;
                f += 7;
                c = decodeURIComponent(c.substr(f, h - f).replace(/\+/g, " "))
            }
            e = "ca-pub-6219811747049371" != c
        }
        e ? c = null : (c = aa("window.yt.util.activity.getTimeSinceActive"), c = null != c ? c().toString() : null);
        null != c && (a.lastActivity = c);
        c = a.adTagUrl;
        if (null != c) {
            e = new dc(c);
            c = e.ua;
            e = e.aa;
            f = e.length - 27;
            if (e = 0 <= f && e.indexOf("googleads.g.doubleclick.net", f) == f)
                e = la(wa(c)) ? !1 : /\/pagead\/ads/.test(c);
            c = e
        } else
            c = !1;
        if (c) {
            c = window;
            e = Na().document;
            f = {};
            var k, n, h = kb(window);
            if (k = wc())
                k = {url: k,La: !0};
            else if (k = h.location.href, h == h.top)
                k = {url: k,La: !0};
            else {
                n = !1;
                var m = h.document;
                m && m.referrer && (k = m.referrer, h.parent == h.top && (n = !0));
                (m = h.location.ancestorOrigins) && (m = m[m.length - 1]) && -1 == k.indexOf(m) && (n = !1, k = m);
                k = {url: k,La: n}
            }
            t: {
                n = Na();
                var m = c.Rb || n.Rb, s = c.Qb || n.Qb;
                if (n.top == n)
                    n = !1;
                else {
                    var F = e.documentElement;
                    if (m && s) {
                        var C = 1, Ba = 1;
                        n.innerHeight ? (C = n.innerWidth, Ba = n.innerHeight) : F && F.clientHeight ? (C = F.clientWidth, Ba = F.clientHeight) : e.body && (C = e.body.clientWidth, Ba = e.body.clientHeight);
                        if (Ba > 2 * s || C > 2 * m) {
                            n = !1;
                            break t
                        }
                    }
                    n = !0
                }
            }
            k = k.La;
            m = Na();
            m = m.top == m ? 0 : Fa(m.top) ? 1 : 2;
            s = 4;
            n || 1 != m ? n || 2 != m ? n && 1 == m ? s = 7 : n && 2 == m && (s = 8) : s = 6 : s = 5;
            k && (s |= 16);
            f.pd = "" + s;
            if (!c.Ka && "ad.yieldmanager.com" == e.domain) {
                for (k = e.URL.substring(e.URL.lastIndexOf("http")); -1 < k.indexOf("%"); )
                    try {
                        k = decodeURIComponent(k)
                    } catch (tb) {
                        break
                    }
                c.Ka = k
            }
            !wc() && c.Ka ? (f.eb = c.Ka, f.Tb = xc(e, n) || "EMPTY") : (f.eb = xc(e, n), f.Tb = null);
            f.qd = e.URL == f.eb ? Date.parse(e.lastModified) / 1E3 : null;
            f.rd = h == h.top ? h.document.referrer : wc(!0) || "";
            a.adSenseParams = 
            f
        }
        e = "goog_" + za++;
        Ib(this.h, e, b || null);
        c = {};
        Hb(c, a);
        c.settings = {allowVpaid: this.ca().b,autoPlayAdBreaks: this.ca().cb(),chromelessPlayer: !1,companionBackfill: this.ca().$a(),isAdMob: !1,isYouTube: !1,numRedirects: this.ca().ab(),onScreenDetection: !0,ppid: this.ca().bb(),restrictToCustomPlayback: this.ca().ta()};
        f = this.b.j;
        c.videoEnvironment = {iframeState: Ug.b,osdId: this.k,supportedMimeTypes: null != f ? f.Za() : null,usesChromelessPlayer: this.b.F(),usesCustomVideoPlayback: this.b.o(),usesYouTubePlayer: this.b.q()};
        e = Ph(this.g, e);
        this.j.r(e, "adsLoader", this.Sb);
        e.send("adsLoader", "requestAds", c)
    };
    g.ca = function() {
        return Dc
    };
    g.fd = function() {
        Ph(this.g).send("adsLoader", "contentComplete")
    };
    g.Sb = function(a) {
        switch (a.H) {
            case "adsLoaded":
                var b = a.I;
                a = a.ya;
                var c = new Z(this.b, b.adCuePoints, b.isCustomClickTrackingAllowed, Ph(this.g, a));
                this.dispatchEvent(new xh(c, this.h.get(a), b.response));
                break;
            case "error":
                b = a.I, a = a.ya, c = new H(b.type, b.errorMessage, b.errorCode), null != b.innerError && (c.g = Error(b.innerError)), this.dispatchEvent(new Bc(c, this.h.get(a))), Ng(Kg.getInstance(), 7, {error: b.errorCode}, !0)
        }
    };
    var Th = function(a) {
        this.g = 0;
        this.h = a || 100;
        this.b = []
    };
    g = Th.prototype;
    g.get = function(a) {
        if (a >= this.b.length)
            throw Error("Out of bounds exception");
        a = this.b.length < this.h ? a : (this.g + Number(a)) % this.h;
        return this.b[a]
    };
    g.ga = function() {
        return this.b.length
    };
    g.isEmpty = function() {
        return 0 == this.b.length
    };
    g.clear = function() {
        this.g = this.b.length = 0
    };
    g.ba = function() {
        for (var a = this.ga(), b = this.ga(), c = [], a = this.ga() - a; a < b; a++)
            c.push(this.get(a));
        return c
    };
    g.ka = function() {
        for (var a = [], b = this.ga(), c = 0; c < b; c++)
            a[c] = c;
        return a
    };
    var Uh = function(a) {
        N.call(this);
        this.b = a;
        this.M = "";
        this.l = -1;
        this.O = new Th(4);
        this.w = this.N = 0;
        this.K = this.h = this.q = !1;
        this.F = this.ra();
        this.A = this.sa();
        this.R = 15E3;
        this.D = !1
    };
    v(Uh, Kh);
    g = Uh.prototype;
    g.Za = function() {
        return Qa(Bb(Cg), function(a) {
            return !la(this.b.canPlayType(a))
        }, this)
    };
    g.vb = function(a) {
        this.R = 0 < a.b ? a.b : 15E3
    };
    g.qb = function(a) {
        this.b.seekable.length ? this.b.seekable.end(0) > this.l && (this.b.currentTime = this.l, a()) : setTimeout(u(this.qb, this), 100)
    };
    g.Ya = function() {
        this.M = this.b.currentSrc;
        this.b.ended ? this.l = -1 : this.l = this.b.currentTime
    };
    g.Xa = function(a) {
        if (0 <= this.l) {
            var b = this;
            this.b.addEventListener("loadedmetadata", function d() {
                b.qb(a);
                b.b.removeEventListener("loadedmetadata", d, !1)
            }, !1);
            this.b.src = this.M;
            this.b.load()
        }
    };
    g.sb = function(a) {
        Vh(this);
        this.b.src = a;
        this.b.load()
    };
    g.Oa = function(a) {
        this.b.volume = a
    };
    g.pb = function() {
        return this.b.volume
    };
    g.za = function() {
        this.D = !1;
        Gd(this.b.play, 0, this.b);
        this.J = Gd(this.gc, this.R, this)
    };
    g.tb = function() {
        this.D = !0;
        this.b.pause()
    };
    g.nb = function() {
        return this.b.paused ? eg() || ce ? this.b.currentTime < this.b.duration : !0 : !1
    };
    g.rb = function() {
        dg() && this.b.webkitDisplayingFullscreen && this.b.webkitExitFullscreen()
    };
    g.sa = function() {
        return kg(this.b)
    };
    g.va = function(a) {
        this.b.currentTime = a
    };
    g.da = function() {
        return this.b.currentTime
    };
    g.Na = function() {
        return isNaN(this.b.duration) ? -1 : this.b.duration
    };
    g.xa = function() {
        return this.b.ended
    };
    g.ra = function() {
        return new L(this.b.offsetWidth, this.b.offsetHeight)
    };
    g.B = function() {
        this.qa();
        this.b = null;
        Uh.T.B.call(this)
    };
    g.ub = function() {
        this.qa();
        this.g = new V(this);
        this.g.r(this.b, "canplay", this.Xb);
        this.g.r(this.b, "ended", this.Yb);
        this.g.r(this.b, "webkitbeginfullscreen", this.Ma);
        this.g.r(this.b, "webkitendfullscreen", this.jb);
        this.g.r(this.b, "pause", this.Zb);
        this.g.r(this.b, "playing", this.$b);
        this.g.r(this.b, "timeupdate", this.ac);
        this.g.r(this.b, "volumechange", this.bc);
        this.g.r(this.b, "error", this.fb);
        this.k = new ch;
        this.g.r(this.k, "click", this.Vb);
        eh(this.k, this.b);
        this.m = new O(1E3);
        this.g.r(this.m, "tick", this.Wb);
        this.m.start()
    };
    g.qa = function() {
        null != this.k && (gh(this.k), this.k = null);
        null != this.m && this.m.G();
        null != this.g && (this.g.G(), this.g = null);
        Vh(this)
    };
    var Vh = function(a) {
        a.h = !1;
        a.K = !1;
        a.O.clear();
        l.clearTimeout(a.J);
        Ac(a.j)
    }, Wh = function(a) {
        a.h || (a.h = !0, l.clearTimeout(a.J), a.dispatchEvent("start"), (dg() && cg() && w(B, "Safari") || Ob && (!Ob || !fg(bg, 4)) || w(B, "CrKey") || w(B, "PlayStation") || w(B, "Roku") || gg() || w(B, "Xbox")) && Ob && (!Ob || !fg(bg, 3)) && (!dg() || eg() && fg(ag, 4)) && a.Ma())
    };
    g = Uh.prototype;
    g.Xb = function() {
        var a;
        if (a = de)
            a = B, a = !(a && (w(a, "SMART-TV") || w(a, "SmartTV")));
        a && !this.K && (this.va(.001), this.K = !0)
    };
    g.$b = function() {
        this.dispatchEvent("play");
        eg() || be || Wh(this)
    };
    g.ac = function() {
        if (!this.h && (eg() || be)) {
            if (0 >= this.da())
                return;
            if (be && this.xa() && 1 == this.Na()) {
                this.fb();
                return
            }
            Wh(this)
        }
        if (eg()) {
            if (!this.q && 1.5 < this.da() - this.N) {
                this.q = !0;
                this.va(this.w);
                return
            }
            this.N = this.da();
            this.q = !1;
            this.da() > this.w && (this.w = this.da())
        }
        var a = this.O;
        a.b[a.g] = this.b.currentTime;
        a.g = (a.g + 1) % a.h;
        this.dispatchEvent("timeUpdate")
    };
    g.bc = function() {
        this.dispatchEvent("volumeChange")
    };
    g.Zb = function() {
        var a;
        this.h && eg() && !this.D && 2 > Xh(this) ? (this.j = new O(250), this.g.r(this.j, "tick", this.dc), this.j.start(), a = !0) : a = !1;
        a || this.dispatchEvent("pause")
    };
    g.Yb = function() {
        var a = !0;
        eg() && (a = this.w >= this.b.duration - 1.5);
        !this.q && a && this.dispatchEvent("end")
    };
    g.Ma = function() {
        this.dispatchEvent("beginFullscreen")
    };
    g.jb = function() {
        this.dispatchEvent("endFullscreen")
    };
    g.fb = function() {
        l.clearTimeout(this.J);
        this.dispatchEvent("error")
    };
    g.Vb = function() {
        this.dispatchEvent("click")
    };
    g.Wb = function() {
        var a = this.ra(), b = this.sa();
        if (a.width != this.F.width || a.height != this.F.height)
            !this.A && b ? this.Ma() : this.A && !b && this.jb(), this.F = a, this.A = b
    };
    g.gc = function() {
        if (!this.h) {
            try {
                Ng(Kg.getInstance(), 16)
            } catch (a) {
            }
            Vh(this);
            this.dispatchEvent("mediaLoadTimeout")
        }
    };
    g.dc = function() {
        if (this.xa() || !this.nb())
            Ac(this.j);
        else {
            var a = this.b.duration - this.b.currentTime, b = Xh(this);
            0 < b && (2 <= b || 2 > a) && (Ac(this.j), this.za())
        }
    };
    var Xh = function(a) {
        var b;
        t: {
            for (b = a.b.buffered.length - 1; 0 <= b; ) {
                if (a.b.buffered.start(b) <= a.b.currentTime) {
                    b = a.b.buffered.end(b);
                    break t
                }
                b--
            }
            b = 0
        }
        return b - a.b.currentTime
    };
    var Yh = function(a, b) {
        if (null == a || !Rc(Hc(a), a))
            throw $g(Zg, null, "containerElement", "element");
        this.k = a;
        this.g = this.b = null;
        this.j = b;
        this.h = null;
        this.b = Oc("div", {style: "display:none;"});
        var c = Oc("video", {style: "background-color:#000;position:absolute;width:100%;height:100%;"});
        c.setAttribute("webkit-playsinline", !0);
        this.g = c;
        this.h = Oc("div", {style: "position:absolute;width:100%;height:100%;"});
        this.k.appendChild(this.b);
        this.b.appendChild(this.g);
        this.j && (c = Oc("div", {id: this.j,style: "display:none;background-color:#000;position:absolute;width:100%;height:100%;"}), 
        this.b.appendChild(c));
        this.b.appendChild(this.h)
    };
    v(Yh, yc);
    Yh.prototype.G = function() {
        Qc(this.b)
    };
    var Zh = function(a) {
        if (la(wa(a)))
            return null;
        var b = a.match(/^https?:\/\/[^\/]*youtu\.be\/([a-zA-Z0-9_-]+)$/);
        if (null != b && 2 == b.length)
            return b[1];
        b = a.match(/^https?:\/\/[^\/]*youtube.com\/video\/([a-zA-Z0-9_-]+)$/);
        if (null != b && 2 == b.length)
            return b[1];
        b = a.match(/^https?:\/\/[^\/]*youtube.com\/watch\/([a-zA-Z0-9_-]+)$/);
        if (null != b && 2 == b.length)
            return b[1];
        a = (new dc(a)).b;
        return vc(a, "v") ? a.get("v").toString() : vc(a, "video_id") ? a.get("video_id").toString() : null
    };
    var ai = function(a) {
        N.call(this);
        this.F = "ima-chromeless-video";
        var b = null;
        null != a && (t(a) ? this.F = a : b = a);
        this.D = new V(this);
        this.k = null;
        this.j = !1;
        this.R = this.ra();
        this.O = this.sa();
        this.m = -1;
        this.N = !1;
        this.l = -1;
        this.g = this.J = this.q = null;
        this.Y = "";
        this.h = !1;
        this.Z = null != b;
        this.w = this.M = this.b = null;
        this.A = void 0;
        this.W = null;
        null != b ? (this.h = !0, this.b = b, this.A = 2) : (a = u(this.Kb, this), $h ? a() : (Va.push(a), a = document.createElement("script"), a.src = "https://www.youtube.com/iframe_api", b = document.getElementsByTagName("script")[0], 
        b.parentNode.insertBefore(a, b)))
    };
    v(ai, Kh);
    var bi = {el: "adunit",controls: 0,html5: 1,playsinline: 1,showinfo: 0}, Va = [], $h = !1;
    g = ai.prototype;
    g.vb = function(a) {
        this.g = a
    };
    g.sb = function(a, b) {
        null !== a && (this.Y = a, this.h ? ci(this, a, b) : (this.q = a, this.J = b))
    };
    g.Oa = function(a) {
        this.Z ? this.dispatchEvent("volumeChange") : this.h ? (a = Math.min(Math.max(100 * a, 0), 100), this.b.setVolume(a), this.l = -1, this.dispatchEvent("volumeChange")) : this.l = a
    };
    g.pb = function() {
        return this.h ? this.b.getVolume() / 100 : this.l
    };
    g.za = function() {
        if (!la(wa(this.Y))) {
            if (!this.j) {
                di(this);
                var a = 15E3;
                null != this.g && 0 < this.g.b && (a = this.g.b);
                this.ja = Gd(this.na, a, this)
            }
            this.h ? (this.N = !1, ei(this), this.k = new O(100), this.D.r(this.k, "tick", this.ha), this.k.start(), this.g && this.g.g ? this.b.loadVideoByPlayerVars(this.W) : this.b.playVideo()) : this.N = !0
        }
    };
    g.tb = function() {
        this.h && this.j && (ei(this), this.b.pauseVideo())
    };
    g.nb = function() {
        return this.h ? 2 == this.b.getPlayerState(this.A) : !1
    };
    g.rb = function() {
    };
    g.sa = function() {
        var a = document.getElementById(this.F);
        return a ? kg(a) : !1
    };
    g.va = function(a) {
        this.h ? this.b.seekTo(a, !1) : this.m = a
    };
    g.da = function() {
        return this.h ? this.b.getCurrentTime(this.A) : -1
    };
    g.Na = function() {
        return this.h && this.j ? this.b.getDuration(this.A) : -1
    };
    g.Za = function() {
        return Bb(Cg)
    };
    g.xa = function() {
        return this.h ? 0 == this.b.getPlayerState(this.A) : !1
    };
    g.ra = function() {
        var a = document.getElementById(this.F);
        return a ? new L(a.offsetWidth, a.offsetHeight) : new L(0, 0)
    };
    g.ec = function() {
        var a = this.ra(), b = this.sa();
        if (a.width != this.R.width || a.height != this.R.height)
            !this.O && b ? this.dispatchEvent("beginFullscreen") : this.O && !b && this.dispatchEvent("endFullscreen"), this.R = a, this.O = b
    };
    g.ub = function() {
        this.M = u(this.ia, this);
        this.w = u(this.U, this);
        this.Z && (this.b.addEventListener("onAdStateChange", this.w), this.b.addEventListener("onReady", this.M), this.b.addEventListener("onStateChange", this.w));
        this.K = new O(1E3);
        this.D.r(this.K, "tick", this.ec);
        this.K.start()
    };
    g.qa = function() {
        this.Z && (this.b.removeEventListener("onAdStateChange", this.w), this.b.removeEventListener("onReady", this.M), this.b.removeEventListener("onStateChange", this.w));
        null != this.K && this.K.G()
    };
    g.Kb = function() {
        var a = this.F, b = {playerVars: Fb(bi),events: {onError: u(this.oa, this),onReady: u(this.ia, this),onAdStateChange: u(this.U, this),onStateChange: u(this.U, this)}}, c = aa("YT");
        this.b = null != c && null != c.Player ? new c.Player(a, b) : null
    };
    var ci = function(a, b, c) {
        var d = {};
        if (null != a.g) {
            var e = a.g.j;
            null != e && (d.agcid = e);
            e = a.g.h;
            null != e && (d.adformat = e);
            (e = a.g.k) && (d.cta_conversion_urls = e);
            d.iv_load_policy = a.g.l ? 1 : 3;
            a.g.o && (d.noiba = 1);
            a.g.m && (d.utpsa = 1)
        }
        null != b ? Hg(Dg, b) ? (e = b.match(/yt_vid\/([a-zA-Z0-9_-]{11})/), e = null != e && 1 < e.length ? e[1] : null) : e = null != b && Hg(Eg, b) ? Zh(b) : null : e = null;
        null === e ? d.url_encoded_third_party_media = "url=" + encodeURIComponent(b) + "&type=" + encodeURIComponent(null === c ? "" : c) : d.videoId = e;
        a.j = !1;
        a.g && a.g.g ? (a.W = d, a.b.preloadVideoByPlayerVars(a.W)) : 
        a.b.cueVideoByPlayerVars(d)
    };
    ai.prototype.oa = function() {
        this.dispatchEvent("error")
    };
    ai.prototype.ia = function() {
        this.h = !0;
        -1 != this.l && (this.Oa(this.l), this.l = -1);
        null != this.q && (ci(this, this.q, this.J), this.J = this.q = null);
        -1 != this.m && (this.va(this.m), this.m = -1);
        this.N && this.za()
    };
    ai.prototype.U = function(a) {
        switch (a.data) {
            case 0:
                this.j ? this.dispatchEvent("end") : this.dispatchEvent("error");
                break;
            case 1:
                this.j || (di(this), this.j = !0, this.dispatchEvent("start"));
                this.dispatchEvent("play");
                break;
            case 2:
                this.dispatchEvent("pause")
        }
    };
    var ei = function(a) {
        a.D.Ca(a.k, "tick", a.ha);
        null != a.k && (Fd(a.k), a.k = null)
    }, di = function(a) {
        null != a.ja && l.clearTimeout(a.ja)
    };
    ai.prototype.ha = function() {
        this.dispatchEvent("timeUpdate")
    };
    ai.prototype.na = function() {
        this.dispatchEvent("mediaLoadTimeout")
    };
    ai.prototype.B = function() {
        ei(this);
        di(this);
        this.qa();
        this.h = !1;
        this.D.G();
        this.m = -1;
        this.J = null;
        this.N = !1;
        this.q = null;
        this.l = -1;
        this.M = this.b = this.g = null;
        this.j = !1;
        this.Y = "";
        ai.T.B.call(this)
    };
    q("onYouTubeIframeAPIReady", function() {
        $h = !0;
        y(Va, function(a) {
            a()
        });
        Wa()
    }, window);
    var fi = function(a, b, c, d) {
        if (null == a || !Rc(Hc(a), a))
            throw $g(Zg, null, "containerElement", "element");
        var e = null != b || null != d;
        if (!e && Dc.ta())
            throw $g(Yg, null, "Custom video element was not provided even though the setting restrictToCustomPlayback is set to true.");
        var f = e, h;
        (h = Dc.ta()) || (h = (eg() || Ob && !(Ob && fg(bg, 4)) || w(B, "CrKey") || w(B, "PlayStation") || w(B, "Roku") || gg() || w(B, "Xbox")) && e);
        h || (f = !1);
        this.D = (this.l = f) && null != d;
        e = Oc("div", {style: "position:absolute"});
        a.insertBefore(e, a.firstChild);
        this.h = e;
        this.b = 
        !this.l && this.h && cg() ? new Yh(this.h, null) : null;
        a = null;
        this.l ? b ? a = new Uh(b) : d && (a = new ai(d)) : this.b && (a = new Uh(this.b.g));
        this.g = (this.j = a) ? c || null : null;
        this.m = null != this.g;
        Ng(Kg.getInstance(), 8, {enabled: this.l,yt: null != d,customClick: null != this.g});
        var k;
        this.l && b ? k = b : k = this.h;
        this.w = k;
        this.k = null != this.h ? new Qh(this.h, this) : null
    };
    fi.prototype.P = function() {
        null != this.b && cg() && this.b.g.load()
    };
    fi.prototype.A = function() {
        Ac(this.b);
        Ac(this.k);
        Ac(this.j);
        Qc(this.h)
    };
    var vh = function(a) {
        return a.m && a.g ? a.g : null != a.b ? a.b.h : null
    };
    fi.prototype.o = function() {
        return this.l
    };
    fi.prototype.F = function() {
        return !1
    };
    fi.prototype.q = function() {
        return this.D
    };
    var gi = function() {
    };
    g = gi.prototype;
    g.clone = function() {
        var a = new gi;
        "auto" == this.videoPlayActivation ? a.setAdWillAutoPlay(!0) : "click" == this.videoPlayActivation && a.setAdWillAutoPlay(!1);
        a.adTagUrl = this.adTagUrl;
        a.adSenseParams = Fb(this.adSenseParams);
        a.adsResponse = this.adsResponse;
        a.kb = Fb(this.kb);
        a.isAdMob = this.isAdMob;
        a.isYouTube = this.isYouTube;
        a.location = this.location;
        a.g = this.g;
        a.h = this.h;
        a.language = this.language;
        a.linearAdSlotWidth = this.linearAdSlotWidth;
        a.linearAdSlotHeight = this.linearAdSlotHeight;
        a.nonLinearAdSlotWidth = this.nonLinearAdSlotWidth;
        a.nonLinearAdSlotHeight = this.nonLinearAdSlotHeight;
        a.tagForChildDirectedContent = this.tagForChildDirectedContent;
        a.usePostAdRequests = this.usePostAdRequests;
        a.lb = this.lb;
        a.youTubeAdType = this.youTubeAdType;
        a.youTubeExperimentIds = this.youTubeExperimentIds;
        a.youTubeVideoAdStartDelay = this.youTubeVideoAdStartDelay;
        this.b && (a.b = Ya(this.b));
        return a
    };
    g.adSenseParams = null;
    g.kb = null;
    g.videoPlayActivation = "unknown";
    g.isAdMob = !1;
    g.isYouTube = !1;
    g.linearAdSlotWidth = 0;
    g.linearAdSlotHeight = 0;
    g.nonLinearAdSlotWidth = 0;
    g.nonLinearAdSlotHeight = 0;
    g.tagForChildDirectedContent = !1;
    g.usePostAdRequests = !1;
    g.lb = !0;
    g.youTubeVideoAdStartDelay = 0;
    g.setAdWillAutoPlay = function(a) {
        this.videoPlayActivation = a ? "auto" : "click"
    };
    Y.prototype.getClickThroughUrl = Y.prototype.xb;
    Y.prototype.getCompanionAds = Y.prototype.Bc;
    Y.prototype.isLinear = Y.prototype.Lc;
    Y.prototype.isSkippable = Y.prototype.Mc;
    Y.prototype.getAdId = Y.prototype.yc;
    Y.prototype.getAdSystem = Y.prototype.Ac;
    Y.prototype.getContentType = Y.prototype.Cc;
    Y.prototype.getDescription = Y.prototype.oc;
    Y.prototype.getTitle = Y.prototype.pc;
    Y.prototype.getDuration = Y.prototype.hb;
    Y.prototype.getHeight = Y.prototype.Dc;
    Y.prototype.getWidth = Y.prototype.Ic;
    Y.prototype.getWrapperAdIds = Y.prototype.Jc;
    Y.prototype.getWrapperAdSystems = Y.prototype.Kc;
    Y.prototype.getTraffickingParameters = Y.prototype.Fc;
    Y.prototype.getTraffickingParametersString = Y.prototype.Gc;
    Y.prototype.getAdPodInfo = Y.prototype.zc;
    Y.prototype.getUiElements = Y.prototype.Hc;
    Y.prototype.getMinSuggestedDuration = Y.prototype.Ec;
    Vg.prototype.getCuePoints = Vg.prototype.b;
    q("google.ima.AdCuePoints.PREROLL", 0, window);
    q("google.ima.AdCuePoints.POSTROLL", -1, window);
    q("google.ima.AdDisplayContainer", fi, window);
    fi.prototype.initialize = fi.prototype.P;
    fi.prototype.destroy = fi.prototype.A;
    W.prototype.getPodIndex = W.prototype.vc;
    W.prototype.getTimeOffset = W.prototype.wc;
    W.prototype.getTotalAds = W.prototype.xc;
    W.prototype.getMaxDuration = W.prototype.uc;
    W.prototype.getAdPosition = W.prototype.sc;
    W.prototype.getIsBumper = W.prototype.tc;
    q("google.ima.AdError.ErrorCode.VIDEO_PLAY_ERROR", 400, window);
    q("google.ima.AdError.ErrorCode.FAILED_TO_REQUEST_ADS", 1005, window);
    q("google.ima.AdError.ErrorCode.REQUIRED_LISTENERS_NOT_ADDED", 900, window);
    q("google.ima.AdError.ErrorCode.VAST_LOAD_TIMEOUT", 301, window);
    q("google.ima.AdError.ErrorCode.VAST_NO_ADS_AFTER_WRAPPER", 303, window);
    q("google.ima.AdError.ErrorCode.VAST_MEDIA_LOAD_TIMEOUT", 402, window);
    q("google.ima.AdError.ErrorCode.VAST_TOO_MANY_REDIRECTS", 302, window);
    q("google.ima.AdError.ErrorCode.VAST_ASSET_MISMATCH", 403, window);
    q("google.ima.AdError.ErrorCode.VAST_LINEAR_ASSET_MISMATCH", 403, window);
    q("google.ima.AdError.ErrorCode.VAST_NONLINEAR_ASSET_MISMATCH", 503, window);
    q("google.ima.AdError.ErrorCode.VAST_ASSET_NOT_FOUND", 1007, window);
    q("google.ima.AdError.ErrorCode.VAST_UNSUPPORTED_VERSION", 102, window);
    q("google.ima.AdError.ErrorCode.VAST_SCHEMA_VALIDATION_ERROR", 101, window);
    q("google.ima.AdError.ErrorCode.VAST_TRAFFICKING_ERROR", 200, window);
    q("google.ima.AdError.ErrorCode.VAST_UNEXPECTED_LINEARITY", 201, window);
    q("google.ima.AdError.ErrorCode.INVALID_ARGUMENTS", 1101, window);
    q("google.ima.AdError.ErrorCode.UNKNOWN_AD_RESPONSE", 1010, window);
    q("google.ima.AdError.ErrorCode.UNKNOWN_ERROR", 900, window);
    q("google.ima.AdError.ErrorCode.OVERLAY_AD_PLAYING_FAILED", 500, window);
    q("google.ima.AdError.ErrorCode.VIDEO_ELEMENT_USED", -1, window);
    q("google.ima.AdError.ErrorCode.VIDEO_ELEMENT_REQUIRED", -1, window);
    q("google.ima.AdError.ErrorCode.VAST_MEDIA_ERROR", -1, window);
    q("google.ima.AdError.ErrorCode.ADSLOT_NOT_VISIBLE", -1, window);
    q("google.ima.AdError.ErrorCode.OVERLAY_AD_LOADING_FAILED", -1, window);
    q("google.ima.AdError.ErrorCode.VAST_MALFORMED_RESPONSE", -1, window);
    q("google.ima.AdError.ErrorCode.COMPANION_AD_LOADING_FAILED", -1, window);
    q("google.ima.AdError.Type.AD_LOAD", "adLoadError", window);
    q("google.ima.AdError.Type.AD_PLAY", "adPlayError", window);
    H.prototype.getErrorCode = H.prototype.zb;
    H.prototype.getVastErrorCode = H.prototype.qc;
    H.prototype.getInnerError = H.prototype.Qa;
    H.prototype.getMessage = H.prototype.Ab;
    H.prototype.getType = H.prototype.rc;
    q("google.ima.AdErrorEvent.Type.AD_ERROR", "adError", window);
    Bc.prototype.getError = Bc.prototype.k;
    Bc.prototype.getUserRequestContext = Bc.prototype.o;
    q("google.ima.AdEvent.Type.CONTENT_RESUME_REQUESTED", "contentResumeRequested", window);
    q("google.ima.AdEvent.Type.CONTENT_PAUSE_REQUESTED", "contentPauseRequested", window);
    q("google.ima.AdEvent.Type.CLICK", "click", window);
    q("google.ima.AdEvent.Type.EXPANDED_CHANGED", "expandedChanged", window);
    q("google.ima.AdEvent.Type.STARTED", "start", window);
    q("google.ima.AdEvent.Type.IMPRESSION", "impression", window);
    q("google.ima.AdEvent.Type.PAUSED", "pause", window);
    q("google.ima.AdEvent.Type.RESUMED", "resume", window);
    q("google.ima.AdEvent.Type.FIRST_QUARTILE", "firstquartile", window);
    q("google.ima.AdEvent.Type.MIDPOINT", "midpoint", window);
    q("google.ima.AdEvent.Type.THIRD_QUARTILE", "thirdquartile", window);
    q("google.ima.AdEvent.Type.COMPLETE", "complete", window);
    q("google.ima.AdEvent.Type.USER_CLOSE", "userClose", window);
    q("google.ima.AdEvent.Type.LOADED", "loaded", window);
    q("google.ima.AdEvent.Type.AD_METADATA", "adMetadata", window);
    q("google.ima.AdEvent.Type.AD_BREAK_READY", "adBreakReady", window);
    q("google.ima.AdEvent.Type.ALL_ADS_COMPLETED", "allAdsCompleted", window);
    q("google.ima.AdEvent.Type.SKIPPED", "skip", window);
    q("google.ima.AdEvent.Type.SKIPPABLE_STATE_CHANGED", "skippableStateChanged", window);
    q("google.ima.AdEvent.Type.LOG", "log", window);
    q("google.ima.AdEvent.Type.VOLUME_CHANGED", "volumeChange", window);
    q("google.ima.AdEvent.Type.VOLUME_MUTED", "mute", window);
    U.prototype.type = U.prototype.type;
    U.prototype.getAd = U.prototype.l;
    U.prototype.getAdData = U.prototype.m;
    bh.prototype.getAdCuePoints = bh.prototype.o;
    q("google.ima.AdsLoader", Sh, window);
    Sh.prototype.getSettings = Sh.prototype.ca;
    Sh.prototype.requestAds = Sh.prototype.jd;
    Sh.prototype.contentComplete = Sh.prototype.fd;
    Sh.prototype.destroy = Sh.prototype.gd;
    q("google.ima.AdsManagerLoadedEvent.Type.ADS_MANAGER_LOADED", "adsManagerLoaded", window);
    xh.prototype.getAdsManager = xh.prototype.k;
    xh.prototype.getUserRequestContext = xh.prototype.l;
    xh.prototype.getResponse = xh.prototype.o;
    q("google.ima.CompanionAdSelectionSettings", kh, window);
    q("google.ima.CompanionAdSelectionSettings.CreativeType.IMAGE", "Image", void 0);
    q("google.ima.CompanionAdSelectionSettings.CreativeType.FLASH", "Flash", void 0);
    q("google.ima.CompanionAdSelectionSettings.CreativeType.ALL", "All", void 0);
    q("google.ima.CompanionAdSelectionSettings.ResourceType.HTML", "Html", void 0);
    q("google.ima.CompanionAdSelectionSettings.ResourceType.IFRAME", "IFrame", void 0);
    q("google.ima.CompanionAdSelectionSettings.ResourceType.STATIC", "Static", void 0);
    q("google.ima.CompanionAdSelectionSettings.ResourceType.ALL", "All", void 0);
    q("google.ima.CompanionAdSelectionSettings.SizeCriteria.IGNORE", "IgnoreSize", void 0);
    q("google.ima.CompanionAdSelectionSettings.SizeCriteria.SELECT_EXACT_MATCH", "SelectExactMatch", void 0);
    q("google.ima.CompanionAdSelectionSettings.SizeCriteria.SELECT_NEAR_MATCH", "SelectNearMatch", void 0);
    q("google.ima.CustomContentLoadedEvent.Type.CUSTOM_CONTENT_LOADED", "deprecated-event", window);
    q("ima.ImaSdkSettings", J, window);
    q("google.ima.settings", Dc, window);
    J.prototype.setCompanionBackfill = J.prototype.cd;
    J.prototype.getCompanionBackfill = J.prototype.$a;
    J.prototype.setAutoPlayAdBreaks = J.prototype.bd;
    J.prototype.isAutoPlayAdBreak = J.prototype.cb;
    J.prototype.setPpid = J.prototype.ed;
    J.prototype.getPpid = J.prototype.bb;
    J.prototype.setVpaidAllowed = J.prototype.od;
    J.prototype.setRestrictToCustomPlayback = J.prototype.nd;
    J.prototype.isRestrictToCustomPlayback = J.prototype.ta;
    J.prototype.setNumRedirects = J.prototype.dd;
    J.prototype.getNumRedirects = J.prototype.ab;
    J.prototype.getLocale = J.prototype.Wa;
    J.prototype.setLocale = J.prototype.md;
    q("google.ima.ImaSdkSettings.CompanionBackfillMode.ALWAYS", "always", void 0);
    q("google.ima.ImaSdkSettings.CompanionBackfillMode.ON_MASTER_AD", "on_master_ad", void 0);
    q("google.ima.AdsRenderingSettings", wh, window);
    q("google.ima.AdsRenderingSettings.AUTO_SCALE", -1, window);
    q("google.ima.AdsRequest", gi, window);
    q("google.ima.VERSION", "3.1.76", void 0);
    q("google.ima.UiElements.AD_ATTRIBUTION", "adAttribution", void 0);
    q("google.ima.UiElements.COUNTDOWN", "countdown", void 0);
    q("google.ima.ViewMode.NORMAL", "normal", void 0);
    q("google.ima.ViewMode.FULLSCREEN", "fullscreen", void 0);
    Z.prototype.isCustomPlaybackUsed = Z.prototype.ld;
    Z.prototype.isCustomClickTrackingUsed = Z.prototype.kd;
    Z.prototype.destroy = Z.prototype.ib;
    Z.prototype.init = Z.prototype.Uc;
    Z.prototype.start = Z.prototype.start;
    Z.prototype.stop = Z.prototype.ad;
    Z.prototype.pause = Z.prototype.Vc;
    Z.prototype.resume = Z.prototype.Wc;
    Z.prototype.getCuePoints = Z.prototype.Qc;
    Z.prototype.getCurrentAd = Z.prototype.Rc;
    Z.prototype.getRemainingTime = Z.prototype.Sc;
    Z.prototype.expand = Z.prototype.Oc;
    Z.prototype.collapse = Z.prototype.Nc;
    Z.prototype.getAdSkippableState = Z.prototype.Pc;
    Z.prototype.resize = Z.prototype.mb;
    Z.prototype.skip = Z.prototype.$c;
    Z.prototype.getVolume = Z.prototype.Tc;
    Z.prototype.setVolume = Z.prototype.Zc;
    Z.prototype.setMediaUrl = Z.prototype.Yc;
    Z.prototype.sendImpressionUrls = Z.prototype.Xc;
    X.prototype.getContent = X.prototype.m;
    X.prototype.getContentType = X.prototype.g;
    X.prototype.getHeight = X.prototype.q;
    X.prototype.getWidth = X.prototype.w;
})();

