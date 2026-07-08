const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherDashboard.tsx', 'utf-8');

const telcGridHtml = `
                <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-xl text-sm text-indigo-900 dark:text-indigo-200 mb-4 border border-indigo-100 dark:border-indigo-800">
                  <h4 className="font-bold mb-2">Grille Officielle Telc B2</h4>
                  <ul className="list-disc pl-4 space-y-1 text-xs">
                    <li><strong>Inhalt (20 pts) :</strong> 4 points traités, pertinents.</li>
                    <li><strong>Struktur (15 pts) :</strong> Absender, Empfänger, Datum, Betreff, Anrede, Schlussformel, Unterschrift. Registre formel.</li>
                    <li><strong>Sprache (10 pts) :</strong> Grammaire, vocabulaire, orthographe B2.</li>
                    <li className="font-semibold text-[#FF0000]">Total requis pour validation : 27 / 45 pts.</li>
                  </ul>
                </div>
`;

code = code.replace(
  '<div className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">',
  telcGridHtml + '\n                <div className="space-y-4 bg-gray-50 dark:bg-gray-900/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-800">'
);

// update total logic
code = code.replace(
  `                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-bold">TOTAL</span>
                       <span className="text-xl font-black text-indigo-600">{correctionData.inhaltScore + correctionData.strukturScore + correctionData.spracheScore} / 45</span>
                    </div>`,
  `                    <div className="flex justify-between items-center mb-2">
                       <span className="text-sm font-bold">TOTAL</span>
                       <div className="text-right">
                         <span className="text-xl font-black text-indigo-600">{correctionData.inhaltScore + correctionData.strukturScore + correctionData.spracheScore} / 45</span>
                         <div className="text-xs font-bold mt-1">
                           {(correctionData.inhaltScore + correctionData.strukturScore + correctionData.spracheScore) >= 27 
                             ? <span className="text-green-600">✅ VALIDÉ</span>
                             : <span className="text-red-600">❌ NON VALIDÉ</span>
                           }
                         </div>
                       </div>
                    </div>`
);

fs.writeFileSync('src/components/TeacherDashboard.tsx', code);
