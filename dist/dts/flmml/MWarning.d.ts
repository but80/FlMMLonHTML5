declare module flmml {
    class MWarning {
        static UNKNOWN_COMMAND: number;
        static UNCLOSED_REPEAT: number;
        static UNOPENED_COMMENT: number;
        static UNCLOSED_COMMENT: number;
        static RECURSIVE_MACRO: number;
        static UNCLOSED_ARGQUOTE: number;
        static UNCLOSED_GROUPNOTES: number;
        static UNOPENED_GROUPNOTES: number;
        static INVALID_MACRO_NAME: number;
        static s_string: Array<string>;
        static getString(warnId: number, str: string): string;
    }
}
