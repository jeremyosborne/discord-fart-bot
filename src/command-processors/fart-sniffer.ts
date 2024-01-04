import { Farter } from "../entities/Farter.entity";
import { farts } from "../farts";
import { choiceWeightedInverse } from "../rand";
import { fartCounts } from "../ranking";
import { CommandProcessor } from "./types";

/**
 * User farts and generates a score based on the type of fart.
 */
export const fartSniffer: CommandProcessor = async ({
    em,
    farter,
    // farters,
    message,
}) => {
    const {
        author: { username },
    } = message;
    const fartChosenIndex = choiceWeightedInverse(
        farts.map((fart) => fart.weight),
    );
    if (fartChosenIndex === null) {
        throw Error(
            "Should never get null if weights are positive, sane integers.",
        );
    }
    const fart = farts[fartChosenIndex];

    // Record to mongodb and redis.
    const fartCountsFieldName: keyof Farter = "fartCounts";
    const scoringCommands = [
        // We count quantity of farts in redis.
        fartCounts.increment(farter.userId),
        em.nativeUpdate(
            Farter,
            { _id: farter._id },
            {
                // @ts-expect-error the type definitions in mikro-orm are wrong for incremental changes,
                // but this code works just fune and does what we expect.
                $inc: {
                    score: fart.value,
                    [`${fartCountsFieldName}.${fart.id}`]: 1,
                },
            },
        ),
    ];
    try {
        await Promise.all(scoringCommands);
        message.channel.send(
            `\`${username}\` farted ${fart.visual || fart.text} (+${
                fart.value
            } points)`,
        );
        return true;
    } catch (error) {
        console.error(
            `Something happened while recording a score for ${username}. Error:`,
            error,
        );
        message.reply(
            "Something happened while recording your score. Please contact the admin.",
        );
    }
};
