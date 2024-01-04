import {
    CommandProcessorArgs,
    commandDictionary,
    fartSniffer,
    unknownCommand,
} from "./command-processors";
import { config } from "./config";
import debug from "debug";
import * as caching from "./caching";
import { Client, Events, IntentsBitField, ActivityType } from "discord.js";
import _ from "lodash";
import * as orm from "./orm";
import { Farter } from "./entities/Farter.entity";

const info = debug("main:info");
const warn = debug("main:warn");

const main = async () => {
    const client = new Client({
        intents: [
            IntentsBitField.Flags.Guilds,
            IntentsBitField.Flags.GuildMessages,
            IntentsBitField.Flags.MessageContent,
        ],
    });

    try {
        await orm.init();
    } catch (error) {
        console.error(
            "We could not connect to the db. We will not be able to handle responses or store data until this is fixed.",
        );
    }

    try {
        await caching.init();
    } catch (error) {
        console.error(
            "We could not connect to the redis cache. We will not be able to handle ranking until this is fixed.",
        );
    }

    // Event listener when a user connected to the server.
    client.on(Events.ClientReady, () => {
        info(`Logged in as ${client?.user?.tag}!`);

        client?.user?.setActivity("farts", {
            type: ActivityType.Listening,
        });
    });

    // Discord.js does not appear to be middleware like, so instead we handle everything in
    // in one event, and from here we delegate to other functions as needed, vs. handling
    // things piecemeal and passing the information down on a context.
    client.on(Events.MessageCreate, async (message) => {
        if (message.author.bot || message.author.id === client.user?.id) {
            // Ignore messages from ourselves or other bots.
            // The first check might be enough, but we keep the additional, historical check.
            return;
        }

        // Determine if we need to process a command, or if we sniffed a fart.
        const commandMatchCandidate =
            /^(?<triggerWord>\/fartbot)\s*(?<command>\S*)\s?(?<remainder>[\S\s]+)?/i.exec(
                message.content,
            );
        let fartMatch: RegExpExecArray | null = null;
        if (!commandMatchCandidate) {
            fartMatch = /\bfart\b/i.exec(message.content);
        }

        if (!commandMatchCandidate && !fartMatch) {
            // The message is not interacting with our bot.
            return;
        }

        const em = orm.getOrmEmFork();
        if (!em) {
            // This is serious enough at this point to spam the logs, although we should have alerts that deal with this.
            console.error(
                "We could not connect to the db. We will not be able to handle responses or store data until this is fixed.",
            );
            message.reply(
                "The bot is having issues right now. Please contact the bot admin and let them know that you saw this message.",
            );
            return;
        }

        // Determine if we are registered first, and pass that information downstream.
        // Do not return here until our other commands are checked, as we will handle
        // unregistered users below before carrying on to other commands.
        const farter = await em.findOne(Farter, {
            userId: message.author.id,
        });

        // Determine if the command is the register command, and if we are not registered,
        // register ourselves, otherwise respond with you are already registered.
        if (!farter && commandMatchCandidate?.groups?.command === "register") {
            const farter = new Farter({ userId: message.author.id });
            em.persistAndFlush(farter);
            message.reply(
                "You are now a registered farter. Fart to your heart's content.",
            );
            return;
        } else if (!farter && commandMatchCandidate) {
            message.reply("Please register first with `/fartbot register`.");
            return;
        } else if (
            farter &&
            commandMatchCandidate?.groups?.command === "register"
        ) {
            message.reply("You are already registered.");
            return;
        } else if (!farter) {
            // If we fall through to here without a farter, return silently.
            return;
        }

        // The remaining commands need the command args.
        const commandArgs: CommandProcessorArgs = {
            client,
            em,
            farter,
            message,
        };

        if (fartMatch) {
            // If we are registered, and `fartMatch` is not null, then score a fart...
            await fartSniffer(commandArgs);
        } else if (
            // ...if command is recognized, run it...
            (commandMatchCandidate?.groups?.command || "") in commandDictionary
        ) {
            await commandDictionary[
                commandMatchCandidate?.groups?.command || ""
            ](commandArgs);
        } else {
            // ...else command is unknown.
            unknownCommand(commandArgs);
        }

        // Persist any db changes.
        em.flush();
    });

    client.on(Events.Warn, (err) => warn("client reported a warning:", err));

    client.on(Events.Error, (err) =>
        console.error("client reported an error:", err),
    );

    // Initialize bot by connecting to the server
    client.login(config().DISCORD_TOKEN);
};

module.exports = main;
