# IFSI Exam Request Application

A web application for submitting exam requests and viewing and filtering requests already on file.

**Live application:** [https://ifsiassessment-production.up.railway.app/](https://ifsiassessment-production.up.railway.app/)

## What it does

- Collects student information, course, requested exam date, accommodation needs, and optional notes.
- Validates required fields and asks for confirmation when an accommodation is selected.
- Saves student and exam request records in MySQL.
- Displays requests in a filterable table, with keyboard-accessible form controls and a horizontally scrollable table on small screens.

## Built with

Node.js 24, Express 5, Sequelize 6, MySQL, and jQuery 3.7.1.

## Run locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a MySQL database:

   ```sql
   CREATE DATABASE ifsi_assessment;
   ```

3. Add a `.env` file to the project root with credentials for a MySQL user that can access the database:

   ```dotenv
   DB_NAME=ifsi_assessment
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   DB_HOST=127.0.0.1
   DB_PORT=3306
   ```

   Keep real credentials private and do not commit `.env`.

4. Start the app:

   ```sh
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000). On startup, Sequelize connects to MySQL and creates missing tables without dropping existing data. The app does not seed sample records, so a new database starts with an empty request list.

## API routes

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/students` | List students | --This was used for testing
| `POST` | `/api/newStudent` | Create a student or return the existing record for the same email |
| `POST` | `/api/new-exam-request` | Create a request for an existing student |
| `GET` | `/api/exam_requests` | List requests with student details, newest first |

## Data

The `students` table stores names, unique email addresses, and an optional fire department. The `exam_requests` table stores course details, requested date, status, accommodation flag, optional notes, and a reference to the student. New requests have a `Pending` status by default.

## What I skipped

- Refining the app's overall visual look and polishing the interface beyond the core requirements.
- Any form of functional testing, including manual end-to-end checks and automated browser or API tests.
- Proper quality assurance, including broader validation of error cases, responsive layouts, accessibility, and browser compatibility.
- Database migrations and automated seed data.


The `npm run build` script only performs JavaScript syntax checks; it is not a test or QA suite. `npm test` is currently a placeholder.

## Development note

Copilot was used to speed up development and help meet the assessment's time requirement. The application was reviewed and documented against the implemented code, but the testing and QA work listed above remains to be done. Copilot was used to help with making the Accessibility meet standards as well as to quickly achieve the correct query syntax. Outside of AI tools, I leveraged some course work files that helped me quickly create the server.js, connection.js and models with sequelize. 

## Scripts

- `npm start` — start the server.
- `npm run dev` — start the server for local development.
- `npm run build` — run JavaScript syntax checks.
