import * as net from "net";
import { Response } from "./Response";
import { ResponseLine } from "./ResponseLine";

export
class Scanner {

    private static readonly MAXIMUM_LINE_LENGTH : number = 512;
    private static readonly LINE_TERMINATOR : string = "\r\n";
    private receivedData : Buffer = Buffer.alloc(0);
    private bufferedLines : ResponseLine[] = [];
    private scanCursor : number = 0;

    constructor (readonly socket : net.Socket) {}

    public enqueueData (data : Buffer) : void {
        this.receivedData = Buffer.concat([ this.receivedData.slice(this.scanCursor), data ]);
        this.scanCursor = 0;
    }

    private scanLine () : ResponseLine | null {
        const indexOfCRLF : number = this.receivedData.indexOf(Scanner.LINE_TERMINATOR, this.scanCursor);
        if (indexOfCRLF === -1) return null;
        if ((indexOfCRLF - this.scanCursor) > Scanner.MAXIMUM_LINE_LENGTH) {
            this.scanCursor = (indexOfCRLF + Scanner.LINE_TERMINATOR.length);
            return null;
        }
        const line : Buffer = Buffer.from(this.receivedData.slice(this.scanCursor, indexOfCRLF));
        // TODO: do something if the line is shorter than four characters.
        const code : number = parseInt(line.slice(0, 3).toString());
        // TODO: do something if code is NaN.
        const terminal : boolean = (line[3] === ' '.charCodeAt(0));
        this.scanCursor = (indexOfCRLF + Scanner.LINE_TERMINATOR.length);
        return {
            code: code,
            line: Buffer.from(line.slice(4)),
            terminal: terminal
        };
    }

    public scanResponse () : Response | null {
        while (true) {
            const line : ResponseLine | null = this.scanLine();
            if (!line) break; // if we have reached the end.
            this.bufferedLines.push(line);
        };
        const nonTerminalLines : ResponseLine[] = this.bufferedLines.slice(0, -1);

        if (nonTerminalLines.some((value : ResponseLine) : boolean => value.terminal))
            return null; // One of the non-terminal lines indicates termination.

        if (!(this.bufferedLines[this.bufferedLines.length - 1].terminal))
            return null; // The last line does not indicate termination.

        for (let i : number = 0; i < nonTerminalLines.length; i++) {
            if (nonTerminalLines[i].code !== this.bufferedLines[i + 1].code)
                return null; // One of the response codes does not match the others.
        }
        
        const ret : Response = {
            code: this.bufferedLines[0].code,
            lines: this.bufferedLines.map((line : ResponseLine) => line.line),
        };
        this.bufferedLines = [];
        return ret;
    }
}