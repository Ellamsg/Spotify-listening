import React from 'react'

import { useEffect, useState } from 'react'
import getNowPlayingItem from './SpotifyAPI'
import AudioPlayer from 'react-h5-audio-player';

const SpotifyNowPlaying = (props) => {
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState({});

    useEffect(() => {
        Promise.all([
            getNowPlayingItem(
                props.client_id,
                props.client_secret,
                props.refresh_token
            ),
        ]).then((results) => {
            setResult(results[0]);
            setLoading(false);
        });
    });

    return (
        <div className=' text-white h-[100vh] '>
                 {loading ? <div className='flex justify-center'>
           
           <img className="lg:pt-[120px] pt-[150px] " src='img/Spotify-Loading-Animation_2.gif'/>
       </div>
           :


           
            <div className='flex  justify-center   h-[100%] '>
                 {result.isPlaying ?
                <div className='  w-full   '>
                    <div className='z-10 w-full lg:w-fit lg:left-5  absolute lg:top-5 top-3 flex'>

                    <img className='h-[60px] lg:h-[90px]  ' src="img/newspot.png"/>
                    <p className='pt-3 lg:pt-5 uppercase'>playing from playlist</p>
                    </div>
                      
                    <div className='  flex justify-center  h-[100%]'>


                        <img className='object-cover covers w-full lg:h-[100vh]  ' src={result.albumImageUrl} alt="album-image" />

                    </div>

                    <div className='absolute bottom-0  drop w-full p-2 lg:px-6'>
                        <div className=''>

                            <div className='flex gap-1 '>
                                <img className=' rounded-[10px] object-cover w-[100px] h-[100px]' src={result.albumImageUrl}  alt="album-image" />
                                <div className='lg:pt-0 text-left '>
                                    <div className='scrolling-limit w-full   '>
                                     <div className='scrolling lg:w-full w-[300px]'>
                                     < p className='lg:text-4xl uppercase' >{result.title}</p>
                                     </div>
                                   
                                    </div>
                                    
                                    < p className='lg:text-3xl  uppercase' >{result.genres}</p>
                                  
                                </div>
                            </div>
                            <div className=''>
                            <p className=' text-left pt-2 .slides uppercase'>{result.artist}</p>
                                </div>
                          

                        </div>
                        <div className='flex justify-between'>

                            <p className=' pt-3'>...</p>
                            <AudioPlayer className='audio'

                                src={result.click}
                                onPlay={e => console.log("onPlay")}
                                customVolumeControls={[]}
                                showJumpControls={false}
                                customAdditionalControls={[]}
                                timeFormat={[]}
                                autoPlay={false}
                                progressJumpSteps={false}
                                defaultCurrentTime={[]}
                                defaultDuration={[]}
                            />
                        </div>



                    </div>
                </div>  :<div className='pt-[260px]'>
                    <img className='h-[90px]' src="img/tifylogo.png"/>
                   <p className='text-2xl'> Ellams is offline</p>
                    
                    </div> }


            </div>


    }



        </div>







    )
}

export default SpotifyNowPlaying