export default function Card( {immagine, materia, anno, agg, click} ) {

    let date1 = new Date(agg);
    let date2 = new Date();

    let differenzaTempo = date2.getTime() - date1.getTime();
    let differenzaGiorni = Math.round(differenzaTempo / (1000*3600*24));

    return(
        <>
            <div onClick={(i) => click(i)} className="w-full  h-96 flex flex-col border border-2 border-zinc-700 hover:border-zinc-500 transition-all duration-300 rounded-lg cursor-pointer">

                <div className="h-4/6 bg-zinc-900 w-full border border-0 rounded-t-md flex justify-center items-center">
                    <img src={immagine} className="w-32 h-32 border border-0 rounded-lg shadow-2xl shadow-zinc-950"/>
                </div>

                <div className="w-full bg-neutral-950 h-2/6 border border-0 rounded-b-md px-5 py-3 flex flex-col justify-between items-start">
                    <div>
                        <h1 className="text-white font-semibold text-lg">{materia}</h1>
                    </div>

                    <div className="flex flex-row w-full justify-between items-center">
                        <div className="bg-zinc-300 rounded-full px-2 py-px font-semibold">{anno}° anno</div>
                        <div className="text-white/45 text-xs">Aggiornato {differenzaGiorni} giorni fa</div>
                    </div>
                </div>

            </div>
        </>
    )
}