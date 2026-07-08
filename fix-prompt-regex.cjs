const fs = require('fs');
let code = fs.readFileSync('src/services/gemini.ts', 'utf-8');

code = code.replace(
  "1. Inhalt (Contenu) : /20 pts (Évalue si les 4 points de la consigne sont traités).",
  "1. Aufgabenbewältigung (Inhalt) : /15 pts (Max 5 points x multiplier 3). Évalue si les points de la consigne sont traités."
);

code = code.replace(
  "2. Kommunikative Gestaltung (Structure & communication) : /15 pts (Structure formelle, registre, éléments obligatoires).",
  "2. Kommunikative Gestaltung (Structure & communication) : /15 pts (Max 5 points x multiplier 3). Structure formelle, registre, éléments obligatoires, cohérence."
);

code = code.replace(
  "3. Formale Richtigkeit (Correction linguistique) : /10 pts (Grammaire, orthographe, vocabulaire).",
  "3. Korrektheit (Correction linguistique) : /15 pts (Max 5 points x multiplier 3). Grammaire, orthographe, vocabulaire."
);

code = code.replace(
  'inhalt: { type: Type.STRING, description: "Feedback détaillé contenu (Inhalt)" },',
  'inhalt: { type: Type.STRING, description: "Feedback détaillé Aufgabenbewältigung" },'
);

code = code.replace(
  'inhaltScore: { type: Type.NUMBER, description: "Note contenu /20" },',
  'inhaltScore: { type: Type.NUMBER, description: "Note Aufgabenbewältigung /15" },'
);

code = code.replace(
  'struktur: { type: Type.STRING, description: "Feedback détaillé structure (Kommunikative Gestaltung)" },',
  'struktur: { type: Type.STRING, description: "Feedback détaillé Kommunikative Gestaltung" },'
);

code = code.replace(
  'strukturScore: { type: Type.NUMBER, description: "Note structure /15" },',
  'strukturScore: { type: Type.NUMBER, description: "Note Kommunikative Gestaltung /15" },'
);

code = code.replace(
  'sprache: { type: Type.STRING, description: "Feedback détaillé langue (Formale Richtigkeit)" },',
  'sprache: { type: Type.STRING, description: "Feedback détaillé Korrektheit" },'
);

code = code.replace(
  'spracheScore: { type: Type.NUMBER, description: "Note langue /10" },',
  'spracheScore: { type: Type.NUMBER, description: "Note Korrektheit /15" },'
);

fs.writeFileSync('src/services/gemini.ts', code);
