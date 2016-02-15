/// <reference path="Operator.d.ts" />
/// <reference path="JaggArray.d.ts" />
declare module fmgenAs {
    /**
     * ...
     * @author ALOE
     */
    class Channel4 {
        fb: number;
        buf: Array<number>;
        pms: Array<number>;
        ix: Array<number>;
        ox: Array<number>;
        algo_: number;
        chip_: Chip;
        op: Array<Operator>;
        private static fbtable;
        private static kftable;
        private static kctable;
        private static iotable;
        static pmtable: Array<Array<Array<number>>>;
        constructor();
        SetType(type: number): void;
        SetFB(feedback: number): void;
        SetMS(ms: number): void;
        Mute(m: boolean): void;
        Refresh(): void;
        SetChip(chip: Chip): void;
        Reset(): void;
        Prepare(): number;
        SetFNum(f: number): void;
        SetKCKF(kc: number, kf: number): void;
        KeyControl(key: number): void;
        SetAlgorithm(algo: number): void;
        GetAlgorithm(): number;
        Calc(): number;
        CalcL(): number;
        CalcN(noise: number): number;
        CalcLN(noise: number): number;
    }
}
