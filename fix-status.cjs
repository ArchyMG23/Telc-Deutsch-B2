const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherDashboard.tsx', 'utf-8');
code = code.replace(/'pending'/g, "'submitted'");
fs.writeFileSync('src/components/TeacherDashboard.tsx', code);

code = fs.readFileSync('firestore.rules', 'utf-8');
code = code.replace(/'pending'/g, "'submitted'");
fs.writeFileSync('firestore.rules', code);
