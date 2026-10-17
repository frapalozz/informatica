# Informatica

Sito per gli studenti di informatica: per ogni corso e anno raccoglie materie, materiale didattico, registrazioni, prove passate e appunti.

È un sito **statico** costruito con **Jekyll + Liquid** e pubblicabile su **GitHub Pages**. Non usa framework JavaScript: lo stile è Tailwind precompilato in un unico file CSS e il comportamento dinamico (ricerca, pulsanti, form) è in poche righe di JavaScript vanilla.

La home permette di scegliere il corso (**Informatica** o **Computer Science**). Ogni corso ha le sue pagine per anno, più una sezione **Extra** con risorse generiche.

---

## Indice

1. [Struttura del repository](#struttura-del-repository)
2. [Struttura degli URL](#struttura-degli-url)
3. [Sviluppo in locale](#sviluppo-in-locale)
4. [Aggiungere o modificare una materia](#aggiungere-o-modificare-una-materia)
5. [Aggiungere una risorsa a una materia](#aggiungere-una-risorsa-a-una-materia)
6. [Aggiungere un elemento Extra](#aggiungere-un-elemento-extra)
7. [Aggiungere un nuovo corso](#aggiungere-un-nuovo-corso)
8. [Cambiare gli anni di un corso](#cambiare-gli-anni-di-un-corso)
9. [Il form "Aggiungi risorsa" (per i visitatori)](#il-form-aggiungi-risorsa-per-i-visitatori)
10. [Configurazione del sito](#configurazione-del-sito)
11. [Stile e CSS (Tailwind)](#stile-e-css-tailwind)
12. [Pubblicare su GitHub Pages](#pubblicare-su-github-pages)
13. [Vecchi URL e redirect](#vecchi-url-e-redirect)
14. [Risoluzione dei problemi](#risoluzione-dei-problemi)
15. [Differenze rispetto alla versione Next.js](#differenze-rispetto-alla-versione-nextjs)

---

## Struttura del repository

```
.
├── _config.yml                 Configurazione del sito (titolo, link, funzioni opzionali)
├── _data/
│   └── corsi.yml               Elenco dei corsi (nome, descrizione, icona, anni attivi)
├── _materie/                   Collection: UNA materia per file
│   ├── informatica/            Materie del corso Informatica
│   │   ├── Matematica_discreta.md
│   │   └── ...
│   └── computer-science/       Materie del corso Computer Science
├── _layouts/
│   ├── default.html            Guscio comune (head, navbar, hero, footer, script)
│   ├── home.html               Home: scelta del corso
│   ├── anno.html               Elenco materie di un anno (griglia di card + ricerca)
│   └── materia.html            Pagina di dettaglio di una materia
├── _includes/
│   ├── head.html               <head>: titolo, meta, Open Graph, font, CSS
│   ├── navbar.html             Barra in alto (logo, "Aggiungi risorsa", Advent of Code)
│   ├── hero.html               Titolo + selettore corso + tab degli anni
│   ├── tab-button.html         Singolo pulsante dei tab
│   ├── cardgrid.html           Campo di ricerca + griglia di card
│   ├── card.html               Card di una materia
│   ├── materia-card.html       Riquadro con immagine e pulsante "altro" (risorse extra)
│   ├── materia-row.html        Riga "Materiale didattico / Registrazioni / Prove passate"
│   ├── course-icon.html        Icone dei corsi (terminal, cpu)
│   ├── whiteboard.html         Pulsante "Whiteboard" con effetto shimmer
│   ├── footer.html             Footer con link social
│   ├── donation.html           Pulsante "Prendi una Moneta" + popup donazione
│   ├── popup.html              Avviso cambio dominio (facoltativo)
│   └── coin.svg                Moneta pixel-art usata dal pulsante donazione
├── informatica/                Pagine del corso Informatica
│   ├── 1anno.html
│   ├── 2anno.html
│   ├── 3anno.html
│   └── extra.html
├── computer-science/           Pagine del corso Computer Science
│   ├── 1anno.html
│   ├── 2anno.html
│   └── extra.html
├── index.html                  Home (usa il layout `home`)
├── risorsa.html                Pagina con il form "Aggiungi risorsa"
├── 404.html                    Pagina di errore
├── manifest.webmanifest        Manifest PWA (generato da Liquid)
├── favicon.ico
├── assets/
│   ├── css/main.css            CSS Tailwind COMPILATO (da committare, non modificare a mano)
│   ├── js/
│   │   ├── main.js             Ricerca, "Aggiornato X giorni fa", toggle "altro", form, popup
│   │   ├── donation.js         Mini-gioco delle monete
│   │   └── snow.js             Neve (dicembre–febbraio)
│   └── img/                    Icone dell'app (192 e 512 px)
├── tailwind/input.css          Sorgente del CSS (direttive Tailwind + poche regole custom)
├── tailwind.config.js          Configurazione Tailwind (dove cercare le classi, animazioni)
├── package.json                Script per ricompilare il CSS
├── Gemfile                     Dipendenze Ruby (github-pages, redirect-from, sitemap)
└── .gitignore
```

**Regola pratica:** per cambiare i contenuti si toccano solo `_materie/` e `_data/corsi.yml`. Gli altri file riguardano struttura e aspetto.

---

## Struttura degli URL

| Pagina | URL |
|---|---|
| Home (scelta del corso) | `/` |
| Elenco materie di un anno | `/informatica/1anno/`, `/informatica/2anno/`, `/informatica/3anno/` |
| Extra di un corso | `/informatica/extra/` |
| Computer Science | `/computer-science/1anno/`, `/computer-science/2anno/`, `/computer-science/extra/` |
| Singola materia | `/informatica/Matematica_discreta/` |
| Aggiungi risorsa (form) | `/risorsa/` |
| Manifest PWA | `/manifest.webmanifest` |

`/informatica/` e `/computer-science/` reindirizzano al 1° anno del rispettivo corso.

---

## Sviluppo in locale

Servono **Ruby 3.x** e **Bundler**.

```bash
bundle install
bundle exec jekyll serve --livereload
```

Apri <http://localhost:4000>. Il browser si aggiorna a ogni modifica; dopo aver cambiato `_config.yml` bisogna riavviare il server.

Se in `_config.yml` hai impostato un `baseurl` (per esempio `/informatica`), in locale il sito è su `http://localhost:4000/informatica/`. In alternativa:

```bash
bundle exec jekyll serve --baseurl ""
```

Installare Ruby: `brew install ruby` (macOS), RubyInstaller con Devkit (Windows), `sudo apt install ruby-full build-essential` (Linux).

---

## Aggiungere o modificare una materia

Ogni materia è un file Markdown in `_materie/<corso>/`, composto solo da *front matter* (tra i due `---`). Il nome del file è libero, ma conviene usare lo stesso nome dell'URL.

Esempio: `_materie/informatica/Nome_materia.md`

```yaml
---
title: "Nome materia"                      # titolo mostrato su card e pagina
percorso: "informatica"                    # slug del corso: informatica | computer-science
permalink: "/informatica/Nome_materia/"    # URL della pagina
ordine: 23                                 # posizione nell'elenco (numero crescente)
anno: "2"                                  # "1" | "2" | "3" | "extra"  (tra virgolette)
semestre: "1"                              # "1" | "2" | "extra"        (tra virgolette)
aggiornamento: "2026-10-17"                # AAAA-MM-GG: alimenta "Aggiornato X giorni fa"
immagine: "https://..."                    # immagine della card
corso: ["Informatica", "Comunicazione"]    # etichette mostrate sulla card
descrizione: "Testo descrittivo della materia..."
webex: "https://..."                       # pulsante "Webex"
materiale:                                 # riga "Materiale didattico"
  url: "https://..."
  label: "Drive"
registrazioni:                             # riga "Registrazioni"
  url: "https://..."
  label: "Classroom"
prove:                                     # riga "Prove passate"
  url: "https://..."
  label: "Notion"
extra:                                     # facoltativo: compare dietro il pulsante "altro"
  - nome: "Formulario"
    label: "Notion"
    url: "https://..."
---
```

Note sui campi:

- `anno` e `semestre` devono essere **stringhe** (`"2"`, non `2`).
- `aggiornamento` si aggiorna ogni volta che si aggiunge materiale: sulla card compare "Aggiornato oggi / 1 giorno fa / N giorni fa" e, se la data è di oggi, un pallino rosso lampeggiante.
- `ordine` decide l'ordine delle card nella griglia.
- `materiale`, `registrazioni`, `prove`, `webex` ed `extra` sono facoltativi: se mancano, la riga o il pulsante non compaiono.
- Il pulsante "altro" nel riquadro dell'immagine compare solo se `extra` contiene almeno una voce.
- `corso` (etichette sulla card) **non** è il corso di laurea: quello è `percorso`.

Per **modificare** una materia basta aprire il suo file e cambiare i campi. Per **eliminarla**, cancella il file.

---

## Aggiungere una risorsa a una materia

Per aggiungere materiale a una materia esistente (come ricevi dal form o da un compagno):

1. Apri `_materie/<corso>/<Materia>.md`.
2. Se è un link ai tre campi principali, modifica `materiale`, `registrazioni` o `prove`.
3. Se è una risorsa in più (appunti, formulario, esercizi, libro…), aggiungila in fondo a `extra`:
   ```yaml
   extra:
     - nome: "Formulario"
       label: "Notion"
       url: "https://..."
     - nome: "Appunti"          # <-- nuova risorsa
       label: "pdf"
       url: "https://..."
   ```
   `nome` è il titolo a sinistra, `label` è il testo del link a destra.
4. Aggiorna `aggiornamento` con la data di oggi (formato `AAAA-MM-GG`).
5. Fai commit e push.

---

## Aggiungere un elemento Extra

Gli elementi Extra sono link a risorse esterne (roadmap, corsi online…) e hanno una pagina più semplice, senza materiale/registrazioni/prove. Esempio: `_materie/informatica/Nome_risorsa.md`

```yaml
---
title: "Nome risorsa"
percorso: "informatica"
permalink: "/informatica/Nome_risorsa/"
ordine: 30
anno: "extra"
semestre: "extra"
aggiornamento: "2026-10-17"
immagine: "https://..."
corso: ["Frontend", "Backend"]
descrizione: "Breve descrizione."
webex: "https://sito-della-risorsa.it/"     # in questo caso è il link della risorsa
---
```

Nella pagina il pulsante si chiama "Visualizza Risorsa".

---

## Aggiungere un nuovo corso

1. **Dati.** In `_data/corsi.yml` aggiungi una voce. La chiave è lo *slug* usato negli URL.
   ```yaml
   nuovo-corso:
     nome: "Nuovo Corso"
     descrizione: "Breve descrizione mostrata nella home."
     icona: terminal          # terminal | cpu
     anni: ["1", "2", "3"]    # anni attivi nella barra di navigazione
   ```
2. **Pagine.** Copia la cartella `informatica/` con il nuovo slug (`nuovo-corso/`). Elimina i file degli anni che il corso non ha. In ogni file rimasto cambia `percorso` e `permalink`:
   ```yaml
   ---
   layout: anno
   title: "1° Anno"
   permalink: /nuovo-corso/1anno/
   percorso: "nuovo-corso"
   anno: "1"
   redirect_from: ["/nuovo-corso/"]     # solo nel file del 1° anno
   ---
   ```
3. **Materie.** Crea la cartella `_materie/nuovo-corso/` e aggiungi le materie con `percorso: "nuovo-corso"` e `permalink: "/nuovo-corso/Nome/"`.
4. **CSS.** Ricompila Tailwind solo se hai usato classi nuove (vedi [Stile e CSS](#stile-e-css-tailwind)).
5. Per aggiungere una nuova icona, modifica `_includes/course-icon.html`.

La home mostra automaticamente una card per ogni corso in `_data/corsi.yml`, con il conteggio delle materie.

---

## Cambiare gli anni di un corso

Gli anni mostrati nella barra di navigazione di un corso dipendono dal campo `anni` in `_data/corsi.yml`:

```yaml
informatica:
  anni: ["1", "2", "3"]
computer-science:
  anni: ["1", "2"]
```

Il tab **Extra** compare sempre. Ogni anno elencato richiede il file `<corso>/<N>anno.html`: se **togli** un anno, elimina anche il file; se **aggiungi** un anno, crea il file copiando quello di un altro anno (cambiando `permalink` e `anno`).

---

## Il form "Aggiungi risorsa" (per i visitatori)

Nella pagina `/risorsa/` i visitatori compilano: titolo della risorsa, **corso**, anno, link e altre informazioni.

Essendo il sito statico non può salvare i dati da solo (la versione Next.js li scriveva su Notion tramite un server). Ci sono due modalità, scelte in `_config.yml`:

```yaml
risorsa:
  endpoint: ""                       # opzione 1
  github_repo: "utente/repository"   # opzione 2
```

1. **Endpoint esterno** (consigliato se vuoi ricevere le segnalazioni via email o in un database): crea un form su un servizio come [Formspree](https://formspree.io), copia l'URL (`https://formspree.io/f/xxxxxxx`) in `endpoint`. Il form invia un JSON con i campi `name`, `corso`, `anno`, `links`, `altro`.
2. **Issue GitHub** (se `endpoint` è vuoto): il form apre una nuova issue **precompilata** nel repository indicato in `github_repo`. Il visitatore deve avere un account GitHub e premere "Submit new issue".

Se entrambi sono vuoti il form mostra "Riprova più tardi!".

---

## Configurazione del sito

Tutto in `_config.yml`:

| Chiave | Significato |
|---|---|
| `title`, `description`, `lang` | Titolo, descrizione e lingua del sito |
| `url`, `baseurl` | Indirizzo del sito (vedi [Pubblicare](#pubblicare-su-github-pages)) |
| `og_image` | Immagine per le anteprime sui social |
| `author`, `author_url` | Testo "❤️‍🔥 da …" nel footer |
| `whatsapp_url`, `telegram_url` | Icone nel footer (vuoto `""` = nascoste) |
| `whiteboard_url` | Pulsante "Whiteboard" (vuoto = nascosto) |
| `donation_url` | Pulsante "Prendi una Moneta" e link del popup (vuoto = disattivato) |
| `analytics_script` | Script di analytics (vuoto = nessuno) |
| `adsense_account` | Meta tag Google AdSense (vuoto = nessuno) |
| `snow` | Neve da dicembre a febbraio |
| `advent_of_code` | Link "Advent Of Code" dall'1 al 25 dicembre |
| `risorsa.endpoint`, `risorsa.github_repo` | Destinazione del form (vedi sopra) |
| `legacy_notice` | Avviso con redirect se il sito viene aperto dal vecchio dominio (`enabled: false` di default) |

Dopo aver modificato `_config.yml` riavvia `jekyll serve`.

---

## Stile e CSS (Tailwind)

Il sito usa classi **Tailwind CSS** direttamente nei template. Il CSS finale è **già compilato** in `assets/css/main.css` e va committato, perché GitHub Pages non esegue Tailwind.

Se aggiungi o cambi classi Tailwind in `_layouts/`, `_includes/`, nelle pagine `.html` o in `assets/js/`, devi ricompilare:

```bash
npm install
npm run build:css        # una volta
npm run watch:css        # ricompila ad ogni modifica
```

In alternativa puoi usare il [binario standalone di Tailwind v3](https://github.com/tailwindlabs/tailwindcss/releases/tag/v3.4.17), senza installare Node:

```bash
./tailwindcss -c tailwind.config.js -i tailwind/input.css -o assets/css/main.css --minify
```

Se modifichi solo i contenuti (`_materie/`, `_data/`, `_config.yml`) **non serve** ricompilare.

Il tema chiaro/scuro segue le impostazioni del sistema operativo (`prefers-color-scheme`).

---

## Pubblicare su GitHub Pages

1. Crea il repository su GitHub e fai push di questa cartella sul branch `main`.
2. Vai su **Settings → Pages → Build and deployment → Source: Deploy from a branch**, branch `main`, cartella `/ (root)`.
3. Imposta `url` e `baseurl` in `_config.yml`:

| Caso | `url` | `baseurl` |
|---|---|---|
| Repository `utente/nome-repo` → `https://utente.github.io/nome-repo/` | `"https://utente.github.io"` | `"/nome-repo"` |
| Repository `utente/utente.github.io` | `"https://utente.github.io"` | `""` |
| Dominio personalizzato | `"https://tuo-dominio.it"` | `""` |

4. **Dominio personalizzato:** aggiungi nella radice del repository un file `CNAME` contenente solo il dominio (es. `informatica.palozz.com`) e configura il DNS come indicato da GitHub (Settings → Pages → Custom domain).

Ad ogni push il sito si ricostruisce da solo, in uno-due minuti.

---

## Vecchi URL e redirect

Il sito era in precedenza alla radice (`/2anno`, `/Matematica_discreta`, …). Con il plugin `jekyll-redirect-from` i vecchi indirizzi reindirizzano ai nuovi:

- `/2anno/`, `/3anno/`, `/extra/` → `/informatica/2anno/`, `/informatica/3anno/`, `/informatica/extra/`
- `/Nome_materia/` → `/informatica/Nome_materia/` (campo `redirect_from` nel front matter di ogni materia)

Per le nuove materie il campo `redirect_from` non serve.

---

## Risoluzione dei problemi

| Problema | Soluzione |
|---|---|
| `bundle install` fallisce con errori su `webrick` o versioni di Ruby | Verifica di usare Ruby 3.x; il `Gemfile` include già `webrick` |
| `cannot load such file -- webrick` | `bundle add webrick` |
| Il sito è senza stile su GitHub Pages | Controlla che `assets/css/main.css` sia committato e che `baseurl` sia corretto |
| Link e immagini rotti su `utente.github.io/repo` | Imposta `baseurl: "/repo"` in `_config.yml` |
| Una nuova classe Tailwind non ha effetto | Ricompila il CSS (`npm run build:css`) |
| Una materia non compare | Controlla `percorso`, `anno` (stringa tra virgolette) e che il file sia in `_materie/<corso>/` |
| Una materia compare nell'anno sbagliato | Verifica `anno: "2"` (non `2`) e `permalink` |
| Un tab degli anni porta a una pagina 404 | Manca il file `<corso>/<N>anno.html` per un anno elencato in `anni` |
| Le modifiche a `_config.yml` o `_data/` non si vedono | Riavvia `jekyll serve` |
| La materia nuova non è nella ricerca | La ricerca trova solo materie dello stesso corso, anni 1–3 |
| Il form non invia | Controlla `risorsa.endpoint` / `risorsa.github_repo` in `_config.yml` |

---

## Differenze rispetto alla versione Next.js

| Prima (Next.js) | Ora (Jekyll) |
|---|---|
| Dati in `src/dati/data.ts` | Un file per materia in `_materie/<corso>/` (i campi `extraName`/`extra`/`extraLink` sono uniti in `extra`) |
| Un solo corso, home = 1° anno | Home con scelta del corso (Informatica / Computer Science) |
| Pagina dinamica `[materia]` | Collection Jekyll con `permalink` per corso e redirect dal vecchio URL |
| Salvataggio su Notion (API route con segreti) | Endpoint esterno o issue GitHub precompilata |
| `react-snowfall` | Neve su `<canvas>` (`assets/js/snow.js`) |
| Manifest PWA generato da Next | `manifest.webmanifest` generato da Liquid |
| Popup di redirect dal vecchio dominio Netlify | Opzionale (`legacy_notice`), disattivato |
| `PWAText` (non usato nel layout) | Non portato |
| `next/font` | Google Fonts (Montserrat, VT323) |
