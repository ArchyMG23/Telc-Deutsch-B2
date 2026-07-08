const fs = require('fs');
let code = fs.readFileSync('src/components/LoginPage.tsx', 'utf-8');

// I'll replace everything from "<div>\n                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Rôle</label>" up to the end of that block before "</div>\n            )}\n            <div className="space-y-4 pt-2">"
const startIdx = code.indexOf('<div>\n                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Rôle</label>');
const endStr = '</div>\n            )}\n            <div className="space-y-4 pt-2">';
const endIdx = code.indexOf(endStr);

if (startIdx !== -1 && endIdx !== -1) {
  code = code.substring(0, startIdx) + code.substring(endIdx);
} else {
  console.log("Could not find bounds");
}

fs.writeFileSync('src/components/LoginPage.tsx', code);
