import React, { useEffect, useState } from "react";
import { getTopTracks } from "../SpotifyAPI";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { getRecentlyPlayed } from "../SpotifyAPI";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const [topTracks, setTopTracks] = useState([]);
  const [recent, setRecent] = useState([]);
  const [playingPreview, setPlayingPreview] = useState(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPaused, setIsPaused] = useState(true); // New state to track pause status

  useEffect(() => {
    const fetchTopTracks = async () => {
      const tracks = await getTopTracks();

      setTopTracks(tracks);
    };

    fetchTopTracks();
  }, []);

  useEffect(() => {
    const fetchRecent = async () => {
      const tracks = await getRecentlyPlayed();

      setRecent(tracks);
      console.log(tracks, "this is recently played");
    };

    fetchRecent();
  }, []);

  const handlePlayPause = (track) => {
    if (currentTrack === track) {
      // If the same track is clicked, toggle between play and pause
      if (isPaused) {
        playingPreview.play(); // Resume playback
        setIsPaused(false);
      } else {
        playingPreview.pause(); // Pause playback
        setIsPaused(true);
      }
      return;
    }

    // If a different track is clicked, stop the current preview and play the new one
    if (playingPreview) {
      playingPreview.pause();
      setPlayingPreview(null);
    }

    // Create a new Audio instance and play the new track
    const newPreview = new Audio(track.previewUrl);
    newPreview.play();
    setPlayingPreview(newPreview);
    setCurrentTrack(track);
    setIsPaused(false);
  };

  {
    /**id={`slide-${index + 1}`}*/
  }

  return (
    <div>
      <div className="container">
        Recent
        <div className="flex">
          {recent.map((track, index) => (
            <div key={index}>
              <img
                className="h-[200px] w-[200px]"
                src={track.albumImageUrl}
                alt={`${track.title} album cover`}
              />
              <p>{track.title}</p>
            </div>
          ))}
        </div>
        top
        <div className="flex">
          {topTracks.map((track, index) => (
            <img
              key={index}
              className="h-[200px]"
              src={track.albumImageUrl}
              alt={`${track.title} album cover`}
            />
          ))}
        </div>
      </div>

      {currentTrack && (
        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            border: "1px solid #ccc",
          }}
        >
          <h3>Now Playing</h3>
          <img
            src={currentTrack.albumImageUrl}
            alt={`${currentTrack.title} album cover`}
            width="100"
          />
          <p>
            {currentTrack.title} by {currentTrack.artist}
          </p>
          <button onClick={() => handlePlayPause(currentTrack)}>
            {playingPreview && !isPaused ? "Pause" : "Play"}
          </button>
        </div>
      )}
    </div>
  );
};

export default About;
