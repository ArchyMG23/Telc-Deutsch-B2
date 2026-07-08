const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

const resetFunctionStr = `
import { deleteDoc, getDocs } from 'firebase/firestore';

export const resetDatabase = async () => {
  // Delete all users except super admin
  const usersSnap = await getDocs(collection(db, 'users'));
  for (const docSnap of usersSnap.docs) {
    if (docSnap.data().role !== 'super_admin') {
      await deleteDoc(docSnap.ref);
    }
  }

  // Delete all submissions
  const subsSnap = await getDocs(collection(db, 'submissions'));
  for (const docSnap of subsSnap.docs) {
    await deleteDoc(docSnap.ref);
  }

  // We keep exercises as they are part of the base content
  // Or should we reset exercises too? The user says "supprime tout ce qui existe dans la base de donner".
  // "creer un bouton reset dans le mode super admin"
  // Let's delete exercises except the default ones if we want to be safe, but actually let's delete them all,
  // the app will re-seed defaults locally or they can recreate them.
  const execsSnap = await getDocs(collection(db, 'exercises'));
  for (const docSnap of execsSnap.docs) {
    await deleteDoc(docSnap.ref);
  }
};
`;

if (!code.includes('resetDatabase')) {
  // need to find a good place to put it without duplicating imports
  code += resetFunctionStr;
  fs.writeFileSync('src/lib/firebase.ts', code);
}
