const fs = require('fs');
let code = fs.readFileSync('src/components/StudentDashboard.tsx', 'utf-8');

const search = `            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {submissions.map(sub => (`;
              
const replace = `            {submissions.length === 0 ? (
              <div className="p-8 text-center bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-500 dark:text-gray-400">Vous n'avez pas encore envoyé de copies.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {submissions.map(sub => (`;

code = code.replace(search, replace);

// Fix the closing tags for the true condition
const search2 = `                  <h3 className="font-bold text-sm group-hover:text-indigo-500 transition-colors truncate">
                    {sub.exerciseTitle}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        )}`;

const replace2 = `                  <h3 className="font-bold text-sm group-hover:text-indigo-500 transition-colors truncate">
                    {sub.exerciseTitle}
                  </h3>
                </div>
              ))}
              </div>
            )}
          </div>
        )}`;

code = code.replace(search2, replace2);

fs.writeFileSync('src/components/StudentDashboard.tsx', code);
