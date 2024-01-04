/**
 * USE_SRC_CODE=1 node_modules/.bin/tsx scripts/update-ranks.ts
 */
import { Farter } from "../src/entities/Farter.entity";
import * as orm from "../src/orm";
import { fartCounts } from "../src/ranking";

export const main = async () => {
    require("dotenv").config();
    await orm.init();
    const em = orm.getOrmEmFork();
    if (!em) {
        throw new Error("Problem getting the entity manager.");
    }

    const batchSize = 100;
    let processed = 0;

    while (true) {
        const farters = await em.find(
            Farter,
            {},
            {
                limit: batchSize,
                offset: processed,
            },
        );

        if (farters.length === 0) {
            break; // Exit the loop if there are no more entities
        }

        for (const farter of farters) {
            let score = 0;
            for (const [key, value] of Object.entries(farter.fartCounts)) {
                score += value;
            }
            await fartCounts.set(farter.userId, score);
            console.log(`Updated score for ${farter.userId} to ${score}`);
        }

        processed += farters.length;
    }
};

if (require.main === module) {
    main();
}
