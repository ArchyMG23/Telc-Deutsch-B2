const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// Replace the huge block of imports if needed
if (!code.includes('UnifiedDashboard')) {
  code = code.replace(
    "import { SuperAdminDashboardView } from './components/SuperAdminDashboardView';",
    "import { UnifiedDashboard } from './components/UnifiedDashboard';\nimport { SuperAdminDashboardView } from './components/SuperAdminDashboardView';"
  );
}

// Replace the main area logic
const startTarget = `{/* Main Content Area */}
      <main className="flex-1 min-h-0 overflow-y-auto bg-gray-50 dark:bg-gray-950 relative">
        <div className="h-full">
          {userProfile?.role === 'super_admin' && !isUploading && !selectedExercise ? (`;

const endTarget = `          )}
        </div>
      </main>`;

const startIndex = code.indexOf('{/* Main Content Area */}');
const endIndex = code.indexOf('</main>', startIndex) + 7;

if (startIndex > -1 && endIndex > -1) {
  const replacement = `{/* Main Content Area */}
      <main className="flex-1 min-h-0 overflow-y-auto bg-white dark:bg-gray-950 relative">
        <div className="h-full">
          {!selectedExercise ? (
            <UnifiedDashboard
              exercises={exercises}
              onUpload={handleUpload}
              isExtracting={isExtracting}
              isOnline={isOnline}
              deleteExercise={async (id) => {
                await deleteDoc(doc(db, "exercises", id));
              }}
              onSelectExercise={(id) => selectExercise(id, false)}
            />
          ) : (
            <TrainingInterface
              key={selectedExercise.id}
              exercise={selectedExercise}
              initialText={currentProgress?.text || ''}
              evaluation={currentProgress?.evaluation || null}
              onTextChange={onTextChange}
              onEvaluate={onEvaluate}
              isEvaluating={isEvaluating}
              onClose={() => selectExercise(null, false)}
              isOnline={isOnline}
              onSaveDraft={onSaveDraft}
              userId={user?.uid}
            />
          )}
        </div>
      </main>`;

  code = code.substring(0, startIndex) + replacement + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code);
}
