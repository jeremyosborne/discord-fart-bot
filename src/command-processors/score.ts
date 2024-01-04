import { farts, fartsById } from "../farts";
import { fartCounts } from "../ranking";
import { CommandProcessor } from "./types";

enum Field {
    "visual" = "visual",
    "count" = "count",
    "value" = "value",
    "total" = "total",
}

const HEADERS = [Field.visual, Field.count, Field.value, Field.total] as const;

/**
 * See your personal score.
 */
export const score: CommandProcessor = async ({ farter, message }) => {
    // Column widths: we grab these while transforming db scores to formatting
    // objects. We use the length of the column header names as the base for the max widths.
    const fieldMaxWidths = {
        visual: Field.visual.length,
        count: Field.count.length,
        value: Field.value.length,
        // Value * count
        total: Field.total.length,
    };
    const foundFarts = Object.entries(farter.fartCounts)
        .filter(([fartId, count]) => count)
        .map(([fartId, count]) => {
            const fart = fartsById[fartId];
            const total = count * fart.value;
            // Update field widths before returning.
            fieldMaxWidths.visual = Math.max(
                fieldMaxWidths.visual,
                fart.visual.length,
            );
            fieldMaxWidths.value = Math.max(
                fieldMaxWidths.value,
                fart.value.toString().length,
            );
            fieldMaxWidths.count = Math.max(
                fieldMaxWidths.count,
                count.toString().length,
            );
            fieldMaxWidths.total = Math.max(
                fieldMaxWidths.total,
                total.toString().length,
            );
            return {
                [Field.visual]: fart.visual,
                [Field.count]: count,
                [Field.value]: fart.value,
                [Field.total]: total,
            };
        })
        .sort(
            // Sort in descending order of the individual value (and likely rarity) of the fart.
            (fartCounter1, fartCounter2) =>
                fartCounter2.value - fartCounter1.value,
        )
        .map((fartCounter) => {
            // TODO: need a header, and the header fields need adjusting in case the
            // score values get too big.
            // The field template partial will be formatted as:
            // - pad left
            // - add a space between fields.
            // and look something like:
            const fields: Array<string> = [];
            for (const fieldName of HEADERS) {
                const value = fartCounter[fieldName];
                fields.push(
                    `${" ".repeat(
                        fieldMaxWidths[fieldName] - value.toString().length,
                    )}${value}`,
                );
            }
            return fields.join(" ");
            // return `${fartCounter.visual}\t\`value = ${fartCounter.value} x ${fartCounter.count} = ${fartCounter.total}\``;
        });

    // This is a human friendly rank. If this remains 0, the user is unranked.
    let rank: number = 0;
    try {
        const candidateRank = await fartCounts.getRank(farter.userId);
        // Make rank human friendly.
        rank = Number.isSafeInteger(candidateRank) ? rank + 1 : 0;
    } catch (error) {
        console.error(`Could not retrieve the rank for ${farter.userId}`);
    }

    const headerField = HEADERS.reduce((fields, value) => {
        fields.push(
            `${" ".repeat(
                fieldMaxWidths[value] - value.toString().length,
            )}${value}`,
        );
        return fields;
    }, [] as Array<string>);

    message.reply(
        `You farted **${foundFarts.length}** of **${
            farts.length
        }** types of farts.
${
    rank
        ? `You are **ranked ${rank}** in fart finding.`
        : `Your rank could not be determined.`
}
${
    foundFarts.length
        ? `The farts you have found:
\`\`\`
${headerField.join(" ")}
${foundFarts.join("\n")}
\`\`\`
`
        : "You have discovered no farts. Go `fart` and then check your score."
}**Your current score: ${farter.score}**`,
    );

    return true;
};
