import mongoose, { Schema } from "mongoose";
import { Like } from "../types";
const likeSchema = new mongoose.Schema<Like>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    commentId: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        required: true
    }
},
    {
        timestamps: true
    }
);
export const likeModel = mongoose.model<Like>("Like", likeSchema);