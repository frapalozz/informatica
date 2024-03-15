
export default function Navbar() {
    return(
        <>
            <header className="max-w-screen-2xl w-screen center px-8 flex flex-col items-center">
                <nav className="flex flex-row justify-between items-center w-full h-full mt-9">
                    <div>
                        <a href="" className="text-white flex flex-row justify-center items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m6.75 7.5 3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
                            </svg>
                            <h1 className="text-4xl text-center">INFORMATICA</h1>
                        </a>
                    </div>
                    <div>
                        <button className="bg-white px-8 py-5 rounded-lg text-xl font-bold hover:bg-zinc-100 duration-00 transition-all">Aggiungi risorsa +</button>
                    </div>
                </nav>
                <div className="w-full h-px rounded-xl bg-zinc-600 mt-9"></div>
            </header>
        </>
    )
}