import { FunctionComponent, PropsWithChildren } from 'react';
import * as paymentsJs from '@payjp/payments-js';

export type PaymentElementProps = { options?: paymentsJs.PayjpPaymentElementOptions; } & ElementProps
export type AddressElementProps = { options: paymentsJs.PayjpAddressElementOptions; } & ElementProps

export interface ElementProps {
  id?: string;
  className?: string;
  onBlur?: (event: {elementType: paymentsJs.PayjpElementType}) => any;
  onFocus?: (event: {elementType: paymentsJs.PayjpElementType}) => any;
}

export type PaymentElementComponent = FunctionComponent<PaymentElementProps>;
export type AddressElementComponent = FunctionComponent<AddressElementProps>;

export interface ElementsContextValue {
  payments: paymentsJs.PayjpPayments | null;
  elements: paymentsJs.PayjpElements | null;
}

export interface ElementsProps {
  paymentsPromise: Promise<paymentsJs.PayjpPayments>;
  options: paymentsJs.PayjpElementsOptionsClientSecret;
}

export type ElementsComponent = FunctionComponent<PropsWithChildren<ElementsProps>>;


declare module '@payjp/react-payments-js' {
  export const useElements: () => ElementsContextValue;
  export const Elements: ElementsComponent;
  export const PaymentElement: PaymentElementComponent;
  export const AddressElement: AddressElementComponent;
}