var audio = new Audio('resources/track_001.mp3')
var sketching_duration = 420
var countdown_time = sketching_duration
var timer = null
var timeFormatter = new TimeFormatter()

audio.preload = "auto"

var updateTimer = function() {
  countdown_time -= 1;
  $('#timer').html(timeFormatter.format(countdown_time))

  if (countdown_time == 0) {
    audio.pause()
    clearInterval(timer)
  }
}

var reset = function() {
  clearInterval(timer)
  audio.pause()
  audio.currentTime = 0
  countdown_time = sketching_duration
  $('#timer').html(timeFormatter.format(countdown_time))
}

$(document).ready(function() {
  $('#timer').html(timeFormatter.format(countdown_time))

  $('html').click(function() {
    if(countdown_time == 0) return

    if(audio.paused) {
      audio.play()
      timer = setInterval(updateTimer, 1000)
    } else {
      audio.pause()
      clearInterval(timer)
    }
  })
})
