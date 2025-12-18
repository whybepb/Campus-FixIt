const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const { auth, adminOnly } = require("../middleware/auth");

const router = express.Router();

// GET /api/users - Get all users (Admin only)
router.get("/", auth, adminOnly, async (req, res) => {
  try {
    const { role, search, page = 1, limit = 20 } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { studentId: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      users,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({ message: "Error fetching users" });
  }
});

// GET /api/users/:id - Get user by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only allow users to view their own profile or admins to view any
    if (
      req.user.role !== "admin" &&
      req.user._id.toString() !== user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user" });
  }
});

// PUT /api/users/:id - Update user
router.put(
  "/:id",
  auth,
  [
    body("name")
      .optional()
      .trim()
      .notEmpty()
      .withMessage("Name cannot be empty"),
    body("studentId").optional().trim(),
    body("department").optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      // Only allow users to update their own profile or admins to update any
      if (
        req.user.role !== "admin" &&
        req.user._id.toString() !== req.params.id
      ) {
        return res.status(403).json({ message: "Access denied" });
      }

      const { name, studentId, department, avatar } = req.body;

      const updateData = {};
      if (name) updateData.name = name;
      if (studentId !== undefined) updateData.studentId = studentId;
      if (department !== undefined) updateData.department = department;
      if (avatar !== undefined) updateData.avatar = avatar;

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: updateData },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ message: "Error updating user" });
    }
  }
);

// PUT /api/users/:id/role - Update user role (Admin only)
router.put(
  "/:id/role",
  auth,
  adminOnly,
  [body("role").isIn(["student", "admin"]).withMessage("Invalid role")],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { $set: { role: req.body.role } },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Error updating user role" });
    }
  }
);

// DELETE /api/users/:id - Delete user (Admin only)
router.delete("/:id", auth, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
});

// GET /api/users/stats - Get user statistics (Admin only)
router.get("/stats/overview", auth, adminOnly, async (req, res) => {
  try {
    const [totalUsers, students, admins] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "admin" }),
    ]);

    res.json({
      total: totalUsers,
      students,
      admins,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user stats" });
  }
});

module.exports = router;
