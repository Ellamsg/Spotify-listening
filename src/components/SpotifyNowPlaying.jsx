import React, { useEffect, useState } from "react";
import getNowPlayingItem from "../SpotifyAPI";
import { getRecentlyPlayed } from "../SpotifyAPI";


const SpotifyNowPlaying = (props) => {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState({});
  const [isPlaying, setIsPlaying] = useState(false); // Manage play/pause state
  const [audio, setAudio] = useState(null); // Audio instance
  const [wave, setWave] = useState(false); // Wave animation state
  const [intervalId, setIntervalId] = useState(null); // Polling interval

  useEffect(() => {
    const fetchNowPlaying = async () => {
      const data = await getNowPlayingItem(
        props.client_id,
        props.client_secret,
        props.refresh_token
      );

      // If the song changes, stop current playback and update audio
      if (data.title !== result.title) {
        if (audio) {
          audio.pause();
        }
        const newAudio = new Audio(data?.click); // Set new audio with preview URL
        setAudio(newAudio);

        // Add an event listener for when the audio ends
        newAudio.addEventListener("ended", () => {
          setIsPlaying(false);
          setWave(false);
        });

        setResult(data);
        setLoading(false);
        setIsPlaying(false); // Reset playback state for the new song
        setWave(false);
      }
    };

    // Poll Spotify API every 10 seconds
    const id = setInterval(fetchNowPlaying, 25000);
    setIntervalId(id);

    // Initial fetch
    fetchNowPlaying();

    // Cleanup on component unmount
    return () => {
      clearInterval(id);
      if (audio) {
        audio.pause();
        audio.removeEventListener("ended", () => {
          setIsPlaying(false);
          setWave(false);
        });
      }
    };
  }, [
    props.client_id,
    props.client_secret,
    props.refresh_token,
    result,
    audio,
  ]);

  // Play or pause the audio
  const togglePlayback = () => {
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setWave(false);
    } else {
      audio.play();
      setWave(true);
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <div className="text-white">
      <div className="absolute flex w-full justify-between bottom-0 p-1 z-[100]">
        <p className="text-[13px] underline">
          Made By Ellams, seyi.dev inspired
        </p>
        <a
          className="text-[13px] underline"
          href="https://ellamsfolio.netlify.app"
        >
          My website
        </a>
      </div>
      {loading ? (
        <div className="flex justify-center">
          <img
            className="lg:pt-[120px] pt-[150px]"
            src="img/giphy.gif"
            alt="Loading..."
          />
        </div>
      ) : (
        <div className="flex justify-center h-[100%]">
          {result.isPlaying ? (
            <div className="w-full">
              <div className="z-10 w-full items-center lg:w-fit lg:left-5 absolute lg:top-5 top-3 flex">
                <img
                  className="h-[40px] lg:h-[60px]"
                  src="img/newspot.png"
                  alt="Spotify Icon"
                />
                <p className="uppercase">playing from Spotify</p>
              </div>
              <div className="flex justify-center h-[100%]">
                <img
                  className="object-fill active-slide w-full h-[100vh]"
                  src={result.albumImageUrl}
                  alt="Album"
                />
              </div>
              <div className="absolute h-full flex flex-col justify-center items-center bottom-0 top-0 left-0 right-0 drop p-2">
                <div className="md:w-[350px] relative flex items-center justify-center w-[90%] h-[47%]">
                  <a
                    href={`${result.songUrl}`}
                    className="absolute top-2 right-3 bg-white w-[60px] h-[60px] rounded-[50%]
                   flex items-center text-center justify-center text-black font-extrabold text-[14px] "
                  >
                    <p>VISIT</p>
                  </a>
                  <div className="w-[75%] h-[80%] ">
                    <img
                      className="rounded-[5px] object-cover w-full h-full"
                      src={result.albumImageUrl}
                      alt="Album"
                    />
                  </div>
                </div>
                {wave && (
                  <div className="w-[30%] md:w-[160px] flex justify-center">
                    <img
                      className="w-full h-[60px]"
                      src="img/wave.gif"
                      alt="Wave"
                    />
                  </div>
                )}
                <div className="text-center pt-2">
                  <p className="slides uppercase">{result.artist}</p>
                  <div>
                    <p className="text-[20px] uppercase">{result.title}</p>
                  </div>
                  <button
                    onClick={togglePlayback}
                    className="border-[2px] mt-2 rounded-[17px] bg-green-500 hover:bg-green-600 py-[4px] text-white px-4 rounded"
                  >
                    {isPlaying ? "PAUSE" : "PLAY"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="pt-[260px]">
              <img
                className="h-[90px]"
                src="img/tifylogo.png"
                alt="Spotify Logo"
              />
              <p className="text-2xl">Ellams is offline</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SpotifyNowPlaying;
