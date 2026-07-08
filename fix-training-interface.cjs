const fs = require('fs');
let code = fs.readFileSync('src/components/TrainingInterface.tsx', 'utf-8');

const oldCards = `<FeedbackCard title="Grammaire" content={evaluation.grammar} score={evaluation.grammarScore} maxScore={25} />
                     <FeedbackCard title="Vocabulaire (B2)" content={evaluation.vocabulary} score={evaluation.vocabularyScore} maxScore={25} />
                     <FeedbackCard title="Structure de la lettre" content={evaluation.structure} score={evaluation.structureScore} maxScore={25} />
                     <FeedbackCard title="Connecteurs Logiques" content={evaluation.connectors} score={evaluation.connectorsScore} maxScore={25} />`;

const newCards = `<FeedbackCard title="Inhalt (Contenu)" content={evaluation.inhalt} score={evaluation.inhaltScore} maxScore={20} />
                     <FeedbackCard title="Kommunikative Gestaltung (Structure)" content={evaluation.struktur} score={evaluation.strukturScore} maxScore={15} />
                     <FeedbackCard title="Formale Richtigkeit (Langue)" content={evaluation.sprache} score={evaluation.spracheScore} maxScore={10} />`;

code = code.replace(oldCards, newCards);

// Also change "/100" to "/45" where applicable in the evaluation view
code = code.replace(/Correction \({evaluation.score}\/100\)/g, 'Correction ({evaluation.score}/45)');
code = code.replace(/<p className="text-3xl font-bold text-\[#FF0000\]">{evaluation.score}\/100<\/p>/g, '<p className="text-3xl font-bold text-[#FF0000]">{evaluation.score}/45</p>');

fs.writeFileSync('src/components/TrainingInterface.tsx', code);
