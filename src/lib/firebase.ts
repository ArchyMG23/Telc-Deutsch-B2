import { initializeApp, deleteApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot, serverTimestamp, updateDoc, getDocFromServer, getDocs, deleteDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Exercise, Evaluation } from '../services/gemini';
import { UserRole, UserProfile } from '../types'; // I need to make sure this is available

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  // Don't throw to prevent crashing the app silently in callbacks
  // alert('Une erreur de connexion est survenue. Veuillez rafraîchir la page.');
}

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration.");
    }
  }
}

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    const userRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        role: user.email === 'yombivictor@gmail.com' ? 'super_admin' : 'student',
        createdAt: serverTimestamp()
      });
    }
    return user;
  } catch (error: any) {
    if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') return null;
    if (error.code === 'auth/unauthorized-domain') {
      alert("Ce site n'est pas autorisé pour la connexion Google. Utilisez l'email.");
      return null;
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error("La fenêtre de connexion a été bloquée. Veuillez ouvrir l'application dans un nouvel onglet (icône en haut à droite) ou utiliser la connexion par email.");
    }
    throw error;
  }
};

export const loginWithEmail = async (email: string, password: string) => {
  const result = await signInWithEmailAndPassword(auth, email, password);
  return result.user;
};

export const signUpWithEmail = async (email: string, password: string, fullName: string, role: UserRole = 'student') => {
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
};

export const updateUserRole = async (userId: string, role: UserRole) => {
  try {
    await updateDoc(doc(db, 'users', userId), { role });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
  }
};

// Adapting the existing Submission interface to not break existing code immediately
export interface Submission {
  id: string;
  studentId: string;
  studentName?: string;
  corrected_by_admin_id?: string;
  exerciseId: string;
  exerciseTitle: string;
  text: string;
  status: 'en_cours' | 'soumis' | 'corrige';
  correction?: any; // The telc evaluation data
  submittedAt?: any;
  createdAt: any;
  updatedAt: any;
}

export const submitExercise = async (submission: any) => {
  try {
    const subRef = doc(collection(db, 'submissions'));
    const id = subRef.id;
    await setDoc(subRef, {
      ...submission,
      id,
      status: submission.status || 'soumis',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    if (submission.teacherId) {
      await updateDoc(doc(db, 'users', submission.studentId), {
        lastTeacherId: submission.teacherId,
        teacherId: submission.teacherId
      });
    }
    
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'submissions');
  }
};

export const logout = () => auth.signOut();

export const createAdminAccount = async (email: string, password: string, fullName: string) => {
  const secondaryApp = initializeApp(firebaseConfig, 'Secondary');
  const secondaryAuth = getAuth(secondaryApp);
  
  try {
    const result = await createUserWithEmailAndPassword(secondaryAuth, email, password);
    const user = result.user;
    
    await updateProfile(user, { displayName: fullName });
    
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      email: user.email,
      displayName: fullName,
      role: 'admin',
      createdAt: serverTimestamp()
    });
    
    await secondaryAuth.signOut();
  } finally {
    await deleteApp(secondaryApp);
  }
};



export const resetUsersData = async () => {
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
};

