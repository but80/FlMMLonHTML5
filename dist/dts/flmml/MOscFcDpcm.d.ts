/// <reference path="MOscMod.d.ts" />
declare module flmml {
    /**
       DPCM Oscillator by OffGao
       09/05/11：作成
       09/11/05：波形データ格納処理で、データが32bitごとに1bit抜けていたのを修正
     */
    class MOscFcDpcm extends MOscMod {
        static MAX_WAVE: number;
        static FC_CPU_CYCLE: number;
        static FC_DPCM_PHASE_SFT: number;
        static FC_DPCM_MAX_LEN: number;
        static FC_DPCM_TABLE_MAX_LEN: number;
        static FC_DPCM_NEXT: number;
        protected m_readCount: number;
        protected m_address: number;
        protected m_bit: number;
        protected m_wav: number;
        protected m_length: number;
        protected m_ofs: number;
        protected static s_init: number;
        protected static s_table: Array<Array<number>>;
        protected static s_intVol: Array<number>;
        protected static s_loopFg: Array<number>;
        protected static s_length: Array<number>;
        protected m_waveNo: number;
        protected static s_interval: Array<number>;
        constructor();
        static boot(): void;
        static setWave(waveNo: number, intVol: number, loopFg: number, wave: string): void;
        setWaveNo(waveNo: number): void;
        private getValue();
        resetPhase(): void;
        getNextSample(): number;
        getNextSampleOfs(ofs: number): number;
        getSamples(samples: Float32Array, start: number, end: number): void;
        setFrequency(frequency: number): void;
        setDpcmFreq(no: number): void;
        setNoteNo(noteNo: number): void;
    }
}
