import * as net from "net";
import { Response } from "./Response";
import { Scanner } from "./Scanner";

export
class Connection {

    private readonly scanner : Scanner = new Scanner(this.socket);

    constructor (readonly socket : net.Socket) {}

    public writeCommand (command : string, args? : string) : void {
        this.socket.removeAllListeners("data");
        if (args) this.socket.write(`${command} ${args}\r\n`);
        else this.socket.write(`${command}\r\n`);
    }

    public writeData (message : string) : void {
        this.socket.removeAllListeners("data");
        this.socket.write(`${message}\r\n.\r\n`);
    }

    public readResponse () : Promise<Response> {
        return new Promise<Response>((resolve, reject) => {
            this.socket.on("data", (data : Buffer) : void => {
                this.scanner.enqueueData(data);
                const response : Response | null = this.scanner.scanResponse();
                if (response) resolve(response);
                else reject();
            });
        });
    }

    public disconnect () : void {
        this.socket.end();
    }

}