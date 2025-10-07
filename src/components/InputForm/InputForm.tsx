import React, { useState } from 'react';
import { ProductInput } from '../../types/prd';
import { FileText, Target, Users, Clock, DollarSign, Lightbulb } from 'lucide-react';

interface InputFormProps {
  onSubmit: (input: ProductInput) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [input, setInput] = useState<ProductInput>({
    productName: '',
    productConcept: '',
    targetPersona: '',
    businessObjectives: '',
    competitiveRequirements: '',
    timelineConstraints: '',
    resourceConsiderations: '',
    additionalContext: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(input);
  };

  const handleInputChange = (field: keyof ProductInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const inputSections = [
    {
      icon: FileText,
      title: 'Product Concept',
      fields: [
        {
          key: 'productName' as keyof ProductInput,
          label: 'Product Name',
          placeholder: 'Enter product name (optional - AI can generate)',
          type: 'input'
        },
        {
          key: 'productConcept' as keyof ProductInput,
          label: 'Product Concept & Ideas',
          placeholder: 'Describe your high-level product concept, core functionality, or problem it solves...',
          type: 'textarea',
          required: true
        }
      ]
    },
    {
      icon: Users,
      title: 'Target Market',
      fields: [
        {
          key: 'targetPersona' as keyof ProductInput,
          label: 'Target Persona & Users',
          placeholder: 'Describe your target users, demographics, behavior patterns, needs...',
          type: 'textarea',
          required: true
        }
      ]
    },
    {
      icon: Target,
      title: 'Strategic Objectives',
      fields: [
        {
          key: 'businessObjectives' as keyof ProductInput,
          label: 'Business Objectives',
          placeholder: 'What are the key business goals this product should achieve?',
          type: 'textarea'
        },
        {
          key: 'competitiveRequirements' as keyof ProductInput,
          label: 'Competitive Requirements',
          placeholder: 'Competitive landscape, differentiation needs, market positioning...',
          type: 'textarea'
        }
      ]
    },
    {
      icon: Clock,
      title: 'Constraints',
      fields: [
        {
          key: 'timelineConstraints' as keyof ProductInput,
          label: 'Timeline Constraints',
          placeholder: 'Launch deadlines, milestone requirements, time-to-market pressures...',
          type: 'textarea'
        },
        {
          key: 'resourceConsiderations' as keyof ProductInput,
          label: 'Resource Considerations',
          placeholder: 'Budget limits, team size, technical constraints, infrastructure...',
          type: 'textarea'
        }
      ]
    },
    {
      icon: Lightbulb,
      title: 'Additional Context',
      fields: [
        {
          key: 'additionalContext' as keyof ProductInput,
          label: 'Additional Context',
          placeholder: 'Any other relevant information, assumptions, or requirements...',
          type: 'textarea'
        }
      ]
    }
  ];

  const isFormValid = input.productConcept.trim() && input.targetPersona.trim();

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          PRD Generator
        </h1>
        <p className="text-gray-600">
          Transform your product ideas into comprehensive Product Requirements Documents
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {inputSections.map((section, index) => {
          const IconComponent = section.icon;
          return (
            <div key={index} className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <IconComponent className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>
              
              <div className="space-y-4">
                {section.fields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    
                    {field.type === 'input' ? (
                      <input
                        type="text"
                        value={input[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        required={field.required}
                        disabled={isLoading}
                      />
                    ) : (
                      <textarea
                        value={input[field.key]}
                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
                        required={field.required}
                        disabled={isLoading}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={!isFormValid || isLoading}
            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Sending to Make.com...
              </div>
            ) : (
              'Generate PRD'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;