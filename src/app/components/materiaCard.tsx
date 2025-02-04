"use client"

import Image from "next/image";
import { useState } from "react";


export default function MateriaCard({ extraLink, extraName, extra, immagine, anno}: any){
    
    const [card, setCard] = useState(false);

    let extras = extra.map((item: string, index: number) => 
        <div key={index} className="w-full">
            <div className="w-full h-[2px] rounded-xl dark:bg-zinc-700 bg-zinc-400 bg- mt-3 mb-3"></div>
            <div className="flex flex-row justify-between items-cente w-full">
                <p className="font-semibold cursor-default dark:text-white text-black">{extraName[index]}</p>
                <a href={extraLink[index]} target="_blank" className="font-medium dark:text-white/65 text-black/65 underline ">{item}</a>
            </div>
        </div>
    )

    if(!card) {
        return (
            <div className="relative lg:w-6/12 w-full dark:bg-zinc-900/20 bg-zinc-200/20 backdrop-blur-sm lg:p-10 p-16 rounded-2xl flex justify-center items-center border-4 dark:border-zinc-700 border-zinc-400 dark:hover:border-zinc-500 hover:border-zinc-500 transition-all duration-300 z-[60]">
                <div className={`${(anno === "extra" || extra.length == 0)? "hidden": ""} absolute right-2 top-2`}>
                    <div onClick={() => setCard(!card)} className="relative z-10 cursor-pointer bg-green-600/20 hover:bg-green-600/25 text-green-600 px-5 py-1 rounded-md transition-all duration-300 ease-in-out">
                        altro
                    </div>
                </div>
                
                <Image rel="preconnect" unoptimized width={224} height={224} alt="sprites" src={immagine} className="border-0 rounded-2xl lg:w-56 w-40 shadow-2xl dark:shadow-zinc-950 shadow-zinc-500"/>
            </div>
        )
    }

    return (
        <div className="relative lg:w-6/12 w-full dark:bg-zinc-900 bg-zinc-200 dark:border-zinc-500 dark:hover:border-zinc-400 lg:p-10 px-7 py-9 rounded-2xl flex border-4 border-zinc-500 hover:border-zinc-500 transition-all duration-300">
            <div onClick={() => setCard(!card)} className="absolute right-2 top-2 cursor-pointer bg-red-500/20 hover:bg-red-500/25 text-red-500 px-5 py-1 rounded-md">
                chiudi
            </div>
            <div className="text-white w-full">

                {extras}

            </div>
        </div>
    )
}