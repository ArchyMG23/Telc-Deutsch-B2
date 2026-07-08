import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, updateDoc, doc, setDoc } from 'firebase/firestore';
import { db, createAdminAccount, resetUsersData, resetExercises } from '../lib/firebase';
import { UserProfile, UserRole } from '../types';
import { Users, BookOpen, Settings, Trash2 , Plus, X} from 'lucide-react';
import { Exercise } from '../services/gemini';
import { UploadSection } from './UploadSection';

interface AdminDashboardProps {
  exercises: Exercise[];
  onUpload: (fileData: string, mimeType: string) => void;
  isExtracting: boolean;
  isOnline: boolean;
  deleteExercise: (id: string) => Promise<void>;
}

export function AdminDashboard({ exercises, onUpload, isExtracting, isOnline, deleteExercise }: AdminDashboardProps) {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'exercises' | 'rules'>('users');
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [newAdminPassword, setNewAdminPassword] = useState('');
  const [newAdminName, setNewAdminName] = useState('');
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

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
    <div className="max-w-6xl mx-auto p-6 h-full flex flex-col">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord Super Admin</h1>
      
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'users' ? 'bg-[#FF0000] text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          <Users className="w-5 h-5" /> Utilisateurs
        </button>
        <button 
          onClick={() => setActiveTab('exercises')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'exercises' ? 'bg-[#FF0000] text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          <BookOpen className="w-5 h-5" /> Exercices
        </button>
        <button 
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'rules' ? 'bg-[#FF0000] text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
        >
          <Settings className="w-5 h-5" /> Grilles d'évaluation
        </button>
      </div>

      {activeTab === 'users' && (
        
        <div className="flex flex-col gap-6 h-full overflow-y-auto">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Gestion du Système</h2>
              <div className="flex gap-2">
                <button 
                  onClick={handleResetUsers}
                  disabled={isResetting}
                  className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> {isResetting ? "..." : "Réinitialiser les utilisateurs et soumissions"}
                </button>
                <button 
                  onClick={handleResetExercisesData}
                  disabled={isResetting}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> {isResetting ? "..." : "Réinitialiser les documents uploadés (Exercices)"}
                </button>
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mt-6 mb-3">Créer un compte Admin</h3>
            <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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
              <button type="submit" disabled={isCreatingAdmin} className="bg-[#FF0000] hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm h-[38px]">
                {isCreatingAdmin ? "Création..." : "Créer l'Admin"}
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex-1">

          <table className="w-full text-left text-sm">
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
                    <td className="p-4">{user.displayName || 'Sans nom'}</td>
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
                        className="bg-gray-100 dark:bg-gray-800 border-none rounded-lg text-sm"
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
        <div className="flex flex-col gap-8 h-full">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden p-6">
             <UploadSection onUpload={onUpload} isExtracting={isExtracting} isOnline={isOnline} />
          </div>
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden flex-1 overflow-y-auto">
             <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <tr>
                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Titre</th>
                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Type</th>
                    <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
                  {exercises.map(ex => (
                    <tr key={ex.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <td className="p-4 font-semibold">{ex.title}</td>
                      <td className="p-4 text-gray-500">{ex.type}</td>
                      <td className="p-4 text-right">
                        <button onClick={() => {
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
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="flex flex-col gap-6 h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 overflow-y-auto">
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


