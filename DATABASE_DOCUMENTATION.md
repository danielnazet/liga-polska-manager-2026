# 📊 Dokumentacja Bazy Danych IV Ligi - Przewodnik Dewelopera

## 🎯 Cel Projektu

System zarządzania danymi IV Ligi (V poziom rozgrywkowy) w Polsce na sezon 2026/2027. Baza zawiera:
- **500+ klubów** z 16 wojewódzkich lig rejonowych
- **12,000+ zawodników** z danymi osobowymi i kontraktowymi
- **2,000+ meczów** w pełnym cyklu rozgrywek
- **Kompletne statystyki** graczy i drużyn
- **Historię kartek i bramek** z szczegółami

---

## 📋 Tabele i Ich Powiązania

### 1. **wojewodztwa** 
Wojewódzkie Związki Piłki Nożnej

```sql
SELECT * FROM wojewodztwa;
```

**Pola:**
- `wojewodztwo_id` - Kod województwa (np. WOJ_MAZ)
- `nazwa_wojewodztwa` - Pełna nazwa (np. Mazowieckie)
- `liczba_grup` - Ilość lig rejonowych
- `nazwa_zwiazku` - Nazwa WZPN

**Relacje:**
- ← 1:N `ligi_rejonowe`
- ← 1:N `kluby`

---

### 2. **ligi_rejonowe**
Ligowy V poziomu dla danego województwa

```sql
SELECT * FROM ligi_rejonowe WHERE wojewodztwo_id = (
  SELECT id FROM wojewodztwa WHERE wojewodztwo_id = 'WOJ_MAZ'
);
```

**Pola:**
- `liga_id` - Unikalny identyfikator (IV_MAZ_1)
- `numer_grupy` - Numer grupy w województwie
- `liczba_klubow` - Ilość uczestniczących klubów
- `sezon` - Sezon (2026/2027)

**Relacje:**
- → wojewodztwa
- ← 1:N `kluby`
- ← 1:N `mecze`
- ← 1:N `klasyfikacja_sezonu`

---

### 3. **kluby**
Kluby piłkarskie uczestniczące w IV Lidze

```sql
SELECT k.* FROM kluby k
JOIN ligi_rejonowe lr ON k.liga_id = lr.id
WHERE lr.liga_id = 'IV_MAZ_1'
ORDER BY k.nazwa_klubu;
```

**Pola:**
- `klub_id` - Unikalny identyfikator (K5_MAZ_001)
- `nazwa_klubu` - Pełna nazwa klubu
- `miejscowosc` - Miasto siedziby
- `stadion_nazwa`, `stadion_pojemnosc` - Dane stadionu
- `status` - Aktywny/Zawieszony/Wypadł
- `liczba_zawodnikow` - Automatycznie obliczana

**Relacje:**
- → wojewodztwa
- → ligi_rejonowe
- ← 1:N `zawodnicy` (jeden klub ma wielu zawodników)
- ← 1:N `trenery`
- ← 1:M `mecze` (jako gospoda lub gość)
- ← 1:1 `statystyki_klubow`
- ← 1:N `klasyfikacja_sezonu`

**Indeksy:**
- klub_id (UNIQUE)
- liga_kluby
- miejscowosc
- status_klubu

---

### 4. **pozycje**
Słownik pozycji piłkarskich

```sql
SELECT * FROM pozycje;
-- BR, OBR, POM, NAP, LBR, PBR, LPA, PPA, SPL, SPR
```

**Pola:**
- `pozycja_kod` - Kod (BR, OBR, etc.)
- `nazwa_pozycji` - Pełna nazwa
- `skrot` - 3-literowy skrót

**Relacje:**
- ← 1:N `zawodnicy`

---

### 5. **zawodnicy**
Zawodnicy piłki nożnej

```sql
-- Wszyscy zawodnicy klubu
SELECT z.*, p.nazwa_pozycji, k.nazwa_klubu
FROM zawodnicy z
JOIN pozycje p ON z.pozycja_id = p.id
JOIN kluby k ON z.klub_id = k.id
WHERE k.klub_id = 'K5_MAZ_001';

-- Wszyscy napastnicy w lidze
SELECT z.*, k.nazwa_klubu
FROM zawodnicy z
JOIN pozycje p ON z.pozycja_id = p.id
JOIN kluby k ON z.klub_id = k.id
WHERE p.pozycja_kod = 'NAP';
```

**Pola:**
- `zawodnik_id` - Unikalny identyfikator (PL_000001)
- `imie`, `nazwisko` - Dane osobiste
- `data_urodzenia` - Data urodzenia
- `numer_koszulki` - Numer na koszulce (1-99)
- `pozycja_id` - Pozycja na polu
- `noga_preferowana` - Prawy/Lewy/Obie
- `kontrakt_do` - Data końca kontraktu
- `status_kontraktu` - Aktywny/Zawieszony/Skończony

