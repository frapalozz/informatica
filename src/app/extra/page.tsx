import CardGrid from "../components/cardgrid"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Extra',
}

export default function Extra(){
    return(
        <main className="flex flex-col items-center justify-center w-full">
            <CardGrid anno="extra"></CardGrid>
        </main>
    )
}