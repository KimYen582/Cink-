import express from "express";
import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User.js";

const router = express.Router();

router.post("/sync", async (req, res) => {
    try {
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const user = await clerkClient.users.getUser(userId);
        const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
        const role = user.publicMetadata?.role ?? user.unsafeMetadata?.role ?? user.privateMetadata?.role ?? "user";
        const email = user.emailAddresses[0]?.emailAddress;
        const image = user.imageUrl;

        const userData = {
            _id: user.id,
            name: name,
            email: email,
            image: user.imageUrl,
            role: String(role).toLowerCase() === "admin" ? "admin" : "user",
        };

        const savedUser = await User.findByIdAndUpdate(
            user.id,
            userData,
            {
                new: true,
                upsert: true,
            }
        );

        res.json({
            success: true,
            user: savedUser,
        });

    } catch (error) {
        console.error("Sync user error:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});

export default router;