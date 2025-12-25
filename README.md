# 🏫 Campus FixIt

A **Campus Issue Reporting System** built with React Native (Expo) and Node.js. Students can report campus maintenance issues, and admins can manage and resolve them efficiently.

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

### 👨‍🎓 Student Features

- ✅ User registration & login
- ✅ Create issues with title, description, category, location, and photo
- ✅ View all issues raised by them
- ✅ Track issue status (Open → In Progress → Resolved)
- ✅ Filter issues by category and status
- ✅ Receive notifications on status changes

### 👨‍💼 Admin Features

- ✅ View all reported issues
- ✅ Search and filter issues
- ✅ Update issue status and priority
- ✅ Add admin remarks
- ✅ Mark issues as resolved
- ✅ Dashboard with statistics

### 🎁 Bonus Features

- ✅ Local push notifications on status change
- ✅ Issue priority levels (Low, Medium, High, Urgent)
- ✅ Image upload with camera/gallery
- ✅ Pull-to-refresh

---

## 🛠 Tech Stack

| Layer                | Technology                       |
| -------------------- | -------------------------------- |
| **Frontend**         | React Native (Expo), Expo Router |
| **State Management** | React Context API                |
| **Backend**          | Node.js, Express.js              |
| **Database**         | MongoDB (Atlas)                  |
| **Authentication**   | JWT (JSON Web Tokens)            |
| **Image Upload**     | Multer                           |
| **Notifications**    | Expo Notifications               |
| **Storage**          | AsyncStorage                     |

---

## 📁 Project Structure

```
campus-fixit/
├── app/                    # Expo Router screens
│   ├── (auth)/            # Login & Signup screens
│   ├── (student)/         # Student screens (home, create-issue, my-issues)
│   └── (admin)/           # Admin screens (dashboard, issues)
├── components/            # Reusable UI components
├── constants/             # App config, colors, theme
├── context/               # Auth & Issue Context providers
├── services/              # API client & services
├── types/                 # TypeScript type definitions
└── server/                # Backend (Node.js + Express)
    ├── src/
    │   ├── models/        # MongoDB schemas
    │   ├── routes/        # API routes
    │   └── middleware/    # Auth & upload middleware
    └── uploads/           # Uploaded images
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)
- Expo Go app (for testing on device)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd campus-fixit
```

### 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file in `server/` folder:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/campus-fixit
JWT_SECRET=your-secret-key-here
```

Start the server:

```bash
npm start
```

### 3. Setup Frontend

```bash
cd ..  # Back to root
npm install
```

Update your IP address in `constants/Config.ts`:

```typescript
export const API_CONFIG = {
  baseUrl: "http://YOUR_IP_ADDRESS:3000/api",
  timeout: 10000,
};
```

> Find your IP: `ipconfig getifaddr en0` (Mac) or `ipconfig` (Windows)

Start the app:

```bash
npx expo start
```

### 4. Test the App

- Scan QR code with Expo Go app
- Or press `i` for iOS simulator / `a` for Android emulator

---

## 🔑 Default Credentials

| Role    | Email                  | Password |
| ------- | ---------------------- | -------- |
| Admin   | admin@campus.edu       | admin123 |
| Student | (Register new account) | -        |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user        |
| GET    | `/api/auth/me`       | Get current user  |

### Issues

| Method | Endpoint            | Description            |
| ------ | ------------------- | ---------------------- |
| GET    | `/api/issues`       | Get all issues (admin) |
| GET    | `/api/issues/my`    | Get user's issues      |
| GET    | `/api/issues/:id`   | Get issue by ID        |
| POST   | `/api/issues`       | Create new issue       |
| PUT    | `/api/issues/:id`   | Update issue           |
| DELETE | `/api/issues/:id`   | Delete issue           |
| GET    | `/api/issues/stats` | Get issue statistics   |

---

## 📂 Issue Categories

| Category       | Icon | Description            |
| -------------- | ---- | ---------------------- |
| Electrical     | ⚡   | Power, lighting issues |
| Water          | 💧   | Plumbing, leaks        |
| Internet       | 📶   | WiFi, network issues   |
| Infrastructure | 🏗️   | Buildings, furniture   |
| Other          | ➕   | Miscellaneous          |

---

## 🎨 Issue Status Flow

```
┌──────────┐     ┌─────────────┐     ┌──────────┐
│   Open   │ ──► │ In Progress │ ──► │ Resolved │
└──────────┘     └─────────────┘     └──────────┘
    🔴               🟡                  🟢
```

---

## 🔔 Notifications

The app sends local notifications for:

1. **Issue Created** - "We are on it! Expect an update soon."
2. **Status Changed** - When admin updates the issue status

---

## 🔧 Environment Variables

### Server (.env)

```env
PORT=3000
MONGODB_URI=<your-mongodb-uri>
JWT_SECRET=<your-jwt-secret>
```

---

## 📱 Testing on Physical Device

1. Ensure phone and laptop are on **same WiFi network**
2. Update `API_CONFIG.baseUrl` with your laptop's IP
3. Start server: `cd server && npm start`
4. Start app: `npx expo start`
5. Scan QR code with Expo Go

---

## 🧪 Sample Issue Data

```json
{
  "title": "Broken Light in Library",
  "description": "The light near reading area is flickering and needs replacement",
  "category": "electrical",
  "priority": "high",
  "location": "Main Library, 2nd Floor",
  "status": "open"
}
```

---

## 📝 Evaluation Criteria

| Area                   | Weight | Status               |
| ---------------------- | ------ | -------------------- |
| Correctness & Features | 30%    | ✅ Complete          |
| Backend Design         | 20%    | ✅ Complete          |
| Frontend UX & State    | 20%    | ✅ Complete          |
| Code Quality           | 15%    | ✅ Clean & Organized |
| README & Explanation   | 15%    | ✅ This document     |

---

## 👥 Contributors

- **Prathmesh Bhardwaj** - Full Stack Developer

---

## 📄 License

This project is for educational purposes.

---

## 🙏 Acknowledgments

- React Native & Expo team
- MongoDB Atlas
- Ionicons for icons
