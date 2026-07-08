const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appCode.includes('Trash2')) {
  appCode = appCode.replace(
    "import { Plus, Award, WifiOff, PenTool, CheckCircle, Clock, Search, LogOut, Upload, FileText, User as UserIcon, LogIn, ChevronLeft, ShieldCheck } from 'lucide-react';",
    "import { Plus, Award, WifiOff, PenTool, CheckCircle, Clock, Search, LogOut, Upload, FileText, User as UserIcon, LogIn, ChevronLeft, ShieldCheck, Trash2 } from 'lucide-react';"
  );
  fs.writeFileSync('src/App.tsx', appCode);
}

let firebaseCode = fs.readFileSync('src/lib/firebase.ts', 'utf-8');
if (!firebaseCode.includes('getDocs')) {
  firebaseCode = firebaseCode.replace(
    "import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot, serverTimestamp, updateDoc, getDocFromServer } from 'firebase/firestore';",
    "import { getFirestore, doc, setDoc, getDoc, collection, query, where, onSnapshot, serverTimestamp, updateDoc, getDocFromServer, getDocs, deleteDoc } from 'firebase/firestore';"
  );
  fs.writeFileSync('src/lib/firebase.ts', firebaseCode);
}
