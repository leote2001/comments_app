import mongoose, { Schema } from "mongoose";
import { Comment } from "../types";

const commentSchema = new mongoose.Schema<Comment>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    content: {
        type: String,
        required: true,
        maxlength: 180
    }
    },
    {timestamps: true}
);
commentSchema.index({createdAt: 1}, {expireAfterSeconds: 3600});
export const commentModel = mongoose.model<Comment>("Comment", commentSchema);