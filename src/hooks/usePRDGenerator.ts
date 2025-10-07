import { useState, useCallback } from 'react';
import { ProductInput, GeneratedPRD, PRDSection } from '../types/prd';
import { generateInitialPRD } from '../utils/prdGenerator';
import { sendToMakecom, mockWebhookResponse } from '../utils/webhookService';

export const usePRDGenerator = () => {
  const [currentPRD, setCurrentPRD] = useState<GeneratedPRD | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generatePRD = useCallback(async (input: ProductInput): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      const sections = generateInitialPRD(input);
      const prdId = `prd-${Date.now()}`;
      
      const initialPRD: GeneratedPRD = {
        id: prdId,
        timestamp: new Date().toISOString(),
        input,
        sections,
        status: 'draft'
      };

      setCurrentPRD(initialPRD);

      // Send to Make.com for AI enhancement
      setCurrentPRD(prev => prev ? { ...prev, status: 'processing' } : null);

      const webhookPayload = {
        input,
        prdId,
        sections
      };

      // Send to actual Make.com webhook
      const response = await sendToMakecom(webhookPayload);

      if (response.success) {
        setCurrentPRD(prev => prev ? {
          ...prev,
          sections: response.enrichedSections,
          status: 'completed'
        } : null);
      } else {
        throw new Error(response.error || 'Unknown error from webhook');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('PRD Generation error:', err);
      setError(errorMessage);
      setCurrentPRD(prev => prev ? {
        ...prev,
        status: 'error',
        errorMessage
      } : null);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const updateSection = useCallback((sectionId: string, content: string) => {
    setCurrentPRD(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        sections: prev.sections.map(section =>
          section.id === sectionId
            ? { ...section, content, isGenerated: true }
            : section
        )
      };
    });
  }, []);

  const resetPRD = useCallback(() => {
    setCurrentPRD(null);
    setError(null);
    setIsProcessing(false);
  }, []);

  return {
    currentPRD,
    isProcessing,
    error,
    generatePRD,
    updateSection,
    resetPRD
  };
};