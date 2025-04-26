
        // Initialize students array
        let students = [];
        let editingId = null;
        const STORAGE_KEY = 'student_registry_data';

        // Load saved data from localStorage
        function loadFromLocalStorage() {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                students = JSON.parse(savedData);
                renderAll();
                updateStats();
            } else {
                // Initialize with example data
                students = [
                    { id: 1, name: "John Smith", class: "JSS1", score: 78 },
                    { id: 2, name: "Mary Johnson", class: "JSS1", score: 92 },
                    { id: 3, name: "David Lee", class: "JSS2", score: 65 },
                    { id: 4, name: "Sarah Wilson", class: "JSS2", score: 45 },
                    { id: 5, name: "Michael Brown", class: "JSS3", score: 58 },
                    { id: 6, name: "Emma Davis", class: "SS1", score: 37 },
                    { id: 7, name: "Robert Miller", class: "SS2", score: 82 },
                    { id: 8, name: "Jennifer Garcia", class: "SS3", score: 74 }
                ];
                saveToLocalStorage();
                renderAll();
                updateStats();
            }
        }

        // Save data to localStorage
        function saveToLocalStorage() {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
        }

        // Generate a unique ID for new students
        function generateId() {
            return students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
        }

        // Function to determine grade based on score
        function getGrade(score) {
            if (score >= 70) return "A";
            if (score >= 60) return "B";
            if (score >= 50) return "C";
            if (score >= 40) return "D";
            return "F";
        }

        // Function to validate form inputs
        function validateForm(nameId, classId, scoreId, nameErrorId, classErrorId, scoreErrorId) {
            let isValid = true;
            const nameInput = document.getElementById(nameId);
            const classInput = document.getElementById(classId);
            const scoreInput = document.getElementById(scoreId);
            
            // Reset error messages
            document.getElementById(nameErrorId).textContent = "";
            document.getElementById(classErrorId).textContent = "";
            document.getElementById(scoreErrorId).textContent = "";
            
            // Validate name
            if (!nameInput.value.trim()) {
                document.getElementById(nameErrorId).textContent = "Please enter a student name";
                isValid = false;
            }
            
            // Validate class
            if (!classInput.value) {
                document.getElementById(classErrorId).textContent = "Please select a class";
                isValid = false;
            }
            
            // Validate score
            const score = parseInt(scoreInput.value);
            if (isNaN(score) || score < 0 || score > 100) {
                document.getElementById(scoreErrorId).textContent = "Please enter a valid score between 0 and 100";
                isValid = false;
            }
            
            return isValid;
        }

        // Function to add a new student
        function addStudent() {
            if (!validateForm("name", "class", "score", "name-error", "class-error", "score-error")) return;
            
            const name = document.getElementById("name").value.trim();
            const studentClass = document.getElementById("class").value;
            const score = parseInt(document.getElementById("score").value);
            
            // Create new student object with a unique ID
            const newStudent = {
                id: generateId(),
                name: name,
                class: studentClass,
                score: score
            };
            
            // Add to students array
            students.push(newStudent);
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Reset form
            resetForm();
            
            // Re-render all displays
            renderAll();
            updateStats();
            
            // Show alert
            alert(`Student "${name}" has been added successfully!`);
        }

        // Function to reset form
        function resetForm() {
            document.getElementById("name").value = "";
            document.getElementById("class").value = "";
            document.getElementById("score").value = "";
            document.getElementById("name-error").textContent = "";
            document.getElementById("class-error").textContent = "";
            document.getElementById("score-error").textContent = "";
        }

        // Function to render all students with filtering
        function renderAllStudents() {
            const container = document.getElementById("students-list");
            const searchTerm = document.getElementById("search-student").value.toLowerCase();
            const filterClass = document.getElementById("filter-class").value;
            const filterGrade = document.getElementById("filter-grade").value;
            
            // Filter students
            let filteredStudents = students.filter(student => {
                const matchesSearch = student.name.toLowerCase().includes(searchTerm);
                const matchesClass = filterClass ? student.class === filterClass : true;
                const matchesGrade = filterGrade ? getGrade(student.score) === filterGrade : true;
                return matchesSearch && matchesClass && matchesGrade;
            });
            
            if (filteredStudents.length === 0) {
                container.innerHTML = "<p>No students found matching the filters.</p>";
                return;
            }
            
            let html = "";
            filteredStudents.forEach(student => {
                const grade = getGrade(student.score);
                html += `
                    <div class="student-container">
                        <div class="student-info">
                            <span class="student-name">${student.name}</span> - ${student.class}
                            <span class="student-score grade-${grade}">
                                ${student.score}/100 (${grade})
                            </span>
                        </div>
                        <div class="student-actions">
                            <button class="btn-edit btn-small" onclick="openEditModal(${student.id})">Edit</button>
                            <button class="btn-delete btn-small" onclick="openDeleteModal(${student.id}, '${student.name}')">Delete</button>
                        </div>
                    </div>
                `;
            });
            
            container.innerHTML = html;
        }

        // Function to render students by class
        function renderStudentsByClass() {
            const container = document.getElementById("class-container");
            
            if (students.length === 0) {
                container.innerHTML = "<p>No students added yet.</p>";
                return;
            }
            
            // Group students by class
            const classesList = [...new Set(students.map(student => student.class))].sort();
            
            let html = "";
            classesList.forEach(className => {
                const classStudents = students.filter(student => student.class === className);
                
                html += `
                    <div class="panel">
                        <h3>${className}</h3>
                `;
                
                classStudents.forEach(student => {
                    const grade = getGrade(student.score);
                    html += `
                        <div class="student-container">
                            <div class="student-info">
                                <span class="student-name">${student.name}</span>
                                <span class="student-score grade-${grade}">
                                    ${student.score}/100 (${grade})
                                </span>
                            </div>
                            <div class="student-actions">
                                <button class="btn-edit btn-small" onclick="openEditModal(${student.id})">Edit</button>
                                <button class="btn-delete btn-small" onclick="openDeleteModal(${student.id}, '${student.name}')">Delete</button>
                            </div>
                        </div>
                    `;
                });
                
                html += `</div>`;
            });
            
            container.innerHTML = html;
        }

        // Function to render students by grade
        function renderStudentsByGrade() {
            const container = document.getElementById("grade-container");
            
            if (students.length === 0) {
                container.innerHTML = "<p>No students added yet.</p>";
                return;
            }
            
            // Define grades
            const grades = ["A", "B", "C", "D", "F"];
            
            let html = "";
            grades.forEach(grade => {
                const gradeStudents = students.filter(student => getGrade(student.score) === grade);
                
                if (gradeStudents.length > 0) {
                    html += `
                        <div class="panel">
                            <h3 class="grade-${grade}">Grade ${grade}</h3>
                    `;
                    
                    gradeStudents.forEach(student => {
                        html += `
                            <div class="student-container">
                                <div class="student-info">
                                    <span class="student-name">${student.name}</span> - ${student.class}
                                    <span class="student-score grade-${grade}">
                                        ${student.score}/100
                                    </span>
                                </div>
                                <div class="student-actions">
                                    <button class="btn-edit btn-small" onclick="openEditModal(${student.id})">Edit</button>
                                    <button class="btn-delete btn-small" onclick="openDeleteModal(${student.id}, '${student.name}')">Delete</button>
                                </div>
                            </div>
                        `;
                    });
                    
                    html += `</div>`;
                }
            });
            
            container.innerHTML = html;
        }

        // Function to open edit modal
        function openEditModal(id) {
            const student = students.find(s => s.id === id);
            if (!student) return;
            
            document.getElementById("edit-id").value = student.id;
            document.getElementById("edit-name").value = student.name;
            document.getElementById("edit-class").value = student.class;
            document.getElementById("edit-score").value = student.score;
            
            document.getElementById("edit-modal").style.display = "block";
        }

        // Function to save edited student
        function saveEditedStudent() {
            if (!validateForm("edit-name", "edit-class", "edit-score", "edit-name-error", "edit-class-error", "edit-score-error")) return;
            
            const id = parseInt(document.getElementById("edit-id").value);
            const name = document.getElementById("edit-name").value.trim();
            const studentClass = document.getElementById("edit-class").value;
            const score = parseInt(document.getElementById("edit-score").value);
            
            // Find and update student
            const index = students.findIndex(s => s.id === id);
            if (index !== -1) {
                students[index] = {
                    id: id,
                    name: name,
                    class: studentClass,
                    score: score
                };
                
                // Save to localStorage
                saveToLocalStorage();
                
                // Close modal
                document.getElementById("edit-modal").style.display = "none";
                
                // Re-render all displays
                renderAll();
                updateStats();
                
                // Show alert
                alert(`Student "${name}" has been updated successfully!`);
            }
        }

        // Function to open delete modal
        function openDeleteModal(id, name) {
            document.getElementById("delete-id").value = id;
            document.getElementById("delete-student-name").textContent = name;
            document.getElementById("delete-modal").style.display = "block";
        }

        // Function to delete student
        function deleteStudent() {
            const id = parseInt(document.getElementById("delete-id").value);
            
            // Find student
            const index = students.findIndex(s => s.id === id);
            if (index !== -1) {
                const name = students[index].name;
                
                // Remove student
                students.splice(index, 1);
                
                // Save to localStorage
                saveToLocalStorage();
                
                // Close modal
                document.getElementById("delete-modal").style.display = "none";
                
                // Re-render all displays
                renderAll();
                updateStats();
                
                // Show alert
                alert(`Student "${name}" has been deleted successfully!`);
            }
        }

        // Update statistics
        function updateStats() {
            const totalStudents = students.length;
            document.getElementById("total-students").textContent = totalStudents;
            
            if (totalStudents > 0) {
                const totalScore = students.reduce((sum, student) => sum + student.score, 0);
                const averageScore = Math.round(totalScore / totalStudents);
                const highestScore = Math.max(...students.map(s => s.score));
                
                document.getElementById("average-score").textContent = averageScore;
                document.getElementById("highest-score").textContent = highestScore;
            } else {
                document.getElementById("average-score").textContent = "0";
                document.getElementById("highest-score").textContent = "0";
            }
        }

        // Render all displays
        function renderAll() {
            renderAllStudents();
            renderStudentsByClass();
            renderStudentsByGrade();
        }

        // Tab functionality
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Remove active class from all tabs
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                // Add active class to clicked tab
                tab.classList.add('active');
                
                // Hide all tab content
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                // Show the selected tab content
                document.getElementById(tab.dataset.tab).classList.add('active');
            });
        });

        // Modal close buttons
        document.querySelectorAll('.close-modal').forEach(closeBtn => {
            closeBtn.addEventListener('click', () => {
                document.querySelectorAll('.modal').forEach(modal => {
                    modal.style.display = 'none';
                });
            });
        });

        // Event Listeners
        document.addEventListener('DOMContentLoaded', function() {
            // Add student
            document.getElementById("add-student").addEventListener("click", addStudent);
            
            // Reset form
            document.getElementById("reset-form").addEventListener("click", resetForm);
            
            // Search and filters
            document.getElementById("search-student").addEventListener("input", renderAllStudents);
            document.getElementById("filter-class").addEventListener("change", renderAllStudents);
            document.getElementById("filter-grade").addEventListener("change", renderAllStudents);
            document.getElementById("clear-filters").addEventListener("click", function() {
                document.getElementById("search-student").value = "";
                document.getElementById("filter-class").value = "";
                document.getElementById("filter-grade").value = "";
                renderAllStudents();
            });
            
            // Save edit
            document.getElementById("save-edit").addEventListener("click", saveEditedStudent);
            document.getElementById("cancel-edit").addEventListener("click", function() {
                document.getElementById("edit-modal").style.display = "none";
            });
            
            // Confirm delete
            document.getElementById("confirm-delete").addEventListener("click", deleteStudent);
            document.getElementById("cancel-delete").addEventListener("click", function() {
                document.getElementById("delete-modal").style.display = "none";
            });
            
            // When clicking outside of a modal, close it
            window.addEventListener("click", function(event) {
                document.querySelectorAll('.modal').forEach(modal => {
                    if (event.target === modal) {
                        modal.style.display = "none";
                    }
                });
            });
            
            // Load saved data
            loadFromLocalStorage();
        });

        // Make functions globally accessible for onclick events
        window.openEditModal = openEditModal;
        window.openDeleteModal = openDeleteModal;