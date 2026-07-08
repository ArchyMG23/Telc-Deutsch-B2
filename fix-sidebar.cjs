const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  `                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold truncate text-sm">{ex.title}</h3>
                    {isDone ? (
                      <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                    ) : hasStarted ? (
                      <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                    ) : null}
                  </div>`,
  `                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold truncate text-sm">{ex.title}</h3>
                    <div className="flex items-center gap-1">
                      {isDone ? (
                        <CheckCircle className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                      ) : hasStarted ? (
                        <Clock className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                      ) : null}
                      {(userProfile?.role === 'admin' || userProfile?.role === 'super_admin') && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Supprimer cet exercice pour tout le monde ?")) {
                              deleteDoc(doc(db, "exercises", ex.id));
                            }
                          }}
                          className="p-1 text-red-400 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors"
                          title="Supprimer l'exercice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>`
);

// We need to import Trash2 from lucide-react if it's not imported in App.tsx
if (!code.includes('Trash2')) {
  code = code.replace(
    "import { Plus, Award, WifiOff, PenTool, CheckCircle, Clock, Search, LogOut, Upload, FileText, User as UserIcon, LogIn, ChevronLeft, ShieldCheck } from 'lucide-react';",
    "import { Plus, Award, WifiOff, PenTool, CheckCircle, Clock, Search, LogOut, Upload, FileText, User as UserIcon, LogIn, ChevronLeft, ShieldCheck, Trash2 } from 'lucide-react';"
  );
}

fs.writeFileSync('src/App.tsx', code);
