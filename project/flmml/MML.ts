/// <reference path="MFormant.ts" />
/// <reference path="MOscFcDpcm.ts" />
/// <reference path="MOscFcNoise.ts" />
/// <reference path="MOscFcTri.ts" />
/// <reference path="MOscGbLNoise.ts" />
/// <reference path="MOscGbSNoise.ts" />
/// <reference path="MOscGbWave.ts" />
/// <reference path="MOscillator.ts" />
/// <reference path="MOscMod.ts" />
/// <reference path="MOscNoise.ts" />
/// <reference path="MOscOPM.ts" />
/// <reference path="MOscPulse.ts" />
/// <reference path="MOscSaw.ts" />
/// <reference path="MOscSine.ts" />
/// <reference path="MOscTriangle.ts" />
/// <reference path="MOscWave.ts" />
/// <reference path="MTrack.ts" />
/// <reference path="MWarning.ts" />
/// <reference path="../messenger/Messenger.ts" />

module flmml {

    class SourceString {

        protected _source;
        protected _lineTail: number[];

        constructor(s:string) {
            this._source = s;
            this._lineTail = [];
            var ptrn = /\n/g;
            var m;
            while (m = ptrn.exec(s)) {
                this._lineTail.push(m.index + m[0].length);
            }
        }

        toLineColumn(i:number) {
            var l=0, i0=0;
            for (; l < this._lineTail.length; l++) {
                if (i < this._lineTail[l]) break;
                i0 = this._lineTail[l];
            }
            return {line:l, column:i-i0};
        }

    }

    type MapRef = { label:string; pos?:number; };

    class MapReference {
        pos: number;
        refs: MapRef[];
        constructor(pos:number) {
            this.pos = pos;
            this.refs = [];
        }
        clone() : MapReference {
            var r = new MapReference(this.pos);
            r.refs = this.refs.concat([]);
            return r;
        }
        pushRef(label:string, pos?:number) : MapReference {
            this.refs.push({label:label, pos:pos});
            return this;
        }
    };

    class MappedString {
        
        protected _str: string;
        protected _map: MapReference[];
        protected cache: string;

        constructor(s:string='') {
            this._str = s;
            this._map = [];
            for (var i=0; i<s.length; i++) {
                this._map.push(new MapReference(i));
            }
        }
        
        clone() : MappedString {
            var r = new MappedString();
            r._str = this._str;
            r._map = this._map.concat([]);
            return r;
        }

        pushRef(label:string, pos?:number) : MappedString {
            for (var i=0; i < this._map.length; i++) {
                this._map[i] = this._map[i].clone().pushRef(label, pos);
            }
            return this;
        }

        concat(s:MappedString) : MappedString {
            var r = new MappedString();
            r._str = this._str + s._str;
            r._map = this._map.concat(s._map);
            return r;
        }
        
        get s() : string {
            return this._str;
        }
        
        toString() : string {
            return this._str;
        }

        get position() : number {
            if (this._map.length == 0) return null;
            return this._map[0].pos;
        }

        get refs() : MapRef[] {
            if (this._map.length == 0) return null;
            return this._map[0].refs;
        }

        toTrace(source:SourceString, trackNo:number) : any[] {
            var stack = [];
            var pos = this.position;
            if (pos) {
                var lc = source.toLineColumn(pos);
                stack.push([null, lc.line+1, lc.column+1]);
                // stack.push('(' + pos.toString(10) + ')');
            }
            var refs = this.refs;
            if (refs && 0 < refs.length) {
                for (var r of refs) {
                    var s:any[] = [r.label];
                    if (r.pos) {
                        var lc = source.toLineColumn(r.pos);
                        s.push(lc.line+1);
                        s.push(lc.column+1);
                    }
                    stack.push(s);
                }
            }
            stack.push(trackNo);
            return stack;
        }
        
        mapRemoveWhitespace() : void {
            this.mapReplace(new RegExp("[ 　\n\r\t\f]+", "g"));
        }

        mapRemove(start: number, end: number) : void {
            this._str = this._str.substring(0, start) + this._str.substring(end + 1);
            this._map = this._map.slice(0, start).concat(this._map.slice(end + 1));
        }

        protected matchedRanges(ptrn:any) : number[][] {
            var ranges = [];
            var str = this._str;
            if (ptrn instanceof RegExp) {
                var m;
                while (m = ptrn.exec(str)) {
                    ranges.push([m.index, m.index+m[0].length]);
                    if (!ptrn.global) break;
                }
            }
            else {
                var i = 0;
                var l = ptrn.length;
                while (0 <= (i = str.indexOf(ptrn, i))) {
                    ranges.push([i, i+l]);
                    i += l;
                }
            }
            return ranges;
        }

        mapReplace(from:any, to?:MappedString) : void {
            var ranges = this.matchedRanges(from);
            var str = '';
            var map = [];
            var i = 0;
            for (var r of ranges) {
                str += this._str.substring(i, r[0]);
                map = map.concat(this._map.slice(i, r[0]));
                if (to) {
                    str += to._str;
                    map = map.concat(to._map);
                }
                i = r[1];
            }
            str += this._str.substring(i);
            map = map.concat(this._map.slice(i));
            this._str = str;
            this._map = map;
        }
        
        mapReplaceRange(begin:number, end:number, r:MappedString) : void {
            this._str = this._str.substring(0, begin) + r._str + this._str.substring(end);
            this._map = this._map.slice(0, begin).concat(r._map).concat(this._map.slice(end));
        }
        
        replace(from:any, to:MappedString) : MappedString {
            var r = this.clone();
            r.mapReplace(from, to);
            return r;
        }
        
        split(delim:any) : MappedString[] {
            var ranges = this.matchedRanges(delim);
            var strs = [];
            var i = 0;
            for (var r of ranges) {
                var s = new MappedString();
                s._str = this._str.substring(i, r[0]);
                s._map = this._map.slice(i, r[0]);
                strs.push(s);
                i = r[1];
            }
            var s = new MappedString();
            s._str = this._str.substring(i);
            s._map = this._map.slice(i);
            strs.push(s);
            return strs;
        }
        
        mapLowerCase() : void {
            this._str = this._str.toLowerCase();
        }
        
        append(s:MappedString) : void {
            this._str += s._str;
            this._map = this._map.concat(s._map);
        }
        
        appendRaw(s:string) : void {
            this._str += s;
            for (var i=0; i<s.length; i++) this._map.push(null);
        }

        get length(): number {
            return this._str.length;
        }
        
        indexOf(s:string, p?:number): number {
            return this._str.indexOf(s, p);
        }
        
        match(r:any): RegExpMatchArray {
            return this._str.match(r);
        }
        
        substr(f:number, l?:number): MappedString {
            var str = new MappedString();
            str._str = this._str.substr(f, l);
            str._map = this._map.slice(f, l==null ? l : f+l);
            return str;
        }
        
        substring(s:number, e?:number): MappedString {
            var str = new MappedString();
            str._str = this._str.substring(s, e);
            str._map = this._map.slice(s, e);
            return str;
        }
        
        charAt(i:number): MappedString {
            var r = new MappedString();
            r._str = this._str.charAt(i);
            r._map.push(this._map[i]);
            return r;
        }

    }
    
    var reNonWhitespace = /\S/;

    type MacroArg = {
        id: string;
        index: number;
    };
    
    type MacroDef = {
        id: string;
        code: MappedString;
        args: Array<MappedString|MacroArg>;
    };
    
