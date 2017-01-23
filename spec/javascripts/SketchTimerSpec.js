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

function FakePlayer() { this.playing = false }
FakePlayer.prototype.play = function() { this.playing = true }
FakePlayer.prototype.pause = function() { this.playing = false }
FakePlayer.prototype.isPlaying = function() { return this.playing }

describe("SketchTimer", function() {
  var sketchTimer
  var element
  var container
  var timeFormatter
  var soundCloudAPI

  beforeEach(function() {
    soundCloudAPI = new FakeSoundCloudAPI()
    element = $('<div>')
    container = $('<div>')
    timeFormatter = new TimeFormatter()
    sketchTimer = new SketchTimer(element, container, timeFormatter, soundCloudAPI)
    sketchTimer.init()
  })

  function tap(element, done, timeout) {
    element.trigger("mousedown")

    setTimeout(function() {
      element.trigger("mouseup")
      done()
    }, timeout)
  }

  describe("tapping the container quickly", function() {
    describe("toggles the timer / player", function() {
      describe("when called the first time", function() {
        var streamCall

        beforeEach(function(done) {
          streamCall = new ArgumentCaptor()
          spyOn(soundCloudAPI, "stream").and.callFake(function(url) {
            return streamCall
          })
          tap(container, done, 100)
        })

        it("starts streaming a track", function() {
          expect(soundCloudAPI.stream).toHaveBeenCalled();
        })

        it("changes container to active", function() {
          expect(container.hasClass('active')).toBeTruthy()
        })

        it("once streaming is done, starts playing track", function() {
          var player = new FakePlayer()
          streamCall.closure(player)
          expect(player.playing).toBeTruthy()
        })
      })

      describe("when not called first time", function() {
        var streamCall

        beforeEach(function(done) {
          tap(container, function() {
            var player = new FakePlayer()
            streamCall.closure(player)
            done()
          }, 100)
          streamCall = new ArgumentCaptor()
          spyOn(soundCloudAPI, "stream").and.callFake(function(url) {
            return streamCall
          })
        })

        it("does not start streaming again", function(done) {
          tap(container, function() {}, 100)
          tap(container, done, 100)

          expect(soundCloudAPI.stream.calls.count()).toEqual(1)
        })

        describe("when currently stopped", function() {
          it("changes container to active", function() {
            expect(container.hasClass('active')).toBeTruthy()
          })
        })

        describe("when currently playing", function() {
          beforeEach(function(done) {
            tap(container, done, 100)
          })

          it("changes container to inactive", function(done) {
            tap(container, done, 100)

            expect(container.hasClass('active')).toBeFalsy()
          })
        })
      })
    })
  })

  describe("tapping the container slowly", function() {
    beforeEach(function(done) {
      container.trigger("mousedown")

      setTimeout(function() {
        container.trigger("mouseup")
        done()
      }, 400)
    })

    it("does not toggle the timer / player", function() {
      expect(container.hasClass('active')).toBeFalsy()
    })
  })
})
