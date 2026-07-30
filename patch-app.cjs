const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target1 = `            <SuperAdminDashboardView 
              exercises={exercises} 
              onUpload={handleUpload}
              isExtracting={isExtracting}
              isOnline={isOnline}
              deleteExercise={async (id) => {
                await deleteDoc(doc(db, "exercises", id));
              }}
            />`;

const replacement1 = `            <SuperAdminDashboardView 
              exercises={exercises} 
              onUpload={handleUpload}
              isExtracting={isExtracting}
              isOnline={isOnline}
              deleteExercise={async (id) => {
                await deleteDoc(doc(db, "exercises", id));
              }}
              onSelectExercise={selectExercise}
            />`;

code = code.replace(target1, replacement1);

// We should also pass it to AdminDashboardView if they want it for standard admin!
const target2 = `          ) : userProfile?.role === 'admin' && !isUploading && !selectedExercise ? (
            <AdminDashboardView />
          ) : isUploading ? (`;

const replacement2 = `          ) : userProfile?.role === 'admin' && !isUploading && !selectedExercise ? (
            <AdminDashboardView 
              exercises={exercises} 
              onUpload={handleUpload}
              isExtracting={isExtracting}
              isOnline={isOnline}
              deleteExercise={async (id) => {
                await deleteDoc(doc(db, "exercises", id));
              }}
              onSelectExercise={selectExercise}
            />
          ) : isUploading ? (`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code);
