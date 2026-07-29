const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `        if (isOnline) {
          await setDoc(doc(db, "exercises", newEx.id), newEx);
        }`;

const replacement = `        if (isOnline) {
          // Strictly map to 6 properties to ensure firestore rules validate
          const firestorePayload = {
            id: newEx.id,
            title: newEx.title || 'Sans titre',
            situation: newEx.situation || '',
            content: newEx.content || '',
            type: newEx.type || 'Inconnu',
            createdAt: newEx.createdAt
          };
          console.log("Saving to Firestore:", firestorePayload);
          await setDoc(doc(db, "exercises", newEx.id), firestorePayload);
        }`;

if (code.includes(target)) {
  code = code.replace(target, replacement);
  fs.writeFileSync('src/App.tsx', code);
  console.log("App.tsx patched.");
} else {
  console.log("Target not found.");
}
