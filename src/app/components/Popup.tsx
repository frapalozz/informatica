"use client"
import React, { useEffect, useState } from 'react'

export default function Popup() {

    const [visible, setVisible] = useState(false)

    useEffect(() => {
        if(window.location.href === "https://frapalozzinformatica.netlify.app/") {
            setVisible(true)
        } else {
            setVisible(true)
        }
    }, [])

  return (
    <div className={'h-screen w-screen fixed z-[70] flex items-center justify-center ' + (visible? '':'hidden')}>
        <div className='flex flex-col gap-3 px-8 py-10 items-center justify-center popup w-fit h-fit min-h-24 bg-neutral-900/20 dark:bg-neutral-900/20 backdrop-blur-xl rounded-xl text-white'>
            <div className='absolute top-2 right-2 cursor-pointer' onClick={() => {setVisible(false)}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
            </div>
            <p className='text-xl uppercase font-semibold'>Nuovo Link 👇</p>
            <a href='https://informatica.palozz.com/' className='underline text-blue-700 dark:text-blue-400'>
                informatica.palozz.com
            </a>
        </div>
    </div>
  )
}
