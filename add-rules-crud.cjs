const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const replacement = `
      {activeTab === 'rules' && (
        <div className="flex flex-col gap-8 h-full">
           <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden p-6">
              <h2 className="text-xl font-bold mb-4">Grilles d'évaluation</h2>
              <p className="text-gray-500 mb-4 text-sm">Gérez les critères et pondérations pour les corrections manuelles et IA.</p>
              
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-100 rounded-xl border border-indigo-100 dark:border-indigo-800/30">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold">Telc B2 Standard (Active)</h3>
                      <p className="text-xs opacity-80">Version 1.0 - 100 points maximum</p>
                    </div>
                    <span className="px-2 py-1 bg-green-500 text-white text-[10px] font-bold rounded-full uppercase tracking-wider">Par défaut</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-sm text-center">
                    <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded"><strong className="block">Grammaire</strong> 30 pts</div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded"><strong className="block">Vocabulaire</strong> 30 pts</div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded"><strong className="block">Structure</strong> 20 pts</div>
                    <div className="bg-white/50 dark:bg-gray-800/50 p-2 rounded"><strong className="block">Connecteurs</strong> 20 pts</div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 opacity-50 cursor-not-allowed">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold">Goethe B2 Zertifikat (Désactivée)</h3>
                      <p className="text-xs">Bientôt disponible</p>
                    </div>
                  </div>
                </div>

                <button className="py-3 px-4 border border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  + Créer une nouvelle grille
                </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
`;
code = code.replace(/      \{activeTab === 'rules' && \([\s\S]*?\}\)[\s\S]*?<\/div>\n  \);\n}/, replacement);
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
