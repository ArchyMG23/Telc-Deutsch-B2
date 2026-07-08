const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');

code = code.replace(
  '  onSelectExercise,\n}: StudentDashboardProps) {',
  '  onSelectExercise,\n  submissions = []\n}: StudentDashboardProps) {'
);
fs.writeFileSync('src/components/StudentDashboard.tsx', code);