    export class MML {
        protected static MAX_PIPE: number = 3;
        protected static MAX_SYNCSOURCE: number = 3;
        protected static MAX_POLYVOICE: number = 64;

        protected m_sequencer: MSequencer;
        protected m_tracks: Array<MTrack>;
        protected m_source: SourceString;
        protected m_string: MappedString;
        protected m_trackNo: number;
        protected m_octave: number;
        protected m_relativeDir: boolean;
        protected m_velocity: number;        // default velocity
        protected m_velDetail: boolean;
        protected m_velDir: boolean;
        protected m_length: number;          // default length
        protected m_tempo: number;
        protected m_letter: number;
        protected m_keyoff: number;
        protected m_gate: number;
        protected m_maxGate: number;
        protected m_form: number;
        protected m_noteShift: number;
        protected m_warning: any[];
        protected m_maxPipe: number;
        protected m_maxSyncSource: number;
        protected m_beforeNote: number;
        protected m_portamento: number;
        protected m_usingPoly: boolean;
        protected m_polyVoice: number;
        protected m_polyForce: boolean;
        protected m_metaTitle: string;
        protected m_metaArtist: string;
        protected m_metaCoding: string;
        protected m_metaComment: string;

        constructor() {
            this.m_sequencer = new MSequencer();
        }

        // static removeWhitespace(str: string): string {
        //     return str.replace(new RegExp("[ 　\n\r\t\f]+", "g"), "");
        // }

        static remove(str: string, start: number, end: number): string {
            return str.substring(0, start) + str.substring(end + 1);
        }

        getWarnings(): any[] {
            return this.m_warning;
        }

        protected warning(warnId: number, str: string|MappedString): void {
            var msg = MWarning.getString(warnId, str.toString());
            var trace = [];
            if (str instanceof MappedString) {
                trace = str.toTrace(this.m_source, this.m_trackNo);
            }
            else if (str!=null && str!="") {
                trace.push([ str, null, null ]);
            }
            if (this.m_warning.indexOf(msg) < 0) this.m_warning.push({ message: msg, trace:trace });
        }

        protected len2tick(len: number): number {
            if (len === 0) return this.m_length;
            return 384 / len | 0;
        }

        protected note(noteNo: number, trace: any[]): void {
            //console.log("note"+noteNo);
            noteNo += this.m_noteShift + this.getKeySig();
            if (this.getRawChar() === '*') { // ポルタメント記号
                this.m_beforeNote = noteNo + this.m_octave * 12;
                this.m_portamento = 1;
                this.next();
            } else {
                var lenMode: number;
                var len: number;
                var tick: number = 0;
                var tickTemp: number;
                var tie: number = 0;
                var keyon: number = (this.m_keyoff === 0) ? 0 : 1;
                this.m_keyoff = 1;
                while (1) {
                    if (this.getRawChar() !== '%') {
                        lenMode = 0;
                    }
                    else {
                        lenMode = 1;
                        this.next();
                    }
                    len = this.getUInt(0);
                    if (tie === 1 && len === 0) {
                        this.m_keyoff = 0;
                        break;
                    }
                    tickTemp = (lenMode ? len : this.len2tick(len));
                    tick += this.getDot(tickTemp);
                    tie = 0;
                    if (this.getRawChar() === '&') { // tie
                        tie = 1;
                        this.next();
                    }
                    else {
                        break;
                    }
                }
                if (this.m_portamento === 1) { // ポルタメントなら
                    this.m_tracks[this.m_trackNo].recPortamento(this.m_beforeNote - (noteNo + this.m_octave * 12), tick);
                }
                this.m_tracks[this.m_trackNo].recNote(noteNo + this.m_octave * 12, tick, this.m_velocity, keyon, this.m_keyoff, trace);
                if (this.m_portamento === 1) { // ポルタメントなら
                    this.m_tracks[this.m_trackNo].recPortamento(0, 0);
                    this.m_portamento = 0;
                }
            }
        }

        protected rest(): void {
            //console.log("rest");
            var lenMode: number = 0;
            if (this.getRawChar() === '%') {
                lenMode = 1;
                this.next();
            }
            var len: number;
            len = this.getUInt(0);
            var tick: number = lenMode ? len : this.len2tick(len);
            tick = this.getDot(tick);
            this.m_tracks[this.m_trackNo].recRest(tick);
        }

