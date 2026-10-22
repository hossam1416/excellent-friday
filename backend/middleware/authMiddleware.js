import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mongoose from "mongoose";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "غير مصرح لك، يجب تسجيل الدخول أولًا",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.id || !mongoose.isValidObjectId(decoded.id)) {
      return res.status(401).json({
        message: "رمز الدخول غير صالح",
      });
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        message: "المستخدم غير موجود",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return res.status(401).json({
        message: "انتهت صلاحية الجلسة أو أن رمز الدخول غير صالح",
      });
    }

    return res.status(500).json({
      message: "حدث خطأ في الخادم",
    });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "ليس لديك صلاحية لتنفيذ هذا الإجراء",
    });
  }

  next();
};
