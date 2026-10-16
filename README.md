# User Management System

A CRUD web application built for the assignment using **React + Vite**, **Node.js + Express**, and **MySQL**.

## Features

- Master table of users
- Search users by name, email, or phone
- View user details in a modal
- Create, update, and delete users
- Server-side input validation
- Parameterized SQL queries to reduce SQL injection risk
- Separated routes, controllers, services, and database configuration

## Requirements

- Node.js 20 or newer (recommended)
- MySQL 8 or compatible version
- Git (for GitHub submission)

## Project structure

```text
user-management-system/
├── client/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
├── server/                 # Express REST API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── .env.example
│   └── package.json
├── database/
│   └── database.sql
├── .gitignore
├── package.json
└── README.md
```

## 1. Create the database

1. Open MySQL Workbench or your preferred MySQL client.
2. Open `database/database.sql`.
3. Execute the script. It creates `user_management` and a `users` table, then inserts sample users.

The sample data is fictional.

## 2. Configure the backend

Open a terminal at the project root:

```bash
cd server
```

Copy `.env.example` to `.env`, then edit `.env` with your local MySQL credentials.

Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Example `.env` values:

```env
PORT=5000
CLIENT_ORIGIN=http://localhost:5173
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=user_management
```

Replace `your_mysql_password` with your own MySQL password. Do not commit `.env` to GitHub.

Install and start the API:

```bash
npm install
npm run dev
```

API health check: `http://localhost:5000/api/health`

## 3. Configure the frontend

Open a second terminal at the project root:

```bash
cd client
npm install
npm run dev
```

Open the URL shown by Vite, usually `http://localhost:5173`.

The frontend calls the backend at `http://localhost:5000/api`.

## 4. Run both applications from the root (optional)

After installing root dependencies and dependencies in both apps:

```bash
npm install
npm run install:all
npm run dev
```

This starts the Express API and Vite frontend concurrently.

## API endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check API status |
| GET | `/api/users` | List users; optional `?search=term` |
| GET | `/api/users/:id` | Get one user |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/:id` | Update a user |
| DELETE | `/api/users/:id` | Delete a user |

Example request body:

```json
{
  "name": "Somchai Example",
  "phone": "0812345678",
  "email": "somchai@example.com"
}
```

## Database structure

`users` table:

| Column | Type | Notes |
|---|---|---|
| `id` | INT UNSIGNED | Primary key, auto increment |
| `name` | VARCHAR(100) | Required |
| `phone` | VARCHAR(20) | Required |
| `email` | VARCHAR(150) | Required, unique |
| `created_at` | TIMESTAMP | Creation timestamp |
| `updated_at` | TIMESTAMP | Automatically updated timestamp |

## Design decisions

- **Separation of Concerns:** routes, controllers, services, and database configuration have separate responsibilities.
- **DRY:** shared validation and API error handling avoid repeating logic.
- **KISS:** the app uses one main entity and a modal instead of unnecessary navigation.
- **Parameterized queries:** user-provided values are passed separately from SQL text.
- **Environment variables:** credentials are kept in `.env`, which is ignored by Git.

## Manual test checklist

- [ ] The user table loads from MySQL.
- [ ] Search filters users.
- [ ] Clicking a user's name opens the detail modal.
- [ ] A valid user can be created and remains after refresh.
- [ ] A user can be updated and the table reflects the change.
- [ ] Delete requires confirmation and removes the user.
- [ ] Empty fields and invalid email addresses are rejected.
- [ ] Duplicate email addresses are rejected.
- [ ] A nonexistent user ID returns a not-found response.

## Upload to GitHub

1. Create a new **empty** repository on GitHub, for example `user-management-system`.
2. Do not upload `.env` or `node_modules`.
3. From the project root, run:

```bash
git init
git add .
git commit -m "Build user management system"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/user-management-system.git
git push -u origin main
```

Replace the URL with your own repository URL. If Git asks you to sign in, complete GitHub authentication.

## Loom demo outline

1. Introduce the purpose and stack.
2. Demonstrate list, search, detail modal, create, edit, and delete.
3. Explain the React components and API service.
4. Explain Express routes, controller/service responsibilities, and validation.
5. Show the `users` table in MySQL Workbench.
6. Explain how to import the SQL file, configure `.env`, and run both apps.
7. Show the GitHub repository and README.

## Notes

This is an assignment starter project, not a production-ready identity or access management system. It does not include login, roles, or authentication because they are not required by the stated assignment.
