const express = require("express");
const { body, query, validationResult } = require("express-validator");
const Issue = require("../models/Issue");
const { auth, adminOnly } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Validation rules
const createIssueValidation = [
  body("title")
    .trim()
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage("Title is required (max 100 chars)"),
  body("description")
    .trim()
    .notEmpty()
    .isLength({ max: 1000 })
    .withMessage("Description is required (max 1000 chars)"),
  body("category")
    .isIn(["electrical", "water", "internet", "infrastructure", "other"])
    .withMessage("Invalid category"),
  body("location").trim().notEmpty().withMessage("Location is required"),
  body("priority")
    .optional()
    .isIn(["low", "medium", "high", "urgent"])
    .withMessage("Invalid priority"),
];

const updateIssueValidation = [
  body("title").optional().trim().notEmpty().isLength({ max: 100 }),
  body("description").optional().trim().notEmpty().isLength({ max: 1000 }),
  body("status").optional().isIn(["open", "in_progress", "resolved"]),
  body("priority").optional().isIn(["low", "medium", "high", "urgent"]),
  body("adminRemarks").optional().trim(),
];

// GET /api/issues - Get all issues (with filters)
router.get("/", auth, async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const query = {};

    // Non-admin users can only see their own issues
    if (req.user.role !== "admin") {
      query.reportedBy = req.user._id;
    }

    if (status) query.status = status;
    if (category) query.category = category;
    if (priority) query.priority = priority;

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [issues, total] = await Promise.all([
      Issue.find(query)
        .populate("reportedBy", "name email studentId")
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Issue.countDocuments(query),
    ]);

    res.json({
      issues,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    console.error("Get issues error:", error);
    res.status(500).json({ message: "Error fetching issues" });
  }
});

// GET /api/issues/my - Get current user's issues
router.get("/my", auth, async (req, res) => {
  try {
    const { status, category, page = 1, limit = 20 } = req.query;

    const query = { reportedBy: req.user._id };

    if (status) query.status = status;
    if (category) query.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const [issues, total] = await Promise.all([
      Issue.find(query)
        .populate("assignedTo", "name email")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Issue.countDocuments(query),
    ]);

    res.json({
      issues,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching your issues" });
  }
});

// GET /api/issues/stats - Get issue statistics (Admin only)
router.get("/stats", auth, adminOnly, async (req, res) => {
  try {
    const [
      total,
      open,
      inProgress,
      resolved,
      byCategory,
      byPriority,
      recentIssues,
    ] = await Promise.all([
      Issue.countDocuments(),
      Issue.countDocuments({ status: "open" }),
      Issue.countDocuments({ status: "in_progress" }),
      Issue.countDocuments({ status: "resolved" }),
      Issue.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]),
      Issue.aggregate([{ $group: { _id: "$priority", count: { $sum: 1 } } }]),
      Issue.find()
        .populate("reportedBy", "name")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    res.json({
      total,
      byStatus: { open, in_progress: inProgress, resolved },
      byCategory: byCategory.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      byPriority: byPriority.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      recentIssues,
    });
  } catch (error) {
    console.error("Get stats error:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

// GET /api/issues/:id - Get issue by ID
router.get("/:id", auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("reportedBy", "name email studentId department")
      .populate("assignedTo", "name email");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Non-admin users can only view their own issues
    if (
      req.user.role !== "admin" &&
      issue.reportedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ issue });
  } catch (error) {
    res.status(500).json({ message: "Error fetching issue" });
  }
});

// POST /api/issues - Create new issue
router.post(
  "/",
  auth,
  upload.array("images", 5),
  createIssueValidation,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ message: errors.array()[0].msg });
      }

      const { title, description, category, location, priority } = req.body;

      // Get uploaded image paths
      const images = req.files
        ? req.files.map((file) => `/uploads/${file.filename}`)
        : [];

      const issue = new Issue({
        title,
        description,
        category,
        location,
        priority: priority || "medium",
        images,
        reportedBy: req.user._id,
      });

      await issue.save();

      // Populate and return
      await issue.populate("reportedBy", "name email studentId");

      res.status(201).json({ issue });
    } catch (error) {
      console.error("Create issue error:", error);
      res.status(500).json({ message: "Error creating issue" });
    }
  }
);

// PUT /api/issues/:id - Update issue
router.put("/:id", auth, updateIssueValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Check permissions
    const isOwner = issue.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Students can only update title, description if status is still 'open'
    if (!isAdmin && issue.status !== "open") {
      return res
        .status(403)
        .json({ message: "Cannot update issue after it has been processed" });
    }

    const {
      title,
      description,
      category,
      location,
      priority,
      status,
      adminRemarks,
      assignedTo,
    } = req.body;

    // Students can only update these fields
    if (isOwner && !isAdmin) {
      if (title) issue.title = title;
      if (description) issue.description = description;
      if (category) issue.category = category;
      if (location) issue.location = location;
    }

    // Admin can update everything
    if (isAdmin) {
      if (title) issue.title = title;
      if (description) issue.description = description;
      if (category) issue.category = category;
      if (location) issue.location = location;
      if (priority) issue.priority = priority;
      if (status) issue.status = status;
      if (adminRemarks !== undefined) issue.adminRemarks = adminRemarks;
      if (assignedTo !== undefined) issue.assignedTo = assignedTo || null;
    }

    await issue.save();

    await issue.populate("reportedBy", "name email studentId");
    await issue.populate("assignedTo", "name email");

    res.json({ issue });
  } catch (error) {
    console.error("Update issue error:", error);
    res.status(500).json({ message: "Error updating issue" });
  }
});

// DELETE /api/issues/:id - Delete issue
router.delete("/:id", auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    // Only owner or admin can delete
    const isOwner = issue.reportedBy.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: "Access denied" });
    }

    // Students can only delete if status is 'open'
    if (!isAdmin && issue.status !== "open") {
      return res
        .status(403)
        .json({ message: "Cannot delete issue after it has been processed" });
    }

    await Issue.findByIdAndDelete(req.params.id);

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting issue" });
  }
});

module.exports = router;
