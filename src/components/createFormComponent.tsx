import * as React from 'react'
import { useState, FunctionComponent, useLayoutEffect, useEffect } from 'react'
import { useWidgets } from './Widgets'
import * as paymentsJs from '@payjp/payments-js'
import { AddressFormProps, FormProps, PaymentFormProps } from '../../types'
import { useFormEvent } from '../utils/useFormEvent'

export const createFormComponent = (
  type: paymentsJs.PayjpFormType
): FunctionComponent<FormProps> => {
  const formComponent: FunctionComponent<
    PaymentFormProps | AddressFormProps
  > = (props) => {
    const { id, className, options } = props;
    const { widgets } = useWidgets();

    const [form, setForm] = useState<paymentsJs.PayjpForm | null>(null);
    const domNodeRef = React.useRef<HTMLDivElement | null>(null);

    useLayoutEffect(() => {
      if (widgets && !form && domNodeRef.current) {
        const form = widgets.createForm(type as any, options as any);
        form.mount(domNodeRef.current);
        setForm(form);
      }
    });

    useEffect(() => {
      if (!form) {
        return;
      }

      switch (type) {
        case "payment":
          const { layout, ...updatableOptions } =
            options as paymentsJs.PayjpPaymentFormOptions;
          form.update(updatableOptions);
          break;
        case "address":
          const { mode, autocomplete, ...updatableAddressOptions } =
            options as paymentsJs.PayjpAddressFormOptions;
          form.update(updatableAddressOptions);
          break;
        default:
          throw new Error(`Unknown form type: ${type}`);
      }
    }, [options]);

    useFormEvent(form, "change", props.onChange);
    useFormEvent(form, "blur", props.onBlur);
    useFormEvent(form, "focus", props.onFocus);
    useFormEvent(form, "ready", props.onReady);
    useFormEvent(form, "loaderror", props.onLoadError);

    return <div id={id} className={className} ref={domNodeRef} />;
  };

  return formComponent
};