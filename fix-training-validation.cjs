const fs = require('fs');
let code = fs.readFileSync('src/components/TrainingInterface.tsx', 'utf-8');

code = code.replace(
  '<p className="text-3xl font-bold text-[#FF0000]">{evaluation.score}/45</p>',
  `<p className="text-3xl font-bold text-[#FF0000]">{evaluation.score}/45</p>
   <div className="text-sm font-bold mt-1">
     {evaluation.score >= 27 
       ? <span className="text-green-600 dark:text-green-400">✅ VALIDÉ</span>
       : <span className="text-red-600 dark:text-red-400">❌ NON VALIDÉ (27/45 requis)</span>
     }
   </div>`
);

fs.writeFileSync('src/components/TrainingInterface.tsx', code);
