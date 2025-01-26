import Materia from '../components/materia';
import { Metadata, ResolvingMetadata } from 'next';
import { dati } from '@/dati/data';
import Popup from '../components/Popup';

type Props = {
    params: { materia: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
    ): Promise<Metadata> {
    // read route params
    let id = params.materia;
    while(id.indexOf("_") > -1) id = id.replace("_", " ")

    return {
        title: id,
        openGraph: {
            title: id,
            description: "Tutto ciò che serve agli studenti informatici in un luogo solo",
            images: {
                url: "https://art.pixilart.com/c562a069cbc4da4.png",
            }
        }
    }
}

export default function MateriaPage({ params }: {params: {materia: string}}) {

    const datiMateria = dati.filter((item: any) => item.materia == params.materia)[0];

    return(
        <>
            <Popup path={"/"+params.materia} />
            <Materia key={datiMateria.materia} immagine={datiMateria.immagine} materia={datiMateria._comment} descrizione={datiMateria.descrizione} webex={datiMateria.webex} materiale={datiMateria.materiale} registrazioni={datiMateria.registrazioni} prove={datiMateria.prove} extraName={datiMateria.extraName} extra={datiMateria.extra} extraLink={datiMateria.extraLink} anno={datiMateria.anno}/>
        </> 
        
    )
}
