import { FunctionComponent, PropsWithChildren } from 'react';
import * as paymentsJs from '@payjp/payments-js';

export type PaymentFormProps = { options?: paymentsJs.PayjpPaymentFormOptions; } & FormProps
export type AddressFormProps = { options: paymentsJs.PayjpAddressFormOptions; } & FormProps

export interface FormProps {
  id?: string;
  className?: string;
  onBlur?: (event: {formType: paymentsJs.PayjpFormType}) => any;
  onFocus?: (event: {formType: paymentsJs.PayjpFormType}) => any;
}

export type PaymentFormComponent = FunctionComponent<PaymentFormProps>;
export type AddressFormComponent = FunctionComponent<AddressFormProps>;

export interface WidgetsContextValue {
  payments: paymentsJs.PayjpPayments | null;
  widgets: paymentsJs.PayjpWidgets | null;
}

export interface WidgetsProps {
  paymentsPromise: Promise<paymentsJs.PayjpPayments>;
  options: paymentsJs.PayjpWidgetsOptionsClientSecret;
}

export type WidgetsComponent = FunctionComponent<PropsWithChildren<WidgetsProps>>;


declare module '@payjp/react-payments-js' {
  export const useWidgets: () => WidgetsContextValue;
  export const Widgets: WidgetsComponent;
  export const PaymentForm: PaymentFormComponent;
  export const AddressForm: AddressFormComponent;
}