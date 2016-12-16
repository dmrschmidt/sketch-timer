function SketchTimer() {
}

SketchTimer.prototype.init = function(element, container, timeFormatter) {
  this.audio = new Audio('resources/track_001.mp3')
  this.audio.preload = "auto"
  this.sketching_duration = 10
  this.countdown_time = this.sketching_duration
  this.timer = null

  this.element = element
  this.container = container
  this.timeFormatter = timeFormatter

  this.element.html(this.timeFormatter.format(this.countdown_time))
}

SketchTimer.prototype.toggle = function() {
  if(this.countdown_time == 0) return

  if(this.audio.paused) {
    this.play()
  } else {
    this.pause()
  }
}

SketchTimer.prototype.reset = function() {
  clearInterval(timer)
  this.audio.pause()
  this.audio.currentTime = 0
  this.countdown_time = this.sketching_duration
  this.element.html(this.timeFormatter.format(this.countdown_time))
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
  this.countdown_time -= 1;
  this.element.html(this.timeFormatter.format(this.countdown_time))

  if (this.countdown_time == 0) {
    this.pause()
  }
}
