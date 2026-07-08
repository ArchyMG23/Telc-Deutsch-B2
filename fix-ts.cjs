const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');

code = code.replace(
  /  onSelectExercise: \(id: string\) => void;\s+\}/,
  '  onSelectExercise: (id: string) => void;\n  submissions?: any[];\n}'
);
fs.writeFileSync('src/components/StudentDashboard.tsx', code);
