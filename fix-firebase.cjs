const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

const oldReset = `export const resetDatabase = async () => {
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
};`;

const newReset = `export const resetUsersData = async () => {
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
};

export const resetExercises = async () => {
  const execsSnap = await getDocs(collection(db, 'exercises'));
  for (const docSnap of execsSnap.docs) {
    await deleteDoc(docSnap.ref);
  }
};`;

code = code.replace(oldReset, newReset);

fs.writeFileSync('src/lib/firebase.ts', code);
