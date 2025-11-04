import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useFormEvent } from '../useFormEvent';

describe('useFormEvent', () => {
  let mockForm: any;

  beforeEach(() => {
    mockForm = {
      on: vi.fn(),
      off: vi.fn(),
    };
  });

  it('should not register event when form is null', () => {
    const handler = vi.fn();

    renderHook(() => useFormEvent(null, 'change', handler));

    expect(mockForm.on).not.toHaveBeenCalled();
  });

  it('should not register event when handler is undefined', () => {
    renderHook(() => useFormEvent(mockForm, 'change', undefined));

    expect(mockForm.on).not.toHaveBeenCalled();
  });

  it('should register event when form and handler are provided', () => {
    const handler = vi.fn();

    renderHook(() => useFormEvent(mockForm, 'change', handler));

    expect(mockForm.on).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should call handler when event is triggered', () => {
    const handler = vi.fn();

    renderHook(() => useFormEvent(mockForm, 'change', handler));

    const registeredHandler = mockForm.on.mock.calls[0][1];
    registeredHandler({ test: 'data' });

    expect(handler).toHaveBeenCalledWith({ test: 'data' });
  });

  it('should unregister event on unmount', () => {
    const handler = vi.fn();

    const { unmount } = renderHook(() => useFormEvent(mockForm, 'change', handler));

    expect(mockForm.on).toHaveBeenCalled();
    const registeredHandler = mockForm.on.mock.calls[0][1];

    unmount();

    expect(mockForm.off).toHaveBeenCalledWith('change', registeredHandler);
  });

  it('should use latest handler without re-registering', () => {
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    const { rerender } = renderHook(
      ({ handler }) => useFormEvent(mockForm, 'change', handler),
      { initialProps: { handler: handler1 } }
    );

    expect(mockForm.on).toHaveBeenCalledTimes(1);
    const registeredHandler = mockForm.on.mock.calls[0][1];

    // Trigger with first handler
    registeredHandler({ test: 'data1' });
    expect(handler1).toHaveBeenCalledWith({ test: 'data1' });
    expect(handler2).not.toHaveBeenCalled();

    // Update handler
    rerender({ handler: handler2 });

    // Should not re-register
    expect(mockForm.on).toHaveBeenCalledTimes(1);
    expect(mockForm.off).not.toHaveBeenCalled();

    // Trigger with updated handler
    registeredHandler({ test: 'data2' });
    expect(handler2).toHaveBeenCalledWith({ test: 'data2' });
  });

  it('should re-register when form changes', () => {
    const handler = vi.fn();
    const mockForm2 = {
      on: vi.fn(),
      off: vi.fn(),
    };

    const { rerender } = renderHook(
      ({ form }) => useFormEvent(form, 'change', handler),
      { initialProps: { form: mockForm } }
    );

    expect(mockForm.on).toHaveBeenCalledTimes(1);
    const registeredHandler1 = mockForm.on.mock.calls[0][1];

    // Change form
    rerender({ form: mockForm2 });

    // Should unregister from old form
    expect(mockForm.off).toHaveBeenCalledWith('change', registeredHandler1);

    // Should register to new form
    expect(mockForm2.on).toHaveBeenCalledWith('change', expect.any(Function));
  });

  it('should re-register when event name changes', () => {
    const handler = vi.fn();

    const { rerender } = renderHook(
      ({ event }) => useFormEvent(mockForm, event, handler),
      { initialProps: { event: 'change' } }
    );

    expect(mockForm.on).toHaveBeenCalledWith('change', expect.any(Function));
    const registeredHandler1 = mockForm.on.mock.calls[0][1];

    mockForm.on.mockClear();
    mockForm.off.mockClear();

    // Change event name
    rerender({ event: 'blur' });

    // Should unregister old event
    expect(mockForm.off).toHaveBeenCalledWith('change', registeredHandler1);

    // Should register new event
    expect(mockForm.on).toHaveBeenCalledWith('blur', expect.any(Function));
  });

  it('should handle multiple arguments passed to handler', () => {
    const handler = vi.fn();

    renderHook(() => useFormEvent(mockForm, 'change', handler));

    const registeredHandler = mockForm.on.mock.calls[0][1];
    registeredHandler('arg1', 'arg2', 'arg3');

    expect(handler).toHaveBeenCalledWith('arg1', 'arg2', 'arg3');
  });
});
