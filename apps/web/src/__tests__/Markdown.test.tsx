import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Markdown } from '@/components/Markdown';

describe('Markdown renderer', () => {
  it('renders headings, bold, italic, and inline code', () => {
    render(<Markdown content={'## Section\n\nSome **bold** and *italic* and `code` text.'} />);
    expect(screen.getByRole('heading', { name: 'Section' })).toBeInTheDocument();
    expect(screen.getByText('bold').tagName).toBe('STRONG');
    expect(screen.getByText('italic').tagName).toBe('EM');
    expect(screen.getByText('code').tagName).toBe('CODE');
  });

  it('renders a fenced code block, highlighting PHP keywords and variables', () => {
    render(<Markdown content={'```php\n<?php\necho $name;\n```'} />);
    // The keyword and variable are wrapped in their own highlight spans.
    expect(screen.getByText('echo')).toBeInTheDocument();
    expect(screen.getByText('$name')).toBeInTheDocument();
  });

  it('renders a markdown table with a header and body rows', () => {
    const table = ['| Type | Note |', '|---|---|', '| int | whole |', '| bool | logical |'].join(
      '\n',
    );
    render(<Markdown content={table} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: 'Type' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: 'logical' })).toBeInTheDocument();
  });

  it('renders unordered list items', () => {
    render(<Markdown content={'- first\n- second'} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
});
