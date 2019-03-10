"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Scanner_1 = require("./Scanner");
class Connection {
    constructor(socket) {
        this.socket = socket;
        this.scanner = new Scanner_1.Scanner(this.socket);
    }
    writeCommand(command, args) {
        this.socket.removeAllListeners("data");
        if (args)
            this.socket.write(`${command} ${args}\r\n`);
        else
            this.socket.write(`${command}\r\n`);
    }
    writeData(message) {
        this.socket.removeAllListeners("data");
        this.socket.write(`${message}\r\n.\r\n`);
    }
    readResponse() {
        return new Promise((resolve, reject) => {
            this.socket.on("data", (data) => {
                this.scanner.enqueueData(data);
                const response = this.scanner.scanResponse();
                if (response)
                    resolve(response);
                else
                    reject();
            });
        });
    }
    disconnect() {
        this.socket.end();
    }
}
exports.Connection = Connection;
//# sourceMappingURL=Connection.js.map