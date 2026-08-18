import React, { useState, useEffect, useRef } from 'react';
import { useTimer } from '../hooks/useTimer';
import { Exercise, Evaluation } from '../services/gemini';
import { Play, Pause, RotateCcw, CheckCircle, PenTool, Award, Printer, UserCircle, Clock, ArrowLeft } from 'lucide-react';
import { cn } from '../lib/utils';
import Markdown from 'react-markdown';
import { User } from 'firebase/auth';
import { submitExercise } from '../lib/firebase';

interface TrainingInterfaceProps {
  exercise: Exercise;
  initialText: string;
  evaluation: Evaluation | null;
  onTextChange: (text: string) => void;
  onEvaluate: (text: string) => void;
  isEvaluating: boolean;
  isOnline: boolean;
  isTimerRunning: boolean;
  setIsTimerRunning: (val: boolean) => void;
  teachers: any[];
  user: User | null;
  userRole?: string;
  lastTeacherId?: string;
  onExit: () => void;
}

export function TrainingInterface({ 
  exercise, initialText, evaluation, onTextChange, onEvaluate, isEvaluating, isOnline,
  isTimerRunning, setIsTimerRunning, teachers, user, userRole, lastTeacherId, onExit
}: TrainingInterfaceProps) {
  const [text, setText] = useState(initialText);
  const [activeTab, setActiveTab] = useState<'topic' | 'write' | 'eval'>(evaluation ? 'eval' : 'write');
  const [isRedactionFinished, setIsRedactionFinished] = useState(false);
  const { minutes, seconds, isActive, isWarning, isUrgent, isFinished, start, pause, reset } = useTimer(30, true);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Automatically start timer on mount if not evaluated
  useEffect(() => {
    if (!evaluation) {
      start();
    }
  }, [evaluation, start]);

  // Prevent accidental tab close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!evaluation && text.trim().length > 0) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [evaluation, text]);

  const hasEndedRedaction = isFinished || isRedactionFinished || !!evaluation;

  const insertSpecialChar = (char: string) => {
    if (hasEndedRedaction) return;
    const textarea = textareaRef.current;
    if (!textarea) {
      setText(prev => prev + char);
      return;
    }

    const startIdx = textarea.selectionStart;
    const endIdx = textarea.selectionEnd;
    const newText = text.substring(0, startIdx) + char + text.substring(endIdx);
    
    setText(newText);
    
    // Keep focus and place cursor after inserted character
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(startIdx + char.length, startIdx + char.length);
    }, 0);
  };

  // Sync timer state with parent
  useEffect(() => {
    setIsTimerRunning(isActive);
  }, [isActive, setIsTimerRunning]);

  const onTextChangeRef = useRef(onTextChange);
  useEffect(() => {
    onTextChangeRef.current = onTextChange;
  }, [onTextChange]);

  // Sync text changes upwards
  useEffect(() => {
    onTextChangeRef.current(text);
  }, [text]);

  // Switch to eval tab when evaluation arrives
  useEffect(() => {
    if (evaluation) {
      setActiveTab('eval');
      pause();
    }
  }, [evaluation, pause]);

  const handleEvaluate = () => {
    if (!isOnline) return;
    pause();
    onEvaluate(text);
  };

  const handleReset = () => {
    reset(30);
    setIsRedactionFinished(false);
  };

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendToTeacher = async (_: string) => {
    if (!user) return;
    setIsSubmitting(true);
    try {
      await submitExercise({
        studentId: user.uid,
        exerciseId: exercise.id,
        exerciseTitle: exercise.title,
        text,
        status: 'soumis'
      });
      alert("Travail envoyé aux correcteurs !");
    } catch (e) {
      console.error(e);
      alert("Erreur lors de l'envoi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>Ma Rédaction - ${exercise.title}</title></head>
          <body style="font-family: sans-serif; padding: 40px; line-height: 1.6;">
            <h1>${exercise.title}</h1>
            <p><strong>Type:</strong> ${exercise.type}</p>
            <hr />
            <div style="white-space: pre-wrap; font-size: 1.2rem; margin-top: 2rem;">${text}</div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const wordCount = text.trim().split(/\s+/).filter(w => w.length > 0).length;

  return (
    <div className="flex flex-col h-full w-full min-h-0 flex-1 bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-2.5 sm:py-3.5 border-b border-gray-200 dark:border-gray-800 shrink-0 select-none bg-white dark:bg-gray-900 z-10 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          {(!!evaluation || userRole === 'super_admin') && (
            <button 
              onClick={onExit}
              className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center shrink-0 cursor-pointer"
              title="Quitter et revenir aux sujets"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          )}
          <h1 className="text-sm sm:text-base md:text-lg font-bold truncate max-w-[140px] sm:max-w-xs md:max-w-md">{exercise.title}</h1>
          <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-semibold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full shrink-0 border border-gray-200 dark:border-gray-700">
            {exercise.type}
          </span>
        </div>

        {/* Timer Module & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {!evaluation && (
            <>
              {/* Countdown Timer with warning colors */}
              <div className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl font-mono text-sm sm:text-base md:text-lg font-bold transition-all select-none border",
                isFinished ? "bg-red-600 text-white border-red-700 shadow-md shadow-red-500/20" :
                isUrgent ? "bg-red-600 text-white border-red-500 animate-pulse shadow-md shadow-red-500/30 font-black" :
                isWarning ? "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 border-red-300 dark:border-red-800/60 animate-pulse" :
                "bg-gray-100 dark:bg-gray-800/90 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700"
              )}>
                <Clock className={cn("w-4 h-4", isFinished || isUrgent ? "text-white" : isWarning ? "text-red-500 animate-spin" : "text-gray-400")} />
                <span>{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}</span>
              </div>

              {!hasEndedRedaction && (
                <button
                  onClick={() => {
                    if (confirm("Voulez-vous valider votre rédaction ? Vous pourrez ensuite demander une correction IA ou l'envoyer à un enseignant.")) {
                      pause();
                      setIsRedactionFinished(true);
                    }
                  }}
                  disabled={text.trim().length === 0}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[#FF0000] hover:bg-red-650 disabled:opacity-50 text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm shadow-red-500/10 flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Terminer la rédaction</span>
                  <span className="inline sm:hidden">Terminer</span>
                </button>
              )}
            </>
          )}

          {hasEndedRedaction ? (
            <div className="flex items-center gap-1.5 sm:gap-2">
               <button 
                onClick={handlePrint}
                className="p-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl transition-colors shrink-0"
                title="Imprimer pour correction manuelle"
              >
                <Printer className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              
              {/* Teacher Dropdown */}
              <div className="relative group">
                <button 
                  disabled={isSubmitting || teachers.length === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs sm:text-sm font-medium rounded-xl transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  <span className="hidden sm:inline">Enseignant</span>
                  <span className="inline sm:hidden">Prof</span>
                </button>
                <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                   <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                     <p className="text-[10px] font-bold text-gray-400 uppercase px-2">Choisir un prof</p>
                   </div>
                   <div className="p-1 max-h-60 overflow-y-auto w-full">
                     {teachers.map(t => (
                       <button
                         key={t.uid}
                         disabled={t.uid === lastTeacherId}
                         onClick={() => handleSendToTeacher(t.uid)}
                         className="w-full text-left p-2 rounded-lg text-xs hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-between disabled:opacity-30"
                       >
                         <span className="truncate pr-2">{t.displayName || 'Prof sans nom'}</span>
                         {t.uid === lastTeacherId && <span className="text-[8px] text-red-500 shrink-0">Dernier</span>}
                       </button>
                     ))}
                     {teachers.length === 0 && <p className="p-4 text-xs text-gray-500 text-center">Aucun prof dispo</p>}
                   </div>
                </div>
              </div>

               <button
                onClick={handleEvaluate}
                disabled={text.trim().length === 0 || isEvaluating || !isOnline}
                className="flex items-center gap-1.5 px-3 py-1.5 sm:px-5 sm:py-2 bg-[#FF0000] hover:bg-red-700 disabled:opacity-50 text-white text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm"
              >
                {isEvaluating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                <span className="hidden sm:inline">Correction IA</span>
                <span className="inline sm:hidden">IA</span>
              </button>
            </div>
          ) : (
            isActive && (
              <p className="hidden md:block text-[10px] text-orange-500 font-bold uppercase tracking-wider animate-pulse">En cours...</p>
            )
          )}
        </div>
      </header>

      {/* Persistent Mobile Tab Navigation Bar */}
      {!evaluation ? (
        <div className="md:hidden flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 z-10">
          <button
            onClick={() => setActiveTab('topic')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer",
              activeTab === 'topic' ? "border-[#FF0000] text-[#FF0000]" : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600"
            )}
          >
            Sujet
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer",
              activeTab === 'write' ? "border-[#FF0000] text-[#FF0000]" : "border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600"
            )}
          >
            Ma Rédaction
          </button>
        </div>
      ) : (
        <div className="md:hidden flex border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shrink-0 z-10">
          <button
            onClick={() => setActiveTab('topic')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer",
              activeTab === 'topic' ? "border-[#FF0000] text-[#FF0000]" : "border-transparent text-gray-400 dark:text-gray-500"
            )}
          >
            Sujet
          </button>
          <button
            onClick={() => setActiveTab('write')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer",
              activeTab === 'write' ? "border-[#FF0000] text-[#FF0000]" : "border-transparent text-gray-400 dark:text-gray-500"
            )}
          >
            <PenTool className="w-3.5 h-3.5" />
            Rédaction
          </button>
          <button
            onClick={() => setActiveTab('eval')}
            className={cn(
              "flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 border-b-2 transition-colors cursor-pointer",
              activeTab === 'eval' ? "border-[#FF0000] text-[#FF0000]" : "border-transparent text-gray-400 dark:text-gray-500"
            )}
          >
            <Award className="w-3.5 h-3.5" />
            Correction ({evaluation.score}/45)
          </button>
        </div>
      )}

      {/* Split Screen Content */}
      <main className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden w-full h-full">
        {/* Left Column: Topic (Situation and Consigne) */}
        <div className={cn(
          "w-full md:w-1/2 h-full min-h-0 flex flex-col overflow-y-auto p-4 sm:p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/40",
          activeTab === 'topic' ? "flex" : "hidden md:flex"
        )}>
          <div className="mb-6 sm:mb-8">
            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF0000]" />
              Situation / Offre
            </h2>
            <div className="p-4 sm:p-6 bg-white dark:bg-gray-800/90 rounded-2xl border border-gray-200/80 dark:border-gray-700/80 shadow-xs">
              <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-[15px] sm:text-base leading-relaxed text-gray-800 dark:text-gray-200">
                {exercise.situation}
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              Consigne (Aufgabe)
            </h2>
            <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap text-[15px] sm:text-base leading-relaxed text-gray-800 dark:text-gray-200 bg-white/60 dark:bg-gray-800/30 p-4 sm:p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
              {exercise.content}
            </div>
          </div>
        </div>

        {/* Right Column: Writing Area & Evaluation */}
        <div className={cn(
          "w-full md:w-1/2 h-full min-h-0 flex flex-col bg-white dark:bg-gray-950 overflow-hidden",
          activeTab === 'topic' ? "hidden md:flex" : "flex"
        )}>
          {/* Desktop Tabs when evaluated */}
          {evaluation && (
            <div className="hidden md:flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shrink-0">
              <button
                onClick={() => setActiveTab('write')}
                className={cn(
                  "flex-1 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer",
                  activeTab === 'write' ? "border-[#FF0000] text-[#FF0000]" : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <PenTool className="w-4 h-4 shrink-0" />
                Ma Rédaction
              </button>
              <button
                onClick={() => setActiveTab('eval')}
                className={cn(
                  "flex-1 py-3 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 border-b-2 transition-colors cursor-pointer",
                  activeTab === 'eval' ? "border-[#FF0000] text-[#FF0000]" : "border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"
                )}
              >
                <Award className="w-4 h-4 shrink-0" />
                Correction ({evaluation.score}/45)
              </button>
            </div>
          )}

          {activeTab === 'write' || activeTab === 'topic' ? (
            <div className="relative flex-1 min-h-0 flex flex-col w-full h-full overflow-hidden">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={hasEndedRedaction && !evaluation}
                placeholder="Sehr geehrte Damen und Herren, ..."
                className={cn(
                  "flex-1 min-h-0 w-full p-4 sm:p-6 md:p-8 resize-none outline-none bg-transparent text-[15px] sm:text-base md:text-lg leading-relaxed placeholder:text-gray-400 dark:placeholder:text-gray-600 transition-opacity font-normal overflow-y-auto",
                  hasEndedRedaction && !evaluation && "opacity-50 grayscale cursor-not-allowed"
                )}
                spellCheck={false}
                autoFocus
              />

              {hasEndedRedaction && !evaluation && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] pointer-events-none p-4 w-full z-20">
                  <div className="bg-gray-900 text-white border border-gray-700 px-6 py-5 rounded-2xl shadow-2xl font-bold flex flex-col items-center gap-3 text-center max-w-sm pointer-events-auto">
                    {isFinished ? (
                      <>
                        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                          <Clock className="w-6 h-6 animate-pulse" />
                        </div>
                        <span className="text-lg">Temps écoulé (30 min) !</span>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                          <CheckCircle className="w-6 h-6" />
                        </div>
                        <span className="text-lg">Rédaction validée !</span>
                      </>
                    )}
                    <p className="text-xs text-gray-300 font-normal">Cliquez sur « Correction IA » ou « Enseignant » en haut pour obtenir votre évaluation détaillée.</p>
                  </div>
                </div>
              )}

              {/* German Special Characters helper panel */}
              {!hasEndedRedaction && (
                <div className="px-4 sm:px-6 py-2 border-t border-gray-200 dark:border-gray-800 bg-gray-50/80 dark:bg-gray-900/50 flex items-center justify-between gap-2 flex-wrap shrink-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mr-1 select-none">
                      Caractères Allemands :
                    </span>
                    {['ä', 'ö', 'ü', 'ß', 'Ä', 'Ö', 'Ü'].map(char => (
                      <button
                        key={char}
                        type="button"
                        onClick={() => insertSpecialChar(char)}
                        className="w-8 h-8 sm:w-9 sm:h-9 text-sm sm:text-base font-semibold bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xs active:scale-95 transition-all text-gray-800 dark:text-gray-200 flex items-center justify-center shrink-0 cursor-pointer"
                        title={`Insérer ${char}`}
                      >
                        {char}
                      </button>
                    ))}
                  </div>

                  {/* Autosave status indicator */}
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400 dark:text-gray-500 font-medium select-none">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="hidden sm:inline">Sauvegarde auto</span>
                  </div>
                </div>
              )}

              {/* Word Count Footer */}
              <div className="px-4 sm:px-6 py-2.5 border-t border-gray-200 dark:border-gray-800 text-xs font-semibold text-gray-500 dark:text-gray-400 flex items-center justify-between bg-white dark:bg-gray-950 shrink-0 select-none">
                <span className={cn(
                  "font-mono font-bold text-xs sm:text-sm",
                  wordCount >= 150 && wordCount <= 200 ? "text-emerald-600 dark:text-emerald-400" :
                  wordCount > 200 ? "text-amber-600 dark:text-amber-400" : "text-gray-700 dark:text-gray-300"
                )}>
                  {wordCount} mots
                </span>
                <span className="text-[11px] text-gray-400 font-normal">Objectif Telc B2 : 150 – 200 mots</span>
              </div>
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-8">
              {evaluation && (
                <div className="space-y-6 sm:space-y-8">
                   <div className="text-center mb-6 sm:mb-10">
                     <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white dark:bg-gray-900 border-8 border-gray-100 dark:border-gray-800 shadow-xl relative mb-4 sm:mb-6">
                       <span className="text-3xl sm:text-4xl font-black text-[#FF0000]">{evaluation.score}</span>
                       <div className="absolute inset-0 rounded-full border-4 border-[#FF0000] border-t-transparent animate-[spin_3s_linear_infinite]" />
                     </div>
                     <div className="prose dark:prose-invert max-w-2xl mx-auto italic text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-4 sm:p-6 rounded-2xl">
                       <Markdown>{evaluation.overallFeedback}</Markdown>
                     </div>
                   </div>

                   <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden shadow-sm mb-8">
                     <div className="overflow-x-auto">
                       <table className="w-full text-left text-sm">
                         <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
                           <tr>
                             <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Critère (Telc B2)</th>
                             <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300">Feedback</th>
                             <th className="px-4 py-3 font-semibold text-gray-700 dark:text-gray-300 text-right">Points</th>
                           </tr>
                         </thead>
                         <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                           <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                             <td className="px-4 py-4 align-top w-1/4">
                               <div className="font-bold text-gray-900 dark:text-white mb-1">Aufgabenbewältigung</div>
                               <div className="text-xs text-gray-500">Inhaltliche Angemessenheit</div>
                             </td>
                             <td className="px-4 py-4 align-top prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400">
                               <Markdown>{evaluation.inhalt}</Markdown>
                             </td>
                             <td className="px-4 py-4 align-top text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                               {evaluation.inhaltScore} <span className="text-gray-400 font-normal">/ 15</span>
                             </td>
                           </tr>
                           <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                             <td className="px-4 py-4 align-top w-1/4">
                               <div className="font-bold text-gray-900 dark:text-white mb-1">Kommunikative Gestaltung</div>
                               <div className="text-xs text-gray-500">Textaufbau, Verknüpfungen</div>
                             </td>
                             <td className="px-4 py-4 align-top prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400">
                               <Markdown>{evaluation.struktur}</Markdown>
                             </td>
                             <td className="px-4 py-4 align-top text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                               {evaluation.strukturScore} <span className="text-gray-400 font-normal">/ 15</span>
                             </td>
                           </tr>
                           <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                             <td className="px-4 py-4 align-top w-1/4">
                               <div className="font-bold text-gray-900 dark:text-white mb-1">Korrektheit</div>
                               <div className="text-xs text-gray-500">Syntax, Morphologie, Rechtschreibung</div>
                             </td>
                             <td className="px-4 py-4 align-top prose dark:prose-invert prose-sm max-w-none text-gray-600 dark:text-gray-400">
                               <Markdown>{evaluation.sprache}</Markdown>
                             </td>
                             <td className="px-4 py-4 align-top text-right font-bold text-gray-900 dark:text-white whitespace-nowrap">
                               {evaluation.spracheScore} <span className="text-gray-400 font-normal">/ 15</span>
                             </td>
                           </tr>
                         </tbody>
                         <tfoot className="bg-gray-50 dark:bg-gray-900 border-t-2 border-gray-200 dark:border-gray-700">
                           <tr>
                             <td colSpan={2} className="px-4 py-4 text-right font-bold text-gray-900 dark:text-white">Note Globale (Schriftlicher Ausdruck)</td>
                             <td className="px-4 py-4 text-right font-black text-lg text-[#FF0000]">{evaluation.score} <span className="text-sm font-normal text-gray-500">/ 45</span></td>
                           </tr>
                         </tfoot>
                       </table>
                     </div>
                   </div>
                   
                   {evaluation.correctedText && (
                     <div className="mt-8">
                       <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
                         <Award className="w-5 h-5" /> 
                         Proposition de correction idéale (Niveau B2)
                       </h3>
                       <div className="bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 rounded-2xl p-6 prose dark:prose-invert max-w-none text-gray-800 dark:text-gray-200">
                         <Markdown>{evaluation.correctedText}</Markdown>
                       </div>
                     </div>
                   )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FeedbackCard({ title, content, score, maxScore }: { title: string, content: string, score: number, maxScore: number }) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-xl p-5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400">{title}</h3>
        <span className="px-2 py-0.5 bg-gray-200 dark:bg-gray-800 rounded text-xs font-mono font-bold">
          {score} / {maxScore}
        </span>
      </div>
      <div className="prose dark:prose-invert prose-sm max-w-none text-gray-700 dark:text-gray-300">
        <Markdown>{content}</Markdown>
      </div>
    </div>
  );
}
