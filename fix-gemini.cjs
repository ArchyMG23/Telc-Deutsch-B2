const fs = require('fs');
let code = fs.readFileSync('src/services/gemini.ts', 'utf-8');

code = code.replace(
`export interface Evaluation {
  score: number;
  grammar: string;
  grammarScore: number;
  vocabulary: string;
  vocabularyScore: number;
  structure: string;
  structureScore: number;
  connectors: string;
  connectorsScore: number;
  overallFeedback: string;
  correctedText: string;
}`,
`export interface Evaluation {
  score: number;
  inhalt: string;
  inhaltScore: number;
  struktur: string;
  strukturScore: number;
  sprache: string;
  spracheScore: number;
  overallFeedback: string;
  correctedText: string;
}`
);

const newPrompt = `
    Tu es un correcteur expert certifié telc Deutsch B2.
    Tu dois évaluer la lettre formelle suivante selon la grille officielle telc B2 Schriftlicher Ausdruck (45 points au total).
    
    Situation / Offre :
    """
    \${exercise.situation}
    """
    
    Consigne de l'exercice :
    """
    \${exercise.content}
    """
    
    Rédaction de l'étudiant :
    """
    \${userText}
    """
    
    Fournis une évaluation détaillée en français, structurée selon les critères du Telc B2 :
    1. Inhalt (Contenu) : /20 pts (Évalue si les 4 points de la consigne sont traités).
    2. Kommunikative Gestaltung (Structure & communication) : /15 pts (Structure formelle, registre, éléments obligatoires).
    3. Formale Richtigkeit (Correction linguistique) : /10 pts (Grammaire, orthographe, vocabulaire).
    4. Feedback global et conseils.
    5. Fournis UNE VERSION ENTIÈREMENT CORRIGÉE de la rédaction.
    IMPORTANT: Retourne UNIQUEMENT un objet JSON valide correspondant au schéma demandé.
`;

const replacePromptRegex = /const prompt = \`[\s\S]*?IMPORTANT: Retourne UNIQUEMENT un objet JSON valide correspondant au schéma demandé\.\s*\`;/;
code = code.replace(replacePromptRegex, "const prompt = `" + newPrompt + "`;");

const oldSchemaStr = `        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Note globale sur 100 (très stricte)" },
            grammar: { type: Type.STRING, description: "Feedback détaillé grammaire" },
            grammarScore: { type: Type.NUMBER, description: "Note grammaire /25" },
            vocabulary: { type: Type.STRING, description: "Feedback détaillé vocabulaire" },
            vocabularyScore: { type: Type.NUMBER, description: "Note vocabulaire /25" },
            structure: { type: Type.STRING, description: "Feedback détaillé structure" },
            structureScore: { type: Type.NUMBER, description: "Note structure /25" },
            connectors: { type: Type.STRING, description: "Feedback détaillé connecteurs" },
            connectorsScore: { type: Type.NUMBER, description: "Note connecteurs /25" },
            overallFeedback: { type: Type.STRING, description: "Synthèse globale" },
            correctedText: { type: Type.STRING, description: "Le texte entièrement corrigé et amélioré au niveau B2" },
          },
          required: [
            "score", "grammar", "grammarScore", "vocabulary", "vocabularyScore", 
            "structure", "structureScore", "connectors", "connectorsScore", "overallFeedback", "correctedText"
          ],
        },`;

const newSchemaStr = `        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Note globale sur 45" },
            inhalt: { type: Type.STRING, description: "Feedback détaillé contenu (Inhalt)" },
            inhaltScore: { type: Type.NUMBER, description: "Note contenu /20" },
            struktur: { type: Type.STRING, description: "Feedback détaillé structure (Kommunikative Gestaltung)" },
            strukturScore: { type: Type.NUMBER, description: "Note structure /15" },
            sprache: { type: Type.STRING, description: "Feedback détaillé langue (Formale Richtigkeit)" },
            spracheScore: { type: Type.NUMBER, description: "Note langue /10" },
            overallFeedback: { type: Type.STRING, description: "Synthèse globale et conseils" },
            correctedText: { type: Type.STRING, description: "Le texte entièrement corrigé" },
          },
          required: [
            "score", "inhalt", "inhaltScore", "struktur", "strukturScore", 
            "sprache", "spracheScore", "overallFeedback", "correctedText"
          ],
        },`;

code = code.replace(oldSchemaStr, newSchemaStr);

fs.writeFileSync('src/services/gemini.ts', code);
