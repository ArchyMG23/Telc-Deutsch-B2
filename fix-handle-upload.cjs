const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  /const handleUpload = async \(file: File\) => \{[\s\S]*?const extracted = await extractExercises\(file\);/,
  "const handleUpload = async (fileData: string, mimeType: string) => {\n" +
  "    if (!userProfile) return;\n" +
  "    setIsExtracting(true);\n" +
  "    try {\n" +
  "      const extracted = await extractExercises(fileData, mimeType);"
);

code = code.replace('export default function App() {', 'function App() {');

fs.writeFileSync('src/App.tsx', code);
