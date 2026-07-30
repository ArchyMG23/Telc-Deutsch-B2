const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const newTbody = `                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {exercises.map(ex => (
                    <tr 
                      key={ex.id}
                      onClick={() => setPreviewExerciseId(ex.id)}
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
                  ))}
                </tbody>`;

const oldTbodyRegex = /<tbody className="divide-y divide-gray-200 dark:divide-gray-800">\s*\{exercises\.map\(ex => \(\s*<React\.Fragment.*?<\/React\.Fragment>\s*\)\)\}\s*<\/tbody>/s;
code = code.replace(oldTbodyRegex, newTbody);

const activeTabExercisesEnd = `          </div>
        </div>
      )}

      {activeTab === 'rules'`;

const activeTabExercisesEndNew = `          </div>
          
          {/* Modal Preview */}
          {previewExerciseId && exercises.find(e => e.id === previewExerciseId) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#FF0000]" />
                    {exercises.find(e => e.id === previewExerciseId)?.title}
                  </h2>
                  <button onClick={() => setPreviewExerciseId(null)} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
                  <div>
                    <h4 className="font-bold text-sm uppercase text-[#FF0000] mb-2 tracking-wide">Situation / Offre</h4>
                    <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-base text-gray-800 dark:text-gray-200 leading-relaxed shadow-sm">
                      {exercises.find(e => e.id === previewExerciseId)?.situation}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm uppercase text-[#FF0000] mb-2 tracking-wide">Consigne</h4>
                    <div className="p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-base text-gray-800 dark:text-gray-200 leading-relaxed shadow-sm">
                      {exercises.find(e => e.id === previewExerciseId)?.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'rules'`;

code = code.replace(activeTabExercisesEnd, activeTabExercisesEndNew);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
