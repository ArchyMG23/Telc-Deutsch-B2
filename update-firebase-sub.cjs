const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

code = code.replace(
  "export interface Submission {\n  id: string;\n  studentId: string;\n  teacherId?: string;\n  exerciseId: string;\n  exerciseTitle: string;\n  text: string;\n  status: 'draft' | 'pending' | 'submitted' | 'corrected';\n  correction?: Evaluation & { highlightedText?: string };\n  submittedAt?: any;\n  createdAt: any;\n  updatedAt: any;\n}",
  `export interface Submission {
  id: string;
  studentId: string;
  studentName?: string;
  corrected_by_admin_id?: string;
  exerciseId: string;
  exerciseTitle: string;
  text: string;
  status: 'en_cours' | 'soumis' | 'corrige';
  correction?: any; // The telc evaluation data
  submittedAt?: any;
  createdAt: any;
  updatedAt: any;
}`
);

// We need to also fix submitExercise
// Remove the specific teacherId check and updateDoc inside submitExercise
code = code.replace(
  "        if (submission.teacherId) {\n      await updateDoc(doc(db, 'users', submission.studentId), {\n        lastTeacherId: submission.teacherId,\n        teacherId: submission.teacherId\n      });\n    }",
  ""
);

fs.writeFileSync('src/lib/firebase.ts', code);
