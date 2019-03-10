"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scanner {
    constructor(socket) {
        this.socket = socket;
        this.receivedData = Buffer.alloc(0);
        this.bufferedLines = [];
        this.scanCursor = 0;
    }
    enqueueData(data) {
        this.receivedData = Buffer.concat([this.receivedData.slice(this.scanCursor), data]);
        this.scanCursor = 0;
    }
    scanLine() {
        const indexOfCRLF = this.receivedData.indexOf(Scanner.LINE_TERMINATOR, this.scanCursor);
        if (indexOfCRLF === -1)
            return null;
        if ((indexOfCRLF - this.scanCursor) > Scanner.MAXIMUM_LINE_LENGTH) {
            this.scanCursor = (indexOfCRLF + Scanner.LINE_TERMINATOR.length);
            return null;
        }
        const line = Buffer.from(this.receivedData.slice(this.scanCursor, indexOfCRLF));
        const code = parseInt(line.slice(0, 3).toString());
        const terminal = (line[3] === ' '.charCodeAt(0));
        this.scanCursor = (indexOfCRLF + Scanner.LINE_TERMINATOR.length);
        return {
            code: code,
            line: Buffer.from(line.slice(4)),
            terminal: terminal
        };
    }
    scanResponse() {
        while (true) {
            const line = this.scanLine();
            if (!line)
                break;
            this.bufferedLines.push(line);
        }
        ;
        const nonTerminalLines = this.bufferedLines.slice(0, -1);
        if (nonTerminalLines.some((value) => value.terminal))
            return null;
        if (!(this.bufferedLines[this.bufferedLines.length - 1].terminal))
            return null;
        for (let i = 0; i < nonTerminalLines.length; i++) {
            if (nonTerminalLines[i].code !== this.bufferedLines[i + 1].code)
                return null;
        }
        const ret = {
            code: this.bufferedLines[0].code,
            lines: this.bufferedLines.map((line) => line.line),
        };
        this.bufferedLines = [];
        return ret;
    }
}
Scanner.MAXIMUM_LINE_LENGTH = 512;
Scanner.LINE_TERMINATOR = "\r\n";
exports.Scanner = Scanner;
//# sourceMappingURL=Scanner.js.map