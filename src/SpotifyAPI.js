import queryString from "query-string";

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;

const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/currently-playing`;
const TOP_TRACKS_ENDPOINT = `https://api.spotify.com/v1/me/top/tracks`;
const RECENTLY_PLAYED_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;


const client_id = import.meta.env.VITE_APP_SPOTIFY_CLIENT_ID;
const client_secret = import.meta.env.VITE_APP_SPOTIFY_CLIENT_SECRET;
const refresh_token = import.meta.env.VITE_APP_SPOTIFY_REFRESH_TOKEN;

const getAccessToken = async () => {
  const basic = Buffer.from(`${client_id}:${client_secret}`).toString("base64");
  const response = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Basic ${basic}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: queryString.stringify({
      grant_type: "refresh_token",
      refresh_token,
    }),
  });
  return response.json();
};

// now playing endpoint
export const getNowPlaying = async (
  client_id,
  client_secret,
  refresh_token
) => {
  const { access_token } = await getAccessToken(
    client_id,
    client_secret,
    refresh_token
  );
  return fetch(NOW_PLAYING_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });
};






// return data
export default async function getNowPlayingItem(
  client_id,
  client_secret,
  refresh_token
) {
  const response = await getNowPlaying(client_id, client_secret, refresh_token);
  if (response.status === 204 || response.status > 400) {
    return false;
  }
  const song = await response.json();

  const albumImageUrl = song.item?.album.images[0].url;

  const artist = song.item?.artists.map((_artist) => _artist.name).join(",");
  const isPlaying = song.is_playing;
  const songUrl = song.item.external_urls.spotify;
  const title = song.item.name;
  const genres = song.item.type;
  const click = song.item.preview_url;

  return {
    albumImageUrl,
    artist,
    isPlaying,
    songUrl,
    title,
    click,
    genres,
  };
}



// SpotifyAPI.js

export const getTopTracks = async () => {
  const { access_token } = await getAccessToken();
  const response = await fetch(TOP_TRACKS_ENDPOINT, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch top tracks:", response.statusText);
    return [];
  }

  const data = await response.json();
  return data.items.map((track) => ({
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(", "),
    albumImageUrl: track.album.images[0]?.url,
    trackUrl: track.external_urls.spotify,
    previewUrl: track.preview_url,
    releaseDate: track.album.release_date,
    availableMarkets:track.album.available_markets,
    id: track.id,
  }));
};


export const getTopTracksId = async (id) => {
  const { access_token } = await getAccessToken();
  const response = await fetch(`https://api.spotify.com/v1/tracks/${id}`, {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  });

  if (!response.ok) {
    console.error("Failed to fetch top tracks:", response.statusText);
    return [];
  }

  const data = await response.json();
  return {
    title: data.name,
    artist: data.artists.map((artist) => artist.name).join(", "),
    albumImageUrl: data.album.images[0]?.url,
    trackUrl: data.external_urls.spotify,
    previewUrl: data.preview_url,
    releaseDate: data.album.release_date,
    availableMarkets:data.album.available_markets,
    id: data.id,
  };
};


//RECENTLY PLAYED


export const getRecentlyPlayed = async () => {
  const { access_token } = await getAccessToken();
  if (!access_token) {
    console.error("Access token is missing or invalid.");
    return [];
  }

  try {
    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    if (!response.ok) {
      console.error(
        `Failed to fetch recently played tracks: ${response.status} - ${response.statusText}`
      );
      return [];
    }

    const data = await response.json();
    if (!data.items) {
      console.warn("No recently played tracks found.");
      return [];
    }

    return data.items.map((item) => ({
      title: item.track.name,
      artist: item.track.artists.map((artist) => artist.name).join(", "),
      albumImageUrl: item.track.album.images[0]?.url,
      trackUrl: item.track.external_urls.spotify,
      previewUrl: item.track.preview_url,
      releaseDate: item.track.album.release_date,
      playedAt: item.played_at, // Added played time for context
    }));
  } catch (error) {
    console.error("Error fetching recently played tracks:", error);
    return [];
  }
};