**Relacje:**
- → kluby
- → pozycje
- ← 1:N `bramki` (jako strzelec)
- ← 1:N `bramki` (jako asystent)
- ← 1:N `kartki`
- ← 1:1 `statystyki_zawodnikow`

**Indeksy:**
- zawodnik_id (UNIQUE)
- klub_zawodnicy
- pozycja_zawodnicy
- zawodnik_nazwisko
- status_kontraktu

**Constraints:**
```sql
CHECK (EXTRACT(YEAR FROM AGE(data_urodzenia)) >= 16) -- Min 16 lat
CHECK (numer_koszulki >= 1 AND numer_koszulki <= 99)
```

---

### 6. **trenery**
Trenerzy i sztab szkoleniowy

```sql
-- Trenerzy główni wszystkich klubów
SELECT t.*, k.nazwa_klubu
FROM trenery t
JOIN kluby k ON t.klub_id = k.id
WHERE t.stanowisko = 'Trener Główny';

-- Sztab klubu
SELECT * FROM trenery WHERE klub_id = (
  SELECT id FROM kluby WHERE klub_id = 'K5_MAZ_001'
);
```

**Pola:**
- `trener_id` - Unikalny identyfikator
- `imie`, `nazwisko` - Dane osobiste
- `stanowisko` - Trener Główny/Asystent/Bramkarz
- `liczba_lat_doswiadczenia` - Lat doświadczenia
- `kontrakt_do` - Data końca kontraktu

**Relacje:**
- → kluby

---

### 7. **mecze**
Mecze ligowe

```sql
-- Mecze klubu (gospoda i gość)
SELECT m.*, 
  k1.nazwa_klubu as gospodarz,
  k2.nazwa_klubu as gosc
FROM mecze m
JOIN kluby k1 ON m.klub_gospodarzy = k1.id
JOIN kluby k2 ON m.klub_gosci = k2.id
WHERE m.klub_gospodarzy = (SELECT id FROM kluby WHERE klub_id = 'K5_MAZ_001')
  OR m.klub_gosci = (SELECT id FROM kluby WHERE klub_id = 'K5_MAZ_001')
ORDER BY m.data_meczu;

-- Wszystkie mecze w turze (np. 1 tura)
SELECT * FROM mecze 
WHERE liga_id = (SELECT id FROM ligi_rejonowe WHERE liga_id = 'IV_MAZ_1')
  AND data_meczu BETWEEN '2026-08-15' AND '2026-08-31'
ORDER BY data_meczu, godzina_meczu;
```

**Pola:**
- `mecz_id` - Unikalny identyfikator
- `data_meczu` - Data meczu
- `klub_gospodarzy`, `klub_gosci` - Powiązania do klubów
- `wynik_gospodarzy`, `wynik_gosci` - Wynik (NULL jeśli niezakończony)
- `liczba_widzow` - Frekwencja
- `status` - Zaplanowany/Zakończony/Przełożony/Anulowany

**Relacje:**
- → ligi_rejonowe
- → kluby (gospodarz)
- → kluby (gość)
- ← 1:N `bramki`
- ← 1:N `kartki`

**Indeksy:**
- mecz_id (UNIQUE)
- data_meczu
- liga_mecze
- druzyny_mecz
- status_meczu

**Constraints:**
```sql
CHECK (data_meczu >= '2026-08-01' AND data_meczu <= '2027-06-30')
CHECK (wynik_gospodarzy >= 0 AND wynik_gosci >= 0 OR wynik_gospodarzy IS NULL)
```

---

### 8. **bramki**
Zdobyte bramki w meczach

```sql
-- Bramki z meczu
SELECT b.*, z.imie, z.nazwisko, k.nazwa_klubu
FROM bramki b
JOIN zawodnicy z ON b.zawodnik_id = z.id
JOIN kluby k ON b.klub_strzelca = k.id
WHERE b.mecz_id = 1
ORDER BY b.minuta_bramki;

-- Asysty zawodnika
SELECT b.* FROM bramki b
WHERE b.asystent_id = (SELECT id FROM zawodnicy WHERE zawodnik_id = 'PL_000006');
```

**Pola:**
- `bramka_id` - Unikalny identyfikator
- `mecz_id` - Powiązanie do meczu
- `zawodnik_id` - Strzelec bramki
- `klub_strzelca` - Klub, który strzelił
- `minuta_bramki` - Minuta (1-120)
- `typ_bramki` - Zgrywka/Strzał/Rzut rożny
- `asystent_id` - Zawodnik asysty (opcjonalnie)

