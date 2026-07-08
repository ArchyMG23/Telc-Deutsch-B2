const fs = require('fs');
let code = fs.readFileSync('src/services/gemini.ts', 'utf-8');

const target = `    1. Inhalt (Contenu) : /20 pts (Évalue si les 4 points de la consigne sont traités).
    2. Kommunikative Gestaltung (Structure & communication) : /15 pts (Structure formelle, registre, éléments obligatoires).
    3. Formale Richtigkeit (Correction linguistique) : /10 pts (Grammaire, orthographe, vocabulaire).
    4. Feedback global et conseils.
    5. Fournis UNE VERSION ENTIÈREMENT CORRIGÉE de la rédaction.

    IMPORTANT: Retourne UNIQUEMENT un objet JSON valide correspondant au schéma demandé.
\`;

  try {
    const response = await getAiClient().models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Note globale sur 45" },
            inhalt: { type: Type.STRING, description: "Feedback détaillé contenu (Inhalt)" },
            inhaltScore: { type: Type.NUMBER, description: "Note contenu /20" },
            struktur: { type: Type.STRING, description: "Feedback détaillé structure (Kommunikative Gestaltung)" },
            strukturScore: { type: Type.NUMBER, description: "Note structure /15" },
            sprache: { type: Type.STRING, description: "Feedback détaillé langue (Formale Richtigkeit)" },
            spracheScore: { type: Type.NUMBER, description: "Note langue /10" },`;

const replacement = `    1. Aufgabenbewältigung (Inhalt) : /15 pts (Max 5 points x multiplier 3). Évalue si les points de la consigne sont traités.
    2. Kommunikative Gestaltung (Structure & communication) : /15 pts (Max 5 points x multiplier 3). Structure formelle, registre, éléments obligatoires, cohérence.
    3. Korrektheit (Correction linguistique) : /15 pts (Max 5 points x multiplier 3). Grammaire, orthographe, vocabulaire.
    4. Feedback global et conseils.
    5. Fournis UNE VERSION ENTIÈREMENT CORRIGÉE de la rédaction.

    IMPORTANT: Retourne UNIQUEMENT un objet JSON valide correspondant au schéma demandé.
\`;

  try {
    const response = await getAiClient().models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Note globale sur 45" },
            inhalt: { type: Type.STRING, description: "Feedback détaillé Aufgabenbewältigung" },
            inhaltScore: { type: Type.NUMBER, description: "Note Inhalt /15" },
            struktur: { type: Type.STRING, description: "Feedback détaillé Kommunikative Gestaltung" },
            strukturScore: { type: Type.NUMBER, description: "Note Struktur /15" },
            sprache: { type: Type.STRING, description: "Feedback détaillé Korrektheit" },
            spracheScore: { type: Type.NUMBER, description: "Note Sprache /15" },`;

code = code.replace(target, replacement);
fs.writeFileSync('src/services/gemini.ts', code);
