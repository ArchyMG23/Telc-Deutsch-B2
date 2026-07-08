const fs = require('fs');

// 1. Fix App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
app = app.replace(/<'student' \| 'teacher'>/g, "<'student' | 'admin'>");
app = app.replace(/emailRole === 'teacher'/g, "emailRole === 'admin'");
app = app.replace(/teacherCode/g, "adminCode");
app = app.replace(/setTeacherCode/g, "setAdminCode");
app = app.replace(/B2PROF/g, "B2ADMIN");
fs.writeFileSync('src/App.tsx', app);

// 2. Fix TeacherDashboard.tsx
let td = fs.readFileSync('src/components/TeacherDashboard.tsx', 'utf-8');
td = td.replace(/status === 'corrected'/g, "status === 'corrige'");
td = td.replace(/status !== 'corrected'/g, "status !== 'corrige'");
fs.writeFileSync('src/components/TeacherDashboard.tsx', td);

// 3. Fix TrainingInterface.tsx
let ti = fs.readFileSync('src/components/TrainingInterface.tsx', 'utf-8');
// I missed `submitToTeacher` in `handleSendToAdmins` perhaps?
// Ah wait, I didn't successfully replace handleSendToTeacher with handleSendToAdmins or something?
// Let me just replace `submitToTeacher` with `submitExercise` again just in case.
ti = ti.replace(/submitToTeacher/g, "submitExercise");
fs.writeFileSync('src/components/TrainingInterface.tsx', ti);

