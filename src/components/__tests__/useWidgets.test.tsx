import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useWidgets, Widgets } from '../Widgets';
import * as React from 'react';

vi.mock('@payjp/payments-js');

describe('useWidgets', () => {
  const mockWidgets = {
    update: vi.fn(),
    createForm: vi.fn(),
    getForm: vi.fn(),
    fetchUpdates: vi.fn(),
    confirmPayment: vi.fn(),
    confirmSetup: vi.fn(),
  };

  const mockPayments = {
    widgets: vi.fn(() => mockWidgets),
    retrievePaymentFlow: vi.fn(),
    retrieveSetupFlow: vi.fn(),
  };

  let paymentsPromise: Promise<typeof mockPayments>;

  beforeEach(() => {
    vi.clearAllMocks();
    paymentsPromise = Promise.resolve(mockPayments as any);
  });

  it('should throw error when used outside Widgets component', () => {
    expect(() => {
      renderHook(() => useWidgets());
    }).toThrow('useWidgets must be used inside a <Widgets> component');
  });

  it('should return context value when used inside Widgets component', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <Widgets
        paymentsPromise={paymentsPromise}
        options={{ clientSecret: 'test_secret' }}
      >
        {children}
      </Widgets>
    );

    const { result } = renderHook(() => useWidgets(), { wrapper });

    // Initially, payments and widgets should be null
    expect(result.current.payments).toBeNull();
    expect(result.current.widgets).toBeNull();

    // Wait for the promise to resolve and state to update
    await waitFor(() => {
      expect(result.current.payments).toBeTruthy();
      expect(result.current.widgets).toBeTruthy();
    });

    expect(result.current.payments).toBe(mockPayments);
    expect(result.current.widgets).toBe(mockWidgets);
  });
});
