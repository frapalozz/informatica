# Repository del Corso di Laurea in Informatica

Benvenuto nel repository collaborativo per il corso di laurea in Informatica!
Questo progetto raccoglie e organizza risorse didattiche, materiali, registrazioni e prove d'esame per gli studenti del corso.
## 🌐 Sito web
Il contenuto di questo repository è pubblicato come sito web all'indirizzo:
https://informatica.palozz.com
## 📁 Struttura del repository
- `index.md`: pagina principale con l'elenco completo dei corsi divisi per anno
- `/1anno/`, `/2anno/`, `/3anno/`: cartelle contenenti i file delle singole materie
- Ogni materia è un file Markdown (.md) con una struttura standard:
  - Materiale didattico (link a Drive, slide, dispense)
  - Registrazioni (link a wiki, video, piattaforme)
  - Prove passate (link a repository, obsidian, pdf)
  - Altre risorse esterne (libri, articoli, corsi consigliati)

## 📂 Struttura delle risorse per materie

Per organizzare meglio i file locali (come prove passate, esercizi, appunti), è possibile creare una struttura di cartelle così organizzata:
text

```
/2anno/
├── /assets/
│   └── /algoritmi/
│       ├── /prove-passate/
│       │   ├── prova-2023-01.pdf
│       │   ├── prova-2023-02.pdf
│       │   └── prova-2024-01.pdf
│       ├── /esercizi/
│       │   ├── esercizi-svolti-1.pdf
│       │   └── soluzioni.md
│       └── /appunti/
│           └── appunti-completi.pdf
```

## 🤝 Come contribuire

> [!WARNING] 
> Quando viene inserito un link a un pdf inserire il tag `{:download}` per evitare di aprire la finestra di stampa su firefox
>
> Ad esempio:
> ```
> - [test](prova.pdf){:download}
> ```

Puoi contribuire in diversi modi:
### 1. Aggiungere nuove risorse a una materia esistente
- Modifica il file della materia nella cartella corrispondente (es. /3anno/funzionale.md)
- Segui la struttura esistente:
  - Lista puntata con link descrittivo
  - Sezione principale (materiale, registrazioni, prove passate)
  - Sezione "Risorse aggiuntive" dopo il separatore `---`

### 2. Correggere link non funzionanti o informazioni obsolete
- Cerca il file della materia
- Modifica il link o il testo corretto
- Assicurati che il formato Markdown sia valido

### 3. Aggiungere una nuova materia
1. Crea un nuovo file \[nome-materia\].md nella cartella dell'anno corrispondente
2. Usa come template la struttura degli altri file come ad esempio `funzionale.md`
4. Aggiungi il collegamento in index.md nella sezione dell'anno giusto
5. Mantieni lo stile coerente con le altre voci

### 4. Segnalare errori o suggerire miglioramenti
- Apri una Issue su GitHub descrivendo il problema o l'idea

## 🔧 Processo di contribuzione
1. Fork del repository
2. Clona la tua fork localmente
3. Crea un branch per la tua modifica
4. Apporta le modifiche e commit con messaggio descrittivo
5. Push sul tuo repository
6. Apri una Pull Request verso questo repository principale

## ✅ Linee guida
- Usa link diretti e pubblicamente accessibili (evita link privati o a pagamento)
- Verifica che i link siano funzionanti
- Segui lo stile esistente per uniformità
- Le risorse devono essere pertinenti al corso universitario

## 📄 Licenza
Il codice di questo repository (struttura, template, script) è rilasciato sotto licenza MIT.
I contenuti didattici collegati (slide, registrazioni, appunti) rimangono di proprietà dei rispettivi autori e sono condivisi solo a scopo didattico.

---
Grazie per il tuo contributo! ❤️
