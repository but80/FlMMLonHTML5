/// <reference path="MOscMod.d.ts" />
declare module flmml {
    class MOscPulse extends MOscMod {
        protected m_pwm: number;
        protected m_mix: number;
        protected m_modNoise: MOscNoise;
        constructor();
        static boot(): void;
        getNextSample(): number;
        getNextSampleOfs(ofs: number): number;
        getSamples(samples: Float32Array, start: number, end: number): void;
        getSamplesWithSyncIn(samples: Float32Array, syncin: Array<boolean>, start: number, end: number): void;
        getSamplesWithSyncOut(samples: Float32Array, syncout: Array<boolean>, start: number, end: number): void;
        setPWM(pwm: number): void;
        setMIX(mix: number): void;
        setNoise(noise: MOscNoise): void;
    }
}
