import { Metadata } from "next";
import Risorsa from "./components/risorsa";

export const metadata: Metadata = {
    title: 'Aggiungi Risorsa',
    openGraph: {
        title: "Aggiungi Risorsa",
        description: "Tutto ciò che serve agli studenti informatici in un luogo solo",
        images: {
            url: "https://art.pixilart.com/c562a069cbc4da4.png",
        }
    }
}

export default function NuovaRisorsa() {
    return(<Risorsa></Risorsa>)
}