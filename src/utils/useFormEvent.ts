import { useEffect, useRef } from "react";
import * as paymentsJs from '@payjp/payments-js';

export const useFormEvent = <T extends (...args: any[]) => any>(
  form: paymentsJs.PayjpForm | null,
  event: string,
  handler?: T
): void => {
  const handlerRef = useRef<T>(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!form || !handler) {
      return;
    }

    const eventHandler = (...args: any[]) => {
      if (handlerRef.current) {
        return handlerRef.current(...args);
      }
    };
    (form as any).on(event, eventHandler);

    return () => {
      (form as any).off(event, eventHandler);
    };
  }, [form, event]);
};