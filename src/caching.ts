import { config } from "./config";
import { createClient } from "redis";

/** Our high scores caching client. */
export let client:
    | Awaited<ReturnType<ReturnType<typeof createClient>["connect"]>>
    | undefined = undefined;

/** Call after the redis client has been created. */
export const get = () => client;

/** Call to initialize the redis client. */
export const init = async () => {
    const host = config().REDIS_HOST;
    const port = config().REDIS_PORT;
    client = await createClient({
        password: config().REDIS_PASSWORD,
        socket: {
            host,
            port,
        },
    })
        .on("error", (err) => console.error("Redis client error:", err))
        .on("connect", (...args) =>
            console.log(`Redis client connected to ${host}:${port}`),
        )
        .on("ready", (...args) => console.log("Redis client ready."))
        .connect();

    return client;
};
