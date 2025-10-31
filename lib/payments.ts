export const paymentsConfig = {
  paystackPublicKey: process.env.EXPO_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
};

export const defaultCurrency = "GHS"; // Paystack-supported: NGN, GHS, ZAR, USD (account dependent)
export const currencySymbol = "₵"; // Ghanaian Cedi symbol for display

export function buildPaystackInlineHtml(opts: {
  publicKey: string;
  email: string;
  amountKobo: number;
  reference: string;
  currency?: string;
  metadata?: Record<string, any>;
}): string {
  const {
    publicKey,
    email,
    amountKobo,
    reference,
    currency = defaultCurrency,
    metadata,
  } = opts;
  const metaStr = metadata ? JSON.stringify(metadata) : "{}";
  return `<!DOCTYPE html><html><head><meta name='viewport' content='width=device-width, initial-scale=1' /></head>
  <body>
  <script src="https://js.paystack.co/v1/inline.js"></script>
  <script>
  function pay(){
    var handler = PaystackPop.setup({
      key: '${publicKey}',
      email: '${email}',
      amount: ${amountKobo},
      currency: '${currency}',
      ref: '${reference}',
      metadata: ${metaStr},
      callback: function(response){
        const msg = JSON.stringify({ event: 'success', reference: response.reference });
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(msg);
      },
      onClose: function(){
        const msg = JSON.stringify({ event: 'closed' });
        window.ReactNativeWebView && window.ReactNativeWebView.postMessage(msg);
      }
    });
    handler.openIframe();
  }
  pay();
  </script>
  </body></html>`;
}
