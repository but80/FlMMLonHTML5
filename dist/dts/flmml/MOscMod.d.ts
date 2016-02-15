/// <reference path="MSequencer.d.ts" />
declare module flmml {
    class MOscMod {
        protected static SAMPLE_RATE: number;
        static TABLE_LEN: number;
        static PHASE_SFT: number;
        static PHASE_LEN: number;
        static PHASE_HLF: number;
        static PHASE_MSK: number;
        protected m_frequency: number;
        protected m_freqShift: number;
        protected m_phase: number;
        constructor();
        resetPhase(): void;
        addPhase(time: number): void;
        getNextSample(): number;
        getNextSampleOfs(ofs: number): number;
        getSamples(samples: Float32Array, start: number, end: number): void;
        getSamplesWithSyncIn(samples: Float32Array, syncin: Array<boolean>, start: number, end: number): void;
        getSamplesWithSyncOut(samples: Float32Array, syncout: Array<boolean>, start: number, end: number): void;
        getFrequency(): number;
        setFrequency(frequency: number): void;
        setWaveNo(waveNo: number): void;
        setNoteNo(noteNo: number): void;
    }
}
