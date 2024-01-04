import { Entity, Property } from "@mikro-orm/core";
import { BaseEntity } from "./BaseEntity";

@Entity()
export class Farter extends BaseEntity {
    /** Score totaled and persisted. */
    @Property()
    score: number;

    /** What type of farts (key = fart id) and how many we have farted (value). */
    @Property()
    fartCounts: Record<string, number> = {};

    /** Link to discord user. */
    @Property()
    userId: string;

    constructor({ userId }: { userId: string }) {
        super();
        // It _seems_ that defaults aren't set, and if I want to insure defults get set
        // and persisted in the normal lifecycle of an entity, I need to set them within
        // the constructor.
        this.fartCounts = {};
        this.score = 0;
        this.userId = userId;
    }
}
