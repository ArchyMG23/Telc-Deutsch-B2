import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db, createAdminAccount, resetUsersData, resetExercises } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { Users, BookOpen, Settings, Trash2 , Plus, X, Eye, GraduationCap, PenTool} from 'lucide-react';
import { Exercise } from '../services/gemini';
import { UploadSection } from './UploadSection';
import { TeacherDashboard } from './TeacherDashboard';

interface AdminDashboardProps {
  exercises: Exercise[];
  onUpload: (fileData: string, mimeType: string) => void;
  isExtracting: boolean;
  isOnline: boolean;
  deleteExercise: (id: string) => Promise<void>;
  onSelectExercise?: (id: string) => void;
}

export function AdminDashboard({ exercises, onUpload, isExtracting, isOnline, deleteExercise, onSelectExercise }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'exercises' | 'rules' | 'corrections'>('users');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [previewExerciseId, setPreviewExerciseId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    const q = query(collection(db, 'users'));
    const snapshot = await getDocs(q);
    const loadedUsers = snapshot.docs.map(doc => doc.data() as UserProfile);
    setUsers(loadedUsers);
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    await updateDoc(doc(db, 'users', userId), { role: newRole });
    loadUsers();
  };

  
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAdminEmail || !newAdminPassword || !newAdminName) return;
    setIsCreatingAdmin(true);
    try {
      await createAdminAccount(newAdminEmail, newAdminPassword, newAdminName);
      setNewAdminEmail('');
      setNewAdminPassword('');
      setNewAdminName('');
      loadUsers();
      alert("Compte Admin créé avec succès !");
    } catch (err: any) {
      alert("Erreur: " + err.message);
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  const handleResetUsers = async () => {
    if (confirm("ATTENTION : Cette action supprimera tous les étudiants, leurs progressions et soumissions. Confirmer ?")) {
      setIsResetting(true);
      try {
        await resetUsersData();
        loadUsers();
        alert("Données utilisateurs réinitialisées.");
        window.location.reload();
      } catch (err: any) {
        alert("Erreur lors de la réinitialisation: " + err.message);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleResetExercisesData = async () => {
    if (confirm("ATTENTION : Cette action supprimera tous les exercices (documents uploadés). Confirmer ?")) {
      setIsResetting(true);
      try {
        await resetExercises();
        alert("Exercices réinitialisés.");
        window.location.reload();
      } catch (err: any) {
        alert("Erreur lors de la réinitialisation: " + err.message);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 w-full flex flex-col space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Tableau de bord Super Admin</h1>
      
      {/* Scrollable Tab Navigation on Mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 shrink-0">
        <button 
          onClick={() => setActiveTab('users')}
          className={`whitespace-nowrap shrink-0 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm transition-colors ${activeTab === 'users' ? 'bg-[#FF0000] text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          <Users className="w-4 h-4 sm:w-5 sm:h-5" /> Utilisateurs
        </button>
        <button 
          onClick={() => setActiveTab('exercises')}
          className={`whitespace-nowrap shrink-0 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm transition-colors ${activeTab === 'exercises' ? 'bg-[#FF0000] text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" /> Exercices
        </button>
        <button 
          onClick={() => setActiveTab('rules')}
          className={`whitespace-nowrap shrink-0 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm transition-colors ${activeTab === 'rules' ? 'bg-[#FF0000] text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" /> Grilles d'évaluation
        </button>
        <button 
          onClick={() => setActiveTab('corrections')}
          className={`whitespace-nowrap shrink-0 flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 rounded-xl font-medium text-xs sm:text-sm transition-colors ${activeTab === 'corrections' ? 'bg-[#FF0000] text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" /> Corrections
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h2 className="text-lg sm:text-xl font-bold">Gestion du Système</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <button 
                  onClick={handleResetUsers}
                  disabled={isResetting}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> {isResetting ? "..." : "Réinitialiser utilisateurs"}
                </button>
                <button 
                  onClick={handleResetExercisesData}
                  disabled={isResetting}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> {isResetting ? "..." : "Réinitialiser exercices uploadés"}
                </button>
              </div>
            </div>
            
            <h3 className="text-base font-semibold mt-6 mb-3">Créer un compte Admin</h3>
            <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Nom complet</label>
                <input type="text" required value={newAdminName} onChange={e => setNewAdminName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-transparent" placeholder="Nom de l'admin" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                <input type="email" required value={newAdminEmail} onChange={e => setNewAdminEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-transparent" placeholder="admin@email.com" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Mot de passe provisoire</label>
                <input type="password" required value={newAdminPassword} onChange={e => setNewAdminPassword(e.target.value)} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg text-sm bg-transparent" placeholder="Minimum 6 caractères" minLength={6} />
              </div>
              <button type="submit" disabled={isCreatingAdmin} className="bg-[#FF0000] hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm h-[38px] transition-colors">
                {isCreatingAdmin ? "Création..." : "Créer l'Admin"}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-auto shadow-sm">
            <table className="w-full text-left text-sm min-w-[500px]">
              <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Nom</th>
                  <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Email</th>
                  <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Rôle</th>
                  <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                {loading ? (
                  <tr><td colSpan={4} className="p-8 text-center text-gray-500">Chargement...</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user.uid} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-medium">{user.displayName || 'Sans nom'}</td>
                      <td className="p-4 text-gray-500">{user.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.role === 'super_admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'admin' ? 'bg-blue-100 text-blue-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <select 
                          value={user.role} 
                          onChange={(e) => handleRoleChange(user.uid, e.target.value as UserRole)}
                          className="bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-xs sm:text-sm p-1.5"
                        >
                          <option value="student">Étudiant</option>
                          <option value="admin">Admin</option>
                          <option value="super_admin">Super Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'exercises' && (
        <div className="flex flex-col gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">
             <UploadSection onUpload={onUpload} isExtracting={isExtracting} isOnline={isOnline} />
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-x-auto shadow-sm">
             <table className="w-full text-left text-sm min-w-[500px]">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Titre</th>
                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Type</th>
                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {exercises.map(ex => (
                    <tr 
                      key={ex.id}
                      onClick={() => setPreviewExerciseId(ex.id)}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    >
                      <td className="p-4 font-semibold">
                        <div className="flex items-center gap-2">
                          <Eye className="w-4 h-4 text-gray-400 shrink-0" />
                          <span className="line-clamp-1">{ex.title}</span>
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 whitespace-nowrap">{ex.type}</td>
                      <td className="p-4 text-right flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        {onSelectExercise && (
                          <button onClick={(e) => {
                            e.stopPropagation();
                            onSelectExercise(ex.id);
                          }} className="p-2 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg" title="Traiter l'exercice">
                            <PenTool className="w-4 h-4" />
                          </button>
                        )}
                        <button onClick={(e) => {
                          e.stopPropagation();
                          if (confirm("Supprimer cet exercice ?")) {
                            deleteExercise(ex.id);
                          }
                        }} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
             </table>
          </div>
          
          {/* Modal Preview */}
          {previewExerciseId && exercises.find(e => e.id === previewExerciseId) && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
              <div className="bg-white dark:bg-gray-900 w-full max-w-4xl rounded-2xl shadow-xl flex flex-col max-h-[90vh] border border-gray-200 dark:border-gray-800">
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-800">
                  <h2 className="text-lg sm:text-2xl font-bold flex items-center gap-2 pr-2">
                    <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-[#FF0000] shrink-0" />
                    <span className="line-clamp-1">{exercises.find(e => e.id === previewExerciseId)?.title}</span>
                  </h2>
                  <button onClick={() => setPreviewExerciseId(null)} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 rounded-full transition-colors shrink-0">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm uppercase text-[#FF0000] mb-2 tracking-wide">Situation / Offre</h4>
                    <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed shadow-sm">
                      {exercises.find(e => e.id === previewExerciseId)?.situation}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm uppercase text-[#FF0000] mb-2 tracking-wide">Consigne</h4>
                    <div className="p-4 sm:p-5 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 whitespace-pre-wrap text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed shadow-sm">
                      {exercises.find(e => e.id === previewExerciseId)?.content}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'corrections' && (
        <div className="min-h-[500px]">
          <TeacherDashboard />
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="flex flex-col gap-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-4 sm:p-6 shadow-sm">

           <div>
             <h2 className="text-2xl font-bold mb-2">Grille d'évaluation Telc B2 (Schriftlicher Ausdruck)</h2>
             <p className="text-gray-500 mb-6">Cette grille est utilisée par l'IA pour évaluer automatiquement les productions écrites des étudiants. Le score maximal est de 45 points.</p>
           </div>
           
           <div className="grid gap-6">
             <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-lg">1. Aufgabenbewältigung (Inhalt)</h3>
                 <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-sm font-bold">15 points</span>
               </div>
               <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Évaluation de la pertinence du contenu et du traitement des 4 points de la consigne.</p>
               <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                 <li><strong>5 pts (x3) :</strong> Les 4 points sont traités de manière appropriée.</li>
                 <li><strong>4 pts (x3) :</strong> 3 points sont traités.</li>
                 <li><strong>3 pts (x3) :</strong> 2 points sont traités ou tous sont traités brièvement.</li>
                 <li><strong>1-2 pts (x3) :</strong> 1 seul point traité ou hors sujet partiel.</li>
                 <li><strong>0 pt :</strong> Hors sujet total.</li>
               </ul>
             </div>

             <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-lg">2. Kommunikative Gestaltung</h3>
                 <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-sm font-bold">15 points</span>
               </div>
               <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Évaluation de la structure formelle, du registre de langue et de la cohérence.</p>
               <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                 <li><strong>5 pts (x3) :</strong> Registre parfait, structure claire, connecteurs logiques variés.</li>
                 <li><strong>4 pts (x3) :</strong> Bon registre, quelques erreurs de structure mineures.</li>
                 <li><strong>3 pts (x3) :</strong> Registre partiellement inadapté, structure basique.</li>
                 <li><strong>1-2 pts (x3) :</strong> Registre inadapté, pas de paragraphes, difficile à suivre.</li>
               </ul>
             </div>

             <div className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
               <div className="flex justify-between items-center mb-3">
                 <h3 className="font-bold text-lg">3. Korrektheit</h3>
                 <span className="bg-[#FF0000] text-white px-3 py-1 rounded-full text-sm font-bold">15 points</span>
               </div>
               <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Évaluation de la grammaire, de l'orthographe et du vocabulaire (syntaxe, morphologie).</p>
               <ul className="list-disc list-inside text-sm text-gray-700 dark:text-gray-300 space-y-1">
                 <li><strong>5 pts (x3) :</strong> Très peu d'erreurs, vocabulaire riche et complexe.</li>
                 <li><strong>4 pts (x3) :</strong> Quelques erreurs qui ne gênent pas la compréhension.</li>
                 <li><strong>3 pts (x3) :</strong> Erreurs fréquentes, vocabulaire limité, compréhension parfois altérée.</li>
                 <li><strong>1-2 pts (x3) :</strong> Beaucoup d'erreurs élémentaires, compréhension difficile.</li>
               </ul>
             </div>
           </div>
        </div>
      )}
    </div>
  );
}


