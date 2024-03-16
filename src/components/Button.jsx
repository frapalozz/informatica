
export default function Button( { text, status, first, last, select} ) {
    
    if(status) {
        if(first) {
            return(
                <button onClick={select} className="font-medium text-zinc-800 bg-zinc-300 px-2 py-px rounded-md ml-0 mr-2">
                    {text}
                </button>
            )
        }
        else if(last) {
            return(
                <button onClick={select} className="font-medium text-zinc-800 bg-zinc-300 px-2 py-px rounded-md ml-2 mr-0">
                    {text}
                </button>
            )
        }
        return(
            <button onClick={select} className="font-medium text-zinc-800 bg-zinc-300 px-2 py-px rounded-md mx-px">
                {text}
            </button>
        )
    }

    else {
        if(first) {
            return(
                <button onClick={select} className="font-medium text-white px-2 py-px rounded-md ml-0 mr-2">
                    {text}
                </button>
            )
        }
        else if(last) {
            return(
                <button onClick={select} className="font-medium text-white px-2 py-px rounded-md ml-2 mr-0">
                    {text}
                </button>
            )
        }
        return(
            <button onClick={select} className="font-medium text-white px-2 py-px rounded-md mx-px">
                {text}
            </button>
        )
    }
    
}