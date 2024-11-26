import React, { useEffect, useState, useRef } from "react";
import { getRecentlyPlayed } from "../SpotifyAPI";

const RecentlyPlayed = () => {
  const [recent, setRecent] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [wave, setWave] = useState(false); // Wave animation state
  const audioRef = useRef(new Audio());
  const containerRef = useRef(null);
  const buttonRef = useRef(null); // Reference for the play/pause button

  // Fetch recent tracks from the API
  useEffect(() => {
    const fetchRecent = async () => {
      const tracks = await getRecentlyPlayed();
      setRecent(tracks);
      console.log(tracks, "this is recently played");
    };

    fetchRecent();
  }, []);

  // Play or pause the song when clicked
  const handlePlayPause = (track) => {
    if (currentTrack && currentTrack.id !== track.id) {
      audioRef.current.pause();
      setIsPlaying(false);
      setWave(false);
      setCurrentTime(0);
      setCurrentTrack(track);
    }

    if (isPlaying && currentTrack?.id === track.id) {
      audioRef.current.pause();
      setIsPlaying(false);
      setWave(false);
      setCurrentTime(audioRef.current.currentTime);
    } else {
      if (currentTrack?.id !== track.id || currentTime === 0) {
        audioRef.current.src = track.previewUrl;
        audioRef.current.currentTime = currentTime;
      }

      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setWave(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  };

  // Update current time of the song
  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  // Setup IntersectionObserver to detect when the button is in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && isPlaying) {
            // Button is out of view, pause the song
            audioRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      {
        threshold: 0.5, // Trigger when 50% of the button is in view
      }
    );

    // Observe the button element
    if (buttonRef.current) {
      observer.observe(buttonRef.current);
    }

    // Cleanup the observer when the component unmounts
    return () => {
      if (buttonRef.current) {
        observer.unobserve(buttonRef.current);
      }
    };
  }, [isPlaying]);

  // Add event listener for time update
  useEffect(() => {
    const audioElement = audioRef.current;
    audioElement.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  return (
    <div ref={containerRef} className="text-white">
      <div className="flex justify-center h-[100%]">
        {recent.map((track, index) => (
          <div className="w-full" key={index}>
            <div className="z-10 w-full items-center lg:w-fit lg:left-5 absolute lg:top-5 top-3 flex">
              <img
                className="h-[40px] lg:h-[60px]"
                src="img/newspot.png"
                alt="Spotify Icon"
              />
              <p className="uppercase">playing offline from Spotify </p>
            </div>

            <div className="flex justify-center h-[100%]">
              <img
                className="object-fill active-slide w-full h-[100vh]"
                src={track.albumImageUrl}
                alt="Album"
              />
            </div>

            <div className="absolute h-full flex flex-col justify-center items-center bottom-0 top-0 left-0 right-0 drop p-2">
              <div className="md:w-[350px] relative flex items-center justify-center w-[90%] h-[47%]">
                <a
                  href={`${track.songUrl}`}
                  className="absolute top-2 right-3 bg-white w-[60px] h-[60px] rounded-[50%] flex items-center text-center justify-center text-black font-extrabold text-[14px]"
                >
                  <p>VISIT</p>
                </a>
                <div className="w-[75%] flex bg-red flex-col justify-center h-[80%] ">
                  <img
                    className="rounded-[5px] object-cover w-full h-full"
                    src={track.albumImageUrl}
                    alt="Album"
                  />

                  <div className="bg-green flex justify-center">
                    {wave && (
                      <div className="w-[30%] md:w-[160px] flex justify-center">
                        <img
                          className="w-full h-[60px]"
                          src="img/wave.gif"
                          alt="Wave"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="slides uppercase">{track.artist}</p>
                <div>
                  <p className="text-[20px] uppercase">{track.title}</p>
                </div>
                <button
                  ref={buttonRef} // Attach the ref to the play/pause button
                  onClick={() => handlePlayPause(track)}
                  className="border-[2px] mt-2 rounded-[17px] bg-green-500 hover:bg-green-600 py-[4px] text-white px-4 rounded"
                >
                  {isPlaying && currentTrack?.id === track.id
                    ? "PAUSE"
                    : "PLAY"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyPlayed;
