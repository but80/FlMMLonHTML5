/// <reference path="IMessage.d.ts" />

declare module messenger {

    export interface ICompCompMessage_Info {
        totalMSec: number;
        totalTimeStr: string;
        warnings: any[];
        metaTitle: string;
        metaComment: string;
        metaArtist: string;
        metaCoding: string;
    }

    export interface ICompCompMessage {
        mml: string;
        type: number;
        info: ICompCompMessage_Info;
        events: any[][][];
    }
    
}
