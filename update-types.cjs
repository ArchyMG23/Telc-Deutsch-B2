const fs = require('fs');
let code = fs.readFileSync('src/types.ts', 'utf-8');
code = code.replace(
  "export type UserRole = 'student' | 'teacher' | 'admin';",
  "export type UserRole = 'student' | 'admin' | 'super_admin';"
);

code = code.replace(
  "export interface Submission {\n  id: string;\n  exerciseId: string;\n  studentId: string;\n  teacherId?: string;\n  text: string;\n  status: 'draft' | 'submitted' | 'corrected';\n  submittedAt?: any;\n  createdAt: any;\n}",
  `export interface Submission {
  id: string;
  exerciseId: string;
  exerciseTitle?: string;
  studentId: string;
  studentName?: string;
  corrected_by_admin_id?: string;
  text: string;
  status: 'en_cours' | 'soumis' | 'corrige';
  submittedAt?: any;
  createdAt: any;
}`
);

fs.writeFileSync('src/types.ts', code);
