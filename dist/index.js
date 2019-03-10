"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Client_1 = require("./Client");
const client = new Client_1.Client("email.wilbur.space", 26);
(async () => {
    const connectResponse = await client.connect();
    console.log(`${connectResponse.code} ${connectResponse.lines.toString()}`);
    const ehloResponse = await client.ehlo("bigboiiii.com");
    console.log(`${ehloResponse.code} ${ehloResponse.lines.map((line) => line.toString()).join("\r\n")}`);
    console.log("MAIL");
    const mailResponse = await client.mail("bigboi@wuuut.com");
    console.log(`${mailResponse.code} ${mailResponse.lines.toString()}`);
    console.log("RCPT");
    const rcptResponse = await client.rcpt("jonathan@wilbur.space");
    console.log(`${rcptResponse.code} ${rcptResponse.lines.toString()}`);
    console.log("DATA");
    const dataResponse = await client.data();
    console.log(`${dataResponse.code} ${dataResponse.lines.toString()}`);
    console.log("writing data...");
    const writeResponse = await client.writeData("SUP BIG BOIIII");
    console.log(`${writeResponse.code} ${writeResponse.lines.toString()}`);
    console.log("QUIT");
    const quitResponse = await client.quit();
    console.log(`${quitResponse.code} ${quitResponse.lines.toString()}`);
})();
//# sourceMappingURL=index.js.map