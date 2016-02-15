/// <reference path="MOscMod.d.ts" />
declare module flmml {
    class MOscNoise extends MOscMod {
        static TABLE_MSK: number;
        static NOISE_PHASE_SFT: number;
        static NOISE_PHASE_MSK: number;
        0: any;
        protected m_noiseFreq: number;
        protected m_counter: number;
        protected m_resetPhase: boolean;
        static s_init: number;
        static s_table: Array<number>;
        constructor();
        disableResetPhase(): void;
        static boot(): void;
        resetPhase(): void;
        addPhase(time: number): void;
        getNextSample(): number;
        getNextSampleOfs(ofs: number): number;
        getSamples(samples: Float32Array, start: number, end: number): void;
        setFrequency(frequency: number): void;
        setNoiseFreq(frequency: number): void;
        restoreFreq(): void;
    }
}
