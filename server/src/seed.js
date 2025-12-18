require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
const Issue = require("./models/Issue");

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/campus-fixit";

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Issue.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Create users
    const adminUser = new User({
      email: "admin@campus.edu",
      password: "admin123",
      name: "Admin User",
      role: "admin",
      department: "Administration",
    });

    const studentUser = new User({
      email: "student@campus.edu",
      password: "student123",
      name: "John Student",
      role: "student",
      studentId: "STU001",
      department: "Computer Science",
    });

    const student2 = new User({
      email: "jane@campus.edu",
      password: "student123",
      name: "Jane Doe",
      role: "student",
      studentId: "STU002",
      department: "Electrical Engineering",
    });

    await adminUser.save();
    await studentUser.save();
    await student2.save();
    console.log("👤 Created users");

    // Create issues
    const issues = [
      {
        title: "Broken Light in Library",
        description:
          "The fluorescent light in the reading area of the main library is flickering and needs replacement. It has been causing headaches for students studying there.",
        category: "electrical",
        priority: "medium",
        status: "open",
        location: "Main Library, 2nd Floor, Reading Area",
        reportedBy: studentUser._id,
      },
      {
        title: "Water Leakage in Boys Hostel",
        description:
          "There is a significant water leak in the bathroom on the 3rd floor. The water is seeping into the hallway and making the floor slippery.",
        category: "water",
        priority: "high",
        status: "in_progress",
        location: "Boys Hostel Block A, 3rd Floor, Bathroom 3",
        reportedBy: studentUser._id,
        adminRemarks: "Plumber has been notified. Will be fixed by tomorrow.",
      },
      {
        title: "WiFi Not Working in Lab",
        description:
          "The WiFi connection in Computer Lab 2 is extremely slow and keeps disconnecting. Students cannot complete their assignments.",
        category: "internet",
        priority: "urgent",
        status: "open",
        location: "Computer Science Building, Lab 2",
        reportedBy: student2._id,
      },
      {
        title: "Broken Window in Classroom",
        description:
          "One of the windows in Room 101 is cracked and poses a safety hazard. Glass pieces might fall and injure someone.",
        category: "infrastructure",
        priority: "high",
        status: "resolved",
        location: "Academic Block B, Room 101",
        reportedBy: student2._id,
        adminRemarks: "Window has been replaced with new glass.",
        resolvedAt: new Date(),
      },
      {
        title: "AC Not Cooling in Auditorium",
        description:
          "The air conditioning in the main auditorium is not cooling properly. The upcoming seminar might be affected.",
        category: "electrical",
        priority: "medium",
        status: "open",
        location: "Main Auditorium",
        reportedBy: studentUser._id,
      },
    ];

    await Issue.insertMany(issues);
    console.log("📋 Created sample issues");

    console.log("\n🎉 Seed completed successfully!");
    console.log("\n📧 Test Accounts:");
    console.log("   Admin: admin@campus.edu / admin123");
    console.log("   Student: student@campus.edu / student123");
    console.log("   Student: jane@campus.edu / student123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed error:", error);
    process.exit(1);
  }
};

seedData();
