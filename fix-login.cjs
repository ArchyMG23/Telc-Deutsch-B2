const fs = require('fs');
let code = fs.readFileSync('src/components/LoginPage.tsx', 'utf-8');

// remove role selection for signup
code = code.replace(/<div className="grid grid-cols-2 gap-3">[\s\S]*?<\/div>\s*<\/div>/, '');

// remove emailRole === 'admin' check since emailRole won't be used
code = code.replace(/\{emailRole === 'admin' && \([\s\S]*?\}\)/, '');

// update handleEmailAuth
code = code.replace(/if \(isSignUp && emailRole === 'admin' && adminCode\.trim\(\)\.toUpperCase\(\) !== 'B2ADMIN'\) \{[\s\S]*?return;\n    \}/, '');

code = code.replace(/await signUpWithEmail\(email, password, fullName, emailRole\);/, "await signUpWithEmail(email, password, fullName, 'student');");

fs.writeFileSync('src/components/LoginPage.tsx', code);
