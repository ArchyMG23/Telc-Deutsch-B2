const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');

code = code.replace(/selectedSub\.status === 'corrected'/g, "selectedSub.status === 'corrige'");

fs.writeFileSync('src/components/StudentDashboard.tsx', code);
