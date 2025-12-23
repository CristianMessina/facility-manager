
**FacilityManager** è un'applicazione web gestionale avanzata sviluppata con **Angular 21**, progettata per la gestione centralizzata di strutture immobiliari, spazi interni e servizi accessori. Il sistema offre un'esperienza utente fluida grazie all'utilizzo dei **Signals** per la gestione dello stato e un'interfaccia moderna, interamente responsive.

---

## Funzionalità Principali

### 1. Gestione Strutture (Catalogo)
* **Creazione Intelligente:** Inserimento di nuove strutture con suggerimento dell'indirizzo in tempo reale tramite integrazione con l'API di **OpenStreetMap (Nominatim)**.
* **Geocoding Automatico:** Conversione immediata dell'indirizzo selezionato in coordinate geografiche precise (`lat`, `lng`).
* **Visualizzazione Ottimizzata:** Le card nella dashboard mostrano un indirizzo sintetico (Via e Provincia) per massimizzare la leggibilità della griglia.
* **Descrizioni Modificabili:** Possibilità di aggiornare la descrizione di ogni struttura direttamente dalla vista di dettaglio con salvataggio istantaneo.

### 2. Dettaglio e Mappe
* **Mappe Interattive:** Integrazione con **Leaflet.js** per mostrare il posizionamento esatto della struttura sulla mappa.
* **Navigazione Intuitiva:** Sistema di navigazione con pulsante "Indietro" (freccia in alto a sinistra) e gestione dinamica dei parametri URL per il caricamento dei dati.

### 3. Gestione Servizi (Features) e Spazi
* **Database Servizi Globali:** Sezione dedicata per definire i servizi (Wi-Fi, AC, Parking, ecc.) associando icone dal set **Material Icons**.
* **Configurazione Spazi:** Gestione degli ambienti interni a ogni struttura, con definizione di capienza e selezione multipla dei servizi disponibili.
* **Sincronizzazione Reattiva:** L'eliminazione di un servizio globale attiva una pulizia automatica, rimuovendo il riferimento da tutti gli spazi che lo utilizzano.

### 4. Esperienza Utente (UX) e Feedback
* **Feedback Real-time:** Sistema di **Snackbar** cromatiche per confermare il successo delle operazioni o segnalare errori.
* **Sicurezza Operativa:** **Dialog di conferma** personalizzati (modali) che sostituiscono i nativi del browser per azioni critiche (es. eliminazione).
* **Loading State:** Spinner di caricamento globale per ogni operazione asincrona, garantendo trasparenza sullo stato dell'applicativo.
* **Responsive Design:** Layout adattivo per smartphone, tablet e desktop, con Sidenav a scomparsa (Menu Hamburger) per dispositivi mobili.

---

## Stack Tecnologico

* **Framework:** Angular 21.
* **State Management:** Angular **Signals** per una reattività granulare.
* **Pattern Architetturale:** **Facade Pattern** per la separazione delle responsabilità.
* **Styling:** SCSS modulare con architettura a file separati.
* **Database Mock:** `angular-in-memory-web-api` per la simulazione di un backend REST.
* **Mappe & Geocoding:** Leaflet.js e Nominatim API (OpenStreetMap).


---

## Installazione e Sviluppo

Segui questi passaggi per configurare l'ambiente locale:

1. **Clona il repository:**

```bash
git clone [https://github.com/tuo-username/facility-manager.git](https://github.com/tuo-username/facility-manager.git)
cd facility-manager

```


2. **Installa le dipendenze:**
Assicurati di avere Node.js e npm installati.

```bash
npm install
```


3. **Configurazione Assets:**
Assicurati che nel file `src/index.html` siano presenti i link per i font e gli stili esterni necessari:

```html
<link href="[https://fonts.googleapis.com/icon?family=Material+Icons](https://fonts.googleapis.com/icon?family=Material+Icons)" rel="stylesheet">
<link rel="stylesheet" href="[https://unpkg.com/leaflet@1.9.4/dist/leaflet.css](https://unpkg.com/leaflet@1.9.4/dist/leaflet.css)" />

```


4. **Avvia l'applicazione in modalità sviluppo:**

```bash
ng serve 
```


Naviga su `http://localhost:4200`. Il server si aggiornerà automaticamente ad ogni modifica dei file.

---