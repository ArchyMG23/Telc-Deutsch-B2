const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

const target = `      } else {
        setUserProfile(null);
        setIsLoadingAuth(false);
      }
    });

    return (`;

const replacement = `      } else {
        setUserProfile(null);
        setIsLoadingAuth(false);
      }
    });
    
    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, []);

  if (isLoadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border-4 border-[#FF0000] border-t-transparent animate-spin"></div>
          <p className="text-sm text-gray-500 font-medium animate-pulse">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  const sortedExercises = exercises.sort((a, b) => a.title.localeCompare(b.title));
  const filteredExercises = sortedExercises.filter(ex => 
    ex.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    ex.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
