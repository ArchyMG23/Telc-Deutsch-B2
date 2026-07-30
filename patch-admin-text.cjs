const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

code = code.replace(
  /whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed/g,
  'whitespace-pre-wrap text-base text-gray-800 dark:text-gray-200 leading-relaxed'
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
