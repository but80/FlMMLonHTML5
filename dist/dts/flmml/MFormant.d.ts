declare module flmml {
    /**
     * This class was created based on "Formant filter" that programmed by alex.
     See following URL; http://www.musicdsp.org/showArchiveComment.php?ArchiveID=110
     Thanks to his great works!
    */
    class MFormant {
        static VOWEL_A: number;
        static VOWEL_E: number;
        static VOWEL_I: number;
        static VOWEL_O: number;
        static VOWEL_U: number;
        private m_ca0;
        private m_ca1;
        private m_ca2;
        private m_ca3;
        private m_ca4;
        private m_ca5;
        private m_ca6;
        private m_ca7;
        private m_ca8;
        private m_ca9;
        private m_caA;
        private m_ce0;
        private m_ce1;
        private m_ce2;
        private m_ce3;
        private m_ce4;
        private m_ce5;
        private m_ce6;
        private m_ce7;
        private m_ce8;
        private m_ce9;
        private m_ceA;
        private m_ci0;
        private m_ci1;
        private m_ci2;
        private m_ci3;
        private m_ci4;
        private m_ci5;
        private m_ci6;
        private m_ci7;
        private m_ci8;
        private m_ci9;
        private m_ciA;
        private m_co0;
        private m_co1;
        private m_co2;
        private m_co3;
        private m_co4;
        private m_co5;
        private m_co6;
        private m_co7;
        private m_co8;
        private m_co9;
        private m_coA;
        private m_cu0;
        private m_cu1;
        private m_cu2;
        private m_cu3;
        private m_cu4;
        private m_cu5;
        private m_cu6;
        private m_cu7;
        private m_cu8;
        private m_cu9;
        private m_cuA;
        private m_m0;
        private m_m1;
        private m_m2;
        private m_m3;
        private m_m4;
        private m_m5;
        private m_m6;
        private m_m7;
        private m_m8;
        private m_m9;
        private m_vowel;
        private m_power;
        constructor();
        setVowel(vowel: number): void;
        disable(): void;
        reset(): void;
        checkToSilence(): boolean;
        run(samples: Float32Array, start: number, end: number): void;
    }
}
