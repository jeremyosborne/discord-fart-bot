import { config } from "../config";
import { CommandProcessor } from "./types";

/**
 * Display the version of the fartbot that is running.
 *
 * Also helps distinguish when we're running a local dev build instead
 * of a production build.
 */
export const version: CommandProcessor = async ({ message }) => {
    const packageJson = require("../../package.json");
    // *HEROKU_* values only available with https://devcenter.heroku.com/articles/dyno-metadata
    const version = config().HEROKU_RELEASE_VERSION || packageJson.version;
    const timestamp = config().HEROKU_RELEASE_CREATED_AT
        ? `, built at: \`${config().HEROKU_RELEASE_CREATED_AT}\``
        : "";
    message.reply(`\`${version}\`${timestamp}`);

    return true;
};
