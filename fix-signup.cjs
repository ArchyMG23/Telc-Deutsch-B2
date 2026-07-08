const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

code = code.replace(
  "role: role,",
  "role: email === 'yombivictor@gmail.com' ? 'super_admin' : role,"
);

fs.writeFileSync('src/lib/firebase.ts', code);
