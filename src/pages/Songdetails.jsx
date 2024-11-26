
import React from "react";
import { getTopTracksId } from "../SpotifyAPI";
import { useParams } from "react-router-dom";
import { useState,useEffect } from "react";


const Songdetails = () => {

  const { id } = useParams();
   
    const [song, SongDetails] = useState(null);
 


    useEffect(() => {
      const fetchSongDetails = async () => {
        const track = await getTopTracksId(id);
        SongDetails(track);
      };
    
      if (id) {
        fetchSongDetails();
      }
    }, [id]);

    return ( <div>


{song ? (
        <div>
          <h1>{song.title}</h1>
          <h1>{song.releaseDate}</h1>
          <h1>{song.availableMarkets}</h1>
          <h1>{song.date}</h1>
          <p>Artist: {song.artist}</p>
          <img src={song.albumImageUrl} alt={`${song.title} album cover`} width="300" />
          <a href={song.trackUrl} target="_blank" rel="noopener noreferrer">
            Listen on Spotify
          </a>
          
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div> );
}
 
export default Songdetails;