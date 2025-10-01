import * as React from 'react';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

import * as paymentsJs from '@payjp/payments-js';

export interface WidgetsContextValue {
  payments: paymentsJs.PayjpPayments | null;
  widgets: paymentsJs.PayjpWidgets | null;
}

export const WidgetsContext = createContext<WidgetsContextValue | null>(null);

export interface WidgetsProps {
  paymentsPromise: Promise<paymentsJs.PayjpPayments>;
  options: paymentsJs.PayjpWidgetsOptionsClientSecret
}

export const Widgets = (props: PropsWithChildren<WidgetsProps>) => {
  const { paymentsPromise, options, children } = props;
  const { clientSecret, ...updatableOptions } = options;

  const [contextValue, setContextValue] = useState<WidgetsContextValue>({
    payments: null,
    widgets: null,
  });

  React.useLayoutEffect(() => {
    paymentsPromise.then((payments) => {
      setContextValue((currentContextValue) => {
        if (currentContextValue.payments) {
          return currentContextValue;
        } else {
          const widgets = payments.widgets(options);
          return { payments, widgets };
        }
      });
    });
  }, [paymentsPromise, options]);

  React.useEffect(() => {
    if (!contextValue.widgets) {
      return;
    }
    contextValue.widgets.update(updatableOptions);
  }, [JSON.stringify(updatableOptions)]);

  return (
    <WidgetsContext.Provider value={contextValue}>
      {children}
    </WidgetsContext.Provider>
  );
}

export const useWidgets = (): WidgetsContextValue => {
  const contextValue = useContext(WidgetsContext);
  if (!contextValue) {
    throw new Error('useWidgets must be used inside a <Widgets> component');
  }
  return contextValue;
}
