import { useEffect, useRef } from "react";
import * as paymentsJs from '@payjp/payments-js';

export const useFormEvent = <T extends (...args: any[]) => any>(
  form: paymentsJs.PayjpForm | null,
  event: string,
  handler?: T
): void => {
  if (!form || !handler) {
    return;
  }

  const handlerRef = useRef<T>(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const eventHandler = (...args: any[]) => handlerRef.current(...args);
    (form as any).on(event, eventHandler);

    return () => {
      (form as any).off(event, eventHandler);
    };
  }, [form, event]);
};