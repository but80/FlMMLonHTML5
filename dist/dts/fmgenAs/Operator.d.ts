/// <reference path="JaggArray.d.ts" />
declare module fmgenAs {
    /**
     * ...
     * @author ALOE
     */
    class Operator {
        chip_: Chip;
        out_: number;
        out2_: number;
        in2_: number;
        private dp_;
        private detune_;
        private detune2_;
        private multiple_;
        pg_count_: number;
        pg_diff_: number;
        pg_diff_lfo_: number;
        type_: number;
        bn_: number;
        eg_level_: number;
        eg_level_on_next_phase_: number;
        eg_count_: number;
        eg_count_diff_: number;
        eg_out_: number;
        tl_out_: number;
        eg_rate_: number;
        eg_curve_count_: number;
        ssg_offset_: number;
        ssg_vector_: number;
        ssg_phase_: number;
        key_scale_rate_: number;
        eg_phase_: number;
        ams_: Array<number>;
        ms_: number;
        private tl_;
        private tl_latch_;
        private ar_;
        private dr_;
        private sr_;
        private sl_;
        private rr_;
        private ks_;
        private ssg_type_;
        private keyon_;
        amon_: boolean;
        private param_changed_;
        private mute_;
        private static notetable;
        private static dttable;
        static decaytable1: Array<Array<number>>;
        private static decaytable2;
        static attacktable: Array<Array<number>>;
        private static ssgenvtable;
        static sinetable: Array<number>;
        static cltable: Array<number>;
        static amtable: Array<Array<Array<number>>>;
        constructor();
        SetChip(chip: Chip): void;
        Reset(): void;
        SetDPBN(dp: number, bn: number): void;
        Prepare(): void;
        ShiftPhase(nextphase: number): void;
        SetFNum(f: number): void;
        static IS2EC_SHIFT: number;
        private SINE(s);
        private LogToLin(a);
        private EGUpdate();
        private SetEGRate(rate);
        private EGCalc();
        private EGStep();
        private PGCalc();
        private PGCalcL();
        Calc(ii: number): number;
        CalcL(ii: number): number;
        CalcN(noise: number): number;
        CalcFB(fb: number): number;
        CalcFBL(fb: number): number;
        ResetFB(): void;
        KeyOn(): void;
        KeyOff(): void;
        IsOn(): boolean;
        SetDT(dt: number): void;
        SetDT2(dt2: number): void;
        SetMULTI(mul: number): void;
        SetTL(tl: number, csm: boolean): void;
        SetAR(ar: number): void;
        SetDR(dr: number): void;
        SetSR(sr: number): void;
        SetSL(sl: number): void;
        SetRR(rr: number): void;
        SetKS(ks: number): void;
        SetAMON(amon: boolean): void;
        Mute(mute: boolean): void;
        SetMS(ms: number): void;
        Out(): number;
        Refresh(): void;
    }
}
