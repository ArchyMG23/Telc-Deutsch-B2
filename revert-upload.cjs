const fs = require('fs');
let code = fs.readFileSync('src/components/UploadSection.tsx', 'utf-8');

const target = `  return (
    <div className="w-full">
      <div 
        {...getRootProps()} 
        className={\`
          relative overflow-hidden
          border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
          \${!isOnline ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50' :
            isDragActive 
            ? 'border-[#FF0000] bg-red-50 dark:bg-red-900/10 scale-[0.98]' 
            : 'border-gray-300 dark:border-gray-700 hover:border-[#FF0000] hover:bg-gray-50 dark:hover:bg-gray-800/50'
          }
        \`}
      >`;

const replacement = `  return (
    <div className="max-w-2xl mx-auto w-full p-8">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-black mb-2 text-gray-900 dark:text-white tracking-tight">Ajouter un sujet Telc B2</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Formats supportés : PDF, JPG, PNG (Max 5MB)</p>
      </div>

      <div 
        {...getRootProps()} 
        className={\`
          relative overflow-hidden
          border-2 border-dashed rounded-3xl p-12 text-center cursor-pointer transition-all duration-300
          \${!isOnline ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50' :
            isDragActive 
            ? 'border-[#FF0000] bg-red-50 dark:bg-red-900/10 scale-[0.98]' 
            : 'border-gray-200 dark:border-gray-700 hover:border-[#FF0000] hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:shadow-xl hover:shadow-red-500/5'
          }
        \`}
      >`;
      
code = code.replace(target, replacement);
fs.writeFileSync('src/components/UploadSection.tsx', code);
