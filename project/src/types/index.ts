// User type
export interface User {
  id: string;
  email: string;
  name?: string;
}

// Template types
export type TemplateCategory = 'STEM' | 'Business' | 'Humanities';

export interface Template {
  id: string;
  name: string;
  category: TemplateCategory;
  preview: string;
}

// Resume section types
export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  bullets: string[];
}

export interface Skill {
  id: string;
  name: string;
  level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  link?: string;
}

export interface Contact {
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

// Complete resume data
export interface ResumeData {
  id: string;
  userId: string;
  templateId: string;
  lastUpdated: string;
  contact: Contact;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  additionalSections?: Record<string, any>[];
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  API_BASE_URL: string;
}

// Resume context types
export interface ResumeContextType {
  resumeData: ResumeData | null;
  loading: boolean;
  setResumeData: (data: ResumeData) => void;
  saveResume: () => Promise<void>;
  loadResume: (id: string) => Promise<void>;
  createResume: (templateId: string) => Promise<string>;
  updateSection: <T>(sectionName: string, data: T) => void;
  exportResume: (format: 'pdf' | 'docx') => Promise<void>;
  aiSuggestions: (text: string, type: 'bullet' | 'description') => Promise<string[]>;
}
