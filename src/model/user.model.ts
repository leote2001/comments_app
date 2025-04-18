import mongoose from "mongoose";
import { User } from "../types";
const userSchema = new mongoose.Schema<User>({
    username: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 255
    }
},
    {
        timestamps: true
    });
userSchema.methods.toJSON = function () {
    const userObject = this.toObject();
    delete userObject.password;
    return userObject;
}

export const userModel = mongoose.model("User", userSchema); 