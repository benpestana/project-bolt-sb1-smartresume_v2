import React from 'react';
import { Skill } from '../../../types';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import { 
  Code, Plus, Trash2, Tag
} from 'lucide-react';

interface SkillsFormProps {
  skills: Skill[];
  newSkill: string;
  newLevel: Skill['level'];
  setNewSkill: (value: string) => void;
  setNewLevel: (value: Skill['level']) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({ skills, newSkill, newLevel, setNewSkill, setNewLevel, onAdd, onRemove }) => {
  
  // Handle keypress (to add skill on Enter)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onAdd();
    }
  };
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-medium text-gray-900">Skills</h2>
      
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Add skill form */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Add a skill</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <Input
                id="new-skill"
                label="Skill Name"
                placeholder="e.g., JavaScript, Project Management"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={handleKeyPress}
                startIcon={<Tag className="h-5 w-5 text-gray-400" />}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proficiency Level
              </label>
              <select
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                value={newLevel || 'Intermediate'}
                onChange={(e) => setNewLevel(e.target.value as Skill['level'])}
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <Button
                variant="primary"
                onClick={onAdd}
                disabled={!newSkill.trim()}
                fullWidth
              >
                Add Skill
              </Button>
            </div>
          </div>
        </div>
        
        {/* Skills list */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Your Skills</h3>
          
          {skills.length === 0 ? (
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Code className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <h4 className="text-base font-medium text-gray-900 mb-1">No skills added yet</h4>
              <p className="text-sm text-gray-500">
                Add skills to showcase your expertise to potential employers.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {skills.map((skill) => (
                <div 
                  key={skill.id}
                  className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                >
                  <div>
                    <span className="font-medium">{skill.name}</span>
                    {skill.level && (
                      <span className="ml-2 text-xs text-gray-500">({skill.level})</span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemove(skill.id)}
                    className="text-gray-400 hover:text-error-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SkillsForm;
