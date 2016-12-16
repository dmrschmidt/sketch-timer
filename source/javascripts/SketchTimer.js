function SketchTimer() {
}

SketchTimer.prototype.init = function(element, timeFormatter) {
  this.audio = new Audio('resources/track_001.mp3')
  this.audio.preload = "auto"
  this.sketching_duration = 420
  this.countdown_time = this.sketching_duration
  this.timer = null

  this.element = element
  this.timeFormatter = timeFormatter

  this.element.html(this.timeFormatter.format(this.countdown_time))
}

SketchTimer.prototype.start = function() {
  if(this.countdown_time == 0) return

  if(this.audio.paused) {
    this.audio.play()
    this.timer = setInterval(this.update.bind(this), 1000)
  } else {
    this.audio.pause()
    clearInterval(this.timer)
  }
}

SketchTimer.prototype.reset = function() {
  clearInterval(timer)
  this.audio.pause()
  this.audio.currentTime = 0
  this.countdown_time = this.sketching_duration
  this.element.html(this.timeFormatter.format(this.countdown_time))
}

SketchTimer.prototype.update = function() {
  this.countdown_time -= 1;
  this.element.html(this.timeFormatter.format(this.countdown_time))

  if (this.countdown_time == 0) {
    this.audio.pause()
    clearInterval(this.timer)
  }
}
