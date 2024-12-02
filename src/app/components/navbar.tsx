import Link from "next/link"

export default function Navbar() {
    return(
        <header className="nav dark:bg-stone-950/40 bg-stone-100/40 backdrop-blur-md max-w-screen-2xl w-full center px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col items-center fixed z-50 top-0 mb-9">

            <div className="w-screen bg-transparent mt-1 flex items-center justify-center">
                <Link target="_blank" href={"https://adventofcode.com/"} className="text-blue-400">❄️Advent Of Code❄️</Link>
            </div>

            <nav className="flex flex-row justify-between items-center w-full h-full xl:mt-4 lg:mt-2 mt-1"> {/**xl:mt-9 lg:mt-7 md:mt-5 mt-4 */}
                <div>
                    <Link aria-label="Home" href="/" className="text-white flex flex-row justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-12 h-12 stroke-black dark:stroke-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                        </svg>

                        <h1 className="xl:text-4xl lg:text-3xl text-center lg:font-bold lg:inline hidden dark:text-white text-black">INFORMATICA</h1>
                    </Link>
                </div>

                <div>
                    <Link aria-label="Risorsa" href="/risorsa" className="md:min-h-[43px] md:min-w-[184px] dark:bg-white bg-black text-white dark:text-black xl:px-5 lg:px-4 md:px-3.5 px-3 xl:py-3.5 lg:py-3 py-2 rounded-lg xl:text-lg font-bold hover:shadow-lg dark:hover:shadow-zinc-700 hover:shadow-zinc-300 duration-300 transition-all">Aggiungi risorsa</Link>
                </div>
            </nav>

            <div className="w-full h-[2px] rounded-xl dark:bg-zinc-700 bg-zinc-400 xl:mt-9 lg:mt-7 md:mt-5 mt-4"></div>

        </header>
    )
}