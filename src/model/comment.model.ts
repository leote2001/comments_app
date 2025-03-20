import mongoose, { Schema } from "mongoose";
import { Comment } from "../types";

const commentSchema = new mongoose.Schema<Comment>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true 
    },
    content: {
        type: String,
        required: true,
        maxlength: 180
    },
    hidden: {
        type: Boolean, 
        default: false
    }
    },
    {timestamps: true}
);

export const commentModel = mongoose.model<Comment>("Comment", commentSchema);