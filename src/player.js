import Hls from 'hls.js';

/**
 * Custom HLS Video Player
 */
export class HLSPlayer {
  constructor(videoElement, options = {}) {
    this.video = videoElement;
    this.container = options.container || null;
    this.hls = null;
    this.options = {
      autoplay: false,
      muted: false,
      controls: false,
      loop: false,
      ...options
    };

    this.listeners = {
      play: [],
      pause: [],
      ended: [],
      timeupdate: [],
      loadedmetadata: [],
      error: []
    };

    this.initialize();
  }

  initialize() {
    // Set basic video attributes
    this.video.autoplay = this.options.autoplay;
    this.video.muted = this.options.muted;
    this.video.controls = this.options.controls;
    this.video.loop = this.options.loop;

    // Attach event listeners
    this.attachEventListeners();
  }

  attachEventListeners() {
    const events = ['play', 'pause', 'ended', 'timeupdate', 'loadedmetadata', 'error'];

    events.forEach(event => {
      this.video.addEventListener(event, (e) => {
        this.emit(event, e);
      });
    });
  }

  /**
   * Load HLS stream
   * @param {string} hlsUrl - HLS manifest URL
   */
  loadSource(hlsUrl) {
    if (!hlsUrl) {
      console.error('No HLS URL provided');
      return;
    }

    // Check if HLS is supported
    if (Hls.isSupported()) {
      // Use hls.js for browsers that don't support HLS natively
      this.hls = new Hls({
        enableWorker: true,
        lowLatencyMode: false,
        backBufferLength: 90
      });

      this.hls.loadSource(hlsUrl);
      this.hls.attachMedia(this.video);

      this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
        console.log('HLS manifest loaded');
        if (this.options.autoplay) {
          this.play();
        }
      });

      this.hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error('Fatal network error, trying to recover');
              this.hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error('Fatal media error, trying to recover');
              this.hls.recoverMediaError();
              break;
            default:
              console.error('Fatal error, cannot recover');
              this.destroy();
              break;
          }
        }
        this.emit('error', data);
      });

    } else if (this.video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      this.video.src = hlsUrl;

      this.video.addEventListener('loadedmetadata', () => {
        console.log('Native HLS loaded');
        if (this.options.autoplay) {
          this.play();
        }
      });
    } else {
      console.error('HLS is not supported in this browser');
      this.emit('error', new Error('HLS not supported'));
    }
  }

  /**
   * Play video
   */
  async play() {
    try {
      await this.video.play();
    } catch (error) {
      console.error('Error playing video:', error);
      this.emit('error', error);
    }
  }

  /**
   * Pause video
   */
  pause() {
    this.video.pause();
  }

  /**
   * Toggle play/pause
   */
  togglePlay() {
    if (this.video.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume) {
    this.video.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Get volume (0-1)
   */
  getVolume() {
    return this.video.volume;
  }

  /**
   * Mute/unmute
   */
  toggleMute() {
    this.video.muted = !this.video.muted;
    return this.video.muted;
  }

  /**
   * Seek to time (in seconds)
   */
  seek(time) {
    this.video.currentTime = time;
  }

  /**
   * Get current time
   */
  getCurrentTime() {
    return this.video.currentTime;
  }

  /**
   * Get duration
   */
  getDuration() {
    return this.video.duration;
  }

  /**
   * Get buffered percentage
   */
  getBuffered() {
    if (this.video.buffered.length > 0) {
      return (this.video.buffered.end(this.video.buffered.length - 1) / this.video.duration) * 100;
    }
    return 0;
  }

  /**
   * Enter fullscreen
   */
  enterFullscreen() {
    const element = this.container || this.video;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  }

  /**
   * Exit fullscreen
   */
  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  /**
   * Toggle fullscreen
   */
  toggleFullscreen() {
    if (!document.fullscreenElement &&
        !document.webkitFullscreenElement &&
        !document.mozFullScreenElement &&
        !document.msFullscreenElement) {
      this.enterFullscreen();
    } else {
      this.exitFullscreen();
    }
  }

  /**
   * Event system
   */
  on(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event].push(callback);
    }
  }

  off(event, callback) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  emit(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }

  /**
   * Destroy player and clean up
   */
  destroy() {
    if (this.hls) {
      this.hls.destroy();
      this.hls = null;
    }

    this.video.src = '';
    this.listeners = {};
  }
}
