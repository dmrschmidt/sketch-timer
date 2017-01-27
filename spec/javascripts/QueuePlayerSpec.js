function ArgumentCaptor() {}
ArgumentCaptor.prototype.then = function(closure) {
  this.closure = closure
  return new ArgumentCaptor()
}
ArgumentCaptor.prototype.catch = function(closure) {
  this.closure = closure
  return new ArgumentCaptor()
}

function FakeSoundCloudAPI() {}
FakeSoundCloudAPI.prototype.stream = function() {
  return new ArgumentCaptor()
}
FakeSoundCloudAPI.prototype.resolve = function(url) {
  this.lastUrl = url
  return new ArgumentCaptor()
}

function FakePlayer() { this.playState = 0; this.paused = true; this.position = null; }
FakePlayer.prototype.play = function() { this.playState = 1; this.paused = false; }
FakePlayer.prototype.pause = function() { this.playState = 1; this.paused = true; }
FakePlayer.prototype.stop = function() { this.playState = 0; this.paused = true; }
FakePlayer.prototype.on = function(event, handler) { this.lastEvent = event; this.lastHandler = handler; }
FakePlayer.prototype.onPosition = function(startPosition, handler) { this.lastStartPosition = startPosition; this.lastPositionHandler = handler; }

function FakeSoundManager() { this.lastPlayer = null }
FakeSoundManager.prototype.createSound = function(options) {
  this.lastOptions = options
  this.lastPlayer = new FakePlayer()
  return this.lastPlayer
}

describe("QueuePlayer", function() {
  var queuePlayer
  var player
  var soundCloudAPI
  var soundManager
  var apiKey
  var myPlaylistUrl
  var resolvePlaylistCall
  var playlist
  var delegate

  beforeEach(function() {
    myPlaylistUrl = 'https://soundcloud.com/foo'
    soundCloudAPI = new FakeSoundCloudAPI()
    soundManager = new FakeSoundManager()
    apiKey = 'apiKey'
    delegate = { didSwitchTrack: function() {}, didStartPlayback: function() {} }
    queuePlayer = new QueuePlayer(soundCloudAPI, soundManager, apiKey, myPlaylistUrl)
    player = new FakePlayer()
    queuePlayer.delegate = delegate
  })

  describe("prepare", function() {
    describe("when no playlistUrl was provided", function() {
      beforeEach(function() {
        queuePlayer = new QueuePlayer(soundCloudAPI, undefined, undefined)
      })

      it("loads the default playlist", function() {
        queuePlayer.prepare()
        expect(soundCloudAPI.lastUrl).toEqual(defaultPlaylistUrl)
      })
    })

    describe("when playlistUrl was provided", function() {
      it("loads the provided playlist", function() {
        queuePlayer.prepare()
        expect(soundCloudAPI.lastUrl).toEqual(myPlaylistUrl)
      })
    })

    describe("when playlist is resolved", function() {
      beforeEach(function() {
        resolvePlaylistCall = new ArgumentCaptor()
        playlist = { tracks: [{ stream_url: '/stream/tracks/42' }] }
        spyOn(soundCloudAPI, "resolve").and.callFake(function(url) { return resolvePlaylistCall })
        spyOn(delegate, "didStartPlayback")
        queuePlayer.prepare()
        resolvePlaylistCall.closure(playlist)
      })

      it("configures player for a track with authorization", function() {
        var authorizedStreamUrl = playlist.tracks[0].stream_url + '?consumer_key=' + apiKey
        expect(soundManager.lastOptions.url).toEqual(authorizedStreamUrl)
      })

      it("buffers a track from that playlist", function() {
        expect(soundManager.lastOptions.autoLoad).toBeTruthy()
      })

      it("sets a handler to inform the delegate about beginning of playback", function() {
        expect(queuePlayer.player.lastStartPosition).toEqual(50)
      })

      describe("playback start information", function() {
        it("informs the delegate once playback starts", function() {
          queuePlayer.player.lastPositionHandler(12)
          expect(delegate.didStartPlayback).toHaveBeenCalled()
        })
      })
    })
  })

  describe("seamless playback", function() {
    beforeEach(function() {
      resolvePlaylistCall = new ArgumentCaptor()
      playlist = { tracks: [{ stream_url: '/stream/tracks/42' }] }
      spyOn(soundCloudAPI, "resolve").and.callFake(function(url) { return resolvePlaylistCall })
      queuePlayer.prepare()
      resolvePlaylistCall.closure(playlist)
    })

    it("plays next track once current finishes", function() {
      soundManager.lastOptions.onfinish()
      expect(soundManager.lastPlayer).not.toEqual(player)
    })

    it("plays next track silently once current finishes", function() {
      spyOn(delegate, "didSwitchTrack")
      soundManager.lastOptions.onfinish()
      expect(delegate.didSwitchTrack).not.toHaveBeenCalled()
    })
  })

  describe("play", function() {
    beforeEach(function() {
      queuePlayer.player = player
    })

    it("plays the track", function() {
      queuePlayer.play()
      expect(queuePlayer.isPlaying()).toBeTruthy()
    })
  })

  describe("pause", function() {
    beforeEach(function() {
      queuePlayer.player = player
      queuePlayer.player.playState = 1
      queuePlayer.player.paused = false
    })

    it("pauses the track", function() {
      queuePlayer.pause()
      expect(queuePlayer.isPlaying()).toBeFalsy()
    })
  })

  describe("stop", function() {
    beforeEach(function() {
      queuePlayer.player = player
      queuePlayer.player.playState = 1
      queuePlayer.player.paused = false
    })

    it("stops the track", function() {
      queuePlayer.stop()
      expect(queuePlayer.isPlaying()).toBeFalsy()
    })
  })

  describe("position", function() {
    it("returns null, when player is null", function() {
      expect(queuePlayer.position()).toBeNull()
    })

    it("returns player position, when player is set", function() {
      player.position = 42
      queuePlayer.player = player
      expect(queuePlayer.position()).toEqual(42)
    })
  })

  describe("next", function() {
    var newPlayer

    beforeEach(function() {
      newPlayer = new FakePlayer()
      queuePlayer.playlist = { tracks: [{ stream_url: '/stream/tracks/43' }] }
      queuePlayer.player = player

      spyOn(delegate, "didSwitchTrack").and.callThrough()
    })

    it("buffers a new random track", function() {
      queuePlayer.next()
      expect(soundManager.lastOptions.autoLoad).toBeTruthy()
    })

    it("informs it's delegate about the track switch", function() {
      queuePlayer.next()
      expect(delegate.didSwitchTrack).toHaveBeenCalled()
    })

    describe("when not already playing", function() {
      it("does NOT start playback with new track", function() {
        queuePlayer.next()
        expect(queuePlayer.isPlaying()).toBeFalsy()
      })
    })

    describe("when already playing", function() {
      beforeEach(function() {
        queuePlayer.player.playState = 1
        queuePlayer.player.paused = false

        queuePlayer.next()
      })

      it("stops current playback", function() {
        expect(player.playState).toEqual(0)
      })

      it("continues playback with new track", function() {
        expect(queuePlayer.isPlaying()).toBeTruthy()
      })
    })
  })

  describe("signalEnding", function() {
    it("plays an ending sound", function() {
      queuePlayer.signalEnding()
      expect(soundManager.lastOptions.url).toEqual('/resources/ending.mp3')
      expect(soundManager.lastPlayer.playState).toEqual(1)
    })
  })
})
