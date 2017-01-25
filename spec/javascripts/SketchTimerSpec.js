function FakeQueuePlayer() { this.playing = false }
FakeQueuePlayer.prototype.prepare = function() {}
FakeQueuePlayer.prototype.play = function() { this.playing = true }
FakeQueuePlayer.prototype.pause = function() { this.playing = false }
FakeQueuePlayer.prototype.stop = function() { this.playing = false }
FakeQueuePlayer.prototype.next = function() {}
FakeQueuePlayer.prototype.isPlaying = function() { return this.playing }

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
    }, 500)
  }

  it("initiates sleep prevention watching", function() {
    expect(sleepPreventer.sleepPreventionEnabled).toBeTruthy()
  })

  describe("tapping the container quickly", function() {
    describe("toggles the timer / player", function() {
      describe("when currently stopped", function() {
        beforeEach(function(done) {
          tap(container, done, 100)
        })

        it("starts playing", function() {
          expect(queuePlayer.isPlaying()).toBeTruthy()
        })

        it("changes container to active", function() {
          expect(container.hasClass('active')).toBeTruthy()
        })
      })

      describe("when currently playing", function() {
        beforeEach(function(done) {
          tap(container, function() {}, 100)
          tap(container, done, 150)
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
        tap(container, function() {}, 100)
        setTimeout(done, 1400)
      })

      describe("reset", function() {
        beforeEach(function(done) {
          spyOn(queuePlayer, "stop").and.callThrough()
          expect(element.html()).toEqual("6:59")
          slowTap(container, function() {})
          setTimeout(done, 1400)
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
})
