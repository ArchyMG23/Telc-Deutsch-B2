const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace(
  /<StudentDashboard\s+exercises=\{sortedExercises\}\s+progress=\{progress\}\s+user=\{user\}\s+userProfile=\{userProfile\}\s+onSelectExercise=\{\(id\) => selectExercise\(id\)\}\s+\/>/g,
  '<StudentDashboard exercises={sortedExercises} progress={progress} user={user} userProfile={userProfile} onSelectExercise={(id) => selectExercise(id)} submissions={submissions} />'
);
fs.writeFileSync('src/App.tsx', code);
