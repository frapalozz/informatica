import { promises as fs } from 'fs'
import Materia from '../components/materia';
import path from 'path';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { materia: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
    ): Promise<Metadata> {
    // read route params
    const id = params.materia

    return {
        title: params.["_comment"],
        openGraph: {
            title: id,
            description: "Tutto ciò che serve agli studenti informatici in un luogo solo",
            images: {
                url: "https://art.pixilart.com/c562a069cbc4da4.png",
            }
        }
    }
}

export default async function MateriaPage({ params }: {params: {materia: string}}) {

    const file = await fs.readFile(path.resolve('./src/dati/data.json'), 'utf8')
    const data = JSON.parse(file)

    const datiMateria = data.dati.filter((item: any) => item.materia == params.materia);

    return(
        <Materia key={datiMateria[0].materia} immagine={datiMateria[0].immagine} materia={datiMateria[0]._comment} descrizione={datiMateria[0].descrizione} webex={datiMateria[0].webex} materiale={datiMateria[0].materiale} registrazioni={datiMateria[0].registrazioni} prove={datiMateria[0].prove} extraName={datiMateria[0].extraName} extra={datiMateria[0].extra} extraLink={datiMateria[0].extraLink} quantity={datiMateria[0].quantity} anno={datiMateria[0].anno}/>
    )
}
