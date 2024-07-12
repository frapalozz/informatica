import CardGrid from "../components/cardgrid"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: '2° Anno',
}

export default function Sanno(){
    return(
        <main className="flex flex-col items-center justify-center w-full">
            <CardGrid anno="2"></CardGrid>
        </main>
    )
}