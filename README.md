# sketch-timer
A timer for sketching sessions

https://invis.io/5S9QWWBQ8#/211353393_Mobile_Portrait

# Development / SetUp

## SoundCloud

Get a SoundCloud API client ID. For help see
https://developers.soundcloud.com/ and
http://soundcloud.com/you/apps/new.

Make sure this is set in your
environment as `SOUNDCLOUD_CLIENT_ID`. During development, the
gem `middleman-dotenv` is integrated to use a `.env` file to
store your credentials without having to check them in.
See `.env.example`.

# Deployment

## CloudFoundry

Make sure you have a `manifest.yml` set up, which includes all the
required environment variables and other configurations.

```bash
rake cf:deploy
```

or

```bash
middleman build
cf push sketch-timer -p build/ -b https://github.com/cloudfoundry-incubator/staticfile-buildpack.git
```
