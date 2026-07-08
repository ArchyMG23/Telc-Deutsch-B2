const fs = require('fs');
let code = fs.readFileSync('firestore.rules', 'utf-8');

const oldEvalValidation = `          data.evaluation.score is number 
          && data.evaluation.score >= 0 
          && data.evaluation.score <= 100
          && data.evaluation.grammar is string && data.evaluation.grammar.size() <= 2000
          && data.evaluation.vocabulary is string && data.evaluation.vocabulary.size() <= 2000
          && data.evaluation.structure is string && data.evaluation.structure.size() <= 2000
          && data.evaluation.connectors is string && data.evaluation.connectors.size() <= 2000
          && data.evaluation.overallFeedback is string && data.evaluation.overallFeedback.size() <= 2000`;

const newEvalValidation = `          data.evaluation.score is number 
          && data.evaluation.score >= 0 
          && data.evaluation.score <= 45
          && data.evaluation.inhalt is string && data.evaluation.inhalt.size() <= 2000
          && data.evaluation.struktur is string && data.evaluation.struktur.size() <= 2000
          && data.evaluation.sprache is string && data.evaluation.sprache.size() <= 2000
          && data.evaluation.overallFeedback is string && data.evaluation.overallFeedback.size() <= 2000`;

code = code.replace(oldEvalValidation, newEvalValidation);

fs.writeFileSync('firestore.rules', code);
