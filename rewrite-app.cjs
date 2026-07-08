const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf-8');

// We will inject the state for the modal
code = code.replace(
  `const [isMenuOpen, setIsMenuOpen] = useState(false);`,
  `const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExercisesModalOpen, setIsExercisesModalOpen] = useState(false);`
);

// We need to change the main render method. Let's extract the sidebar logic
// Wait, the easiest way is to rewrite the return statement.
