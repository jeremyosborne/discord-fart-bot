import _ from "lodash";

/** The object collected in this so called game. */
export type Fart = {
    /** Every fart must have a unique id. */
    id: string;
    /** An English description of the fart. */
    text: string;
    /** An emoji or text-art description of the fart. */
    visual: string;
    /** How much this fart is worth compared to other farts. */
    value: number;
    /**
     * How often this fart is expected to appear compared to other farts.
     *
     * The value of weight is inverted from common language: lower numbers
     * are more common.
     */
    weight: number;
};

export const farts: Array<Fart> = [
    { id: "1", text: "air", visual: "💨", value: 1, weight: 1 },
    { id: "2", text: "peanuts", visual: "🥜🥜🥜", value: 2, weight: 3 },
    { id: "3", text: "acid", visual: "🧪", value: 2, weight: 3 },
    {
        id: "4",
        text: "chile peppers",
        visual: "🌶️🌶️🌶️",
        value: 3,
        weight: 3,
    },
    {
        id: "5",
        text: "a wilted flower",
        visual: "a 🥀",
        value: 3,
        weight: 3,
    },
    { id: "6", text: "fire", visual: "🔥", value: 3, weight: 3 },
    { id: "7", text: "a koala", visual: "a 🐨", value: 3, weight: 3 },
    { id: "8", text: "corn", visual: "🌽", value: 3, weight: 3 },
    { id: "9", text: "popcorn", visual: "🍿", value: 5, weight: 5 },
    { id: "10", text: "a ghost", visual: "a 👻", value: 5, weight: 5 },
    { id: "11", text: "a shart", visual: "a 💩", value: 5, weight: 5 },
    { id: "12", text: "roses", visual: "🌹🌹🌹", value: 10, weight: 7 },
    { id: "13", text: "a whale", visual: "a 🐋", value: 15, weight: 8 },
    {
        id: "14",
        text: "the sandman",
        visual: "the (-_-).zZ",
        value: 20,
        weight: 8,
    },
];

export const fartsById = _.keyBy(farts, "id");
