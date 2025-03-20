import mongoose, { Schema } from "mongoose";

export type User = {
    username: string;
    email: string;
    password: string;
}

export type Comment = {
 userId: mongoose.Schema.Types.ObjectId;   
 receiverId: mongoose.Schema.Types.ObjectId;   
 content: string;
 hidden: boolean;
 createdAt: Date;
}

export type Like = {
    userId: Schema.Types.ObjectId;
    commentId: Schema.Types.ObjectId;
}

export type FavoriteUser = {
    userId: Schema.Types.ObjectId;
    favoriteId: Schema.Types.ObjectId;
}