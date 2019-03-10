import { Client } from "./Client";
import { Response } from "./Response";

// I am using port 26 here, because my ISP blocks ports 25.
// I specifically added a listener on port 26 on my email server for the
// purposes of testing this.
const client : Client = new Client("email.wilbur.space", 26);
(async () => {
    const connectResponse : Response = await client.connect();
    console.log(`${connectResponse.code} ${connectResponse.lines.toString()}`);

    const ehloResponse : Response = await client.ehlo("bigboiiii.com");
    console.log(`${ehloResponse.code} ${ehloResponse.lines.map((line) => line.toString()).join("\r\n")}`);

    console.log("MAIL");
    const mailResponse : Response = await client.mail("bigboi@wuuut.com");
    console.log(`${mailResponse.code} ${mailResponse.lines.toString()}`);

    console.log("RCPT");
    const rcptResponse : Response = await client.rcpt("jonathan@wilbur.space");
    console.log(`${rcptResponse.code} ${rcptResponse.lines.toString()}`);

    console.log("DATA");
    const dataResponse : Response = await client.data();
    console.log(`${dataResponse.code} ${dataResponse.lines.toString()}`);

    console.log("writing data...");
    const writeResponse : Response = await client.writeData("SUP BIG BOIIII");
    console.log(`${writeResponse.code} ${writeResponse.lines.toString()}`);

    console.log("QUIT");
    const quitResponse : Response = await client.quit();
    console.log(`${quitResponse.code} ${quitResponse.lines.toString()}`);

})();