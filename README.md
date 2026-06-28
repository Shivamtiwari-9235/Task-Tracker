# Task Tracker (MERN)

Enterprise-grade MERN Task Tracker with CRUD, pagination, filtering/sorting/search, validation, loading states, toast notifications, skeleton UI, dark mode, and export (JSON/CSV).

## Features
### Backend (Express + MongoDB)
- CRUD for tasks
- Pagination with totalCount/totalPages
- Filters: status, priority
- Search: title + description (text index)
- Sort: createdAt, dueDate, priority
- Validation via `express-validator`
- Global error handling with proper HTTP status codes
- MongoDB indexes for performance

### Frontend (React + Vite + Tailwind)
- Mobile-first responsive UI
- Client-side validation (inline error messages)
- Dynamic updates (no page refresh)
- Loading skeletons
- Toast notifications
- Dark mode support
- Export current page tasks as JSON/CSV

## Project Structure
- `backend/` - Express server (port 5000)
- `frontend/` - React app with Vite (port 5173)

---

## Backend Setup
### 1) Environment
Create `backend/.env` from `backend/.env.example`:

```bash
copy backend\.env\.example backend\.env
```

Set `MONGODB_URI` to your MongoDB Atlas connection string.

### 2) Install & Run
```bash
cd backend
npm install
npm run dev
```
Backend runs on **http://localhost:5000**.

---

## Frontend Setup
### 1) Environment
Create `frontend/.env` from `frontend/.env.example`:

```bash
copy frontend\.env\.example frontend\.env
```

### 2) Install & Run
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**.

---

## API Reference
Base URL: `http://localhost:5000/api`

- `POST /api/tasks`
- `GET /api/tasks` (supports `page`, `limit`, `status`, `priority`, `search`, `sortBy`, `sortDir`)
- `GET /api/tasks/:id`
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id`

---

## Deployment
### Backend (Render / Railway)
1. Create a Node.js service.
2. Set environment variables:
   - `PORT` = `5000`
   - `MONGODB_URI` (Atlas connection string)
   - `NODE_ENV` = `production`
3. Start command: `npm run start`

### Frontend (Vercel)
1. Build with `npm run build`.
2. Set environment variable:
   - `VITE_API_BASE_URL` = `https://<backend-domain>/api`
3. Deploy.

---

## Notes
- Export JSON/CSV exports the tasks currently loaded on the UI (current page based on filters/pagination).
- MongoDB text index is created on `title` and `description`.

