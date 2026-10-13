$(function () {
  // Cache the form controls and list required inputs for validation.
  const $form = $("#requestForm");
  const $examDate = $("#examDate");
  const $formErrors = $("#formErrors");
  const $filter = $("#filter");
  const $table = $("#requestsTable");
  const $filterStatus = $("#filterStatus");
  const requiredFields = ["#firstName", "#lastName", "#email", "#course", "#examDate"];

  // Display form errors in the live error summary and move focus to it.
  function showFormError(message) {
    $formErrors.text(message).prop("hidden", false).trigger("focus");
  }

  // Clear any previous error message before validating or submitting again.
  function clearFormError() {
    $formErrors.text("").prop("hidden", true);
  }

  // Apply the required-field message and accessibility state to one input.
  function validateField(field) {
    const $field = $(field);
    const element = $field[0];
    const label = $(`label[for="${element.id}"]`).text().trim();
    element.setCustomValidity(
      $field.val().trim() ? "" : `${label} is required.`
    );
    if (element.validity.valid) {
      $field.removeAttr("aria-invalid");
    } else {
      $field.attr("aria-invalid", "true");
    }
  }

  // Revalidate fields as they change, and clear the summary when the user edits.
  $form.on("input", function (event) {
    const field = event.target;
    if (requiredFields.includes(`#${field.id}`)) {
      validateField(field);
    } else {
      $(field).removeAttr("aria-invalid");
    }
    clearFormError();
  });

  // Set the earliest selectable exam date to the user's local date.
  const today = new Date();
  const localToday = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");
  $examDate.attr("min", localToday);

  $form.on("submit", async function (event) {
    event.preventDefault();
    clearFormError();

    requiredFields.forEach((selector) => validateField($(selector)[0]));

    // Keep native browser validation and focus behavior for invalid fields.
    if (!$form[0].reportValidity()) {
      const invalidLabels = requiredFields
        .map((selector) => $(selector)[0])
        .filter((field) => !field.validity.valid)
        .map((field) => $(`label[for="${field.id}"]`).text().trim());
      showFormError(`Please correct these fields: ${invalidLabels.join(", ")}.`);
      return;
    }

    const firstName = $("#firstName").val().trim();
    const lastName = $("#lastName").val().trim();
    const email = $("#email").val().trim();
    const fireDepartment = $("#fire-department").val().trim();
    const $course = $("#course");
    const course = $course.val().trim();
    const courseName = $course.find("option:selected").text().trim();
    const date = $examDate.val();
    const $accommodation = $("#accommodation");
    const accommodation = $accommodation.prop("checked");
    const notes = $("#notes").val().trim();

    // Guard against empty values and dates earlier than today.
    if (!firstName || !lastName || !email || !course || !date || date < localToday) {
      showFormError("Please complete all required fields with valid values.");
      return;
    }

    // Confirm accommodation needs; cancelling also clears the checkbox.
    if (
      accommodation &&
      !window.confirm("You indicated that you need a testing accommodation. Continue with this request?")
    ) {
      $accommodation.prop("checked", false);
      return;
    }

    try {
      // Find or create the student first; the response supplies the student_id
      // used to associate the new exam request with that student.
      const student = await $.ajax({
        url: "/api/newStudent",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ firstName, lastName, email, fireDepartment })
      });

      try {
        // Save the exam request using the student record returned above.
        await $.ajax({
          url: "/api/new-exam-request",
          method: "POST",
          contentType: "application/json",
          data: JSON.stringify({
            student_id: student.student_id,
            course_code: course,
            course_name: courseName,
            request_date: date,
            needs_accommodation: accommodation ? 1 : 0,
            notes: notes || null
          })
        });
      } catch (error) {
        const message = error.responseJSON?.error || "Unknown error.";
        throw new Error(`Student saved, but the exam request failed: ${message}`);
      }

      // Reload the page after a successful submission to refresh the request list.
      window.location.replace("/");
    } catch (error) {
      // Preserve API error messages where available and show them in the form.
      console.error("Error submitting exam request:", error);
      const message = error.message || error.responseJSON?.error || "Unable to submit the exam request.";
      showFormError(message);
    }
  });

  // Load requests from the server and render the table from these column definitions.
  async function getAllExamRequests() {
    const columns = [
      ["request_id", "Request ID"],
      ["student_id", "Student ID"],
      ["first_name", "First Name"],
      ["last_name", "Last Name"],
      ["fire_department", "Fire Department"],
      ["course_code", "Course Code"],
      ["course_name", "Course Name"],
      ["request_date", "Requested Date"],
      ["status", "Status"],
      ["needs_accommodation", "Needs Accommodation"],
      ["notes", "Notes"]
    ];

    try {
      // Request the current exam requests as JSON.
      const examRequests = await $.ajax({
        url: "/api/exam_requests",
        method: "GET",
        dataType: "json"
      });

      // Build accessible table headings and one row for each returned request.
      const $caption = $("<caption>").text("Current exam requests");
      const $thead = $("<thead>");
      const $headerRow = $("<tr>");
      columns.forEach(([, label]) => {
        $headerRow.append($("<th>").attr("scope", "col").text(label));
      });
      $thead.append($headerRow);

      const $tbody = $("<tbody>");
      examRequests.forEach((request) => {
        const $row = $("<tr>");
        columns.forEach(([key]) => {
          const value = key === "needs_accommodation"
            ? (request[key] ? "Yes" : "No")
            : (request[key] ?? "");
          $row.append($("<td>").text(value));
        });
        $tbody.append($row);
      });
      $table.empty().append($caption, $thead, $tbody);

      // Create a visual-only copy of the headings for when the real header scrolls
      // out of view; aria-hidden keeps assistive technology on the original header.
    //   const $tableWrapper = $table.closest(".table-wrapper");
    //   const $floatingHeader = $("<div>")
    //     .addClass("floating-table-header")
    //     .attr("aria-hidden", "true")
    //     .hide();
    //   const $floatingTable = $("<table>").append($thead.clone());
    //   $floatingHeader.append($floatingTable).appendTo("body");

    //   // Position the copied header over the table and align it with the columns.
    //   function updateFloatingHeader() {
    //     const table = $table[0];
    //     const wrapper = $tableWrapper[0];
    //     const headerRect = table.tHead.getBoundingClientRect();
    //     const tableRect = table.getBoundingClientRect();
    //     const wrapperRect = wrapper.getBoundingClientRect();
    //     const headerHeight = headerRect.height;

    //     // Show the copied header only while the real header is scrolled away
    //     // and the table's rows are still visible.
    //     if (headerRect.bottom > 0 || tableRect.bottom <= headerHeight) {
    //       $floatingHeader.hide();
    //       return;
    //     }

    //     $floatingHeader.css({
    //       display: "block",
    //       left: `${wrapperRect.left}px`,
    //       width: `${wrapper.clientWidth}px`,
    //       height: `${headerHeight}px`
    //     });
    //     $floatingTable.css({
    //       width: `${tableRect.width}px`,
    //       transform: `translateX(-${wrapper.scrollLeft}px)`
    //     });
    //     $floatingTable.find("th").each(function (index) {
    //       $(this).css(
    //         "width",
    //         `${table.tHead.rows[0].cells[index].getBoundingClientRect().width}px`
    //       );
    //     });
    //   }

    //   let floatingHeaderFrame = null;
    //   // Batch repeated scroll/resize events into a single layout update per frame.
    //   function scheduleFloatingHeaderUpdate() {
    //     if (floatingHeaderFrame !== null) {
    //       return;
    //     }
    //     floatingHeaderFrame = window.requestAnimationFrame(() => {
    //       floatingHeaderFrame = null;
    //       updateFloatingHeader();
    //     });
    //   }

    //   $(window).on("scroll.examRequests", scheduleFloatingHeaderUpdate);
    //   $(window).on("resize.examRequests", scheduleFloatingHeaderUpdate);
    //   $tableWrapper.on("scroll.examRequests", scheduleFloatingHeaderUpdate);
    //   updateFloatingHeader();

      // Filter rows as the user types and announce the number still visible.
      $filter.on("input.examRequests", function () {
        const query = $filter.val().trim().toLowerCase();
        let visibleCount = 0;
        $tbody.find("tr").each(function () {
          const matches = $(this).text().toLowerCase().includes(query);
          $(this).prop("hidden", !matches);
          if (matches) {
            visibleCount += 1;
          }
        });
        $filterStatus.text(
          `${visibleCount} ${visibleCount === 1 ? "request" : "requests"} shown.`
        );
      });
    } catch (error) {
      // Log load failures, clear any stale table data, and notify the user.
      console.error("Error fetching exam requests:", error);
      $table.empty();
      $filterStatus.text("Unable to load exam requests.");
    }
  }

  // Populate the table as soon as the document is ready.
  getAllExamRequests();
});
