declare module flmml {
    class MSequencer {
        protected static DEFAULT_MULTIPLE: number;
        protected MULTIPLE: number;
        protected BUFFER_SIZE: number;
        protected SAMPLE_RATE: number;
        protected emptyBuffer: Float32Array;
        protected m_buffer: Array<Array<Float32Array>>;
        protected m_playSide: number;
        protected m_playSize: number;
        protected m_step: number;
        protected m_processTrack: number;
        protected m_processOffset: number;
        protected m_trackArr: Array<MTrack>;
        protected m_globalSample: number;
        protected m_maxNowMSec: number;
        protected m_totalMSec: number;
        protected m_status: number;
        protected m_buffTimer: number;
        protected m_procTimer: number;
        protected m_lastTime: number;
        protected m_maxProcTime: number;
        protected m_waitPause: boolean;
        protected m_offlineFormat: string;
        protected processAllBinded: Function;
        constructor(offlineFormat?: string);
        static getTimer(): number;
        play(): void;
        stop(): void;
        pause(): void;
        disconnectAll(): void;
        connect(track: MTrack): void;
        private reqBuffering();
        private onBufferingReq();
        private startProcTimer(interval?);
        private processStart();
        private processAll();
        private onSampleData(e);
        createPipes(num: number): void;
        createSyncSources(num: number): void;
        isPlaying(): boolean;
        isPaused(): boolean;
        getTotalMSec(): number;
        getNowMSec(): number;
        getNowTimeStr(): string;
    }
}
