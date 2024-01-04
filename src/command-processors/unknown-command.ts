import { CommandProcessor } from "./types";

// Guide user to fartbot help if the subcommand is not known.
export const unknownCommand: CommandProcessor = async ({ message }) => {
    const help = `try \`/fartbot help\``;
    message.reply(help);

    return true;
};
