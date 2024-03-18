import { useState } from "react"

export default function CardSubopen( {immagine, materia, descrizione, webex, materiale, registrazioni, prove, extraName, extra, extraLink, quantity} ) {

    const[card, useCard] = useState(false);
    let extras = quantity.map(i => 
            <div className="w-full">
                <div className="w-full h-[2px] rounded-xl bg-zinc-700 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="font-semibold cursor-default">{extraName[i]}</p>
                    <a href={extraLink[i]} target="_blank" className="font-medium text-white/65 underline ">{extra[i]}</a>
                </div>
            </div>
        );

    let display = null;
    if(!card) {
        display = (
            <div className="relative lg:w-6/12 w-full bg-zinc-900 lg:p-10 p-16 border rounded-2xl flex justify-center items-center border border-4 border-zinc-700 hover:border-zinc-500 transition-all duration-300">
                <svg onClick={() => useCard(!card)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-7 h-7 absolute right-2 top-2 stroke-zinc-400 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                <img src={immagine} className="border border-0 rounded-2xl lg:w-56 w-40 shadow-2xl shadow-zinc-950"/>
            </div>
        )
    }
    else if(card){
        display = (
            <div className="relative lg:w-6/12 w-full bg-zinc-900 lg:p-10 px-7 py-9 border rounded-2xl flex border border-4 border-zinc-500 hover:border-zinc-400 transition-all duration-300">
                <svg onClick={() => useCard(!card)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-7 h-7 absolute right-2 top-2 stroke-zinc-400 cursor-pointer">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
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
                <h1 className="text-3xl font-bold mb-4 md:mb-5 cursor-default">{materia}</h1>
                <p className="text-sm text-zinc-400 cursor-default">{descrizione}</p>
                <a href={webex} className="bg-white px-5 py-3 text-zinc-900 font-bold text-lg border border-0 rounded-md mt-5 mb-3">Webex</a>

                <div className="w-full h-[2px] rounded-xl bg-zinc-700 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="font-semibold text-lg cursor-default">Materiale didattico</p>
                    <a href={materiale[0]} target="_blank" className="font-medium text-lg text-white/65 underline">{materiale[1]}</a>
                </div>

                <div className="w-full h-[2px] rounded-xl bg-zinc-700 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="font-semibold text-lg cursor-default">Registrazioni</p>
                    <a href={registrazioni[0]} target="_blank" className="font-medium text-lg text-white/65 underline">{registrazioni[1]}</a>
                </div>

                <div className="w-full h-[2px] rounded-xl bg-zinc-700 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="font-semibold text-lg cursor-default">Prove passate</p>
                    <a href={prove[0]} target="_blank" className="font-medium text-lg text-white/65 underline">{prove[1]}</a>
                </div>
                
            </div>
        </>
    )
}