import Button from "./button"

export default function Hero() {
    return(
        <>
            <section className="max-w-screen-2xl w-full center px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col items-center xl:mt-55 lg:mt-48 md:mt-40 mt-36 relative z-[60]">

                <h1 className="dark:text-zinc-400 text-zinc-600 md:min-h-[180px] md:min-w-[672px] lg:min-w-[896px] text-center text-5xl lg:text-6xl font-extrabold max-w-2xl lg:max-w-4xl lg:tracking-wide">Tutto ciò che serve agli <span className="dark:text-zinc-200 text-zinc-950">studenti informatici</span> in un luogo solo</h1>

                <p className="dark:text-zinc-400 text-zinc-600 min-h-6 text-sm md:text-base font-medium mt-5">Aggiungi, Modifica, Migliora</p>

                <div className="grid grid-cols-4 justify-center items-center text-white border-solid rounded-md dark:border-zinc-700 border-zinc-400 border mt-6 dark:bg-stone-950/5 bg-stone-100/5 backdrop-blur-sm">

                    <Button text="1° Anno" link="/" first={true} />
                    <Button text="2° Anno" link="/2anno" center={true} />
                    <Button text="3° Anno" link="/3anno" center={true} />
                    <Button text="Extra" link="/extra" last={true} />

                </div>

            </section>
        </>
    )
}