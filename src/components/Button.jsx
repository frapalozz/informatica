
export default function Button( { text, status, first, last, select} ) {

    return(
        <button onClick={select} className={`h-full ${(status)? "dark:bg-zinc-100 bg-zinc-950 dark:text-zinc-950 text-zinc-100": "dark:text-white text-black" } text-sm md:text-base font-medium ${(first)? "ml-0 mr-2": "mx-px"} ${(last)? "ml-2 mr-0": "mx-px"} px-2 py-px rounded-md transition-all duration-300 min-h-6`}>
            {text}
        </button>
    )
    
}