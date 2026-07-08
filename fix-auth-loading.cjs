const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  `        }, (err) => {\n          console.error("Profile sync error:", err);\n          handleFirestoreError(err, OperationType.GET, \`users/\${u.uid}\`);\n          setIsLoadingAuth(false);\n        });\n      } else {\n        setUserProfile(null);\n        setIsLoadingAuth(false);\n      }`,
  `        }, (err) => {\n          console.error("Profile sync error:", err);\n          setIsLoadingAuth(false);\n          handleFirestoreError(err, OperationType.GET, \`users/\${u.uid}\`);\n        });\n      } else {\n        setUserProfile(null);\n        setIsLoadingAuth(false);\n      }`
);

fs.writeFileSync('src/App.tsx', code);
