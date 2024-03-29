import { useState } from "react"

export default function CardSubopen( {immagine, materia, descrizione, webex, materiale, registrazioni, prove, extraName, extra, extraLink, quantity} ) {

    const[card, useCard] = useState(false);
    let extras = quantity.map(i => 
            <div key={i} className="w-full">
                <div className="w-full h-[2px] rounded-xl dark:bg-zinc-700 bg-zinc-400 bg- mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="font-semibold cursor-default dark:text-white text-black">{extraName[i]}</p>
                    <a href={extraLink[i]} target="_blank" className="font-medium dark:text-white/65 text-black/65 underline ">{extra[i]}</a>
                </div>
            </div>
        );

    let display = null;
    if(!card) {
        display = (
            <div className="relative lg:w-6/12 w-full dark:bg-zinc-900 bg-zinc-200 lg:p-10 p-16 rounded-2xl flex justify-center items-center border-4 dark:border-zinc-700 border-zinc-400 dark:hover:border-zinc-500 hover:border-zinc-500 transition-all duration-300">
                <svg onClick={() => useCard(!card)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 absolute right-2 top-2 dark:stroke-zinc-400 stroke-zinc-700 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <img rel="preconnect" alt="sprites" src={immagine} className="border-0 rounded-2xl lg:w-56 w-40 shadow-2xl dark:shadow-zinc-950 shadow-zinc-500"/>
            </div>
        )
    }
    else if(card){
        display = (
            <div className="relative lg:w-6/12 w-full dark:bg-zinc-900 bg-zinc-200 dark:border-zinc-500 dark:hover:border-zinc-400 lg:p-10 px-7 py-9 rounded-2xl flex border-4 border-zinc-500 hover:border-zinc-500 transition-all duration-300">
                <svg onClick={() => useCard(!card)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-7 h-7 absolute right-2 top-2 dark:stroke-zinc-400 stroke-zinc-700 cursor-pointer">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <div className="text-white w-full">

                    {extras}

                </div>
            </div>
        )
    }

    return(
        <>

            {display}


            <div className="lg:w-6/12 w-full flex flex-col justify-center items-start">
                <h1 className="dark:text-white text-black text-3xl font-bold mb-4 md:mb-5 cursor-default">{materia}</h1>
                <p className="text-sm dark:text-zinc-400 text-zinc-600 cursor-default">{descrizione}</p>
                <a href={webex} className="dark:bg-white bg-black px-5 py-3 dark:text-zinc-900 text-zinc-100 font-bold text-lg border-0 rounded-md mt-5 mb-3">Webex</a>

                <div className="w-full h-[2px] rounded-xl dark:bg-zinc-700 bg-zinc-400 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="dark:text-white text-black font-semibold text-lg cursor-default">Materiale didattico</p>
                    <a href={materiale[0]} target="_blank" className="font-medium text-lg dark:text-white/65 text-black/65 underline">{materiale[1]}</a>
                </div>

                <div className="w-full h-[2px] rounded-xl dark:bg-zinc-700 bg-zinc-400 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="dark:text-white text-black font-semibold text-lg cursor-default">Registrazioni</p>
                    <a href={registrazioni[0]} target="_blank" className="font-medium text-lg dark:text-white/65 text-black/65 underline">{registrazioni[1]}</a>
                </div>

                <div className="w-full h-[2px] rounded-xl dark:bg-zinc-700 bg-zinc-400 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="dark:text-white text-black font-semibold text-lg cursor-default">Prove passate</p>
                    <a href={prove[0]} target="_blank" className="font-medium text-lg dark:text-white/65 text-black/65 underline">{prove[1]}</a>
                </div>
                
            </div>
        </>
    )
}