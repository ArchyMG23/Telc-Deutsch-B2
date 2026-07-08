const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `<TrainingInterface
              key={selectedExercise.id}
              exercise={selectedExercise}
              initialText={currentProgress?.text || ''}
              evaluation={currentProgress?.evaluation || null}
              onTextChange={onTextChange}
              onEvaluate={onEvaluate}
              isEvaluating={isEvaluating}
              onClose={() => selectExercise(null, false)}
              isOnline={isOnline}
              
              userId={user?.uid}
            />`;

const replacement = `<TrainingInterface
              key={selectedExercise.id}
              exercise={selectedExercise}
              initialText={currentProgress?.text || ''}
              evaluation={currentProgress?.evaluation || null}
              onTextChange={onTextChange}
              onEvaluate={onEvaluate}
              isEvaluating={isEvaluating}
              onExit={() => selectExercise(null, false)}
              isOnline={isOnline}
              isTimerRunning={isTimerRunning}
              setIsTimerRunning={setIsTimerRunning}
              teachers={teachers}
              user={user}
              lastTeacherId={userProfile?.lastTeacherId}
            />`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
