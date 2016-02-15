/// <reference path="../flmml/MML.d.ts" />
/// <reference path="ISyncInfoMessage.d.ts" />
/// <reference path="ICompCompMessage.d.ts" />
declare var global: any;
declare function require(m: string): any;
declare const WavEncoder: any;
declare module messenger {
    import MML = flmml.MML;
    class Messenger {
        mml: MML;
        tIDInfo: number;
        infoInterval: number;
        lastInfoTime: number;
        SAMPLE_RATE: number;
        BUFFER_SIZE: number;
        emptyBuffer: Float32Array;
        onstopsound: Function;
        onrequestbuffer: Function;
        onInfoTimerBinded: Function;
        constructor();
        onMessage(e: any): void;
        buffering(progress: number): void;
        compileComplete(): void;
        sendWav(buffer: Float32Array[], format: string): void;
        playSound(): void;
        stopSound(isFlushBuf?: boolean): void;
        sendBuffer(buffer: Array<Float32Array>): void;
        complete(): void;
        syncInfo(): void;
        responseTrace(eventId: number): void;
        onInfoTimer(): void;
        debug(str?: string): void;
    }
}
declare var msgr: messenger.Messenger;
