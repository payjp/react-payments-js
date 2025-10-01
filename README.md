# @payjp/react-payments-js: React Component for PAY.JP v2 API

@payjp/react-payments-js は React で payments.js を利用するためのラッパーライブラリです。
各種の Form を React Component として提供します。

## インストール方法

```bash
npm install @payjp/react-payments-js @payjp/payments-js
```

## 使い方

```typescript
import { loadPayments } from '@payjp/payments-js'
import { Widgets, PaymentForm, AddressForm, useWidgets } from '@payjp/react-payments-js';

const CheckoutForm = () => {
  const { widgets, payments } = useWidgets();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!widgets || !payments) {
      return
    }

    setIsLoading(true);
    const { error } = await payments.confirmPayment({
      widgets: widgets,
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
      <PaymentForm />
      <AddressForm options={{ mode: "shipping" }} />
      <AddressForm options={{ mode: "billing" }} />
      <button type="submit" disabled={isLoading || !widgets || !payments} >
        Pay
      </button>
    </form>
  );
}

const paymentsPromise = loadPayments('pk_test_your-public-key-here')

const App = () => (
  <Widgets
    paymentsPromise={paymentsPromise}
    options={{
      clientSecret: "client-secret-for-flow-here",
    }}
  >
    <CheckoutForm />
  </Widgets>
);

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```
