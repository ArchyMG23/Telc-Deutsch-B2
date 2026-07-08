const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

code = code.replace(
`import { db, createAdminAccount, resetDatabase } from '../lib/firebase';`,
`import { db, createAdminAccount, resetUsersData, resetExercises } from '../lib/firebase';`
);

const oldReset = `  const handleResetDatabase = async () => {
    if (confirm("ATTENTION : Cette action est irréversible. Toutes les données (utilisateurs, soumissions, exercices) seront supprimées. Confirmer ?")) {
      setIsResetting(true);
      try {
        await resetDatabase();
        loadUsers();
        alert("Base de données réinitialisée.");
        window.location.reload();
      } catch (err: any) {
        alert("Erreur lors de la réinitialisation: " + err.message);
      } finally {
        setIsResetting(false);
      }
    }
  };`;

const newReset = `  const handleResetUsers = async () => {
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
  };`;

code = code.replace(oldReset, newReset);

const oldButtons = `<div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Gestion du Système</h2>
              <button 
                onClick={handleResetDatabase}
                disabled={isResetting}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
              >
                <Trash2 className="w-4 h-4" /> {isResetting ? "Réinitialisation..." : "Réinitialiser la Base de Données"}
              </button>
            </div>`;

const newButtons = `<div className="flex justify-between items-center mb-4">
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
            </div>`;

code = code.replace(oldButtons, newButtons);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
