# Geonorge.Kartkatalog.React

[![Build Status](https://github.com/kartverket/Geonorge.Kartkatalog.React/actions/workflows/build.yaml/badge.svg)](https://github.com/kartverket/Geonorge.Kartkatalog.React/actions)

Kartkatalogen er en tjeneste for å søke i og vise metadata registrert i GeoNetwork.

## Kom i gang

### Forutsetninger

- Node.js 20+
- Yarn 1.22+

### Oppsett

1. Klon repoet:
   ```bash
   git clone git@github.com:kartverket/Geonorge.Kartkatalog.React.git
   cd Geonorge.Kartkatalog.React
   ```

2. Installer avhengigheter:
   ```bash
   yarn install
   ```

3. Konfigurer miljøvariabler — kopier `default.env` til `.env` og fyll inn riktige verdier:
   ```bash
   cp default.env .env
   ```
   Se `default.env` for en fullstendig liste over tilgjengelige variabler.

4. Start utviklingsserveren:
   ```bash
   yarn dev
   ```
   Appen er tilgjengelig på [http://localhost:5173](http://localhost:5173).

### Docker Compose

For å kjøre appen lokalt:

```bash
docker-compose up
```

## Scripts

| Kommando | Beskrivelse |
|---|---|
| `yarn dev` | Start utviklingsserver med HMR på `localhost:5173` |
| `yarn build` | Produksjonsbygg til `dist/` |
| `yarn preview` | Forhåndsvis produksjonsbygget lokalt |
| `yarn test` | Kjør alle tester én gang |
| `yarn test:watch` | Kjør tester i watch-modus |
| `yarn test:status` | Kjør tester med dekningsrapport |
| `yarn test:update` | Oppdater Jest-snapshots |

## Testing

Prosjektet bruker [Jest](https://jestjs.io/) for enhetstesting. Testene er i hovedsak konsentrert rundt Redux-reducere.

```bash
yarn test
```
