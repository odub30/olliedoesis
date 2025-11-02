// src/components/ui/category-badge.test.tsx
import { render, screen } from '@/__tests__/utils/test-utils';
import { CategoryBadge } from './category-badge';
import { testA11y } from '@/__tests__/utils/test-utils';

describe('CategoryBadge Component', () => {
  const defaultProps = {
    name: 'Technology',
    slug: 'technology',
  };

  describe('Rendering', () => {
    it('should render category name', () => {
      render(<CategoryBadge {...defaultProps} />);
      expect(screen.getByText('Technology')).toBeInTheDocument();
    });

    it('should render as clickable link by default', () => {
      render(<CategoryBadge {...defaultProps} />);
      const link = screen.getByRole('link', { name: /technology/i });
      expect(link).toHaveAttribute('href', '/categories/technology');
    });

    it('should render with icon by default', () => {
      render(<CategoryBadge {...defaultProps} />);
      const badge = screen.getByText('Technology').parentElement;
      const icon = badge?.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('should not render icon when showIcon=false', () => {
      render(<CategoryBadge {...defaultProps} showIcon={false} />);
      const badge = screen.getByText('Technology').parentElement;
      const icon = badge?.querySelector('svg');
      expect(icon).not.toBeInTheDocument();
    });
  });

  describe('Variants', () => {
    it('should apply default variant classes', () => {
      render(<CategoryBadge {...defaultProps} variant="default" />);
      const badge = screen.getByText('Technology');
      expect(badge).toHaveClass('bg-primary/10', 'text-primary-700');
    });

    it('should apply primary variant classes', () => {
      render(<CategoryBadge {...defaultProps} variant="primary" />);
      const badge = screen.getByText('Technology');
      expect(badge).toHaveClass('bg-primary-100', 'text-primary-800');
    });

    it('should apply accent variant classes', () => {
      render(<CategoryBadge {...defaultProps} variant="accent" />);
      const badge = screen.getByText('Technology');
      expect(badge).toHaveClass('bg-accent-100', 'text-accent-800');
    });
  });

  describe('Sizes', () => {
    it('should apply small size classes', () => {
      render(<CategoryBadge {...defaultProps} size="sm" />);
      const badge = screen.getByText('Technology');
      expect(badge).toHaveClass('px-2', 'py-1', 'text-xs');
    });

    it('should apply medium size classes (default)', () => {
      render(<CategoryBadge {...defaultProps} size="md" />);
      const badge = screen.getByText('Technology');
      expect(badge).toHaveClass('px-3', 'py-1.5', 'text-sm');
    });

    it('should apply large size classes', () => {
      render(<CategoryBadge {...defaultProps} size="lg" />);
      const badge = screen.getByText('Technology');
      expect(badge).toHaveClass('px-4', 'py-2', 'text-base');
    });
  });

  describe('Interactions', () => {
    it('should call onClick handler when clicked', () => {
      const onClick = jest.fn();
      render(<CategoryBadge {...defaultProps} onClick={onClick} />);

      const badge = screen.getByRole('link', { name: /technology/i });
      badge.click();

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('should be keyboard accessible', () => {
      render(<CategoryBadge {...defaultProps} />);
      const link = screen.getByRole('link', { name: /technology/i });

      link.focus();
      expect(link).toHaveFocus();
    });
  });

  describe('Accessibility', () => {
    it('should have no accessibility violations', async () => {
      const { container} = render(<CategoryBadge {...defaultProps} />);
      await testA11y(container);
    });

    it('should have proper ARIA attributes', () => {
      render(<CategoryBadge {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/categories/technology');
    });
  });

  describe('Differences from TagBadge', () => {
    it('should have font-semibold class (vs font-medium in tags)', () => {
      render(<CategoryBadge {...defaultProps} />);
      const badge = screen.getByText('Technology');
      expect(badge).toHaveClass('font-semibold');
    });

    it('should navigate to /categories/ not /tags/', () => {
      render(<CategoryBadge {...defaultProps} />);
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', '/categories/technology');
    });
  });
});
