import CardGrid from "../components/cardgrid"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: '3° Anno',
}

export default function Tanno(){
    return(
        <main className="flex flex-col items-center justify-center w-full">
            <CardGrid anno="3"></CardGrid>
        </main>
    )
}