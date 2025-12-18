const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  category: {
    type: String,
    required: true,
    enum: ["electrical", "water", "internet", "infrastructure", "other"],
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high", "urgent"],
    default: "medium",
  },
  status: {
    type: String,
    enum: ["open", "in_progress", "resolved"],
    default: "open",
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  images: [
    {
      type: String,
    },
  ],
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  adminRemarks: {
    type: String,
    trim: true,
  },
  resolvedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update updatedAt on save
issueSchema.pre("save", function (next) {
  this.updatedAt = new Date();

  // Set resolvedAt when status changes to resolved
  if (this.isModified("status") && this.status === "resolved") {
    this.resolvedAt = new Date();
  }

  next();
});

// Index for efficient queries
issueSchema.index({ status: 1, category: 1, createdAt: -1 });
issueSchema.index({ reportedBy: 1, createdAt: -1 });

// Transform _id to id in JSON output
issueSchema.set("toJSON", {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Issue", issueSchema);
