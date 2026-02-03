# Task Management System

A full-stack MERN (MongoDB, Express, React, Node.js) task management web application with JWT authentication.

## Features

- **User Authentication**
  - User registration with password hashing (bcrypt)
  - User login with JWT tokens
  - Protected routes

- **Task Management (CRUD)**
  - Create new tasks
  - View all your tasks
  - Update task details (title, description, status)
  - Delete tasks
  - **Filter tasks by status** (Pending, In Progress, Completed)
  - **Search tasks** by title or description
  - **Pagination** for task list (configurable page size)

- **User Privacy**
  - Users can only see and manage their own tasks
  - Secure API endpoints with JWT middleware

- **Clean UI**
  - Modern, minimal design with Tailwind CSS
  - Responsive layout
  - Loading states and error handling

## Tech Stack

- **Frontend:** React 18 (Hooks), React Router, Axios, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Authentication:** JWT (JSON Web Tokens)
- **Password Hashing:** bcryptjs

## Project Structure

```
Task-Management-WebApp/
├── api/                    # Vercel serverless (Express API)
│   └── [[...slug]].js      # Catch-all handler for /api/*
├── client/                 # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── PrivateRoute.js
│   │   │   └── TaskForm.js
│   │   ├── context/        # React Context for auth
│   │   │   └── AuthContext.js
│   │   ├── pages/          # Page components
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   └── TaskList.js
│   │   ├── services/       # API service layer
│   │   │   └── taskService.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── server/                 # Express backend
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/         # Custom middleware
│   │   └── authMiddleware.js
│   ├── models/             # MongoDB models
│   │   ├── User.js
│   │   └── Task.js
│   ├── routes/             # API routes
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── server.js           # Entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB Atlas account (or local MongoDB)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```bash
   cp .env.example .env
   ```

4. **Configure environment variables in `.env`:**
   ```env
  PORT=5000
  MONGODB_URI='your_mongodb_url'
  JWT_SECRET=your-secret-key
   ```

   - Get your MongoDB Atlas connection string from your cluster's "Connect" button
   - Generate a strong random string for `JWT_SECRET` (e.g., use a password generator)

5. **Start the server:**
   ```bash
   # Development mode (with nodemon)
   npm run dev

   # Production mode
   npm start
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file (optional):**
   ```bash
   cp .env.example .env
   ```

   If you don't create `.env`, the app will default to `http://localhost:5000/api`

4. **Configure environment variables in `.env` (if created):**
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

5. **Start the development server:**
   ```bash
   npm start
   ```

   The app will open in your browser at `http://localhost:3000`

## API Routes

### Authentication Routes

- `POST /api/auth/register` - Register a new user
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `POST /api/auth/login` - Login user
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```

- `GET /api/auth/me` - Get current user (Protected)
  - Requires: `Authorization: Bearer <token>`

### Task Routes (All Protected - require JWT token)

- `GET /api/tasks` - Get tasks for logged-in user (supports search, filter, pagination)
  - Query params (optional):
    - `page` (number, default: 1)
    - `limit` (number, default: 10, max: 50)
    - `search` (string) - matches task title or description (case-insensitive)
    - `status` (string) - one of: `Pending`, `In Progress`, `Completed`
  - Response: `{ tasks, total, page, totalPages, hasMore }`
  - Requires: `Authorization: Bearer <token>`

- `GET /api/tasks/:id` - Get single task
  - Requires: `Authorization: Bearer <token>`

- `POST /api/tasks` - Create a new task
  ```json
  {
    "title": "Complete project",
    "description": "Finish the task management system",
    "status": "Pending"
  }
  ```
  - Requires: `Authorization: Bearer <token>`

- `PUT /api/tasks/:id` - Update a task
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "status": "In Progress"
  }
  ```
  - Requires: `Authorization: Bearer <token>`

- `DELETE /api/tasks/:id` - Delete a task
  - Requires: `Authorization: Bearer <token>`

### Health Check

- `GET /api/health` - Server health check

## Security Features

- Passwords are hashed using bcrypt before storing in database
- JWT tokens expire after 30 days
- Protected routes verify JWT tokens
- Users can only access their own tasks (enforced at API level)
- CORS enabled for frontend-backend communication

