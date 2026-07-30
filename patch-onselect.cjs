const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// 1. Add PenTool to imports
code = code.replace(
  "import { Users, BookOpen, Settings, Trash2 , Plus, X, Eye, GraduationCap} from 'lucide-react';",
  "import { Users, BookOpen, Settings, Trash2 , Plus, X, Eye, GraduationCap, PenTool} from 'lucide-react';"
);

// 2. Add onSelectExercise to Props
code = code.replace(
  "deleteExercise: (id: string) => Promise<void>;\n}",
  "deleteExercise: (id: string) => Promise<void>;\n  onSelectExercise?: (id: string) => void;\n}"
);

// 3. Add to destructured props
code = code.replace(
  "export function AdminDashboard({ exercises, onUpload, isExtracting, isOnline, deleteExercise }: AdminDashboardProps) {",
  "export function AdminDashboard({ exercises, onUpload, isExtracting, isOnline, deleteExercise, onSelectExercise }: AdminDashboardProps) {"
);

// 4. Add the button
const buttonTarget = `                      <td className="p-4 text-right flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button onClick={(e) => {
                          e.stopPropagation();`;
const buttonReplacement = `                      <td className="p-4 text-right flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {onSelectExercise && (
                          <button onClick={(e) => {
                            e.stopPropagation();
                            onSelectExercise(ex.id);
                          }} className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg" title="Traiter l'exercice">
                            <PenTool className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={(e) => {
                          e.stopPropagation();`;
code = code.replace(buttonTarget, buttonReplacement);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
