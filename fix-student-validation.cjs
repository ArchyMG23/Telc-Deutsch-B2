const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');

code = code.replace(
  '<p className="text-xl font-bold text-[#FF0000]">{selectedSub.correction.score}/45</p>',
  `<p className="text-xl font-bold text-[#FF0000]">{selectedSub.correction.score}/45</p>
   <div className="text-[10px] font-bold mt-1">
     {selectedSub.correction.score >= 27 
       ? <span className="text-green-600">✅ VALIDÉ</span>
       : <span className="text-red-600">❌ NON VALIDÉ</span>
     }
   </div>`
);

fs.writeFileSync('src/components/StudentDashboard.tsx', code);
