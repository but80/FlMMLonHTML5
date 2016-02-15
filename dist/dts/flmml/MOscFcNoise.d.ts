/// <reference path="MOscMod.d.ts" />
declare module flmml {
    /**
       Special thanks to OffGao.
     */
    class MOscFcNoise extends MOscMod {
        static FC_NOISE_PHASE_SFT: number;
        static FC_NOISE_PHASE_SEC: number;
        static FC_NOISE_PHASE_DLT: number;
        protected static s_interval: Array<number>;
        protected m_fcr: number;
        protected m_snz: number;
        protected m_val: number;
        private getValue();
        setShortMode(): void;
        setLongMode(): void;
        constructor();
        resetPhase(): void;
        addPhase(time: number): void;
        static boot(): void;
        getNextSample(): number;
        getNextSampleOfs(ofs: number): number;
        getSamples(samples: Float32Array, start: number, end: number): void;
        setFrequency(frequency: number): void;
        setNoiseFreq(no: number): void;
        setNoteNo(noteNo: number): void;
    }
}
