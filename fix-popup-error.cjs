const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

const target = `    if (error.code === 'auth/unauthorized-domain') {
      alert("Ce site n'est pas autorisé pour la connexion Google. Utilisez l'email.");
      return null;
    }
    throw error;`;

const replacement = `    if (error.code === 'auth/unauthorized-domain') {
      alert("Ce site n'est pas autorisé pour la connexion Google. Utilisez l'email.");
      return null;
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error("La fenêtre de connexion a été bloquée. Veuillez ouvrir l'application dans un nouvel onglet (icône en haut à droite) ou utiliser la connexion par email.");
    }
    throw error;`;

if (code.includes('auth/unauthorized-domain')) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/lib/firebase.ts', code);
  console.log("Updated error handling in firebase.ts");
}
