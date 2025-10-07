import { ProductInput, PRDSection } from '../types/prd';

export const generateInitialPRD = (input: ProductInput): PRDSection[] => {
  const sections: PRDSection[] = [
    {
      id: 'executive-summary',
      title: 'Executive Summary & Product Overview',
      content: generateExecutiveSummary(input),
      isGenerated: false
    },
    {
      id: 'strategic-context',
      title: 'Strategic Context and Background',
      content: generateStrategicContext(input),
      isGenerated: false
    },
    {
      id: 'user-personas',
      title: 'User Personas & Target Market',
      content: generateUserPersonas(input),
      isGenerated: false
    },
    {
      id: 'user-stories',
      title: 'User Stories & Use Cases',
      content: generateUserStories(input),
      isGenerated: false
    },
    {
      id: 'features-requirements',
      title: 'Features & Requirements',
      content: generateFeaturesRequirements(input),
      isGenerated: false
    },
    {
      id: 'success-metrics',
      title: 'Success Metrics & KPIs',
      content: generateSuccessMetrics(input),
      isGenerated: false
    },
    {
      id: 'acceptance-criteria',
      title: 'Acceptance Criteria',
      content: generateAcceptanceCriteria(input),
      isGenerated: false
    },
    {
      id: 'timeline-milestones',
      title: 'Timeline & Milestones',
      content: generateTimelineMilestones(input),
      isGenerated: false
    }
  ];

  return sections;
};

const generateExecutiveSummary = (input: ProductInput): string => {
  return `## Product Name
${input.productName || '[AI to generate based on concept]'}

## Product Vision
${input.businessObjectives || '[AI to transform business objectives into compelling vision]'}

## Problem Statement
[AI to articulate customer/user problem from concept: "${input.productConcept}"]

## Solution Overview
[AI to develop high-level approach and value proposition]

## Target Market
${input.targetPersona || '[AI to expand target market analysis]'}

## Business Objectives
${input.businessObjectives || '[AI to structure business goals]'}`;
};

const generateStrategicContext = (input: ProductInput): string => {
  return `## Market Analysis
[AI to analyze market context from: "${input.competitiveRequirements}"]

## Competitive Landscape
${input.competitiveRequirements || '[AI to research and analyze competitors]'}

## Strategic Rationale
[AI to connect product concept to business strategy]

## Resource Requirements
${input.resourceConsiderations || '[AI to detail resource needs and constraints]'}`;
};

const generateUserPersonas = (input: ProductInput): string => {
  return `## Primary Persona
${input.targetPersona || '[AI to create detailed primary user persona]'}

## Secondary Personas
[AI to identify additional user segments]

## User Journey Mapping
[AI to map current state user journey and pain points]

## Market Sizing
[AI to estimate addressable market for each persona]`;
};

const generateUserStories = (input: ProductInput): string => {
  return `## Epic User Stories
[AI to generate 5-8 epic user stories from product concept]

## Detailed User Stories
[AI to break down epics into specific, testable user stories]

## User Scenarios
[AI to create realistic usage scenarios and workflows]

## Edge Cases
[AI to identify potential edge cases and error scenarios]`;
};

const generateFeaturesRequirements = (input: ProductInput): string => {
  return `## Core Features (Must Have)
[AI to identify critical features for MVP]

## Important Features (Should Have)
[AI to list important but not critical features]

## Nice-to-Have Features
[AI to suggest enhancement features for future releases]

## Technical Requirements
[AI to outline technical specifications and constraints]

## Integration Requirements
[AI to identify external system integrations needed]`;
};

const generateSuccessMetrics = (input: ProductInput): string => {
  return `## Key Performance Indicators (KPIs)
[AI to define measurable success metrics]

## User Engagement Metrics
[AI to specify user behavior and engagement tracking]

## Business Metrics
[AI to align metrics with business objectives]

## Quality Metrics
[AI to define quality and performance standards]

## Measurement Framework
[AI to establish tracking and reporting methodology]`;
};

const generateAcceptanceCriteria = (input: ProductInput): string => {
  return `## Feature Acceptance Criteria
[AI to create testable acceptance criteria for each feature]

## Definition of Done
[AI to establish completion criteria]

## Quality Gates
[AI to define quality checkpoints and testing requirements]

## Launch Criteria
[AI to specify go-live requirements and conditions]`;
};

const generateTimelineMilestones = (input: ProductInput): string => {
  return `## Project Timeline
${input.timelineConstraints || '[AI to create realistic project timeline]'}

## Key Milestones
[AI to identify critical project milestones]

## Dependencies
[AI to map project dependencies and risk factors]

## Resource Allocation
${input.resourceConsiderations || '[AI to plan resource allocation over timeline]'}`;
};

export const generatePRDMarkdown = (sections: PRDSection[], input: ProductInput): string => {
  const header = `# Product Requirements Document: ${input.productName || 'TBD'}

**Generated on:** ${new Date().toLocaleDateString()}
**Status:** ${sections.every(s => s.isGenerated) ? 'AI-Enhanced' : 'Template'}

---

`;

  const sectionContent = sections
    .map(section => `# ${section.title}\n\n${section.content}\n\n---\n`)
    .join('\n');

  return header + sectionContent;
};