import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader ? authHeader.split(" ")[1] : null;

    if (!token) {
        return res.status(401).json({
            message: "No token"
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "SECRET123");
        req.user = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};