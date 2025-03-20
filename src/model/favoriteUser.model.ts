import { FavoriteUser } from "../types";
import mongoose, { Schema } from "mongoose";

const favoriteUserSchema = new mongoose.Schema<FavoriteUser>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    favoriteId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},
    {
        timestamps: true
    }
);

export const favoriteUserModel = mongoose.model<FavoriteUser>("FavoriteUser", favoriteUserSchema);