import { AddressFormComponent, PaymentFormComponent } from "../types";
import { createFormComponent } from "./components/createFormComponent";

export { useWidgets } from "./components/Widgets";

export { Widgets } from "./components/Widgets";
export const PaymentForm: PaymentFormComponent = createFormComponent("payment");
export const AddressForm: AddressFormComponent = createFormComponent("address");
