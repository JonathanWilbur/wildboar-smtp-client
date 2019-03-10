import * as net from "net";
import { Connection } from "./Connection";
import { Response } from "./Response";

export
class Client {
    // This object will track the state of the current transaction.
    // The connection object will handle the lower-level details.
    // It also adds formal connect() and disconnect() methods

    private connection : Connection | undefined;

    constructor(readonly host : string, readonly port : number) {}

    public connect () : Promise<Response> {
        this.connection = new Connection(net.connect(this.port, this.host));
        return this.connection.readResponse();
    }

    public disconnect () : void {
        if (this.connection) this.connection.disconnect();
        this.connection = undefined;
    }

    public helo (domain : string) : Promise<Response> {
        if (!this.connection) return Promise.reject();
        if (domain.length === 0) return Promise.reject();
        this.connection.writeCommand("HELO", domain);
        return this.connection.readResponse();
    }

    public ehlo (domainOrAddressLiteral : string) : Promise<Response> {
        if (!this.connection) return Promise.reject();
        if (domainOrAddressLiteral.length === 0) return Promise.reject();
        this.connection.writeCommand(`EHLO ${domainOrAddressLiteral}`);
        return this.connection.readResponse();
    }

    public mail (address : string) : Promise<Response> {
        if (!this.connection) return Promise.reject();
        if (address.length === 0) return Promise.reject();
        this.connection.writeCommand(`MAIL FROM:<${address}>`);
        return this.connection.readResponse();
    }

    public rcpt (address : string) : Promise<Response> {
        if (!this.connection) return Promise.reject();
        if (address.length === 0) return Promise.reject();
        this.connection.writeCommand(`RCPT TO:<${address}>`);
        return this.connection.readResponse();
    }

    public data () : Promise<Response> {
        if (!this.connection) return Promise.reject();
        this.connection.writeCommand("DATA");
        return this.connection.readResponse();
        // TODO: Wait for the response, then actually write the data.
    }

    public writeData (message : string) : Promise<Response> {
        if (!this.connection) return Promise.reject();
        this.connection.writeData(message);
        return this.connection.readResponse();
    } 

    public rset () : Promise<Response> {
        if (!this.connection) return Promise.reject();
        this.connection.writeCommand("RSET");
        return this.connection.readResponse();
    }

    public vrfy (identifier : string) : Promise<Response> {
        if (!this.connection) return Promise.reject();
        if (identifier.length === 0) return Promise.reject();
        this.connection.writeCommand(`VRFY ${identifier}`);
        return this.connection.readResponse();
    }

    public expn (identifier : string) : Promise<Response> {
        if (!this.connection) return Promise.reject();
        if (identifier.length === 0) return Promise.reject();
        this.connection.writeCommand(`EXPN ${identifier}`);
        return this.connection.readResponse();
    }

    public help (topic? : string) : Promise<Response> {
        if (!this.connection) return Promise.reject();
        if (topic) this.connection.writeCommand(`HELP ${topic}`);
        else this.connection.writeCommand("HELP");
        return this.connection.readResponse();
    }

    public noop (argument : string) : Promise<Response> {
        if (!this.connection) return Promise.reject();
        if (argument) this.connection.writeCommand(`HELP ${argument}`);
        else this.connection.writeCommand("HELP");
        return this.connection.readResponse();
    }

    public quit () : Promise<Response> {
        if (!this.connection) return Promise.reject();
        this.connection.writeCommand("QUIT");
        return this.connection.readResponse();
    }

}