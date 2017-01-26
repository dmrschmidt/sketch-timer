# Zeebn - a sketching session timer

# Usage

Go to https://zeebn.cfapps.io and add it to your home screen to
run as a dedicated web app on your mobile.

By default, Zeebn runs a timer for 7 minutes. Tracks are
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

> http://zeebn.cfapps.io?playlist=https://soundcloud.com/metzeltiger/sets/berghain

## Limitations

### Device Idle Timer Workaround

Adding Zeebn to your home screen, however has the annoying side effect that *device sleep can not be prevented*.
Quite annoying for a timer like this, since also the music playback stops.

A workaround for this is to instead add https://zeebn.cfapps.io/awake to your home screen.
That will keep the unattractive browser canvas visible but at least the device sleep timer will be disabled.

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
