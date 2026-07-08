const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');
if (!appCode.includes('Trash2')) {
  appCode = appCode.replace(
    "} from 'lucide-react';",
    ", Trash2 } from 'lucide-react';"
  );
  fs.writeFileSync('src/App.tsx', appCode);
}

let firebaseCode = fs.readFileSync('src/lib/firebase.ts', 'utf-8');
if (!firebaseCode.includes('deleteDoc,')) {
  firebaseCode = firebaseCode.replace(
    "getDocFromServer } from 'firebase/firestore';",
    "getDocFromServer, getDocs, deleteDoc } from 'firebase/firestore';"
  );
  fs.writeFileSync('src/lib/firebase.ts', firebaseCode);
}
