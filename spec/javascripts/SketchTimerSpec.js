describe("SketchTimer", function() {
  var sketchTimer
  var element
  var container
  var timeFormatter

  beforeEach(function() {
    element = $('<div>')
    container = $('<div>')
    timeFormatter = new TimeFormatter()
    sketchTimer = new SketchTimer()
    sketchTimer.init(element, container, timeFormatter)
  })

  afterEach(function() {
    sketchTimer.pause()
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

        it("changes container to active", function() {
          expect(container.hasClass('active')).toBeTruthy()
        })
      })

      describe("when currently playing", function() {
        beforeEach(function() {
          container.trigger("mousedown")
          container.trigger("mouseup")
        })

        it("changes container to inactive", function() {
          container.trigger("mousedown")
          container.trigger("mouseup")

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
