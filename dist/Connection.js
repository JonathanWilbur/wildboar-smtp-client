"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Scanner_1 = require("./Scanner");
class Connection {
    constructor(socket) {
        this.socket = socket;
        this.scanner = new Scanner_1.Scanner(this.socket);
    }
    writeCommand(command, args) {
        if (args)
            this.socket.write(`${command} ${args}\r\n`);
        else
            this.socket.write(`${command}\r\n`);
    }
    helo(domain) {
        this.socket.removeAllListeners("data");
        this.writeCommand("HELO", domain);
        return new Promise((resolve, reject) => {
            this.socket.on("data", (data) => {
                this.scanner.enqueueData(data);
                const response = this.scanner.scanResponse();
                if (response) {
                    resolve(response);
                }
                else {
                    reject();
                }
            });
        });
    }
    ehlo(domainOrAddressLiteral) {
        this.writeCommand(`EHLO ${domainOrAddressLiteral}`);
    }
    mail(fromAddress) {
        this.writeCommand(`MAIL FROM:<${fromAddress}>`);
    }
    rcpt(toAddress) {
        this.writeCommand(`RCPT TO:<${toAddress}>`);
    }
    rset() {
        this.writeCommand("RSET");
    }
    vrfy(identifier) {
        this.writeCommand(`VRFY ${identifier}`);
    }
    expn(identifier) {
        this.writeCommand(`EXPN ${identifier}`);
    }
    help(topic) {
        if (topic)
            this.writeCommand(`HELP ${topic}`);
        else
            this.writeCommand("HELP");
    }
    noop(argument) {
        if (argument)
            this.writeCommand(`HELP ${argument}`);
        else
            this.writeCommand("HELP");
    }
    quit() {
        this.writeCommand("QUIT");
    }
}
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map