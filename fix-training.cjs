const fs = require('fs');
let code = fs.readFileSync('src/components/TrainingInterface.tsx', 'utf-8');

const dropdownStr = `                            {/* Teacher Dropdown */}
              <div className="relative group">
                <button 
                  disabled={isSubmitting || teachers.length === 0}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Enseignant</span>
                  <span className="inline sm:hidden">Prof</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                   <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                     <p className="text-[10px] font-bold text-gray-400 uppercase px-2">Choisir un prof</p>
                   </div>
                   <div className="p-1 max-h-60 overflow-y-auto w-full">
                     {teachers.map(t => (
                       <button
                         key={t.uid}
                         disabled={t.uid === lastTeacherId}
                         onClick={() => handleSendToTeacher(t.uid)}
                         className="w-full text-left p-2 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between disabled:opacity-30"
                       >
                         <span className="truncate pr-2">{t.displayName || 'Prof sans nom'}</span>
                         {t.uid === lastTeacherId && <span className="text-[8px] text-red-500 shrink-0">Dernier</span>}
                       </button>
                     ))}
                     {teachers.length === 0 && <p className="p-4 text-xs text-gray-500 text-center">Aucun prof dispo</p>}
                   </div>
                </div>
              </div>`;

const newButtonStr = `
              <button 
                onClick={() => handleSendToTeacher('')}
                disabled={isSubmitting || text.trim().length === 0}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Envoyer aux correcteurs</span>
                <span className="inline sm:hidden">Correcteurs</span>
              </button>
`;

code = code.replace(dropdownStr, newButtonStr);

code = code.replace(
  `  const handleSendToTeacher = async (teacherId: string) => {
    if (!user) return;
    if (teacherId === lastTeacherId) {
       alert("Vous ne pouvez pas choisir le même enseignant deux fois de suite.");
       return;
    }

    setIsSubmitting(true);
    try {
      await submitExercise({
        studentId: user.uid,
        teacherId,
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        text,
        status: 'pending'
      });
      alert("Travail envoyé à l'enseignant !");`,
  `  const handleSendToTeacher = async (_: string) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await submitExercise({
        studentId: user.uid,
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        text,
        status: 'soumis'
      });
      alert("Travail envoyé aux correcteurs !");`
);

fs.writeFileSync('src/components/TrainingInterface.tsx', code);
