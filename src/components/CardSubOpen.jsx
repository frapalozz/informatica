export default function CardSubopen( {immagine, materia, descrizione, webex} ) {
    return(
        <>
            <div className="lg:w-6/12 w-full bg-zinc-900 lg:p-10 p-16 border rounded-2xl flex justify-center items-center border border-4 border-zinc-700 hover:border-zinc-500 transition-all duration-300">
                <img src={immagine} className="border border-0 rounded-2xl lg:w-56 w-40 shadow-2xl shadow-zinc-950"/>
            </div>

            <div className="lg:w-6/12 w-full flex flex-col justify-center items-start">
                <h1 className="text-3xl font-bold mb-5">{materia}</h1>
                <p>{descrizione}</p>
                <a href={webex} className="bg-white px-5 py-3 text-zinc-900 font-bold text-lg border border-0 rounded-md mt-5 mb-3">Webex</a>

                <div className="w-full h-[2px] rounded-xl bg-zinc-700 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="font-semibold text-lg">Materiale didattico{}</p>
                    <a href="" className="font-medium text-lg text-white/65 underline">Materiale</a>
                </div>

                <div className="w-full h-[2px] rounded-xl bg-zinc-700 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="font-semibold text-lg">Registrazioni</p>
                    <a href="" className="font-medium text-lg text-white/65 underline">Materiale</a>
                </div>

                <div className="w-full h-[2px] rounded-xl bg-zinc-700 mt-3 mb-3"></div>
                <div className="flex flex-row justify-between items-cente w-full">
                    <p className="font-semibold text-lg">Prove passate</p>
                    <a href="" className="font-medium text-lg text-white/65 underline">Materiale</a>
                </div>
                
            </div>
        </>
    )
}