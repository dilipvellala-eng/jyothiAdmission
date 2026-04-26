# jyothiAdmission
=======
# School Admission Management System

A deployment-ready full-stack School Admission Management System built with React, Tailwind CSS, Node.js, Express, MongoDB, JWT authentication, secure document uploads, Swagger API documentation, dashboards, status tracking, notifications, duplicate detection, and CSV/PDF export.

## Features

- Roles: Admin, Staff, Parent/Student
- JWT login and protected role-based routes
- Multi-step online admission form with validation using the school admission/register fields
- Auto-generated application IDs
- Save draft, edit draft, submit application
- Auto-save drafts from the UI
- Admission status tracking: Pending, Approved, Rejected
- Search and filters for applications
- Dashboard statistics
- Admin/staff review panel with approve/reject and remarks
- Class and seat availability management
- Secure file upload handling for photo, birth certificate, and transfer certificate
- Duplicate application detection by Aadhaar or student DOB/name/parent phone
- Email notification support via SMTP
- SMS notification adapter hook
- Download application PDF
- Export applications as CSV
- Swagger API docs at `/api/docs`
- Docker Compose for API, client, and MongoDB

## Quick Start

1. Copy environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

2. Install dependencies:

```bash
npm run install:all
```

3. Start MongoDB locally or with Docker.

4. Seed default users and classes:

```bash
npm run seed --prefix server
```

5. Run the app:

```bash
npm run dev
```

- Client: `http://localhost:5173`
- API: `http://localhost:5000`
- Swagger: `http://localhost:5000/api/docs`

## Default Seed Users

| Role | Email | Password |
| --- | --- | --- |
| Admin | admin@school.test | Admin@12345 |
| Staff | staff@school.test | Staff@12345 |
| Parent/Student | parent@school.test | Parent@12345 |

## Docker

```bash
docker compose up --build
```

The API will be available on `http://localhost:5000`, the client on `http://localhost:5173`, and MongoDB on `localhost:27017`.

## Project Structure

```text
client/                React + Tailwind frontend
server/                Express + MongoDB API
server/src/models      Database schemas
server/src/routes      API endpoints
server/src/controllers Request handlers
server/src/middleware  Auth, uploads, validation, errors
server/src/services    Notifications, PDF, CSV, application IDs
server/src/docs        Swagger specification
```

## API Documentation

Run the server and visit:

```text
http://localhost:5000/api/docs
```

The OpenAPI JSON is also available at:

```text
http://localhost:5000/api/docs.json
```

## Admission Form Fields

The application form captures the fields from the supplied school admission form:

- Admission No., Class Admitted, Date of Admission
- Pupil full name with surname, Mother Tongue, Date of Birth
- Aadhaar No., PEN No., Child ID
- Nationality and State, Religion, SC/ST/BC details
- Whether living with Parent or Guardian
- Parent/Guardian name, Occupation, Full Address with Cell No.
- Mother Name
- Class last studied, School last attended, Qualified for promotion
- T.C. or Record Sheet attached, number and date
- Class into which admission is sought
- Medium of instruction
- First language Part-I and second language
- Small-pox vaccination/mark details
- Personal identification marks
- Previous school history

## Deployment Notes

- Set `NODE_ENV=production`
- Use a strong `JWT_SECRET`
- Set `MONGO_URI` to your production MongoDB connection string
- Set `CLIENT_URL` for CORS
- Configure SMTP variables for real email notifications
- Configure SMS provider logic in `server/src/services/notification.service.js`
- Store uploads on durable storage in production, such as S3, Azure Blob, or a mounted volume

