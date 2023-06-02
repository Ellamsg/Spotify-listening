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
                 {loading ? <div className=''>
           
           <p className="pt-[300px] ">Loading...</p>
       </div>
           :



            <div className='flex  justify-center relative  h-[100%] '>
                 {result.isPlaying ?
                <div className='  w-full   '>
                    
                    <div className='  flex justify-center  h-[100%]'>


                        <img className='object-cover covers w-full lg:h-[100vh]  ' src={result.albumImageUrl} alt="album-image" />

                    </div>

                    <div className='absolute bottom-0  drop w-full p-2 lg:px-6'>
                        <div className=''>

                            <div className='flex gap-1  '>
                                <img className=' rounded-[10px] object-cover w-[100px] h-[100px]' src={result.albumImageUrl}  alt="album-image" />
                                <div className='lg:pt-0 text-left'>
                                    < p className='lg:text-4xl' >{result.title}</p>
                                    < p className='lg:text-4xl' >{result.genres}</p>
                                  
                                </div>
                            </div>
                            <p className=' text-left pt-2'>{result.artist}</p>

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
                </div>  : "Ellams is offline"}


            </div>


    }



        </div>





        /*<div className=''>


            {loading ? <div className=''>
           
                <p className=" ">Loading...</p>
            </div>
                :

                <div className='flex justify-center'>
                {result.isPlaying ?
                        <div className='bg-red text-green '>
                  <div className=''>
                                    <a className=" "  target="_blank">{result.title}</a>
                                </div>
                            <div className=''>
                                <a href={result.songUrl}>

                                <img  className='w-[500px] h-[500px]' src={result.albumImageUrl} alt="album-image" />
                                <img src={result.artistImageUrl}/>
                                </a>
                               
                            </div>

                            <div className=''>
                                
                                <div className=''>
                                    <p className=" ">{result.artist}</p></div>
                            </div>

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

                        </div> : "Ellams is offline"}

                </div>
            }





        </div>*/





    )
}

export default SpotifyNowPlaying