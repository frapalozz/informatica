import Button from "./Button"
import Card from "./Card"
import { useState } from "react"
import data from "../dati/data.json"

export default function CardGrid( {stato} ) {

    

    const[status, setStatus] = useState(1);
    const datiMaterie = data.dati.filter((item) => item.anno == status);
    let text;
    if(datiMaterie.length === 0) {
        text = (
            <div className="w-screen bg-gray text-white text-3xl font-semibold flex justify-center items-center">
                Ancora Nulla 😓
            </div>
        );
    }

    return(
        <>
            <section className="max-w-screen-2xl w-screen center px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col items-center mt-5">
                <div className="flex justify-center items-center text-white border-solid rounded-md border-zinc-700 border ">

                    <Button text="1° Anno" status={status == 1} select={() => setStatus(1)} first="true" />
                    <Button text="2° Anno" status={status == 2} select={() => setStatus(2)} />
                    <Button text="3° Anno" status={status == 3} select={() => setStatus(3)} />
                    <Button text="Extra" status={status == 4} select={() => setStatus(4)} last="true" />

                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full mt-12">
                    {datiMaterie.map((item) => (
                        <Card click={() => stato(item.id)} key={item.id} immagine={item.immagine} materia={item.materia} anno={item.anno} agg={item.aggiornamento}/>
                    ))}
                </div>
                {text}

            </section>
        </>
    )
}