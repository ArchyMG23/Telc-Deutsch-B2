const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

code = code.replace("Grilles d'évaluation (Bientôt)", "Grilles d'évaluation");

const oldRulesTab = `{activeTab === 'rules' && (
        <div className="flex flex-col gap-8 h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden p-6">
           <h2 className="text-xl font-bold mb-4">Grilles d'évaluation</h2>
           <p className="text-gray-500 mb-4">La personnalisation complète des grilles d'évaluation et la pondération des critères sera disponible prochainement.</p>
           <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400 rounded-lg">
             <strong>Grille active :</strong> Telc B2 Standard (Grammaire, Vocabulaire, Structure, Connecteurs) - 100 points maximum.
           </div>
        </div>
      )}`;

const newRulesTab = `{activeTab === 'rules' && (
        <div className="flex flex-col gap-6 h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 overflow-y-auto">
           <div>
             <h2 className="text-2xl font-bold mb-2">Grille d'évaluation Telc B2 (Schriftlicher Ausdruck)</h2>
             <p className="text-gray-500 mb-6">Cette grille est utilisée par l'IA pour évaluer automatiquement les productions écrites des étudiants. Le score maximal est de 45 points.</p>
           </div>
           
           <div className="grid gap-6">
             <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-lg">1. Aufgabenbewältigung (Inhalt)</h3>
                 <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-sm font-bold">15 points</span>
               </div>
               <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Évaluation de la pertinence du contenu et du traitement des 4 points de la consigne.</p>
               <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                 <li><strong>5 pts (x3) :</strong> Les 4 points sont traités de manière appropriée.</li>
                 <li><strong>4 pts (x3) :</strong> 3 points sont traités.</li>
                 <li><strong>3 pts (x3) :</strong> 2 points sont traités ou tous sont traités brièvement.</li>
                 <li><strong>1-2 pts (x3) :</strong> 1 seul point traité ou hors sujet partiel.</li>
                 <li><strong>0 pt :</strong> Hors sujet total.</li>
               </ul>
             </div>

             <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-lg">2. Kommunikative Gestaltung</h3>
                 <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-sm font-bold">15 points</span>
               </div>
               <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Évaluation de la structure formelle, du registre de langue et de la cohérence.</p>
               <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                 <li><strong>5 pts (x3) :</strong> Registre parfait, structure claire, connecteurs logiques variés.</li>
                 <li><strong>4 pts (x3) :</strong> Bon registre, quelques erreurs de structure mineures.</li>
                 <li><strong>3 pts (x3) :</strong> Registre partiellement inadapté, structure basique.</li>
                 <li><strong>1-2 pts (x3) :</strong> Registre inadapté, pas de paragraphes, difficile à suivre.</li>
               </ul>
             </div>

             <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-lg">3. Korrektheit</h3>
                 <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-sm font-bold">15 points</span>
               </div>
               <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Évaluation de la grammaire, de l'orthographe et du vocabulaire (syntaxe, morphologie).</p>
               <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                 <li><strong>5 pts (x3) :</strong> Très peu d'erreurs, vocabulaire riche et complexe.</li>
                 <li><strong>4 pts (x3) :</strong> Quelques erreurs qui ne gênent pas la compréhension.</li>
                 <li><strong>3 pts (x3) :</strong> Erreurs fréquentes, vocabulaire limité, compréhension parfois altérée.</li>
                 <li><strong>1-2 pts (x3) :</strong> Beaucoup d'erreurs élémentaires, compréhension difficile.</li>
               </ul>
             </div>
           </div>
        </div>
      )}`;

code = code.replace(oldRulesTab, newRulesTab);
fs.writeFileSync('src/components/AdminDashboard.tsx', code);
