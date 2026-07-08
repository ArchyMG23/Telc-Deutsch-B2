const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(/}export default App;/g, '}\n\nexport default App;\n');

fs.writeFileSync('src/App.tsx', code);
