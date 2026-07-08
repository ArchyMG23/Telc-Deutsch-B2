const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  `        const profileRef = doc(db, 'users', u.uid);
        unsubscribeProfile = onSnapshot(profileRef, (snap) => {
          if (snap.exists()) {
            setUserProfile(snap.data());
          } else {
            console.log("No profile found in Firestore for uid:", u.uid, ". Using local auth data as fallback...");
            const fallbackProfile = {
              uid: u.uid,
              email: u.email || '',
              displayName: u.displayName || u.email?.split('@')[0] || 'Utilisateur',
              photoURL: u.photoURL || null,
              role: 'student' as const,
              createdAt: new Date()
            };
            setUserProfile(fallbackProfile);
          }
        }, (err) => {
          console.error("Profile sync error:", err);
          handleFirestoreError(err, OperationType.GET, \`users/\${u.uid}\`);
        });
      } else {
        setUserProfile(null);
      }
    });`,
  `        const profileRef = doc(db, 'users', u.uid);
        unsubscribeProfile = onSnapshot(profileRef, (snap) => {
          if (snap.exists()) {
            setUserProfile(snap.data());
          } else {
            console.log("No profile found in Firestore for uid:", u.uid, ". Using local auth data as fallback...");
            const fallbackProfile = {
              uid: u.uid,
              email: u.email || '',
              displayName: u.displayName || u.email?.split('@')[0] || 'Utilisateur',
              photoURL: u.photoURL || null,
              role: 'student' as const,
              createdAt: new Date()
            };
            setUserProfile(fallbackProfile);
          }
          setIsLoadingAuth(false);
        }, (err) => {
          console.error("Profile sync error:", err);
          handleFirestoreError(err, OperationType.GET, \`users/\${u.uid}\`);
          setIsLoadingAuth(false);
        });
      } else {
        setUserProfile(null);
        setIsLoadingAuth(false);
      }
    });`
);

fs.writeFileSync('src/App.tsx', code);
