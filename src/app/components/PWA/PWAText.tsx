"use client"
import React, { useEffect, useState } from 'react'
import useUserAgent from '@/hooks/useUserAgent';
import { VT323 } from "next/font/google";

const vt323 = VT323({ subsets: ['latin'], weight: '400'});

export default function PWAText() {

    const [textShow, setTextShow] = useState(false);
    const [flag, setFlag] = useState(false);
    const [window, setWindow] = useState(false);

    setTimeout(() => {setFlag(true)}, 1500)

    const { isMobile, isStandalone } = useUserAgent();

    useEffect(() => {
        if (isMobile && !isStandalone) setTextShow(false)
        else setTextShow(true)
    }, [isMobile, isStandalone]);
    


    function handleAggiungi() {
        if(textShow || !flag) return;

        setWindow(true);
    }


    return (
        <>
            <div className={`text-white flex flex-col items-center justify-center text-xs mt-5 gap-1 min-h-[44px]`}>
                <p className={`${(textShow || !flag)? " opacity-0" : "inline opacity-100"} transition-all duration-700 dark:text-white text-black`}>Aggiungi App alla home page</p>
                <div onClick={handleAggiungi} className={`${(textShow || !flag)? " opacity-0" : "inline opacity-100"} bg-gray-800 px-3 py-1 rounded transition-all duration-[3s]`}>Aggiungi</div>
            </div>

            {window && 
                <div className={`${vt323.className} fixed w-screen h-screen flex items-center justify-center bg-gray-600/40 z-[61]`}>
                    <div className='flex flex-col items-center justify-center bg-white max-w-[300px] rounded-md px-3 py-2 gap-2'>
                        <div className='flex items-center justify-between w-full'>
                            <p className='text-lg'>Aggiungi App</p>
                            <div onClick={() => {setWindow(false)}} className='bg-red-600/20 text-red-600 px-2 rounded'>Chiudi</div>
                        </div>
                        <p className='text-center text-sm'>Aggiungi questa app alla schermata Home per un accesso più rapido e una migliore esperienza d&apos;uso</p>
                        <div>
                            <p className='flex items-center'>
                                Tocca
                                <span>
                                    <svg width="20px" height="20px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg" className='stroke-blue-400'><path d="M30.3 13.7L25 8.4l-5.3 5.3-1.4-1.4L25 5.6l6.7 6.7z"/><path d="M24 7h2v21h-2z"/><path d="M35 40H15c-1.7 0-3-1.3-3-3V19c0-1.7 1.3-3 3-3h7v2h-7c-.6 0-1 .4-1 1v18c0 .6.4 1 1 1h20c.6 0 1-.4 1-1V19c0-.6-.4-1-1-1h-7v-2h7c1.7 0 3 1.3 3 3v18c0 1.7-1.3 3-3 3z"/></svg>
                                    </span> 
                                    e poi &apos;Aggiungi a Home&apos;
                            </p>
                        </div>
                    </div>
                </div>
            }
        </>
        
    )
}
