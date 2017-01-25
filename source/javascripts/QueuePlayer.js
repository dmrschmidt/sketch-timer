var defaultPlaylistUrl = 'playlists/47514837' // https://soundcloud.com/koholaa/sets/soundcloud-kitchen-playlist

function QueuePlayer(soundCloudAPI) {
  this.soundCloudAPI = soundCloudAPI

  this.player = null
  this.playlist = null
  this.preBufferPromise = new Promise(function(resolve, reject) {
    this.resolvePreBuffering = resolve
    this.rejectPreBuffering = reject
  }.bind(this))
}
QueuePlayer.prototype.constructor = QueuePlayer

QueuePlayer.prototype.prepare = function() {
  this.soundCloudAPI
    .get(defaultPlaylistUrl)
    .then(this.processLoadedPlaylist.bind(this))
}

QueuePlayer.prototype.processLoadedPlaylist = function(playlist) {
  this.playlist = playlist
  this.bufferRandomTrack()
}

QueuePlayer.prototype.pickRandomTrack = function() {
  var randomTrackId = Math.floor(Math.random() * this.playlist.tracks.length)
  var randomTrack = this.playlist.tracks[randomTrackId]
  console.log(randomTrack);
  return randomTrack
}

QueuePlayer.prototype.bufferRandomTrack = function() {
  var randomTrack = this.pickRandomTrack()
  var randomTrackUrl = 'tracks/' + randomTrack.id

  this.soundCloudAPI
    .stream(randomTrackUrl)
    .then(this.resolvePreBuffering.bind(this))
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

QueuePlayer.prototype.stop = function() {
  this.pause()

  if (this.player != null) { this.player.seek(0) }
}

QueuePlayer.prototype.next = function() {

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
