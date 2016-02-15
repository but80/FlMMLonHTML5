/// <reference path="MOscMod.d.ts" />
declare module flmml {
    class MOscGbWave extends MOscMod {
        static MAX_WAVE: number;
        static GB_WAVE_TABLE_LEN: number;
        protected static s_init: number;
        protected static s_table: Array<Array<number>>;
        protected m_waveNo: number;
        constructor();
        static boot(): void;
        static setWave(waveNo: number, wave: string): void;
        setWaveNo(waveNo: number): void;
        getNextSample(): number;
        getNextSampleOfs(ofs: number): number;
        getSamples(samples: Float32Array, start: number, end: number): void;
        getSamplesWithSyncIn(samples: Float32Array, syncin: Array<boolean>, start: number, end: number): void;
        getSamplesWithSyncOut(samples: Float32Array, syncout: Array<boolean>, start: number, end: number): void;
    }
}
