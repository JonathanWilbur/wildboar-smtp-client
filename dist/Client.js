"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const Connection_1 = require("./Connection");
class Client {
    constructor(host, port) {
        this.host = host;
        this.port = port;
    }
    connect() {
        this.connection = new Connection_1.Connection(net.connect(this.port, this.host));
        return this.connection.readResponse();
    }
    disconnect() {
        if (this.connection)
            this.connection.disconnect();
        this.connection = undefined;
    }
    helo(domain) {
        if (!this.connection)
            return Promise.reject();
        if (domain.length === 0)
            return Promise.reject();
        this.connection.writeCommand("HELO", domain);
        return this.connection.readResponse();
    }
    ehlo(domainOrAddressLiteral) {
        if (!this.connection)
            return Promise.reject();
        if (domainOrAddressLiteral.length === 0)
            return Promise.reject();
        this.connection.writeCommand(`EHLO ${domainOrAddressLiteral}`);
        return this.connection.readResponse();
    }
    mail(address) {
        if (!this.connection)
            return Promise.reject();
        if (address.length === 0)
            return Promise.reject();
        this.connection.writeCommand(`MAIL FROM:<${address}>`);
        return this.connection.readResponse();
    }
    rcpt(address) {
        if (!this.connection)
            return Promise.reject();
        if (address.length === 0)
            return Promise.reject();
        this.connection.writeCommand(`RCPT TO:<${address}>`);
        return this.connection.readResponse();
    }
    data() {
        if (!this.connection)
            return Promise.reject();
        this.connection.writeCommand("DATA");
        return this.connection.readResponse();
    }
    writeData(message) {
        if (!this.connection)
            return Promise.reject();
        this.connection.writeData(message);
        return this.connection.readResponse();
    }
    rset() {
        if (!this.connection)
            return Promise.reject();
        this.connection.writeCommand("RSET");
        return this.connection.readResponse();
    }
    vrfy(identifier) {
        if (!this.connection)
            return Promise.reject();
        if (identifier.length === 0)
            return Promise.reject();
        this.connection.writeCommand(`VRFY ${identifier}`);
        return this.connection.readResponse();
    }
    expn(identifier) {
        if (!this.connection)
            return Promise.reject();
        if (identifier.length === 0)
            return Promise.reject();
        this.connection.writeCommand(`EXPN ${identifier}`);
        return this.connection.readResponse();
    }
    help(topic) {
        if (!this.connection)
            return Promise.reject();
        if (topic)
            this.connection.writeCommand(`HELP ${topic}`);
        else
            this.connection.writeCommand("HELP");
        return this.connection.readResponse();
    }
    noop(argument) {
        if (!this.connection)
            return Promise.reject();
        if (argument)
            this.connection.writeCommand(`HELP ${argument}`);
        else
            this.connection.writeCommand("HELP");
        return this.connection.readResponse();
    }
    quit() {
        if (!this.connection)
            return Promise.reject();
        this.connection.writeCommand("QUIT");
        return this.connection.readResponse();
    }
}
exports.Client = Client;
//# sourceMappingURL=Client.js.map