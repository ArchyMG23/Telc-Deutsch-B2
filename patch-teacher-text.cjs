const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherDashboard.tsx', 'utf-8');

code = code.replace(
  /text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed/g,
  'text-base text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed'
);

fs.writeFileSync('src/components/TeacherDashboard.tsx', code);
