const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  `        DEFAULT_EXERCISES.forEach(def => {
          if (!combined.some(c => c.id === def.id)) {
            combined.push(def);
          }
        });`,
  ``
);

code = code.replace(
  `        DEFAULT_EXERCISES.forEach(def => {
          if (!combined.some(c => c.id === def.id)) {
            combined.push(def);
          }
        });`,
  ``
);

code = code.replace(
  `    return DEFAULT_EXERCISES;`,
  `    return [];`
);

fs.writeFileSync('src/App.tsx', code);
