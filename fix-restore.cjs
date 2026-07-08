const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Fix onClose to onExit and remove onSaveDraft
code = code.replace("onClose={() => selectExercise(null, false)}", "onExit={() => selectExercise(null, false)}");
code = code.replace("onSaveDraft={onSaveDraft}", "");

// Ensure Upload and ChevronRight are imported from lucide-react
const lucideImportsMatch = code.match(/import \{([^}]+)\} from 'lucide-react';/);
if (lucideImportsMatch) {
  let imports = lucideImportsMatch[1];
  if (!imports.includes('Upload')) imports += ', Upload';
  if (!imports.includes('ChevronRight')) imports += ', ChevronRight';
  code = code.replace(lucideImportsMatch[0], `import {${imports}} from 'lucide-react';`);
}

fs.writeFileSync('src/App.tsx', code);
