/// <reference path="MOscMod.d.ts" />
declare module flmml {
    /**
       Special thanks to OffGao.
     */
    class MOscGbSNoise extends MOscMod {
        static GB_NOISE_PHASE_SFT: number;
        static GB_NOISE_PHASE_DLT: number;
        static GB_NOISE_TABLE_LEN: number;
        static GB_NOISE_TABLE_MOD: number;
        protected static s_init: number;
        protected static s_table: Array<number>;
        protected static s_interval: Array<number>;
        protected m_sum: number;
        protected m_skip: number;
        constructor();
        static boot(): void;
        getNextSample(): number;
        getNextSampleOfs(ofs: number): number;
        getSamples(samples: Float32Array, start: number, end: number): void;
        setFrequency(frequency: number): void;
        setNoiseFreq(no: number): void;
        setNoteNo(noteNo: number): void;
    }
}
