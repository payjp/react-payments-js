import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { Widgets } from '../Widgets';
import { PaymentForm, AddressForm } from '../../index';
import * as React from 'react';

vi.mock('@payjp/payments-js');

describe('createFormComponent', () => {
  const mockForm = {
    mount: vi.fn(),
    unmount: vi.fn(),
    update: vi.fn(),
    collapse: vi.fn(),
    on: vi.fn(),
    off: vi.fn(),
  };

  const mockWidgets = {
    createForm: vi.fn(() => mockForm),
    getForm: vi.fn(),
    update: vi.fn(),
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

  describe('PaymentForm', () => {
    it('should render div with correct id and className', async () => {
      const { container } = render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <PaymentForm id="payment-form" className="payment-class" />
        </Widgets>
      );

      const formDiv = container.querySelector('#payment-form');
      expect(formDiv).toBeTruthy();
      expect(formDiv?.className).toBe('payment-class');
    });

    it('should create payment form with correct type', async () => {
      render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <PaymentForm />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockWidgets.createForm).toHaveBeenCalledWith('payment', undefined);
      });
    });

    it('should create payment form with options', async () => {
      const options = {
        layout: 'accordion' as const,
        defaultValues: {
          billingDetails: {
            name: 'Test User',
          },
        },
      };

      render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <PaymentForm options={options} />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockWidgets.createForm).toHaveBeenCalledWith('payment', options);
      });
    });

    it('should mount form to the DOM', async () => {
      render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <PaymentForm />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockForm.mount).toHaveBeenCalled();
        const mountArg = mockForm.mount.mock.calls[0]?.[0];
        expect(mountArg).toBeInstanceOf(HTMLElement);
      });
    });

    it('should call form.update when options change', async () => {
      const initialOptions = {
        defaultValues: {
          billingDetails: {
            name: 'Initial Name',
          },
        },
      };

      const { rerender } = render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <PaymentForm options={initialOptions} />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockWidgets.createForm).toHaveBeenCalled();
      });

      mockForm.update.mockClear();

      const updatedOptions = {
        defaultValues: {
          billingDetails: {
            name: 'Updated Name',
          },
        },
      };

      rerender(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <PaymentForm options={updatedOptions} />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockForm.update).toHaveBeenCalledWith(updatedOptions);
      });
    });

    it('should not include layout in update call', async () => {
      const initialOptions = {
        layout: 'tab' as const,
        defaultValues: {
          billingDetails: { name: 'Test' },
        },
      };

      const { rerender } = render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <PaymentForm options={initialOptions} />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockWidgets.createForm).toHaveBeenCalled();
      });

      mockForm.update.mockClear();

      const updatedOptions = {
        layout: 'accordion' as const,
        defaultValues: {
          billingDetails: { name: 'Updated' },
        },
      };

      rerender(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <PaymentForm options={updatedOptions} />
        </Widgets>
      );

      await waitFor(() => {
        const updateCall = mockForm.update.mock.calls[0]?.[0];
        expect(updateCall).not.toHaveProperty('layout');
        expect(updateCall).toEqual({
          defaultValues: {
            billingDetails: { name: 'Updated' },
          },
        });
      });
    });

    it('should register event handlers', async () => {
      const onChange = vi.fn();
      const onReady = vi.fn();
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      const onLoadError = vi.fn();

      render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <PaymentForm
            onChange={onChange}
            onReady={onReady}
            onFocus={onFocus}
            onBlur={onBlur}
            onLoadError={onLoadError}
          />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockForm.on).toHaveBeenCalledWith('change', expect.any(Function));
        expect(mockForm.on).toHaveBeenCalledWith('ready', expect.any(Function));
        expect(mockForm.on).toHaveBeenCalledWith('focus', expect.any(Function));
        expect(mockForm.on).toHaveBeenCalledWith('blur', expect.any(Function));
        expect(mockForm.on).toHaveBeenCalledWith('loaderror', expect.any(Function));
      });
    });
  });

  describe('AddressForm', () => {
    it('should render div with correct id and className', async () => {
      const { container } = render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <AddressForm
            id="address-form"
            className="address-class"
            options={{ mode: 'shipping' }}
          />
        </Widgets>
      );

      const formDiv = container.querySelector('#address-form');
      expect(formDiv).toBeTruthy();
      expect(formDiv?.className).toBe('address-class');
    });

    it('should create address form with correct type and options', async () => {
      const options = { mode: 'shipping' as const };

      render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <AddressForm options={options} />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockWidgets.createForm).toHaveBeenCalledWith('address', options);
      });
    });

    it('should mount form to the DOM', async () => {
      render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <AddressForm options={{ mode: 'billing' }} />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockForm.mount).toHaveBeenCalled();
        const mountArg = mockForm.mount.mock.calls[0]?.[0];
        expect(mountArg).toBeInstanceOf(HTMLElement);
      });
    });

    it('should call form.update when options change', async () => {
      const initialOptions = {
        mode: 'shipping' as const,
        defaultValues: {
          name: 'Initial Name',
        },
      };

      const { rerender } = render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <AddressForm options={initialOptions} />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockWidgets.createForm).toHaveBeenCalled();
      });

      mockForm.update.mockClear();

      const updatedOptions = {
        mode: 'shipping' as const,
        defaultValues: {
          name: 'Updated Name',
        },
      };

      rerender(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <AddressForm options={updatedOptions} />
        </Widgets>
      );

      await waitFor(() => {
        const updateCall = mockForm.update.mock.calls[0]?.[0];
        expect(updateCall).toEqual({
          defaultValues: {
            name: 'Updated Name',
          },
        });
      });
    });

    it('should not include mode and autocomplete in update call', async () => {
      const initialOptions = {
        mode: 'shipping' as const,
        autocomplete: { mode: 'automatic' as const },
        defaultValues: { name: 'Test' },
      };

      const { rerender } = render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <AddressForm options={initialOptions} />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockWidgets.createForm).toHaveBeenCalled();
      });

      mockForm.update.mockClear();

      const updatedOptions = {
        mode: 'billing' as const,
        autocomplete: { mode: 'disabled' as const },
        defaultValues: { name: 'Updated' },
      };

      rerender(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <AddressForm options={updatedOptions} />
        </Widgets>
      );

      await waitFor(() => {
        const updateCall = mockForm.update.mock.calls[0]?.[0];
        expect(updateCall).not.toHaveProperty('mode');
        expect(updateCall).not.toHaveProperty('autocomplete');
        expect(updateCall).toEqual({
          defaultValues: { name: 'Updated' },
        });
      });
    });

    it('should register event handlers', async () => {
      const onChange = vi.fn();
      const onReady = vi.fn();
      const onFocus = vi.fn();
      const onBlur = vi.fn();
      const onLoadError = vi.fn();

      render(
        <Widgets
          paymentsPromise={paymentsPromise}
          options={{ clientSecret: 'test_secret' }}
        >
          <AddressForm
            options={{ mode: 'shipping' }}
            onChange={onChange}
            onReady={onReady}
            onFocus={onFocus}
            onBlur={onBlur}
            onLoadError={onLoadError}
          />
        </Widgets>
      );

      await waitFor(() => {
        expect(mockForm.on).toHaveBeenCalledWith('change', expect.any(Function));
        expect(mockForm.on).toHaveBeenCalledWith('ready', expect.any(Function));
        expect(mockForm.on).toHaveBeenCalledWith('focus', expect.any(Function));
        expect(mockForm.on).toHaveBeenCalledWith('blur', expect.any(Function));
        expect(mockForm.on).toHaveBeenCalledWith('loaderror', expect.any(Function));
      });
    });
  });
});
