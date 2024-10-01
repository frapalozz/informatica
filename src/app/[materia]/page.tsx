import Materia from '../components/materia';
import { Metadata, ResolvingMetadata } from 'next';
import { dati } from '@/dati/data';

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
    id = id.replace("_", " ")

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

    const datiMateria = dati.filter((item: any) => item.materia == params.materia);

    return(
        <Materia key={datiMateria[0].materia} immagine={datiMateria[0].immagine} materia={datiMateria[0]._comment} descrizione={datiMateria[0].descrizione} webex={datiMateria[0].webex} materiale={datiMateria[0].materiale} registrazioni={datiMateria[0].registrazioni} prove={datiMateria[0].prove} extraName={datiMateria[0].extraName} extra={datiMateria[0].extra} extraLink={datiMateria[0].extraLink} quantity={datiMateria[0].quantity} anno={datiMateria[0].anno}/>
    )
}
