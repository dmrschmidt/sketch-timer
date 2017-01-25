# Zeebn - a sketching session timer

# Usage

Go to https://zeebn.cfapps.io and add it to your home screen to run as a dedicated web app on your mobile.

* **play** - tap the screen
* **pause** - tap the screen
* **reset** - long-tap the screen
* **change track** - shake the phone

## Limitations

### Device Idle Timer Workaround

Adding Zeebn to your home screen, however has the annoying side effect that *device sleep can not be prevented*.
Quite annoying for a timer like this, since also the music playback stops.

A workaround for this is to instead add https://zeebn.cfapps.io/awake to your home screen.
That will keep the unattractive browser canvas visible but at least the device sleep timer will be disabled.

### Browser Compatibility

Unfortunately, the used SoundCloud JavaScript SDK does currently only play correctly on iOS devices with Safari.

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
