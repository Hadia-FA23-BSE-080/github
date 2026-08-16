import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Greeting from './Greeting';

describe('Greeting Component', () => {
  it('renders the default greeting when no name is provided', () => {
    render(<Greeting />);
    const headingElement = screen.getByRole('heading', { level: 1 });
    expect(headingElement).toHaveTextContent('Hello, World!');
  });

  it('renders a personalized greeting when a name is provided', () => {
    render(<Greeting name="Alice" />);
    const headingElement = screen.getByRole('heading', { level: 1 });
    expect(headingElement).toHaveTextContent('Hello, Alice!');
  });

  it('renders the welcome message', () => {
    render(<Greeting />);
    const paragraphElement = screen.getByText(/welcome to vitest testing in react/i);
    expect(paragraphElement).toBeInTheDocument();
  });
});
