// src/__tests__/utils/test-utils.tsx
import React, { ReactElement } from 'react';
import { render, RenderOptions, RenderResult } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Custom render function that wraps components with necessary providers
 * Use this instead of RTL's render for consistent test setup
 */
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  // Add any global providers here (e.g., theme, router, etc.)
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
): RenderResult {
  // Wrapper component with all necessary providers
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <>
        {/* Add global providers here if needed */}
        {/* <ThemeProvider> */}
        {/* <SessionProvider> */}
        {children}
        {/* </SessionProvider> */}
        {/* </ThemeProvider> */}
      </>
    );
  };

  return render(ui, { wrapper: Wrapper, ...options });
}

/**
 * Setup user event for simulating user interactions
 */
function setupUser() {
  return userEvent.setup();
}

/**
 * Utility to wait for element removal (useful for loading states)
 */
async function waitForLoadingToFinish() {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(
    () => {
      expect(document.querySelector('[data-testid="loading"]')).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );
}

/**
 * Mock window.matchMedia for responsive tests
 */
function mockMatchMedia(matches: boolean = false) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

/**
 * Mock IntersectionObserver for components using lazy loading
 */
function mockIntersectionObserver() {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(callback: IntersectionObserverCallback) {}
    observe() {
      return null;
    }
    disconnect() {
      return null;
    }
    unobserve() {
      return null;
    }
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
    root = null;
    rootMargin = '';
    thresholds = [];
  };
}

/**
 * Mock Next.js router for testing navigation
 */
function mockNextRouter(options: {
  pathname?: string;
  query?: Record<string, string>;
  asPath?: string;
  push?: jest.Mock;
  replace?: jest.Mock;
} = {}) {
  const {
    pathname = '/',
    query = {},
    asPath = '/',
    push = jest.fn(),
    replace = jest.fn(),
  } = options;

  jest.mock('next/navigation', () => ({
    useRouter: () => ({
      push,
      replace,
      pathname,
      query,
      asPath,
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
      prefetch: jest.fn(),
    }),
    usePathname: () => pathname,
    useSearchParams: () => new URLSearchParams(Object.entries(query)),
  }));

  return { push, replace };
}

/**
 * Create mock session for authentication tests
 */
function createMockSession(overrides = {}) {
  return {
    user: {
      id: 'test-user-id',
      name: 'Test User',
      email: 'test@example.com',
      role: 'user',
      image: null,
      ...overrides,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Mock console methods to avoid noise in test output
 */
function mockConsole() {
  const originalConsole = { ...console };

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    (console.log as jest.Mock).mockRestore();
    (console.warn as jest.Mock).mockRestore();
    (console.error as jest.Mock).mockRestore();
  });

  return originalConsole;
}

/**
 * Create a mock file for upload testing
 */
function createMockFile(
  filename: string = 'test.jpg',
  type: string = 'image/jpeg',
  size: number = 1024
): File {
  const file = new File([''], filename, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
}

/**
 * Mock fetch for API testing
 */
function mockFetch(response: any, options: { status?: number; ok?: boolean } = {}) {
  const { status = 200, ok = true } = options;

  global.fetch = jest.fn(() =>
    Promise.resolve({
      ok,
      status,
      json: () => Promise.resolve(response),
      text: () => Promise.resolve(JSON.stringify(response)),
      headers: new Headers(),
      redirected: false,
      statusText: ok ? 'OK' : 'Error',
      type: 'basic',
      url: '',
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      arrayBuffer: jest.fn(),
      blob: jest.fn(),
      formData: jest.fn(),
    } as Response)
  );

  return global.fetch as jest.Mock;
}

/**
 * Wait for async operations to complete
 */
async function waitForAsync() {
  const { waitFor } = await import('@testing-library/react');
  await waitFor(() => {}, { timeout: 100 });
}

/**
 * Helper to test accessibility with jest-axe
 */
async function testA11y(container: Element) {
  const { axe } = await import('jest-axe');
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

// Re-export everything from React Testing Library
export * from '@testing-library/react';

// Export custom utilities
export {
  customRender as render,
  setupUser,
  waitForLoadingToFinish,
  mockMatchMedia,
  mockIntersectionObserver,
  mockNextRouter,
  createMockSession,
  mockConsole,
  createMockFile,
  mockFetch,
  waitForAsync,
  testA11y,
};
