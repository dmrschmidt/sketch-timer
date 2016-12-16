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

  describe("toggle", function() {
    describe("when currently stopped", function() {
      it("changes container to active", function() {
        sketchTimer.toggle()
        expect(container.hasClass('active')).toBeTruthy()
      })
    })

    describe("when currently playing", function() {
      beforeEach(function() {
        sketchTimer.toggle()
      })

      it("changes container to inactive", function() {
        sketchTimer.toggle()
        expect(container.hasClass('active')).toBeFalsy()
      })
    })
  })
})
