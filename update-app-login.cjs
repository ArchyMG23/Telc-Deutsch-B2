const fs = require('fs');

let appCode = fs.readFileSync('src/App.tsx', 'utf-8');

appCode = appCode.replace(
  "import { TeacherDashboard } from './components/TeacherDashboard';",
  "import { TeacherDashboard } from './components/TeacherDashboard';\nimport { LoginPage } from './components/LoginPage';"
);

appCode = appCode.replace(
  "export default function App() {\n  const [user, setUser] = useState<User | null>(null);",
  "export default function App() {\n  const [user, setUser] = useState<User | null>(null);\n  const [isLoadingAuth, setIsLoadingAuth] = useState(true);"
);

appCode = appCode.replace(
  "      } else {\n        setUserProfile(null);\n      }\n    });\n    return () => {\n      unsubscribeAuth();\n      if (unsubscribeProfile) unsubscribeProfile();\n    };\n  }, []);",
  "      } else {\n        setUserProfile(null);\n      }\n      setIsLoadingAuth(false);\n    });\n    return () => {\n      unsubscribeAuth();\n      if (unsubscribeProfile) unsubscribeProfile();\n    };\n  }, []);"
);

appCode = appCode.replace(
  "// Email login/signup states\n  const [email, setEmail] = useState('');\n  const [password, setPassword] = useState('');\n  const [fullName, setFullName] = useState('');\n  const [emailRole, setEmailRole] = useState<'student' | 'teacher'>('student');\n  const [showEmailForm, setShowEmailForm] = useState(false);\n  const [isSignUp, setIsSignUp] = useState(false);\n  const [authLoading, setAuthLoading] = useState(false);\n  const [teacherCode, setTeacherCode] = useState('');\n\n  const handleEmailAuth = async (e: React.FormEvent) => {\n    e.preventDefault();\n    if (!email || !password) {\n      alert(\"Veuillez remplir tous les champs obligatoires.\");\n      return;\n    }\n    if (isSignUp && !fullName) {\n      alert(\"Veuillez saisir votre nom complet.\");\n      return;\n    }\n    if (isSignUp && emailRole === 'teacher' && teacherCode.trim().toUpperCase() !== 'B2PROF') {\n      alert(\"Le code d'accès enseignant est incorrect. Veuillez utiliser le bon code pour créer un compte Prof (Ex: B2PROF).\");\n      return;\n    }\n    setAuthLoading(true);\n    try {\n      if (isSignUp) {\n        await signUpWithEmail(email, password, fullName, emailRole);\n      } else {\n        await loginWithEmail(email, password);\n      }\n    } catch (error: any) {\n      console.error(error);\n      alert(error.message || \"Erreur d'authentification\");\n    } finally {\n      setAuthLoading(false);\n    }\n  };\n",
  ""
);


const authJsxToRemoveStart = `            {/* User Session and Cloud Sync */}`;
const authJsxToRemoveEnd = `            {!import.meta.env.VITE_GEMINI_API_KEY ? (`;

const startIdx = appCode.indexOf(authJsxToRemoveStart);
const endIdx = appCode.indexOf(authJsxToRemoveEnd);

if (startIdx !== -1 && endIdx !== -1) {
  // Replace the user session block with just the logged in state since we only reach here if user is logged in
  const replacement = `            {/* User Session and Cloud Sync */}
            <div className="mb-6">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {user?.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate leading-none mb-1">{user?.displayName || 'Utilisateur'}</p>
                    <p className="text-[10px] text-green-600 dark:text-green-400 flex items-center gap-1">
                      <Cloud className="w-2 h-2" /> {userProfile?.role === 'admin' ? 'Super Admin' : userProfile?.role === 'teacher' ? 'Enseignant' : 'Étudiant'}
                    </p>
                    {userProfile?.email === 'yombivictor@gmail.com' && userProfile?.role !== 'admin' && (
                      <button 
                        onClick={() => updateUserRole(user!.uid, 'admin')}
                        className="mt-2 w-full text-[10px] bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded transition-colors font-bold"
                      >
                        Débloquer Admin
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Role Switcher */}
                <div className="mb-3">
                  {userProfile?.role === 'teacher' ? (
                    <button 
                      onClick={() => user && updateUserRole(user.uid, 'student')}
                      className="w-full py-1.5 px-3 rounded-lg text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-750 hover:bg-[#FF0000] hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Users className="w-3.5 h-3.5" /> Basculer en vue Étudiant
                    </button>
                  ) : userProfile?.role === 'student' ? (
                    <button
                      onClick={() => {
                        if (user) {
                          const code = prompt("Veuillez saisir le code d'accès enseignant pour activer le rôle de 'Prof' :");
                          if (code === null) return;
                          if (code.trim().toUpperCase() === "B2PROF") {
                            updateUserRole(user.uid, 'teacher');
                            alert("Rôle Enseignant activé !");
                          } else {
                            alert("Code d'accès enseignant incorrect.");
                          }
                        }
                      }}
                      className="w-full py-1 px-2 text-[9px] font-medium text-gray-400 hover:text-[#FF0000] hover:underline transition-all text-center"
                    >
                      ⚠️ Déverrouiller l'accès Enseignant
                    </button>
                  ) : null}
                </div>

                <div className="border-t border-gray-100 dark:border-gray-700/50 pt-2 space-y-1">
                  {userProfile?.role === 'admin' && (
                    <button 
                      onClick={() => {
                        setIsUploading(false);
                        selectExercise(null);
                      }}
                      className="w-full py-1.5 px-3 rounded-lg text-[10px] font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Tableau de bord Admin
                    </button>
                  )}
                  <button 
                    onClick={logout}
                    className="w-full py-1.5 px-3 rounded-lg text-[10px] font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Se déconnecter
                  </button>
                </div>
              </div>
            </div>

            `;
  appCode = appCode.substring(0, startIdx) + replacement + appCode.substring(endIdx);
}

appCode = appCode.replace(
  "  return (\n    <div className=\"flex flex-col h-[100dvh] bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans overflow-hidden\">",
  "  if (isLoadingAuth) {\n    return (\n      <div className=\"min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950\">\n        <div className=\"w-8 h-8 border-4 border-[#FF0000]/30 border-t-[#FF0000] rounded-full animate-spin\" />\n      </div>\n    );\n  }\n\n  if (!user) {\n    return <LoginPage />;\n  }\n\n  return (\n    <div className=\"flex flex-col h-[100dvh] bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans overflow-hidden\">"
);


fs.writeFileSync('src/App.tsx', appCode);

