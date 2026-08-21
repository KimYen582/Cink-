import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
        },

        image: {
            type: String,
        },

        password: {
            type: String,
            select: false, // never return password in queries by default
        },

        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        },
    },
    {
        timestamps: true,
    }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;