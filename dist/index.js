"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net = require("net");
const Connection_1 = require("./Connection");
const socket = net.connect(587, "email.wilbur.space");
const cnxn = new Connection_1.Connection(socket);
cnxn
    .helo("bigboii.com")
    .then((value) => {
    console.log(value.code);
    console.log(value.message.toString());
});
//# sourceMappingURL=index.js.map