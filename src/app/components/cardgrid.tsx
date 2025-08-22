"use client"
import { useState } from "react";
import Card from "./card"
import { dati } from "@/dati/data";

export default function CardGrid( {anno}: any) {

    const [materia, setMateria] = useState("");

    let datiMaterie: any;
    if(materia == "") datiMaterie = dati.filter((item: any) => item.anno == anno);
    else datiMaterie = dati.filter((item: any) => (item["_comment"].toLowerCase().includes(materia.toLowerCase()) && item.anno <= 3) )
    


    let text;
    if(datiMaterie.length === 0) {
        text = (
            <div className="w-full bg-gray dark:text-white text-black text-3xl font-semibold flex justify-center items-center">
                Ancora Nulla 😓
            </div>
        );
    }

    return(
        <section className="relative max-w-screen-2xl w-full center px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col items-center mt-2 z-[60]">

            <div className="flex flex-col items-center justify-center font-medium text-sm">
                <p for="search-class-input" className="dark:text-white text-black">Cerca materia</p>
                <input id="search-class-input" onChange={(e) => {setMateria(e.target.value)}} className="dark:bg-zinc-950 bg-white dark:border-zinc-700 focus:dark:border-zinc-500 border-zinc-400 dark:text-white text-black border-2 rounded px-2 outline-none font-semibold text-base" type="text" />
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full mt-5">
                {datiMaterie.map((item: any) => (
                    <Card link={item.materia} key={item.materia} immagine={item.immagine} materia={item._comment} anno={item.anno} semestre={item.semestre} agg={item.aggiornamento} corso={item.corso}/>
                ))}
            </div>
            {text}

        </section>
    )
}
