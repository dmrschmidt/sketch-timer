var defaultPlaylistUrl = 'https://soundcloud.com/koholaa/sets/soundcloud-kitchen-playlist'

function QueuePlayer(soundCloudAPI, soundManager, apiKey, passedPlaylistUrl) {
  this.soundCloudAPI = soundCloudAPI
  this.soundManager = soundManager
  this.apiKey = apiKey
  this.playlistUrl = passedPlaylistUrl || defaultPlaylistUrl

  this.player = null
  this.playlist = null
  this.delegate = null
}
QueuePlayer.prototype.constructor = QueuePlayer

QueuePlayer.prototype.prepare = function() {
  this.soundCloudAPI
    .resolve(this.playlistUrl)
    .then(this.processLoadedPlaylist.bind(this))
}

QueuePlayer.prototype.processLoadedPlaylist = function(playlist) {
  this.playlist = playlist
  this.bufferRandomTrack()
}

QueuePlayer.prototype.pickRandomTrack = function() {
  var randomTrackId = Math.floor(Math.random() * this.playlist.tracks.length)
  var randomTrack = this.playlist.tracks[randomTrackId]
  console.log(randomTrack)
  return randomTrack
}

QueuePlayer.prototype.bufferRandomTrack = function() {
  var randomTrack = this.pickRandomTrack()
  var randomTrackUrl = randomTrack.stream_url + '?consumer_key=' + this.apiKey

  this.player = this.soundManager.createSound({
    url: randomTrackUrl,
    autoLoad: true,
    onfinish: function() {
      console.log('finished playback, repeating track')
      this.play()
    }
  })
}

QueuePlayer.prototype.signalWarning = function () {
  this.soundManager.createSound({ url: '/resources/warning.mp3' }).play()
}

QueuePlayer.prototype.signalEnding = function () {
  this.soundManager.createSound({ url: '/resources/ending.mp3' }).play()
}

QueuePlayer.prototype.play = function() {
  if (this.player != null) { this.player.play() }
}

QueuePlayer.prototype.pause = function() {
  if (this.player != null) { this.player.pause() }
}

QueuePlayer.prototype.stop = function() {
  if (this.player != null) { this.player.stop() }
}

QueuePlayer.prototype.next = function() {
  var keepPlaying = this.isPlaying()
  if (this.delegate != null) { this.delegate.didSwitchTrack() }
  this.stop()
  this.bufferRandomTrack()

  if (keepPlaying) {
    this.play()
  }
}

QueuePlayer.prototype.isPlaying = function() {
  return this.player != null
    && this.player.playState == 1
    && !this.player.paused
}
