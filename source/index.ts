import * as net from "net";
import { Connection } from "./Connection";
import { Response } from "./Response";

// Port 25 is blocked by my ISP...
const socket : net.Socket = net.connect(587, "email.wilbur.space");
const cnxn : Connection = new Connection(socket);
cnxn
    .helo("bigboii.com")
    .then((value : Response) => {
        console.log(value.code);
        console.log(value.message.toString());
    });