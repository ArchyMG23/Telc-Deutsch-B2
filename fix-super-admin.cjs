const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  "          if (snap.exists()) {\n            setUserProfile(snap.data());\n          } else {",
  `          if (snap.exists()) {
            const data = snap.data();
            if (u.email === 'yombivictor@gmail.com' && data.role !== 'super_admin') {
              updateDoc(profileRef, { role: 'super_admin' }).catch(console.error);
              data.role = 'super_admin';
            }
            setUserProfile(data);
          } else {`
);

// Also handle the fallback profile
code = code.replace(
  "              role: 'student' as const,",
  "              role: u.email === 'yombivictor@gmail.com' ? 'super_admin' : 'student' as const,"
);

fs.writeFileSync('src/App.tsx', code);

// Now in firebase.ts, we should also fix the loginWithGoogle so it creates the right role for yombivictor
let fcode = fs.readFileSync('src/lib/firebase.ts', 'utf-8');
fcode = fcode.replace(
  "        role: 'student', // Default role",
  "        role: user.email === 'yombivictor@gmail.com' ? 'super_admin' : 'student',"
);
fs.writeFileSync('src/lib/firebase.ts', fcode);
