function SketchTimer(element, container, timeFormatter, queuePlayer) {
  this.element = element
  this.container = container
  this.timeFormatter = timeFormatter
  this.queuePlayer = queuePlayer

  this.sketchingDuration = 420
  this.timer = null
  this.lastTapTime = 0
  this.longTapThresholdMs = 400
  this.longTapTimer = null
  this.shakeGestureRecognizer = null
}
SketchTimer.prototype.constructor = SketchTimer

SketchTimer.prototype.init = function() {
  this.reset()
  this.registerTapEvents()
  this.registerShakeEvent()
  this.queuePlayer.prepare()
}

SketchTimer.prototype.registerTapEvents = function() {
  this.container.on('mousedown touchstart', function(event) {
    event.preventDefault()
    this.lastTapTime = Date.now()
    this.longTapTimer = setTimeout(this.longTap.bind(this),
                                   this.longTapThresholdMs)
  }.bind(this))

  this.container.on('mouseup touchend', function(event) {
    event.preventDefault()
    clearTimeout(this.longTapTimer)
    var tapDuration = Date.now() - this.lastTapTime
    if (tapDuration < this.longTapThresholdMs) { this.shortTap() }
  }.bind(this))
}

SketchTimer.prototype.registerShakeEvent = function() {
  this.shakeGestureRecognizer = new Shake()
  this.shakeGestureRecognizer.start()

  window.addEventListener('shake', this.shake, false)
}

SketchTimer.prototype.shortTap = function() {
  if (this.countdownTime == 0) return

  this.isActive()
    ? this.pause()
    : this.play()
}

SketchTimer.prototype.longTap = function() {
  console.log('long press')
  this.reset()
}

SketchTimer.prototype.shake = function() {
  console.log('shake!')
  this.queuePlayer.next()
}

SketchTimer.prototype.reset = function() {
  console.log('requested reset')
  this.stop()
  this.countdownTime = this.sketchingDuration
  this.element.html(this.timeFormatter.format(this.countdownTime))
}

SketchTimer.prototype.isActive = function() {
  return this.queuePlayer.isPlaying()
}

SketchTimer.prototype.play = function() {
  console.log('requested play')
  this.queuePlayer.play()
  this.container.addClass('active')
  this.timer = setInterval(this.update.bind(this), 1000)
}

SketchTimer.prototype.stop = function() {
  console.log('requested stop')
  this.queuePlayer.stop()
  this.container.removeClass('active')
  clearInterval(this.timer)
}

SketchTimer.prototype.pause = function() {
  console.log('requested pause')
  this.queuePlayer.pause()
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
