import React, { useState, useEffect } from 'react';
import { Education } from '../../../types';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { 
  BookOpen, Plus, ChevronDown, ChevronUp, Trash2
} from 'lucide-react';

interface EducationFormProps {
  education: Education[];
  onChange: (index: number, field: keyof Education, value: string) => void;
  onAdd: () => void;
  onRemove: (index: number) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({ education, onChange, onAdd, onRemove }) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  
  // Toggle expanded state
  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium text-gray-900">Education</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={onAdd}
          icon={<Plus className="h-4 w-4" />}
        >
          Add Education
        </Button>
      </div>
      
      {education.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-dashed border-gray-300 text-center">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Education Added</h3>
          <p className="text-gray-500 mb-4">
            Add your educational background to highlight your academic achievements.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={onAdd}
            icon={<Plus className="h-4 w-4" />}
          >
            Add Education
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {education.map((edu, index) => (
            <div key={edu.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
              {/* Header */}
              <div 
                className="px-6 py-4 cursor-pointer flex justify-between items-center"
                onClick={() => toggleExpanded(index)}
              >
                <div>
                  <h3 className="font-medium text-gray-900">
                    {edu.institution || 'New Education'}
                  </h3>
                  {edu.degree && edu.field && (
                    <p className="text-sm text-gray-500">
                      {edu.degree} in {edu.field}
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
                      id={`institution-${index}`}
                      label="Institution"
                      placeholder="University Name"
                      value={edu.institution}
                      onChange={(e) => onChange(index, 'institution', e.target.value)}
                    />
                    
                    <Input
                      id={`degree-${index}`}
                      label="Degree"
                      placeholder="Bachelor's, Master's, etc."
                      value={edu.degree}
                      onChange={(e) => onChange(index, 'degree', e.target.value)}
                    />
                    
                    <Input
                      id={`field-${index}`}
                      label="Field of Study"
                      placeholder="Computer Science, Business, etc."
                      value={edu.field}
                      onChange={(e) => onChange(index, 'field', e.target.value)}
                    />
                    
                    <Input
                      id={`gpa-${index}`}
                      label="GPA (Optional)"
                      placeholder="3.8/4.0"
                      value={edu.gpa || ''}
                      onChange={(e) => onChange(index, 'gpa', e.target.value)}
                    />
                    
                    <Input
                      id={`startDate-${index}`}
                      label="Start Date"
                      type="month"
                      placeholder="YYYY-MM"
                      value={edu.startDate}
                      onChange={(e) => onChange(index, 'startDate', e.target.value)}
                    />
                    
                    <Input
                      id={`endDate-${index}`}
                      label="End Date (or Expected)"
                      type="month"
                      placeholder="YYYY-MM"
                      value={edu.endDate}
                      onChange={(e) => onChange(index, 'endDate', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description (Optional)
                      </label>
                      <textarea
                        id={`description-${index}`}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                        rows={3}
                        placeholder="Relevant coursework, honors, etc."
                        value={edu.description || ''}
                        onChange={(e) => onChange(index, 'description', e.target.value)}
                      />
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

export default EducationForm;