**Relacje:**
- → mecze
- → zawodnicy (strzelec)
- → zawodnicy (asystent)
- → kluby (strzelca)

**Constraints:**
```sql
CHECK (minuta_bramki >= 1 AND minuta_bramki <= 120)
```

---

### 9. **kartki**
Żółte i czerwone kartki

```sql
-- Wszystkie kartki zawodnika
SELECT k.*, m.data_meczu, z.imie, z.nazwisko
FROM kartki k
JOIN zawodnicy z ON k.zawodnik_id = z.id
JOIN mecze m ON k.mecz_id = m.id
WHERE z.zawodnik_id = 'PL_000002'
ORDER BY m.data_meczu;

-- Zawodnicy z 2+ żółtymi kartkami (ryziko zawieszenia)
SELECT z.zawodnik_id, z.imie, z.nazwisko, COUNT(*) as liczba_kartek
FROM kartki k
JOIN zawodnicy z ON k.zawodnik_id = z.id
WHERE k.typ_kartki = 'Żółta'
GROUP BY z.zawodnik_id, z.imie, z.nazwisko
HAVING COUNT(*) >= 2;
```

**Pola:**
- `kartka_id` - Unikalny identyfikator
- `mecz_id` - Powiązanie do meczu
- `zawodnik_id` - Zawodnik ukarany
- `typ_kartki` - Żółta/Czerwona
- `minuta_kartki` - Minuta (1-120)
- `powod_kartki` - Powód kartki

**Relacje:**
- → mecze
- → zawodnicy
- → kluby

**Constraints:**
```sql
CHECK (minuta_kartki >= 1 AND minuta_kartki <= 120)
```

---

### 10. **statystyki_zawodnikow**
Zagregowane statystyki sezonowe zawodnika

```sql
-- Top strzelcy
SELECT z.zawodnik_id, z.imie, z.nazwisko, 
  k.nazwa_klubu, s.gole, s.asysty
FROM statystyki_zawodnikow s
JOIN zawodnicy z ON s.zawodnik_id = z.id
JOIN kluby k ON z.klub_id = k.id
WHERE s.sezon = '2026/2027'
ORDER BY s.gole DESC
LIMIT 10;

-- Zawodnicy z najwyższą średnią oceny
SELECT z.zawodnik_id, z.imie, z.nazwisko, 
  s.przeciętna_ocena, s.liczba_meczy
FROM statystyki_zawodnikow s
JOIN zawodnicy z ON s.zawodnik_id = z.id
WHERE s.liczba_meczy >= 10 -- Min 10 meczów
ORDER BY s.przeciętna_ocena DESC;
```

**Pola:**
- `zawodnik_id` - FK do zawodnika
- `liczba_meczy` - Ilość meczów
- `gole` - Liczba bramek
- `asysty` - Liczba asyst
- `zolte_kartki`, `czerwone_kartki` - Kartki
- `minuty_grane` - Łączne minuty
- `przeciętna_ocena` - Średnia ocena (1-10)

**Relacje:**
- → zawodnicy (UNIQUE)

**UPDATE Trigger:**
Automatycznie aktualizowana na podstawie danych z `bramki` i `kartki`

---

### 11. **statystyki_klubow**
Zagregowane statystyki sezonowe klubu

```sql
-- Statystyki klubu
SELECT s.* FROM statystyki_klubow s
JOIN kluby k ON s.klub_id = k.id
WHERE k.klub_id = 'K5_MAZ_001';

-- Średnia bramek na mecz
SELECT k.nazwa_klubu, s.średnia_bramek_na_mecz
FROM statystyki_klubow s
JOIN kluby k ON s.klub_id = k.id
ORDER BY s.średnia_bramek_na_mecz DESC;
```

**Pola:**
- `klub_id` - FK do klubu
- `liczba_meczy` - Mecze rozegrane
- `wygrane`, `remisy`, `przegrane` - Wyniki
- `bramki_zdobyte`, `bramki_stracone` - Bramki
- `punkty` - Punkty ligowe
- `średnia_bramek_na_mecz` - Statystyka

---

### 12. **klasyfikacja_sezonu**
Tabela ligi z pozycją każdego klubu

