"use client"
import { useState } from "react";

export default function Risorsa() {

    const [submit, setSubmit] = useState(9)

    async function saveToNotion(name: string, anno: string, links: string, altro: string) {
        const url = '/risorsa/submit-to-notion';
        setSubmit(2)
        await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, anno, links, altro })
        })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            setSubmit(0)
        })
        .catch(error => {
            console.error('Error:', error);
            setSubmit(3)
        });
    }


    return(
        <main className="flex flex-col items-center justify-center w-full dark:text-white text-black mt-10">
            <section className="max-w-screen-2xl w-full center px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col justify-start items-center mt-5 mb-5">
                <h1 className="text-center text-4xl font-bold">Nuova Risorsa</h1>
                <p className="w-full sm:w-[500px] text-center text-sm">Per aggiungere un file bisogna creare una cartella Google drive (con accesso pubblico) e inserire il link nel campo <span className="underline">Links risorsa</span></p>
                <form
                    className="flex flex-col gap-3 mt-5 justify-center w-full sm:w-[500px]"
                    onSubmit={(e) => {
                        e.preventDefault();
                        const name = (document.getElementById('name') as HTMLInputElement).value;
                        const anno = (document.getElementById('anno') as HTMLSelectElement).value;
                        const links = (document.getElementById('links') as HTMLTextAreaElement).value;
                        const altro = (document.getElementById('altro') as HTMLTextAreaElement).value;
                        // Call the backend script to save data to Notion
                        saveToNotion(name, anno, links, altro);
                      }}>

                    
                    <label className="flex flex-col justify-center gap-1 font-medium" htmlFor="Titolo">
                        Quale risorsa vuoi aggiungere?
                        <input className="font-normal px-4 py-2 rounded text-sm dark:bg-black bg-white border dark:border-white/20 border-black/20" type="text" name="Titolo" placeholder="Titolo Risorsa" id="name" required />
                    </label>
                    <label className="flex flex-col justify-center gap-1 font-medium" htmlFor="Anno">
                        Di quale anno si tratta?
                        <select name="Anno" id="anno" className="dark:bg-black bg-white text-sm rounded border dark:border-white/20 border-black/20 px-2 py-px w-fit font-normal" required>
                            <option value="1 Anno">1° Anno</option>
                            <option value="2 Anno">2° Anno</option>
                            <option value="3 Anno">3° Anno</option>
                            <option value="Extra">Extra</option>
                        </select>
                    </label>
                    <label htmlFor="Links" className="flex flex-col justify-center gap-1 font-medium">
                        Links risorsa
                        <textarea className="dark:bg-black bg-white border dark:border-white/20 border-black/20 px-4 py-2 text-sm rounded font-normal" name="Links" id="links" placeholder="esempio.com" required></textarea>
                    </label>
                    <label htmlFor="Altro" className="flex flex-col justify-center gap-1 font-medium">
                        Altre informazioni
                        <textarea className="border dark:border-white/20 border-black/20 dark:bg-black bg-white px-4 py-2 text-sm rounded font-normal" name="Altro" id="altro"></textarea>
                    </label>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-3 w-full sm:w-auto">
                        <button id="submit-button" type="submit" disabled={(submit == 0 || submit == 3)} className={`${(submit == 0 || submit == 3)? "dark:bg-neutral-400 bg-neutral-800": "dark:bg-white bg-black"} dark:text-black text-white font-semibold w-full sm:w-fit px-4 py-1 rounded-md flex flex-row items-center justify-center gap-2`}>
                            <div className="flex justify-end my-auto">
                                <svg className={`${submit == 2? "animate-spin inline": "hidden"} dark:invert-0 invert`} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_108_2)">
                                    <path d="M10.1374 17.5341C8.62356 17.5548 7.13892 17.1169 5.87867 16.2779C4.61843 15.439 3.64158 14.2383 3.07659 12.8337C2.51159 11.4291 2.3849 9.88645 2.71317 8.40852C3.04145 6.93059 3.80931 5.58661 4.9158 4.5533C6.02229 3.51999 7.4156 2.84574 8.91251 2.6192C10.4094 2.39267 11.9398 2.62446 13.3025 3.28409C14.6652 3.94373 15.7964 5.00032 16.5473 6.31494C17.2981 7.62956 17.6336 9.14064 17.5095 10.6495" stroke="black" stroke-opacity="0.35" stroke-width="5"/>
                                    <path d="M17.5 10C17.5 10.9849 17.306 11.9602 16.9291 12.8701C16.5522 13.7801 15.9997 14.6069 15.3033 15.3033C14.6069 15.9997 13.7801 16.5522 12.8701 16.9291C11.9602 17.306 10.9849 17.5 10 17.5" stroke="black" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
                                    </g>
                                    <defs>
                                    <clipPath id="clip0_108_2">
                                    <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                    </defs>
                                </svg>
                            </div>
                            
                            Invia
                            <div></div>
                        </button>

                        <p id="message" className={`${submit == 0? "text-green-500" : ""}${submit == 1? "text-red-500": ""} ${submit == 3? "text-orange-500":""}`}>{submit == 0 && 'Inviato!'}{submit == 1 && 'Riprova più tardi!'}{submit == 3 && 'Già inviato'}</p>
                    </div>
                    
                </form>
            </section>
        </main>
    )
}