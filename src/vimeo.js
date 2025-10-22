/**
 * Vimeo API integration to fetch HLS stream URLs
 */
export class VimeoAPI {
  /**
   * Fetch HLS stream URL from Vimeo video ID
   * @param {string} videoId - Vimeo video ID
   * @param {string} accessToken - Optional Vimeo access token for private videos
   * @returns {Promise<object>} Video data including HLS URL
   */
  static async getVideoData(videoId, accessToken = null) {
    try {
      // For public videos, we can use the oEmbed API
      const oembedUrl = `https://vimeo.com/api/oembed.json?url=https://vimeo.com/${videoId}`;

      // For HLS streams, we need to use the Vimeo API
      const headers = {
        'Content-Type': 'application/json'
      };

      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      const apiUrl = `https://api.vimeo.com/videos/${videoId}`;
      const response = await fetch(apiUrl, { headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch video data: ${response.statusText}`);
      }

      const data = await response.json();

      // Extract HLS URL from files
      const hlsFile = data.files?.find(file => file.quality === 'hls');

      return {
        title: data.name,
        duration: data.duration,
        thumbnail: data.pictures?.sizes?.[0]?.link,
        hlsUrl: hlsFile?.link,
        embedUrl: data.player_embed_url
      };
    } catch (error) {
      console.error('Error fetching Vimeo video data:', error);
      throw error;
    }
  }

  /**
   * Extract video ID from various Vimeo URL formats
   * @param {string} url - Vimeo URL
   * @returns {string|null} Video ID
   */
  static extractVideoId(url) {
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /vimeo\.com\/video\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1];
      }
    }

    // If it's just a number, assume it's already a video ID
    if (/^\d+$/.test(url)) {
      return url;
    }

    return null;
  }

  /**
   * Get HLS URL directly from Vimeo's player config
   * This is a fallback method that extracts HLS from the embed player
   * @param {string} videoId - Vimeo video ID
   * @returns {Promise<string>} HLS URL
   */
  static async getHLSFromPlayer(videoId) {
    try {
      const embedUrl = `https://player.vimeo.com/video/${videoId}`;
      const response = await fetch(embedUrl);
      const html = await response.text();

      // Extract config JSON from player HTML
      const configMatch = html.match(/var config = ({.*?});/s);
      if (configMatch) {
        const config = JSON.parse(configMatch[1]);
        const hlsUrl = config.request?.files?.hls?.cdns?.akfire_interconnect_quic?.url;

        if (hlsUrl) {
          return hlsUrl;
        }
      }

      throw new Error('Could not extract HLS URL from player');
    } catch (error) {
      console.error('Error getting HLS from player:', error);
      throw error;
    }
  }
}
