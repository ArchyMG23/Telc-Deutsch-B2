const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const newTbody = `                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {exercises.map(ex => (
                    <React.Fragment key={ex.id}>
                      <tr 
                        onClick={() => setPreviewExerciseId(previewExerciseId === ex.id ? null : ex.id)}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                      >
                        <td className="p-4 font-semibold">
                          <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-gray-400" />
                            {ex.title}
                          </div>
                        </td>
                        <td className="p-4 text-gray-500">{ex.type}</td>
                        <td className="p-4 text-right flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button onClick={(e) => {
                            e.stopPropagation();
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
                                <h4 className="font-bold text-xs uppercase text-[#FF0000] mb-1">Situation / Offre</h4>
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                                  {ex.situation}
                                </div>
                              </div>
                              <div>
                                <h4 className="font-bold text-xs uppercase text-[#FF0000] mb-1">Consigne</h4>
                                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
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

const oldTbodyRegex = /<tbody className="divide-y divide-gray-200 dark:divide-gray-800">\s*\{exercises\.map\(ex => \(\s*<React\.Fragment.*?<\/React\.Fragment>\s*\)\)\}\s*<\/tbody>/s;
code = code.replace(oldTbodyRegex, newTbody);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
