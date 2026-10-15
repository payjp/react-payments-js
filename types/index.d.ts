import { FunctionComponent, PropsWithChildren } from 'react';
import * as paymentsJs from '@payjp/payments-js';

export type PaymentFormProps = {
  options?: paymentsJs.PayjpPaymentFormOptions;
  onBlur?: () => void;
  onFocus?: () => void;
  onReady?: () => void;
  onLoadError?: (event: { error: paymentsJs.PayjpPaymentsError }) => void;
  onChange?: (event: {
    elementType: "payment";
    empty: boolean;
    complete: boolean;
    value: { type: paymentsJs.PaymentMethodTypes | null };
  }) => void;
} & FormProps;

export type AddressFormProps = {
  options: paymentsJs.PayjpAddressFormOptions;
  onBlur?: () => void;
  onFocus?: () => void;
  onReady?: () => void;
  onLoadError?: (event: { error: paymentsJs.PayjpPaymentsError }) => void;
  onChange?: (event: {
    elementType: "address";
    elementMode: paymentsJs.AddressMode;
    empty: boolean;
    complete: boolean;
    value: { name: string; address: paymentsJs.Address; phone: string };
  }) => void;
 } & FormProps

export interface FormProps {
  id?: string;
  className?: string;
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