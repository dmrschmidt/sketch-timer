function SketchTimer(element, container, timeFormatter, soundCloudAPI) {
  this.element = element
  this.container = container
  this.timeFormatter = timeFormatter
  this.soundCloudAPI = soundCloudAPI

  this.player = null
  this.sketchingDuration = 420
  this.timer = null
  this.lastTapTime = 0
  this.longTapThresholdMs = 300
}
SketchTimer.prototype.constructor = SketchTimer

SketchTimer.prototype.init = function() {
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

  this.isPlaying()
    ? this.pause()
    : this.play()
}

SketchTimer.prototype.longTap = function() {
  console.log('long press')
}

SketchTimer.prototype.reset = function() {
  clearInterval(this.timer)
  this.pause()
  this.countdownTime = this.sketchingDuration
  this.element.html(this.timeFormatter.format(this.countdownTime))
}

SketchTimer.prototype.isPlaying = function() {
  return (this.player != null) && this.player.isPlaying()
}

SketchTimer.prototype.play = function() {
  if (this.player == null) {
    this.soundCloudAPI.stream('/tracks/302836223').then(function(player) {
      console.log('starting playback now')
      this.player = player
      this.player.play()
    }.bind(this)).catch(function(error) {
      console.log('SoundCloud error ' + error())
    })
  } else {
    this.player.play()
  }

  this.container.addClass('active')
  this.timer = setInterval(this.update.bind(this), 1000)
}

SketchTimer.prototype.pause = function() {
  if (this.player != null) { this.player.pause() }
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
