import mongoose, { Schema, Document } from "mongoose";

type UserType = {
    username: string;
    email: string;
    password: string;
}
export type User = UserType & Document; 

export type Comment = {
    userId: mongoose.Schema.Types.ObjectId;
    receiverId: mongoose.Schema.Types.ObjectId;
    content: string;
    hidden: boolean;
    createdAt: Date;
    repostOf: Schema.Types.ObjectId;
    type: string;
}

export type Like = {
    userId: Schema.Types.ObjectId;
    commentId: Schema.Types.ObjectId;
}

export type FavoriteUser = {
    userId: Schema.Types.ObjectId;
    favoriteId: Schema.Types.ObjectId;
}

export type Notification = {
    userId: Schema.Types.ObjectId;
    receiverId: Schema.Types.ObjectId;
    repostOf: Schema.Types.ObjectId;
    createdAt: Date;
    type: string;
    favoriteId: Schema.Types.ObjectId;
}