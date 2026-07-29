const fs = require('fs');
let code = fs.readFileSync('src/services/gemini.ts', 'utf-8');

code = code.replace(
  `situation: { type: Type.STRING, description: "La situation de base ou l'offre intégrale" },`,
  `situation: { type: Type.STRING, description: "La situation de base, l'annonce ou l'offre intégrale AVEC toutes les coordonnées, adresses et dates." },`
);

code = code.replace(
  `content: { type: Type.STRING, description: "Consigne complète de l'exercice et points à traiter" },`,
  `content: { type: Type.STRING, description: "Uniquement les instructions et les 4 points à traiter, sans inclure la situation de base." },`
);

fs.writeFileSync('src/services/gemini.ts', code);
