const fs = require('fs');
let code = fs.readFileSync('src/services/gemini.ts', 'utf-8');

const targetPrompt = `  const prompt = \`
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

const newPrompt = `  const prompt = \`
    Tu es un expert du test d'allemand Telc B2.
    Analyse le document fourni et extrais uniquement les sujets d'expression écrite (Schreiben).
    Ces sujets concernent généralement des lettres de réclamation (Beschwerdebrief), des demandes d'informations (Bitte um Informationen), ou des lettres de candidature (Bewerbung).
    
    RÈGLES D'EXTRACTION TRÈS STRICTES :
    1. Ne résume PAS et ne simplifie PAS le texte.
    2. SÉPARE CLAIREMENT "La situation ou l'offre" de "La consigne".
    
    Pour chaque exercice trouvé, fournis :
    - Un titre clair (ex: "Beschwerdebrief: Sprachreise")
    - La situation ou l'offre intégrale : Recopie EXACTEMENT tout le texte de base (l'annonce, la publicité, l'article ou le contexte). 
      INCLUS OBLIGATOIREMENT toutes les informations de contact : nom de l'entreprise, adresses postales, numéros de téléphone, e-mails, sites web, et dates. Ne laisse rien de côté.
    - Le contenu de la consigne : Recopie EXACTEMENT et UNIQUEMENT les instructions (ex: "Schreiben Sie eine Beschwerde...") et les 4 puces/points spécifiques que l'étudiant doit traiter dans sa lettre.
    - Le type de lettre (ex: "Beschwerde", "Information", "Bewerbung").
  \`;`;

code = code.replace(targetPrompt, newPrompt);
fs.writeFileSync('src/services/gemini.ts', code);
