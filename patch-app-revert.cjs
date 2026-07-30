const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target2 = `          ) : userProfile?.role === 'admin' && !isUploading && !selectedExercise ? (
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

const replacement2 = `          ) : userProfile?.role === 'admin' && !isUploading && !selectedExercise ? (
            <AdminDashboardView />
          ) : isUploading ? (`;

code = code.replace(target2, replacement2);

fs.writeFileSync('src/App.tsx', code);
