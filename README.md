# @payjp/react-payments-js: React Component for PAY.JP v2 API

@payjp/react-payments-js は React で payments.js を利用するためのラッパーライブラリです。
各種の Element を React Component として提供します。

## インストール方法

```bash
npm install @payjp/react-payments-js @payjp/payments-js
```

## 使い方

```typescript
import { loadPayments } from '@payjp/payments-js'
import { Elements, PaymentElement, AddressElement, useElements } from '@payjp/react-payments-js';

const PaymentForm = () => {
  const { elements, payments } = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!elements || !payments) {
      return
    }

    setIsLoading(true);
    const { error } = await payments.confirmPayment({
      elements: elements,
      confirmParams: {
        return_url: "https://example.com/return_url",
      },
    });
    setIsLoading(false);

    if (error) {
      console.error(error);
    }
  };

  return (
    <form id="payment-form" onSubmit={onSubmit}>
      <PaymentElement />
      <AddressElement options={{ mode: "shipping" }} />
      <AddressElement options={{ mode: "billing" }} />
      <button type="submit" disabled={isLoading || !elements || !payments} >
        Pay
      </button>
    </form>
  );
}

const paymentsPromise = loadPayments('pk_test_your-public-key-here')

const App = () => (
  <Elements
    paymentsPromise={paymentsPromise}
    options={{
      clientSecret: "client-secret-for-flow-here",
    }}
  >
    <PaymentForm />
  </Elements>
);

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```
