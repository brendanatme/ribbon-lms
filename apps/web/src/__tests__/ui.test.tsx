import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProgressBar, Badge } from '@/components/ui';

describe('UI primitives', () => {
  it('renders a progress bar with the right aria value', () => {
    render(<ProgressBar percent={42} />);
    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '42');
  });

  it('renders badge content', () => {
    render(<Badge>Published</Badge>);
    expect(screen.getByText('Published')).toBeInTheDocument();
  });
});
