# sketch-timer
A timer for sketching sessions

# Deployment

```bash
rake cf:deploy
```

or

```bash
middleman build
cf push sketch-timer -p build/ -b https://github.com/cloudfoundry-incubator/staticfile-buildpack.git
```
