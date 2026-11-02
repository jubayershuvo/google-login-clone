
import mongoose, { Schema, Document, Model } from "mongoose";


export interface IAdmin extends Document {
    name: string;
    username: string;
    password: string;
}

const AdminSchema = new Schema<IAdmin>(
    {
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate names
AdminSchema.index({ name: 1 }, { unique: true });
// Prevent duplicate usernames
AdminSchema.index({ username: 1 }, { unique: true });

const Admin: Model<IAdmin> =
    mongoose.models.Admin ||
    mongoose.model<IAdmin>("Admin", AdminSchema);

export default Admin;
