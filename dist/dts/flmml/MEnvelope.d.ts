/// <reference path="MEnvelopePoint.d.ts" />
declare module flmml {
    class MEnvelope {
        private static SAMPLE_RATE;
        private m_envelopePoint;
        private m_envelopeLastPoint;
        private m_currentPoint;
        private m_releaseTime;
        private m_currentVal;
        private m_releaseStep;
        private m_releasing;
        private m_step;
        private m_playing;
        private m_counter;
        private m_timeInSamples;
        private static s_init;
        private static s_volumeMap;
        private static s_volumeLen;
        constructor(attack: number, decay: number, sustain: number, release: number);
        static boot(): void;
        setAttack(attack: number): void;
        setRelease(release: number): void;
        addPoint(time: number, level: number): void;
        triggerEnvelope(zeroStart: number): void;
        releaseEnvelope(): void;
        soundOff(): void;
        getNextAmplitudeLinear(): number;
        ampSamplesLinear(samples: Float32Array, start: number, end: number, velocity: number): void;
        ampSamplesNonLinear(samples: Float32Array, start: number, end: number, velocity: number, volMode: number): void;
        isPlaying(): boolean;
        isReleasing(): boolean;
    }
}
