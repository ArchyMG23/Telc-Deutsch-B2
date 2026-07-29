const fs = require('fs');
let code = fs.readFileSync('src/services/gemini.ts', 'utf-8');

const targetPrompt = `  const prompt = \`
    Tu es un expert du test d'allemand Telc B2.
    Analyse le document fourni et extrais uniquement les sujets d'expression écrite (Schreiben).
    Ces sujets concernent généralement des lettres de réclamation (Beschwerdebrief), des demandes d'informations (Bitte um Informationen), ou des lettres de candidature (Bewerbung).
    
    Pour chaque exercice trouvé, fournis :
    - Un titre clair (ex: "Beschwerdebrief: Sprachreise")
    - La situation ou l'offre intégrale (le texte de base, l'annonce, ou le contexte de la lettre).
    - Le contenu de la consigne (les points spécifiques à traiter dans la lettre).
    - Le type de lettre (ex: "Beschwerde", "Information", "Bewerbung").
  \`;`;

const newPrompt = `  const prompt = \`
    Tu es un expert du test d'allemand Telc B2.
    Analyse le document fourni et extrais uniquement les sujets d'expression écrite (Schreiben).
    Ces sujets concernent généralement des lettres de réclamation (Beschwerdebrief), des demandes d'informations (Bitte um Informationen), ou des lettres de candidature (Bewerbung).
    
    IMPORTANT : Ne résume PAS et ne simplifie PAS le texte. Tu DOIS extraire les textes EXACTS tels qu'ils apparaissent dans le document original, mot pour mot.
    
    Pour chaque exercice trouvé, fournis :
    - Un titre clair (ex: "Beschwerdebrief: Sprachreise")
    - La situation ou l'offre intégrale : Recopie EXACTEMENT tout le texte de base, l'annonce ou le contexte de la lettre. N'omets aucun détail, adresse ou information.
    - Le contenu de la consigne : Recopie EXACTEMENT la consigne complète et les 4 points spécifiques à traiter dans la lettre.
    - Le type de lettre (ex: "Beschwerde", "Information", "Bewerbung").
  \`;`;

code = code.replace(targetPrompt, newPrompt);
fs.writeFileSync('src/services/gemini.ts', code);
