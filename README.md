# Testjuhtitud arendus (TDD) projekt

TDD projekt ORM ja mockidega - ÕV4, ÕV5, ÕV6 harjutus.

## Domeen

**Fitness koolitusregistreerimise süsteem**

Süsteem võimaldab õpilastel registreeruda fitness trennidele, tühistada registreerimisi ja arvutada hilinemistasu.

### Funktsionaalsused

#### F1: Registreeri õpilane trenni
**Domeenireegel**: "Ühte trenni saab registreerida ainult kui vabu kohti on."

- Testid:
  - "peab lubama registreerida kui vabu kohti on"
  - "peab keelama registreerida kui kohti pole"

#### F2: Tühista registreerimine
**Domeenireegel**: "Tühistamisel muutub staatus CANCELLED ja aktiivne registreerimine suletakse."

- Testid:
  - "peab lubama tühistada aktiivse registreerimise"
  - "peab muutma registreerimise staatust CANCELLED"
  - "peab lubama uue registreerimise pärast tühistamist"

#### F3: Arvuta hilinemistasu
**Domeenireegel**: "Kui õpilane tühistab hiljem kui 24h enne trenni, arvuta hilinemistasu 5 eurot tunnis."

- Testid:
  - "peab arvutama hilinemistasu kui tühistatakse hiljem kui 24h enne trenni"
  - "peab mitte arvutama hilinemistasu kui tühistatakse varem kui 24h enne trenni"
  - "peab tagastama 0 kui registreerimine pole tühistatud"

### ORM mudelid

- `Training` - trenn (id, nimi, maxCapacity, startTime)
- `Student` - õpilane (id, nimi, email)
- `Registration` - registreerimine (id, trainingId, studentId, status, createdAt, cancelledAt)

### Mockid

- `DateService` - kellaaja mockimine testides determinismiks

## Tehniline raam

- **Keele- ja raamistik**: Node.js + Jest + Prisma
- **Andmebaas**: SQLite (kohalikuks deviks)
- **Migratsioonid**: Prisma Migrate

## Seadistus

### Eeltingimused

- Node.js (v18 või uuem)
- npm või yarn

### Paigaldus

1. Paigalda sõltuvused:
```bash
npm install
```

1. Kopeeri `.env.example` failiks `.env`:
```bash
cp .env.example .env
```

1. Käivita migratsioonid:
```bash
npm run migrate:dev
```

1. (Valikuline) Täida andmebaas algandmetega:
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

