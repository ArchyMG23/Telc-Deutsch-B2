const fs = require('fs');
let code = fs.readFileSync('src/components/LoginPage.tsx', 'utf-8');

code = code.replace(/const \[emailRole, setEmailRole\] = useState<'student' \| 'admin'>\('student'\);\n/, '');
code = code.replace(/const \[adminCode, setTeacherCode\] = useState\(''\);\n/, '');

code = code.replace(/<div>\s*<label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">Rôle<\/label>\s*<\/div>/, '');

code = code.replace(/\{emailRole === 'admin' && \([\s\S]*?\}\)/, '');

fs.writeFileSync('src/components/LoginPage.tsx', code);
