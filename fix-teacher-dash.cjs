const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherDashboard.tsx', 'utf-8');

code = code.replace(
`  const [correctionData, setCorrectionData] = useState({
    grammarScore: 0,
    vocabularyScore: 0,
    structureScore: 0,
    connectorsScore: 0,
    overallFeedback: '',
    highlightedText: ''
  });`,
`  const [correctionData, setCorrectionData] = useState({
    inhaltScore: 0,
    strukturScore: 0,
    spracheScore: 0,
    overallFeedback: '',
    highlightedText: ''
  });`
);

code = code.replace(
`const score = correctionData.grammarScore + correctionData.vocabularyScore + correctionData.structureScore + correctionData.connectorsScore;`,
`const score = correctionData.inhaltScore + correctionData.strukturScore + correctionData.spracheScore;`
);

code = code.replace(
`grammarScore: 0, vocabularyScore: 0, structureScore: 0, connectorsScore: 0, overallFeedback: '', highlightedText: sub.text`,
`inhaltScore: 0, strukturScore: 0, spracheScore: 0, overallFeedback: '', highlightedText: sub.text`
);

const oldScoreInputs = `                  <ScoreInput 
                    label="Grammaire (Grammatik)" 
                    value={correctionData.grammarScore} 
                    onChange={(v) => setCorrectionData(p => ({ ...p, grammarScore: v }))} 
                    disabled={selectedSub.status === 'corrige'}
                  />
                  <ScoreInput 
                    label="Vocabulaire (Wortschatz)" 
                    value={correctionData.vocabularyScore} 
                    onChange={(v) => setCorrectionData(p => ({ ...p, vocabularyScore: v }))}
                    disabled={selectedSub.status === 'corrige'}
                  />
                  <ScoreInput 
                    label="Structure (Aufbau)" 
                    value={correctionData.structureScore} 
                    onChange={(v) => setCorrectionData(p => ({ ...p, structureScore: v }))}
                    disabled={selectedSub.status === 'corrige'}
                  />
                  <ScoreInput 
                    label="Connecteurs (Verknüpfungsmittel)" 
                    value={correctionData.connectorsScore} 
                    onChange={(v) => setCorrectionData(p => ({ ...p, connectorsScore: v }))}
                    disabled={selectedSub.status === 'corrige'}
                  />`;

const newScoreInputs = `                  <ScoreInput 
                    label="Inhalt (Contenu - max 20)" 
                    value={correctionData.inhaltScore} 
                    onChange={(v) => setCorrectionData(p => ({ ...p, inhaltScore: v }))} 
                    disabled={selectedSub.status === 'corrige'}
                  />
                  <ScoreInput 
                    label="Struktur (Kommunikative Gestaltung - max 15)" 
                    value={correctionData.strukturScore} 
                    onChange={(v) => setCorrectionData(p => ({ ...p, strukturScore: v }))}
                    disabled={selectedSub.status === 'corrige'}
                  />
                  <ScoreInput 
                    label="Sprache (Formale Richtigkeit - max 10)" 
                    value={correctionData.spracheScore} 
                    onChange={(v) => setCorrectionData(p => ({ ...p, spracheScore: v }))}
                    disabled={selectedSub.status === 'corrige'}
                  />`;

code = code.replace(oldScoreInputs, newScoreInputs);

code = code.replace(
`correctionData.grammarScore + correctionData.vocabularyScore + correctionData.structureScore + correctionData.connectorsScore} / 100`,
`correctionData.inhaltScore + correctionData.strukturScore + correctionData.spracheScore} / 45`
);

fs.writeFileSync('src/components/TeacherDashboard.tsx', code);
