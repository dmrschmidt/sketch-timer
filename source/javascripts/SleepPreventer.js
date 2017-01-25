function SleepPreventer(noSleep) {
  this.noSleep = noSleep
}
SleepPreventer.prototype.constructor = SleepPreventer

SleepPreventer.prototype.watchSleepPrevention = function(element) {
  console.log('lurking around for user action to enable sleep prevention')
  element.on('mousedown touchstart', this.preventSleep.bind(this))
}

SleepPreventer.prototype.preventSleep = function() {
  console.log('preventing device from sleeping')
  this.noSleep.enable()
}
