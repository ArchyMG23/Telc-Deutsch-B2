const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');
code = code.replace(
  '  onSelectExercise: (id: string) => void;\n}',
  '  onSelectExercise: (id: string) => void;\n  submissions?: any[];\n}'
);
code = code.replace(
  '  onSelectExercise,\n}: StudentDashboardProps) {',
  '  onSelectExercise,\n  submissions = []\n}: StudentDashboardProps) {'
);
fs.writeFileSync('src/components/StudentDashboard.tsx', code);
