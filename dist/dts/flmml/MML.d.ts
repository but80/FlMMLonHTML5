/// <reference path="MFormant.d.ts" />
/// <reference path="MOscFcDpcm.d.ts" />
/// <reference path="MOscFcNoise.d.ts" />
/// <reference path="MOscFcTri.d.ts" />
/// <reference path="MOscGbLNoise.d.ts" />
/// <reference path="MOscGbSNoise.d.ts" />
/// <reference path="MOscGbWave.d.ts" />
/// <reference path="MOscillator.d.ts" />
/// <reference path="MOscMod.d.ts" />
/// <reference path="MOscNoise.d.ts" />
/// <reference path="MOscOPM.d.ts" />
/// <reference path="MOscPulse.d.ts" />
/// <reference path="MOscSaw.d.ts" />
/// <reference path="MOscSine.d.ts" />
/// <reference path="MOscTriangle.d.ts" />
/// <reference path="MOscWave.d.ts" />
/// <reference path="MTrack.d.ts" />
/// <reference path="MWarning.d.ts" />
/// <reference path="../messenger/Messenger.d.ts" />
declare module flmml {
    class SourceString {
        protected _source: any;
        protected _lineTail: number[];
        constructor(s: string);
        toLineColumn(i: number): {
            line: number;
            column: number;
        };
    }
    type MapRef = {
        label: string;
        pos?: number;
    };
    class MapReference {
        pos: number;
        refs: MapRef[];
        constructor(pos: number);
        clone(): MapReference;
        pushRef(label: string, pos?: number): MapReference;
    }
    class MappedString {
        protected _str: string;
        protected _map: MapReference[];
        protected cache: string;
        constructor(s?: string);
        clone(): MappedString;
        pushRef(label: string, pos?: number): MappedString;
        concat(s: MappedString): MappedString;
        s: string;
        toString(): string;
        position: number;
        refs: MapRef[];
        toTrace(source: SourceString, trackNo: number): any[];
        mapRemoveWhitespace(): void;
        mapRemove(start: number, end: number): void;
        protected matchedRanges(ptrn: any): number[][];
        mapReplace(from: any, to?: MappedString): void;
        mapReplaceRange(begin: number, end: number, r: MappedString): void;
        replace(from: any, to: MappedString): MappedString;
        split(delim: any): MappedString[];
        mapLowerCase(): void;
        append(s: MappedString): void;
        appendRaw(s: string): void;
        length: number;
        indexOf(s: string, p?: number): number;
        match(r: any): RegExpMatchArray;
        substr(f: number, l?: number): MappedString;
        substring(s: number, e?: number): MappedString;
        charAt(i: number): MappedString;
    }
    type MacroArg = {
        id: string;
        index: number;
    };
    type MacroDef = {
        id: string;
        code: MappedString;
        args: Array<MappedString | MacroArg>;
    };
    class MML {
        protected static MAX_PIPE: number;
        protected static MAX_SYNCSOURCE: number;
        protected static MAX_POLYVOICE: number;
        protected m_offlineFormat: string;
        protected m_sequencer: MSequencer;
        protected m_tracks: Array<MTrack>;
        protected m_source: SourceString;
        protected m_string: MappedString;
        protected m_trackNo: number;
        protected m_octave: number;
        protected m_relativeDir: boolean;
        protected m_velocity: number;
        protected m_velDetail: boolean;
        protected m_velDir: boolean;
        protected m_length: number;
        protected m_tempo: number;
        protected m_letter: number;
        protected m_keyoff: number;
        protected m_gate: number;
        protected m_maxGate: number;
        protected m_form: number;
        protected m_noteShift: number;
        protected m_warning: any[];
        protected m_maxPipe: number;
        protected m_maxSyncSource: number;
        protected m_beforeNote: number;
        protected m_portamento: number;
        protected m_usingPoly: boolean;
        protected m_polyVoice: number;
        protected m_polyForce: boolean;
        protected m_metaTitle: string;
        protected m_metaArtist: string;
        protected m_metaCoding: string;
        protected m_metaComment: string;
        trackEndMarginMSec: number;
        channelEndMarginMSec: number;
        constructor(offlineFormat?: string);
        static remove(str: string, start: number, end: number): string;
        getWarnings(): any[];
        protected warning(warnId: number, str: string | MappedString): void;
        protected len2tick(len: number): number;
        protected note(noteNo: number, trace: any[]): void;
        protected rest(): void;
        protected atmark(): void;
        protected firstLetter(): void;
        getEventById(eventId: number): MEvent;
        protected getCharPrev(): MappedString;
        protected getRawCharNext(): string;
        protected getRawChar(): string;
        protected getChar(): MappedString;
        protected getCharNext(): MappedString;
        protected next(i?: number): void;
        protected getKeySig(): number;
        protected getUInt(def: number): number;
        protected getUNumber(def: number): number;
        protected getSInt(def: number): number;
        protected getDot(tick: number): number;
        createTrack(): MTrack;
        protected begin(): void;
        protected process(): void;
        protected processRepeat(): void;
        protected replaceMacro(macroTable: Array<MacroDef>): boolean;
        protected processMacro(): void;
        protected findMetaDescV(sectionName: string): Array<string>;
        protected findMetaDescN(sectionName: string): string;
        protected processComment(str: string): void;
        protected processGroupNotes(): void;
        play(str: string, paused?: boolean): void;
        private play2(str, paused?);
        stop(): void;
        pause(): void;
        resume(): void;
        isPlaying(): boolean;
        isPaused(): boolean;
        mute(iTrack: number, f: boolean): void;
        isMuted(iTrack: number): boolean;
        muteAll(f: boolean): void;
        getTotalMSec(): number;
        getTotalTimeStr(): string;
        getNowMSec(): number;
        getNowTimeStr(): string;
        getVoiceCount(): number;
        getMetaTitle(): string;
        getMetaComment(): string;
        getMetaArtist(): string;
        getMetaCoding(): string;
    }
}
