/**
 * A typed version of acceptable configuration values passed into our app,
 * presumably via process.env.
 *
 * To keep things simple, in most cases we keep most things as a string
 * value (as all env vars are strings by nature) and in cases where the
 * string value is not provided, we use an empty string to denote as
 * not set. Any flag that acts as a boolean must be passed with some
 * actual value (like `USE_SRC_CODE=1`).
 */
export type Configuration = {
    /** (Required) for discord authentication. */
    DISCORD_TOKEN: string;

    /** (Optional) A heroku specific env var we use. */
    HEROKU_RELEASE_CREATED_AT: string;

    /** (Optional) A heroku specific env var we use. */
    HEROKU_RELEASE_VERSION: string;

    /** (Required) to persist data to the backend. */
    MONGODB_USER: string;

    /** (Required) to persist data to the backend */
    MONGODB_PASSWORD: string;

    /**
     * (Required) the access url to the mongodb service. The curly braces are
     * required and will be replaced with the environment vars of the same name.
     *
     * @example mongodb://{{MONGODB_USER}}:{{MONGODB_PASSWORD}}@localhost:27017
     */
    MONGODB_ACCESS_URL: string;

    /** (Optional) whether to interact with mongodb in debug mode ("true") or not (anything else) */
    MONGODB_DEBUG: boolean;

    /** (Required) redis is used for ranking. */
    REDIS_PASSWORD: string;
    /** (Required) redis is used for ranking. */
    REDIS_HOST: string;
    /** (Required) redis is used for ranking. */
    REDIS_PORT: number;

    /**
     * (Optional) set to any value to interpret the code in `src/` over the build artifacts in `build/`.
     * Caller must be using an interpreter that understands typescript (e.g. `ts-node`).
     */
    USE_SRC_CODE: boolean;
};

/**
 * Generate and return a typed configuration object (helps with refactoring env vars wne we need to).
 */
export const config = () => {
    const configuration: Configuration = {
        DISCORD_TOKEN: process.env.DISCORD_TOKEN || "",

        HEROKU_RELEASE_CREATED_AT: process.env.HEROKU_RELEASE_CREATED_AT || "",
        HEROKU_RELEASE_VERSION: process.env.HEROKU_RELEASE_VERSION || "",

        MONGODB_USER: process.env.MONGODB_USER || "",
        MONGODB_PASSWORD: process.env.MONGODB_PASSWORD || "",
        MONGODB_ACCESS_URL: process.env.MONGODB_ACCESS_URL || "",
        MONGODB_DEBUG: !!process.env.MONGODB_DEBUG,

        REDIS_PASSWORD: process.env.REDIS_PASSWORD || "",
        REDIS_HOST: process.env.REDIS_HOST || "",
        REDIS_PORT: parseInt(process.env.REDIS_PORT || "0", 10),

        USE_SRC_CODE: !!process.env.USE_SRC_CODE,
    };
    return configuration;
};
