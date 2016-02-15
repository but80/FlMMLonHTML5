/// <reference path="MOscMod.d.ts" />
/// <reference path="../fmgenAs/OPM.d.ts" />
declare module flmml {
    /**
      * FM音源ドライバ MOscOPM for AS3
      * @author ALOE
      */
    class MOscOPM extends MOscMod {
        static MAX_WAVE: number;
        static OPM_CLOCK: number;
        static OPM_RATIO: number;
        static TIMB_SZ_M: number;
        static TIMB_SZ_N: number;
        static TYPE_OPM: number;
        static TYPE_OPN: number;
        private m_fm;
        private m_oneSample;
        private m_opMask;
        private m_velocity;
        private m_al;
        private m_tl;
        private static s_init;
        private static s_table;
        private static s_comGain;
        private static kctable;
        private static slottable;
        private static carrierop;
        private static defTimbre;
        private static zeroTimbre;
        constructor();
        static boot(): void;
        static clearTimber(): void;
        private static trim(str);
        static setTimber(no: number, type: number, s: String): void;
        protected loadTimbre(p: Array<number>): void;
        static setCommonGain(gain: number): void;
        private SetFBAL(fb, al);
        private SetDT1ML(slot, DT1, MUL);
        private SetTL(slot, TL);
        private SetKSAR(slot, KS, AR);
        private SetDRAMS(slot, DR, AMS);
        private SetDT2SR(slot, DT2, SR);
        private SetSLRR(slot, SL, RR);
        setPMSAMS(PMS: number, AMS: number): void;
        setPMD(PMD: number): void;
        setAMD(AMD: number): void;
        setNENFRQ(NE: number, NFQR: number): void;
        setLFRQ(f: number): void;
        setWF(wf: number): void;
        noteOn(): void;
        noteOff(): void;
        setWaveNo(waveNo: number): void;
        setNoteNo(noteNo: number): void;
        setOpMask(mask: number): void;
        setVelocity(vel: number): void;
        setExpression(ex: number): void;
        setFrequency(frequency: number): void;
        getNextSample(): number;
        getNextSampleOfs(ofs: number): number;
        getSamples(samples: Float32Array, start: number, end: number): void;
        IsPlaying(): boolean;
    }
}
