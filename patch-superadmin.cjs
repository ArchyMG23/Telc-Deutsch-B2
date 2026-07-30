const fs = require('fs');
let code = fs.readFileSync('src/components/AdminDashboard.tsx', 'utf-8');

// 1. Add GraduationCap to lucide-react imports
code = code.replace(
  "import { Users, BookOpen, Settings, Trash2 , Plus, X, Eye} from 'lucide-react';",
  "import { Users, BookOpen, Settings, Trash2 , Plus, X, Eye, GraduationCap} from 'lucide-react';"
);

// 2. Import TeacherDashboard
code = code.replace(
  "import { UploadSection } from './UploadSection';",
  "import { UploadSection } from './UploadSection';\nimport { TeacherDashboard } from './TeacherDashboard';"
);

// 3. Update activeTab type
code = code.replace(
  "const [activeTab, setActiveTab] = useState<'users' | 'exercises' | 'rules'>('users');",
  "const [activeTab, setActiveTab] = useState<'users' | 'exercises' | 'rules' | 'corrections'>('users');"
);

// 4. Add new tab button
const tabButtonsTarget = `        <button 
          onClick={() => setActiveTab('rules')}
          className={\`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors \${activeTab === 'rules' ? 'bg-[#FF0000] text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}\`}
        >
          <Settings className="w-5 h-5" /> Grilles d'évaluation
        </button>`;
const tabButtonsReplacement = `        <button 
          onClick={() => setActiveTab('rules')}
          className={\`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors \${activeTab === 'rules' ? 'bg-[#FF0000] text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}\`}
        >
          <Settings className="w-5 h-5" /> Grilles d'évaluation
        </button>
        <button 
          onClick={() => setActiveTab('corrections')}
          className={\`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors \${activeTab === 'corrections' ? 'bg-[#FF0000] text-white' : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'}\`}
        >
          <GraduationCap className="w-5 h-5" /> Corrections
        </button>`;
code = code.replace(tabButtonsTarget, tabButtonsReplacement);

// 5. Add rendering for the new tab
const rulesTabTarget = `      {activeTab === 'rules' && (
        <div className="flex flex-col gap-6 h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 overflow-y-auto">`;
const rulesTabReplacement = `      {activeTab === 'corrections' && (
        <div className="h-full">
          <TeacherDashboard />
        </div>
      )}

      {activeTab === 'rules' && (
        <div className="flex flex-col gap-6 h-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 overflow-y-auto">`;
code = code.replace(rulesTabTarget, rulesTabReplacement);

fs.writeFileSync('src/components/AdminDashboard.tsx', code);
