const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');

const modalUI = `
  const [selectedSub, setSelectedSub] = useState<any>(null);

  if (selectedSub) {
    return (
      <div className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950/20 p-6 sm:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <button 
            onClick={() => setSelectedSub(null)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowRight className="w-4 h-4 rotate-180" /> Retour au tableau de bord
          </button>
          
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="text-2xl font-bold mb-2">{selectedSub.exerciseTitle}</h2>
            <div className="flex gap-2 mb-6">
              <span className={\`px-2 py-1 rounded-full text-xs font-bold \${
                selectedSub.status === 'corrected' ? 'bg-green-100 text-green-700' :
                'bg-orange-100 text-orange-700'
              }\`}>
                {selectedSub.status === 'corrected' ? 'Corrigé par le professeur' : 'En attente de correction'}
              </span>
            </div>

            {selectedSub.status === 'corrected' && selectedSub.correction ? (
              <div className="space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Grammaire</p>
                    <p className="text-xl font-bold">{selectedSub.correction.grammarScore}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Vocabulaire</p>
                    <p className="text-xl font-bold">{selectedSub.correction.vocabularyScore}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Structure</p>
                    <p className="text-xl font-bold">{selectedSub.correction.structureScore}</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[#FF0000]/20">
                    <p className="text-[10px] uppercase text-[#FF0000] font-bold">Total</p>
                    <p className="text-xl font-bold text-[#FF0000]">{selectedSub.correction.score}/100</p>
                  </div>
                </div>

                {selectedSub.correction.overallFeedback && (
                  <div>
                    <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Commentaire du professeur</h3>
                    <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 text-indigo-900 dark:text-indigo-200 rounded-xl text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedSub.correction.overallFeedback}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Copie corrigée</h3>
                  <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm leading-relaxed whitespace-pre-wrap font-mono">
                    {selectedSub.correction.highlightedText}
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="font-bold mb-2 text-gray-900 dark:text-white">Votre copie</h3>
                <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-xl text-sm leading-relaxed whitespace-pre-wrap font-mono">
                  {selectedSub.text}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
`;

code = code.replace(/  const totalExercises = exercises\.length;/, modalUI + '\n  const totalExercises = exercises.length;');

const submissionsUI = `
        {/* Submissions Section */}
        {submissions.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-500" />
                Mes copies envoyées ({submissions.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {submissions.map(sub => (
                <div 
                  key={sub.id}
                  onClick={() => setSelectedSub(sub)}
                  className="p-5 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className={\`px-2 py-0.5 text-[9px] font-bold rounded-full \${
                      sub.status === 'corrected' 
                        ? 'bg-green-50 text-green-600 border border-green-200' 
                        : 'bg-orange-50 text-orange-600 border border-orange-200'
                    }\`}>
                      {sub.status === 'corrected' ? 'Corrigé' : 'En attente'}
                    </span>
                    {sub.status === 'corrected' && sub.correction && (
                      <span className="text-xs font-bold text-green-600">
                        {sub.correction.score}/100
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-sm group-hover:text-indigo-500 transition-colors truncate">
                    {sub.exerciseTitle}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}
`;

code = code.replace(/        \{\/\* All Exercises Section \*\/\}/, submissionsUI + '\n        {/* All Exercises Section */}');

fs.writeFileSync('src/components/StudentDashboard.tsx', code);
