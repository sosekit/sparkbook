# Sparkbook!

Sparkbook is a mobile app for saving places as sparks, organizing them into lists, bookmarking places to revisit, and exploring Toronto routes.

## How to run app locally

In the project folder, run:

```sh
npm i
npx expo start
```

To open on the iOS simulator, press `i` in the Expo terminal.

To open on your phone, scan the QR code with Expo Go. If your phone cannot connect, run:

```sh
npx expo start --tunnel
```

For a clean restart, run:

```sh
npx expo start --clear
```

The app currently runs with local demo data, so no backend setup is needed for the prototype.

Please keep this file up to date.

## How to deploy to TestFlight

If `eas-cli` is not installed, run:

```sh
npm install -g eas-cli
```

Login:

```sh
eas login
```

In the project folder, run:

```sh
eas build --profile production -p ios
```

After the build is done, submit it:

```sh
eas submit -p ios
```

On App Store Connect, go to Apps > Sparkbook > TestFlight, then add internal or external testers to the new build.
