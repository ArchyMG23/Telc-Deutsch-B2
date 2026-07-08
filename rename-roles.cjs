const fs = require('fs');

// 1. LoginPage.tsx
let lp = fs.readFileSync('src/components/LoginPage.tsx', 'utf-8');
lp = lp.replace(/teacher/g, 'admin');
lp = lp.replace(/'admin'/g, "'admin'"); // already handled by global replace
lp = lp.replace(/Professeur/g, 'Admin');
lp = lp.replace(/Code d'accès enseignant/g, "Code d'accès admin");
lp = lp.replace(/B2PROF/g, 'B2ADMIN');
fs.writeFileSync('src/components/LoginPage.tsx', lp);

// 2. App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf-8');
// rename 'admin' to 'super_admin' first
app = app.replace(/role === 'admin'/g, "role === 'super_admin'");
// rename 'teacher' to 'admin'
app = app.replace(/role === 'teacher'/g, "role === 'admin'");

// specifically the role mapping
app = app.replace(/Super Admin/g, "Super Admin");
app = app.replace(/Enseignant/g, "Admin");

app = app.replace(/updateUserRole\(user!.uid, 'admin'\)/g, "updateUserRole(user!.uid, 'super_admin')");
app = app.replace(/updateUserRole\(user\.uid, 'teacher'\)/g, "updateUserRole(user.uid, 'admin')");

// We no longer need to fetch 'teachers' since we have 'admin'
app = app.replace(/where\('role', '==', 'teacher'\)/g, "where('role', '==', 'admin')");

// Also the dashboards:
app = app.replace(/import \{ TeacherDashboard \} from '\.\/components\/TeacherDashboard';/, "import { TeacherDashboard as AdminDashboardView } from './components/TeacherDashboard';");
app = app.replace(/<TeacherDashboard \/>/, "<AdminDashboardView />");

app = app.replace(/import \{ AdminDashboard \} from '\.\/components\/AdminDashboard';/, "import { AdminDashboard as SuperAdminDashboardView } from './components/AdminDashboard';");
app = app.replace(/<AdminDashboard\s/, "<SuperAdminDashboardView ");

// Plus the add exercise button shouldn't be hidden for 'admin'
// "Le super_admin gère ... ajout d'épreuves. L'administrateur peut créer des épreuves."
app = app.replace(/userProfile\?\.role === 'super_admin' \? 'bg-gray-900/g, "(userProfile?.role === 'super_admin' || userProfile?.role === 'admin') ? 'bg-gray-900");
app = app.replace(/userProfile\?\.role === 'super_admin' \|\| userProfile\?\.role === 'admin' && !isUploading/g, "(!isUploading)");

fs.writeFileSync('src/App.tsx', app);

