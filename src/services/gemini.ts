import { GoogleGenAI, Type } from '@google/genai';

let aiClient: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    if (!key) {
      throw new Error("Clé API Gemini manquante. Veuillez configurer la variable d'environnement GEMINI_API_KEY.");
    }
    aiClient = new GoogleGenAI({ apiKey: key });
  }
  return aiClient;
}

export interface Exercise {
  id: string;
  title: string;
  situation: string;
  content: string;
  type: string;
  createdAt?: string;
}

export interface Evaluation {
  score: number;
  inhalt: string;
  inhaltScore: number;
  struktur: string;
  strukturScore: number;
  sprache: string;
  spracheScore: number;
  overallFeedback: string;
  correctedText: string;
}

export async function extractExercises(fileData: string, mimeType: string): Promise<Exercise[]> {
  const prompt = `
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
  `;

  try {
    const response = await getAiClient().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: fileData,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING, description: "Un identifiant unique (ex: ex-1)" },
              title: { type: Type.STRING, description: "Titre de l'exercice" },
              situation: { type: Type.STRING, description: "La situation de base, l'annonce ou l'offre intégrale AVEC toutes les coordonnées, adresses et dates." },
              content: { type: Type.STRING, description: "Uniquement les instructions et les 4 points à traiter, sans inclure la situation de base." },
              type: { type: Type.STRING, description: "Type de lettre" },
            },
            required: ["id", "title", "situation", "content", "type"],
          },
        },
      },
    });

    let rawText = response.text || '[]';
    
    // Remove markdown json block if present
    if (rawText.includes('```json')) {
      rawText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (rawText.includes('```')) {
      rawText = rawText.replace(/```\n?/g, '').trim();
    }
    
    return JSON.parse(rawText);
  } catch (e: any) {
    console.error("Failed to extract exercises:", e);
    
    if (e.message?.includes("429") || e.message?.includes("quota")) {
      throw new Error("Limite de requêtes atteinte (Quota exceeded). Veuillez réessayer dans une minute.");
    }
    if (e.message?.includes("API key not valid")) {
      throw new Error("La clé API configurée est invalide. Vérifiez vos variables d'environnement.");
    }
    if (e.message?.includes("safety") || e.message?.includes("blocked")) {
      throw new Error("Le document a été bloqué par les filtres de sécurité de l'IA.");
    }
    if (e.message?.includes("inlineData")) {
       throw new Error("Le format du fichier n'est pas supporté ou est trop volumineux pour l'IA.");
    }
    if (e.message?.includes("503") || e.message?.includes("high demand") || e.message?.includes("UNAVAILABLE")) {
      throw new Error("L'IA est actuellement surchargée (forte demande). Veuillez patienter quelques minutes et réessayer.");
    }
    
    throw new Error(e.message || "Erreur lors de l'extraction des sujets.");
  }
}

export async function evaluateWriting(exercise: Exercise, userText: string): Promise<Evaluation> {
  const systemInstruction = `Tu es un examinateur et correcteur officiel expert certifié telc Deutsch B2 (épreuve Schriftlicher Ausdruck).
Tu évalues avec une rigueur absolue, fidélité et précision la rédaction de l'étudiant selon les critères officiels du barème telc B2 (45 points au total).

CRITÈRES OFFICIELS TELC B2 :
1. Aufgabenbewältigung (Inhaltliche Angemessenheit) : Note sur 15 points
   - Évalue si les 4 Leitpunkte (points de consigne) sont tous traités de manière développée et pertinente.
   - Traitement complet et approfondi = 15/15 (A), satisfaisant = 12/15 (B), partiel = 9/15 (C), insuffisant = 3/15 (D), non traité = 0/15 (E).

2. Kommunikative Gestaltung (Textaufbau, Kohärenz, Formale Vorgaben) : Note sur 15 points
   - Respect de la typologie textuelle formelle allemande (Betreffzeile, formule d'appel adéquate comme "Sehr geehrte Damen und Herren," formule de politesse finale "Mit freundlichen Grüßen", Unterschrift).
   - Articulation logique, transitions et connecteurs (deshalb, trotzdem, außerdem, da, usw.).

3. Korrektheit (Morphosyntax, Grammatik, Rechtschreibung & Zeichensetzung) : Note sur 15 points
   - Syntaxe (ordre des mots, verbe en 2e position ou en fin de subordonnée).
   - Déclinaisons (cas Nominativ, Akkusativ, Dativ, Genitiv, adjectifs).
   - Orthographe et ponctuation.

RÈGLES CAPITALES ANTI-HALLUCINATIONS (TRÈS STRICTES) :
1. VÉRIFICATION LITÉRALE DE LA CASSE (Majuscules / Minuscules - Groß- und Kleinschreibung) :
   - Vérifie CARACTÈRE PAR CARACTÈRE le texte RÉELLEMENT écrit par l'étudiant.
   - Si un nom ou un début de phrase commence DÉJÀ par une lettre majuscule dans le texte de l'étudiant (par exemple "Reise", "Urlaub", "Hotel", "Beschwerde", "Damen", "Herren"), il est STRICTEMENT INTERDIT de lui reprocher une absence de majuscule.
   - Ne signale une erreur de majuscule QUE si le mot a été littéralement et explicitement saisi en minuscule (ex: "mein urlaub" au lieu de "mein Urlaub").

2. VÉRIFICATION STRICTE DE L'ORTHOGRAPHE :
   - Ne signale JAMAIS de fausses fautes d'orthographe sur des mots correctement orthographiés en allemand standard (Duden).
   - Ne jamais halluciner de fautes qui n'existent pas dans le texte de l'étudiant.
   - Pour chaque erreur relevée dans la rubrique 'Korrektheit', cite textuellement l'extrait de l'étudiant entre guillemets, donne la correction exacte et explique la règle en français.

3. PROPOSITION DE CORRECTION COMPLÈTE ('correctedText') :
   - Fournis une lettre modèle de niveau B2 parfaite, fluide, sans aucune faute, respectant scrupuleusement la structure formelle et les 4 points de la consigne.

IMPORTANT:
- La note globale 'score' DOIT être la somme exacte des trois notes : inhaltScore + strukturScore + spracheScore (maximum 45).
- Fournis les explications et commentaires en français bienveillant et constructif.`;

  const userPrompt = `
Voici le sujet et la rédaction de l'étudiant à évaluer :

=== SITUATION / OFFRE ORIGINALE ===
${exercise.situation}

=== CONSIGNE DE L'EXERCICE (POINTS À TRAITER) ===
${exercise.content}

=== RÉDACTION RÉELLE DE L'ÉTUDIANT (Vérifier mot à mot la casse et l'orthographe exacte) ===
"""
${userText}
"""

Évalue ce texte avec la plus grande précision selon les instructions système. Retourne uniquement l'objet JSON formaté selon le schéma.
`;

  try {
    const response = await getAiClient().models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [{ parts: [{ text: userPrompt }] }],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: "Note globale sur 45 (inhaltScore + strukturScore + spracheScore)" },
            inhalt: { type: Type.STRING, description: "Commentaire détaillé Aufgabenbewältigung en Markdown (évaluation des 4 points)" },
            inhaltScore: { type: Type.NUMBER, description: "Note Aufgabenbewältigung sur 15 (0, 3, 9, 12 ou 15)" },
            struktur: { type: Type.STRING, description: "Commentaire détaillé Kommunikative Gestaltung en Markdown" },
            strukturScore: { type: Type.NUMBER, description: "Note Kommunikative Gestaltung sur 15" },
            sprache: { type: Type.STRING, description: "Commentaire détaillé Korrektheit en Markdown (citations exactes des erreurs réelles)" },
            spracheScore: { type: Type.NUMBER, description: "Note Korrektheit sur 15" },
            overallFeedback: { type: Type.STRING, description: "Synthèse globale, points forts et conseils clés pour le B2" },
            correctedText: { type: Type.STRING, description: "La lettre modèle B2 entièrement corrigée et rédigée" },
          },
          required: [
            "score", "inhalt", "inhaltScore", "struktur", "strukturScore", 
            "sprache", "spracheScore", "overallFeedback", "correctedText"
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("Le modèle n'a renvoyé aucun contenu. Cela peut être dû à un filtre de sécurité ou à une erreur interne.");
    }
    
    try {
      const result = JSON.parse(text);
      if (typeof result.score === 'string') {
        result.score = parseInt(result.score, 10) || 0;
      }
      return result;
    } catch (parseError) {
      console.error("JSON Parse Error. Raw text:", text);
      throw new Error("Le format de la réponse de l'IA est invalide. Veuillez réessayer.");
    }
  } catch (e: any) {
    console.error("Evaluation error details:", e);
    
    if (e.message?.includes("429") || e.message?.includes("quota")) {
      throw new Error("Limite de requêtes atteinte (Quota exceeded). Veuillez réessayer dans une minute.");
    }
    if (e.message?.includes("API key not valid")) {
      throw new Error("La clé API configurée est invalide. Vérifiez vos variables d'environnement.");
    }
    if (e.message?.includes("safety") || e.message?.includes("blocked")) {
      throw new Error("Le contenu a été bloqué par les filtres de sécurité de l'IA. Essayez de reformuler votre texte.");
    }
    if (e.message?.includes("503") || e.message?.includes("high demand") || e.message?.includes("UNAVAILABLE")) {
      throw new Error("L'IA est actuellement surchargée (forte demande). Veuillez patienter quelques minutes et réessayer.");
    }
    
    throw new Error(e.message || "Erreur lors de la communication avec l'IA.");
  }
}
