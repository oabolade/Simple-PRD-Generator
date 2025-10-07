import { generateInitialPRD, generatePRDMarkdown } from './prdGenerator';
import { ProductInput } from '../types/prd';

describe('prdGenerator', () => {
  const mockInput: ProductInput = {
    productName: 'TaskFlow Pro',
    productConcept: 'A productivity app for remote workers',
    targetPersona: 'Remote workers aged 25-40',
    businessObjectives: 'Increase team productivity by 30%',
    competitiveRequirements: 'Better than Asana and Trello',
    timelineConstraints: '6 months to MVP',
    resourceConsiderations: '5 developers, $100k budget',
    additionalContext: 'Focus on mobile-first design'
  };

  describe('generateInitialPRD', () => {
    it('generates all required PRD sections', () => {
      const sections = generateInitialPRD(mockInput);

      expect(sections).toHaveLength(8);

      const expectedSectionIds = [
        'executive-summary',
        'strategic-context',
        'user-personas',
        'user-stories',
        'features-requirements',
        'success-metrics',
        'acceptance-criteria',
        'timeline-milestones'
      ];

      expectedSectionIds.forEach(id => {
        expect(sections.find(s => s.id === id)).toBeDefined();
      });
    });

    it('includes input data in appropriate sections', () => {
      const sections = generateInitialPRD(mockInput);

      const executiveSummary = sections.find(s => s.id === 'executive-summary');
      expect(executiveSummary?.content).toContain('TaskFlow Pro');
      expect(executiveSummary?.content).toContain('Increase team productivity by 30%');

      const strategicContext = sections.find(s => s.id === 'strategic-context');
      expect(strategicContext?.content).toContain('Better than Asana and Trello');

      const timelineMilestones = sections.find(s => s.id === 'timeline-milestones');
      expect(timelineMilestones?.content).toContain('6 months to MVP');
    });

    it('marks all sections as not generated initially', () => {
      const sections = generateInitialPRD(mockInput);

      sections.forEach(section => {
        expect(section.isGenerated).toBe(false);
      });
    });

    it('generates unique section IDs', () => {
      const sections = generateInitialPRD(mockInput);
      const sectionIds = sections.map(s => s.id);
      const uniqueIds = [...new Set(sectionIds)];

      expect(sectionIds).toHaveLength(uniqueIds.length);
    });

    it('handles empty input gracefully', () => {
      const emptyInput: ProductInput = {
        productName: '',
        productConcept: '',
        targetPersona: '',
        businessObjectives: '',
        competitiveRequirements: '',
        timelineConstraints: '',
        resourceConsiderations: '',
        additionalContext: ''
      };

      const sections = generateInitialPRD(emptyInput);

      expect(sections).toHaveLength(8);
      sections.forEach(section => {
        expect(section.content).toBeDefined();
        expect(section.title).toBeDefined();
        expect(section.id).toBeDefined();
      });
    });
  });

  describe('generatePRDMarkdown', () => {
    it('generates valid markdown with header and sections', () => {
      const sections = generateInitialPRD(mockInput);
      const markdown = generatePRDMarkdown(sections, mockInput);

      expect(markdown).toContain('# Product Requirements Document: TaskFlow Pro');
      expect(markdown).toContain('**Generated on:**');
      expect(markdown).toContain('**Status:**');

      sections.forEach(section => {
        expect(markdown).toContain(`# ${section.title}`);
      });
    });

    it('shows correct status based on section generation', () => {
      const sections = generateInitialPRD(mockInput);
      
      // Test with template status
      let markdown = generatePRDMarkdown(sections, mockInput);
      expect(markdown).toContain('**Status:** Template');

      // Test with AI-enhanced status
      const enhancedSections = sections.map(s => ({ ...s, isGenerated: true }));
      markdown = generatePRDMarkdown(enhancedSections, mockInput);
      expect(markdown).toContain('**Status:** AI-Enhanced');
    });

    it('handles missing product name gracefully', () => {
      const inputWithoutName = { ...mockInput, productName: '' };
      const sections = generateInitialPRD(inputWithoutName);
      const markdown = generatePRDMarkdown(sections, inputWithoutName);

      expect(markdown).toContain('# Product Requirements Document: TBD');
    });

    it('includes section dividers', () => {
      const sections = generateInitialPRD(mockInput);
      const markdown = generatePRDMarkdown(sections, mockInput);

      const dividerCount = (markdown.match(/---/g) || []).length;
      expect(dividerCount).toBeGreaterThan(sections.length);
    });

    it('preserves section content formatting', () => {
      const sections = generateInitialPRD(mockInput);
      const markdown = generatePRDMarkdown(sections, mockInput);

      sections.forEach(section => {
        expect(markdown).toContain(section.content);
      });
    });
  });
});