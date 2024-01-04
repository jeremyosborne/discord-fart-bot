import * as caching from "./caching";

const KEY_FART_COUNTS = "fart-counts" as const;

/**
 * Handle the fart count ranking.
 */
export const fartCounts = {
    /**
     * Get the rank for a specific user. 0 index for "rank 1".
     *
     * Caller is responsible for handling any errors thrown.
     *
     * @param userId discord user id
     */
    getRank: async (userId: string) => {
        // This {score, value} object seems to be a new thing specific to the API and is confusing compared to the existing api conventions.
        return await caching.get()?.zRevRank(KEY_FART_COUNTS, userId);
    },

    /**
     * Increment the count of farts for a user, which will update
     * the user's ranking.
     *
     * Caller is responsible for handling any errors thrown.
     *
     * @param userId discord user id
     * @param count default 1
     */
    increment: async (userId: string, count = 1) => {
        await caching.get()?.zIncrBy(KEY_FART_COUNTS, count, userId);
    },

    /**
     * Set the score of a user to a specific number, overwriting
     * the previous rank.
     *
     * Caller is responsible for handling any errors thrown.
     *
     * @param userId discord user id
     * @param score the new score that we should give to this user
     */
    set: async (userId: string, score: number) => {
        // This {score, value} object seems to be a new thing specific to the API and is confusing compared to the existing api conventions.
        await caching.get()?.zAdd(KEY_FART_COUNTS, { score, value: userId });
    },
};
