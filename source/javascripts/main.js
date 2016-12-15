var audio = new Audio('resources/track_001.mp3')
var sketching_duration = 420
var countdown_time = sketching_duration
var timer = null

audio.preload = "auto"

function secondsTimeSpanToHMS(s) {
    var h = Math.floor(s / 3600)
    s -= h * 3600
    var m = Math.floor(s / 60)
    s -= m * 60
    return m + ":" + (s < 10 ? '0' + s : s)
}

$('#timer').html(secondsTimeSpanToHMS(countdown_time))

var updateTimer = function() {
  countdown_time -= 1;
  $('#timer').html(secondsTimeSpanToHMS(countdown_time))

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
  $('#timer').html(secondsTimeSpanToHMS(countdown_time))
}

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

$('html').dblclick(function() {
  reset()
})
