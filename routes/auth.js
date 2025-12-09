import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// Helper function to calculate Euclidean distance between two face descriptors
function euclideanDistance(descriptor1, descriptor2) {
    const arr1 = descriptor1.split(',').map(Number);
    const arr2 = descriptor2.split(',').map(Number);

    let sum = 0;
    for (let i = 0; i < arr1.length; i++) {
        sum += Math.pow(arr1[i] - arr2[i], 2);
    }
    return Math.sqrt(sum);
}

// Threshold for face matching (lower = more strict, typical range: 0.4-0.6)
const FACE_MATCH_THRESHOLD = 0.6;

router.post("/register", async (req, res) => {
    try {
        const {
            faceId
        } = req.body;

        if (!faceId) {
            return res.status(400).json({
                message: "Face ID is required"
            });
        }

        const existingUser = await User.findOne({
            faceId
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Face already registered"
            });
        }

        const user = await User.create({
            faceId
        });

        const token = jwt.sign({
                id: user._id
            },
            process.env.JWT_SECRET || "SECRET123", {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            message: "Registration successful"
        });
    } catch (error) {
        console.error("Register error:", error);

        // Handle duplicate key error from old indexes
        if (error.code === 11000) {
            return res.status(400).json({
                message: "This face is already registered or database has conflicting data. Please try again or contact support."
            });
        }

        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const {
            faceId
        } = req.body;

        if (!faceId) {
            return res.status(400).json({
                message: "Face ID is required"
            });
        }

        // Get all users and find the best match
        const allUsers = await User.find({});

        if (allUsers.length === 0) {
            return res.status(404).json({
                message: "Face not registered. Please register first."
            });
        }

        let bestMatch = null;
        let bestDistance = Infinity;

        for (const user of allUsers) {
            const distance = euclideanDistance(faceId, user.faceId);
            console.log(`Distance to user ${user._id}: ${distance}`);

            if (distance < bestDistance) {
                bestDistance = distance;
                bestMatch = user;
            }
        }

        console.log(`Best match distance: ${bestDistance}, threshold: ${FACE_MATCH_THRESHOLD}`);

        if (bestDistance > FACE_MATCH_THRESHOLD) {
            return res.status(404).json({
                message: "Face not registered. Please register first."
            });
        }

        const token = jwt.sign({
                id: bestMatch._id
            },
            process.env.JWT_SECRET || "SECRET123", {
                expiresIn: "7d"
            }
        );

        res.json({
            token,
            message: "Login successful"
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({
            message: "Server error",
            error: error.message
        });
    }
});

export default router;