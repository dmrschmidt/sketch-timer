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

function FakePlayer() { this.playing = false }
FakePlayer.prototype.play = function() { this.playing = true }
FakePlayer.prototype.pause = function() { this.playing = false }
FakePlayer.prototype.seek = function(timestamp) { this.lastSeek = timestamp }
FakePlayer.prototype.isPlaying = function() { return this.playing }
FakePlayer.prototype.on = function(event, handler) { this.lastEvent = event; this.lastHandler = handler; }

describe("QueuePlayer", function() {
  var queuePlayer
  var player
  var soundCloudAPI
  var myPlaylistUrl

  beforeEach(function() {
    myPlaylistUrl = 'https://soundcloud.com/foo'
    soundCloudAPI = new FakeSoundCloudAPI()
    queuePlayer = new QueuePlayer(soundCloudAPI, myPlaylistUrl)
    player = new FakePlayer()
  })

  describe("prepare", function() {
    describe("when no playlistUrl was provided", function() {
      beforeEach(function() {
        queuePlayer = new QueuePlayer(soundCloudAPI, undefined)
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

    describe("when playlist is loaded", function() {
      var resolvePlaylistCall
      var streamCall

      beforeEach(function() {
        resolvePlaylistCall = new ArgumentCaptor()
        streamCall = new ArgumentCaptor()
        spyOn(soundCloudAPI, "resolve").and.callFake(function(url) { return resolvePlaylistCall })
        spyOn(soundCloudAPI, "stream").and.callFake(function(url) { return streamCall })

        queuePlayer.prepare()
      })

      it("buffers a track from that playlist", function() {
        var playlist = { tracks: [ {id: 42}]}
        resolvePlaylistCall.closure(playlist)

        expect(soundCloudAPI.stream).toHaveBeenCalledWith('tracks/42')
      })
    })
  })

  describe("play", function() {
    beforeEach(function() {
      queuePlayer.play()
    })

    describe("when track is not yet buffered", function() {
      it("does not do anything", function() {
        expect(queuePlayer.isPlaying()).toBeFalsy()
      })
    })

    describe("when track is buffered", function() {
      beforeEach(function(done) {
        spyOn(player, "seek").and.callThrough()
        spyOn(player, "play").and.callThrough()

        queuePlayer.resolvePreBuffering(player)
        setTimeout(done, 50) // give buffering Promise time to resolve
      })

      it("configures player for eternal repeat", function() {
        player.lastHandler()

        expect(player.lastEvent).toEqual('finish')
        expect(player.seek).toHaveBeenCalledWith(0)
        expect(player.play).toHaveBeenCalled()
      })

      it("starts playing track", function() {
        expect(player.isPlaying()).toBeTruthy()
      })
    })
  })

  describe("pause", function() {
    beforeEach(function() {
      queuePlayer.player = player
      queuePlayer.player.playing = true
    })

    it("pauses the SoundCloud player", function() {
      queuePlayer.pause()
      expect(queuePlayer.player.isPlaying()).toBeFalsy()
    })
  })

  describe("stop", function() {
    beforeEach(function() {
      queuePlayer.player = player
      queuePlayer.player.playing = true
    })

    it("stops the SoundCloud player", function() {
      queuePlayer.stop()
      expect(queuePlayer.player.isPlaying()).toBeFalsy()
    })

    it("rewinds the track", function() {
      queuePlayer.stop()
      expect(player.lastSeek).toEqual(0)
    })
  })

  describe("next", function() {
    var newPlayer
    var delegate

    beforeEach(function(done) {
      newPlayer = new FakePlayer()
      delegate = { didSwitchTrack: function() {} }
      queuePlayer.playlist = { tracks: [ {id: 43}]}
      queuePlayer.player = player
      queuePlayer.delegate = delegate

      spyOn(delegate, "didSwitchTrack").and.callThrough()
      spyOn(soundCloudAPI, "stream").and.callThrough()
      queuePlayer.next()
      queuePlayer.resolvePreBuffering(newPlayer)
      setTimeout(done, 50) // give buffering Promise time to resolve
    })

    it("buffers a new random track", function() {
      expect(soundCloudAPI.stream).toHaveBeenCalled()
    })

    it("informs it's delegate about the track switch", function() {
      expect(delegate.didSwitchTrack).toHaveBeenCalled()
    })

    describe("when not already playing", function() {
      it("does NOT start playback with new track", function() {
        expect(queuePlayer.player.isPlaying()).toBeFalsy()
      })
    })

    describe("when already playing", function() {
      beforeEach(function(done) {
        queuePlayer.player.playing = true

        queuePlayer.next()
        queuePlayer.resolvePreBuffering(newPlayer)
        setTimeout(done, 50) // give buffering Promise time to resolve
      })

      it("stops current playback", function() {
        expect(player.isPlaying()).toBeFalsy()
      })

      it("continues playback with new track", function() {
        expect(queuePlayer.player.isPlaying()).toBeTruthy()
      })
    })
  })
})
