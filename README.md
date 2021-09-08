# Retrieving API key

1. Enable the Cloud Text-to-Speech API: [[Enable the API]](https://console.cloud.google.com/flows/enableapi?apiid=texttospeech.googleapis.com&_ga=2.249140558.835811447.1605914316-1356388190.1601382704)
2. Go to [Credentials](https://console.cloud.google.com/apis/credentials) page and `[CREATE CREDENTIALS] -> API key`
3. Replace API key in `.env`

# Configuration

1. Create a Firebase project. Go to `Project settings -> General` and add a new Web App. Replace [firebase.config.json](firebase.config.json) with your configuration.
2. Create a Service Account in `Project settings -> Service accounts`. Replace `FIREBASE_CLIENT_EMAIL` and `FIREBASE_PRIVATE_KEY` in your `.env` file.

# Development

```bash
$ cp .env.example .env
$ npm install
$ npm run dev
```

# Localization

You need to install [Localazy CLI](https://localazy.com/docs/cli/installation).

```bash
$ localazy upload # for uploading your strings to the Localazy platform
$ localazy download # for downloading translation back to your app
```
