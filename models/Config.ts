
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IConfig extends Document {
    telegram_chat?: string;
}

const ConfigSchema = new Schema<IConfig>(
    {
        telegram_chat: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true,
    }
);



const Config: Model<IConfig> =
    mongoose.models.Config ||
    mongoose.model<IConfig>("Config", ConfigSchema);

export default Config;
