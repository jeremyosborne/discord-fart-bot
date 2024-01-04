import { EntityManager } from "@mikro-orm/mongodb";
import { Client, Message } from "discord.js";
import { Farter } from "../entities/Farter.entity";

export type CommandProcessorArgs = {
    client: Client;
    em: EntityManager;
    farter: Farter;
    message: Message;
};

/**
 * Potentially run for every message intercepted by the bot.
 *
 * Command processors will be passed an execution context as its argument.
 *
 * A command processor can signify that it is has handled the input and
 * terminate any further processing by returning `true`. Returning any allowed
 * falsey value will allow any following command processors in the queue to run.
 *
 * Command processors need to be registered and exported with `commandProcessors`
 * through `index.ts`.
 *
 * In the current design command processors are synchronous.
 */
export type CommandProcessor = (
    arg0: CommandProcessorArgs,
) => Promise<boolean | void>;