        protected atmark(): void {
            var c: string = this.getRawChar();
            var o: number = 1, a: number = 0, d: number = 64, s: number = 32, r: number = 0, sens: number = 0, mode: number = 0;
            var w: number = 0, f: number = 0;
            var pmd: number, amd: number, pms: number, ams: number;
            switch (c) {
                case 'v': // Volume
                    this.m_velDetail = true;
                    this.next();
                    this.m_velocity = this.getUInt(this.m_velocity);
                    if (this.m_velocity > 127) this.m_velocity = 127;
                    break;
                case 'x': // Expression
                    this.next();
                    o = this.getUInt(127);
                    if (o > 127) o = 127;
                    this.m_tracks[this.m_trackNo].recExpression(o);
                    break;
                case 'e': // Envelope
                    (() => {
                        var releasePos: number;
                        var t: Array<number> = new Array<number>(), l: Array<number> = new Array<number>();
                        this.next();
                        o = this.getUInt(o);
                        if (this.getRawChar() === ',') this.next();
                        a = this.getUInt(a);
                        releasePos = this.m_letter;
                        while (true) {
                            if (this.getRawChar() === ',') {
                                this.next();
                            } else {
                                break;
                            }
                            releasePos = this.m_letter - 1;
                            d = this.getUInt(d);
                            if (this.getRawChar() === ',') {
                                this.next();
                            } else {
                                this.m_letter = releasePos;
                                break;
                            }
                            s = this.getUInt(s);
                            t.push(d);
                            l.push(s);
                        }
                        if (t.length === 0) {
                            t.push(d);
                            l.push(s);
                        }
                        if (this.getRawChar() === ',') this.next();
                        r = this.getUInt(r);
                        //console.log("A"+a+",D"+d+",S"+s+",R"+r);
                        this.m_tracks[this.m_trackNo].recEnvelope(o, a, t, l, r);
                    })();
                    break;
                case 'm':
                    this.next();
                    if (this.getRawChar() === 'h') {
                        this.next();
                        w = 0; f = 0; pmd = 0; amd = 0; pms = 0; ams = 0; s = 1;
                        do {
                            w = this.getUInt(w);
                            if (this.getRawChar() !== ',') break;
                            this.next();
                            f = this.getUInt(f);
                            if (this.getRawChar() !== ',') break;
                            this.next();
                            pmd = this.getUInt(pmd);
                            if (this.getRawChar() !== ',') break;
                            this.next();
                            amd = this.getUInt(amd);
                            if (this.getRawChar() !== ',') break;
                            this.next();
                            pms = this.getUInt(pms);
                            if (this.getRawChar() !== ',') break;
                            this.next();
                            ams = this.getUInt(ams);
                            if (this.getRawChar() !== ',') break;
                            this.next();
                            s = this.getUInt(s);
                        } while (false);
                        this.m_tracks[this.m_trackNo].recHwLfo(w, f, pmd, amd, pms, ams, s);
                    }
                    break;
                case 'n': // Noise frequency
                    this.next();
                    if (this.getRawChar() === 's') { // Note Shift (relative)
                        this.next();
                        this.m_noteShift += this.getSInt(0);
                    }
                    else {
                        o = this.getUInt(0);
                        if (o < 0 || o > 127) o = 0;
                        this.m_tracks[this.m_trackNo].recNoiseFreq(o);
                    }
                    break;
                case 'w': // pulse Width modulation
                    this.next();
                    o = this.getSInt(50);
                    if (o < 0) {
                        if (o > -1) o = -1;
                        if (o < -99) o = -99;
                    }
                    else {
                        if (o < 1) o = 1;
                        if (o > 99) o = 99;
                    }
                    this.m_tracks[this.m_trackNo].recPWM(o);
                    break;
                case 'p': // Pan
                    this.next();
                    if (this.getRawChar() === 'l') { // poly mode
                        this.next();
                        o = this.getUInt(this.m_polyVoice);
                        o = Math.max(0, Math.min(this.m_polyVoice, o));
                        this.m_tracks[this.m_trackNo].recPoly(o);
                    }
                    else {
                        o = this.getUInt(64);
                        if (o < 1) o = 1;
                        if (o > 127) o = 127;
                        this.m_tracks[this.m_trackNo].recPan(o);
                    }
                    break;
                case '\'': // formant filter
                    this.next();
                    o = this.m_string.indexOf('\'', this.m_letter);
                    if (o >= 0) {
                        var vstr: MappedString = this.m_string.substring(this.m_letter, o);
                        var vowel: number = 0;
                        switch (vstr.s) {
                            case 'a': vowel = MFormant.VOWEL_A; break;
                            case 'e': vowel = MFormant.VOWEL_E; break;
                            case 'i': vowel = MFormant.VOWEL_I; break;
                            case 'o': vowel = MFormant.VOWEL_O; break;
                            case 'u': vowel = MFormant.VOWEL_U; break;
                            default: vowel = -1; break;
                        }
                        this.m_tracks[this.m_trackNo].recFormant(vowel);
                        this.m_letter = o + 1;
                    }
                    break;
                case 'd': // Detune
                    this.next();
                    o = this.getSInt(0);
                    this.m_tracks[this.m_trackNo].recDetune(o);
                    break;
                case 'l': // Low frequency oscillator (LFO)
                    (() => {
                        var dp: number = 0, wd: number = 0, fm: number = 1, sf: number = 0, rv: number = 1, dl: number = 0, tm: number = 0, cn: number = 0, sw: number = 0;
                        this.next();
                        dp = this.getUInt(dp);
                        if (this.getRawChar() === ',') this.next();
                        wd = this.getUInt(wd);
                        if (this.getRawChar() === ',') {
                            this.next();
                            if (this.getRawChar() === '-') { rv = -1; this.next(); }
                            fm = (this.getUInt(fm) + 1) * rv;
                            if (this.getRawChar() === '-') {
                                this.next();
                                sf = this.getUInt(0);
                            }
                            if (this.getRawChar() === ',') {
                                this.next();
                                dl = this.getUInt(dl);
                                if (this.getRawChar() === ',') {
                                    this.next();
                                    tm = this.getUInt(tm);
                                    if (this.getRawChar() === ',') {
                                        this.next();
                                        sw = this.getUInt(sw);
                                    }
                                }
                            }
                        }
                        //console.log("DePth"+dp+",WiDth"+wd+",ForM"+fm+",DeLay"+dl+",TiMe"+tm);
                        this.m_tracks[this.m_trackNo].recLFO(dp, wd, fm, sf, dl, tm, sw);
                    })();
                    break;
                case 'f': // Filter
                    (() => {
                        var swt: number = 0, amt: number = 0, frq: number = 0, res: number = 0;
                        this.next();
                        swt = this.getSInt(swt);
                        if (this.getRawChar() === ',') {
                            this.next();
                            amt = this.getSInt(amt);
                            if (this.getRawChar() === ',') {
                                this.next();
                                frq = this.getUInt(frq);
                                if (this.getRawChar() === ',') {
                                    this.next();
                                    res = this.getUInt(res);
                                }
                            }
                        }
                        this.m_tracks[this.m_trackNo].recLPF(swt, amt, frq, res);
                    })();
                    break;
                case 'q': // gate time 2
                    this.next();
                    this.m_tracks[this.m_trackNo].recGate2(this.getUInt(2) * 2); // '*2' according to TSSCP
                    break;
                case 'i': // Input
                    sens = 0;
                    this.next();
                    sens = this.getUInt(sens);
                    if (this.getRawChar() === ',') {
                        this.next();
                        a = this.getUInt(a);
                        if (a > this.m_maxPipe) a = this.m_maxPipe;
                    }
                    this.m_tracks[this.m_trackNo].recInput(sens, a);
                    // @i[n],[m]   m:pipe no
                    // if (n === 0) off
                    // else sensitivity = n (max:8)
                    break;
                case 'o': // Output
                    mode = 0;
                    this.next();
                    mode = this.getUInt(mode);
                    if (this.getRawChar() === ',') {
                        this.next();
                        a = this.getUInt(a);
                        if (a > this.m_maxPipe) {
                            this.m_maxPipe = a;
                            if (this.m_maxPipe >= MML.MAX_PIPE) this.m_maxPipe = a = MML.MAX_PIPE;
                        }
                    }
                    this.m_tracks[this.m_trackNo].recOutput(mode, a);
                    // @o[n],[m]   m:pipe no
                    // if (n === 0) off
                    // if (n === 1) overwrite
                    // if (n === 2) add
                    break;
                case 'r': // Ring
                    (() => {
                        sens = 0;
                        this.next();
                        sens = this.getUInt(sens);
                        if (this.getRawChar() === ',') {
                            this.next();
                            a = this.getUInt(a);
                            if (a > this.m_maxPipe) a = this.m_maxPipe;
                        }
                        this.m_tracks[this.m_trackNo].recRing(sens, a);
                    })();
                    break;
                case 's': // Sync
                    {
                        mode = 0;
                        this.next();
                        mode = this.getUInt(mode);
                        if (this.getRawChar() === ',') {
                            this.next();
                            a = this.getUInt(a);
                            if (mode === 1) {
                                // Sync out
                                if (a > this.m_maxSyncSource) {
                                    this.m_maxSyncSource = a;
                                    if (this.m_maxSyncSource >= MML.MAX_SYNCSOURCE) this.m_maxSyncSource = a = MML.MAX_SYNCSOURCE;
                                }
                            } else if (mode === 2) {
                                // Sync in
                                if (a > this.m_maxSyncSource) a = this.m_maxSyncSource;
                            }
                        }
                        this.m_tracks[this.m_trackNo].recSync(mode, a);
                    }
                    break;
                case 'u': // midi風なポルタメント
                    this.next();
                    var rate: number;
                    mode = this.getUInt(0);
                    switch (mode) {
                        case 0:
                        case 1:
                            this.m_tracks[this.m_trackNo].recMidiPort(mode);
                            break;
                        case 2:
                            rate = 0;
                            if (this.getRawChar() === ',') {
                                this.next();
                                rate = this.getUInt(0);
                                if (rate < 0) rate = 0;
                                if (rate > 127) rate = 127;
                            }
                            this.m_tracks[this.m_trackNo].recMidiPortRate(rate * 1);
                            break;
                        case 3:
                            if (this.getRawChar() === ',') {
                                this.next();
                                var oct: number;
                                var baseNote: number = -1;
                                if (this.getRawChar() !== 'o') {
                                    oct = this.m_octave;
                                }
                                else {
                                    this.next();
                                    oct = this.getUInt(0);
                                }
                                c = this.getRawChar();
                                switch (c) {
                                    case 'c': baseNote = 0; break;
                                    case 'd': baseNote = 2; break;
                                    case 'e': baseNote = 4; break;
                                    case 'f': baseNote = 5; break;
                                    case 'g': baseNote = 7; break;
                                    case 'a': baseNote = 9; break;
                                    case 'b': baseNote = 11; break;
                                }
                                if (baseNote >= 0) {
                                    this.next();
                                    baseNote += this.m_noteShift + this.getKeySig();
                                    baseNote += oct * 12;
                                }
                                else {
                                    baseNote = this.getUInt(60);
                                }
                                if (baseNote < 0) baseNote = 0;
                                if (baseNote > 127) baseNote = 127;
                                this.m_tracks[this.m_trackNo].recPortBase(baseNote);
                            }
                            break;
                    }
                    break;
                default:
                    this.m_form = this.getUInt(this.m_form);
                    a = 0;
                    if (this.getRawChar() === '-') {
                        this.next();
                        a = this.getUInt(0);
                    }
                    this.m_tracks[this.m_trackNo].recForm(this.m_form, a);
                    break;
            }
        }

