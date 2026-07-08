const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const renderStart = code.indexOf('return (');
if (renderStart === -1) throw new Error("Could not find return (");

const topPart = code.substring(0, renderStart);

const newRender = `return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white font-sans overflow-hidden">
      {/* Global Header */}
      <header className="h-16 shrink-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 sm:px-6 shadow-sm z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#FF0000] flex items-center justify-center text-white font-black text-lg shadow-md">
            T
          </div>
          <h1 className="font-bold text-lg hidden sm:block tracking-tight">Telc Deutsch B2</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {!import.meta.env.VITE_GEMINI_API_KEY ? (
             <div className="hidden sm:flex px-2 py-1 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded text-[10px] text-red-700 dark:text-red-400 items-center gap-1 font-bold">
               <WifiOff className="w-3 h-3" /> Clé API manquante
             </div>
          ) : (
             <div className="hidden sm:flex px-2 py-1 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded text-[10px] text-green-600 dark:text-green-400 items-center gap-1 font-bold">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> IA Connectée
             </div>
          )}

          <button 
            onClick={() => setIsExercisesModalOpen(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold text-xs sm:text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center gap-2 border border-indigo-200 dark:border-indigo-800 shadow-sm"
          >
            <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">Sujets & Épreuves</span><span className="sm:hidden">Épreuves</span>
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-xs font-bold">{user?.displayName || 'Utilisateur'}</span>
              <span className="text-[9px] text-gray-500">{userProfile?.role === 'super_admin' ? 'Super Admin' : userProfile?.role === 'admin' ? 'Admin' : 'Étudiant'}</span>
            </div>
            
            <button 
              onClick={logout}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              title="Se déconnecter"
            >
              <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
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
              isOnline={isOnline}
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              teachers={teachers}
              user={user}
              lastTeacherId={userProfile?.lastTeacherId}
              onExit={() => selectExercise(null)}
            />
          ) : (
            <StudentDashboard exercises={sortedExercises} progress={progress} user={user} userProfile={userProfile} onSelectExercise={(id) => selectExercise(id)} submissions={submissions} />
          )}
        </div>
      </main>

      {/* Exercises Modal Overlay */}
      {isExercisesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-full flex flex-col overflow-hidden border border-gray-200 dark:border-gray-800">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-900/50">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#FF0000]" /> 
                Sélectionner une épreuve
              </h2>
              <button 
                onClick={() => setIsExercisesModalOpen(false)}
                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-gray-50 dark:bg-gray-950">
              {/* Toolbar in Modal */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Rechercher un sujet..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm"
                  />
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setIsExercisesModalOpen(false);
                      selectExercise(null, true);
                    }}
                    disabled={!isOnline || (userProfile?.role !== 'super_admin' && userProfile?.role !== 'admin')}
                    className={\`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-white rounded-xl transition-colors font-medium text-sm shadow-sm \${(userProfile?.role === 'super_admin' || userProfile?.role === 'admin') ? 'bg-gray-900 dark:bg-gray-700 hover:bg-gray-800 dark:hover:bg-gray-600' : 'hidden'}\`}
                  >
                    <Plus className="w-4 h-4" />
                    Ajouter
                  </button>
                  
                  {/* Admin actions inside modal */}
                  {userProfile?.role === 'super_admin' && (
                    <button 
                      onClick={() => {
                        setIsExercisesModalOpen(false);
                        setIsUploading(false);
                        selectExercise(null);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl transition-colors font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" /> Dashboard
                    </button>
                  )}
                  {userProfile?.role === 'admin' && (
                    <button 
                      onClick={() => {
                        setIsExercisesModalOpen(false);
                        setIsUploading(false);
                        selectExercise(null);
                      }}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl transition-colors font-medium text-sm hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm"
                    >
                      <ShieldCheck className="w-4 h-4" /> Dashboard Prof
                    </button>
                  )}
                </div>
              </div>

              {/* Grid of exercises */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredExercises.map(ex => {
                  const prog = progress[ex.id];
                  const isDone = !!prog?.evaluation;
                  const hasStarted = !!prog?.text;
                  const isSelected = selectedId === ex.id && !isUploading;
                  
                  return (
                    <div
                      key={ex.id}
                      onClick={() => {
                        selectExercise(ex.id);
                        setIsExercisesModalOpen(false);
                      }}
                      className={\`group cursor-pointer relative bg-white dark:bg-gray-900 border rounded-2xl p-5 transition-all duration-200 hover:shadow-md \${isSelected ? 'border-[#FF0000] ring-1 ring-[#FF0000]' : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'}\`}
                    >
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight line-clamp-2">
                          {ex.title}
                        </h3>
                        <div className="shrink-0 flex items-center">
                          {isDone ? (
                            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-full">
                              <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                          ) : hasStarted ? (
                            <div className="bg-orange-100 dark:bg-orange-900/30 p-1.5 rounded-full">
                              <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            </div>
                          ) : null}
                        </div>
                      </div>
                      
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-1 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-700 inline-block" />
                        {ex.type}
                      </p>
                      
                      <div className="mt-auto">
                        <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                          <div 
                            className={\`h-full transition-all duration-500 \${isDone ? 'w-full bg-green-500' : hasStarted ? 'w-1/2 bg-orange-500' : 'w-0'}\`}
                          />
                        </div>
                      </div>

                      {(userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Supprimer cet exercice pour tout le monde ?")) {
                              deleteDoc(doc(db, "exercises", ex.id));
                            }
                          }}
                          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 bg-white dark:bg-gray-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 transition-all"
                          title="Supprimer l'exercice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredExercises.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <BookOpen className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-4" />
                  <p className="text-lg font-medium text-gray-500">
                    {sortedExercises.length === 0 ? "Aucun exercice sauvegardé." : "Aucun sujet trouvé."}
                  </p>
                </div>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 flex justify-between items-center text-xs text-gray-500">
               <span>{filteredExercises.length} épreuves disponibles</span>
               
               {/* Role Switcher in modal footer if admin/student */}
               <div className="flex items-center gap-2">
                 {userProfile?.role === 'admin' ? (
                   <button 
                     onClick={() => user && updateUserRole(user.uid, 'student')}
                     className="py-1 px-3 rounded-lg font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-[#FF0000] hover:border-[#FF0000] transition-colors flex items-center gap-1.5"
                   >
                     <Users className="w-3.5 h-3.5" /> Vue Étudiant
                   </button>
                 ) : userProfile?.role === 'student' ? (
                   <button
                     onClick={() => {
                       if (user) {
                         const code = prompt("Code d'accès enseignant :");
                         if (code && code.trim().toUpperCase() === "B2ADMIN") {
                           updateUserRole(user.uid, 'admin');
                           alert("Rôle Admin activé !");
                         }
                       }
                     }}
                     className="py-1 px-2 font-medium text-gray-400 hover:text-indigo-500 transition-colors"
                   >
                     Déverrouiller Admin
                   </button>
                 ) : null}
               </div>
            </div>
          </div>
        </div>
      )}
      
      <InstallPWA />
    </div>
  );
}`;

fs.writeFileSync('src/App.tsx', topPart + newRender);
