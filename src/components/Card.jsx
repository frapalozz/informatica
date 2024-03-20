export default function Card( {immagine, materia, anno, agg, click} ) {

    let date1 = new Date(agg);
    let date2 = new Date();

    let differenzaTempo = date2.getTime() - date1.getTime();
    let differenzaGiorni = Math.round(differenzaTempo / (1000*3600*24)) - 1;

    let text = "" + differenzaGiorni + " giorni fa";
    if(differenzaGiorni === 0) {text = "oggi";}

    return(
        <>
            <div onClick={(i) => click(i)} className="w-full  h-96 flex flex-col border border-2 dark:border-zinc-700 border-zinc-400 dark:hover:border-zinc-500 hover:border-zinc-600 transition-all duration-300 rounded-lg cursor-pointer">

                <div className="h-4/6 dark:bg-zinc-900 bg-zinc-200 w-full border border-0 rounded-t-md flex justify-center items-center">
                    <img src={immagine} className="w-32 h-32 border border-0 rounded-lg shadow-2xl dark:shadow-zinc-950 shadow-zinc-500"/>
                </div>

                <div className="w-full dark:bg-neutral-950 bg-neutral-300 h-2/6 border border-0 rounded-b-md px-5 py-3 flex flex-col justify-between items-start">
                    <div>
                        <h1 className="dark:text-white text-black font-semibold text-lg">{materia}</h1>
                    </div>

                    <div className="flex flex-row w-full justify-between items-center">
                        <div className="dark:bg-zinc-300 bg-zinc-900 dark:text-black text-white rounded-full px-2 py-px font-semibold">{anno}° anno</div>
                        <div className="dark:text-white/45 text-black/60 text-xs">Aggiornato {text}</div>
                    </div>
                </div>

            </div>
        </>
    )
}