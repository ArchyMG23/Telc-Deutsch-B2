const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

const replacement = `
      {activeTab === 'rules' && (
        <div className="flex flex-col gap-8 h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden p-6">
           <h2 className="text-xl font-bold mb-4">Grilles d'évaluation</h2>
           <p className="text-gray-500 mb-4">La personnalisation complète des grilles d'évaluation et la pondération des critères sera disponible prochainement.</p>
           <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-lg">
             <strong>Grille active :</strong> Telc B2 Standard (Grammaire, Vocabulaire, Structure, Connecteurs) - 100 points maximum.
           </div>
        </div>
      )}
    </div>
  );
}
`;
code = code.replace(/      \{activeTab === 'rules' && \([\s\S]*?\}\)[\s\S]*?<\/div>\n  \);\n}/, replacement);
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
