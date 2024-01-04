//
// Watches and responds to what users type into the discord channel watched by
// this bot.
//
// - Command processors must take the structure as defined by `./command-processor.ts`.
// - Command processors must be added to the `commandProcessors` array in this file.
//
import { fartSniffer } from "./fart-sniffer";
import { help } from "./help";
import { score } from "./score";
import { unknownCommand } from "./unknown-command";
import { version } from "./version";
import { CommandProcessor } from "./types";

export { fartSniffer, unknownCommand };

/**
 * Any command that can be run via `/farbot <subcommand>`
 * needs to be registered here.
 */
export const commandDictionary: Record<string, CommandProcessor> = {
    help,
    score,
    version,
};
export * from "./types";
