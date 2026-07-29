const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const targetEffect = `  // Sync Auth & Profile`;

const newEffect = `  // Sync Exercises from Firestore
  useEffect(() => {
    const q = query(collection(db, 'exercises'));
    const unsubscribe = onSnapshot(q, (snap) => {
      const firestoreExercises: Exercise[] = [];
      snap.forEach(doc => {
        firestoreExercises.push(doc.data() as Exercise);
      });
      
      setExercises(prev => {
        const combined = [...firestoreExercises];
        DEFAULT_EXERCISES.forEach(def => {
          if (!combined.some(c => c.id === def.id)) {
            combined.push(def);
          }
        });
        localStorage.setItem('dia_exercises', JSON.stringify(combined));
        return combined;
      });
    }, (error) => {
      console.error("Error fetching exercises:", error);
    });

    return () => unsubscribe();
  }, []);

  // Sync Auth & Profile`;

code = code.replace(targetEffect, newEffect);
fs.writeFileSync('src/App.tsx', code);
