const fs = require('fs');
let code = fs.readFileSync('src/lib/firebase.ts', 'utf-8');

const targetLogin = `export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};`;

const replaceLogin = `export const loginWithEmail = async (email: string, password: string) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error: any) {
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error("L'authentification par email et mot de passe n'est pas activée dans la console Firebase.");
    }
    throw error;
  }
};`;

const targetSignup = `export const signUpWithEmail = async (email: string, password: string, fullName: string, role: UserRole = 'student') => {
  const result = await createUserWithEmailAndPassword(auth, email, password);
  const user = result.user;
  
  await updateProfile(user, { displayName: fullName });
  
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    uid: user.uid,
    email: user.email,
    displayName: fullName,
    photoURL: null,
    role: email === 'yombivictor@gmail.com' ? 'super_admin' : role,
    createdAt: serverTimestamp()
  });
  
  return user;
};`;

const replaceSignup = `export const signUpWithEmail = async (email: string, password: string, fullName: string, role: UserRole = 'student') => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    
    await updateProfile(user, { displayName: fullName });
    
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: fullName,
      photoURL: null,
      role: email === 'yombivictor@gmail.com' ? 'super_admin' : role,
      createdAt: serverTimestamp()
    });
    
    return user;
  } catch (error: any) {
    if (error.code === 'auth/operation-not-allowed') {
      throw new Error("L'inscription par email n'est pas activée. Veuillez l'activer dans la console Firebase (Authentication > Sign-in method).");
    }
    if (error.code === 'auth/email-already-in-use') {
      throw new Error("Cette adresse email est déjà utilisée.");
    }
    throw error;
  }
};`;

code = code.replace(targetLogin, replaceLogin);
code = code.replace(targetSignup, replaceSignup);

fs.writeFileSync('src/lib/firebase.ts', code);
console.log("Updated login/signup error handling in firebase.ts");