        protected firstLetter(): void {
            var c: MappedString = this.getCharNext();
            var c0: MappedString;
            var i: number;
            var trace = c.toTrace(this.m_source, this.m_trackNo);
            switch (c.s) {
                case "c": this.note(0, trace); break;
                case "d": this.note(2, trace); break;
                case "e": this.note(4, trace); break;
                case "f": this.note(5, trace); break;
                case "g": this.note(7, trace); break;
                case "a": this.note(9, trace); break;
                case "b": this.note(11, trace); break;
                case "r": this.rest(); break;
                case "o": // Octave
                    this.m_octave = this.getUInt(this.m_octave);
                    if (this.m_octave < -2) this.m_octave = -2;
                    if (this.m_octave > 8) this.m_octave = 8;
                    break;
                case "v": // Volume
                    this.m_velDetail = false;
                    this.m_velocity = this.getUInt((this.m_velocity - 7) / 8) * 8 + 7;
                    if (this.m_velocity < 0) this.m_velocity = 0;
                    if (this.m_velocity > 127) this.m_velocity = 127;
                    break;
                case "(": // vol up/down
                case ")":
                    i = this.getUInt(1);
                    if (c.s === "(" && this.m_velDir ||
                        c.s === ")" && !this.m_velDir) { // up
                        this.m_velocity += (this.m_velDetail) ? (1 * i) : (8 * i);
                        if (this.m_velocity > 127) this.m_velocity = 127;
                    }
                    else { // down
                        this.m_velocity -= (this.m_velDetail) ? (1 * i) : (8 * i);
                        if (this.m_velocity < 0) this.m_velocity = 0;
                    }
                    break;
                case "l": // Length
                    this.m_length = this.len2tick(this.getUInt(0));
                    this.m_length = this.getDot(this.m_length);
                    break;
                case "t": // Tempo
                    this.m_tempo = this.getUNumber(this.m_tempo);
                    if (this.m_tempo < 1) this.m_tempo = 1;
                    this.m_tracks[MTrack.TEMPO_TRACK].recTempo(this.m_tracks[this.m_trackNo].getRecGlobalTick(), this.m_tempo);
                    break;
                case "q": // gate time (rate)
                    this.m_gate = this.getUInt(this.m_gate);
                    this.m_tracks[this.m_trackNo].recGate(this.m_gate / this.m_maxGate);
                    break;
                case "<": // octave shift
                    if (this.m_relativeDir) this.m_octave++; else this.m_octave--;
                    break;
                case ">": // octave shift
                    if (this.m_relativeDir) this.m_octave--; else this.m_octave++;
                    break;
                case ";": // end of track
                    this.m_keyoff = 1;
                    if (this.m_tracks[this.m_trackNo].getNumEvents() > 0) {
                        this.m_trackNo++;
                    }
                    this.m_tracks[this.m_trackNo] = this.createTrack();
                    break;
                case "@":
                    this.atmark();
                    break;
                case "x":
                    this.m_tracks[this.m_trackNo].recVolMode(this.getUInt(1));
                    break;
                case "n":
                    c0 = this.getChar();
                    if (c0.s === "s") { // Note Shift (absolute)
                        this.next();
                        this.m_noteShift = this.getSInt(this.m_noteShift);
                    }
                    else
                        this.warning(MWarning.UNKNOWN_COMMAND, this.getCharPrev().concat(c0));
                    break;
                case '[':
                    this.m_tracks[this.m_trackNo].recChordStart();
                    break;
                case ']':
                    this.m_tracks[this.m_trackNo].recChordEnd();
                    break;
                default:
                    {
                        var cc: number = c.s.charCodeAt(0);
                        if (cc < 128)
                            this.warning(MWarning.UNKNOWN_COMMAND, this.getCharPrev());
                    }
                    break;
            }
        }
        
        public getEventById(eventId: number) : MEvent {
            return MEvent.getById(eventId);
        }

        protected getCharPrev(): MappedString {
            return (this.m_letter < this.m_string.length) ? this.m_string.charAt(this.m_letter-1) : new MappedString();
        }

        protected getRawCharNext(): string {
            return this.m_string.s.charAt(this.m_letter++);
        }

        protected getRawChar(): string {
            return this.m_string.s.charAt(this.m_letter);
        }

        protected getChar(): MappedString {
            return (this.m_letter < this.m_string.length) ? this.m_string.charAt(this.m_letter) : new MappedString();
        }

        protected getCharNext(): MappedString {
            return (this.m_letter < this.m_string.length) ? this.m_string.charAt(this.m_letter++) : new MappedString();
        }

        protected next(i: number = 1): void {
            this.m_letter += 1;
        }

        protected getKeySig(): number {
            var k: number = 0;
            var f: number = 1;
            while (f) {
                var c: string = this.getRawChar();
                switch (c) {
                    case "+": case "#": k++; this.next(); break;
                    case "-": k--; this.next(); break;
                    default: f = 0; break;
                }
            }
            return k;
        }

        protected getUInt(def: number): number {
            var ret: number = 0;
            var l: number = this.m_letter;
            var f: number = 1;
            while (f) {
                var c: string = this.getRawChar();
                switch (c) {
                    case '0': ret = ret * 10 + 0; this.next(); break;
                    case '1': ret = ret * 10 + 1; this.next(); break;
                    case '2': ret = ret * 10 + 2; this.next(); break;
                    case '3': ret = ret * 10 + 3; this.next(); break;
                    case '4': ret = ret * 10 + 4; this.next(); break;
                    case '5': ret = ret * 10 + 5; this.next(); break;
                    case '6': ret = ret * 10 + 6; this.next(); break;
                    case '7': ret = ret * 10 + 7; this.next(); break;
                    case '8': ret = ret * 10 + 8; this.next(); break;
                    case '9': ret = ret * 10 + 9; this.next(); break;
                    default: f = 0; break;
                }
            }
            return (this.m_letter === l) ? def : ret;
        }

