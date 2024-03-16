import { useState } from "react"
import Hero from "./Hero"
import CardGrid from "./CardGrid"
import CardOpen from "./CardOpen"

export default function Container() {

    const[stato, setStato] = useState(true);
    const[index, setIndex] = useState(0);

    function handleClick(id) {
        setStato(false);
        setIndex(id);
    }

    if(stato) {
        return(
            <>
                <Hero />
                <CardGrid stato={(i) => handleClick(i)}/>
            </>
        )
    }

    return(
        <>
            <CardOpen stato={() => setStato(true)} index={index}/>
        </>
    )
    
}