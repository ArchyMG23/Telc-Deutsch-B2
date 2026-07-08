const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {\n      setUser(u);",
  "    const unsubscribeAuth = onAuthStateChanged(auth, (u) => {\n      setUser(u);\n      setTimeout(() => setIsLoadingAuth(false), 3000);"
);

fs.writeFileSync('src/App.tsx', code);
