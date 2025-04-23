import * as React from 'react';
import { createContext, PropsWithChildren, useContext, useState } from 'react';

import * as paymentsJs from '@payjp/payments-js';

export interface ElementsContextValue {
  payments: paymentsJs.PayjpPayments | null;
  elements: paymentsJs.PayjpElements | null;
}

export const ElementsContext = createContext<ElementsContextValue | null>(null);

export interface ElementsProps {
  paymentsPromise: Promise<paymentsJs.PayjpPayments>;
  options: paymentsJs.PayjpElementsOptionsClientSecret
}

export const Elements = (props: PropsWithChildren<ElementsProps>) => {
  const { paymentsPromise, options, children } = props;
  const { clientSecret, ...updatableOptions } = options;

  const [contextValue, setContextValue] = useState<ElementsContextValue>({
    payments: null,
    elements: null,
  });

  React.useLayoutEffect(() => {
    paymentsPromise.then((payments) => {
      setContextValue((currentContextValue) => {
        if (currentContextValue.payments) {
          return currentContextValue;
        } else {
          const elements = payments.elements(options);
          return { payments, elements };
        }
      });
    });
  }, [paymentsPromise, options]);

  React.useEffect(() => {
    if (!contextValue.elements) {
      return;
    }
    contextValue.elements.update(updatableOptions);
  }, [JSON.stringify(updatableOptions)]);

  return (
    <ElementsContext.Provider value={contextValue}>
      {children}
    </ElementsContext.Provider>
  );
}

export const useElements = (): ElementsContextValue => {
  const contextValue = useContext(ElementsContext);
  if (!contextValue) {
    throw new Error('useElements must be used inside an <Elements> component');
  }
  return contextValue;
}
