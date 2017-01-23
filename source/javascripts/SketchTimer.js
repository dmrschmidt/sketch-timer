function SketchTimer() {
}

SketchTimer.prototype.init = function(element, container, timeFormatter) {
  this.audio = new Audio('resources/track_001.mp3')
  this.audio.preload = "auto"
SketchTimer.prototype.init = function(element, container, menu, timeFormatter) {
  this.sketchingDuration = 420
  this.timer = null
  this.lastTapTime = 0
  this.longTapThresholdMs = 300

  this.element = element
  this.container = container
  this.menu = menu
  this.timeFormatter = timeFormatter

  this.reset()
  this.registerEvents()
}

SketchTimer.prototype.registerEvents = function() {
  this.container.mousedown(function() {
    this.lastTapTime = Date.now()
  }.bind(this))

  this.container.mouseup(function() {
    var tapDuration = Date.now() - this.lastTapTime
    tapDuration < this.longTapThresholdMs
      ? this.shortTap()
      : this.longTap()
  }.bind(this))
}

SketchTimer.prototype.shortTap = function() {
  if(this.countdownTime == 0) return

  this.audio.paused
    ? this.play()
    : this.pause()
}

SketchTimer.prototype.longTap = function() {
  this.menu.slideDown()
}

SketchTimer.prototype.reset = function() {
  clearInterval(this.timer)
  this.audio.pause()
  this.audio.currentTime = 0
  this.menu.hide()
  this.countdownTime = this.sketchingDuration
  this.element.html(this.timeFormatter.format(this.countdownTime))
}

SketchTimer.prototype.play = function() {
  this.audio.play()
  this.container.addClass('active')
  this.timer = setInterval(this.update.bind(this), 1000)
}

SketchTimer.prototype.pause = function() {
  this.audio.pause()
  this.container.removeClass('active')
  clearInterval(this.timer)
}

SketchTimer.prototype.update = function() {
  this.countdownTime -= 1;
  this.element.html(this.timeFormatter.format(this.countdownTime))

  if (this.countdownTime == 0) {
    this.pause()
  }
}
