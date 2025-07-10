import * as React from 'react';

import { StyleSheet, View, Button, Alert } from 'react-native';
import {
  isPlatformPaySupported,
  ApplePayButton,
  initStripe,
  confirmPlatformPayPayment,
} from 'stripe-react-native-apple-pay';
import type { PaymentType } from '../../src/types/PlatformPay';

export default function App() {
  return (
    <View style={styles.container}>
      <Button
        onPress={async () => {
          const isSupported = isPlatformPaySupported();
          Alert.alert('Supported' + isSupported ? 'Yes' : 'No');
        }}
        title="Device supports Apple Pay?"
      />
      <ApplePayButton
        type="plain"
        buttonStyle="black"
        onPress={async () => {
          // You need to get clientSecret from your server
          // However while doing that you can also get all the other constants and avoid hardcoding.
          try {
            const response = await fetch(
              `http://localhost:5464/create-payment-intent`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  // feel free to send any extra data such as purchased items to help you calculate price
                }),
              }
            );
            const {
              publishableKey,
              clientSecret,
              merchantIdentifier,
              country,
              currency,
              amount,
            } = await response.json();

            await initStripe({
              publishableKey,
              merchantIdentifier,
            });

            confirmPlatformPayPayment(clientSecret, {
              applePay: {
                cartItems: [
                  {
                    label: 'Test',
                    // presentApplePay expects amount as a formatted string, unlike createGooglePayPaymentMethod 🙃
                    amount: (amount / 100).toFixed(2),
                    paymentType: 'Immediate' as PaymentType.Immediate,
                  },
                ],
                merchantCountryCode: country,
                currencyCode: currency,
              },
            })
              .then(({ error }) => {
                if (error) {
                  if (error.code === 'Canceled') {
                    // Payment method collection has been cancelled by the payment sheet being dismissed, return early
                    return;
                  }

                  Alert.alert('Error', error.message);
                }

                Alert.alert('Success');
              })
              .catch((error) => {
                console.warn(error);
                Alert.alert('Error', error.toString());
              });
          } catch (error) {
            Alert.alert(
              'Server error',
              'Remember to start the server by yarn server\n' + String(error)
            );
          }
        }}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: { width: '100%', height: 52, marginVertical: 20 },
});
