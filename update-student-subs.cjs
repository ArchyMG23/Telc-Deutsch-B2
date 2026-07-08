const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');

code = code.replace(
  '{submissions.length > 0 && (',
  '{true && ('
);

fs.writeFileSync('src/components/StudentDashboard.tsx', code);
