const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

code = code.replace(
  "import { Users, BookOpen, Settings, Trash2 , Plus, X} from 'lucide-react';",
  "import { Users, BookOpen, Settings, Trash2 , Plus, X, Eye} from 'lucide-react';"
);

code = code.replace(
  "const [isResetting, setIsResetting] = useState(false);",
  "const [isResetting, setIsResetting] = useState(false);\n  const [previewExerciseId, setPreviewExerciseId] = useState<string | null>(null);"
);

const newTbody = `                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {exercises.map(ex => (
                    <React.Fragment key={ex.id}>
                      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="p-4 font-semibold">{ex.title}</td>
                        <td className="p-4 text-gray-500">{ex.type}</td>
                        <td className="p-4 text-right flex justify-end gap-2">
                          <button onClick={() => setPreviewExerciseId(previewExerciseId === ex.id ? null : ex.id)} className="p-2 text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button onClick={() => {
                            if (confirm("Supprimer cet exercice ?")) {
                              deleteExercise(ex.id);
                            }
                          }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                      {previewExerciseId === ex.id && (
                        <tr className="bg-gray-50 dark:bg-gray-800/30">
                          <td colSpan={3} className="p-6">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-bold text-xs uppercase text-gray-500 mb-1">Situation / Offre</h4>
                                <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-sm">
                                  {ex.situation}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-xs uppercase text-gray-500 mb-1">Consigne</h4>
                                <div className="p-3 bg-white dark:bg-gray-900 rounded border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-sm">
                                  {ex.content}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>`;

const oldTbodyRegex = /<tbody className="divide-y divide-gray-200 dark:divide-gray-800">\s*\{exercises\.map\(ex => \(\s*<tr key=\{ex\.id\}.*?<\/tr>\s*\)\)\}\s*<\/tbody>/s;
code = code.replace(oldTbodyRegex, newTbody);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
