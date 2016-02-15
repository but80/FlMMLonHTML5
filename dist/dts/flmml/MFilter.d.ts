declare module flmml {
    class MFilter {
        private static SAMPLE_RATE;
        private m_t1;
        private m_t2;
        private m_b0;
        private m_b1;
        private m_b2;
        private m_b3;
        private m_b4;
        private sw;
        constructor();
        reset(): void;
        setSwitch(s: number): void;
        checkToSilence(): boolean;
        run(samples: Float32Array, start: number, end: number, envelope: MEnvelope, frq: number, amt: number, res: number, key: number): void;
        lpf1(samples: Float32Array, start: number, end: number, envelope: MEnvelope, frq: number, amt: number, res: number, key: number): void;
        lpf2(samples: Float32Array, start: number, end: number, envelope: MEnvelope, frq: number, amt: number, res: number, key: number): void;
        hpf1(samples: Float32Array, start: number, end: number, envelope: MEnvelope, frq: number, amt: number, res: number, key: number): void;
        hpf2(samples: Float32Array, start: number, end: number, envelope: MEnvelope, frq: number, amt: number, res: number, key: number): void;
    }
}
