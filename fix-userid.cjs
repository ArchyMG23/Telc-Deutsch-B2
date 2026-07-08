const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');
code = code.replace("userId={user?.uid}", "");
fs.writeFileSync('src/App.tsx', code);
