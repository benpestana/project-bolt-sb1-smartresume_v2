import React, { createContext, useContext, useState, useEffect } from 'react';
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
  resumeData: null,
  loading: false,
  setResumeData: () => {},
  saveResume: async () => {},
  loadResume: async () => {}, // Adjusted signature: no ID needed
  createResume: async () => '',
  updateSection: () => {},
  exportResume: async () => {},
  aiSuggestions: async () => [],
});

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Save resume to backend
  const saveResume = async () => {
    if (!resumeData || !user?.email) {
      console.error("Cannot save resume: No resume data or user not logged in.");
      return;
    }
    
    setLoading(true);
    try {
      // Update timestamp before saving
      const updatedResumeData = {
        ...resumeData,
        lastUpdated: new Date().toISOString(),
      };

      const payload = {
        email: user.email,
        template: updatedResumeData.templateId, // Use templateId for the 'template' field
        data: updatedResumeData, // Send the entire frontend resume object as 'data'
      };

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
      
      // Update local state with the timestamped version
      setResumeData(updatedResumeData); 
      console.log('Resume saved successfully to backend.');

    } catch (error) {
      console.error('Error saving resume to backend:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load resume from backend based on logged-in user's email
  const loadResume = async () => {
    if (!user?.email) {
      // Don't attempt to load if user isn't logged in or email is missing
      // console.log("User not logged in, cannot load resume.");
      setResumeData(null); // Clear any existing resume data
      return; 
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/resume/${user.email}`);

      if (response.status === 404) {
        console.log('No resume found for this user on the backend.');
        setResumeData(null); // No resume exists for the user
        return; // Exit function gracefully
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to load resume');
      }

      const loadedData = await response.json(); 
      // Backend returns the 'data' field which contains our ResumeData object
      setResumeData(loadedData as ResumeData); 
      console.log('Resume loaded successfully from backend.');

    } catch (error) {
      console.error('Error loading resume from backend:', error);
      setResumeData(null); // Clear resume data on error
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Effect to load resume when user logs in
  useEffect(() => {
    if (user?.email) {
      loadResume();
    } else {
      setResumeData(null); // Clear resume data if user logs out
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // Reload when user object changes (login/logout)


  // Create a new resume (locally first)
  const createResume = async (templateId: string): Promise<string> => {
    // Use user.email if available, otherwise maybe a placeholder?
    // Backend requires email on save, but user.id might not be available yet from AuthContext
    // Using user.email seems safer if available. User ID from AuthContext is currently empty string.
    const userIdForResume = user?.email || 'unknown-user'; 
    if (!user) throw new Error('User must be logged in to create a resume');

    setLoading(true);
    try {
      // Create empty resume locally
      const newResume = createEmptyResume(userIdForResume, templateId); 
      
      // Set local state immediately
      setResumeData(newResume);
      
      // NOTE: We are NOT saving to backend here. 
      // The first save will happen via saveResume() triggered by updateSection or manual save.
      // We also don't save to localStorage anymore.
      
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
    
    setResumeData({
      ...resumeData,
      [sectionName]: data,
      lastUpdated: new Date().toISOString(),
    });
    
    // Auto-save after a delay (implement debounce in production)
    setTimeout(() => {
      saveResume();
    }, 2000);
  };

  // Export resume to PDF or DOCX
  const exportResume = async (format: 'pdf' | 'docx') => {
    if (!resumeData) return;
    
    setLoading(true);
    try {
      // In a real app, this would call a backend API to generate the file
      console.log(`Exporting resume as ${format}...`);
      
      // Mock download by alerting the user
      alert(`Your resume would be downloaded as ${format.toUpperCase()} in a production environment.`);
    } catch (error) {
      console.error(`Error exporting resume as ${format}:`, error);
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
      loading,
      setResumeData,
      saveResume,
      loadResume,
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
