# sketch-timer
A timer for sketching sessions

https://invis.io/5S9QWWBQ8#/211353393_Mobile_Portrait

# Deployment

```bash
rake cf:deploy
```

or

```bash
middleman build
cf push sketch-timer -p build/ -b https://github.com/cloudfoundry-incubator/staticfile-buildpack.git
```
