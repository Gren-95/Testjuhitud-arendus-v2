# Testimise juhised - kloonimine nullist

See dokument kirjeldab, kuidas testida, kas projekt töötab pärast kloonimist GitHub'ist.

## Sammud

1. **Klooni repo:**
```bash
git clone https://github.com/Gren-95/Testjuhitud-arendus-v2.git
cd Testjuhitud-arendus-v2
```

2. **Paigalda sõltuvused:**
```bash
npm install
```

3. **Kopeeri .env.example failiks .env:**
```bash
cp .env.example .env
```

4. **Käivita migratsioonid:**
```bash
npm run migrate:dev
```

5. **Käivita testid:**
```bash
npm test
```

6. **Kontrolli kattuvust:**
```bash
npm run test:coverage
```

## Oodatud tulemused

- ✅ Kõik testid läbivad (14 testi)
- ✅ Kattuvus ≥70% (praegu 95.65%)
- ✅ Migratsioonid töötavad
- ✅ Andmebaas luuakse automaatselt

## Võimalikud probleemid

- **Prisma Client puudub**: Käivita `npm run db:generate`
- **Migratsioonid ei tööta**: Veendu, et `.env` fail on olemas ja `DATABASE_URL` on õige
- **Testid ei käivitu**: Veendu, et `npm install` on edukalt lõppenud

