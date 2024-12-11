import MateriaCard from "./materiaCard"

export default function Materia({ immagine, materia, descrizione, webex, materiale, registrazioni, prove, extraName, extra, extraLink, anno }: any) {

    if(anno === "extra"){
        return(
            <section className="max-w-screen-2xl w-full px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col items-center mt-5 xl:mb-9 lg:mb-7 md:mb-5 mb-4">

                <div className="flex flex-col md:flex-row md:gap-10 gap-16 text-white w-full h-5/6 mt-10">
                    
                    <MateriaCard extraLink={extraLink} extraName={extraName} extra={extra} immagine={immagine} anno={anno}></MateriaCard>


                    <div className="lg:w-6/12 w-full flex flex-col justify-center items-start relative z-[60]">
                        <h1 className="dark:text-white text-black text-3xl font-bold mb-4 md:mb-5 cursor-default">{materia}</h1>
                        <p className="text-sm dark:text-zinc-400 text-zinc-600 cursor-default">{descrizione}</p>
                        <a href={webex} className="dark:bg-white bg-black px-5 py-3 dark:text-zinc-900 text-zinc-100 font-bold text-lg border-0 rounded-md mt-5 mb-3">Visualizza Risorsa</a>
                    </div>
                </div>

            </section>
        )
    }

    return(
        <section className="max-w-screen-2xl w-full px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col items-center mt-5 xl:mb-9 lg:mb-7 md:mb-5 mb-4">

            <div className="flex flex-col md:flex-row md:gap-10 gap-16 text-white w-full h-5/6 mt-10">
                
                <MateriaCard extraLink={extraLink} extraName={extraName} extra={extra} immagine={immagine}></MateriaCard>


                <div className="lg:w-6/12 w-full flex flex-col justify-center items-start relative z-[60]">
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
            </div>

        </section>
    )
}