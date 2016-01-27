/// <reference path="IChannelStatus.ts" />

module flmml {
    
    export interface ITrackStatus {
        volume: number;
        channel: IChannelStatus;
    }
    
}
