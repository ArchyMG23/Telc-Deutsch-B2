const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const oldExercisesTab = `{activeTab === 'exercises' && (
        <div className="flex flex-col gap-8 h-full">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden p-6">
             <UploadSection onUpload={onUpload} isExtracting={isExtracting} isOnline={isOnline} />
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex-1 overflow-y-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Titre</th>
                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Type</th>
                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {exercises.map(ex => (
                    <tr key={ex.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-semibold">{ex.title}</td>
                      <td className="p-4 text-gray-500">{ex.type}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => {
                          if (confirm("Supprimer cet exercice ?")) {
                            deleteExercise(ex.id);
                          }
                        }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
        </div>
      )}`;

const newExercisesTab = `{activeTab === 'exercises' && (
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          {/* Upload Section */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm">
             <UploadSection onUpload={onUpload} isExtracting={isExtracting} isOnline={isOnline} />
          </div>

          {/* Exercises List */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex-1">
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                 <BookOpen className="w-5 h-5 text-[#FF0000]" />
                 Sujets disponibles ({exercises.length})
               </h2>
             </div>
             
             {exercises.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {exercises.map(ex => (
                   <div key={ex.id} className="group bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-5 hover:border-[#FF0000] hover:shadow-md transition-all flex flex-col h-[160px]">
                     <div className="flex justify-between items-start mb-3">
                       <span className="px-2.5 py-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-md capitalize shadow-sm">
                         {ex.type}
                       </span>
                       <button 
                         onClick={() => {
                           if (confirm("Supprimer cet exercice ?")) {
                             deleteExercise(ex.id);
                           }
                         }} 
                         className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                         title="Supprimer le sujet"
                       >
                         <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                     <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-[#FF0000] transition-colors mb-2">
                       {ex.title}
                     </h3>
                     <div className="mt-auto text-xs text-gray-500 font-medium">
                       Niveau : B2 Telc
                     </div>
                   </div>
                 ))}
               </div>
             ) : (
               <div className="py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/30">
                 <BookOpen className="w-10 h-10 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                 <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Aucun sujet n'a encore été ajouté.</p>
               </div>
             )}
          </div>
        </div>
      )}`;

code = code.replace(oldExercisesTab, newExercisesTab);
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
