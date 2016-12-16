function TimeFormatter() {
}

TimeFormatter.prototype.format = function(seconds) {
  var hours = Math.floor(seconds / 3600)
  seconds -= hours * 3600

  var minutes = Math.floor(seconds / 60)
  seconds -= minutes * 60

  return minutes + ":" + (seconds < 10 ? '0' + seconds : seconds)
}
