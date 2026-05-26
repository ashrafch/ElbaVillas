# Asset Guide

Guida pratica per sostituire i placeholder con materiali reali del cliente.

## Priorita Materiali

1. Hero still o video drone panoramico.
2. Una immagine principale per ogni villa.
3. Gallery esterni e viste.
4. Dettagli materiali e architettura.
5. Interni o render.
6. Planimetrie tecniche.
7. Video drone finale.

## Formati Consigliati

- Foto/render: `.jpg` o `.webp`
- Grafiche trasparenti: `.png`
- Planimetrie: `.webp`, `.jpg` o `.pdf` se destinate a download futuro
- Video hero/drone: `.mp4`, massimo 15-25 MB per web preview

## Dimensioni Consigliate

```txt
Hero:              2400 x 1400 px
Villa card:        1400 x 1800 px
Gallery landscape: 1800 x 1200 px
Gallery portrait:  1400 x 1800 px
Material detail:   1400 x 1400 px
OG image:          1200 x 630 px
```

## Percorsi Attuali

```txt
public/images/hero/elba-villas-hero.svg
public/images/villas/villa-azzurra.svg
public/images/villas/villa-ginestra.svg
public/images/villas/villa-maestrale.svg
public/images/villas/villa-tramonto.svg
public/images/gallery/
public/images/architecture/
public/images/location/
public/videos/drone-elba-placeholder.mp4
```

Puoi mantenere gli stessi nomi e cambiare estensione aggiornando i riferimenti in:

```txt
lib/villas.ts
lib/gallery.ts
components/sections/HeroSection.tsx
components/sections/DroneVideoSection.tsx
components/sections/ArchitectureSection.tsx
components/sections/LifestyleSection.tsx
```

## Naming

Usa nomi descrittivi, minuscoli e senza spazi:

```txt
villa-azzurra-piscina.webp
elba-coastline-drone.webp
stone-detail-local.webp
plan-villa-ginestra.webp
```

## Checklist Prima Di Pubblicare Asset Reali

- Controllare ritagli su mobile.
- Verificare peso file.
- Aggiornare alt text.
- Verificare colori e leggibilita testo su hero.
- Aggiornare OpenGraph se cambia identita visuale.
- Testare build e sito live.
