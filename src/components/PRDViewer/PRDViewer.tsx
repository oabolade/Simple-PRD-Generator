import React, { useState } from 'react';
import { GeneratedPRD } from '../../types/prd';
import { generatePRDMarkdown } from '../../utils/prdGenerator';
import { Download, CreditCard as Edit3, Eye, FileText, ArrowLeft } from 'lucide-react';

interface PRDViewerProps {
  prd: GeneratedPRD;
  onEdit: () => void;
  onUpdateSection: (sectionId: string, content: string) => void;
}

const PRDViewer: React.FC<PRDViewerProps> = ({ prd, onEdit, onUpdateSection }) => {
  const [activeTab, setActiveTab] = useState<'preview' | 'edit'>('preview');
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState<string>('');

  const downloadMarkdown = () => {
    const markdown = generatePRDMarkdown(prd.sections, prd.input);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `PRD-${prd.input.productName || 'Untitled'}-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleEditSection = (sectionId: string, content: string) => {
    setEditingSectionId(sectionId);
    setEditContent(content);
    setActiveTab('edit');
  };

  const handleSaveEdit = () => {
    if (editingSectionId) {
      onUpdateSection(editingSectionId, editContent);
      setEditingSectionId(null);
      setEditContent('');
      setActiveTab('preview');
    }
  };

  const handleCancelEdit = () => {
    setEditingSectionId(null);
    setEditContent('');
    setActiveTab('preview');
  };

  const getStatusColor = () => {
    switch (prd.status) {
      case 'completed': return 'text-emerald-600 bg-emerald-50';
      case 'processing': return 'text-blue-600 bg-blue-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusText = () => {
    switch (prd.status) {
      case 'completed': return 'AI-Enhanced';
      case 'processing': return 'Processing...';
      case 'error': return 'Error';
      default: return 'Draft';
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onEdit}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Edit
            </button>
            <div className="w-px h-6 bg-gray-300" />
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {prd.input.productName || 'Product Requirements Document'}
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor()}`}>
              {getStatusText()}
            </span>
            <button
              onClick={downloadMarkdown}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>

        {prd.status === 'processing' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <div>
                <p className="font-medium text-blue-900">AI Enhancement in Progress</p>
                <p className="text-sm text-blue-700">
                  Your PRD is being sent to Make.com for AI processing and enrichment. This may take a few moments...
                </p>
              </div>
            </div>
          </div>
        )}

        {prd.status === 'completed' && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-emerald-900">AI Enhancement Complete</p>
                <p className="text-sm text-emerald-700">
                  Your PRD has been successfully processed and enriched with AI-generated content from Make.com.
                </p>
              </div>
            </div>
          </div>
        )}

        {prd.status === 'error' && prd.errorMessage && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-red-900">Processing Error</p>
                <p className="text-sm text-red-700">{prd.errorMessage}</p>
                <p className="text-xs text-red-600 mt-1">
                  Please try again or check your Make.com webhook configuration.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mt-4">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'preview'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Preview
          </button>
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === 'edit'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Edit3 className="w-4 h-4 inline mr-2" />
            Edit Mode
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'preview' ? (
          <div className="space-y-8">
            {prd.sections.map((section) => (
              <div key={section.id} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h2>
                    <div className="flex items-center gap-2">
                      {section.isGenerated && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                          AI Enhanced
                        </span>
                      )}
                      <button
                        onClick={() => handleEditSection(section.id, section.content)}
                        className="text-gray-500 hover:text-gray-700 p-1"
                        title="Edit section"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                    {section.content}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {editingSectionId ? (
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Editing: {prd.sections.find(s => s.id === editingSectionId)?.title}
                </h3>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full h-64 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="Edit section content..."
                />
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSaveEdit}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid gap-4">
                <p className="text-gray-600 mb-4">Click on any section below to edit its content:</p>
                {prd.sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => handleEditSection(section.id, section.content)}
                    className="text-left p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">{section.title}</h3>
                      <div className="flex items-center gap-2">
                        {section.isGenerated && (
                          <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">
                            AI Enhanced
                          </span>
                        )}
                        <Edit3 className="w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                      {section.content.substring(0, 100)}...
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PRDViewer;