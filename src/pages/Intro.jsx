import React from "react";
import { Link } from "react-router-dom";


const Intro = () => {
  return (
    <div className=" h-[100vh] flex flex-col   items-center justify-center">
      <div className="text-center flex flex-col items-center justify-center md:[70%] lg:w-[50%]  h-[100%] text-white">
        <p>
          This website showcases my currently playing songs straight from my
          Spotify playlist. Plug in your earpiece, hit play, and take a journey
          through the soundtrack of my life, Love from Ellams
        </p>

        <Link to="/home">
        <button className="border-[2px] mt-4 rounded-[17px] py-[4px] text-white px-4 rounded">
        <p>VISIT</p>
      </button>
        </Link>

      


      </div>
      
    </div>
  );
};

export default Intro;
