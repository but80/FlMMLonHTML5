declare module flmml {
    class MOscillator {
        static SINE: number;
        static SAW: number;
        static TRIANGLE: number;
        static PULSE: number;
        static NOISE: number;
        static FC_PULSE: number;
        static FC_TRI: number;
        static FC_NOISE: number;
        static FC_S_NOISE: number;
        static FC_DPCM: number;
        static GB_WAVE: number;
        static GB_NOISE: number;
        static GB_S_NOISE: number;
        static WAVE: number;
        static OPM: number;
        static MAX: number;
        protected m_osc: Array<MOscMod>;
        protected m_form: number;
        protected static s_init: number;
        constructor();
        asLFO(): void;
        static boot(): void;
        setForm(form: number): MOscMod;
        getForm(): number;
        getCurrent(): MOscMod;
        getMod(form: number): MOscMod;
        private setNoiseToPulse();
    }
}
