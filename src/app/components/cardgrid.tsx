import Card from "./card"
import { dati } from "@/dati/data";

export default function CardGrid( {anno}: any) {

    const datiMaterie = dati.filter((item: any) => item.anno == anno);
    let text;
    if(datiMaterie.length === 0) {
        text = (
            <div className="w-full bg-gray dark:text-white text-black text-3xl font-semibold flex justify-center items-center">
                Ancora Nulla 😓
            </div>
        );
    }

    return(
        <>
            <section className="max-w-screen-2xl w-full center px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col items-center mt-5">

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full mt-12">
                    {datiMaterie.map((item: any) => (
                        <Card link={item.materia} key={item.materia} immagine={item.immagine} materia={item._comment} anno={item.anno} semestre={item.semestre} agg={item.aggiornamento} corso={item.corso}/>
                    ))}
                </div>
                {text}

            </section>
        </>
    )
}