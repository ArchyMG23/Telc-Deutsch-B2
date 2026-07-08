const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');
code = code.replace(/<div>\s*className="px-4[\s\S]*?<\/div>/g, '');
code = code.replace(/<div>\s*<\/div>/g, '');
fs.writeFileSync('src/components/StudentDashboard.tsx', code);
