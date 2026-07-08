import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileText, Loader2 } from 'lucide-react';

interface UploadSectionProps {
  onUpload: (fileData: string, mimeType: string) => void;
  isExtracting: boolean;
  isOnline: boolean;
}

export function UploadSection({ onUpload, isExtracting, isOnline }: UploadSectionProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!isOnline) return;
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 data
      const base64Data = result.split(',')[1];
      onUpload(base64Data, file.type);
    };
    reader.readAsDataURL(file);
  }, [onUpload, isOnline]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png']
    },
    maxFiles: 1,
    disabled: isExtracting || !isOnline
  });

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Upload className="w-5 h-5 text-[#FF0000]" />
          Ajouter un nouveau sujet
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Uploadez un sujet Telc B2 au format PDF ou Image. L'IA extraira automatiquement le contenu.
        </p>
      </div>
      
      <div 
        {...getRootProps()} 
        className={`
          relative overflow-hidden
          border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
          ${!isOnline ? 'opacity-50 cursor-not-allowed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50' :
            isDragActive 
            ? 'border-[#FF0000] bg-red-50 dark:bg-red-900/10 scale-[0.99]' 
            : 'border-gray-300 dark:border-gray-700 hover:border-[#FF0000] hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer'
          }
        `}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center justify-center gap-3">
          {!isOnline ? (
            <>
              <div className="p-3 bg-gray-200 dark:bg-gray-800 rounded-full">
                <Upload className="w-6 h-6 text-gray-400 dark:text-gray-500" />
              </div>
              <div>
                <p className="text-base font-medium text-gray-500">Connexion requise</p>
                <p className="text-xs text-gray-400">Mode hors-ligne actif.</p>
              </div>
            </>
          ) : isExtracting ? (
            <>
              <Loader2 className="w-8 h-8 text-[#FF0000] animate-spin mb-2" />
              <p className="text-base font-bold text-gray-900 dark:text-white">Analyse en cours...</p>
              <p className="text-xs text-gray-500">Extraction automatique des sujets d'expression écrite.</p>
            </>
          ) : (
            <>
              <div className={`p-4 rounded-full transition-colors ${isDragActive ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gray-100 dark:bg-gray-800'}`}>
                <Upload className={`w-6 h-6 ${isDragActive ? 'text-[#FF0000]' : 'text-gray-500 dark:text-gray-400'}`} />
              </div>
              <div>
                <p className="text-base font-bold text-gray-900 dark:text-white mb-1">
                  {isDragActive ? "Relâchez pour uploader" : "Glissez-déposez le document ici"}
                </p>
                <p className="text-xs text-gray-500">
                  Supporté : PDF, JPG, PNG
                </p>
              </div>
              <button className="mt-2 px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-[#FF0000] hover:text-[#FF0000] text-sm font-medium rounded-lg transition-colors shadow-sm pointer-events-none">
                Parcourir les fichiers
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}