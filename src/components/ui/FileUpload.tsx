// components/ui/FileUpload.tsx
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useTheme } from '@/hooks/';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  currentFiles?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({
  onFilesSelected,
  accept = '*',
  maxFiles = 1,
  currentFiles = []
}) => {
  const { theme } = useTheme();
  const [preview, setPreview] = useState<string[]>(currentFiles);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    onFilesSelected(acceptedFiles);
    
    // Create preview URLs for images
    const previewUrls = acceptedFiles.map(file => URL.createObjectURL(file));
    setPreview(previewUrls);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: accept === 'image/*' ? { 'image/*': [] } : undefined,
    maxFiles
  });

  const removeFile = (index: number) => {
    const newPreview = preview.filter((_, i) => i !== index);
    setPreview(newPreview);
  };

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
            : theme === 'dark'
            ? 'border-gray-600 hover:border-gray-500'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className={`w-8 h-8 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
        <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here, or click to browse'}
        </p>
        <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
          {accept === 'image/*' ? 'Images only' : 'Any file type'}
        </p>
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {preview.map((url, index) => (
            <div key={index} className="relative">
              {accept === 'image/*' ? (
                <img
                  src={url}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                />
              ) : (
                <div className={`w-full h-32 flex items-center justify-center rounded-lg border ${theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
                  <ImageIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-400'}`} />
                </div>
              )}
              <button
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUpload;