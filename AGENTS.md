# Guida per assistenti AI

Contesto rapido per chi (umano o AI) modifica questo repository. Per i dettagli completi vedi `README.md`.

## Cos'è

Sito statico per gli studenti UNICAM (https://informatica.palozz.com) che raccoglie, per ogni corso di laurea e anno, le materie con materiale didattico, registrazioni, prove passate e appunti.

- **Jekyll + Liquid**, pubblicato con **GitHub Pages** (dominio in `CNAME`). Un push su `main` va online.
- Nessun framework JS: comportamento in JavaScript vanilla (`assets/js/`), stile Tailwind **precompilato** in `assets/css/main.css`.
- Contenuti e interfaccia sono **in italiano**.

## Mappa del repository

| Percorso | Cosa contiene |
|---|---|
| `_config.yml` | Configurazione del sito, link social, funzioni opzionali, collection `materie` |
| `_data/corsi.yml` | Corsi di laurea (slug, nome, descrizione, icona, anni attivi) |
| `_data/assistente.yml` | Bit, l'assistente: FAQ, suggerimenti, alias delle materie (sigle come "SO", "asd") |
| `_materie/<slug>/*.md` | **Una materia per file**, solo front matter. È qui che avviene quasi ogni modifica |
| `<slug>/1anno.html`, `2anno.html`, …, `extra.html` | Pagine elenco per anno (layout `anno`), una per ogni anno in `corsi.yml` |
| `prove/*.md` | Pagine "Prove passate" (layout `prove`) |
| `assets/prove/<materia>/` | PDF e immagini delle prove passate |
| `_layouts/` | `default`, `home`, `anno`, `materia`, `prove` |
| `_includes/` | Componenti (card, cardgrid, hero, navbar, footer…) |
| `assets/js/` | `main.js` (ricerca, "aggiornato X giorni fa", popup), `assistente.js` (Bit, l'assistente), `live-users.js`, `snow.js`, `invader.js` (easter egg), `donation.js` |
| `tailwind/input.css`, `tailwind.config.js` | Sorgenti del CSS |

Slug dei corsi attuali: `informatica` (anni 1–3) e `computer-science` (anni 1–2).

## Aggiungere o modificare una materia

Crea `_materie/<slug>/<Nome_Materia>.md` (nome file con underscore, lo stesso usato nel `permalink`). Il file contiene solo front matter:

```yaml
---
title: "Machine Learning"
permalink: "/computer-science/Machine_Learning/"   # /<slug>/<Nome_File>/
percorso: "computer-science"                       # slug del corso, deve esistere in _data/corsi.yml
ordine: 1                                          # ordinamento nelle griglie (crescente)
anno: "1"                                          # "1" | "2" | "3" | "extra"
semestre: "1"                                      # "1" | "2" | "extra" (mostrato come badge "N° Semestre")
aggiornamento: "2026-10-25"                        # YYYY-MM-DD; se è oggi la card mostra il pallino "nuovo"
immagine: "https://art.pixilart.com/xxxx.png"      # immagine della card (di solito pixilart)
corso: ["Artificial Intelligence"]                 # badge sotto il titolo della card (etichette libere)
descrizione: "Testo descrittivo..."
webex: "https://unicam.webex.com/meet/nome.cognome" # per gli extra è il link alla risorsa
materiale:                                          # facoltativo
  url: "https://elearning.unicam.it/course/view.php?id=..."
  label: "Moodle"
registrazioni:                                      # facoltativo
  url: "https://elearning.unicam.it/course/view.php?id=..."
  label: "Moodle"
prove:                                              # facoltativo
  url: "/<slug>/<Nome_File>/prove/"
  label: "Repo"
extra:                                              # facoltativo: risorse nel pulsante "altro"
  - nome: "Appunti"
    label: "Notion"
    url: "https://..."
redirect_from: ["/vecchio-url/"]                    # facoltativo, solo per vecchi URL
---
```

Convenzioni:
- I campi facoltativi senza valore si **omettono** (non lasciarli vuoti): la riga corrispondente non viene mostrata.
- Label ricorrenti: `Moodle` per elearning.unicam.it, `Classroom`, `Notion`, `Amazon` (libri), `pdf`, `Webex`.
- Le materie con `anno: "extra"` usano anche `semestre: "extra"` e mostrano solo il pulsante "Visualizza Risorsa" (`webex`).
- Quando modifichi una materia aggiorna `aggiornamento` con la data di oggi.
- Se aggiungi una materia con una sigla o un soprannome comune, aggiungilo anche in `alias:` di `_data/assistente.yml`, così Bit la riconosce.
- Usa la sintassi YAML a blocchi come nei file esistenti e virgolette doppie per le stringhe.

## Prove passate

1. Metti i file in `assets/prove/<nome-materia>/`.
2. Crea `prove/<nome-materia>.md` con `layout: prove`, `permalink: /<slug>/<Nome_File>/prove/`, `torna:` (URL della materia) e la lista `prove:` di `{ nome, label, url }` (vedi `prove/algoritmi.md`).
3. Nella materia aggiungi il blocco `prove:` con `url: "/<slug>/<Nome_File>/prove/"` e `label: "Repo"`.

## Aggiungere un corso o cambiare gli anni

Nuova voce in `_data/corsi.yml` + cartella `<slug>/` con `1anno.html` … e `extra.html` (copia quelle di `computer-science/` cambiando `percorso` e `permalink`) + cartella `_materie/<slug>/`. Se aggiungi una nuova cartella di pagine, aggiungila anche a `content` in `tailwind.config.js`. Ogni anno in `anni` deve avere la sua pagina e viceversa.

## CSS (Tailwind)

`assets/css/main.css` è generato e **committato** (GitHub Pages non esegue Node). Se usi classi Tailwind nuove in layout, include o JS:

```bash
npm install
npm run build:css   # oppure npm run watch:css durante lo sviluppo
```

e committa anche `assets/css/main.css`. Le sole modifiche ai file in `_materie/` non richiedono di ricompilare il CSS.

## Sviluppo in locale

```bash
bundle install
bundle exec jekyll serve   # http://localhost:4000
```

Se Jekyll non è disponibile, verifica almeno che il front matter sia YAML valido, ad esempio:
`ruby -ryaml -e 'p YAML.load_file(ARGV[0])' _materie/<slug>/<File>.md`

## Cose da non fare

- Non modificare a mano `assets/css/main.css` (viene sovrascritto dalla build).
- Non committare `_site/`, `node_modules/`, `vendor/`, `Gemfile.lock` (sono in `.gitignore`).
- Non cambiare `permalink` di materie esistenti senza aggiungere il vecchio URL in `redirect_from`.
- Non toccare le credenziali/configurazioni in `_config.yml` (TURN, AdSense, analytics) se non richiesto.
- Non inventare link (Webex, Moodle, prove): se un dato manca, ometti il campo.

## Commit

Messaggi brevi in italiano, al presente, che descrivono la modifica (es. "Aggiungi corso Machine Learning (Computer Science, 1° anno, 1° semestre)").
