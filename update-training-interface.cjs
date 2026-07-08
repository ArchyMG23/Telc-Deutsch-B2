const fs = require('fs');
let code = fs.readFileSync('src/components/TrainingInterface.tsx', 'utf-8');

// Replace handleSendToTeacher with handleSendToAdmins
code = code.replace(
  "  const handleSendToTeacher = async (teacherId: string) => {\n    if (!user) return;\n    if (teacherId === lastTeacherId) {\n       alert(\"Vous ne pouvez pas choisir le même enseignant deux fois de suite.\");\n       return;\n    }\n    setIsSubmitting(true);\n    try {\n      await submitToTeacher({\n        studentId: user.uid,\n        teacherId,\n        exerciseId: exercise.id,\n        exerciseTitle: exercise.title,\n        text,\n        status: 'pending'\n      });\n      alert(\"Travail envoyé à l'enseignant !\");\n    } catch (e) {\n      console.error(e);\n      alert(\"Erreur lors de l'envoi.\");\n    } finally {\n      setIsSubmitting(false);\n    }\n  };",
  `  const handleSendToAdmins = async () => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await submitExercise({
        studentId: user.uid,
        studentName: user.displayName || 'Élève',
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        text,
        status: 'soumis'
      });
      alert("Votre travail a été envoyé pour correction manuelle !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };`
);

// We need to import submitExercise instead of submitToTeacher
code = code.replace("submitToTeacher", "submitExercise");

// Update the Teacher Dropdown rendering logic to just a simple Submit button
const dropdownStart = "                            {/* Teacher Dropdown */}\n              <div className=\"relative group\">\n                <button \n                  disabled={isSubmitting || teachers.length === 0}\n                  className=\"flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors\"\n                >\n                  <UserCircle className=\"w-4 h-4\" />\n                  <span className=\"hidden sm:inline\">Enseignant</span>\n                  <span className=\"inline sm:hidden\">Prof</span>\n                </button>\n                <div className=\"absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50\">\n                   <div className=\"p-2 border-b border-gray-200 dark:border-gray-700\">\n                     <p className=\"text-[10px] font-bold text-gray-400 uppercase px-2\">Choisir un prof</p>\n                   </div>\n                   <div className=\"p-1 max-h-60 overflow-y-auto w-full\">\n                     {teachers.map(t => (\n                       <button\n                         key={t.uid}\n                         disabled={t.uid === lastTeacherId}\n                         onClick={() => handleSendToTeacher(t.uid)}\n                         className=\"w-full text-left p-2 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between disabled:opacity-30\"\n                       >\n                         <span className=\"truncate pr-2\">{t.displayName || 'Prof sans nom'}</span>\n                         {t.uid === lastTeacherId && <span className=\"text-[8px] text-red-500 shrink-0\">Dernier</span>}\n                       </button>\n                     ))}\n                     {teachers.length === 0 && <p className=\"p-4 text-xs text-gray-500 text-center\">Aucun prof dispo</p>}\n                   </div>\n                </div>\n              </div>";

const newSubmitButton = `                            {/* Submit for Manual Correction */}
              <button 
                onClick={handleSendToAdmins}
                disabled={isSubmitting || text.trim().length === 0}
                className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-lg transition-colors"
              >
                <UserCircle className="w-4 h-4" />
                <span className="hidden sm:inline">Soumettre au correcteur</span>
                <span className="inline sm:hidden">Soumettre</span>
              </button>`;

code = code.replace(dropdownStart, newSubmitButton);

fs.writeFileSync('src/components/TrainingInterface.tsx', code);
