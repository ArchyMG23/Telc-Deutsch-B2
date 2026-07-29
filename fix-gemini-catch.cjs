const fs = require('fs');
let code = fs.readFileSync('src/services/gemini.ts', 'utf-8');

const target = `export async function extractExercises(fileData: string, mimeType: string): Promise<Exercise[]> {
  const prompt = \`
    Tu es un expert du test d'allemand Telc B2.
    Analyse le document fourni et extrais uniquement les sujets d'expression écrite (Schreiben).
    Ces sujets concernent généralement des lettres de réclamation (Beschwerdebrief), des demandes d'informations (Bitte um Informationen), ou des lettres de candidature (Bewerbung).
    
    Pour chaque exercice trouvé, fournis :
    - Un titre clair (ex: "Beschwerdebrief: Sprachreise")
    - La situation ou l'offre intégrale (le texte de base, l'annonce, ou le contexte de la lettre).
    - Le contenu de la consigne (les points spécifiques à traiter dans la lettre).
    - Le type de lettre (ex: "Beschwerde", "Information", "Bewerbung").
  \`;

  const response = await getAiClient().models.generateContent({`;

const replacement = `export async function extractExercises(fileData: string, mimeType: string): Promise<Exercise[]> {
  const prompt = \`
    Tu es un expert du test d'allemand Telc B2.
    Analyse le document fourni et extrais uniquement les sujets d'expression écrite (Schreiben).
    Ces sujets concernent généralement des lettres de réclamation (Beschwerdebrief), des demandes d'informations (Bitte um Informationen), ou des lettres de candidature (Bewerbung).
    
    Pour chaque exercice trouvé, fournis :
    - Un titre clair (ex: "Beschwerdebrief: Sprachreise")
    - La situation ou l'offre intégrale (le texte de base, l'annonce, ou le contexte de la lettre).
    - Le contenu de la consigne (les points spécifiques à traiter dans la lettre).
    - Le type de lettre (ex: "Beschwerde", "Information", "Bewerbung").
  \`;

  try {
    const response = await getAiClient().models.generateContent({`;

const target2 = `    return JSON.parse(rawText);
  } catch (e: any) {
    console.error("Failed to extract exercises", e);
    throw new Error(e.message || "Erreur lors de l'extraction des sujets.");
  }
}`;

const replacement2 = `    return JSON.parse(rawText);
  } catch (e: any) {
    console.error("Failed to extract exercises", e);
    throw new Error(e.message || "Erreur lors de l'extraction des sujets.");
  }
}`;

if (code.includes('const response = await getAiClient().models.generateContent({') && !code.includes('try {\n    const response = await getAiClient()')) {
    code = code.replace(target, replacement);
    code = code.replace(/    return JSON\.parse\(rawText\);\n  } catch \(e: any\) {/, `    return JSON.parse(rawText);\n  } catch (e: any) {`);
    // Need to correctly place the try catch around the whole block
}
fs.writeFileSync('fix-gemini-catch.ts', code);
