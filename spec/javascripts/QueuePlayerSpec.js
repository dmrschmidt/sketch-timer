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

function FakePlayer() { this.playState = 0; this.paused = true; }
FakePlayer.prototype.play = function() { this.playState = 1; this.paused = false; }
FakePlayer.prototype.pause = function() { this.playState = 1; this.paused = true; }
FakePlayer.prototype.stop = function() { this.playState = 0; this.paused = true; }
FakePlayer.prototype.on = function(event, handler) { this.lastEvent = event; this.lastHandler = handler; }

function FakeSoundManager() {}
FakeSoundManager.prototype.createSound = function(options) { this.lastOptions = options; return new FakePlayer(); }

describe("QueuePlayer", function() {
  var queuePlayer
  var player
  var soundCloudAPI
  var soundManager
  var apiKey
  var myPlaylistUrl

  beforeEach(function() {
    myPlaylistUrl = 'https://soundcloud.com/foo'
    soundCloudAPI = new FakeSoundCloudAPI()
    soundManager = new FakeSoundManager()
    apiKey = 'apiKey'
    queuePlayer = new QueuePlayer(soundCloudAPI, soundManager, apiKey, myPlaylistUrl)
    player = new FakePlayer()
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
      var resolvePlaylistCall
      var playlist

      beforeEach(function() {
        resolvePlaylistCall = new ArgumentCaptor()
        playlist = { tracks: [{ stream_url: '/stream/tracks/42' }] }
        spyOn(soundCloudAPI, "resolve").and.callFake(function(url) { return resolvePlaylistCall })
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

  describe("next", function() {
    var newPlayer
    var delegate

    beforeEach(function() {
      newPlayer = new FakePlayer()
      delegate = { didSwitchTrack: function() {} }
      queuePlayer.playlist = { tracks: [{ stream_url: '/stream/tracks/43' }] }
      queuePlayer.player = player
      queuePlayer.delegate = delegate

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
})
