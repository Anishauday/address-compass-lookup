
import { useState } from 'react';
import { Upload, FileCheck, FileX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { parseFile, AddressRecord } from '@/services/fileService';

interface FileUploadProps {
  onFileLoaded: (data: AddressRecord[]) => void;
}

export default function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const { toast } = useToast();
  
  const validateAndLoadFile = async (file: File) => {
    if (!file) return;
    
    setIsLoading(true);
    setFileError(null);
    setFileName(file.name);
    
    try {
      // Use the enhanced parseFile function directly instead of the API call
      const records = await parseFile(file);
      
      if (records.length === 0) {
        setFileError('No valid data found in the file. Please check the format.');
        toast({
          variant: "destructive",
          title: "No valid data found",
          description: "The file doesn't contain any valid address records",
        });
      } else {
        onFileLoaded(records);
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been loaded with ${records.length} records`,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setFileError(errorMessage);
      toast({
        variant: "destructive",
        title: "Error processing file",
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
  };
  
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      validateAndLoadFile(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div
        className={`flex flex-col items-center justify-center w-full h-32 border-2 ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100'} rounded-lg cursor-pointer transition-colors duration-200`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-upload')?.click()}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isLoading ? (
            <div className="animate-pulse flex flex-col items-center">
              <Upload className="w-8 h-8 mb-3 text-blue-500" />
              <p className="text-sm text-blue-500">Processing file...</p>
            </div>
          ) : fileName && !fileError ? (
            <div className="flex flex-col items-center">
              <FileCheck className="w-8 h-8 mb-3 text-green-500" />
              <p className="mb-2 text-sm text-green-500 font-medium">{fileName}</p>
              <p className="text-xs text-gray-500">Loaded successfully</p>
            </div>
          ) : fileError ? (
            <div className="flex flex-col items-center">
              <FileX className="w-8 h-8 mb-3 text-red-500" />
              <p className="mb-2 text-sm text-red-500 font-medium">File Error</p>
              <p className="text-xs text-center text-red-500">{fileError}</p>
            </div>
          ) : (
            <>
              <Upload className="w-8 h-8 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">CSV or TXT file</p>
            </>
          )}
        </div>
      </div>
      <input
        id="file-upload"
        type="file"
        className="hidden"
        accept=".csv,.txt,text/csv,text/plain,application/csv"
        onChange={handleFileUpload}
        disabled={isLoading}
      />
    </div>
  );
}
