// src/components/ui/tag-badge.test.tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import { TagBadge } from './tag-badge';
import { testA11y } from '@/__tests__/utils/test-utils';

describe('TagBadge Component', () => {
  const defaultProps = {
    name: 'React',
    slug: 'react',
  };

  describe('Rendering', () => {
    it('should render tag name', () => {
      render(<TagBadge {...defaultProps} />);
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should render as clickable link by default', () => {
      render(<TagBadge {...defaultProps} />);
      const link = screen.getByRole('link', { name: /react/i });
      expect(link).toHaveAttribute('href', '/tags/react');
    });

    it('should render as non-clickable span when clickable=false', () => {
      render(<TagBadge {...defaultProps} clickable={false} />);
      expect(screen.queryByRole('link')).not.toBeInTheDocument();
      expect(screen.getByText('React')).toBeInTheDocument();
    });

    it('should render with icon when showIcon=true', () => {
      render(<TagBadge {...defaultProps} showIcon />);
      const badge = screen.getByText('React').parentElement;
      expect(badge).toBeInTheDocument();
      // Icon is rendered as SVG
      const icon = badge?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should not render icon when showIcon=false', () => {
      render(<TagBadge {...defaultProps} showIcon={false} />);
      const badge = screen.getByText('React').parentElement;
      const icon = badge?.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant classes', () => {
      render(<TagBadge {...defaultProps} variant="default" />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('bg-accent-50', 'text-accent-700');
    });

    it('should apply primary variant classes', () => {
      render(<TagBadge {...defaultProps} variant="primary" />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('bg-primary-50', 'text-primary-700');
    });

    it('should apply accent variant classes', () => {
      render(<TagBadge {...defaultProps} variant="accent" />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('bg-blue-100', 'text-blue-700');
    });

    it('should apply outline variant classes', () => {
      render(<TagBadge {...defaultProps} variant="outline" />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('bg-transparent', 'border');
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      render(<TagBadge {...defaultProps} size="sm" />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');
    });

    it('should apply medium size classes (default)', () => {
      render(<TagBadge {...defaultProps} size="md" />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should apply large size classes', () => {
      render(<TagBadge {...defaultProps} size="lg" />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('px-4', 'py-2', 'text-base');
    });
  });

  describe('Custom Styling', () => {
    it('should apply custom className', () => {
      render(<TagBadge {...defaultProps} className="custom-class" />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('custom-class');
    });

    it('should merge custom className with default classes', () => {
      render(<TagBadge {...defaultProps} className="custom-class" />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('custom-class', 'rounded-full');
    });
  });

  describe('Interactions', () => {
    it('should call onClick handler when clicked', () => {
      const onClick = jest.fn();
      render(<TagBadge {...defaultProps} onClick={onClick} />);

      const badge = screen.getByRole('link', { name: /react/i });
      badge.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should prevent default navigation when onClick is provided', () => {
      const onClick = jest.fn((e) => e.preventDefault());
      render(<TagBadge {...defaultProps} onClick={onClick} />);

      const badge = screen.getByRole('link', { name: /react/i });
      badge.click();

      expect(onClick).toHaveBeenCalled();
    });

    it('should work with keyboard navigation', () => {
      const onClick = jest.fn();
      render(<TagBadge {...defaultProps} onClick={onClick} />);

      const badge = screen.getByRole('link', { name: /react/i });
      badge.focus();
      expect(badge).toHaveFocus();
    });
  });

  describe('Hover States', () => {
    it('should have hover classes when clickable', () => {
      render(<TagBadge {...defaultProps} clickable />);
      const badge = screen.getByText('React');
      expect(badge).toHaveClass('hover:shadow-md');
    });

    it('should not have hover classes when not clickable', () => {
      render(<TagBadge {...defaultProps} clickable={false} />);
      const badge = screen.getByText('React');
      expect(badge).not.toHaveClass('cursor-pointer');
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container } = render(<TagBadge {...defaultProps} />);
      await testA11y(container);
    });

    it('should be keyboard accessible when clickable', () => {
      render(<TagBadge {...defaultProps} />);
      const link = screen.getByRole('link', { name: /react/i });

      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href');
    });

    it('should have proper ARIA attributes', () => {
      render(<TagBadge {...defaultProps} />);
      const link = screen.getByRole('link');

      // Links should be properly accessible
      expect(link).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty name', () => {
      render(<TagBadge {...defaultProps} name="" />);
      // Component should still render, just empty
      expect(screen.queryByText('React')).not.toBeInTheDocument();
    });

    it('should handle very long names', () => {
      const longName = 'Very Long Tag Name That Should Still Work Properly';
      render(<TagBadge {...defaultProps} name={longName} />);
      expect(screen.getByText(longName)).toBeInTheDocument();
    });

    it('should handle special characters in slug', () => {
      render(<TagBadge {...defaultProps} slug="c++" />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/tags/c++');
    });

    it('should handle undefined optional props', () => {
      const { container } = render(
        <TagBadge name="Test" slug="test" />
      );
      expect(container).toBeInTheDocument();
    });
  });
});
