import mongoose, { Schema } from "mongoose";
import { Notification } from "../types";
const notificationSchema = new mongoose.Schema<Notification>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    repostOf: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null
    },
    type: {
        type: String,
        enum: ["new", "post on", "repost", "favorite", "like", "private"],
        required: true
    },
    favoriteId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: null
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    createdAt: {
        type: Date,
default: Date.now
    }
},
{
timestamps: true
}
);
export const notificationModel = mongoose.model<Notification>("Notification", notificationSchema);