        protected getUNumber(def: number): number {
            var ret: number = this.getUInt(def | 0);
            var l: number = 1;
            if (this.getRawChar() === '.') {
                this.next();
                var f: boolean = true;
                while (f) {
                    var c: string = this.getRawChar();
                    l *= 0.1;
                    switch (c) {
                        case '0': ret = ret + 0 * l; this.next(); break;
                        case '1': ret = ret + 1 * l; this.next(); break;
                        case '2': ret = ret + 2 * l; this.next(); break;
                        case '3': ret = ret + 3 * l; this.next(); break;
                        case '4': ret = ret + 4 * l; this.next(); break;
                        case '5': ret = ret + 5 * l; this.next(); break;
                        case '6': ret = ret + 6 * l; this.next(); break;
                        case '7': ret = ret + 7 * l; this.next(); break;
                        case '8': ret = ret + 8 * l; this.next(); break;
                        case '9': ret = ret + 9 * l; this.next(); break;
                        default: f = false; break;
                    }
                }
            }
            return ret;
        }

        protected getSInt(def: number): number {
            var c: string = this.getRawChar();
            var s: number = 1;
            if (c === '-') { s = -1; this.next(); }
            else if (c === '+') this.next();
            return this.getUInt(def) * s;
        }

        protected getDot(tick: number): number {
            var c: string = this.getRawChar();
            var intick: number = tick;
            while (c === '.') {
                this.next();
                intick /= 2;
                tick += intick;
                c = this.getRawChar();
            }
            return tick;
        }

        createTrack(): MTrack {
            this.m_octave = 4;
            this.m_velocity = 100;
            this.m_noteShift = 0;
            return new MTrack();
        }

        protected begin(): void {
            this.m_letter = 0;
        }

        protected process(): void {
            this.begin();
            while (this.m_letter < this.m_string.length) {
                this.firstLetter();
            }
        }

        protected processRepeat(): void {
            this.m_string.mapLowerCase();
            this.begin();
            var repeat: Array<number> = new Array();
            var origin: Array<number> = new Array();
            var start: Array<number> = new Array();
            var last: Array<number> = new Array();
            var nest: number = -1;
            while (this.m_letter < this.m_string.length) {
                var c: string = this.getRawCharNext();
                switch (c) {
                    case '/':
                        if (this.getRawChar() === ':') {
                            this.next();
                            origin[++nest] = this.m_letter - 2;
                            repeat[nest] = this.getUInt(2);
                            start[nest] = this.m_letter;
                            last[nest] = -1;
                        }
                        else if (nest >= 0) {
                            last[nest] = this.m_letter - 1;
                            this.m_string.mapRemove(this.m_letter - 1, this.m_letter - 1);
                            this.m_letter--;
                        }
                        else {
                        }
                        break;
                    case ':':
                        if (this.getRawChar() === '/' && nest >= 0) {
                            this.next();
                            var contents1: MappedString = this.m_string.substring(start[nest], this.m_letter - 2);
                            var contents2: MappedString = this.m_string.substring(start[nest], last[nest]);
                            var begin: number = origin[nest];
                            var newstr: MappedString = new MappedString();
                            for (var i: number = 0; i < repeat[nest]; i++) {
								var contents: MappedString = (i < repeat[nest] - 1 || last[nest] < 0 ? contents1 : contents2).clone();
								contents.pushRef('Repeat ' + (i+1).toString(10) + '/' + repeat[nest].toString(10));
                                newstr.append(contents);
                            }
                            this.m_string.mapReplaceRange(begin, this.m_letter, newstr);
                            this.m_letter = begin + newstr.length;
                            nest--;
                        }
                        break;
                    default:
                        break;
                }
            }
            if (nest >= 0) this.warning(MWarning.UNCLOSED_REPEAT, "");
        }

        /*
        protected getIndex(idArr: Array<string>, id: string): number {
            for (var i: number = 0; i < idArr.length; i++)
                if (idArr[i] === id) return i;
            return -1;
        }
        */

        protected replaceMacro(macroTable: Array<MacroDef>): boolean {
            // 下2行は for each(var macro in macroTable) { より
            for (var m in macroTable) {
                var macro: MacroDef = macroTable[m];
                if (this.m_string.s.substr(this.m_letter, macro.id.length) === macro.id) {
                    var refPos = this.getCharPrev().position;
                    var start: number = this.m_letter, last: number = this.m_letter + macro.id.length;
                    var code: MappedString = macro.code;
                    this.m_letter += macro.id.length;
                    var c: string = this.getRawCharNext();
                    while (!reNonWhitespace.test(c)) {
                        c = this.getRawCharNext();
                    }
                    var args: Array<MappedString> = new Array();
                    var q: number = 0;

                    // 引数が0個の場合は引数処理をスキップするように変更
                    if (macro.args.length > 0) {
                        if (c === "{") {
                            c = this.getRawCharNext();
                            while (q === 1 || (c !== "}" && c !== "")) {
                                if (c === '"') q = 1 - q;
                                if (c === "$") {
                                    this.replaceMacro(macroTable);
                                }
                                c = this.getRawCharNext();
                            }
                            last = this.m_letter;
                            var argstr: MappedString = this.m_string.substring(start + macro.id.length + 1, last - 1);
                            var curarg: MappedString = new MappedString(), quoted: boolean = false;
                            for (var pos: number = 0; pos < argstr.length; pos++) {
                                if (!quoted && argstr.charAt(pos).s === '"') {
                                    quoted = true;
                                } else if (quoted && (pos + 1) < argstr.length && argstr.charAt(pos).s === '\\' && argstr.charAt(pos + 1).s === '"') {
                                    curarg.appendRaw('"');
                                    pos++;
                                } else if (quoted && argstr.charAt(pos).s === '"') {
                                    quoted = false;
                                } else if (!quoted && argstr.charAt(pos).s === ',') {
                                    args.push(curarg);
                                    curarg = new MappedString();
                                } else {
                                    curarg.append(argstr.charAt(pos));
                                }
                            }
                            args.push(curarg);
                            if (quoted) {
                                this.warning(MWarning.UNCLOSED_ARGQUOTE, "");
                            }
                        }
                        // 引数への置換
                        for (var i: number = 0; i < code.length; i++) {
                            for (var j: number = 0; j < args.length; j++) {
                                if (j >= macro.args.length) {
                                    break;
                                }
                                var arg: MacroArg = <MacroArg>macro.args[j];
                                if (code.substr(i, arg.id.length + 1).s === ("%" + arg.id)) {
                                    code = code.substring(0, i).concat(code.substring(i).replace("%" + arg.id, args[arg.index]));
                                    i += args[arg.index].length - 1;
                                    break;
                                }
                            }
                        }
                    }
                    
                    var appearPos = this.m_string.charAt(start - 1);
                    code = code.clone().pushRef("$"+macro.id, refPos);
                    this.m_string.mapReplaceRange(start - 1, last, code);
                    this.m_letter = start - 1;
                    //console.log(this.m_string.substring(this.m_letter));
                    return true;
                }
            }
            return false;
        }

