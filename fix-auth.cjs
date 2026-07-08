const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

code = code.replace(/if \(error\.code === 'auth\/popup-closed-by-user'\) return null;/g, `if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return null;`);

fs.writeFileSync('src/lib/firebase.ts', code);

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
appCode = appCode.replace(/onClick=\{loginWithGoogle\}/g, `onClick={async () => { try { await loginWithGoogle(); } catch (e) { console.error(e); } }}`);
fs.writeFileSync('src/App.tsx', appCode);

