import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (
      typeof username !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "يرجى إدخال اسم المستخدم وكلمة المرور",
      });
    }

    const user = await User.findOne({ username }).select("+password");

    if (!user) {
      return res

        .status(401)
        .json({ message: "اسم المستخدم او كلمة المرور غير صحيحة" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "اسم المستخدم أو كلمة المرور غير صحيحة" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    return res.status(200).json({
      message: "تم تسجيل الدخول بنجاح",
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "حدث خطأ في الخادم" });
  }
};

export const getMe = async (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
      avatar: req.user.avatar,
    },
  });
};
