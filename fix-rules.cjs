const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf-8');

code = code.replace(
  'allow update, delete: if isSuperAdmin();',
  'allow update, delete: if isAdmin();'
);

fs.writeFileSync('firestore.rules', code);
