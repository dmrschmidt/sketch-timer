var timeFormatter = new TimeFormatter()
var sketchTimer = new SketchTimer()

$(document).ready(function() {
  sketchTimer.init($('#timer'), $('html'), timeFormatter)

  $('html').click(function() {
    sketchTimer.toggle()
  })
})