## UI Features

- Clean, minimal design with Tailwind CSS
- Responsive layout (mobile-friendly)
- Loading states for async operations
- Error messages for user feedback
- Task status badges with color coding
- Filter tasks by status
- **Search** – search box to find tasks by title or description (debounced)
- **Pagination** – previous/next and page indicator (e.g. 6 tasks per page)
- Modal form for creating/editing tasks

## Task Model

Each task contains:
- `title` (String, required) - Task title
- `description` (String, optional) - Task description
- `status` (String, enum) - One of: "Pending", "In Progress", "Completed"
- `user` (ObjectId, required) - Reference to User who owns the task
- `createdDate` (Date) - When the task was created
- `createdAt` (Date) - MongoDB timestamp
- `updatedAt` (Date) - MongoDB timestamp

## Testing the Application

1. **Start both servers:**
   - Backend: `cd server && npm run dev`
   - Frontend: `cd client && npm start`

2. **Register a new account:**
   - Go to `http://localhost:3000/register`
   - Fill in name, email, and password
   - Click "Create account"

3. **Create tasks:**
   - After login, click "+ Create New Task"
   - Fill in title, description, and select status
   - Click "Create Task"

4. **Manage tasks:**
   - View all tasks on the main page
   - Use the **search** box to find tasks by title or description
   - Filter by status using the dropdown
   - Use **pagination** (Previous / Next) when you have many tasks
   - Click "Edit" to update a task
   - Click "Delete" to remove a task

## Deployment (Vercel – frontend and backend)

The project is set up to deploy **both** the React frontend and the Express API on **Vercel** in a single project.

### 1. Push the repo to GitHub

Ensure the repo is on GitHub (or another Git provider Vercel supports).

### 2. Import the project on Vercel

1. Go to [vercel.com](https://vercel.com) and sign in.
2. Click **Add New** → **Project** and import your Git repository.
3. Leave **Root Directory** as `.` (repo root).
4. Vercel will use the root `package.json` and `vercel.json`:
   - **Build Command:** `npm run build` (builds the client).
   - **Output Directory:** `client/build`.
   - The `api/` folder is deployed as serverless functions under `/api`.

### 3. Set environment variables

In the Vercel project → **Settings** → **Environment Variables**, add:

| Name           | Value                          | Notes                    |
|----------------|--------------------------------|---------------------------|
| `MONGODB_URI`  | Your MongoDB Atlas connection string | Required for the API   |
| `JWT_SECRET`   | A long random secret           | Required for auth        |

Use the same values for **Production**, **Preview**, and **Development** if you use preview deployments.

### 4. Deploy

Click **Deploy**. After the build finishes:

- **Frontend:** Served from the root (e.g. `https://your-project.vercel.app`).
- **API:** Available at `https://your-project.vercel.app/api` (e.g. `/api/auth/login`, `/api/tasks`).

The client is configured to use the same origin for the API when `REACT_APP_API_URL` is not set, so no extra env var is needed for the frontend on Vercel.

### Local development

- **API:** `cd server && npm run dev` (runs on port 5000).
- **Frontend:** `cd client && npm start` (runs on port 3000).
- For local API, set `REACT_APP_API_URL=http://localhost:5000/api` in `client/.env` if needed (optional; default is `http://localhost:5000/api`).

### If login/register fail on Vercel

1. **Environment variables** – In Vercel → Project → Settings → Environment Variables, ensure **both** `MONGODB_URI` and `JWT_SECRET` are set and apply to **Production** (and Preview if you use it). Then trigger a **Redeploy** so the new env vars are picked up.
2. **Do not set `REACT_APP_API_URL`** for the Vercel deployment. The app uses the same origin (`window.location.origin/api`) so the frontend and API stay on one domain.
3. **MongoDB Atlas** – In Atlas → Network Access, add **0.0.0.0/0** (Allow access from anywhere) so Vercel’s serverless IPs can connect.
4. **Function logs** – In Vercel → Project → Deployments → select a deployment → **Functions** → open the `/api` function and check **Logs** for DB or auth errors.

## License

ISC

## Author

Built as a technical assessment project.

---

**Note:** Make sure to keep your `.env` files secure and never commit them to version control. Use `.env.example` files as templates.