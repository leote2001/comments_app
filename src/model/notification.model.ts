import mongoose, { Schema } from "mongoose";
import { Notification } from "../types";
const notificationSchema = new mongoose.Schema<Notification>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    repostOf: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    type: {
        type: String,
        enum: ["new", "post on", "repost", "favorite"],
        required: true
    },
    favoriteId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
},
{
timestamps: true
}
);
export const notificationModel = mongoose.model<Notification>("Notification", notificationSchema);