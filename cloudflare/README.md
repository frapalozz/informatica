# Cloudflare Worker

`worker.js` è la copia di riferimento del Worker che sta davanti a informatica.palozz.com su Cloudflare. Jekyll non lo pubblica (è in `exclude` di `_config.yml`): il codice vero vive su Cloudflare, e va incollato lì a mano quando cambia.

## Cosa fa

- **Il sito dal terminale.** Con `curl`, `wget`, HTTPie o PowerShell risponde con testo colorato invece dell'HTML:
  - `curl informatica.palozz.com`: benvenuto e corsi
  - `curl informatica.palozz.com/informatica/2anno`: le materie di un anno (stessi indirizzi del sito)
  - `curl informatica.palozz.com/informatica/Basi_di_Dati`: le risorse di una materia
  - `bash <(curl -s informatica.palozz.com/terminale)`: il terminale interattivo (`ls`, `cd`, `cat`, `open`, `neofetch`, `studia`…). Lo script manda ogni comando a `/_t` e stampa la risposta.
  - `?nocolor` (o `NO_COLOR=1` per lo script) toglie i colori.
  - I dati vengono da `assistente.json`, quindi materie e link si aggiornano da soli.
  - Gli altri file (PDF delle prove, immagini, CSS) passano al sito normale anche con curl.
- **La battaglia tra cani e gatti** (`/battaglia/`) per chi arriva dai siti nella variabile d'ambiente `SITI` (separati da virgola), anche quando nascondono la provenienza con `rel="noreferrer"`.
- Tutto il resto passa a GitHub Pages senza modifiche.

## Configurazione su Cloudflare

- **Worker:** Workers & Pages → il Worker del sito → Edit code: incolla `worker.js` → Deploy.
- **Variabile:** Settings → Variables and Secrets → `SITI` (testo), es. `sito-uno.it,sito-due.it`. Vuota = niente battaglia automatica.
- **Route:** `informatica.palozz.com/*` sulla zona `palozz.com`, con "Fail open": se si supera il limite gratuito (100.000 richieste al giorno) il sito continua a funzionare, senza le funzioni del Worker.
- **Per spegnere tutto:** elimina la route.
