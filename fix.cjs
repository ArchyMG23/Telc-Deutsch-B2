const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');
const search = `          <div>              className="px-4 py-2 bg-[#FF0000] text-white rounded-xl font-bold text-sm shadow-md shadow-red-500/10 hover:bg-red-600 active:scale-95 transition-all flex items-center gap-2"            >          </div>`;
code = code.replace(search, '');
fs.writeFileSync('src/components/StudentDashboard.tsx', code);
