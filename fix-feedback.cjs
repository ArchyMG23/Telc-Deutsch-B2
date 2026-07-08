const fs = require('fs');
let code = fs.readFileSync('src/components/TrainingInterface.tsx', 'utf-8');

const target = `                   <div className="grid gap-4">
                     <FeedbackCard title="Inhalt (Contenu)" content={evaluation.inhalt} score={evaluation.inhaltScore} maxScore={20} />
                     <FeedbackCard title="Kommunikative Gestaltung (Structure)" content={evaluation.struktur} score={evaluation.strukturScore} maxScore={15} />
                     <FeedbackCard title="Formale Richtigkeit (Langue)" content={evaluation.sprache} score={evaluation.spracheScore} maxScore={10} />
                   </div>`;

const replacement = `                   <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm mb-8">
                     <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm">
                         <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                           <tr>
                             <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Critère (Telc B2)</th>
                             <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Feedback</th>
                             <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-right">Points</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                           <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                             <td className="px-4 py-4 align-top w-1/4">
                               <div className="font-bold text-gray-900 dark:text-white mb-1">Aufgabenbewältigung</div>
                               <div className="text-xs text-gray-500">Inhaltliche Angemessenheit</div>
                             </td>
                             <td className="px-4 py-4 align-top prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400">
                               <Markdown>{evaluation.inhalt}</Markdown>
                             </td>
                             <td className="px-4 py-4 align-top text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                               {evaluation.inhaltScore} <span className="text-gray-400 font-normal">/ 15</span>
                             </td>
                           </tr>
                           <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                             <td className="px-4 py-4 align-top w-1/4">
                               <div className="font-bold text-gray-900 dark:text-white mb-1">Kommunikative Gestaltung</div>
                               <div className="text-xs text-gray-500">Textaufbau, Verknüpfungen</div>
                             </td>
                             <td className="px-4 py-4 align-top prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400">
                               <Markdown>{evaluation.struktur}</Markdown>
                             </td>
                             <td className="px-4 py-4 align-top text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                               {evaluation.strukturScore} <span className="text-gray-400 font-normal">/ 15</span>
                             </td>
                           </tr>
                           <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                             <td className="px-4 py-4 align-top w-1/4">
                               <div className="font-bold text-gray-900 dark:text-white mb-1">Korrektheit</div>
                               <div className="text-xs text-gray-500">Syntax, Morphologie, Rechtschreibung</div>
                             </td>
                             <td className="px-4 py-4 align-top prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400">
                               <Markdown>{evaluation.sprache}</Markdown>
                             </td>
                             <td className="px-4 py-4 align-top text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                               {evaluation.spracheScore} <span className="text-gray-400 font-normal">/ 15</span>
                             </td>
                           </tr>
                         </tbody>
                         <tfoot className="bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700">
                           <tr>
                             <td colSpan={2} className="px-4 py-4 text-right font-bold text-gray-900 dark:text-white">Note Globale (Schriftlicher Ausdruck)</td>
                             <td className="px-4 py-4 text-right font-black text-lg text-[#FF0000]">{evaluation.score} <span className="text-sm font-normal text-gray-500">/ 45</span></td>
                           </tr>
                         </tfoot>
                       </table>
                     </div>
                   </div>`;

code = code.replace(target, replacement);
fs.writeFileSync('src/components/TrainingInterface.tsx', code);
