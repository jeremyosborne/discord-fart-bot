import { PrimaryKey, Property, SerializedPrimaryKey } from "@mikro-orm/core";
import { ObjectId } from "@mikro-orm/mongodb";

export abstract class BaseEntity {
    @PrimaryKey({ type: ObjectId })
    _id!: ObjectId;

    @SerializedPrimaryKey()
    id!: string;

    @Property({ type: Date })
    createdAt = new Date();

    @Property({ type: Date, onUpdate: () => new Date() })
    updatedAt = new Date();
}
