<p align="center">
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native"/>
  <img src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white" alt="Expo"/>
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
</p>

# 🏫 Campus FixIt

> A comprehensive **Campus Issue Reporting System** that bridges the gap between students and campus maintenance teams. Built with modern technologies including React Native (Expo) and Node.js, this application streamlines the process of reporting, tracking, and resolving campus infrastructure issues.

<p align="center">
  <img src="https://img.shields.io/badge/Platform-iOS%20%7C%20Android-blue" alt="Platform"/>
  <img src="https://img.shields.io/badge/License-Educational-green" alt="License"/>
  <img src="https://img.shields.io/badge/Status-Active-success" alt="Status"/>
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
- [Database Schema](#-database-schema)
- [State Management](#-state-management)
- [Security](#-security)
- [Testing](#-testing)
- [Contributing](#-contributing)

---

## 🎯 Overview

### Problem Statement

Campus maintenance issues often go unreported or take too long to resolve due to:
- Lack of a centralized reporting system
- Poor communication between students and maintenance staff
- No way to track issue resolution progress
- Difficulty in prioritizing urgent issues

### Solution

**Campus FixIt** provides a mobile-first solution that:
- ✅ Enables students to report issues in under 30 seconds
- ✅ Provides real-time status updates and notifications
- ✅ Offers admins a powerful dashboard to manage and prioritize issues
- ✅ Creates accountability through transparent issue tracking

---

## 📱 Screenshots

<p align="center">
  <img src="screenshots/IMG_3298.PNG" width="200" alt="Screenshot 1"/>
  <img src="screenshots/IMG_3299.PNG" width="200" alt="Screenshot 2"/>
  <img src="screenshots/IMG_3300.PNG" width="200" alt="Screenshot 3"/>
  <img src="screenshots/IMG_3301.PNG" width="200" alt="Screenshot 4"/>
</p>

<p align="center">
  <img src="screenshots/IMG_3302.PNG" width="200" alt="Screenshot 5"/>
  <img src="screenshots/IMG_3303.PNG" width="200" alt="Screenshot 6"/>
  <img src="screenshots/IMG_3304.PNG" width="200" alt="Screenshot 7"/>
  <img src="screenshots/IMG_3305.PNG" width="200" alt="Screenshot 8"/>
</p>

<p align="center">
  <img src="screenshots/IMG_3306.PNG" width="200" alt="Screenshot 9"/>
  <img src="screenshots/IMG_3307.PNG" width="200" alt="Screenshot 10"/>
  <img src="screenshots/IMG_3308.PNG" width="200" alt="Screenshot 11"/>
  <img src="screenshots/IMG_3309.PNG" width="200" alt="Screenshot 12"/>
</p>

<p align="center">
  <img src="screenshots/IMG_3310.PNG" width="200" alt="Screenshot 13"/>
  <img src="screenshots/IMG_3311.PNG" width="200" alt="Screenshot 14"/>
  <img src="screenshots/IMG_3312.PNG" width="200" alt="Screenshot 15"/>
  <img src="screenshots/IMG_3313.PNG" width="200" alt="Screenshot 16"/>
</p>

<p align="center">
  <img src="screenshots/IMG_3314.PNG" width="200" alt="Screenshot 17"/>
  <img src="screenshots/IMG_3315.PNG" width="200" alt="Screenshot 18"/>
  <img src="screenshots/IMG_3316.PNG" width="200" alt="Screenshot 19"/>
  <img src="screenshots/IMG_3317.PNG" width="200" alt="Screenshot 20"/>
</p>

<p align="center">
  <img src="screenshots/IMG_3318.PNG" width="200" alt="Screenshot 21"/>
</p>

---

## ✨ Features

### 👨‍🎓 Student Portal

| Feature | Description |
|---------|-------------|
| **User Authentication** | Secure registration and login with JWT tokens |
| **Issue Creation** | Create issues with title, description, category, location, and photo upload |
| **Issue Tracking** | View all personal issues with real-time status updates |
| **Status Monitoring** | Track issue progress: Open → In Progress → Resolved |
| **Smart Filtering** | Filter issues by category, status, and priority |
| **Push Notifications** | Receive instant notifications on status changes |

### 👨‍💼 Admin Dashboard

| Feature | Description |
|---------|-------------|
| **Comprehensive Overview** | View all reported issues across campus |
| **Advanced Search** | Search and filter issues by multiple criteria |
| **Status Management** | Update issue status and priority levels |
| **Admin Remarks** | Add notes and updates for transparency |
| **Analytics Dashboard** | Visual statistics on issue trends and resolution rates |
| **Bulk Operations** | Efficiently manage multiple issues |

### 🎁 Advanced Features

- 🔔 **Local Push Notifications** - Real-time updates on issue status changes
- 🎯 **Priority Levels** - Categorize issues as Low, Medium, High, or Urgent
- 📸 **Image Upload** - Capture photos directly or upload from gallery
- 🔄 **Pull-to-Refresh** - Stay updated with the latest information
- 🌙 **Responsive Design** - Optimized for all screen sizes

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              React Native (Expo) App                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │    │
│  │  │   Student   │  │    Admin    │  │    Auth     │      │    │
│  │  │   Screens   │  │   Screens   │  │   Screens   │      │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │    │
│  │                          │                                │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │           Context API (State Management)          │    │    │
│  │  │     AuthContext    │    IssueContext             │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        SERVER LAYER                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              Node.js + Express.js API                     │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐      │    │
│  │  │    Auth     │  │   Issues    │  │   Upload    │      │    │
│  │  │   Routes    │  │   Routes    │  │   Routes    │      │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘      │    │
│  │                          │                                │    │
│  │  ┌─────────────────────────────────────────────────┐    │    │
│  │  │              Middleware Layer                      │    │    │
│  │  │   JWT Auth   │   Multer   │   Error Handler       │    │    │
│  │  └─────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │ Mongoose ODM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATA LAYER                                │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                   MongoDB Atlas                           │    │
│  │     ┌──────────┐    ┌──────────┐    ┌──────────┐        │    │
│  │     │  Users   │    │  Issues  │    │  Uploads │        │    │
│  │     └──────────┘    └──────────┘    └──────────┘        │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow

```
User Action → Context API → API Service → Express Route → MongoDB → Response
     ↑                                                           │
     └───────────────────────────────────────────────────────────┘
```

---

## 🛠 Tech Stack

### Frontend

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **React Native** | Cross-platform mobile development | Single codebase for iOS & Android |
| **Expo** | Development framework | Simplified build process & OTA updates |
| **Expo Router** | File-based routing | Intuitive navigation structure |
| **TypeScript** | Type safety | Catch errors early, better DX |
| **Context API** | State management | Lightweight, built-in solution |
| **AsyncStorage** | Local persistence | Offline capability for tokens |

### Backend

| Technology | Purpose | Why This Choice |
|------------|---------|-----------------|
| **Node.js** | Runtime environment | JavaScript everywhere, async I/O |
| **Express.js** | Web framework | Minimal, flexible, widely adopted |
| **MongoDB** | Database | Flexible schema, great for rapid dev |
| **Mongoose** | ODM | Schema validation, middleware support |
| **JWT** | Authentication | Stateless, scalable auth |
| **Multer** | File uploads | Efficient multipart handling |
| **bcrypt** | Password hashing | Industry-standard security |

---

## 📁 Project Structure

```
campus-fixit/
│
├── 📱 app/                          # Expo Router screens
│   ├── (auth)/                      # Authentication flow
│   │   ├── login.tsx               # User login screen
│   │   └── signup.tsx              # New user registration
│   │
│   ├── (student)/                   # Student-facing screens
│   │   ├── home.tsx                # Dashboard with recent issues
│   │   ├── create-issue.tsx        # Issue creation form
│   │   ├── my-issues.tsx           # Personal issue history
│   │   └── issue-details.tsx       # Detailed issue view
│   │
│   ├── (admin)/                     # Admin-only screens
│   │   ├── dashboard.tsx           # Analytics & overview
│   │   ├── issues.tsx              # All issues management
│   │   └── settings.tsx            # Admin settings
│   │
│   ├── _layout.tsx                  # Root layout configuration
│   └── index.tsx                    # Entry point / splash
│
├── 🧩 components/                   # Reusable UI components
│   ├── Button.tsx                  # Custom button variants
│   ├── Input.tsx                   # Form input fields
│   ├── IssueCard.tsx               # Issue display card
│   ├── CategoryPicker.tsx          # Category selection
│   ├── StatusBadge.tsx             # Status indicator
│   ├── EmptyState.tsx              # Empty list placeholder
│   └── LoadingSpinner.tsx          # Loading indicator
│
├── 🎨 constants/                    # App-wide constants
│   ├── Colors.ts                   # Theme colors
│   ├── Config.ts                   # API configuration
│   └── Categories.ts               # Issue categories
│
├── 🔄 context/                      # React Context providers
│   ├── AuthContext.tsx             # Authentication state
│   └── IssueContext.tsx            # Issues state management
│
├── 🌐 services/                     # API & external services
│   ├── api.ts                      # Axios instance & config
│   ├── authService.ts              # Auth API calls
│   └── issueService.ts             # Issue API calls
│
├── 📝 types/                        # TypeScript definitions
│   └── index.ts                    # Shared type interfaces
│
├── 🖼 screenshots/                  # App screenshots
│
└── 🖥 server/                       # Backend application
    ├── src/
    │   ├── index.js                # Server entry point
    │   │
    │   ├── models/                 # Mongoose schemas
    │   │   ├── User.js            # User model
    │   │   └── Issue.js           # Issue model
    │   │
    │   ├── routes/                 # API route handlers
    │   │   ├── auth.js            # Authentication routes
    │   │   └── issues.js          # Issue CRUD routes
    │   │
    │   ├── middleware/             # Express middleware
    │   │   ├── auth.js            # JWT verification
    │   │   └── upload.js          # Multer config
    │   │
    │   └── utils/                  # Utility functions
    │       └── pushNotifications.js
    │
    ├── uploads/                    # Uploaded images storage
    ├── .env                        # Environment variables
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

| Requirement | Version | Installation |
|-------------|---------|--------------|
| Node.js | v18+ | [nodejs.org](https://nodejs.org/) |
| npm/yarn | Latest | Comes with Node.js |
| MongoDB | Atlas or Local | [mongodb.com](https://www.mongodb.com/atlas) |
| Expo Go | Latest | App Store / Play Store |
| Git | Latest | [git-scm.com](https://git-scm.com/) |

### Step 1: Clone the Repository

```bash
git clone https://github.com/whybepb/Campus-FixIt.git
cd campus-fixit
```

### Step 2: Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create environment file
touch .env
```

Add the following to `server/.env`:

```env
# Server Configuration
PORT=3000

# MongoDB Connection
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campus-fixit

# JWT Configuration
JWT_SECRET=your-secret-key-here-make-it-long-and-random

# Optional: Token Expiry
JWT_EXPIRES_IN=7d
```

Start the backend server:

```bash
npm start
# or for development with auto-reload
npm run dev
```

### Step 3: Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies
npm install
```

Update your IP address in `constants/Config.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: "http://YOUR_LOCAL_IP:3000/api",
  timeout: 10000,
};
```

> 💡 **Finding Your IP Address:**
> - **Mac**: `ipconfig getifaddr en0`
> - **Windows**: `ipconfig` (look for IPv4 Address)
> - **Linux**: `hostname -I`

Start the Expo development server:

```bash
npx expo start
```

### Step 4: Run on Device

1. **Physical Device**: Scan QR code with Expo Go app
2. **iOS Simulator**: Press `i` in terminal
3. **Android Emulator**: Press `a` in terminal

---

## 🔑 Authentication

### Default Credentials

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Admin** | admin@campus.edu | admin123 | Full dashboard access |
| **Student** | Register new | - | Issue reporting |

### Authentication Flow

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│   Login/     │───►│   JWT Token  │───►│   Protected  │
│   Register   │    │   Generated  │    │   Routes     │
└──────────────┘    └──────────────┘    └──────────────┘
                           │
                           ▼
                    Stored in AsyncStorage
```

---

## 📡 API Documentation

### Base URL

```
http://YOUR_IP:3000/api
```

### Authentication Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/register` | Create new user account | ❌ |
| `POST` | `/auth/login` | Authenticate user | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ |

#### Register Request

```json
POST /api/auth/register
{
  "name": "John Doe",
  "email": "john@campus.edu",
  "password": "securepassword123",
  "role": "student"
}
```

#### Login Response

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "John Doe",
    "email": "john@campus.edu",
    "role": "student"
  }
}
```

### Issue Endpoints

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| `GET` | `/issues` | Get all issues | ✅ | Admin |
| `GET` | `/issues/my` | Get user's issues | ✅ | Any |
| `GET` | `/issues/:id` | Get issue by ID | ✅ | Any |
| `POST` | `/issues` | Create new issue | ✅ | Student |
| `PUT` | `/issues/:id` | Update issue | ✅ | Admin |
| `DELETE` | `/issues/:id` | Delete issue | ✅ | Admin |
| `GET` | `/issues/stats` | Get statistics | ✅ | Admin |

#### Create Issue Request

```json
POST /api/issues
Content-Type: multipart/form-data

{
  "title": "Broken Light in Library",
  "description": "The light near the reading area is flickering continuously",
  "category": "electrical",
  "priority": "high",
  "location": "Main Library, 2nd Floor, Section B",
  "image": [binary file data]
}
```

#### Issue Response

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
    "title": "Broken Light in Library",
    "description": "The light near the reading area is flickering continuously",
    "category": "electrical",
    "priority": "high",
    "status": "open",
    "location": "Main Library, 2nd Floor, Section B",
    "imageUrl": "/uploads/1694123456789-light.jpg",
    "createdBy": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
      "name": "John Doe"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

## 💾 Database Schema

### User Model

```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}
```

### Issue Model

```javascript
{
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    enum: ['electrical', 'water', 'internet', 'infrastructure', 'other'],
    required: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved'],
    default: 'open'
  },
  location: {
    type: String,
    required: true
  },
  imageUrl: String,
  createdBy: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  adminRemarks: String,
  resolvedAt: Date
}
```

### Entity Relationship

```
┌─────────────┐         ┌─────────────┐
│    USER     │         │    ISSUE    │
├─────────────┤         ├─────────────┤
│ _id         │◄───────┐│ _id         │
│ name        │        ││ title       │
│ email       │        ││ description │
│ password    │        ││ category    │
│ role        │        ││ priority    │
│ createdAt   │        ││ status      │
└─────────────┘        ││ location    │
                       ││ imageUrl    │
                       └│ createdBy   │
                        │ adminRemarks│
                        │ timestamps  │
                        └─────────────┘
