var audio = new Audio('resources/track_001.mp3')
var countdown_time = 420

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
}

var timer = null

$('html').click(function() {
  if(audio.paused) {
    audio.play()
    timer = setInterval(updateTimer, 1000)
  } else {
    audio.pause()
    clearInterval(timer)
  }
})
