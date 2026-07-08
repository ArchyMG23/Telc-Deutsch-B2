const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Add state
const stateAdd = `
  const [progress, setProgress] = useState<Record<string, SavedProgress>>(() => {
    const saved = localStorage.getItem('dia_progress');
    return saved ? JSON.parse(saved) : {};
  });
  
  const [submissions, setSubmissions] = useState<any[]>([]);
`;
code = code.replace(/  const \[progress, setProgress\] = useState<Record<string, SavedProgress>>\(\(\) => \{\n    const saved = localStorage\.getItem\('dia_progress'\);\n    return saved \? JSON\.parse\(saved\) : \{\};\n  \}\);/, stateAdd);

// Add listener in auth effect
const authEffectReplace = `
      if (u) {
        const profileRef = doc(db, 'users', u.uid);
        unsubscribeProfile = onSnapshot(profileRef, (snap) => {
`;
const authEffectWithSubmissions = `
      if (u) {
        const subsQ = query(collection(db, 'submissions'), where('studentId', '==', u.uid), orderBy('createdAt', 'desc'));
        const unsubscribeSubs = onSnapshot(subsQ, (snap) => {
          const list: any[] = [];
          snap.forEach(d => list.push(d.data()));
          setSubmissions(list);
        });
        
        const profileRef = doc(db, 'users', u.uid);
        unsubscribeProfile = onSnapshot(profileRef, (snap) => {
`;
code = code.replace(authEffectReplace, authEffectWithSubmissions);

fs.writeFileSync('src/App.tsx', code);
