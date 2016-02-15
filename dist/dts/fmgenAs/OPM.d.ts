/// <reference path="Timer.d.ts" />
/// <reference path="Operator.d.ts" />
/// <reference path="Chip.d.ts" />
/// <reference path="Channel4.d.ts" />
/// <reference path="OpType.d.ts" />
/// <reference path="EGPhase.d.ts" />
declare module fmgenAs {
    /**
     * ...
     * @author ALOE
     */
    class OPM extends Timer {
        private fmvolume;
        private amplevel;
        private clock;
        private rate;
        private pcmrate;
        private pmd;
        private amd;
        private lfo_count_;
        private lfo_count_diff_;
        private lfo_step_;
        private lfo_count_prev_;
        private lfowaveform;
        private rateratio;
        private noise;
        private noisecount;
        private noisedelta;
        private lfofreq;
        private reg01;
        private kc;
        private kf;
        private pan;
        private chip;
        private static s_init;
        private static amtable;
        private static pmtable;
        private buf;
        private ix;
        private ox;
        private static sltable;
        private static slottable;
        static decaytable1: Array<Array<number>>;
        static attacktable: Array<Array<number>>;
        static sinetable: Array<number>;
        static cltable: Array<number>;
        private ch;
        constructor();
        private static BuildLFOTable();
        Init(c: number, rf: number): boolean;
        SetRate(c: number, r: number): boolean;
        SetChannelMask(mask: number): void;
        Reset(): void;
        protected RebuildTimeTable(): void;
        protected TimerA(): void;
        SetVolume(db: number): void;
        SetExpression(amp: number): void;
        ReadStatus(): number;
        protected SetStatus(bits: number): void;
        protected ResetStatus(bits: number): void;
        SetReg(addr: number, data: number): void;
        protected SetParameter(addr: number, data: number): void;
        Mix(buffer: Float32Array, start: number, nsamples: number): void;
        protected Intr(f: boolean): void;
        IsOn(c: number): boolean;
    }
}
