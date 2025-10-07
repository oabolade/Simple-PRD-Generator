export interface ProductInput {
  productName: string;
  productConcept: string;
  targetPersona: string;
  businessObjectives: string;
  competitiveRequirements: string;
  timelineConstraints: string;
  resourceConsiderations: string;
  additionalContext: string;
}

export interface PRDSection {
  id: string;
  title: string;
  content: string;
  isGenerated: boolean;
}

export interface GeneratedPRD {
  id: string;
  timestamp: string;
  input: ProductInput;
  sections: PRDSection[];
  status: 'draft' | 'processing' | 'completed' | 'error';
  errorMessage?: string;
}

export interface WebhookPayload {
  input: ProductInput;
  prdId: string;
  sections: PRDSection[];
}

export interface WebhookResponse {
  success: boolean;
  prdId: string;
  enrichedSections: PRDSection[];
  error?: string;
  message?: string;
  processingTime?: number;
}