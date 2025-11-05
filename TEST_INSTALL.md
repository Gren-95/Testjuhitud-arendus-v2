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

### ❌ Error: "Environment variable not found: DATABASE_URL"

**Lahendus**: `.env` fail puudub või on vale.

```bash
# Kopeeri .env.example failiks .env
cp .env.example .env

# Kontrolli, et DATABASE_URL on seadistatud
cat .env
```

### ❌ Error: "Prisma Client puudub"

**Lahendus**: Käivita Prisma Client genereerimine.

```bash
npm run db:generate
```

### ❌ Error: "Migratsioonid ei tööta"

**Lahendus**: Veendu, et `.env` fail on olemas ja `DATABASE_URL` on õige.

```bash
# Kontrolli .env faili
cat .env

# Käivita migratsioonid uuesti
npm run migrate:dev
```

### ❌ Error: "Testid ei käivitu"

**Lahendus**: Veendu, et kõik sõltuvused on paigaldatud.

```bash
# Paigalda sõltuvused uuesti
npm install

# Kontrolli, et node_modules on olemas
ls node_modules
```

