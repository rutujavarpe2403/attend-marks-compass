
import { Button } from "@/components/ui/button";
import { Loader2, Upload } from "lucide-react";
import { useState } from "react";
import { MarksCSVExample } from "../MarksCSVExample";

interface CsvFileUploaderProps {
  file: File | null;
  setFile: (file: File | null) => void;
  isUploading: boolean;
  handleUpload: () => void;
  isUploadDisabled: boolean;
}

export const CsvFileUploader = ({ 
  file, 
  setFile, 
  isUploading, 
  handleUpload, 
  isUploadDisabled 
}: CsvFileUploaderProps) => {
  const [showSample, setShowSample] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">CSV File</label>
        <input
          id="csv-file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
        />
        <button 
          type="button" 
          className="text-sm text-primary mt-1 underline"
          onClick={() => setShowSample(!showSample)}
        >
          {showSample ? "Hide sample format" : "View sample CSV format"}
        </button>
      </div>
      
      {showSample && <MarksCSVExample />}
      
      <Button 
        onClick={handleUpload} 
        disabled={isUploadDisabled}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Marks CSV
          </>
        )}
      </Button>
    </div>
  );
};
