import { promises as fs } from 'fs'
import Materia from '../components/materia';

export default async function MateriaPage({ params }: {params: {materia: string}}) {

    const file = await fs.readFile(process.cwd() + '/public/dati/data.json', 'utf8')
    const data = JSON.parse(file)

    const datiMateria = data.dati.filter((item: any) => item.materia == params.materia);

    return(
        <>
            {datiMateria.map((item: any) => (
                <Materia key={item.materia} immagine={item.immagine} materia={item.materia} descrizione={item.descrizione} webex={item.webex} materiale={item.materiale} registrazioni={item.registrazioni} prove={item.prove} extraName={item.extraName} extra={item.extra} extraLink={item.extraLink} quantity={item.quantity}/>
            ))}
        </>
    )
}