const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

code = code.replace(
  "export const submitToTeacher = async (submission: Omit<Submission, 'id' | 'createdAt' | 'updatedAt'>) => {",
  "export const submitExercise = async (submission: any) => {"
);

code = code.replace(
  "      status: 'submitted',",
  "      status: submission.status || 'soumis',"
);

// We can simply search/replace 'submitToTeacher' with 'submitExercise' throughout the codebase.
fs.writeFileSync('src/lib/firebase.ts', code);
