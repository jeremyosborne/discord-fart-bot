import { MikroORM, Options } from "@mikro-orm/core";
import { MongoDriver } from "@mikro-orm/mongodb";
import { MongoHighlighter } from "@mikro-orm/mongo-highlighter";
import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import { config } from "./config";

let orm: MikroORM<MongoDriver> | undefined = undefined;

/**
 * Type specific fork of the EntityManager.
 *
 * Will return undefined if the database connection was never achieved
 * or was broken.
 */
export const getOrmEmFork = () => {
    const em = orm?.em.fork();
    if (em) {
        return em;
    } else {
        return undefined;
    }
};

/**
 * Get the orm singleton.
 *
 * Presumes that `init` was called previously, does not lazy load the singleton.
 */
export const get = () => {
    return orm;
};

/**
 * Initializes our orm object. We expect this to be called before our
 * application runs. It's possible our ORM doesn't initialize, and our
 * application code will be designed to respond with a "please contact
 * the admin" if our db connection fails.
 */
export const init = async () => {
    const clientUrl = config()
        .MONGODB_ACCESS_URL?.replace(
            "{{MONGODB_USER}}",
            config().MONGODB_USER || "",
        )
        .replace("{{MONGODB_PASSWORD}}", config().MONGODB_PASSWORD || "");
    const mikroOrmConfig: Options<MongoDriver> = {
        clientUrl,
        debug: config().MONGODB_DEBUG,
        dbName: "discord-fart-bot",
        entities: ["./build/entities/**/*.js"],
        entitiesTs: ["./src/entities/**/*.ts"],
        // We need the TsMorphMetadataProvider if we want to run staight from
        // TypeScript code (debug mode) _and_ we want to read the entities from
        // TypeScript types. This doesn't affect anything if we use plain old
        // JavaScript.
        // And we _don't_ want the TsMorphMetadataProvider if we're running a JS build.
        metadataProvider: config().USE_SRC_CODE
            ? TsMorphMetadataProvider
            : undefined,
        highlighter: new MongoHighlighter(),
        type: "mongo",
    };
    orm = await MikroORM.init<MongoDriver>(mikroOrmConfig);
};