```

---

## 🔄 State Management

### Context API Architecture

The app uses React Context API for global state management, providing a clean separation between authentication and issue data.

```
┌─────────────────────────────────────────────────────────────┐
│                        App Root                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   AuthProvider                         │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │                IssueProvider                     │  │  │
│  │  │  ┌───────────────────────────────────────────┐  │  │  │
│  │  │  │              App Screens                   │  │  │  │
│  │  │  └───────────────────────────────────────────┘  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### AuthContext

```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
}
```

### IssueContext

```typescript
interface IssueContextType {
  issues: Issue[];
  isLoading: boolean;
  fetchIssues: () => Promise<void>;
  createIssue: (issueData: CreateIssueData) => Promise<void>;
  updateIssue: (id: string, updates: Partial<Issue>) => Promise<void>;
  deleteIssue: (id: string) => Promise<void>;
}
```

---

## 🔐 Security

### Security Measures Implemented

| Layer | Measure | Implementation |
|-------|---------|----------------|
| **Password** | Hashing | bcrypt with salt rounds |
| **Authentication** | JWT | Signed tokens with expiry |
| **Authorization** | Role-based | Middleware checks |
| **Data Validation** | Input sanitization | Server-side validation |
| **File Upload** | Type restriction | Multer file filter |

### JWT Token Structure

