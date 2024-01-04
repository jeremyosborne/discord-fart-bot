#!/usr/bin/env node

//
// Run the bot server by executing this script, presumably with one of the `package.json` start scripts.
//

if (require.main === module) {
    require("dotenv").config();
    console.log("Starting up application.");
    console.log(`cwd: ${process.cwd()}`);
    let mainPath = "./build/main";
    if (process.env.USE_SRC_CODE) {
        mainPath = "./src/main";
    }
    console.log(`Launching main from '${mainPath}`);
    const main = require(mainPath);
    main();
} else {
    console.error(
        "Please execute this as a script, e.g. `node run-server.js`.",
    );
}
