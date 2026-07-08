const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');

const oldCards = `<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                </div>`;

const newCards = `<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Inhalt</p>
                    <p className="text-xl font-bold">{selectedSub.correction.inhaltScore}/20</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Struktur</p>
                    <p className="text-xl font-bold">{selectedSub.correction.strukturScore}/15</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <p className="text-[10px] uppercase text-gray-500 font-bold">Sprache</p>
                    <p className="text-xl font-bold">{selectedSub.correction.spracheScore}/10</p>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-[#FF0000]/20">
                    <p className="text-[10px] uppercase text-[#FF0000] font-bold">Total</p>
                    <p className="text-xl font-bold text-[#FF0000]">{selectedSub.correction.score}/45</p>
                    <div className="text-[10px] font-bold mt-1">
                      {selectedSub.correction.score >= 27 
                        ? <span className="text-green-600">✅ VALIDÉ</span>
                        : <span className="text-red-600">❌ NON VALIDÉ</span>
                      }
                    </div>
                  </div>
                </div>`;

code = code.replace(oldCards, newCards);

fs.writeFileSync('src/components/StudentDashboard.tsx', code);
