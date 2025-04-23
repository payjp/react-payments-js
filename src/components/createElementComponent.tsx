import * as React from 'react'
import { FunctionComponent, useLayoutEffect, useEffect } from 'react'
import { useElements } from './Elements'
import * as paymentsJs from '@payjp/payments-js'
import { ElementProps } from '../../types'

export const createElementComponent = (
  type: paymentsJs.PayjpElementType
): FunctionComponent<ElementProps> => {
  const elementComponent: FunctionComponent<
    ElementProps & {
      options?:
        | paymentsJs.PayjpPaymentElementOptions
        | paymentsJs.PayjpAddressElementOptions;
    }
  > = (props) => {
    const { id, className, options } = props;
    const { elements } = useElements();

    const elementRef = React.useRef<paymentsJs.PayjpElement | null>(null);
    const domNodeRef = React.useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      if (elements && !elementRef.current && domNodeRef.current) {
        const element = elements.create(type as any, options as any);
        element.mount(domNodeRef.current);
        elementRef.current = element;
      }
    });

    useEffect(() => {
      if (!elementRef.current) {
        return;
      }

      switch (type) {
        case "payment":
          const { layout, ...updatableOptions } =
            options as paymentsJs.PayjpPaymentElementOptions;
          elementRef.current.update(updatableOptions);
          break;
        case "address":
          const { mode, autocomplete, ...updatableAddressOptions } =
            options as paymentsJs.PayjpAddressElementOptions;
          elementRef.current.update(updatableAddressOptions);
          break;
        default:
          throw new Error(`Unknown element type: ${type}`);
      }
    }, [options]);

    return <div id={id} className={className} ref={domNodeRef} />;
  };

  return elementComponent
};