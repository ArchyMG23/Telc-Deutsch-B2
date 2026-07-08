const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherDashboard.tsx', 'utf-8');

// remove where clause so admin sees all
code = code.replace(
  "where('teacherId', '==', auth.currentUser.uid),",
  "// where removed so admins see all submitted exercises"
);

// update status map
code = code.replace(/status === 'corrected'/g, "status === 'corrige'");
code = code.replace(/status === 'submitted'/g, "status === 'soumis'");
code = code.replace(/status: 'corrected'/g, "status: 'corrige'");
code = code.replace(/status: 'submitted'/g, "status: 'soumis'");

// When admin saves a correction, trace them:
code = code.replace(
  "status: 'corrige',",
  "status: 'corrige',\n        corrected_by_admin_id: auth.currentUser?.uid,"
);

fs.writeFileSync('src/components/TeacherDashboard.tsx', code);