```javascript
{
  header: {
    alg: "HS256",
    typ: "JWT"
  },
  payload: {
    userId: "64f1a2b3c4d5e6f7g8h9i0j1",
    role: "student",
    iat: 1694123456,
    exp: 1694728256
  },
  signature: "..."
}
```

---

## 📂 Issue Categories

| Category | Icon | Description | Examples |
|----------|------|-------------|----------|
| **Electrical** | ⚡ | Power & lighting issues | Broken lights, power outages, faulty outlets |
| **Water** | 💧 | Plumbing problems | Leaks, clogged drains, low pressure |
| **Internet** | 📶 | Network & connectivity | WiFi issues, slow connection, no access |
| **Infrastructure** | 🏗️ | Buildings & furniture | Broken doors, damaged furniture, AC issues |
| **Other** | ➕ | Miscellaneous | Anything not covered above |

---

## 🎨 Issue Status Flow

```
┌──────────────────────────────────────────────────────────────────┐
│                        ISSUE LIFECYCLE                            │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│   ┌──────────┐       ┌─────────────┐       ┌──────────────┐     │
│   │   OPEN   │ ────► │ IN PROGRESS │ ────► │   RESOLVED   │     │
│   │    🔴    │       │     🟡      │       │      🟢      │     │
│   └──────────┘       └─────────────┘       └──────────────┘     │
│        │                    │                     │              │
│        ▼                    ▼                     ▼              │
│   Issue Created      Admin Reviews         Issue Closed          │
│   Awaiting Review    Work in Progress      Problem Fixed         │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Status Descriptions

| Status | Color | Description |
|--------|-------|-------------|
| **Open** | 🔴 Red | Newly created, awaiting admin review |
| **In Progress** | 🟡 Yellow | Admin acknowledged, work underway |
| **Resolved** | 🟢 Green | Issue has been fixed and closed |

---

## 🔔 Notifications

The app implements local push notifications to keep users informed:

### Notification Triggers

| Event | Recipient | Message |
|-------|-----------|---------|
| Issue Created | Creator | "Your issue has been submitted. We're on it!" |
| Status → In Progress | Creator | "Good news! Your issue is now being worked on." |
| Status → Resolved | Creator | "Your issue has been resolved. Thank you!" |
| Admin Remark Added | Creator | "Admin has added a note to your issue." |

### Implementation

```javascript
import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});
```

---

## 🧪 Testing

### Testing on Physical Device

1. **Ensure same network**: Phone and laptop must be on the same WiFi
2. **Update API URL**: Set your laptop's IP in `Config.ts`
3. **Start services**:
   ```bash
   # Terminal 1 - Backend
   cd server && npm start
   
   # Terminal 2 - Frontend
   npx expo start
   ```
4. **Scan QR code** with Expo Go app

### Sample Test Data

```json
{
  "title": "Broken Light in Library",
  "description": "The light near the reading area on the 2nd floor is flickering and needs immediate replacement. It's affecting students' ability to study.",
  "category": "electrical",
  "priority": "high",
  "location": "Main Library, 2nd Floor, Reading Section B"
}
```

---

## 📊 Project Metrics

| Metric | Value |
|--------|-------|
| Total Files | 50+ |
| Lines of Code | 5000+ |
| Components | 15+ |
| API Endpoints | 10 |
| Screens | 8 |

---



## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <strong>Prathmesh Bhardwaj</strong><br/>
      
    </td>
  </tr>
</table>

---

## 📄 License

This project was developed for educational purposes as part of a Mobile Application Development course.

---

## 🙏 Acknowledgments

- [React Native](https://reactnative.dev/) - Mobile framework
- [Expo](https://expo.dev/) - Development platform
- [MongoDB Atlas](https://www.mongodb.com/atlas) - Cloud database
- [Express.js](https://expressjs.com/) - Backend framework
- [Ionicons](https://ionic.io/ionicons) - Icon library

---

<p align="center">
  Made with ❤️ by Prathmesh Bhardwaj
</p>

<p align="center">
  <a href="#-campus-fixit">Back to Top ↑</a>
</p>
