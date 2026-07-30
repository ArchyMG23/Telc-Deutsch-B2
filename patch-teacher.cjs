const fs = require('fs');
let code = fs.readFileSync('src/components/TeacherDashboard.tsx', 'utf-8');

code = code.replace(
  "import { Search, CheckCircle, Clock, ChevronRight, User as UserIcon, LogOut, Send, Highlighter, GraduationCap } from 'lucide-react';",
  "import { Search, CheckCircle, Clock, ChevronRight, User as UserIcon, LogOut, Send, Highlighter, GraduationCap, Eye, FileText } from 'lucide-react';"
);

code = code.replace(
  "import { getDocs, collection, query, orderBy, doc, updateDoc } from 'firebase/firestore';",
  "import { getDocs, collection, query, orderBy, doc, updateDoc, getDoc } from 'firebase/firestore';"
);

code = code.replace(
  "const [selectedSub, setSelectedSub] = useState<Submission | null>(null);",
  "const [selectedSub, setSelectedSub] = useState<Submission | null>(null);\n  const [exerciseDetails, setExerciseDetails] = useState<any>(null);\n  const [showExercise, setShowExercise] = useState(false);"
);

const fetchExTarget = `  const selectSubmission = (sub: Submission) => {
    setSelectedSub(sub);
    setCorrectionData({
      inhaltScore: sub.correction?.inhaltScore || 0,
      strukturScore: sub.correction?.strukturScore || 0,
      spracheScore: sub.correction?.spracheScore || 0,
      overallFeedback: sub.correction?.overallFeedback || '',
      highlightedText: sub.correction?.highlightedText || sub.text
    });
  };`;

const fetchExReplacement = `  const selectSubmission = async (sub: Submission) => {
    setSelectedSub(sub);
    setExerciseDetails(null);
    setShowExercise(false);
    setCorrectionData({
      inhaltScore: sub.correction?.inhaltScore || 0,
      strukturScore: sub.correction?.strukturScore || 0,
      spracheScore: sub.correction?.spracheScore || 0,
      overallFeedback: sub.correction?.overallFeedback || '',
      highlightedText: sub.correction?.highlightedText || sub.text
    });

    try {
      const exDoc = await getDoc(doc(db, 'exercises', sub.exerciseId));
      if (exDoc.exists()) {
        setExerciseDetails(exDoc.data());
      }
    } catch (e) {
      console.error(e);
    }
  };`;

code = code.replace(fetchExTarget, fetchExReplacement);

const htmlTarget = `          <div className="flex-1 bg-white dark:bg-gray-950 p-6 sm:p-10 overflow-y-auto">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{selectedSub.exerciseTitle}</h2>
                <p className="text-gray-500 flex items-center gap-2 mt-1">
                  <UserIcon className="w-4 h-4" /> Étudiant ID: {selectedSub.studentId.substring(0, 8)}...
                </p>
              </div>`;

const htmlReplacement = `          <div className="flex-1 bg-white dark:bg-gray-950 p-6 sm:p-10 overflow-y-auto relative">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{selectedSub.exerciseTitle}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <p className="text-gray-500 flex items-center gap-1 text-sm">
                    <UserIcon className="w-4 h-4" /> Étudiant ID: {selectedSub.studentId.substring(0, 8)}...
                  </p>
                  {exerciseDetails && (
                    <button 
                      onClick={() => setShowExercise(!showExercise)}
                      className="text-[#FF0000] hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 transition-colors border border-red-100 dark:border-red-900"
                    >
                      <Eye className="w-3 h-3" /> {showExercise ? 'Masquer le sujet' : 'Voir le sujet original'}
                    </button>
                  )}
                </div>
              </div>`;

code = code.replace(htmlTarget, htmlReplacement);

const showExTarget = `              {/* Student Text Area with Highlight editing */}
              <div className="space-y-4">`;

const showExReplacement = `              {/* Student Text Area with Highlight editing */}
              <div className="space-y-4">
                {showExercise && exerciseDetails && (
                  <div className="mb-6 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-200 dark:border-gray-800 space-y-4">
                    <div className="flex items-center gap-2 mb-2 text-[#FF0000] font-bold">
                      <FileText className="w-4 h-4" /> Rappel du Sujet
                    </div>
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-bold mb-1">Situation / Offre</h4>
                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{exerciseDetails.situation}</p>
                    </div>
                    <div>
                      <h4 className="text-xs uppercase text-gray-500 font-bold mb-1">Consigne</h4>
                      <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{exerciseDetails.content}</p>
                    </div>
                  </div>
                )}`;

code = code.replace(showExTarget, showExReplacement);

fs.writeFileSync('src/components/TeacherDashboard.tsx', code);
