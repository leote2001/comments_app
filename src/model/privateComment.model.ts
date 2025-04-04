import { PrivateComment } from "../types";
import mongoose, { Schema } from "mongoose";

const privateCommentSchema = new mongoose.Schema<PrivateComment>({
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
    content: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true,
        maxlength: 55
    }
},
{
timestamps: true
}
);
export const privateCommentModel = mongoose.model("PrivateComment", privateCommentSchema);