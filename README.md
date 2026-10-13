# Exam Request Application

A small Express and MySQL application for submitting exam requests and viewing and filtering existing requests.

## Requirements

- Node.js and npm
- MySQL running locally, or a compatible hosted MySQL database

## Run locally

1. Install the project dependencies from the project directory:

   ```sh
   npm install
   ```

2. Create a MySQL database. For example, in a MySQL client:

   ```sql
   CREATE DATABASE ifsi_assessment;
   ```

3. Create a `.env` file in the project root with credentials for a MySQL user that can access that database:

   ```dotenv
   DB_NAME=ifsi_assessment
   DB_USER=your_mysql_user
   DB_PASSWORD=your_mysql_password
   PORT=3000
   ```

   The local connection defaults to `localhost` on port `3306`. `DB_HOST` and `DB_PORT` can override those defaults for a hosted database. Do not commit real credentials.

4. Start the server:

   ```sh
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). On startup, Sequelize creates tables that do not exist yet. It does not seed sample data or apply schema migrations.

## Deploy to Render

Create a Render Web Service connected to this GitHub repository and configure:

- **Build Command:** `npm ci && npm run build`
- **Start Command:** `npm start`

The build script checks the server, database config, models, and browser JavaScript syntax. Before deploying, provide Render with a reachable MySQL database and set `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD` in the service's environment variables. Set `NODE_ENV` to `production` if it is not already configured. Do not commit `.env`; use Render's environment settings for deployment secrets. The service listens on Render's assigned `PORT`.

The project currently has no automated test suite (`npm test` is a placeholder).

## Application and data

The browser page is served from `public/`. The Express API creates students and exam requests and returns existing requests for the table. The request list can be filtered in the browser. The form validates required fields and date, and asks for confirmation when a testing accommodation is selected; cancelling unchecks the option and stops submission.

The models define a `students` table and an `exam_requests` table. Student email addresses are unique. Exam requests reference a student and store course details, requested date, status, accommodation flag, and optional notes.

`seeds/sample_requests.json` contains example request data, but the current server does not load it. A fresh database therefore starts with empty tables until requests are submitted or data is added separately.

## Approach and assumptions

- Kept the existing Express, Sequelize, and MySQL structure and the current form and API flow.
- Used Sequelize's non-destructive `sync({ force: false })` to create missing tables on startup; this is convenient for a small assessment app, but is not a substitute for migrations in a production deployment.
- Treated the existing JSON file as illustrative sample data rather than an active seed, because there is no seed script or server code that imports it.
- Preserved the current two-request submission flow: create the student first, then create the exam request.
- Added accessibility improvements to the page, including explicit form labels, keyboard focus indicators, validation announcements, and a horizontally scrollable table on small screens.
- The floating table header is a visual-only copy, hidden from assistive technology; the original semantic table header remains in place.

## What I skipped

- An automated seed command to populate the database from `seeds/sample_requests.json`.
- Database migrations, transactional handling of the two-step submission, authentication, authorization, and production deployment configuration.
- Automated browser, API, and accessibility tests. The existing `npm test` script is still a placeholder.
- A full assistive-technology and cross-browser audit. The sticky visual header and responsive table in particular should be checked in target browsers and with keyboard and screen-reader testing.
- Further work on the accessible error and success experience, including a more polished success state and more detailed per-field error recovery.

## Tools and AI use

- **Tools used:** GitHub Copilot CLI, terminal checks (including `node --check`), and workspace file inspection/editing tools.
- **AI-generated or AI-reworked work:** Copilot drafted this README and worked on the page's accessibility markup, styles, form announcements, and floating table-header behavior. The existing application structure, API, and database models were inspected and documented rather than represented as newly generated.
- **One thing a tool got wrong:** A CSS-only `position: sticky` change did not keep the headers pinned during page scrolling because the table sits in an overflow container. That approach was replaced with a viewport-positioned visual copy synchronized to page and horizontal scrolling.
- **What I deliberately did not let a tool do:** I did not read or reproduce the project's `.env` credentials, run database-changing commands, or commit changes. I kept the work within this project directory.
