# TDD töövoog - juhised

## Feature-haru töövoog

Iga funktsionaalsus arendatakse eraldi feature-harus järgmiselt:

### 1. Loo feature-haru

```bash
git checkout -b feature/<funktsiooni-nimi>
```

Näiteks:
```bash
git checkout -b feature/laenuta-eksemplar
```

### 2. RED - kirjuta test, mis feilib

Kirjuta test, mis testib soovitud käitumist. Test peab esmalt **feilima**.

```bash
# Kirjuta test
# ... testi kood ...

git add tests/
git commit -m "red: <kirjelda käitumist>"
```

Näide:
```bash
git commit -m "red: annab laenutada kui eksemplar on saadaval"
```

### 3. GREEN - kirjuta minimaalne kood, et test läbiks

Kirjuta minimaalne kood, et test läbiks.

```bash
# Kirjuta rakenduskood
# ... rakenduse kood ...

git add src/
git commit -m "green: <kirjelda käitumist>"
```

Näide:
```bash
git commit -m "green: annab laenutada kui eksemplar on saadaval"
```

### 4. REFACTOR - puhasta kood, testid jäävad roheliseks

Paranda koodi kvaliteeti, refaktoreeri. Testid peavad jääma roheliseks.

```bash
# Refaktoreeri
# ... refaktoreeritud kood ...

git add src/
git commit -m "refactor: <lühikirjeldus>"
```

Näide:
```bash
git commit -m "refactor: eralda laenutamise loogika teenusesse"
```

### 5. Merge main'i

Tagasi main haru ja merge feature-haru **merge-commit'iga** (mitte squash!).

```bash
git checkout main
git merge --no-ff feature/<funktsiooni-nimi> -m "Merge feature/<funktsiooni-nimi>"
```

**OLULINE**: 
- Ära kasuta `--squash`!
- Ära kustuta feature-haru pärast merge'i!
- Feature-harud peavad jääma ajalukku, et näha TDD protsessi.

### 6. Korda F2, F3

Korda sama protsessi iga funktsiooni jaoks.

## Näide: täielik töövoog

```bash
# F1: Laenuta eksemplar
git checkout -b feature/laenuta-eksemplar

# RED
# ... kirjuta test ...
git add tests/
git commit -m "red: annab laenutada kui eksemplar on saadaval"

# GREEN
# ... kirjuta kood ...
git add src/ prisma/
git commit -m "green: annab laenutada kui eksemplar on saadaval"

# REFACTOR
# ... refaktoreeri ...
git add src/
git commit -m "refactor: eralda laenutamise loogika"

# Merge
git checkout main
git merge --no-ff feature/laenuta-eksemplar -m "Merge feature/laenuta-eksemplar"

# F2: Tagasta eksemplar
git checkout -b feature/tagasta-eksemplar
# ... jne ...
```

## Git-ajaloo näidis

Pärast kõiki funktsioone peaks git log nägema välja umbes nii:

```
*   Merge feature/tagasta-eksemplar
|\
| * refactor: eralda tagastamise loogika
| * green: tagastab eksemplari ja muudab staatust
| * red: tagastab eksemplari kui laenutamine on aktiivne
|/
*   Merge feature/laenuta-eksemplar
|\
| * refactor: eralda laenutamise loogika
| * green: annab laenutada kui eksemplar on saadaval
| * red: annab laenutada kui eksemplar on saadaval
|/
* chore: initial project setup
```

## Testide struktuur

Iga test peab:
- Testima ühte reeglit/üksust
- Kasutama mocke ainult välistest sõltuvustest (DB, kellaaeg, HTTP kliendid)
- Olema deterministlik (fikseeri kellaaeg ja ID-d)
- Nimetama: `peab <käitumine> kui <tingimus>`

Näide:
```javascript
describe('Laenutamise teenus', () => {
  it('peab lubama laenutada kui eksemplar on saadaval', () => {
    // test
  });
  
  it('peab keelama laenutada kui eksemplar on väljas', () => {
    // test
  });
});
```

