# ResumeCraft - AI Resume Builder

A full-stack web application for creating professional resumes with live preview, multiple templates, and PDF export.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite, Tailwind CSS        |
| Backend  | Node.js, Express                    |
| Database | MongoDB with Mongoose               |
| Auth     | JWT (JSON Web Tokens)               |

## Features

- **User Authentication** — Sign up / log in with JWT-secured sessions
- **Resume CRUD** — Create, edit, duplicate, and delete resumes
- **Multi-step Wizard** — Personal Info → Education → Skills → Projects → Experience
- **Live Preview** — Split-screen real-time resume preview
- **3 Templates** — Modern, Classic, and Minimal designs
- **PDF Download** — Export your resume as a PDF
- **Multiple Resumes** — Save and manage unlimited resumes per account

## Project Structure

```
resume builder/
├── ai-service/
│   ├── app/
│   │   ├── main.py            # FastAPI entry point
│   │   ├── routers/           # API router/endpoints
│   │   ├── schemas.py         # Pydantic request/response models
│   │   └── services/          # NLP and analysis logic
│   ├── requirements.txt       # Python dependencies
│   └── Procfile               # Production execution config
│
├── backend/
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js  # Register, login, getMe
│   │   └── resumeController.js # Resume CRUD + duplicate
│   ├── middleware/
│   │   └── auth.js            # JWT protection middleware
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Resume.js          # Resume schema
│   ├── routes/
│   │   ├── auth.js            # /api/auth routes
│   │   └── resumes.js         # /api/resumes routes
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express entry point
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js       # Axios instance with JWT interceptor
│   │   ├── components/
│   │   │   ├── Layout/        # Sidebar + layout wrapper
│   │   │   ├── Resume/        # LivePreview, TemplateSelector, wizard steps
│   │   │   ├── templates/     # Modern, Classic, Minimal templates
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── DashboardPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   └── ResumeEditorPage.jsx
│   │   ├── utils/
│   │   │   ├── constants.js
│   │   │   ├── validation.js
│   │   │   └── pdfDownload.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── start-all.bat              # Windows launcher script for all services
└── README.md
```

## Prerequisites

- **Node.js** v18 or higher
- **MongoDB** — local install or [MongoDB Atlas](https://www.mongodb.com/atlas) cloud cluster
- **npm** or **yarn**

## Setup Instructions

### Quick Start (Windows)
If you are on Windows and have completed the setup for each service, you can run all three services concurrently (in separate command prompt windows) using:
```bash
.\start-all.bat
```

### 1. Clone / navigate to the project

```bash
cd "resume builder"
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your values. For MongoDB Atlas, use the connection string from
**Atlas → Database → Connect → Drivers**, URL-encode special characters in the
database username or password, and replace the placeholders below:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/resume-builder?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:3000
```

In Atlas, also create a database user and add your current IP address under
**Network Access**. Then run the server:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The API runs at **http://localhost:5000**.

### 3. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs at **http://localhost:3000**.

### 4. AI Service Setup (Required for AI Suggestions)

Open a new terminal:

```bash
cd ai-service
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the AI service
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The service runs at **http://localhost:8000**.

### 5. Use the Application


1. Open **http://localhost:3000** in your browser
2. Click **Sign up** to create an account
3. From the **Dashboard**, click **New Resume**
4. Fill in each wizard step — watch the live preview update
5. Choose a template (Modern / Classic / Minimal)
6. Click **Save** to persist, then **Download PDF** to export

## Docker Compose

Make sure `backend/.env` contains your MongoDB Atlas URI and JWT secret, then
run all services from the project root:

```bash
docker compose up --build
```

Open **http://localhost:3000**. The backend is available at
**http://localhost:5000**, and the AI service is available at
**http://localhost:8000**. Stop the services with:

```bash
docker compose down
```

## API Endpoints

### Auth

| Method | Endpoint           | Description       | Auth |
|--------|--------------------|-------------------|------|
| POST   | `/api/auth/register` | Register new user | No   |
| POST   | `/api/auth/login`    | Login user        | No   |
| GET    | `/api/auth/me`       | Get current user  | Yes  |

### Resumes

| Method | Endpoint                      | Description        | Auth |
|--------|-------------------------------|--------------------|------|
| GET    | `/api/resumes`                | List all resumes   | Yes  |
| POST   | `/api/resumes`                | Create resume      | Yes  |
| GET    | `/api/resumes/:id`            | Get single resume  | Yes  |
| PUT    | `/api/resumes/:id`            | Update resume      | Yes  |
| DELETE | `/api/resumes/:id`            | Delete resume      | Yes  |
| POST   | `/api/resumes/:id/duplicate`  | Duplicate resume   | Yes  |

## Environment Variables

| Variable       | Description                    | Default                              |
|----------------|--------------------------------|--------------------------------------|
| `PORT`         | Backend server port            | `5000`                               |
| `MONGODB_URI`  | MongoDB Atlas connection string | *(required)*                         |
| `JWT_SECRET`   | Secret key for JWT signing     | *(required)*                         |
| `JWT_EXPIRE`   | Token expiration time          | `7d`                                 |

## Production Build

```bash
# Frontend
cd frontend
npm run build
# Output in frontend/dist/

# Backend — set NODE_ENV=production and use a process manager like PM2
cd backend
npm start
```

## License

MIT
