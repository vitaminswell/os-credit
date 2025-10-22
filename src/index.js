import { HLSPlayer } from './player.js';
import { VideoControls } from './controls.js';
import { VimeoAPI } from './vimeo.js';
import './styles.css';

/**
 * VimeoHLSPlayer - Custom HLS video player for Vimeo videos
 */
class VimeoHLSPlayer {
  constructor(container, options = {}) {
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }

    if (!container) {
      throw new Error('Container element not found');
    }

    this.container = container;
    this.options = {
      vimeoId: null,
      hlsUrl: null,
      vimeoAccessToken: null,
      autoplay: false,
      muted: false,
      controls: true,
      aspectRatio: '16:9',
      poster: null,
      ...options
    };

    this.player = null;
    this.controls = null;
    this.videoElement = null;

    this.initialize();
  }

  async initialize() {
    this.setupContainer();
    this.createVideoElement();

    // Initialize HLS player
    this.player = new HLSPlayer(this.videoElement, {
      autoplay: this.options.autoplay,
      muted: this.options.muted,
      controls: false
    });

    // Add custom controls if enabled
    if (this.options.controls) {
      this.controls = new VideoControls(this.player, this.container);
    }

    // Load video source
    if (this.options.hlsUrl) {
      await this.loadHLS(this.options.hlsUrl);
    } else if (this.options.vimeoId) {
      await this.loadVimeo(this.options.vimeoId, this.options.vimeoAccessToken);
    }

    // Handle errors
    this.player.on('error', (error) => {
      this.showError('Failed to load video', error.message || 'Unknown error');
    });
  }

  setupContainer() {
    this.container.classList.add('vimeo-hls-player');

    // Set aspect ratio
    if (this.options.aspectRatio) {
      const [width, height] = this.options.aspectRatio.split(':').map(Number);
      const paddingTop = (height / width) * 100;
      this.container.style.paddingTop = `${paddingTop}%`;
      this.container.style.position = 'relative';
      this.container.style.height = '0';
    }
  }

  createVideoElement() {
    this.videoElement = document.createElement('video');
    this.videoElement.style.position = 'absolute';
    this.videoElement.style.top = '0';
    this.videoElement.style.left = '0';
    this.videoElement.style.width = '100%';
    this.videoElement.style.height = '100%';

    if (this.options.poster) {
      this.videoElement.poster = this.options.poster;
    }

    this.container.appendChild(this.videoElement);
  }

  /**
   * Load HLS stream directly
   * @param {string} hlsUrl - HLS manifest URL
   */
  async loadHLS(hlsUrl) {
    try {
      this.container.classList.add('loading');
      this.player.loadSource(hlsUrl);

      this.player.on('loadedmetadata', () => {
        this.container.classList.remove('loading');
      });
    } catch (error) {
      this.container.classList.remove('loading');
      this.showError('Failed to load HLS stream', error.message);
    }
  }

  /**
   * Load Vimeo video by ID
   * @param {string} vimeoId - Vimeo video ID or URL
   * @param {string} accessToken - Optional Vimeo access token
   */
  async loadVimeo(vimeoId, accessToken = null) {
    try {
      this.container.classList.add('loading');

      // Extract video ID if URL provided
      const videoId = VimeoAPI.extractVideoId(vimeoId) || vimeoId;

      // Try to get HLS URL from player config (works for public videos)
      try {
        const hlsUrl = await VimeoAPI.getHLSFromPlayer(videoId);
        await this.loadHLS(hlsUrl);
        this.container.classList.remove('loading');
        return;
      } catch (error) {
        console.log('Could not get HLS from player, trying API...');
      }

      // Fallback to API (requires access token for private videos)
      if (accessToken) {
        const videoData = await VimeoAPI.getVideoData(videoId, accessToken);

        if (videoData.hlsUrl) {
          await this.loadHLS(videoData.hlsUrl);
        } else {
          throw new Error('No HLS stream available for this video');
        }
      } else {
        throw new Error('Could not load video. For private videos, provide a Vimeo access token.');
      }

      this.container.classList.remove('loading');
    } catch (error) {
      this.container.classList.remove('loading');
      this.showError('Failed to load Vimeo video', error.message);
    }
  }

  showError(title, message) {
    const errorEl = document.createElement('div');
    errorEl.className = 'vimeo-hls-error';
    errorEl.innerHTML = `
      <h3>${title}</h3>
      <p>${message}</p>
    `;
    this.container.appendChild(errorEl);
  }

  /**
   * Public API methods
   */

  play() {
    return this.player.play();
  }

  pause() {
    this.player.pause();
  }

  togglePlay() {
    this.player.togglePlay();
  }

  seek(time) {
    this.player.seek(time);
  }

  setVolume(volume) {
    this.player.setVolume(volume);
  }

  getVolume() {
    return this.player.getVolume();
  }

  toggleMute() {
    return this.player.toggleMute();
  }

  getCurrentTime() {
    return this.player.getCurrentTime();
  }

  getDuration() {
    return this.player.getDuration();
  }

  on(event, callback) {
    this.player.on(event, callback);
  }

  off(event, callback) {
    this.player.off(event, callback);
  }

  destroy() {
    if (this.controls) {
      this.controls.destroy();
    }
    if (this.player) {
      this.player.destroy();
    }
    if (this.videoElement) {
      this.videoElement.remove();
    }
    this.container.classList.remove('vimeo-hls-player');
  }
}

// Export for use as module or global
export default VimeoHLSPlayer;

// Make available globally for Webflow
if (typeof window !== 'undefined') {
  window.VimeoHLSPlayer = VimeoHLSPlayer;
}
