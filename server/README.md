# Campus FixIt - Backend API

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

1. Install dependencies:

```bash
cd server
npm install
```

2. Configure environment:

```bash
# Copy the example env file
cp .env.example .env

# Edit .env with your MongoDB URI and JWT secret
```

3. Seed the database (optional):

```bash
npm run seed
```

4. Start the server:

```bash
# Development (with hot reload)
npm run dev

# Production
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication

- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

### Users (Admin only for most)

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `PUT /api/users/:id/role` - Update user role
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/stats/overview` - Get user statistics

### Issues

- `GET /api/issues` - Get all issues (admin) or user's issues
- `GET /api/issues/my` - Get current user's issues
- `GET /api/issues/stats` - Get issue statistics (admin only)
- `GET /api/issues/:id` - Get issue by ID
- `POST /api/issues` - Create new issue
- `PUT /api/issues/:id` - Update issue
- `DELETE /api/issues/:id` - Delete issue

## Test Accounts

After running `npm run seed`:

- **Admin**: admin@campus.edu / admin123
- **Student**: student@campus.edu / student123
- **Student**: jane@campus.edu / student123
