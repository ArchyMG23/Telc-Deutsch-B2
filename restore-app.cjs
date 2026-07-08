const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Restore the original imports by removing UnifiedDashboard
code = code.replace("import { UnifiedDashboard } from './components/UnifiedDashboard';\n", "");

const startIndex = code.indexOf('{/* Main Content Area */}');
const endIndex = code.indexOf('</main>', startIndex) + 7;

if (startIndex > -1 && endIndex > -1) {
  const replacement = `{/* Main Content Area */}
      <main className="flex-1 min-h-0 overflow-y-auto bg-gray-50 dark:bg-gray-950 relative">
        <div className="h-full">
          {userProfile?.role === 'super_admin' && !isUploading && !selectedExercise ? (
            <SuperAdminDashboardView 
              exercises={exercises} 
              onUpload={handleUpload}
              isExtracting={isExtracting}
              isOnline={isOnline}
              deleteExercise={async (id) => {
                await deleteDoc(doc(db, "exercises", id));
              }}
            />
          ) : userProfile?.role === 'admin' && !isUploading && !selectedExercise ? (
            <AdminDashboardView />
          ) : isUploading ? (
            <div className="h-full flex items-center justify-center">
              <UploadSection onUpload={handleUpload} isExtracting={isExtracting} isOnline={isOnline} />
            </div>
          ) : selectedExercise ? (
            <TrainingInterface
              key={selectedExercise.id}
              exercise={selectedExercise}
              initialText={currentProgress?.text || ''}
              evaluation={currentProgress?.evaluation || null}
              onTextChange={onTextChange}
              onEvaluate={onEvaluate}
              isEvaluating={isEvaluating}
              onClose={() => selectExercise(null, false)}
              isOnline={isOnline}
              onSaveDraft={onSaveDraft}
              userId={user?.uid}
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              teachers={teachers}
              user={user}
              lastTeacherId={userProfile?.lastTeacherId}
            />
          ) : (
            <div className="p-4 sm:p-8 space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-24">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#FF0000]" />
                    Sujets d'entraînement ({exercises.length})
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">Sélectionnez un sujet pour commencer l'épreuve de rédaction.</p>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:flex-initial sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Rechercher un sujet..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF0000] focus:border-transparent"
                    />
                  </div>
                  <button 
                    onClick={() => selectExercise(null, true)}
                    className="p-2 sm:px-4 sm:py-2 bg-[#FF0000] hover:bg-red-650 text-white rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm shrink-0"
                  >
                    <Upload className="w-4 h-4" />
                    <span className="hidden sm:inline">Nouveau sujet</span>
                  </button>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredExercises.map((ex) => (
                  <div 
                    key={ex.id}
                    onClick={() => selectExercise(ex.id)}
                    className="group bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-5 hover:border-[#FF0000] hover:shadow-md transition-all cursor-pointer flex flex-col h-[180px]"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-md capitalize">
                        {ex.type}
                      </span>
                      {progress[ex.id]?.evaluation && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-md">
                          <CheckCircle className="w-3 h-3" /> Terminé
                        </span>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-[#FF0000] transition-colors mb-2">
                      {ex.title}
                    </h3>
                    
                    <div className="mt-auto flex items-center justify-between text-xs text-gray-500">
                      <span>B2 Telc Niveau</span>
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#FF0000]" />
                    </div>
                  </div>
                ))}
                
                {filteredExercises.length === 0 && (
                  <div className="col-span-full py-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-white/50 dark:bg-gray-900/50">
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Aucun sujet trouvé.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>`;

  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code);
}
