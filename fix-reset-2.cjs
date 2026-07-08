const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

code = code.replace(/export const resetDatabase = async \(\) => \{[\s\S]*?^};$/m, `
export const resetDatabase = async () => {
  const usersSnap = await getDocs(collection(db, 'users'));
  for (const docSnap of usersSnap.docs) {
    if (docSnap.data().role !== 'super_admin') {
      const progressSnap = await getDocs(collection(db, 'users', docSnap.id, 'progress'));
      for (const p of progressSnap.docs) {
        await deleteDoc(p.ref);
      }
      await deleteDoc(docSnap.ref);
    }
  }

  const subsSnap = await getDocs(collection(db, 'submissions'));
  for (const docSnap of subsSnap.docs) {
    await deleteDoc(docSnap.ref);
  }

  const execsSnap = await getDocs(collection(db, 'exercises'));
  for (const docSnap of execsSnap.docs) {
    await deleteDoc(docSnap.ref);
  }
};
`);

// The previous script might have added duplicate imports, let's fix it by relying on the main imports.
code = code.replace(/import \{ deleteDoc, getDocs \} from 'firebase\/firestore';\n/, '');

// Make sure deleteDoc, getDocs are in the main import from 'firebase/firestore'
if (!code.includes('getDocs')) {
  code = code.replace("getDocFromServer } from 'firebase/firestore';", "getDocFromServer, deleteDoc, getDocs } from 'firebase/firestore';");
}

fs.writeFileSync('src/lib/firebase.ts', code);
