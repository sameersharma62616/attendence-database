document.addEventListener("DOMContentLoaded", function() {
    let attendanceData = localStorage.getItem("attendance") ? JSON.parse(localStorage.getItem("attendance")) : {};
    let studentData = localStorage.getItem("studentData") ? JSON.parse(localStorage.getItem("studentData")) : [];

    const startDate = new Date(2024, 0, 25); // January is 0-based index

    renderAttendanceTable();

    function renderAttendanceTable() {
        const attendanceDiv = document.getElementById("attendance");
        attendanceDiv.innerHTML = "";

        const table = document.createElement("table");
        table.classList.add("attendance-table");

        const headerRow = document.createElement("tr");
        const fullAddressHeader = document.createElement("th");
        fullAddressHeader.textContent = "Full Address";
        headerRow.appendChild(fullAddressHeader);

        const motherNameHeader = document.createElement("th");
        motherNameHeader.textContent = "Mother's Name";
        headerRow.appendChild(motherNameHeader);

        const fatherNameHeader = document.createElement("th");
        fatherNameHeader.textContent = "Father's Name";
        headerRow.appendChild(fatherNameHeader);

        const mobileNumberHeader = document.createElement("th");
        mobileNumberHeader.textContent = "Mobile Number";
        headerRow.appendChild(mobileNumberHeader);

        const nameHeader = document.createElement("th");
        nameHeader.textContent = "Student Name";
        headerRow.appendChild(nameHeader);

        let currentDate = new Date(startDate);
        const endDate = new Date(2025, 11, 31);
        while (currentDate <= endDate) {
            const th = document.createElement("th");
            th.textContent = formatDate(currentDate);
            headerRow.appendChild(th);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        table.appendChild(headerRow);

        studentData.forEach(function(data) {
            const row = createStudentRow(data);
            table.appendChild(row);
        });

        attendanceDiv.appendChild(table);

        const addButton = document.createElement("button");
        addButton.textContent = "Add Student";
        addButton.addEventListener("click", function() {
            const newStudent = { fullAddress: "", motherName: "", fatherName: "", mobileNumber: "", studentName: "" };
            studentData.push(newStudent);
            const newRow = createStudentRow(newStudent);
            table.appendChild(newRow);
            saveStudentData();
        });
        attendanceDiv.appendChild(addButton);

        const stepBackButton = document.createElement("button");
        stepBackButton.textContent = "Step Back";
        stepBackButton.addEventListener("click", function() {
            if (studentData.length > 0) {
                studentData.pop();
                table.removeChild(table.lastElementChild);
                saveStudentData();
            }
        });
        attendanceDiv.appendChild(stepBackButton);

        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Changes";
        saveButton.addEventListener("click", function() {
            saveData();
        });
        attendanceDiv.appendChild(saveButton);
    }

    function formatDate(date) {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    function createStudentRow(data) {
        const row = document.createElement("tr");

        const fullAddressCell = document.createElement("td");
        fullAddressCell.textContent = data.fullAddress;
        fullAddressCell.setAttribute("contenteditable", "true");
        fullAddressCell.addEventListener("blur", function() {
            data.fullAddress = this.textContent.trim();
            saveStudentData();
        });
        row.appendChild(fullAddressCell);

        const motherNameCell = document.createElement("td");
        motherNameCell.textContent = data.motherName;
        motherNameCell.setAttribute("contenteditable", "true");
        motherNameCell.addEventListener("blur", function() {
            data.motherName = this.textContent.trim();
            saveStudentData();
        });
        row.appendChild(motherNameCell);

        const fatherNameCell = document.createElement("td");
        fatherNameCell.textContent = data.fatherName;
        fatherNameCell.setAttribute("contenteditable", "true");
        fatherNameCell.addEventListener("blur", function() {
            data.fatherName = this.textContent.trim();
            saveStudentData();
        });
        row.appendChild(fatherNameCell);

        const mobileNumberCell = document.createElement("td");
        mobileNumberCell.textContent = data.mobileNumber;
        mobileNumberCell.setAttribute("contenteditable", "true");
        mobileNumberCell.addEventListener("blur", function() {
            data.mobileNumber = this.textContent.trim();
            saveStudentData();
        });
        row.appendChild(mobileNumberCell);

        const nameCell = document.createElement("td");
        nameCell.textContent = data.studentName;
        nameCell.setAttribute("contenteditable", "true");
        nameCell.addEventListener("blur", function() {
            data.studentName = this.textContent.trim();
            saveStudentData();
        });
        row.appendChild(nameCell);

        let currentDate = new Date(startDate);
        const endDate = new Date(2025, 11, 31);
        while (currentDate <= endDate) {
            const td = document.createElement("td");
            const date = currentDate.toISOString().split('T')[0];
            const checkbox = createCheckbox(data.studentName, date, attendanceData[data.studentName]?.[date] || {});
            td.appendChild(checkbox);
            row.appendChild(td);
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return row;
    }

    function createCheckbox(studentName, date, attendance) {
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = attendance.present || false;
        checkbox.setAttribute("data-student", studentName);
        checkbox.setAttribute("data-date", date);
        checkbox.classList.add("attendance-checkbox");
        checkbox.addEventListener("change", function() {
            const studentName = this.getAttribute("data-student");
            const date = this.getAttribute("data-date");
            attendanceData[studentName] = attendanceData[studentName] || {};
            attendanceData[studentName][date] = attendanceData[studentName][date] || {};
            attendanceData[studentName][date].present = this.checked;
            saveAttendance();
        });

        if (attendance.absent) {
            checkbox.checked = false;
        }

        return checkbox;
    }

    function saveAttendance() {
        localStorage.setItem("attendance", JSON.stringify(attendanceData));
    }

    function saveStudentData() {
        localStorage.setItem("studentData", JSON.stringify(studentData));
    }

    function saveData() {
        saveAttendance();
        saveStudentData();
        alert("Data saved successfully!");
    }
});
