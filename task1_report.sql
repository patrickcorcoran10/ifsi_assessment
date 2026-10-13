--Query 1: Pending volume by course.
SELECT
    course_code,
    course_name,
    COUNT(*) AS pending_count
FROM exam_requests
WHERE status = 'Pending'
GROUP BY course_code
ORDER BY 
  pending_count DESC,  
  course_code ASC;

--Query 2: Repeat Requesters
SELECT
    s.student_id,
    s.first_name,
    s.last_name,
    er.course_code,
    er.course_name,
    COUNT(*) AS request_count
FROM students AS s
JOIN exam_requests AS er
    ON s.student_id = er.student_id
GROUP BY
    s.student_id,
    s.first_name,
    s.last_name,
    er.course_code,
    er.course_name
HAVING COUNT(*) > 1
ORDER BY
    request_count DESC,
    s.last_name ASC,
    er.course_code ASC;