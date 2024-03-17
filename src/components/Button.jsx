
export default function Button( { text, status, first, last, select} ) {

    return(
        <button onClick={select} className={`h-full ${(status)? "bg-zinc-300 text-zinc-800": "text-white" } text-sm md:text-base font-medium ${(first)? "ml-0 mr-2": "mx-px"} ${(last)? "ml-2 mr-0": "mx-px"} px-2 py-px rounded-md transition-all duration-300`}>
            {text}
        </button>
    )
    
}