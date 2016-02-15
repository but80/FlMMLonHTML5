declare module fmgenAs {
    /**
     * ...
     * @author ALOE
     */
    class Timer {
        private regta;
        private timera;
        private timera_count;
        private timerb;
        private timerb_count;
        private timer_step;
        protected status: number;
        protected regtc: number;
        Reset(): void;
        Count(us: number): boolean;
        GetNextEvent(): number;
        protected SetStatus(bit: number): void;
        protected ResetStatus(bit: number): void;
        protected SetTimerBase(clock: number): void;
        protected SetTimerA(addr: number, data: number): void;
        protected SetTimerB(data: number): void;
        protected SetTimerControl(data: number): void;
        protected TimerA(): void;
    }
}
