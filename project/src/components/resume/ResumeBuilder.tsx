import React, { useState } from 'react';
import { useResume } from '../../context/ResumeContext';
import ResumeForm from './ResumeForm';
import ResumePreview from './ResumePreview';
import Button from '../ui/Button';
import { Save, Download, FileDown } from 'lucide-react';

const ResumeBuilder: React.FC<{ resumeId: string }> = ({ resumeId }) => {
  const { resumeData, loading, exportResume, saveResume } = useResume();
  const [activeSection, setActiveSection] = useState<string>('contact');
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false); // State for dropdown visibility
  
  // Handle section change
  const handleSectionChange = (section: string) => {
    setActiveSection(section);
  };
  
  // Handle manual save
  const handleSave = async () => {
    if (!resumeData) {
      console.error("Cannot save: No resume data available.");
      return;
    }
    try {
      await saveResume(resumeData);
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  };
  
  // Handle export
  const handleExport = async (format: 'pdf' | 'docx') => {
    setIsExportDropdownOpen(false); // Close the dropdown
    try {
      await exportResume(format);
    } catch (error) {
      console.error(`Error exporting as ${format}:`, error);
    }
  };
  
  if (!resumeData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="max-w-full animate-fade-in">
      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileDown className="h-6 w-6 text-primary-600" />
          <h1 className="text-xl font-semibold text-gray-900">{resumeData.contact.fullName || 'New Resume'}</h1>
          <span className="text-sm text-gray-500">
            Last edited: {new Date(resumeData.lastUpdated).toLocaleString()}
          </span>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Added padding to the group container */}
          {/* Added padding to the group container */}
          <div className="relative group py-2"> 
            <Button
              variant="primary"
              size="sm"
              icon={<Download className="h-4 w-4" />}
              onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)} // Toggle dropdown visibility
              disabled={!previewMode} // Disable if not in preview mode
            >
              Export
            </Button>
            
            {/* Conditionally render dropdown based on state */}
            {isExportDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
                <button
                  onClick={() => handleExport('pdf')}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Download as PDF
              </button>
            </div>
          )}
        </div>
          
          <Button
            variant={previewMode ? 'outline' : 'ghost'}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            {previewMode ? 'Edit Mode' : 'Preview Mode'}
          </Button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col md:flex-row h-[calc(100vh-64px)]">
        {!previewMode && (
          <div className="w-full md:w-1/2 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <ResumeForm
              activeSection={activeSection}
              onSectionChange={handleSectionChange}
            />
          </div>
        )}
        
        <div className={`w-full ${previewMode ? 'w-full' : 'md:w-1/2'} bg-gray-100 overflow-y-auto`}>
          <ResumePreview key={resumeData?.lastUpdated} />
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
