import { promises as fs } from 'fs'
import Materia from '../components/materia';
import path from 'path';

export default async function MateriaPage({ params }: {params: {materia: string}}) {

    const file = await fs.readFile(path.resolve('./src/dati/data.json'), 'utf8')
    const data = JSON.parse(file)

    const datiMateria = data.dati.filter((item: any) => item.materia == params.materia);

    return(
        <Materia key={datiMateria[0].materia} immagine={datiMateria[0].immagine} materia={datiMateria[0].materia} descrizione={datiMateria[0].descrizione} webex={datiMateria[0].webex} materiale={datiMateria[0].materiale} registrazioni={datiMateria[0].registrazioni} prove={datiMateria[0].prove} extraName={datiMateria[0].extraName} extra={datiMateria[0].extra} extraLink={datiMateria[0].extraLink} quantity={datiMateria[0].quantity}/>
    )
}