```sql
-- Klasyfikacja ligi
SELECT k.pozycja, kl.nazwa_klubu, k.liczba_meczy, k.punkty,
  CONCAT(k.bramki_zdobyte, ':', k.bramki_stracone) as bilans
FROM klasyfikacja_sezonu k
JOIN kluby kl ON k.klub_id = kl.id
WHERE k.liga_id = (SELECT id FROM ligi_rejonowe WHERE liga_id = 'IV_MAZ_1')
  AND k.sezon = '2026/2027'
ORDER BY k.pozycja;

-- Top 3 (awans), Bottom 2 (degradacja)
SELECT k.pozycja, kl.nazwa_klubu, k.punkty,
  CASE 
    WHEN k.pozycja <= 2 THEN 'Promocja'
    WHEN k.pozycja > (SELECT COUNT(*) - 2 FROM klasyfikacja_sezonu) THEN 'Degradacja'
    ELSE 'Utrzymanie'
  END as status
FROM klasyfikacja_sezonu k
JOIN kluby kl ON k.klub_id = kl.id;
```

**Pola:**
- `pozycja` - Miejsce w lidze
- `klub_id` - FK do klubu
- `liczba_meczy` - Mecze rozegrane
- `punkty` - Punkty ligowe
- `bramki_zdobyte/stracone` - Bilans bramek

**Relacje:**
- → kluby
- → ligi_rejonowe

**UNIQUE:** (liga_id, pozycja, sezon)

---

## 🔄 Przepływy Danych

### Scenariusz 1: Dodanie nowego meczu

```sql
-- 1. Wstawić mecz
INSERT INTO mecze (mecz_id, data_meczu, godzina_meczu, liga_id, 
  klub_gospodarzy, klub_gosci, status)
VALUES ('M_26_001', '2026-08-15', '15:00', 1, 1, 2, 'Zakończony');

-- 2. Wstawić bramki
INSERT INTO bramki (bramka_id, mecz_id, zawodnik_id, minuta_bramki, typ_bramki, asystent_id)
VALUES ('B_001', 1, 9, 12, 'Zgrywka', 6);

-- 3. Wstawić kartki
INSERT INTO kartki (kartka_id, mecz_id, zawodnik_id, typ_kartki, minuta_kartki)
VALUES ('K_001', 1, 2, 'Żółta', 25);

-- 4. Zaktualizować wynik meczu
UPDATE mecze SET wynik_gospodarzy = 2, wynik_gosci = 1, 
  liczba_widzow = 1500, status = 'Zakończony'
WHERE mecz_id = 'M_26_001';

-- 5. Statystyki są auto-aktualizowane przez TRIGGER
```

### Scenariusz 2: Zaktualizować klasyfikację

```sql
-- Automatycznie obliczane z meczów
-- Uruchom procedurę (do zaimplementowania):
-- CALL aktualizuj_klasyfikacje('2026/2027', 'IV_MAZ_1');
```

---

## 📊 VIEWS (Gotowe Zapytania)

### `top_strzelcy_sezonu`
```sql
SELECT * FROM top_strzelcy_sezonu LIMIT 10;
```

### `klasyfikacja_pełna`
```sql
SELECT * FROM klasyfikacja_pełna WHERE sezon = '2026/2027';
```

---

## 🔐 Funkcje Helpera

### `oblicz_punkty(wygrane, remisy, przegrane)`
```sql
SELECT oblicz_punkty(10, 5, 2); -- Zwraca 35 (10*3 + 5*1)
```

### `oblicz_roznice_bramek(zdobyte, stracone)`
```sql
SELECT oblicz_roznice_bramek(25, 10); -- Zwraca +15
```

---

## 🚀 Optymalizacja Zapytań

### Najczęstsze zapytania z indeksami:

```sql
-- Szybkie: (index na klub_id)
SELECT * FROM zawodnicy WHERE klub_id = 1;

-- Szybkie: (index na data_meczu)
SELECT * FROM mecze WHERE data_meczu BETWEEN '2026-08-15' AND '2026-09-30';

-- Szybkie: (index na zawodnik_id, typ_kartki)
SELECT COUNT(*) FROM kartki WHERE zawodnik_id = 5 AND typ_kartki = 'Żółta';

-- Powolne - brak optimizacji (unikać):
SELECT * FROM zawodnicy WHERE nazwisko LIKE 'Now%'; -- Dodaj indeks!
```

---

## 📝 Best Practices

1. **Zawsze używaj FK** - Integralność referencyjna
2. **Walidacja danych** - Constraints w bazie
3. **Logi zmian** - INSERT do `logi_zmian` automatycznie
4. **Transakcje** - Multi-step operacje w transakcjach
5. **Indeksy** - Na kolumnach z WHERE i JOIN
6. **Views** - Dla złożonych zapytań

---

## 🔧 Maintenance

```sql
-- Statystyki bazy
ANALYZE;

-- Reindeksowanie
REINDEX INDEX idx_zawodnik_id;

-- Backup
pg_dump liga_iv_2026_2027 > backup.sql
```

---

*Ostatnia aktualizacja: 17 listopada 2026*
