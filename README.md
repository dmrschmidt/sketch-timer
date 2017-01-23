# sketch-timer
A timer for sketching sessions

https://invis.io/5S9QWWBQ8#/211353393_Mobile_Portrait

# Development / SetUp

Get a SoundCloud API client ID. Make sure this is set in your environment as `SOUNDCLOUD_CLIENT_ID`. During development, the gem `middleman-dotenv` is integrated to use a `.env` file to store your credentials without having to check them in. See `.env.example`.

# Deployment

```bash
rake cf:deploy
```

or

```bash
middleman build
cf push sketch-timer -p build/ -b https://github.com/cloudfoundry-incubator/staticfile-buildpack.git
```
