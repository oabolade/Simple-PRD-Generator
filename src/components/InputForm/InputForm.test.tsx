import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import InputForm from './InputForm';
import { ProductInput } from '../../types/prd';

// Mock the icons to avoid import issues in tests
jest.mock('lucide-react', () => ({
  FileText: () => <div data-testid="file-text-icon" />,
  Target: () => <div data-testid="target-icon" />,
  Users: () => <div data-testid="users-icon" />,
  Clock: () => <div data-testid="clock-icon" />,
  DollarSign: () => <div data-testid="dollar-sign-icon" />,
  Lightbulb: () => <div data-testid="lightbulb-icon" />,
}));

describe('InputForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form sections and required fields', () => {
    render(<InputForm onSubmit={mockOnSubmit} isLoading={false} />);

    // Check if main title is rendered
    expect(screen.getByText('PRD Generator')).toBeInTheDocument();

    // Check if required fields are present
    expect(screen.getByLabelText(/Product Concept & Ideas/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Target Persona & Users/)).toBeInTheDocument();

    // Check if submit button is present
    expect(screen.getByText('Generate PRD')).toBeInTheDocument();
  });

  it('disables submit button when required fields are empty', () => {
    render(<InputForm onSubmit={mockOnSubmit} isLoading={false} />);

    const submitButton = screen.getByText('Generate PRD');
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when required fields are filled', async () => {
    render(<InputForm onSubmit={mockOnSubmit} isLoading={false} />);

    const productConceptField = screen.getByLabelText(/Product Concept & Ideas/);
    const targetPersonaField = screen.getByLabelText(/Target Persona & Users/);

    fireEvent.change(productConceptField, {
      target: { value: 'A productivity app for remote workers' }
    });
    fireEvent.change(targetPersonaField, {
      target: { value: 'Remote workers aged 25-40' }
    });

    await waitFor(() => {
      const submitButton = screen.getByText('Generate PRD');
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('calls onSubmit with correct data when form is submitted', async () => {
    render(<InputForm onSubmit={mockOnSubmit} isLoading={false} />);

    // Fill required fields
    const productConceptField = screen.getByLabelText(/Product Concept & Ideas/);
    const targetPersonaField = screen.getByLabelText(/Target Persona & Users/);

    fireEvent.change(productConceptField, {
      target: { value: 'A productivity app for remote workers' }
    });
    fireEvent.change(targetPersonaField, {
      target: { value: 'Remote workers aged 25-40' }
    });

    // Submit form
    const form = screen.getByRole('form') || document.querySelector('form');
    if (form) {
      fireEvent.submit(form);
    }

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          productConcept: 'A productivity app for remote workers',
          targetPersona: 'Remote workers aged 25-40'
        })
      );
    });
  });

  it('shows loading state when isLoading is true', () => {
    render(<InputForm onSubmit={mockOnSubmit} isLoading={true} />);

    expect(screen.getByText('Generating PRD...')).toBeInTheDocument();
    
    // All input fields should be disabled
    const inputs = screen.getAllByRole('textbox');
    inputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });

  it('updates input values correctly', () => {
    render(<InputForm onSubmit={mockOnSubmit} isLoading={false} />);

    const productNameField = screen.getByLabelText(/Product Name/);
    const businessObjectivesField = screen.getByLabelText(/Business Objectives/);

    fireEvent.change(productNameField, {
      target: { value: 'TaskFlow Pro' }
    });
    fireEvent.change(businessObjectivesField, {
      target: { value: 'Increase remote team productivity by 30%' }
    });

    expect(productNameField).toHaveValue('TaskFlow Pro');
    expect(businessObjectivesField).toHaveValue('Increase remote team productivity by 30%');
  });
});