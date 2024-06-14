import jwt from "jsonwebtoken";

import dotenv from "dotenv";

dotenv.config();

const authMiddleware = (req, res, next) => {
  const authHeaders = req.headers.authorization;
  if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
    return res.status(403).json({
      success: false,
      message: "You are not a vaild user",
    });
  }
  const token = authHeaders.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    if (decoded._id) {
      req._id = decoded._id;
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid user",
      });
    }
  } catch (error) {
    return res.status(403).json({
      message: error.message,
    });
  }
};

export default authMiddleware;
