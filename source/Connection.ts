import * as net from "net";
import { Response } from "./Response";
import { Scanner } from "./Scanner";

export
class Connection {

    private readonly scanner : Scanner = new Scanner(this.socket);

    constructor (readonly socket : net.Socket) {}

    private writeCommand (command : string, args? : string) : void {
        if (args) this.socket.write(`${command} ${args}\r\n`);
        else this.socket.write(`${command}\r\n`);
    }

    public helo (domain : string) : Promise<Response> {
        // TODO: Throw error if domain is ""
        this.socket.removeAllListeners("data");
        this.writeCommand("HELO", domain);
        return new Promise<Response>((resolve, reject) => {
            this.socket.on("data", (data : Buffer) : void => {
                this.scanner.enqueueData(data);
                const response : Response | null = this.scanner.scanResponse();
                if (response) resolve(response);
                else reject();
            });
        });
    }

    public ehlo (domainOrAddressLiteral : string) : void {
        this.writeCommand(`EHLO ${domainOrAddressLiteral}`);
    }

    public mail (fromAddress : string) : void {
        this.writeCommand(`MAIL FROM:<${fromAddress}>`);
    }

    public rcpt (toAddress : string) : void {
        this.writeCommand(`RCPT TO:<${toAddress}>`);
    }

    // public data (message : string) : void {
    //     this.writeCommand("DATA");
    //     // TODO: Wait for the response, then actually write the data.
    // }

    public rset () : void {
        this.writeCommand("RSET");
    }

    public vrfy (identifier : string) : void {
        this.writeCommand(`VRFY ${identifier}`);
    }

    public expn (identifier : string) : void {
        this.writeCommand(`EXPN ${identifier}`);
    }

    public help (topic? : string) : void {
        if (topic) this.writeCommand(`HELP ${topic}`);
        else this.writeCommand("HELP");
    }

    public noop (argument : string) : void {
        if (argument) this.writeCommand(`HELP ${argument}`);
        else this.writeCommand("HELP");
    }

    public quit () : void {
        this.writeCommand("QUIT");
    }

}