import { AddressElementComponent, PaymentElementComponent } from "../types";
import { createElementComponent } from "./components/createElementComponent";

export { useElements } from "./components/Elements";

export { Elements } from "./components/Elements";
export const PaymentElement: PaymentElementComponent = createElementComponent("payment");
export const AddressElement: AddressElementComponent = createElementComponent("address");
