import React, { createContext, useContext, useState } from 'react';
import { ResumeData, ResumeContextType } from '../types';
import { useAuth } from './AuthContext';

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
  loadResume: async () => {},
  createResume: async () => '',
  updateSection: () => {},
  exportResume: async () => {},
  aiSuggestions: async () => [],
});

export const ResumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Save resume to localStorage and eventually to backend
  const saveResume = async () => {
    if (!resumeData) return;
    
    setLoading(true);
    try {
      // Update timestamp
      const updatedResume = {
        ...resumeData,
        lastUpdated: new Date().toISOString(),
      };
      
      // Save to localStorage for now
      localStorage.setItem(`resume-${updatedResume.id}`, JSON.stringify(updatedResume));
      setResumeData(updatedResume);
      
      // In a real app, this would also save to a backend
    } catch (error) {
      console.error('Error saving resume:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Load resume from localStorage and eventually from backend
  const loadResume = async (id: string) => {
    setLoading(true);
    try {
      // Get from localStorage for now
      const storedResume = localStorage.getItem(`resume-${id}`);
      
      if (storedResume) {
        setResumeData(JSON.parse(storedResume));
      } else {
        throw new Error('Resume not found');
      }
      
      // In a real app, this would fetch from a backend
    } catch (error) {
      console.error('Error loading resume:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Create a new resume with a template
  const createResume = async (templateId: string): Promise<string> => {
    if (!user) throw new Error('User must be logged in');
    
    setLoading(true);
    try {
      // Create empty resume with template
      const newResume = createEmptyResume(user.id, templateId);
      
      // Save to localStorage for now
      localStorage.setItem(`resume-${newResume.id}`, JSON.stringify(newResume));
      setResumeData(newResume);
      
      // In a real app, this would also save to a backend
      return newResume.id;
    } catch (error) {
      console.error('Error creating resume:', error);
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