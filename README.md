# @payjp/react-payments-js: React Component for PAY.JP v2 API

[![npm version](https://img.shields.io/npm/v/@payjp/react-payments-js.svg)](https://www.npmjs.com/package/@payjp/react-payments-js)

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
    const { error } = await widgets.confirmPayment({ return_url: "https://example.com/return_url" });
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

## イベントハンドラー

PaymentForm および AddressForm コンポーネントは、以下のイベントハンドラーをサポートしています。

### PaymentForm

```typescript
<PaymentForm
  onChange={(event) => {
    console.log('Payment method type:', event.value.type);
    console.log('Is complete:', event.complete);
    console.log('Is empty:', event.empty);
  }}
  onFocus={() => console.log('Payment form focused')}
  onBlur={() => console.log('Payment form blurred')}
  onReady={() => console.log('Payment form ready')}
/>
```

**onChange イベント:**

- `elementType`: `"payment"` (固定値)
- `empty`: フォームが空の場合 `true`
- `complete`: フォームが完全に入力された場合 `true`
- `value.type`: 選択された支払い方法のタイプ（`payjp.PaymentMethodTypes` または `null`）

### AddressForm

```typescript
<AddressForm
  options={{ mode: "shipping" }}
  onChange={(event) => {
    console.log('Address mode:', event.elementMode);
    console.log('Name:', event.value.name);
    console.log('Address:', event.value.address);
    console.log('Phone:', event.value.phone);
    console.log('Is complete:', event.complete);
  }}
  onFocus={() => console.log('Address form focused')}
  onBlur={() => console.log('Address form blurred')}
  onReady={() => console.log('Address form ready')}
/>
```

**onChange イベント:**

- `elementType`: `"address"` (固定値)
- `elementMode`: アドレスフォームのモード（`"shipping"` または `"billing"`）
- `empty`: フォームが空の場合 `true`
- `complete`: フォームが完全に入力された場合 `true`
- `value.name`: 入力された名前
- `value.address`: 入力された住所情報
- `value.phone`: 入力された電話番号

### 共通イベント

- `onReady`: フォームの準備が完了したときに発火
- `onFocus`: フォーム内の要素がフォーカスされたときに発火
- `onBlur`: フォーム内の要素からフォーカスが外れたときに発火
