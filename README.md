# stripe-react-native-apple-pay

React Native wrapper around Stripe Apple Pay. Currently there are very limited configuration options. Feel free to open a PR to add more.

This is a fork of [react-native-stripe-apple-pay](https://github.com/RobertSasak/react-native-stripe-apple-pay) with the addition of an `ApplePayButton` component and updates to the API to align more with [@stripe/stripe-react-native](https://github.com/stripe/stripe-react-native)

## Installation

```sh
yarn add install stripe-react-native-apple-pay
```

## Testing

Before including this library in your project you can test it by running the example app and example server.

### Install dependencies

```sh
yarn
```

### Run server

```sh
export SECRET_KEY=sk_test_...
export PUBLISHABLE_KEY=pk_test_...
yarn server
# or
SECRET_KEY=sk_test_... PUBLISHABLE_KEY=pk_test_... yarn server
```

### Run example app

```sh
yarn example ios
# or select a simulator
yarn example ios --simulator "iPhone 15 Pro Max"
```

## Usage

See example and server folder.

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
