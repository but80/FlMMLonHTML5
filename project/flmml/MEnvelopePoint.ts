﻿module FlMMLWorker.flmml {
    export class MEnvelopePoint {
        time: number;
        level: number;
        next: MEnvelopePoint = null;
    }
} 