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
        const email = user.emailAddresses[0]?.emailAddress?.toLowerCase();
        const metadataRole = user.publicMetadata?.role ?? user.privateMetadata?.role ?? user.unsafeMetadata?.role;
        const isAdminEmail = email === "admin@cin.com";
        const isAdminRole = String(metadataRole || "").toLowerCase() === "admin";
        const isAdmin = isAdminRole || isAdminEmail;

        const userData = {
            _id: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email: email,
            image: user.imageUrl,
            role: isAdmin ? "admin" : "user",
        };

        if (isAdmin) {
            await clerkClient.users.updateUser(user.id, {
                publicMetadata: {
                    role: "admin",
                },
            });
        }

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