import React from 'react';
import { usePRDGenerator } from './hooks/usePRDGenerator';
import InputForm from './components/InputForm/InputForm';
import PRDViewer from './components/PRDViewer/PRDViewer';

function App() {
  const {
    currentPRD,
    isProcessing,
    error,
    generatePRD,
    updateSection,
    resetPRD
  } = usePRDGenerator();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {!currentPRD ? (
          <InputForm onSubmit={generatePRD} isLoading={isProcessing} />
        ) : (
          <PRDViewer
            prd={currentPRD}
            onEdit={resetPRD}
            onUpdateSection={updateSection}
          />
        )}
        
        {error && !currentPRD && (
          <div className="max-w-4xl mx-auto mt-6">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="font-medium text-red-900">Error occurred</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;