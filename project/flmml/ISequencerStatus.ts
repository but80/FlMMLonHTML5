/// <reference path="ITrackStatus.ts" />

module flmml {
    
    export interface ISequencerStatus {
        tracks: ITrackStatus[];
        levelL: number;
        levelR: number;
    }
    
}
