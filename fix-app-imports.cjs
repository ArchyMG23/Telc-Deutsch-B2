const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

if (!code.includes("import { UnifiedDashboard }")) {
  code = code.replace(
    "import { SuperAdminDashboardView }",
    "import { UnifiedDashboard } from './components/UnifiedDashboard';\nimport { SuperAdminDashboardView }"
  );
}

// Remove onSaveDraft if it doesn't exist, we don't need it.
code = code.replace("onSaveDraft={onSaveDraft}", "");

fs.writeFileSync('src/App.tsx', code);
