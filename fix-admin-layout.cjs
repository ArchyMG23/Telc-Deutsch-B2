const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// I need to add state for showing upload section
if (!code.includes('const [showUpload, setShowUpload] = useState(false);')) {
  code = code.replace(
    "const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);",
    "const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);\n  const [showUpload, setShowUpload] = useState(false);"
  );
}

// Ensure Plus is imported from lucide-react
const lucideImportsMatch = code.match(/import \{([^}]+)\} from 'lucide-react';/);
if (lucideImportsMatch) {
  let imports = lucideImportsMatch[1];
  if (!imports.includes('Plus')) imports += ', Plus';
  if (!imports.includes('X')) imports += ', X';
  code = code.replace(lucideImportsMatch[0], `import {${imports}} from 'lucide-react';`);
}

const oldExercisesTab = `{activeTab === 'exercises' && (
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
             </div>`;

const newExercisesTab = `{activeTab === 'exercises' && (
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          {/* Top Actions */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-[#FF0000]" />
                Sujets d'entraînement
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Gérez les sujets disponibles pour les étudiants.</p>
            </div>
            
            <button
              onClick={() => setShowUpload(!showUpload)}
              className="bg-[#FF0000] hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold text-sm transition-colors flex items-center gap-2 shadow-sm"
            >
              {showUpload ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              {showUpload ? "Fermer" : "Nouveau sujet"}
            </button>
          </div>

          {/* Upload Section */}
          {showUpload && (
            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm animate-in fade-in slide-in-from-top-4 duration-300">
               <UploadSection 
                 onUpload={(data, type) => {
                   onUpload(data, type);
                   setShowUpload(false);
                 }} 
                 isExtracting={isExtracting} 
                 isOnline={isOnline} 
               />
            </div>
          )}

          {/* Exercises List */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm flex-1">
             <div className="flex items-center justify-between mb-6">
               <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                 Tous les sujets ({exercises.length})
               </h3>
             </div>`;

code = code.replace(oldExercisesTab, newExercisesTab);
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
