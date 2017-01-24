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
FakeSoundCloudAPI.prototype.get = function(url) {
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
  var soundCloudAPI

  beforeEach(function() {
    soundCloudAPI = new FakeSoundCloudAPI()
    queuePlayer = new QueuePlayer(soundCloudAPI)
  })

  describe("prepare", function() {
    it("loads the given playlist", function() {
      queuePlayer.prepare()
      expect(soundCloudAPI.lastUrl).toEqual('playlists/71646596')
    })

    describe("when playlist is loaded", function() {
      var getPlaylistCall
      var streamCall

      beforeEach(function() {
        getPlaylistCall = new ArgumentCaptor()
        streamCall = new ArgumentCaptor()
        spyOn(soundCloudAPI, "get").and.callFake(function(url) { return getPlaylistCall })
        spyOn(soundCloudAPI, "stream").and.callFake(function(url) { return streamCall })

        queuePlayer.prepare()
      })

      it("buffers a track from that playlist", function() {
        var playlist = { tracks: [ {id: 42}]}
        getPlaylistCall.closure(playlist)

        expect(soundCloudAPI.stream).toHaveBeenCalledWith('tracks/42')
      })
    })
  })

  describe("play", function() {
    var player

    beforeEach(function() {
      player = new FakePlayer()
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
      queuePlayer.player = new FakePlayer()
      queuePlayer.player.playing = true
    })

    it("pauses the SoundCloud player", function() {
      queuePlayer.pause()
      expect(queuePlayer.player.isPlaying()).toBeFalsy()
    })
  })

  describe("stop", function() {
    var player

    beforeEach(function() {
      player = new FakePlayer()
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
})
