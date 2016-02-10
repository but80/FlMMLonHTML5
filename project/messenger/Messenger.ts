/// <reference path="../flmml/MML.ts" />

declare var global: any;
declare function require(m: string): any;
const WavEncoder = require("wav-encoder");

module messenger {

    import MML = flmml.MML;

    // from lib.webworker.d.ts
    declare function postMessage(message ?: any, ports ?: any): void;

    var COM_BOOT      =  1, // Main->Worker
        COM_PLAY      =  2, // Main->Worker
        COM_STOP      =  3, // Main->Worker
        COM_PAUSE     =  4, // Main->Worker
        COM_BUFFER    =  5, // Main->Worker->Main
        COM_COMPCOMP  =  6, // Worker->Main
        COM_BUFRING   =  7, // Worker->Main
        COM_COMPLETE  =  8, // Worker->Main
        COM_SYNCINFO  =  9, // Main->Worker->Main
        COM_PLAYSOUND = 10, // Worker->Main
        COM_STOPSOUND = 11, // Worker->Main->Worker
        COM_DEBUG     = 12, // Worker->Main
        COM_TRACE     = 13, // Main->Worker->Main
        COM_MUTE      = 14, // Main->Worker
        COM_GENWAV    = 15, // Main->Worker->Main
        COM_TERMINATE = 16; // Main->Worker

    export class Messenger {
        mml: MML;
        tIDInfo: number;
        infoInterval: number;
        lastInfoTime: number;
        SAMPLE_RATE: number;
        BUFFER_SIZE: number;
        emptyBuffer: Float32Array;

        onstopsound: Function = null;
        onrequestbuffer: Function = null;

        onInfoTimerBinded: Function;

        constructor() {
            this.onInfoTimerBinded = this.onInfoTimer.bind(this);

            addEventListener("message", this.onMessage.bind(this));
        }

        onMessage(e: any) {
            var data: any = e.data,
                type: number = data.type,
                mml: MML = this.mml;

            switch (type) {
                case COM_BOOT:
                    // console.log("[COM_BOOT] rate=%s bufsize=%s offlineFormat=%s", data.sampleRate, data.bufferSize, data.offlineFormat);
                    this.SAMPLE_RATE = data.sampleRate;
                    this.BUFFER_SIZE = data.bufferSize;
                    mml = this.mml = new MML(data.offlineFormat);
                    if (data.offlineFormat && data.mml != null) mml.play(data.mml);
                    break;
                case COM_PLAY:
                    // console.log("[COM_PLAY] paused=%s", data.paused);
                    mml.play(data.mml, data.paused);
                    break;
                case COM_STOP:
                    // console.log("[COM_STOP]");
                    mml.stop();
                    this.syncInfo();
                    break;
                case COM_PAUSE:
                    // console.log("[COM_PAUSE]");
                    mml.pause();
                    this.syncInfo();
                    break;
                case COM_MUTE:
                    // console.log("[COM_MUTE] track=%s mute=%s", data.track, data.mute);
                    mml.mute(data.track, data.mute);
                    break;
                case COM_BUFFER:
                    // console.log("[COM_BUFFER]");
                    this.onrequestbuffer && this.onrequestbuffer(data);
                    break;
                case COM_SYNCINFO:
                    // console.log("[COM_SYNCINFO] interval=%s", data.interval);
                    if (typeof data.interval === "number") {
                        this.infoInterval = data.interval;
                        clearInterval(this.tIDInfo);
                        if (this.infoInterval > 0 && this.mml.isPlaying()) {
                            this.tIDInfo = setInterval(this.onInfoTimerBinded, this.infoInterval);
                        }
                    } else {
                        this.syncInfo();
                    }
                    break;
                case COM_STOPSOUND:
                    // console.log("[COM_STOPSOUND]");
                    this.onstopsound && this.onstopsound();
                    break;
                case COM_TRACE:
                    this.responseTrace(data.eventId);
                    break;
                case COM_GENWAV:
                    // console.log("[COM_GENWAV]");
                    mml.play(data.mml);
                    break;
                case COM_TERMINATE:
                    self.close();
                    break;
            }
        }

        buffering(progress: number): void {
            postMessage({ type: COM_BUFRING, progress: progress });
        }

        compileComplete(): void {
            var mml: MML = this.mml;

            postMessage({
                type: COM_COMPCOMP,
                info: {
                    totalMSec: mml.getTotalMSec(),
                    totalTimeStr: mml.getTotalTimeStr(),
                    warnings: mml.getWarnings(),
                    metaTitle: mml.getMetaTitle(),
                    metaComment: mml.getMetaComment(),
                    metaArtist: mml.getMetaArtist(),
                    metaCoding: mml.getMetaCoding()
                },
                events: mml['m_tracks'].map((track)=>{
                    return track['m_events'].map((event)=>{
                        return [
                            event.getId(),
                            event['m_tick'],
                            event['m_status'],
                            event['m_data0'],
                            event['m_data1']
                        ];
                    })
                })
            });
        }

        sendWav(buffer: Float32Array[], format: string): void {
            switch (format) {

                case 'wav':
                    WavEncoder.encode({
                        sampleRate: this.SAMPLE_RATE,
                        channelData: buffer
                    }).then(function(wav) {
                        postMessage({
                            type: COM_GENWAV,
                            format: 'wav',
                            data: wav
                        });
                    });
                    break;

                default:
                    postMessage({
                        type: COM_GENWAV,
                        format: 'raw',
                        data: buffer
                    });
                    break;

            }
        }

        playSound(): void {
            postMessage({ type: COM_PLAYSOUND });
            this.syncInfo();
        }

        stopSound(isFlushBuf: boolean = false): void {
            postMessage({ type: COM_STOPSOUND, isFlushBuf: isFlushBuf });
        }

        sendBuffer(buffer: Array<Float32Array>): void {
            postMessage({ type: COM_BUFFER, buffer: buffer }, [buffer[0].buffer, buffer[1].buffer]);
        }

        complete(): void {
            postMessage({ type: COM_COMPLETE });
            this.syncInfo();
        }

        syncInfo(): void {
            var mml: MML = this.mml;

            this.lastInfoTime = self.performance ? self.performance.now() : new Date().getTime();
            postMessage({
                type: COM_SYNCINFO,
                info: {
                    _isPlaying: mml.isPlaying(),
                    _isPaused: mml.isPaused(),
                    nowMSec: mml.getNowMSec(),
                    nowTimeStr: mml.getNowTimeStr(),
                    voiceCount: mml.getVoiceCount()
                }
            });
        }

        responseTrace(eventId: number): void {
            postMessage({
                type: COM_TRACE,
                eventId: eventId,
                trace: this.mml.getEventById(eventId).getTrace()
            });
        }

        onInfoTimer(): void {
            if (this.mml.isPlaying()) {
                this.syncInfo();
            } else {
                clearInterval(this.tIDInfo);
            }
        }

        debug(str: string = ""): void {
            postMessage({ type: COM_DEBUG, str: str });
        }
    }
}

var msgr: messenger.Messenger = new messenger.Messenger();
