import CardGrid from "../components/cardgrid"
import { Metadata } from "next"
import Popup from "../components/Popup"

export const metadata: Metadata = {
    title: 'Extra',
    openGraph: {
        title: "Extra",
        description: "Tutto ciò che serve agli studenti informatici in un luogo solo",
        images: {
            url: "https://art.pixilart.com/c562a069cbc4da4.png",
        }
    }
}

export default function Extra(){
    return(
        <>
            <Popup path="/extra" />
            <main className="flex flex-col items-center justify-center w-full xl:mb-9 lg:mb-7 md:mb-5 mb-4">
                <CardGrid anno="extra"></CardGrid>
            </main>
        </>
        
    )
}