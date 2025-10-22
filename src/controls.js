/**
 * Custom Video Controls
 */
export class VideoControls {
  constructor(player, container) {
    this.player = player;
    this.container = container;
    this.controlsElement = null;
    this.isHiding = false;
    this.hideTimeout = null;

    this.createControls();
    this.attachEventListeners();
  }

  createControls() {
    const controls = document.createElement('div');
    controls.className = 'vimeo-hls-controls';
    controls.innerHTML = `
      <div class="vimeo-hls-controls-overlay">
        <button class="vimeo-hls-play-large" aria-label="Play">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>

      <div class="vimeo-hls-controls-bottom">
        <div class="vimeo-hls-progress-container">
          <div class="vimeo-hls-progress-buffered"></div>
          <div class="vimeo-hls-progress-bar">
            <div class="vimeo-hls-progress-filled"></div>
            <div class="vimeo-hls-progress-handle"></div>
          </div>
        </div>

        <div class="vimeo-hls-controls-row">
          <div class="vimeo-hls-controls-left">
            <button class="vimeo-hls-play-btn" aria-label="Play">
              <svg class="play-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z"/>
              </svg>
              <svg class="pause-icon" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            </button>

            <div class="vimeo-hls-volume-container">
              <button class="vimeo-hls-volume-btn" aria-label="Mute">
                <svg class="volume-high" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                </svg>
                <svg class="volume-muted" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                </svg>
              </button>

              <div class="vimeo-hls-volume-slider">
                <div class="vimeo-hls-volume-bar">
                  <div class="vimeo-hls-volume-filled"></div>
                </div>
              </div>
            </div>

            <div class="vimeo-hls-time">
              <span class="vimeo-hls-time-current">0:00</span>
              <span class="vimeo-hls-time-separator">/</span>
              <span class="vimeo-hls-time-duration">0:00</span>
            </div>
          </div>

          <div class="vimeo-hls-controls-right">
            <button class="vimeo-hls-fullscreen-btn" aria-label="Fullscreen">
              <svg class="fullscreen-enter" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
              </svg>
              <svg class="fullscreen-exit" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    `;

    this.container.appendChild(controls);
    this.controlsElement = controls;

    // Get references to control elements
    this.playBtn = controls.querySelector('.vimeo-hls-play-btn');
    this.playLargeBtn = controls.querySelector('.vimeo-hls-play-large');
    this.playIcon = controls.querySelector('.play-icon');
    this.pauseIcon = controls.querySelector('.pause-icon');
    this.progressBar = controls.querySelector('.vimeo-hls-progress-bar');
    this.progressFilled = controls.querySelector('.vimeo-hls-progress-filled');
    this.progressBuffered = controls.querySelector('.vimeo-hls-progress-buffered');
    this.progressHandle = controls.querySelector('.vimeo-hls-progress-handle');
    this.volumeBtn = controls.querySelector('.vimeo-hls-volume-btn');
    this.volumeHigh = controls.querySelector('.volume-high');
    this.volumeMuted = controls.querySelector('.volume-muted');
    this.volumeSlider = controls.querySelector('.vimeo-hls-volume-slider');
    this.volumeFilled = controls.querySelector('.vimeo-hls-volume-filled');
    this.timeCurrent = controls.querySelector('.vimeo-hls-time-current');
    this.timeDuration = controls.querySelector('.vimeo-hls-time-duration');
    this.fullscreenBtn = controls.querySelector('.vimeo-hls-fullscreen-btn');
    this.fullscreenEnter = controls.querySelector('.fullscreen-enter');
    this.fullscreenExit = controls.querySelector('.fullscreen-exit');
  }

  attachEventListeners() {
    // Play/Pause
    this.playBtn.addEventListener('click', () => this.player.togglePlay());
    this.playLargeBtn.addEventListener('click', () => this.player.togglePlay());
    this.player.video.addEventListener('click', () => this.player.togglePlay());

    // Update play button state
    this.player.on('play', () => this.updatePlayButton(true));
    this.player.on('pause', () => this.updatePlayButton(false));
    this.player.on('ended', () => this.updatePlayButton(false));

    // Progress bar
    this.progressBar.addEventListener('click', (e) => this.handleProgressClick(e));
    this.progressBar.addEventListener('mousedown', (e) => this.handleProgressDragStart(e));

    this.player.on('timeupdate', () => this.updateProgress());
    this.player.on('loadedmetadata', () => this.updateDuration());

    // Volume
    this.volumeBtn.addEventListener('click', () => {
      this.player.toggleMute();
      this.updateVolumeButton();
    });

    this.volumeSlider.addEventListener('click', (e) => this.handleVolumeClick(e));

    // Fullscreen
    this.fullscreenBtn.addEventListener('click', () => this.player.toggleFullscreen());
    document.addEventListener('fullscreenchange', () => this.updateFullscreenButton());
    document.addEventListener('webkitfullscreenchange', () => this.updateFullscreenButton());

    // Auto-hide controls
    this.container.addEventListener('mousemove', () => this.showControls());
    this.container.addEventListener('mouseleave', () => this.hideControls());
    this.player.on('play', () => this.startAutoHide());
    this.player.on('pause', () => this.stopAutoHide());
  }

  updatePlayButton(isPlaying) {
    if (isPlaying) {
      this.playIcon.style.display = 'none';
      this.pauseIcon.style.display = 'block';
      this.playLargeBtn.style.display = 'none';
    } else {
      this.playIcon.style.display = 'block';
      this.pauseIcon.style.display = 'none';
      this.playLargeBtn.style.display = 'flex';
    }
  }

  updateProgress() {
    const percent = (this.player.getCurrentTime() / this.player.getDuration()) * 100;
    this.progressFilled.style.width = `${percent}%`;
    this.progressHandle.style.left = `${percent}%`;

    const buffered = this.player.getBuffered();
    this.progressBuffered.style.width = `${buffered}%`;

    this.timeCurrent.textContent = this.formatTime(this.player.getCurrentTime());
  }

  updateDuration() {
    this.timeDuration.textContent = this.formatTime(this.player.getDuration());
  }

  handleProgressClick(e) {
    const rect = this.progressBar.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const time = percent * this.player.getDuration();
    this.player.seek(time);
  }

  handleProgressDragStart(e) {
    const onMouseMove = (e) => this.handleProgressClick(e);
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  updateVolumeButton() {
    if (this.player.video.muted || this.player.getVolume() === 0) {
      this.volumeHigh.style.display = 'none';
      this.volumeMuted.style.display = 'block';
      this.volumeFilled.style.height = '0%';
    } else {
      this.volumeHigh.style.display = 'block';
      this.volumeMuted.style.display = 'none';
      this.volumeFilled.style.height = `${this.player.getVolume() * 100}%`;
    }
  }

  handleVolumeClick(e) {
    const rect = this.volumeSlider.getBoundingClientRect();
    const percent = 1 - ((e.clientY - rect.top) / rect.height);
    this.player.setVolume(percent);
    this.player.video.muted = false;
    this.updateVolumeButton();
  }

  updateFullscreenButton() {
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      this.fullscreenEnter.style.display = 'none';
      this.fullscreenExit.style.display = 'block';
    } else {
      this.fullscreenEnter.style.display = 'block';
      this.fullscreenExit.style.display = 'none';
    }
  }

  showControls() {
    this.container.classList.add('vimeo-hls-controls-visible');
    this.stopAutoHide();
    this.startAutoHide();
  }

  hideControls() {
    if (!this.player.video.paused) {
      this.container.classList.remove('vimeo-hls-controls-visible');
    }
  }

  startAutoHide() {
    this.stopAutoHide();
    this.hideTimeout = setTimeout(() => this.hideControls(), 3000);
  }

  stopAutoHide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }

  formatTime(seconds) {
    if (isNaN(seconds)) return '0:00';

    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  destroy() {
    if (this.controlsElement) {
      this.controlsElement.remove();
    }
    this.stopAutoHide();
  }
}
