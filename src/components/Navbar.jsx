
export default function Navbar() {
    return(
        <>
            <header className="max-w-screen-2xl w-screen center px-3.5 md:px-4 lg:px-6 xl:px-8 flex flex-col items-center">

                <nav className="flex flex-row justify-between items-center w-full h-full xl:mt-9 lg:mt-7 md:mt-5 mt-4">
                    <div>
                        <a href="#" className="text-white flex flex-row justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>

                            <h1 className="xl:text-4xl lg:text-3xl text-center lg:font-bold lg:inline hidden">INFORMATICA</h1>
                        </a>
                    </div>

                    <div>
                        <a href="https://forms.gle/tGFM4bSCNoKdDKJi6" className="bg-white xl:px-5 lg:px-4 md:px-3.5 px-3 xl:py-3.5 lg:py-3 py-2 rounded-lg xl:text-lg font-bold hover:shadow-lg hover:shadow-zinc-600 duration-300 transition-all">Aggiungi risorsa +</a>
                    </div>
                </nav>

                <div className="w-full h-[2px] rounded-xl bg-zinc-700 xl:mt-9 lg:mt-7 md:mt-5 mt-4"></div>

            </header>
        </>
    )
}