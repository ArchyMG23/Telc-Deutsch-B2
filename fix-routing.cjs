const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

code = code.replace(
  `          {userProfile?.role === 'super_admin' && !isUploading && !selectedExercise ? (
            <SuperAdminDashboardView 
              exercises={exercises} 
              onUpload={handleUpload}
              isExtracting={isExtracting}
              isOnline={isOnline}
              deleteExercise={async (id) => {
                await deleteDoc(doc(db, "exercises", id));
              }}
            />
          ) : userProfile?.role === 'admin' ? (
            <AdminDashboardView />
          ) : isUploading ? (`,
  `          {userProfile?.role === 'super_admin' && !isUploading && !selectedExercise ? (
            <SuperAdminDashboardView 
              exercises={exercises} 
              onUpload={handleUpload}
              isExtracting={isExtracting}
              isOnline={isOnline}
              deleteExercise={async (id) => {
                await deleteDoc(doc(db, "exercises", id));
              }}
            />
          ) : userProfile?.role === 'admin' && !isUploading && !selectedExercise ? (
            <AdminDashboardView />
          ) : isUploading ? (`
);

fs.writeFileSync('src/App.tsx', code);
