import React from 'react';
import { useResume } from '../../context/ResumeContext';
import { templates } from '../../data/templates';
import { 
  Mail, Phone, MapPin, Linkedin, Globe, Github 
} from 'lucide-react';

const ResumePreview: React.FC = () => {
  const { resumeData } = useResume();
  
  if (!resumeData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  // Get the current template
  const template = templates.find(t => t.id === resumeData.templateId);
  const templateCategory = template?.category || 'STEM';
  
  // Determine template styling based on category
  const getTemplateStyles = () => {
    switch (templateCategory) {
      case 'STEM':
        return {
          headerBg: 'bg-primary-700',
          headerText: 'text-white',
          sectionTitle: 'text-primary-700 border-b border-primary-200',
        };
      case 'Business':
        return {
          headerBg: 'bg-secondary-700',
          headerText: 'text-white',
          sectionTitle: 'text-secondary-700 border-b border-secondary-200',
        };
      case 'Humanities':
        return {
          headerBg: 'bg-accent-700',
          headerText: 'text-white',
          sectionTitle: 'text-accent-700 border-b border-accent-200',
        };
      default:
        return {
          headerBg: 'bg-primary-700',
          headerText: 'text-white',
          sectionTitle: 'text-primary-700 border-b border-primary-200',
        };
    }
  };
  
  const styles = getTemplateStyles();
  
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="bg-white shadow-lg border border-gray-200 w-full h-full">
        {/* Header */}
        <div className={`${styles.headerBg} p-6`}>
          <h1 className={`text-2xl font-bold ${styles.headerText}`}>
            {resumeData.contact.fullName || 'Your Name'}
          </h1>
          
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
            {resumeData.contact.email && (
              <div className={`flex items-center ${styles.headerText}`}>
                <Mail className="h-4 w-4 mr-2" />
                <span className="text-sm">{resumeData.contact.email}</span>
              </div>
            )}
            
            {resumeData.contact.phone && (
              <div className={`flex items-center ${styles.headerText}`}>
                <Phone className="h-4 w-4 mr-2" />
                <span className="text-sm">{resumeData.contact.phone}</span>
              </div>
            )}
            
            {resumeData.contact.location && (
              <div className={`flex items-center ${styles.headerText}`}>
                <MapPin className="h-4 w-4 mr-2" />
                <span className="text-sm">{resumeData.contact.location}</span>
              </div>
            )}
            
            {resumeData.contact.linkedin && (
              <div className={`flex items-center ${styles.headerText}`}>
                <Linkedin className="h-4 w-4 mr-2" />
                <span className="text-sm">{resumeData.contact.linkedin}</span>
              </div>
            )}
            
            {resumeData.contact.website && (
              <div className={`flex items-center ${styles.headerText}`}>
                <Globe className="h-4 w-4 mr-2" />
                <span className="text-sm">{resumeData.contact.website}</span>
              </div>
            )}
            
            {resumeData.contact.github && (
              <div className={`flex items-center ${styles.headerText}`}>
                <Github className="h-4 w-4 mr-2" />
                <span className="text-sm">{resumeData.contact.github}</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6">
          {/* Education Section */}
          {resumeData.education.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-bold mb-3 pb-1 ${styles.sectionTitle}`}>
                Education
              </h2>
              
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="mb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{edu.institution}</h3>
                      <p className="text-sm">
                        {edu.degree} in {edu.field}
                        {edu.gpa && ` | GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(edu.startDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })} - {new Date(edu.endDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                  
                  {edu.description && (
                    <p className="text-sm mt-1">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Experience Section */}
          {resumeData.experience.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-bold mb-3 pb-1 ${styles.sectionTitle}`}>
                Experience
              </h2>
              
              {resumeData.experience.map((exp) => (
                <div key={exp.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">{exp.position}</h3>
                      <p className="text-sm">
                        {exp.company}{exp.location && `, ${exp.location}`}
                      </p>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(exp.startDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })} - {exp.current ? 'Present' : new Date(exp.endDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p className="text-sm mt-1">{exp.description}</p>
                  )}
                  
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-1">
                      {exp.bullets.map((bullet, i) => (
                        <li key={i} className="text-sm mt-1">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* Skills Section */}
          {resumeData.skills.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-bold mb-3 pb-1 ${styles.sectionTitle}`}>
                Skills
              </h2>
              
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill) => (
                  <span key={skill.id} className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {/* Projects Section */}
          {resumeData.projects.length > 0 && (
            <div className="mb-6">
              <h2 className={`text-lg font-bold mb-3 pb-1 ${styles.sectionTitle}`}>
                Projects
              </h2>
              
              {resumeData.projects.map((project) => (
                <div key={project.id} className="mb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold">
                        {project.name}
                        {project.link && (
                          <a 
                            href={project.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-sm text-primary-600 hover:underline"
                          >
                            (Link)
                          </a>
                        )}
                      </h3>
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(project.startDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })} - {project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      }) : 'Present'}
                    </div>
                  </div>
                  
                  {project.description && (
                    <p className="text-sm mt-1">{project.description}</p>
                  )}
                  
                  {project.bullets.length > 0 && (
                    <ul className="list-disc list-outside ml-5 mt-1">
                      {project.bullets.map((bullet, i) => (
                        <li key={i} className="text-sm mt-1">{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResumePreview;