# Vimeo HLS Player for Webflow

A custom, lightweight video player for playing Vimeo videos in HLS format within Webflow projects. This player provides full control over the video playback experience with custom styling and controls.

## CDN Installation

### Using jsDelivr (Recommended)

Add this script to your Webflow project:

```html
<!-- Latest version -->
<script src="https://cdn.jsdelivr.net/gh/vitaminswell/os-credit@latest/dist/vimeo-hls-player.js"></script>

<!-- Specific version (recommended for production) -->
<script src="https://cdn.jsdelivr.net/gh/vitaminswell/os-credit@1.0.0/dist/vimeo-hls-player.js"></script>
```

### CDN Options

| CDN | URL | Notes |
|-----|-----|-------|
| **jsDelivr** | `https://cdn.jsdelivr.net/gh/vitaminswell/os-credit@latest/dist/vimeo-hls-player.js` | Recommended - Fast, reliable, free |
| **unpkg** | `https://unpkg.com/vimeo-hls-player@1.0.0/dist/vimeo-hls-player.js` | Alternative (requires npm package) |
| **GitHub Pages** | Self-hosted via GitHub Pages | Requires setup |

## Features

- HLS streaming support using hls.js
- Custom video controls (play, pause, volume, progress, fullscreen)
- Native HLS support for Safari
- Vimeo video integration
- Auto-hide controls
- Buffer visualization
- Keyboard shortcuts support
- Fullscreen mode
- Easy Webflow integration

## Quick Start

### 1. Include the Script

Add the CDN script to your Webflow project (Project Settings > Custom Code):

```html
<script src="https://cdn.jsdelivr.net/gh/vitaminswell/os-credit@latest/dist/vimeo-hls-player.js"></script>
```

### 2. Create a Container

In Webflow, add a div element and give it a class or ID:

```html
<div id="video-player"></div>
```

### 3. Initialize the Player

Add this code to your Webflow page's custom code (Before </body> tag):

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const player = new VimeoHLSPlayer('#video-player', {
      vimeoId: '76979871',  // Replace with your Vimeo video ID
      autoplay: false,
      muted: false,
      controls: true,
      aspectRatio: '16:9'
    });
  });
</script>
```

## Installation for Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Development mode with watch
npm run dev
```

## Usage Examples

### Example 1: Basic Vimeo Video

```javascript
const player = new VimeoHLSPlayer('#video-player', {
  vimeoId: '76979871',
  autoplay: false,
  controls: true
});
```

### Example 2: Direct HLS URL

```javascript
const player = new VimeoHLSPlayer('#video-player', {
  hlsUrl: 'https://your-hls-stream.m3u8',
  autoplay: true,
  muted: true
});
```

### Example 3: With Access Token (Private Videos)

```javascript
const player = new VimeoHLSPlayer('#video-player', {
  vimeoId: '123456789',
  vimeoAccessToken: 'your_vimeo_access_token',
  controls: true
});
```

### Example 4: Custom Aspect Ratio

```javascript
const player = new VimeoHLSPlayer('#video-player', {
  vimeoId: '76979871',
  aspectRatio: '21:9',  // Ultrawide
  poster: 'https://example.com/poster.jpg'
});
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `vimeoId` | string | null | Vimeo video ID or URL |
| `hlsUrl` | string | null | Direct HLS manifest URL (.m3u8) |
| `vimeoAccessToken` | string | null | Vimeo API access token for private videos |
| `autoplay` | boolean | false | Auto-play video on load |
| `muted` | boolean | false | Start video muted |
| `controls` | boolean | true | Show custom controls |
| `aspectRatio` | string | '16:9' | Video aspect ratio (e.g., '16:9', '4:3', '21:9') |
| `poster` | string | null | Poster image URL |

## API Methods

```javascript
// Playback control
player.play();
player.pause();
player.togglePlay();

// Seek to time (in seconds)
player.seek(30);

// Volume control (0-1)
player.setVolume(0.5);
player.getVolume();
player.toggleMute();

// Get current state
player.getCurrentTime();
player.getDuration();

// Event listeners
player.on('play', () => console.log('Video playing'));
player.on('pause', () => console.log('Video paused'));
player.on('ended', () => console.log('Video ended'));
player.on('timeupdate', () => console.log('Time:', player.getCurrentTime()));

// Clean up
player.destroy();
```

## Events

Available events:
- `play` - Video started playing
- `pause` - Video paused
- `ended` - Video playback ended
- `timeupdate` - Current time updated
- `loadedmetadata` - Video metadata loaded
- `error` - Error occurred

## Webflow Integration Guide

### Step 1: Add the CDN Script

1. In Webflow, go to Project Settings > Custom Code
2. Add the script in the "Head Code" or "Footer Code" section:

```html
<script src="https://cdn.jsdelivr.net/gh/vitaminswell/os-credit@latest/dist/vimeo-hls-player.js"></script>
```

### Step 2: Add Container in Webflow

1. Add a Div Block to your page
2. Give it an ID (e.g., "video-player")
3. Style it as needed (the player will fill the container)

### Step 3: Initialize with Custom Code

1. Select your page in Webflow
2. Open Page Settings > Custom Code
3. Add this to "Before </body> tag":

```html
<script>
  document.addEventListener('DOMContentLoaded', function() {
    const player = new VimeoHLSPlayer('#video-player', {
      vimeoId: 'YOUR_VIMEO_ID',
      autoplay: false,
      controls: true
    });
  });
</script>
```

### Step 4: Style (Optional)

You can customize the player's appearance using CSS in Webflow's custom code:

```css
<style>
  #video-player {
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  }
</style>
```

## Getting Vimeo Video ID

You can use:
- Just the video ID: `76979871`
- Full URL: `https://vimeo.com/76979871`
- Player URL: `https://player.vimeo.com/video/76979871`

The player will automatically extract the ID.

## Getting Vimeo HLS URL

### Method 1: Using the Player (No Token Required)

For public videos, the player automatically extracts the HLS URL from Vimeo's embed player. Just provide the `vimeoId`:

```javascript
new VimeoHLSPlayer('#player', {
  vimeoId: '76979871'
});
```

### Method 2: Using Vimeo API (Token Required)

For private videos or more control:

1. Create a Vimeo app at https://developer.vimeo.com/apps
2. Generate an access token
3. Use it in the player:

```javascript
new VimeoHLSPlayer('#player', {
  vimeoId: '123456789',
  vimeoAccessToken: 'your_token_here'
});
```

### Method 3: Direct HLS URL

If you already have the HLS URL:

```javascript
new VimeoHLSPlayer('#player', {
  hlsUrl: 'https://vod-progressive.akamaized.net/.../master.m3u8'
});
```

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

The player uses hls.js for browsers without native HLS support and falls back to native HLS for Safari.

## Styling

The player comes with default styles, but you can customize them by overriding CSS classes:

```css
/* Customize play button */
.vimeo-hls-play-large {
  background: rgba(0, 173, 239, 0.9) !important;
}

/* Customize progress bar color */
.vimeo-hls-progress-filled {
  background: #ff0000 !important;
}

/* Customize controls background */
.vimeo-hls-controls-bottom {
  background: linear-gradient(to top, rgba(0, 0, 0, 0.9), transparent) !important;
}
```

## Versioning

For production use, it's recommended to use a specific version instead of `@latest`:

```html
<!-- Pin to a specific version -->
<script src="https://cdn.jsdelivr.net/gh/vitaminswell/os-credit@1.0.0/dist/vimeo-hls-player.js"></script>
```

To create a new version, tag your commit:

```bash
git tag v1.0.0
git push origin v1.0.0
```

## Troubleshooting

### Video not loading
- Check that the Vimeo video ID is correct
- For private videos, ensure you have a valid access token
- Check browser console for errors

### CORS errors
- Vimeo's HLS streams should work across domains
- If using your own HLS server, ensure CORS is properly configured

### Controls not showing
- Make sure `controls: true` is set in options
- Check if CSS is loading properly
- Hover over the video to reveal controls

### CDN cache not updating
- jsDelivr caches files for 7 days by default
- Use a specific version tag instead of `@latest` for production
- Or add a cache-busting query parameter: `?v=1.0.1`

## License

MIT

## Credits

Built with:
- [hls.js](https://github.com/video-dev/hls.js/) - HLS video streaming
- Vimeo API integration

## Support

For issues and feature requests, please open an issue on GitHub.