        protected processMacro(): void {
            var i: number;
            var matched: RegExpMatchArray;
            // OCTAVE REVERSE
            var exp: RegExp = /^#OCTAVE\s+REVERSE\s*$/m;
            if (this.m_string.match(exp)) {
                this.m_string.mapReplace(exp);
                this.m_relativeDir = false;
            }
            // VELOCITY REVERSE
            exp = /^#VELOCITY\s+REVERSE\s*$/m;
            if (this.m_string.match(exp)) {
                this.m_string.mapReplace(exp);
                this.m_velDir = false;
            }
            // meta informations
            this.m_metaTitle = this.findMetaDescN("TITLE");     // #TITLE
            this.m_metaArtist = this.findMetaDescN("ARTIST");   // #ARTIST
            this.m_metaComment = this.findMetaDescN("COMMENT"); // #COMMENT
            this.m_metaCoding = this.findMetaDescN("CODING");   // #CODING
            this.findMetaDescN("PRAGMA");                       // #PRAGMA
            // FM Desc
            exp = /^#OPM@(\d+)[ \t]*{([^}]*)}/gm;

            matched = this.m_string.match(exp);
            if (matched) {
                this.m_string.mapReplace(exp);
                var fmm: RegExpMatchArray;
                for (i = 0; i < matched.length; i++) {
                    fmm = matched[i].match(/^#OPM@(\d+)[ \t]*{([^}]*)}/m);
                    MOscOPM.setTimber(parseInt(fmm[1]), MOscOPM.TYPE_OPM, fmm[2]);
                }
            }

            exp = /^#OPN@(\d+)[ \t]*{([^}]*)}/gm;
            matched = this.m_string.match(exp);
            if (matched) {
                this.m_string.mapReplace(exp);
                var fmn: RegExpMatchArray;
                for (i = 0; i < matched.length; i++) {
                    fmn = matched[i].match(/^#OPN@(\d+)[ \t]*{([^}]*)}/m);
                    MOscOPM.setTimber(parseInt(fmn[1]), MOscOPM.TYPE_OPN, fmn[2]);
                }
            }

            var fmg: Array<string> = this.findMetaDescV("FMGAIN");
            for (i = 0; i < fmg.length; i++) {
                MOscOPM.setCommonGain(20.0 * parseInt(fmg[i]) / 127.0);
            }

            // POLY MODE
            {
                var usePoly: string = this.findMetaDescN("USING\\s+POLY");
                usePoly = usePoly.replace("\r", "");
                usePoly = usePoly.replace("\n", " ");
                usePoly = usePoly.toLowerCase();
                if (usePoly.length > 0) {
                    var ss: Array<string> = usePoly.split(" ");
                    if (ss.length < 1) {
                        this.m_usingPoly = false;
                    }
                    else {
                        this.m_usingPoly = true;
                        this.m_polyVoice = Math.min(Math.max(1, parseInt(ss[0])), MML.MAX_POLYVOICE); // 1～MAX_POLYVOICE
                    }
                    for (i = 1; i < ss.length; i++) {
                        if (ss[i] === "force") {
                            this.m_polyForce = true;
                        }
                    }
                    if (this.m_polyVoice <= 1) {
                        this.m_usingPoly = false;
                        this.m_polyForce = false;
                    }
                    //console.log("using poly = " + this.m_usingPoly + ", max voice = " + this.m_polyVoice + ", force = " + this.m_polyForce);
                }
            }
            // GB WAVE (ex. "#WAV10 0,0123456789abcdeffedcba9876543210")
            {
                exp = /^#WAV10\s.*$/gm;
                matched = this.m_string.match(exp);
                if (matched) {
                    for (i = 0; i < matched.length; i++) {
                        this.m_string.mapReplace(exp);
                        //console.log(matched[i]);
                        var wav: Array<string> = matched[i].split(" ");
                        var wavs: string = "";
                        for (var j: number = 1; j < wav.length; j++) wavs += wav[j];
                        var arg: Array<string> = wavs.split(",");
                        var waveNo: number = parseInt(arg[0]);
                        if (waveNo < 0) waveNo = 0;
                        if (waveNo >= MOscGbWave.MAX_WAVE) waveNo = MOscGbWave.MAX_WAVE - 1;
                        //console.log(waveNo+":",arg[1].toLowerCase());
                        MOscGbWave.setWave(waveNo,
                            (arg[1].toLowerCase() + "00000000000000000000000000000000").substr(0, 32));
                    }
                }
                exp = /^#WAV13\s.*$/gm;
                matched = this.m_string.match(exp);
                if (matched) {
                    for (i = 0; i < matched.length; i++) {
                        this.m_string.mapReplace(exp);
                        //console.log(matched[i]);
                        wav = matched[i].split(" ");
                        wavs = "";
                        for (j = 1; j < wav.length; j++) wavs += wav[j];
                        arg = wavs.split(",");
                        waveNo = parseInt(arg[0]);
                        if (waveNo < 0) waveNo = 0;
                        if (waveNo >= MOscWave.MAX_WAVE) waveNo = MOscWave.MAX_WAVE - 1;
                        //console.log(waveNo+":",arg[1].toLowerCase());
                        MOscWave.setWave(waveNo, arg[1].toLowerCase());
                    }
                }
                //2009.05.10 OffGao ADD START addDPCM
                // DPCM WAVE (ex. "#WAV9 0,0123456789abcdeffedcba9876543210")
                exp = /^#WAV9\s.*$/gm;
                matched = this.m_string.match(exp);
                if (matched) {
                    for (i = 0; i < matched.length; i++) {
                        this.m_string.mapReplace(exp);
                        //console.log(matched[i]);
                        wav = matched[i].split(" ");
                        wavs = "";
                        for (j = 1; j < wav.length; j++) wavs += wav[j];
                        arg = wavs.split(",");
                        waveNo = parseInt(arg[0]);
                        if (waveNo < 0) waveNo = 0;
                        if (waveNo >= MOscFcDpcm.MAX_WAVE) waveNo = MOscFcDpcm.MAX_WAVE - 1;
                        var intVol: number = parseInt(arg[1]);
                        if (intVol < 0) intVol = 0;
                        if (intVol > 127) intVol = 127;
                        var loopFg: number = parseInt(arg[2]);
                        if (loopFg < 0) loopFg = 0;
                        if (loopFg > 1) loopFg = 1;
                        /*
                        var length: number = -1;
                        if (arg.length >= 5) {
                            length = parseInt(arg[4]);
                            if (length < 1) length = 1;
                            if (length > 0xff) length = 0xff;
                        }
                        MOscFcDpcm.setWave(waveNo,intVol,loopFg,arg[3],length);
                        */
                        MOscFcDpcm.setWave(waveNo, intVol, loopFg, arg[3]);
                    }
                }
            }
            //2009.05.10 OffGao ADD END addDPCM
            // macro
            this.begin();
            var top: boolean = true;
            var macroTable: Array<MacroDef> = new Array();
            var regTrimHead: RegExp = /^\s*/m;
            var regTrimFoot: RegExp = /\s*$/m;
            while (this.m_letter < this.m_string.length) {
                var c: string = this.getRawCharNext();
                switch (c) {
                    case '$':
                        if (top) {
                            var last: number = this.m_string.indexOf(";", this.m_letter);
                            if (last > this.m_letter) {
                                var nameEnd: number = this.m_string.indexOf("=", this.m_letter);
                                if (nameEnd > this.m_letter && nameEnd < last) {
                                    var start: number = this.m_letter;
                                    var argspos: number = this.m_string.indexOf("{");
                                    if (argspos < 0 || argspos >= nameEnd) {
                                        argspos = nameEnd;
                                    }
                                    var idPartMapped: MappedString = this.m_string.substring(start, argspos);
                                    var idPart: string = idPartMapped.s;
                                    var regexResult: RegExpMatchArray = idPart.match("[a-zA-Z_][a-zA-Z_0-9#\+\(\)]*");
                                    if (regexResult !== null) {
                                        var id: string = regexResult[0];
                                        idPart = idPart.replace(regTrimHead, '').replace(regTrimFoot, ''); // idString.Trim();
                                        if (idPart !== id) {
                                            this.warning(MWarning.INVALID_MACRO_NAME, idPartMapped);
                                        }
                                        if (id.length > 0) {
                                            var args: Array<MappedString|MacroArg> = new Array();
                                            if (argspos < nameEnd) {
                                                var argstr: MappedString = this.m_string.substring(argspos + 1, this.m_string.indexOf("}", argspos));
                                                args = argstr.split(",");
                                                for (i = 0; i < args.length; i++) {
                                                    var argid: RegExpMatchArray = (<MappedString>args[i]).match("[a-zA-Z_][a-zA-Z_0-9#\+\(\)]*");
                                                    args[i] = { id: (argid !== null ? argid[0] : ""), index: i };
                                                }
                                                args.sort((a: any, b: any): number => {
                                                    if (a.id.length > b.id.length) return -1;
                                                    if (a.id.length === b.id.length) return 0;
                                                    return 1;
                                                });
                                            }
                                            this.m_letter = nameEnd + 1;
                                            c = this.getRawCharNext();
                                            while (this.m_letter < last) {
                                                if (c === "$") {
                                                    if (!this.replaceMacro(macroTable)) {
                                                        if (this.m_string.substr(this.m_letter, id.length).s === id) {
                                                            this.m_letter--;
                                                            this.m_string.mapRemove(this.m_letter, this.m_letter + id.length);
                                                            this.warning(MWarning.RECURSIVE_MACRO, id);
                                                        }
                                                    }
                                                    last = this.m_string.indexOf(";", this.m_letter);
                                                }
                                                c = this.getRawCharNext();
                                            }
                                            var pos: number = 0;
                                            for (; pos < macroTable.length; pos++) {
                                                if (macroTable[pos].id === id) {
                                                    macroTable.splice(pos, 1);
                                                    pos--;
                                                    continue;
                                                }
                                                if (macroTable[pos].id.length < id.length) {
                                                    break;
                                                }
                                            }
                                            macroTable.splice(pos, 0, { id: id, code: this.m_string.substring(nameEnd + 1, last), args: args });
                                            this.m_string.mapRemove(start - 1, last);
                                            this.m_letter = start - 1;
                                        }
                                    }
                                } else {
                                    // macro use
                                    this.replaceMacro(macroTable);
                                    top = false;
                                }
                            } else {
                                // macro use
                                this.replaceMacro(macroTable);
                                top = false;
                            }
                        } else {
                            // macro use
                            this.replaceMacro(macroTable);
                            top = false;
                        }
                        break;
                    case ';':
                        top = true;
                        break;
                    default:
                        if (reNonWhitespace.test(c)) {
                            top = false;
                        }
                        break;
                }
            }
        }

        // 指定されたメタ記述を引き抜いてくる
        protected findMetaDescV(sectionName: string): Array<string> {
            var i: number;
            var matched: RegExpMatchArray;
            var mm: RegExpMatchArray;
            var e1: RegExp;
            var e2: RegExp;
            var tt: Array<string> = new Array<string>();

            e1 = new RegExp("^#" + sectionName + "(\\s*|\\s+(.*))$", "gm"); // global multi-line
            e2 = new RegExp("^#" + sectionName + "(\\s*|\\s+(.*))$", "m"); //        multi-line

            matched = this.m_string.match(e1);
            if (matched) {
                this.m_string.mapReplace(e1);
                for (i = 0; i < matched.length; i++) {
                    mm = matched[i].match(e2);
                    if (mm[2] !== undefined) {
                        tt.push(mm[2]);
                    }
                }
                // console.log(sectionName + " = " + tt);
            }
            return tt;
        }

        // 指定されたメタ記述を引き抜いてくる
        protected findMetaDescN(sectionName: string): string {
            var i: number;
            var matched: RegExpMatchArray;
            var mm: RegExpMatchArray;
            var e1: RegExp;
            var e2: RegExp;
            var tt: string = "";

            e1 = new RegExp("^#" + sectionName + "(\\s*|\\s+(.*))$", "gm"); // global multi-line
            e2 = new RegExp("^#" + sectionName + "(\\s*|\\s+(.*))$", "m"); //        multi-line

            matched = this.m_string.match(e1);
            if (matched) {
                this.m_string.mapReplace(e1);
                for (i = 0; i < matched.length; i++) {
                    mm = matched[i].match(e2);
                    if (mm[2] !== undefined) {
                        tt += mm[2];
                        if (i + 1 < matched.length) {
                            tt += "\n";
                        }
                    }
                }
                // console.log(sectionName + " = " + tt);
            }
            return tt;
        }

        protected processComment(str: string): void {
            str = str.replace(/\r\n?/g, "\n");
            this.m_source = new SourceString(str);
            this.m_string = new MappedString(str);
            this.begin();
            var commentStart: number = -1;
            while (this.m_letter < this.m_string.length) {
                var c: string = this.getRawCharNext();
                switch (c) {
                    case '/':
                        if (this.getRawChar() === '*') {
                            if (commentStart < 0) commentStart = this.m_letter - 1;
                            this.next();
                        }
                        break;
                    case '*':
                        if (this.getRawChar() === '/') {
                            if (commentStart >= 0) {
                                this.m_string.mapRemove(commentStart, this.m_letter);
                                this.m_letter = commentStart;
                                commentStart = -1;
                            }
                            else {
                                this.warning(MWarning.UNOPENED_COMMENT, "");
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            if (commentStart >= 0) this.warning(MWarning.UNCLOSED_COMMENT, "");

            // 外部プログラム用のクォーテーション
            this.begin();
            commentStart = -1;
            while (this.m_letter < this.m_string.length) {
                if (this.getRawCharNext() === '`') {
                    if (commentStart < 0) {
                        commentStart = this.m_letter - 1;
                    }
                    else {
                        this.m_string.mapRemove(commentStart, this.m_letter - 1);
                        this.m_letter = commentStart;
                        commentStart = -1;
                    }
                }
            }
            // console.log(this.m_string);
        }

        protected processGroupNotes(): void {
            var GroupNotesStart: number = -1;
            var GroupNotesEnd: number;
            var noteCount: number = 0;
            var repend: number, len: number, tick: number, tick2: number, tickdiv: number, noteTick: number, noteOn: number;
            var lenMode: number;
            var defLen: number = 96;
            var newstr: MappedString;
            this.begin();
            while (this.m_letter < this.m_string.length) {
                var c: string = this.getRawCharNext();
                switch (c) {
                    case 'l':
                        defLen = this.len2tick(this.getUInt(0));
                        defLen = this.getDot(defLen);
                        break;
                    case '{':
                        GroupNotesStart = this.m_letter - 1;
                        noteCount = 0;
                        break;
                    case '}':
                        repend = this.m_letter;
                        if (GroupNotesStart < 0) {
                            this.warning(MWarning.UNOPENED_GROUPNOTES, "");
                        }
                        tick = 0;
                        while (1) {
                            if (this.getRawChar() !== '%') {
                                lenMode = 0;
                            }
                            else {
                                lenMode = 1;
                                this.next();
                            }
                            len = this.getUInt(0);
                            if (len === 0) {
                                if (tick === 0) tick = defLen;
                                break;
                            }
                            tick2 = (lenMode ? len : this.len2tick(len));
                            tick2 = this.getDot(tick2);
                            tick += tick2;
                            if (this.getRawChar() !== '&') {
                                break;
                            }
                            this.next();
                        }
                        GroupNotesEnd = this.m_letter;
                        this.m_letter = GroupNotesStart + 1;
                        newstr = new MappedString();
                        tick2 = 0;
                        tickdiv = tick / noteCount;
                        noteCount = 1;
                        noteOn = 0;
                        while (this.m_letter < repend) {
                            c = this.getRawCharNext();
                            switch (c) {
                                case '+':
                                case '#':
                                case '-':
                                    break;

                                default:
                                    if ((c >= 'a' && c <= 'g') || c === 'r') {
                                        if (noteOn === 0) {
                                            noteOn = 1;
                                            break;
                                        }
                                    }
                                    if (noteOn === 1) {
                                        noteTick = Math.round(noteCount * tickdiv - tick2);
                                        noteCount++;
                                        tick2 += noteTick;
                                        if (tick2 > tick) {
                                            noteTick -= (tick2 - tick);
                                            tick2 = tick;
                                        }
                                        newstr.append(new MappedString("%"));
                                        newstr.append(new MappedString(noteTick.toString()));
                                    }
                                    noteOn = 0;
                                    if ((c >= 'a' && c <= 'g') || c === 'r') {
                                        noteOn = 1;
                                    }
                                    break;
                            }
                            if (c !== '}') {
                                newstr.append(this.getCharPrev());
                            }
                        }
                        newstr.pushRef('Group notes');
                        this.m_letter = GroupNotesStart + newstr.length;
                        this.m_string.mapReplaceRange(GroupNotesStart, GroupNotesEnd, newstr);
                        GroupNotesStart = -1;
                        break;
                    default:
                        if ((c >= 'a' && c <= 'g') || c === 'r') {
                            noteCount++;
                        }
                        break;
                }
            }
            if (GroupNotesStart >= 0) this.warning(MWarning.UNCLOSED_GROUPNOTES, "");
        }

        play(str: string, paused: boolean = false): void {
            if (this.m_sequencer.isPaused()) {
                if (!paused) this.m_sequencer.play();
                return;
            }
            // 音声が停止するのを待つ
            msgr.onstopsound = this.play2.bind(this, str, paused);
            msgr.stopSound(true);
        }

        private play2(str: string, paused: boolean = false): void {
            MEvent.resetCounter();
            this.m_sequencer.disconnectAll();
            this.m_tracks = new Array();
            this.m_tracks[0] = this.createTrack();
            this.m_tracks[1] = this.createTrack();
            this.m_warning = [];

            this.m_trackNo = MTrack.FIRST_TRACK;
            this.m_octave = 4;
            this.m_relativeDir = true;
            this.m_velocity = 100;
            this.m_velDetail = true;
            this.m_velDir = true;
            this.m_length = this.len2tick(4);
            this.m_tempo = MTrack.DEFAULT_BPM;
            this.m_keyoff = 1;
            this.m_gate = 15;
            this.m_maxGate = 16;
            this.m_form = MOscillator.PULSE;
            this.m_noteShift = 0;
            this.m_maxPipe = 0;
            this.m_maxSyncSource = 0;
            this.m_beforeNote = 0;
            this.m_portamento = 0;
            this.m_usingPoly = false;
            this.m_polyVoice = 1;
            this.m_polyForce = false;

            this.m_metaTitle = "";
            this.m_metaArtist = "";
            this.m_metaCoding = "";
            this.m_metaComment = "";

            this.processComment(str);
            // console.log(this.m_string.s+"\n\n");
            this.processMacro();
            // console.log(this.m_string.s);
            this.m_string.mapRemoveWhitespace();
            // console.log(this.m_string.s);
            this.processRepeat();
            // console.log(this.m_string.s);
            this.processGroupNotes();
            // console.log(this.m_string.s);
            this.process();

            // omit
            if (this.m_tracks[this.m_tracks.length - 1].getNumEvents() === 0) this.m_tracks.pop();

            // conduct
            this.m_tracks[MTrack.TEMPO_TRACK].conduct(this.m_tracks);

            // post process
            for (var i: number = MTrack.TEMPO_TRACK; i < this.m_tracks.length; i++) {
                if (i > MTrack.TEMPO_TRACK) {
                    if (this.m_usingPoly && (this.m_polyForce || this.m_tracks[i].findPoly())) {
                        this.m_tracks[i].usingPoly(this.m_polyVoice);
                    }
                    this.m_tracks[i].recRestMSec(2000);
                    this.m_tracks[i].recClose();
                }
                this.m_sequencer.connect(this.m_tracks[i]);
            }

            // initialize modules
            this.m_sequencer.createPipes(this.m_maxPipe + 1);
            this.m_sequencer.createSyncSources(this.m_maxSyncSource + 1);

            // dispatch event
            msgr.compileComplete();

            // play start
            if (!paused) this.m_sequencer.play();

            msgr.onstopsound = null;
        }

        stop(): void {
            this.m_sequencer.stop();
        }

        pause(): void {
            this.m_sequencer.pause();
        }

        resume(): void {
            this.m_sequencer.play();
        }

        /*
        getGlobalTick(): number {
            return this.m_sequencer.getGlobalTick();
        }
        */

        isPlaying(): boolean {
            return this.m_sequencer.isPlaying();
        }

        isPaused(): boolean {
            return this.m_sequencer.isPaused();
        }

        mute(iTrack: number, f: boolean): void {
            if (iTrack == MTrack.TEMPO_TRACK) return;
            this.m_tracks[iTrack].mute(f);
        }

        isMuted(iTrack: number): boolean {
            return this.m_tracks[iTrack].isMuted();
        }

        muteAll(f: boolean): void {
            for (var i=MTrack.FIRST_TRACK; i < this.m_tracks.length; i++) {
                this.m_tracks[i].mute(f);
            }
        }

        getTotalMSec(): number {
            return this.m_tracks[MTrack.TEMPO_TRACK].getTotalMSec();
        }

        getTotalTimeStr(): string {
            return this.m_tracks[MTrack.TEMPO_TRACK].getTotalTimeStr();
        }

        getNowMSec(): number {
            return this.m_sequencer.getNowMSec();
        }

        getNowTimeStr(): string {
            return this.m_sequencer.getNowTimeStr();
        }

        getVoiceCount(): number {
            var i: number;
            var c: number = 0;
            for (i = 0; i < this.m_tracks.length; i++) {
                c += this.m_tracks[i].getVoiceCount();
            }
            return c;
        }

        getMetaTitle(): string {
            return this.m_metaTitle;
        }

        getMetaComment(): string {
            return this.m_metaComment;
        }

        getMetaArtist(): string {
            return this.m_metaArtist;
        }

        getMetaCoding(): string {
            return this.m_metaCoding;
        }
        
        getSequencerStatus(): ISequencerStatus {
            var tracks: ITrackStatus[] = [];
            for (var track of this.m_tracks) {
                var s = track.getTrackStatus();
                tracks.push(s);
            }
            var l = this.m_sequencer.getLevel();
            return {
                tracks: tracks,
                levelL: l[0],
                levelR: l[1]
            };
        }
    }
}
