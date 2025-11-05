# Testjuhtitud arendus (TDD) projekt

TDD projekt ORM ja mockidega - ÕV4, ÕV5, ÕV6 harjutus.

## Domeen

TODO: kirjeldada valitud domeen ja 3 funktsionaalsust.

## Tehniline raam

- **Keele- ja raamistik**: Node.js + Jest + Prisma
- **Andmebaas**: SQLite (kohalikuks deviks)
- **Migratsioonid**: Prisma Migrate

## Seadistus

### Eeltingimused

- Node.js (v18 või uuem)
- npm või yarn

### Paigaldus

1. Klooni repo:
```bash
git clone <repo-url>
cd testjuhitud-arendus
```

2. Paigalda sõltuvused:
```bash
npm install
```

3. Kopeeri `.env.example` failiks `.env`:
```bash
cp .env.example .env
```

4. Käivita migratsioonid:
```bash
npm run migrate:dev
```

5. (Valikuline) Täida andmebaas algandmetega:
```bash
npm run db:seed
```

## Käivitamine

### Arendusrežiim
```bash
npm run dev
```

### Testide käivitamine
```bash
npm test
```

### Testid jälgimise režiimis
```bash
npm run test:watch
```

### Testide kattuvuse raport
```bash
npm run test:coverage
```

### Andmebaasi haldus
```bash
# Uue migratsiooni loomine
npm run migrate:dev

# Migratsioonide käivitamine (production)
npm run migrate:deploy

# Andmebaasi vaatamine
npm run db:studio
```

## TDD töövoog

Iga funktsionaalsus arendatakse eraldi feature-harus TDD tsüklis:

1. **Red**: `git commit -m "red: <käitumine>"` - ainult testid, mis feilivad
2. **Green**: `git commit -m "green: <käitumine>"` - minimaalne kood, et testid läbivad
3. **Refactor**: `git commit -m "refactor: <lühikirjeldus>"` - koodi puhastus, testid jäävad roheliseks
4. **Merge**: merge main'i merge-commit'iga (mitte squash)

## Struktuur

```
.
├── src/              # Rakenduskood
├── tests/            # Testid
├── prisma/           # Prisma skeem ja migratsioonid
├── .github/          # CI/CD konfiguratsioon
└── README.md
```

## Git-ajalugu

Feature-harusid ei kustutata. Git-ajalugu peegeldab TDD protsessi:
- `feature/<f1>` - esimene funktsionaalsus
- `feature/<f2>` - teine funktsionaalsus
- `feature/<f3>` - kolmas funktsionaalsus

## Kriteeriumid

- ✅ TDD distsipliin: red → green → refactor
- ✅ ORM praktikad: migratsioonid, seosed, võtmed
- ✅ Ühiktestid: mockid välistest sõltuvustest
- ✅ Git-protsess: feature-harud, merge-commit'id
- ✅ Dokumentatsioon ja setup

