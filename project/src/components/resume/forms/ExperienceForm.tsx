import React, { useState } from 'react';
import { Experience } from '../../../types';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { 
  Briefcase, Plus, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';

interface ExperienceFormProps {
  experience: Experience[];
  onChange: (index: number, field: keyof Experience, value: any) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
  onBulletChange: (expIndex: number, bulletIndex: number, value: string) => void;
  onAddBullet: (index: number) => void;
  onRemoveBullet: (expIndex: number, bulletIndex: number) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ experience, onChange, onAdd, onRemove, onBulletChange, onAddBullet, onRemoveBullet }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  
  // Toggle expanded state
  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Experience</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Experience
        </Button>
      </div>
      
      {experience.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-dashed border-gray-300 text-center">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Experience Added</h3>
          <p className="text-gray-500 mb-4">
            Add your work experience to highlight your professional achievements.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={onAdd}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Experience
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {experience.map((exp, index) => (
            <div key={exp.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header */}
              <div 
                className="px-6 py-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpanded(index)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {exp.position || 'New Position'} {exp.company && `at ${exp.company}`}
                  </h3>
                  {exp.startDate && (
                    <p className="text-sm text-gray-500">
                      {new Date(exp.startDate).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short' 
                      })} - {exp.current ? 'Present' : exp.endDate ? new Date(exp.endDate).toLocaleDateString(undefined, { 
                        year: 'numeric', 
                        month: 'short' 
                      }) : ''}
                    </p>
                  )}
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(index);
                    }}
                    className="text-gray-400 hover:text-error-500 mr-2"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
              
              {/* Expanded Content */}
              {expandedIndex === index && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <Input
                      id={`company-${index}`}
                      label="Company"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => onChange(index, 'company', e.target.value)}
                    />
                    
                    <Input
                      id={`position-${index}`}
                      label="Position"
                      placeholder="Job Title"
                      value={exp.position}
                      onChange={(e) => onChange(index, 'position', e.target.value)}
                    />
                    
                    <Input
                      id={`location-${index}`}
                      label="Location"
                      placeholder="City, State"
                      value={exp.location}
                      onChange={(e) => onChange(index, 'location', e.target.value)}
                    />
                    
                    <div className="flex items-center mt-7">
                      <input
                        id={`current-${index}`}
                        type="checkbox"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        checked={exp.current}
                        onChange={(e) => onChange(index, 'current', e.target.checked)}
                      />
                      <label htmlFor={`current-${index}`} className="ml-2 block text-sm text-gray-700">
                        I currently work here
                      </label>
                    </div>
                    
                    <Input
                      id={`startDate-${index}`}
                      label="Start Date"
                      type="month"
                      placeholder="YYYY-MM"
                      value={exp.startDate}
                      onChange={(e) => onChange(index, 'startDate', e.target.value)}
                    />
                    
                    {!exp.current && (
                      <Input
                        id={`endDate-${index}`}
                        label="End Date"
                        type="month"
                        placeholder="YYYY-MM"
                        value={exp.endDate}
                        onChange={(e) => onChange(index, 'endDate', e.target.value)}
                        disabled={exp.current}
                      />
                    )}
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        id={`description-${index}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        rows={2}
                        placeholder="Brief overview of your role"
                        value={exp.description}
                        onChange={(e) => onChange(index, 'description', e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Key Achievements & Responsibilities
                        </label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onAddBullet(index)}
                          icon={<Plus className="h-4 w-4" />}
                        >
                          Add Bullet
                        </Button>
                      </div>
                      
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <div key={bulletIndex} className="mb-3">
                          <div className="flex items-start">
                            <div className="mt-2 mr-2 text-gray-400">•</div>
                            <div className="flex-1">
                              <div className="relative">
                                <textarea
                                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm pr-10"
                                  rows={2}
                                  placeholder="Describe an achievement using action verbs"
                                  value={bullet}
                                  onChange={(e) => onBulletChange(index, bulletIndex, e.target.value)}
                                />
                                <div className="absolute right-0 top-0 pr-3 pt-2">
                                  <button
                                    type="button"
                                    className="text-gray-400 hover:text-error-500"
                                    onClick={() => onRemoveBullet(index, bulletIndex)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperienceForm;
