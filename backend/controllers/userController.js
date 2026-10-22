import cloudinary from "../config/cloudinary.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const updateProfile = async (req, res) => {
  let newImagePublicId;

  try {
    const { username } = req.body;
    const user = req.user;

    if (username !== undefined) {
      if (typeof username !== "string" || !username.trim()) {
        return res.status(400).json({
          message: "اسم المستخدم مطلوب",
        });
      }

      const normalizedUsername = username.trim();

      const existingUser = await User.findOne({
        username: normalizedUsername,
        _id: { $ne: user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "اسم المستخدم مستخدم بالفعل",
        });
      }

      user.username = normalizedUsername;
    }

    const oldImagePublicId = user.avatarPublicId;

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "excellent-friday/avatars",
            resource_type: "image",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          },
        );

        stream.end(req.file.buffer);
      });

      newImagePublicId = result.public_id;
      user.avatar = result.secure_url;
      user.avatarPublicId = result.public_id;
    }

    await user.save();

    if (req.file && oldImagePublicId) {
      try {
        await cloudinary.uploader.destroy(oldImagePublicId);
      } catch (error) {
        console.error("Failed to delete old avatar:", error.message);
      }
    }

    return res.status(200).json({
      message: "تم تحديث الملف الشخصي بنجاح",
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    if (newImagePublicId) {
      try {
        await cloudinary.uploader.destroy(newImagePublicId);
      } catch (cleanupError) {
        console.error("Failed to clean up new avatar:", cleanupError.message);
      }
    }

    if (error.code === 11000 && error.keyPattern?.username) {
      return res.status(409).json({
        message: "اسم المستخدم مستخدم بالفعل",
      });
    }

    console.error("Update profile failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء تحديث الملف الشخصي",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message: "يرجى إدخال كلمة المرور الحالية والجديدة",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "كلمة المرور الجديدة يجب أن تكون 8 أحرف على الأقل",
      });
    }

    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return res.status(404).json({
        message: "المستخدم غير موجود",
      });
    }

    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        message: "كلمة المرور الحالية غير صحيحة",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "كلمة المرور الجديدة يجب أن تختلف عن الحالية",
      });
    }

    user.password = await bcrypt.hash(newPassword, 12);

    await user.save();

    return res.status(200).json({
      message: "تم تغيير كلمة المرور بنجاح",
    });
  } catch (error) {
    console.error("Change password failed:", error.message);

    return res.status(500).json({
      message: "حدث خطأ أثناء تغيير كلمة المرور",
    });
  }
};
