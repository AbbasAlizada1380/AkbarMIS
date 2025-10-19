import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../Models/user.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// ✅ Register new user
export const registerUser = async (req, res) => {
  try {
    const { fullname, email, password, role } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
      role: role || "user",
      isActive: true,
    });

    res.status(201).json({
      message: "User created successfully",
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error creating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Login
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
        isActive:user.isActive,
      },
    });
  } catch (err) {
    console.error("Error logging in:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "fullname", "email", "role", "isActive", "createdAt"],
    });
    res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get single user
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: ["id", "fullname", "email", "role", "isActive"],
    });

    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Update user info
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullname, email, role, isActive } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    await user.update({ fullname, email, role, isActive });
    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error("Error updating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Soft delete (deactivate user)
export const deactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    await user.update({ isActive: false });
    res.json({ message: "User deactivated successfully." });
  } catch (err) {
    console.error("Error deactivating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reactivate user
export const reactivateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    await user.update({ isActive: true });
    res.json({ message: "User reactivated successfully." });
  } catch (err) {
    console.error("Error reactivating user:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Change password
export const changePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "User not found." });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect." });

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedNewPassword });

    res.json({ message: "Password changed successfully." });
  } catch (err) {
    console.error("Error changing password:", err);
    res.status(500).json({ message: "Server error" });
  }
};
