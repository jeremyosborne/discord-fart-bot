import { CommandProcessor } from "./types";

const HELP_MESSAGE = `try \`/fartbot <thing>\` where \`<thing>\` could be one of:
\`help\`
\`register\`
\`score\`
\`version\``;

export const help: CommandProcessor = async ({ message }) => {
    message.reply(HELP_MESSAGE);
    return true;
};
