function FakeQueuePlayer() { this.playing = false }
FakeQueuePlayer.prototype.prepare = function() {}
FakeQueuePlayer.prototype.play = function() { this.playing = true }
FakeQueuePlayer.prototype.pause = function() { this.playing = false }
FakeQueuePlayer.prototype.stop = function() { this.playing = false }
FakeQueuePlayer.prototype.isBuffering = function () { return this._position == null }
FakeQueuePlayer.prototype.position = function () { return this._position }
FakeQueuePlayer.prototype.next = function() {}
FakeQueuePlayer.prototype.isPlaying = function() { return this.playing }
FakeQueuePlayer.prototype.signalEnding = function () {}

function FakeSleepPreventer() { this.sleepPreventionEnabled = false; this.lastElement = null }
FakeSleepPreventer.prototype.watchSleepPrevention = function(element) { this.sleepPreventionEnabled = true; this.lastElement = element; }

describe("SketchTimer", function() {
  var sketchTimer
  var element
  var container
  var timeFormatter
  var queuePlayer
  var sleepPreventer

  beforeEach(function() {
    queuePlayer = new FakeQueuePlayer()
    sleepPreventer = new FakeSleepPreventer()
    element = $('<div>')
    container = $('<div>')
    timeFormatter = new TimeFormatter()
    sketchTimer = new SketchTimer(element, container, timeFormatter, queuePlayer, sleepPreventer)
    sketchTimer.init()
    sketchTimer.timerInterval = 50
    sketchTimer.longTapThresholdMs = 100
  })

  afterEach(function() {
    queuePlayer.pause()
  })

  function tap(element, done, timeout) {
    element.trigger("mousedown")
    setTimeout(function() {
      element.trigger("mouseup")
      done()
    }, timeout)
  }

  function slowTap(element, done) {
    element.trigger("mousedown")
    setTimeout(function() {
      element.trigger("mouseup")
      done()
    }, 110)
  }

  it("initiates sleep prevention watching", function() {
    expect(sleepPreventer.sleepPreventionEnabled).toBeTruthy()
  })

  describe("tapping the container quickly", function() {
    describe("toggles the timer / player", function() {
      describe("when currently stopped", function() {
        describe("when already buffered", function() {
          beforeEach(function(done) {
            queuePlayer._position = 100
            container.addClass('buffering')
            tap(container, done, 20)
          })

          it("requests playback", function() {
            expect(queuePlayer.isPlaying()).toBeTruthy()
          })

          it("changes container to active", function() {
            expect(container.hasClass('active')).toBeTruthy()
          })

          it("removes buffering state from container", function() {
            expect(container.hasClass('buffering')).toBeFalsy()
          })
        })

        describe("when not yet buffered", function() {
          beforeEach(function(done) {
            tap(container, done, 20)
          })

          it("requests playback", function() {
            expect(queuePlayer.isPlaying()).toBeTruthy()
          })

          it("does not mark container active", function() {
            expect(container.hasClass('active')).toBeFalsy()
          })

          it("changes container to buffering", function() {
            expect(container.hasClass('buffering')).toBeTruthy()
          })
        })
      })

      describe("when currently playing", function() {
        beforeEach(function(done) {
          tap(container, function() {}, 20)
          tap(container, done, 40)
        })

        it("stops playing", function() {
          expect(queuePlayer.isPlaying()).toBeFalsy()
        })

        it("changes container to inactive", function() {
          expect(container.hasClass('active')).toBeFalsy()
        })
      })
    })
  })

  describe("tapping the container slowly", function() {
    beforeEach(function(done) {
      slowTap(container, done)
    })

    it("does not toggle the timer / player", function() {
      expect(container.hasClass('active')).toBeFalsy()
    })

    describe("when already playing", function() {
      beforeEach(function(done) {
        queuePlayer._position = 100
        tap(container, function() {}, 20)
        setTimeout(done, 100)
      })

      describe("reset", function() {
        beforeEach(function(done) {
          spyOn(queuePlayer, "stop").and.callThrough()
          expect(element.html()).not.toEqual("7:00")
          slowTap(container, function() {})
          setTimeout(done, 100)
        })

        it("resets the time (stops countdown too, annoying to test)", function() {
          expect(element.html()).toEqual("7:00")
        })

        it("stops the queue player", function() {
          expect(queuePlayer.stop).toHaveBeenCalled()
        })

        it("marks timer as inactive", function() {
          expect(container.hasClass('active')).toBeFalsy()
        })
      })
    })
  })

  describe("shaking", function() {
    it("tells the player to change the track", function() {
      spyOn(queuePlayer, "next")
      sketchTimer.shake()
      expect(queuePlayer.next).toHaveBeenCalled()
    })
  })

  describe("didSwitchTrack", function() {
    it("marks timer as switching", function() {
      sketchTimer.didSwitchTrack()
      expect(container.hasClass('switching')).toBeTruthy()
    })

    describe("after a short timeout", function() {
      beforeEach(function(done) {
        sketchTimer.didSwitchTrack()
        setTimeout(done, 500)
      })

      it("marks timer as normal again", function() {
        expect(container.hasClass('switching')).toBeFalsy()
      })
    })
  })

  describe("willStartPlayback", function() {
    describe("when player has not yet been playing", function() {
      it("marks player as buffering", function() {
        sketchTimer.willStartPlayback()
        expect(container.hasClass('buffering')).toBeTruthy()
      })
    })

    describe("when player has already been playing", function() {
      beforeEach(function() {
        queuePlayer._position = 42
      })

      it("marks player as active", function() {
        sketchTimer.willStartPlayback()
        expect(container.hasClass('active')).toBeTruthy()
      })

      it("does not mark player as buffering", function() {
        sketchTimer.willStartPlayback()
        expect(container.hasClass('buffering')).toBeFalsy()
      })
    })
  })

  describe("didStartPlayback", function() {
    it("unmarks player as buffering", function() {
      container.addClass('buffering')
      sketchTimer.didStartPlayback()
      expect(container.hasClass('buffering')).toBeFalsy()
    })
  })

  describe("warning sounds", function() {
    beforeEach(function(done) {
      sketchTimer.sketchingEndingTime = sketchTimer.sketchingDuration - 1
      queuePlayer._position = 42

      spyOn(queuePlayer, "signalEnding")

      sketchTimer.play()

      setTimeout(done, 1000)
    })

    it("plays an ending sound at given time", function() {
      expect(queuePlayer.signalEnding).toHaveBeenCalled()
    })
  })
})
