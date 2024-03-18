import data from "./data.json"
import CardSubopen from "./CardSubOpen";

export default function CardOpen( {stato, index} ) {

    function scrollToTop() {
        window.scrollTo(0,0);
    }
    scrollToTop();
    console.log(index);
    const datiMateria = data.dati.filter((item) => item.id == index);
    console.log(datiMateria);

    return(
        <>
            <section className="max-w-screen-2xl w-screen items-center px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col items-center xl:mt-50 lg:mt-48 md:mt-40 mt-32">

                <div className="flex flex-row text-white font-medium text-sm justify-start items-center w-full">
                    <div onClick={stato} className="flex flex-row justify-start items-center gap-1 cursor-pointer">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 fill-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                        </svg>
                        <p>Indietro</p>
                    </div>
                </div>

                <div className="flex flex-col md:flex-row md:gap-10 gap-16 text-white w-full h-5/6 mt-10">
                    {datiMateria.map((item) => (
                        <CardSubopen key={item.id} immagine={item.immagine} materia={item.materia} descrizione={item.descrizione} webex={item.webex} materiale={item.materiale} registrazioni={item.registrazioni} prove={item.prove} extraName={item.extraName} extra={item.extra} extraLink={item.extraLink} quantity={item.quantity}/>
                    ))}
                </div>

            </section>
        </>
    )
}