import * as React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { Widgets } from '../Widgets';

vi.mock('@payjp/payments-js');

describe('Widgets', () => {
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

  it('should render children', () => {
    const { getByText } = render(
      <Widgets
        paymentsPromise={paymentsPromise}
        options={{ clientSecret: 'test_secret' }}
      >
        <div>Test Child</div>
      </Widgets>
    );

    expect(getByText('Test Child')).toBeTruthy();
  });

  it('should initialize widgets from paymentsPromise', async () => {
    render(
      <Widgets
        paymentsPromise={paymentsPromise}
        options={{ clientSecret: 'test_secret' }}
      >
        <div>Test</div>
      </Widgets>
    );

    await waitFor(() => {
      expect(mockPayments.widgets).toHaveBeenCalledWith({
        clientSecret: 'test_secret',
      });
    });
  });

  it('should initialize widgets with all options', async () => {
    const options = {
      clientSecret: 'test_secret',
      locale: 'en' as const,
      appearance: { theme: 'dark' as const },
    };

    render(
      <Widgets paymentsPromise={paymentsPromise} options={options}>
        <div>Test</div>
      </Widgets>
    );

    await waitFor(() => {
      expect(mockPayments.widgets).toHaveBeenCalledWith(options);
    });
  });

  it('should not recreate widgets on re-render', async () => {
    const { rerender } = render(
      <Widgets
        paymentsPromise={paymentsPromise}
        options={{ clientSecret: 'test_secret' }}
      >
        <div>Test</div>
      </Widgets>
    );

    await waitFor(() => {
      expect(mockPayments.widgets).toHaveBeenCalledTimes(1);
    });

    rerender(
      <Widgets
        paymentsPromise={paymentsPromise}
        options={{ clientSecret: 'test_secret' }}
      >
        <div>Test Updated</div>
      </Widgets>
    );

    await waitFor(() => {
      expect(mockPayments.widgets).toHaveBeenCalledTimes(1);
    });
  });

  it('should call widgets.update when updatable options change', async () => {
    const initialOptions = {
      clientSecret: 'test_secret',
      locale: 'ja' as const,
    };

    const { rerender } = render(
      <Widgets paymentsPromise={paymentsPromise} options={initialOptions}>
        <div>Test</div>
      </Widgets>
    );

    await waitFor(() => {
      expect(mockPayments.widgets).toHaveBeenCalled();
    });

    mockWidgets.update.mockClear();

    const updatedOptions = {
      clientSecret: 'test_secret',
      locale: 'en' as const,
    };

    rerender(
      <Widgets paymentsPromise={paymentsPromise} options={updatedOptions}>
        <div>Test</div>
      </Widgets>
    );

    await waitFor(() => {
      expect(mockWidgets.update).toHaveBeenCalledWith({
        locale: 'en',
      });
    });
  });

  it('should not call widgets.update when only clientSecret changes', async () => {
    const initialOptions = {
      clientSecret: 'test_secret_1',
      locale: 'ja' as const,
    };

    const { rerender } = render(
      <Widgets paymentsPromise={paymentsPromise} options={initialOptions}>
        <div>Test</div>
      </Widgets>
    );

    await waitFor(() => {
      expect(mockPayments.widgets).toHaveBeenCalled();
    });

    mockWidgets.update.mockClear();

    const updatedOptions = {
      clientSecret: 'test_secret_2',
      locale: 'ja' as const,
    };

    rerender(
      <Widgets paymentsPromise={paymentsPromise} options={updatedOptions}>
        <div>Test</div>
      </Widgets>
    );

    // Since only clientSecret changed (which is not updatable) and locale stayed the same,
    // widgets.update should not be called
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockWidgets.update).not.toHaveBeenCalled();
  });
});
