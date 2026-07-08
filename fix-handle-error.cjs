const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

code = code.replace(
  "  console.error('Firestore Error: ', JSON.stringify(errInfo));\n  throw new Error(JSON.stringify(errInfo));\n}",
  "  console.error('Firestore Error: ', JSON.stringify(errInfo));\n  // Don't throw to prevent crashing the app silently in callbacks\n  // alert('Une erreur de connexion est survenue. Veuillez rafraîchir la page.');\n}"
);

fs.writeFileSync('src/lib/firebase.ts', code);
