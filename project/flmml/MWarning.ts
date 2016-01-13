module flmml {
    export class MWarning {
        static UNKNOWN_COMMAND: number = 0;
        static UNCLOSED_REPEAT: number = 1;
        static UNOPENED_COMMENT: number = 2;
        static UNCLOSED_COMMENT: number = 3;
        static RECURSIVE_MACRO: number = 4;
        static UNCLOSED_ARGQUOTE: number = 5;
        static UNCLOSED_GROUPNOTES: number = 6;
        static UNOPENED_GROUPNOTES: number = 7;
        static INVALID_MACRO_NAME: number = 8;
        static s_string: Array<string> = [
            "Unknown command '%s'",
            "Unclosed repeat",
            "Unopened comment",
            "Unclosed comment",
            "Recursive macro",
            "Unclosed argument quote",
            "Unclosed group notes",
            "Unopened group notes",
            "Invalid macro name '%s'"
        ];

        static getString(warnId: number, str: string): string {
            return this.s_string[warnId].replace("%s", str);
        }
    }
}
