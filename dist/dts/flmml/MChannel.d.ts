/// <reference path="IChannel.d.ts" />
/// <reference path="MEnvelope.d.ts" />
/// <reference path="MOscillator.d.ts" />
/// <reference path="MOscNoise.d.ts" />
/// <reference path="MOscOPM.d.ts" />
/// <reference path="MOscPulse.d.ts" />
/// <reference path="MFilter.d.ts" />
/// <reference path="MFormant.d.ts" />
declare module flmml {
    class MChannel implements IChannel {
        private static SAMPLE_RATE;
        private static emptyBuffer;
        private m_noteNo;
        private m_detune;
        private m_freqNo;
        private m_envelope1;
        private m_envelope2;
        private m_oscSet1;
        private m_oscMod1;
        private m_oscSet2;
        private m_oscMod2;
        private m_osc2Connect;
        private m_osc2Sign;
        private m_filter;
        private m_filterConnect;
        private m_formant;
        private m_expression;
        private m_velocity;
        private m_ampLevel;
        private m_pan;
        private m_onCounter;
        private m_lfoDelay;
        private m_lfoDepth;
        private m_lfoEnd;
        private m_lfoTarget;
        private m_lpfAmt;
        private m_lpfFrq;
        private m_lpfRes;
        private m_pulseWidth;
        private m_volMode;
        private m_inSens;
        private m_inPipe;
        private m_outMode;
        private m_outPipe;
        private m_ringSens;
        private m_ringPipe;
        private m_syncMode;
        private m_syncPipe;
        private m_isMuted;
        private m_portDepth;
        private m_portDepthAdd;
        private m_portamento;
        private m_portRate;
        private m_lastFreqNo;
        private m_slaveVoice;
        private m_voiceid;
        static PITCH_RESOLUTION: number;
        protected static s_init: number;
        protected static s_frequencyMap: Array<number>;
        protected static s_frequencyLen: number;
        protected static s_volumeMap: Array<Array<number>>;
        protected static s_volumeLen: number;
        protected static s_samples: Float32Array;
        protected static s_pipeArr: Array<Float32Array>;
        protected static s_syncSources: Array<Array<boolean>>;
        protected static s_lfoDelta: number;
        constructor();
        static boot(numSamples: number): void;
        static createPipes(num: number): void;
        static createSyncSources(num: number): void;
        static getFrequency(freqNo: number): number;
        setExpression(ex: number): void;
        setVelocity(velocity: number): void;
        setNoteNo(noteNo: number, tie?: boolean): void;
        setDetune(detune: number): void;
        getNoteNo(): number;
        isPlaying(): boolean;
        mute(f: boolean): void;
        isMuted(): boolean;
        getId(): number;
        getVoiceCount(): number;
        setSlaveVoice(f: boolean): void;
        noteOnWidthId(noteNo: number, velocity: number, id: number): void;
        noteOn(noteNo: number, velocity: number): void;
        noteOff(noteNo: number): void;
        setSoundOff(): void;
        close(): void;
        setNoiseFreq(frequency: number): void;
        setForm(form: number, subform: number): void;
        setEnvelope1Atk(attack: number): void;
        setEnvelope1Point(time: number, level: number): void;
        setEnvelope1Rel(release: number): void;
        setEnvelope2Atk(attack: number): void;
        setEnvelope2Point(time: number, level: number): void;
        setEnvelope2Rel(release: number): void;
        setPWM(pwm: number): void;
        setPan(pan: number): void;
        setFormant(vowel: number): void;
        setLFOFMSF(form: number, subform: number): void;
        setLFODPWD(depth: number, freq: number): void;
        setLFODLTM(delay: number, time: number): void;
        setLFOTarget(target: number): void;
        setLpfSwtAmt(swt: number, amt: number): void;
        setLpfFrqRes(frq: number, res: number): void;
        setVolMode(m: number): void;
        setInput(i: number, p: number): void;
        setOutput(o: number, p: number): void;
        setRing(s: number, p: number): void;
        setSync(m: number, p: number): void;
        setPortamento(depth: number, len: number): void;
        setMidiPort(mode: number): void;
        setMidiPortRate(rate: number): void;
        setPortBase(base: number): void;
        setVoiceLimit(voiceLimit: number): void;
        setHwLfo(data: number): void;
        reset(): void;
        clearOutPipe(max: number, start: number, delta: number): void;
        protected getNextCutoff(): number;
        getSamples(samplesSt: Array<Float32Array>, max: number, start: number, delta: number): void;
        private getSamples___(samples, start, end);
        private getSamples_P_(samples, start, end);
        private getSamples_W_(samples, start, end);
        private getSamplesF__(samples, start, end);
        private getSamplesFP_(samples, start, end);
        private getSamplesFW_(samples, start, end);
        private getSamplesFF_(samples, start, end);
        private getSamplesI__(samples, start, end);
        private getSamplesIP_(samples, start, end);
        private getSamplesIW_(samples, start, end);
        private getSamplesO__(samples, start, end);
        private getSamplesOP_(samples, start, end);
        private getSamplesOW_(samples, start, end);
        /*** ここから下がポルタメントありの場合 ***/
        private getSamples__P(samples, start, end);
        private getSamples_PP(samples, start, end);
        private getSamples_WP(samples, start, end);
        private getSamplesF_P(samples, start, end);
        private getSamplesFPP(samples, start, end);
        private getSamplesFWP(samples, start, end);
        private getSamplesFFP(samples, start, end);
        private getSamplesI_P(samples, start, end);
        private getSamplesIPP(samples, start, end);
        private getSamplesIWP(samples, start, end);
        private getSamplesO_P(samples, start, end);
        private getSamplesOPP(samples, start, end);
        private getSamplesOWP(samples, start, end);
    }
}
