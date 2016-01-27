/// <reference path="../flmml/ITrackStatus.ts" />

module messenger {
    
    export interface ISyncInfoMessage_Info {
        _isPlaying: boolean;
        _isPaused: boolean;
        nowMSec: number;
        nowTimeStr: string;
        voiceCount: number;
        sequencerStatus: flmml.ISequencerStatus;
    }
    
    export interface ISyncInfoMessage {
        type: number;
        info: ISyncInfoMessage_Info;
    }
    
}