"use client"
import Link from "next/link";
import Image from "next/image";

export default function Card( {immagine, materia, semestre, agg, corso, link, chiave}: any) {

    let date1 = new Date(agg);
    let date2 = new Date();

    let differenzaTempo = date2.getTime() - (date1.getTime() - 43200000);
    let differenzaGiorni = Math.round(differenzaTempo / (1000*3600*24)) - 1;

    let text = "" + differenzaGiorni + " giorni fa";
    if(differenzaGiorni <= 0) text = "oggi";
    /*
    else if(differenzaGiorni >= 30 && differenzaGiorni < 90) {text = "30+ giorni fa";}
    else if(differenzaGiorni >= 90 && differenzaGiorni < 180) {text = "90+ giorni fa";}
    else if(differenzaGiorni >= 180 && differenzaGiorni < 365) {text = "180+ giorni fa";}
    else if(differenzaGiorni >= 365) {text = "1 anno fa";}
    else if(differenzaGiorni >= (365 + 365/2)) {text = "1+ anno fa";}
    */

    let notifRed = "w-2.5 h-2.5 -top-1 -right-1";

    let tipo: string;
    if(semestre === "extra") {tipo = "extra"}
    else {tipo = semestre + "° Semestre"}
    

    return(
        <Link href={link} key={chiave} className="relative w-full h-96 flex flex-col border-2 dark:border-zinc-700 border-zinc-400 dark:hover:border-zinc-500 hover:border-zinc-600 transition-all duration-300 rounded-lg cursor-pointer">
            <div className={`absolute rounded-full bg-red-500 ${notifRed} z-10 ${(differenzaGiorni <= 0)? "": "hidden"}`}></div>
            <div className={`absolute rounded-full bg-red-500 ${notifRed} z-10 animate-ping ${(differenzaGiorni <= 0)? "": "hidden"}`}></div>

            <div className="h-4/6 dark:bg-zinc-900/20 bg-zinc-20/20 w-full border-0 rounded-t-md flex justify-center items-center backdrop-blur-sm">
                <Image rel="preconnect" alt="sprites" width={128} height={128} src={immagine} unoptimized className="w-32 h-32 border-0 rounded-lg shadow-2xl dark:shadow-zinc-950 shadow-zinc-500"/>
            </div>

            <div className="w-full dark:bg-neutral-950 bg-neutral-300 h-2/6 border-0 rounded-b-md px-5 py-3 flex flex-col justify-between items-start">
                <div>
                <div>
                    <h1 className="dark:text-white text-black min-h-7 font-semibold text-lg">{materia}</h1>
                </div>
                <div className="relative flex flex-row gap-1">
                    {corso.map((item: any) => (
                        <div key={item} className="text-stone-700 dark:text-stone-500 text-xs rounded-full px-2 py-px text-center font-semibold border border-stone-700 dark:border-stone-500">{item}</div>
                    ))}
                </div>
                </div>

                <div className="flex flex-row w-full justify-between items-center">
                    <div className="flex flex-row justify-start items-center">
                        <div className="dark:bg-zinc-100 bg-zinc-900 dark:text-black text-white rounded-full px-2 py-px font-medium">
                            <p className="text-[12px]">
                                {tipo}
                            </p>
                        </div>
                        
                    </div>
                    <div className="dark:text-white/65 text-black/70 text-xs">Aggiornato {text}</div>
                </div>
            </div>

        </Link>
    )
}
