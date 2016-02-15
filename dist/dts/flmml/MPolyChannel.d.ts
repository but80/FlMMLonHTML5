/// <reference path="MChannel.d.ts" />
declare module flmml {
    /**
     * ...
     * @author ALOE
     */
    class MPolyChannel implements IChannel {
        protected m_form: number;
        protected m_subform: number;
        protected m_volMode: number;
        protected m_voiceId: number;
        protected m_lastVoice: MChannel;
        protected m_voiceLimit: number;
        protected m_voices: Array<MChannel>;
        protected m_voiceLen: number;
        constructor(voiceLimit: number);
        mute(f: boolean): void;
        isMuted(): boolean;
        setExpression(ex: number): void;
        setVelocity(velocity: number): void;
        setNoteNo(noteNo: number, tie?: boolean): void;
        setDetune(detune: number): void;
        getVoiceCount(): number;
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
        setInput(ii: number, p: number): void;
        setOutput(oo: number, p: number): void;
        setRing(s: number, p: number): void;
        setSync(m: number, p: number): void;
        setPortamento(depth: number, len: number): void;
        setMidiPort(mode: number): void;
        setMidiPortRate(rate: number): void;
        setPortBase(portBase: number): void;
        setVoiceLimit(voiceLimit: number): void;
        setHwLfo(data: number): void;
        reset(): void;
        getSamples(samplesSt: Array<Float32Array>, max: number, start: number, delta: number): void;
    }
}
