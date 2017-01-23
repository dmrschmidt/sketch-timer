function QueuePlayer(soundCloudAPI) {
  this.soundCloudAPI = soundCloudAPI

  this.player = null
  this.preBufferPromise = new Promise(function(resolve, reject) {
    this.resolvePreBuffering = resolve
    this.rejectPreBuffering = reject
  }.bind(this))
}
QueuePlayer.prototype.constructor = QueuePlayer

QueuePlayer.prototype.prepare = function() {
  this.soundCloudAPI
    .get('playlists/71646596')
    .then(this.selectRandomTrack.bind(this))
}

QueuePlayer.prototype.selectRandomTrack = function(playlist) {
  var randomTrackId = Math.floor(Math.random() * playlist.tracks.length)
  var randomTrack = playlist.tracks[randomTrackId]
  var randomTrackUrl = '/tracks/' + randomTrack.id

  console.log('picked track')
  console.log(randomTrack)

  this.soundCloudAPI
    .stream(randomTrackUrl)
    .then(this.resolvePreBuffering)
}

QueuePlayer.prototype.play = function() {
  this.preBufferPromise.then(function(player) {
    console.log('starting playback now')
    this.configurePlayer(player)
    this.player.play()
  }.bind(this)).catch(function(error) {
    console.log('SoundCloud error ' + error())
  })
}

QueuePlayer.prototype.pause = function() {
  if (this.player != null) { this.player.pause() }
}

QueuePlayer.prototype.isPlaying = function() {
  return (this.player != null) && this.player.isPlaying()
}

QueuePlayer.prototype.configurePlayer = function(player) {
  this.player = player
  this.configurePlayerForEternalRepeat()
}

QueuePlayer.prototype.configurePlayerForEternalRepeat = function() {
  this.player.on('finish', function() {
    console.log('finished playback, repeating track')
    this.player.seek(0)
    this.player.play()
  }.bind(this))
}
