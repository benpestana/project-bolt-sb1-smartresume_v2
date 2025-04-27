import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ResumeData, ResumeContextType } from '../types';
import { useAuth } from './AuthContext';

// Backend API base URL (reuse or define if not globally available)
const API_BASE_URL = 'http://localhost:8000';

// Initial empty resume data
const createEmptyResume = (userId: string, templateId: string): ResumeData => {
  return {
    id: `resume-${Date.now()}`,
    userId,
    templateId,
    lastUpdated: new Date().toISOString(),
    contact: {
      fullName: '',
      email: '',
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
  };
};

// Create resume context with default values
const ResumeContext = createContext<ResumeContextType>({
  resumeData: null, // This will now hold the selected resume
  resumes: [], // New state to hold the list of all resumes for the user
  loading: false,
  setResumeData: () => {}, // This will now set the selected resume
  setResumes: () => {}, // New function to set the list of resumes
  saveResume: async () => {},
  loadResumes: async () => {}, // Changed from loadResume to loadResumes
  selectResume: () => {}, // New function to select a resume
  createResume: async () => '',
  updateSection: () => {},
  exportResume: async () => {},
  aiSuggestions: async () => [],
});

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumes, setResumes] = useState<ResumeData[]>([]); // State for the list of resumes
  const [resumeData, setResumeData] = useState<ResumeData | null>(null); // State for the currently selected resume
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load resumes from backend based on logged-in user's email
  const loadResumes = useCallback(async () => {
    if (!user?.email) {
      console.log("User not logged in, cannot load resumes.");
      setResumes([]); // Clear any existing resumes data
      setResumeData(null); // Clear selected resume
      return;
    }

    setLoading(true);
    try {
      // Call the new backend endpoint to get all resumes for the user
      const response = await fetch(`${API_BASE_URL}/resumes/${user.email}`);

      if (response.status === 404) {
        console.log('No resumes found for this user on the backend.');
        setResumes([]); // No resumes exist for the user
        setResumeData(null); // Clear selected resume
        return; // Exit function gracefully
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to load resumes');
      }

      const loadedData: ResumeData[] = await response.json();
      console.log('Loaded resumes from backend:', loadedData); // Log the loaded data
      setResumes(loadedData); // Set the list of resumes

      // Optionally select the first resume if the list is not empty
      if (loadedData.length > 0) {
          setResumeData(loadedData[0]);
      } else {
          setResumeData(null);
      }

      console.log('Resumes loaded successfully from backend.');

    } catch (error) {
      console.error('Error loading resumes from backend:', error);
      setResumes([]); // Clear resumes data on error
      setResumeData(null); // Clear selected resume on error
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.email]); // Depend on user.email

  // Effect to load resumes when user logs in
  useEffect(() => {
    if (user?.email) {
      loadResumes();
    } else {
      setResumes([]); // Clear resumes data if user logs out
      setResumeData(null); // Clear selected resume if user logs out
    }
  }, [user, loadResumes]); // Depend on user and loadResumes

  // Save resume to backend
  const saveResume = async (dataToSave: ResumeData) => {
    if (!dataToSave || !user?.email) {
      console.error("Cannot save resume: No resume data or user not logged in.");
      return;
    }

    setLoading(true);
    try {
      // Update timestamp before saving
      const updatedResumeData = {
        ...dataToSave,
        lastUpdated: new Date().toISOString(),
      };

      const payload = {
        email: user.email, // Use user.email from AuthContext
        template: updatedResumeData.templateId, // Use templateId for the 'template' field
        data: updatedResumeData, // Send the entire frontend resume object as 'data'
      };

      console.log('Saving resume - user email:', user?.email); // Log user email
      console.log('Saving resume - data email:', dataToSave.email); // Log data email
      console.log('Saving resume - payload:', payload); // Log the payload

      const response = await fetch(`${API_BASE_URL}/resume/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to save resume');
      }

      // Update the specific resume in the local list with the timestamped version
      setResumes(prevResumes => {
          const index = prevResumes.findIndex(r => r.id === updatedResumeData.id);
          if (index !== -1) {
              const newResumes = [...prevResumes];
              newResumes[index] = updatedResumeData;
              return newResumes;
          } else {
              // This case should ideally not happen if we are saving an existing resume
              // but as a fallback, add it to the list
              return [...prevResumes, updatedResumeData];
          }
      });

      // Update the selected resume if the saved one was the selected one
      if (resumeData?.id === updatedResumeData.id) {
          setResumeData(updatedResumeData);
      }


      console.log('Resume saved successfully to backend.');

    } catch (error) {
      console.error('Error saving resume to backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  // Select a resume to edit
  const selectResume = (resumeId: string) => {
      const resumeToSelect = resumes.find(r => r.id === resumeId);
      setResumeData(resumeToSelect || null);
  };


  // Create a new resume (locally first)
  const createResume = async (templateId: string): Promise<string> => {
    const userIdForResume = user?.email || 'unknown-user';
    if (!user) throw new Error('User must be logged in to create a resume');

    setLoading(true);
    try {
      // Create empty resume locally
      const newResume = createEmptyResume(userIdForResume, templateId);

      // Add the new resume to the list
      setResumes(prevResumes => [...prevResumes, newResume]);

      // Select the newly created resume
      setResumeData(newResume);

      // NOTE: We are NOT saving to backend here.
      // The first save will happen via saveResume() triggered by manual save.

      console.log('New resume created locally:', newResume.id);
      return newResume.id;
    } catch (error) {
      console.error('Error creating new resume:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update a specific section of the resume
  const updateSection = <T,>(sectionName: string, data: T) => {
    if (!resumeData) return;

    // Update the selected resume's data
    setResumeData(prevResumeData => {
        if (!prevResumeData) return null;
        const updatedSectionData = {
            ...prevResumeData,
            [sectionName]: data,
            lastUpdated: new Date().toISOString(),
        };

        // Also update the resume in the main list
        setResumes(prevResumes => {
            const index = prevResumes.findIndex(r => r.id === updatedSectionData.id);
            if (index !== -1) {
                const newResumes = [...prevResumes];
                newResumes[index] = updatedSectionData;
                return newResumes;
            }
            return prevResumes; // Should not happen if selected resume is in the list
        });

        return updatedSectionData;
    });
  };

  // Export resume to PDF or DOCX
  const exportResume = async (format: 'pdf' | 'docx') => {
    if (!resumeData) {
      console.error("Cannot export resume: No resume data available.");
      alert("Cannot export resume: No resume data available.");
      return;
    }

    setLoading(true);
    try {
      if (format === 'pdf') {
        console.log('Triggering browser print for PDF export with delay.');
        // Add a small delay to allow dropdown to close
        setTimeout(() => {
          window.print(); // Trigger browser print dialog
          alert('Browser print dialog triggered for PDF export.');
        }, 50); // 50ms delay
      } else if (format === 'docx') {
        // For DOCX, we would typically call a backend endpoint
        console.log('Simulating DOCX export.');
        alert('Simulating DOCX export. In a real app, this would download a .docx file.');
        // Add backend call for DOCX if implemented later
      } else {
        console.error('Unsupported export format:', format);
        alert(`Unsupported export format: ${format}`);
      }

    } catch (error: any) { // Catch any error here
      console.error(`Error during ${format} export:`, error);

      let errorMessage = `An unknown error occurred during ${format} export.`;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      } else if (typeof error === 'object' && error !== null) {
        try {
          // Attempt to get a more specific message from common error object structures
          if (error.message) errorMessage = error.message;
          else if (error.detail) errorMessage = error.detail;
          else errorMessage = JSON.stringify(error);
        } catch (stringifyError) {
          errorMessage = `An object error occurred during ${format} export (could not stringify).`;
        }
      }

      alert(`Error exporting resume: ${errorMessage}`);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Get AI suggestions for content improvement
  const aiSuggestions = async (text: string, type: 'bullet' | 'description'): Promise<string[]> => {
    setLoading(true);
    try {
      // In a real app, this would call an OpenAI API
      console.log(`Getting AI suggestions for ${type}...`);

      // Mock suggestions
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (type === 'bullet') {
        return [
          `Implemented ${text} resulting in 30% efficiency improvement`,
          `Developed ${text} to streamline business processes`,
          `Created ${text} that reduced manual work by 25%`,
        ];
      } else {
        return [
          `Experienced professional with expertise in ${text} and a proven track record of success.`,
          `Dedicated ${text} specialist with a passion for innovation and problem-solving.`,
          `Results-driven ${text} expert with strong analytical skills and attention to detail.`,
        ];
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResumeContext.Provider value={{
      resumeData,
      resumes, // Provide the list of resumes
      loading,
      setResumeData,
      setResumes, // Provide the setResumes function
      saveResume,
      loadResumes, // Provide the loadResumes function
      selectResume, // Provide the selectResume function
      createResume,
      updateSection,
      exportResume,
      aiSuggestions,
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResume = () => useContext(ResumeContext);
