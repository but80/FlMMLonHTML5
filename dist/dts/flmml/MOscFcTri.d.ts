/// <reference path="MOscMod.d.ts" />
declare module flmml {
    class MOscFcTri extends MOscMod {
        static FC_TRI_TABLE_LEN: number;
        static MAX_WAVE: number;
        protected static s_init: number;
        protected static s_table: Array<Array<number>>;
        protected m_waveNo: number;
        constructor();
        static boot(): void;
        getNextSample(): number;
        getNextSampleOfs(ofs: number): number;
        getSamples(samples: Float32Array, start: number, end: number): void;
        getSamplesWithSyncIn(samples: Float32Array, syncin: Array<boolean>, start: number, end: number): void;
        getSamplesWithSyncOut(samples: Float32Array, syncout: Array<boolean>, start: number, end: number): void;
        setWaveNo(waveNo: number): void;
    }
}
