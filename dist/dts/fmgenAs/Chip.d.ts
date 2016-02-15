/// <reference path="JaggArray.d.ts" />
declare module fmgenAs {
    class Chip {
        private ratio_;
        aml_: number;
        pml_: number;
        pmv_: number;
        private multable_;
        Chip(): void;
        SetRatio(ratio: number): void;
        SetAML(l: number): void;
        SetPML(l: number): void;
        SetPMV(pmv: number): void;
        GetMulValue(dt2: number, mul: number): number;
        GetAML(): number;
        GetPML(): number;
        GetPMV(): number;
        GetRatio(): number;
        private MakeTable();
    }
}
