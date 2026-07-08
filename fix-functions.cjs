const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `  const sortedExercises = exercises.sort((a, b) => a.title.localeCompare(b.title));
  const filteredExercises = sortedExercises.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (`;

const functionsToAdd = `
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExercisesModalOpen, setIsExercisesModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const selectedExercise = useMemo(() => exercises.find(e => e.id === selectedId), [exercises, selectedId]);
  const currentProgress = selectedId ? progress[selectedId] : null;

  const selectExercise = (id: string | null, upload: boolean = false) => {
    setSelectedId(id);
    setIsUploading(upload);
    setIsMenuOpen(false);
  };

  const handleUpload = async (file: File) => {
    if (!userProfile) return;
    setIsExtracting(true);
    try {
      const extracted = await extractExercises(file);
      const newExercises = [];
      for (const ex of extracted) {
        const newEx = {
          ...ex,
          id: \`uploaded-\${Date.now()}-\${Math.random().toString(36).substring(2, 9)}\`,
          createdAt: new Date().toISOString()
        };
        newExercises.push(newEx);
        if (isOnline) {
          await setDoc(doc(db, "exercises", newEx.id), newEx);
        }
      }
      
      const updated = [...exercises, ...newExercises];
      setExercises(updated);
      localStorage.setItem('dia_exercises', JSON.stringify(updated));
      setIsUploading(false);
      if (newExercises.length > 0) {
        selectExercise(newExercises[0].id);
      }
      alert(\`\${newExercises.length} sujet(s) extrait(s) avec succès.\`);
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'extraction des sujets.");
    } finally {
      setIsExtracting(false);
    }
  };

  const onTextChange = (text: string) => {
    if (!selectedId || !user) return;
    const newProgress = { ...progress, [selectedId]: { ...progress[selectedId], text } };
    setProgress(newProgress);
    localStorage.setItem('dia_progress', JSON.stringify(newProgress));
    
    if (isOnline) {
      setDoc(doc(db, 'users', user.uid, 'progress', selectedId), { text, updatedAt: serverTimestamp() }, { merge: true })
        .catch(err => handleFirestoreError(err, OperationType.UPDATE, \`users/\${user.uid}/progress/\${selectedId}\`));
    }
  };

  const onEvaluate = async () => {
    if (!selectedExercise || !currentProgress?.text || !user || !userProfile) return;
    if (!isOnline) {
      alert("Connexion internet requise pour l'évaluation.");
      return;
    }
    
    setIsEvaluating(true);
    try {
      const result = await evaluateWriting(selectedExercise, currentProgress.text);
      const newProgress = { ...progress, [selectedId!]: { ...currentProgress, evaluation: result } };
      setProgress(newProgress);
      localStorage.setItem('dia_progress', JSON.stringify(newProgress));

      const submission = {
        studentId: user.uid,
        studentName: userProfile.displayName || user.email,
        exerciseId: selectedExercise.id,
        exerciseTitle: selectedExercise.title,
        text: currentProgress.text,
        evaluation: result,
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(collection(db, 'submissions')), submission);
      
      await setDoc(doc(db, 'users', user.uid, 'progress', selectedId!), 
        { evaluation: result, updatedAt: serverTimestamp() }, 
        { merge: true }
      );
      
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Erreur lors de l'évaluation.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const sortedExercises = exercises.sort((a, b) => a.title.localeCompare(b.title));
  const filteredExercises = sortedExercises.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (`;

code = code.replace(target, functionsToAdd);
fs.writeFileSync('src/App.tsx', code);
