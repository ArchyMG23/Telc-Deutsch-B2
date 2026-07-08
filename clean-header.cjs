const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `          <button 
            onClick={() => setIsExercisesModalOpen(true)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 rounded-lg font-bold text-xs sm:text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors flex items-center gap-2 border border-indigo-200 dark:border-indigo-800 shadow-sm"
          >
            <BookOpen className="w-4 h-4" /> <span className="hidden sm:inline">Sujets & Épreuves</span><span className="sm:hidden">Épreuves</span>
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>`;

code = code.replace(target, '');
fs.writeFileSync('src/App.tsx', code);
