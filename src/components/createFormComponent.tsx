import * as React from 'react'
import { FunctionComponent, useLayoutEffect, useEffect } from 'react'
import { useWidgets } from './Widgets'
import * as paymentsJs from '@payjp/payments-js'
import { FormProps } from '../../types'

export const createFormComponent = (
  type: paymentsJs.PayjpFormType
): FunctionComponent<FormProps> => {
  const formComponent: FunctionComponent<
    FormProps & {
      options?:
        | paymentsJs.PayjpPaymentFormOptions
        | paymentsJs.PayjpAddressFormOptions;
    }
  > = (props) => {
    const { id, className, options } = props;
    const { widgets } = useWidgets();

    const formRef = React.useRef<paymentsJs.PayjpForm | null>(null);
    const domNodeRef = React.useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      if (widgets && !formRef.current && domNodeRef.current) {
        const form = widgets.createForm(type as any, options as any);
        form.mount(domNodeRef.current);
        formRef.current = form;
      }
    });

    useEffect(() => {
      if (!formRef.current) {
        return;
      }

      switch (type) {
        case "payment":
          const { layout, ...updatableOptions } =
            options as paymentsJs.PayjpPaymentFormOptions;
          formRef.current.update(updatableOptions);
          break;
        case "address":
          const { mode, autocomplete, ...updatableAddressOptions } =
            options as paymentsJs.PayjpAddressFormOptions;
          formRef.current.update(updatableAddressOptions);
          break;
        default:
          throw new Error(`Unknown form type: ${type}`);
      }
    }, [options]);

    return <div id={id} className={className} ref={domNodeRef} />;
  };

  return formComponent
};