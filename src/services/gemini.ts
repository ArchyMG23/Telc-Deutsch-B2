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
    
    Pour chaque exercice trouvé, fournis :
    - Un titre clair (ex: "Beschwerdebrief: Sprachreise")
    - La situation ou l'offre intégrale (le texte de base, l'annonce, ou le contexte de la lettre).
    - Le contenu de la consigne (les points spécifiques à traiter dans la lettre).
    - Le type de lettre (ex: "Beschwerde", "Information", "Bewerbung").
  `;

  const response = await getAiClient().models.generateContent({
    model: 'gemini-3.1-pro-preview',
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
            situation: { type: Type.STRING, description: "La situation de base ou l'offre intégrale" },
            content: { type: Type.STRING, description: "Consigne complète de l'exercice et points à traiter" },
            type: { type: Type.STRING, description: "Type de lettre" },
          },
          required: ["id", "title", "situation", "content", "type"],
        },
      },
    },
  });

  try {
    let rawText = response.text || '[]';
    // Remove markdown json block if present
    if (rawText.includes('```json')) {
      rawText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (rawText.includes('```')) {
      rawText = rawText.replace(/```\n?/g, '').trim();
    }
    return JSON.parse(rawText);
  } catch (e: any) {
    console.error("Failed to extract exercises", e);
    throw new Error(e.message || "Erreur lors de l'extraction des sujets.");
  }
}

export async function evaluateWriting(exercise: Exercise, userText: string): Promise<Evaluation> {
  const prompt = `
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
    1. Aufgabenbewältigung (Inhalt) : /15 pts (Max 5 points x multiplier 3). Évalue si les points de la consigne sont traités.
    2. Kommunikative Gestaltung (Structure & communication) : /15 pts (Max 5 points x multiplier 3). Structure formelle, registre, éléments obligatoires, cohérence.
    3. Korrektheit (Correction linguistique) : /15 pts (Max 5 points x multiplier 3). Grammaire, orthographe, vocabulaire.
    4. Feedback global et conseils.
    5. Fournis UNE VERSION ENTIÈREMENT CORRIGÉE de la rédaction.
    IMPORTANT: Retourne UNIQUEMENT un objet JSON valide correspondant au schéma demandé.
`;

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
            inhaltScore: { type: Type.NUMBER, description: "Note Aufgabenbewältigung /15" },
            struktur: { type: Type.STRING, description: "Feedback détaillé Kommunikative Gestaltung" },
            strukturScore: { type: Type.NUMBER, description: "Note Kommunikative Gestaltung /15" },
            sprache: { type: Type.STRING, description: "Feedback détaillé Korrektheit" },
            spracheScore: { type: Type.NUMBER, description: "Note Korrektheit /15" },
            overallFeedback: { type: Type.STRING, description: "Synthèse globale et conseils" },
            correctedText: { type: Type.STRING, description: "Le texte entièrement corrigé" },
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
    
    throw new Error(e.message || "Erreur lors de la communication avec l'IA.");
  }
}
