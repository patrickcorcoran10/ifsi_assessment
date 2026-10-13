const path = require('path');
const express = require('express');
const sequelize = require('./config/connection');
const { Student, ExamRequest } = require('./models');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API Routes
// For testing
app.get('/api/students', async (req, res) => {
  try {
    const students = await Student.findAll({ raw: true });
    res.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).json({ error: 'Unable to fetch students.' });
  }
});

// Routes Needed for a Submit:
// POST FOR STUDENT
app.post('/api/newStudent', async (req, res) => {
    // Verify that email is part of req.body. 
    const email = typeof req.body?.email === 'string' ? req.body.email.trim() : '';
    
    // Look up the student by email so repeat exam requests reuse the existing student_id.
    try {
        const existingStudent = await Student.findOne({ where: { email } });
        if (existingStudent) {
            // Keep the saved department current when one is provided with this request.
            // if (fireDepartment) {
            //     await existingStudent.update({ fireDepartment });
            // }
            // Return the existing student so the client can use its student_id for the exam request.
            return res.status(200).json(existingStudent);
        }

        // No student has this email, so create a record and return its new student_id.
        const newStudent = await Student.create({ ...req.body, email });
        res.status(201).json(newStudent);
    } catch (error) {
        console.error('Error creating student:', error);
        res.status(400).json({ error: 'Unable to create student. Check the submitted student details.' });
    }
})
// POST FOR NEW EXAM REQUEST
app.post('/api/new-exam-request', async (req, res) => {
    // Collect the Request Body and destructure it.
    const {
        student_id: studentId,
        course_code: courseCode,
        course_name: courseName,
        request_date: requestDate,
        needs_accommodation: needsAccommodation = 0,
        notes = null
    } = req.body || {};

    // Validating the Request Date. Making sure it matches the ISO-8601 date structure. 
    // Regex matches a string that is a full, standard date in YYYY-MM-DD format.
    const parsedRequestDate =
        typeof requestDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(requestDate)
            ? new Date(`${requestDate}T00:00:00.000Z`)
            : null;
    // Making sure the request date is in the future.
    const validRequestDate =
        parsedRequestDate &&
        !Number.isNaN(parsedRequestDate.getTime()) &&
        parsedRequestDate.toISOString().slice(0, 10) === requestDate;

    // Validating the Request Body on the backend with the same requirements as the Model
     if (
        studentId === undefined ||
        studentId === null ||
        studentId === '' ||
        !Number.isInteger(Number(studentId)) ||
        Number(studentId) <= 0 ||
        typeof courseCode !== 'string' ||
        !courseCode.trim() ||
        courseCode.trim().length > 20 ||
        typeof courseName !== 'string' ||
        !courseName.trim() ||
        courseName.trim().length > 100 ||
        !validRequestDate ||
        ![0, 1].includes(Number(needsAccommodation)) ||
        (notes !== null && typeof notes !== 'string') ||
        (typeof notes === 'string' && notes.length > 500)
    ) {
        return res.status(400).json({ error: 'Invalid or missing exam request details.' });
    }
    try {
        // Search Student table for primary key to verify they were created properly.
        const student = await Student.findByPk(studentId);
        if (!student) {
            // Return out if no student exists because student_id is not valid.
            return res.status(404).json({ error: 'Student not found.' });
        }

        const newExamRequest = await ExamRequest.create({
            student_id: Number(studentId),
            course_code: courseCode,
            course_name: courseName,
            request_date: requestDate,
            needs_accommodation: Number(needsAccommodation),
            notes
        });
        res.status(201).json(newExamRequest);
    } catch (error) {
        console.error('Error creating exam request:', error);
        res.status(400).json({ error: 'Unable to create exam request.' });

    }
})

// GET REQUEST FOR TABLE
app.get('/api/exam_requests', async (req, res) => {
    try {
        // Use a raw Sequelize query to retrieve each request and its related student details.
        // See https://sequelize.org/docs/v6/core-concepts/raw-queries/
        const [examRequests] = await sequelize.query(`
            SELECT
                er.request_id,
                er.student_id,
                s.first_name,
                s.last_name,
                s.fire_department,
                er.course_code,
                er.course_name,
                DATE_FORMAT(er.request_date, '%Y-%m-%d') AS request_date,
                er.status,
                er.needs_accommodation,
                er.notes
            FROM exam_requests AS er
            -- Match each request to its student so the table can display their details.
            INNER JOIN students AS s ON s.student_id = er.student_id
            -- Return the most recently created requests first.
            ORDER BY er.request_id DESC
        `);
        // Convert the database value to a JavaScript boolean before returning the results.
        res.json(examRequests.map((request) => ({
            ...request,
            needs_accommodation: Boolean(request.needs_accommodation)
        })));
    } catch (error) {
        console.error('Error fetching exam requests:', error);
        res.status(500).json({ error: 'Unable to fetch exam requests.' });
    }
})



async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: false });
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
  } catch (error) {
    console.error('Unable to connect to the database or initialize the application:', error);
    process.exitCode = 1;
  }
}

startServer();