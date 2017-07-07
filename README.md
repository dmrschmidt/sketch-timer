# Zeebn - a sketching session timer [![Build Status](https://travis-ci.org/dmrschmidt/zeebn.svg?branch=master)](https://travis-ci.org/dmrschmidt/zeebn)

# Usage

Go to https://zeebn.cfapps.io and add it to your home screen to
run as a dedicated web app on your mobile.

Zeebn runs a timer for 7 minutes. Tracks are
shuffled from the selected playlist each time the app opens.
Playback is continuous, i.e. when a track finishes before the
timer runs out, the next track will be played seamlessly.
A warning tone will signal when 2 minutes are remaining and an
ending tone, when the timer is about to run out.

## Controls

* **play** - tap the screen
* **pause** - tap the screen
* **reset** - long-tap the screen
* **change track** - shake the phone

## Custom Playlists / Music

By default, Zeebn plays randomly selected tracks from a default
SoundCloud playlist. You can, however customize the playlist.
Simply add a url parameter `playlist` to the URL. The value
needs to be the full URL of that playlist, as it is shown in your
browser's URL bar when viewing the playlist on SoundCloud.

For instance:

> https://zeebn.cfapps.io?playlist=https://soundcloud.com/metzeltiger/sets/berghain

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

To run the app locally, run

`middleman serve`

To run the specs, run

`rake jasmine`

and open the indicated jasmine server in your local browser.

# Deployment

## Cloud Foundry - automatic deploy

Pushing to this repository automatically deploys the app to Cloud Foundry through [Travis CI](https://travis-ci.org/dmrschmidt/zeebn). It pushes to https://zeebn.cfapps.io so no further action is required. Tests are run before pushing to ensure the code still works as expected.

## Cloud Foundry - manual deploy

Make sure you are logged in to your Cloud Foundry instance and have a
`manifest.yml` set up, which includes all the required environment variables
and other configurations. If you already created an app, you can create this
file with the CF CLI:

```bash
cf create-app-manifest YOUR_APP_NAME
```

Then you can deploy using this rake task:

```bash
rake cf:deploy
```

# Attributions

Uses the amazing [NoSleep.js](https://github.com/richtr/NoSleep.js) to prevent the app from sleeping.
