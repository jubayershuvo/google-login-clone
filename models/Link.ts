
import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILink extends Document {
    name: string;
}

const LinkSchema = new Schema<ILink>(
    {
        name: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate names
LinkSchema.index({ name: 1 }, { unique: true });

const Link: Model<ILink> =
    mongoose.models.Link ||
    mongoose.model<ILink>("Link", LinkSchema);

export default Link;
