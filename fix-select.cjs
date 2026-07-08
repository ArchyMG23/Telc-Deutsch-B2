const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');
code = code.replace(
  '<option value="student">Étudiant</option>\n                        <option value="admin">Admin</option>\n                        <option value="super_admin">Super Admin</option>',
  '<option value="student">Élève</option>\n                        <option value="admin">Administrateur</option>\n                        <option value="super_admin">Super Admin</option>'
);

// in case it got duplicated:
code = code.replace(
  '<option value="student">Étudiant</option>\n                        <option value="teacher">Enseignant</option>\n                        <option value="admin">Admin</option>',
  '<option value="student">Élève</option>\n                        <option value="admin">Administrateur</option>\n                        <option value="super_admin">Super Admin</option>'
);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
