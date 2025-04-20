
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface FileUploadProps {
  onFileLoaded: (data: any[]) => void;
}

export default function FileUpload({ onFileLoaded }: FileUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: file,
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const data = await response.json();
      onFileLoaded(data);
      
      toast({
        title: "File uploaded successfully",
        description: `${file.name} has been loaded`,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error uploading file",
        description: "Please try again with a valid CSV or text file",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <label htmlFor="file-upload" className="w-full">
        <div className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 border-gray-300">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500">CSV or TXT file</p>
          </div>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            accept=".csv,.txt"
            onChange={handleFileUpload}
            disabled={isLoading}
          />
        </div>
      </label>
    </div>
  );
}
