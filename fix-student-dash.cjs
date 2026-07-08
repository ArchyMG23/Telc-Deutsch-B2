const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');

const oldStudentCards = `                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Grammaire</p>
                      <p className="text-xl font-bold">{selectedSub.correction.grammarScore}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Vocabulaire</p>
                      <p className="text-xl font-bold">{selectedSub.correction.vocabularyScore}</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Structure</p>
                      <p className="text-xl font-bold">{selectedSub.correction.structureScore}</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                      <p className="text-xs text-red-600 dark:text-red-400 mb-1">Note Totale</p>
                      <p className="text-xl font-bold text-[#FF0000]">{selectedSub.correction.score}/100</p>
                    </div>
                  </div>`;

const newStudentCards = `                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Inhalt</p>
                      <p className="text-xl font-bold">{selectedSub.correction.inhaltScore}/20</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Struktur</p>
                      <p className="text-xl font-bold">{selectedSub.correction.strukturScore}/15</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 mb-1">Sprache</p>
                      <p className="text-xl font-bold">{selectedSub.correction.spracheScore}/10</p>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-100 dark:border-red-900/30">
                      <p className="text-xs text-red-600 dark:text-red-400 mb-1">Note Totale</p>
                      <p className="text-xl font-bold text-[#FF0000]">{selectedSub.correction.score}/45</p>
                    </div>
                  </div>`;

code = code.replace(oldStudentCards, newStudentCards);
code = code.replace(/{sub.correction.score}\/100/g, "{sub.correction.score}/45");

fs.writeFileSync('src/components/StudentDashboard.tsx', code);
