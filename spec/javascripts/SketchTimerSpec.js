
function FakeQueuePlayer() { this.playing = false }
FakeQueuePlayer.prototype.prepare = function() {}
FakeQueuePlayer.prototype.play = function() { this.playing = true }
FakeQueuePlayer.prototype.pause = function() { this.playing = false }
FakeQueuePlayer.prototype.isPlaying = function() { return this.playing }

describe("SketchTimer", function() {
  var sketchTimer
  var element
  var container
  var timeFormatter
  var queuePlayer

  beforeEach(function() {
    queuePlayer = new FakeQueuePlayer()
    element = $('<div>')
    container = $('<div>')
    timeFormatter = new TimeFormatter()
    sketchTimer = new SketchTimer(element, container, timeFormatter, queuePlayer)
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
