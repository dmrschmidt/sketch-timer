function FakeNoSleep() { this.enabled = false }
FakeNoSleep.prototype.enable = function() { this.enabled = true }

describe("SleepPreventer", function() {
  var sleepPreventer
  var noSleep
  var element

  beforeEach(function() {
    element = $('<div>')
    noSleep = new FakeNoSleep()
    sleepPreventer = new SleepPreventer(noSleep)
  })

  describe("preventSleep", function() {
    it("enables sleep prevention", function() {
      sleepPreventer.preventSleep()
      expect(noSleep.enabled).toBeTruthy()
    })
  })

  describe("watchSleepPrevention", function() {
    it("enables sleep prevention after user interaction (mouse down)", function() {
      sleepPreventer.watchSleepPrevention(element)
      element.trigger("mousedown")
      expect(noSleep.enabled).toBeTruthy()
    })

    it("enables sleep prevention after user interaction (touch)", function() {
      sleepPreventer.watchSleepPrevention(element)
      element.trigger("touchstart")
      expect(noSleep.enabled).toBeTruthy()
    })
  })
})
