module messenger {
    
    export interface ISyncInfoMessage_Info {
        _isPlaying: boolean;
        _isPaused: boolean;
        nowMSec: number;
        nowTimeStr: string;
        voiceCount: number;
    }
    
    export interface ISyncInfoMessage {
        type: number;
        info: ISyncInfoMessage_Info;
    }
    
}