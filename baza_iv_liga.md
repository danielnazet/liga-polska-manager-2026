# Baza Danych: IV Liga (V Poziom Rozgrywkowy) - Sezon 2026/2027

## 📋 Hierarchia Lig Polskich (dla referencji)

| Poziom | Liga | Liczba Zespołów | Struktura |
|--------|------|-----------------|-----------|
| I | Ekstraklasa | 18 | 1 grupa |
| II | I Liga | 36 | 2 grupy (Wschód/Zachód) |
| III | II Liga | 72 | 4 grupy (Polud.-Zach., Polud.-Wsch., Pół.-Zach., Pół.-Wsch.) |
| IV | III Liga | 80+ | 4 grupy regionalne |
| **V** | **IV Liga** | **~500+** | **16 lig rejonowych (wojewódzkie)** |
| VI | V Liga | Zmienne | Wojewódzkie |
| VII | Klasa Okręgowa | Zmienne | Wojewódzkie grupy |
| VIII | Klasa A | Zmienne | Wojewódzkie |
| IX | Klasa B | Zmienne | Wojewódzkie |
| X | Klasa C | Zmienne | Rejonowe |

---

## 🗂️ Struktura Bazy Danych IV Ligi

### 1. Tabela Wojewódzkich Lig IV-ligowych (`wojewodztwa`)

| Wojewodztwo_ID | Nazwa_Wojewodztwa | Ilość_Grup | Ilość_Klubów | Nazwa_Związku |
|---|---|---|---|---|
| WOJ_MAZ | Mazowieckie | 2 | 56 | MZPN |
| WOJ_SL | Śląskie | 2 | 48 | ŚZPN |
| WOJ_MAL | Małopolskie | 1 | 24 | MZPN |
| WOJ_WKP | Wielkopolskie | 2 | 56 | WZPN |
| WOJ_DOL | Dolnośląskie | 2 | 48 | DZPN |
| WOJ_POM | Pomorskie | 1 | 24 | PZPN |
| WOJ_KUJ | Kujawsko-Pomorskie | 1 | 24 | KZPN |
| WOJ_LUBE | Lubelskie | 1 | 24 | LZPN |
| WOJ_LODA | Łódzkie | 2 | 48 | ŁZN |
| WOJ_OPOL | Opolskie | 1 | 24 | OZPN |
| WOJ_POD | Podlaskie | 1 | 20 | PZPN |
| WOJ_PRAW | Podkarpackie | 1 | 24 | PRZPN |
| WOJ_WARM | Warmińsko-Mazurskie | 1 | 24 | WMZPN |
| WOJ_WIEL | Wielkopolskie Zachodnie | 1 | 24 | WZPN |
| WOJ_ZACH | Zachodniopo-morskie | 1 | 24 | ZZPN |
| WOJ_SW | Świętokrzyskie | 1 | 20 | SZPN |

---

### 2. Tabela Lig Rejonowych (`ligi_rejonowe`)

| Liga_ID | Nazwa_Ligi | Wojewodztwo_ID | Numer_Grupy | Liczba_Klubów | Rok_Założenia |
|---|---|---|---|---|---|
| IV_MAZ_1 | IV Liga Mazowiecka I | WOJ_MAZ | 1 | 28 | 1990 |
| IV_MAZ_2 | IV Liga Mazowiecka II | WOJ_MAZ | 2 | 28 | 1990 |
| IV_SL_1 | IV Liga Śląska I | WOJ_SL | 1 | 24 | 1990 |
| IV_SL_2 | IV Liga Śląska II | WOJ_SL | 2 | 24 | 1990 |
| IV_MAL_1 | IV Liga Małopolska | WOJ_MAL | 1 | 24 | 1990 |
| IV_WKP_1 | IV Liga Wielkopolska I | WOJ_WKP | 1 | 28 | 1990 |
| IV_WKP_2 | IV Liga Wielkopolska II | WOJ_WKP | 2 | 28 | 1990 |
| IV_DOL_1 | IV Liga Dolnośląska I | WOJ_DOL | 1 | 24 | 1990 |
| IV_DOL_2 | IV Liga Dolnośląska II | WOJ_DOL | 2 | 24 | 1990 |
| IV_POM_1 | IV Liga Pomorska | WOJ_POM | 1 | 24 | 1990 |
| IV_KUJ_1 | IV Liga Kujawsko-Pomorska | WOJ_KUJ | 1 | 24 | 1990 |
| IV_LUBE_1 | IV Liga Lubelska | WOJ_LUBE | 1 | 24 | 1990 |
| IV_LODA_1 | IV Liga Łódzka I | WOJ_LODA | 1 | 24 | 1990 |
| IV_LODA_2 | IV Liga Łódzka II | WOJ_LODA | 2 | 24 | 1990 |
| IV_OPOL_1 | IV Liga Opolska | WOJ_OPOL | 1 | 20 | 1990 |
| IV_POD_1 | IV Liga Podlaska | WOJ_POD | 1 | 20 | 1990 |
| IV_PRAW_1 | IV Liga Podkarpacka | WOJ_PRAW | 1 | 24 | 1990 |
| IV_WARM_1 | IV Liga Warmińsko-Mazurska | WOJ_WARM | 1 | 24 | 1990 |
| IV_ZACH_1 | IV Liga Zachodniopomorska | WOJ_ZACH | 1 | 24 | 1990 |
| IV_SW_1 | IV Liga Świętokrzyska | WOJ_SW | 1 | 20 | 1990 |

---

### 3. Tabela Klubów (`kluby_iv_liga`)

| Klub_ID | Nazwa_Klubu | Liga_ID | Województwo | Miejscowość | Rok_Założenia | Stadion | Pojemność_Stadiony | Status |
|---|---|---|---|---|---|---|---|---|
| K5_MAZ_001 | GKS Pokrzywnica | IV_MAZ_1 | MAZ | Pokrzywnica | 1958 | Stadion Pokrzywnica | 2000 | Aktywny |
| K5_MAZ_002 | Bug Wyszków | IV_MAZ_1 | MAZ | Wyszków | 1945 | Stadion Miejski Wyszków | 3000 | Aktywny |
| K5_MAZ_003 | Huragan Wołomin | IV_MAZ_1 | MAZ | Wołomin | 1963 | Stadion Huragan | 2500 | Aktywny |
| K5_MAZ_004 | Świt Nowy Dwór Maz. | IV_MAZ_1 | MAZ | Nowy Dwór Mazowiecki | 1947 | Stadion Miejski | 2000 | Aktywny |
| K5_MAZ_005 | Dąb Wieliszew | IV_MAZ_1 | MAZ | Wieliszew | 1952 | Stadion Dąb | 1500 | Aktywny |
| K5_MAZ_006 | Marcovia Marki | IV_MAZ_1 | MAZ | Marki | 1964 | Stadion Marcovia | 1800 | Aktywny |
| K5_MAZ_007 | Sokół Serock | IV_MAZ_1 | MAZ | Serock | 1946 | Stadion Sokół | 1200 | Aktywny |
| K5_MAZ_008 | Legionovia Legionowo | IV_MAZ_1 | MAZ | Legionowo | 1942 | Stadion Legionovia | 3500 | Aktywny |
| K5_MAZ_009 | Wisła Maciejowice | IV_MAZ_1 | MAZ | Maciejowice | 1950 | Stadion Wisła | 1000 | Aktywny |
| K5_MAZ_010 | Olimpia Warszawa | IV_MAZ_1 | MAZ | Warszawa | 1963 | Stadion Olimpia | 2200 | Aktywny |

*(Uwaga: Pełna lista obejmie ~500+ klubów dla wszystkich wojewódzkich lig IV-ligowych)*

---

### 4. Tabela Zawodników (`zawodnicy`)

| Zawodnik_ID | Imię | Nazwisko | Data_Urodzenia | Klub_ID | Numer | Pozycja | Wzrost | Waga | Noga_Preferowana | Wznowienie_Umowy | Data_Dołączenia | Poprzedni_Klub |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| PL_000001 | Piotr | Nowak | 1998-05-15 | K5_MAZ_001 | 1 | Bramkarz | 185 | 82 | - | 2027-06-30 | 2023-07-01 | GKS Pokrzywnica Rezerwy |
| PL_000002 | Jakub | Wiśniewski | 1997-08-22 | K5_MAZ_001 | 2 | Obrońca | 182 | 78 | Prawy | 2027-06-30 | 2024-01-15 | Huragan Wołomin |
| PL_000003 | Krzysztof | Lewandowski | 1996-03-10 | K5_MAZ_001 | 3 | Obrońca | 180 | 76 | Lewy | 2027-06-30 | 2023-08-20 | Świt Nowy Dwór |
| PL_000004 | Marcin | Zieliński | 1999-11-05 | K5_MAZ_001 | 4 | Obrońca | 183 | 79 | Prawy | 2027-06-30 | 2024-07-10 | Bug Wyszków |
| PL_000005 | Adam | Górski | 2000-02-14 | K5_MAZ_001 | 5 | Pomocdnik | 177 | 71 | Lewy | 2027-06-30 | 2023-09-01 | Akademia GKS |
| PL_000006 | Tomasz | Nawrocki | 1995-07-28 | K5_MAZ_001 | 6 | Pomocdnik | 179 | 73 | Prawy | 2027-06-30 | 2022-01-10 | Legionovia |
| PL_000007 | Bartosz | Szymański | 1998-09-03 | K5_MAZ_001 | 7 | Pomocdnik | 176 | 70 | Lewy | 2027-06-30 | 2023-07-15 | Dąb Wieliszew |
| PL_000008 | Szymon | Kaminski | 2001-04-18 | K5_MAZ_001 | 8 | Pomocdnik | 178 | 72 | Prawy | 2027-06-30 | 2024-08-05 | Akademia GKS |
| PL_000009 | Łukasz | Mróz | 1997-12-11 | K5_MAZ_001 | 9 | Napastnik | 184 | 80 | Prawy | 2027-06-30 | 2023-10-20 | Marcovia Marki |
| PL_000010 | Robert | Kucharski | 1996-06-25 | K5_MAZ_001 | 10 | Napastnik | 181 | 77 | Lewy | 2028-06-30 | 2021-07-01 | Sokół Serock |

---

### 5. Tabela Statystyk Zawodników (`statystyki_zawodnikow`)

| Stat_ID | Zawodnik_ID | Mecz_ID | Liczba_Meczy | Gole | Asysty | Żółte_Kartki | Czerwone_Kartki | Minuty_Grane | Przeciętna_Ocena |
|---|---|---|---|---|---|---|---|---|---|
| ST_001 | PL_000001 | M_26_001 | 25 | 0 | 0 | 2 | 0 | 2250 | 7.2 |
| ST_002 | PL_000002 | M_26_001 | 24 | 1 | 0 | 5 | 0 | 2160 | 7.0 |
| ST_003 | PL_000003 | M_26_001 | 23 | 0 | 1 | 3 | 0 | 2070 | 6.8 |
| ST_004 | PL_000004 | M_26_001 | 25 | 2 | 2 | 4 | 0 | 2250 | 7.1 |
| ST_005 | PL_000005 | M_26_001 | 22 | 1 | 3 | 2 | 0 | 1980 | 6.9 |
| ST_006 | PL_000006 | M_26_001 | 25 | 3 | 5 | 1 | 0 | 2250 | 7.3 |
| ST_007 | PL_000007 | M_26_001 | 24 | 2 | 4 | 3 | 0 | 2160 | 7.1 |
| ST_008 | PL_000008 | M_26_001 | 18 | 0 | 1 | 2 | 0 | 1620 | 6.7 |
| ST_009 | PL_000009 | M_26_001 | 25 | 12 | 3 | 2 | 0 | 2250 | 7.8 |
| ST_010 | PL_000010 | M_26_001 | 23 | 8 | 2 | 1 | 0 | 2070 | 7.5 |

---

### 6. Tabela Meczów (`mecze`)

| Mecz_ID | Data_Meczu | Godzina | Liga_ID | Drużyna_Gospodarzy | Drużyna_Gości | Wynik_Gospodarzy | Wynik_Gości | Liczba_Widzów | Stadion | Status |
|---|---|---|---|---|---|---|---|---|---|---|
| M_26_001 | 2026-08-15 | 15:00 | IV_MAZ_1 | K5_MAZ_001 | K5_MAZ_002 | 2 | 1 | 1500 | Stadion Pokrzywnica | Zakończony |
| M_26_002 | 2026-08-15 | 17:00 | IV_MAZ_1 | K5_MAZ_003 | K5_MAZ_004 | 3 | 2 | 1200 | Stadion Huragan | Zakończony |
| M_26_003 | 2026-08-16 | 15:00 | IV_MAZ_1 | K5_MAZ_005 | K5_MAZ_006 | 1 | 1 | 800 | Stadion Dąb | Zakończony |
| M_26_004 | 2026-08-16 | 17:00 | IV_MAZ_1 | K5_MAZ_007 | K5_MAZ_008 | 2 | 2 | 1300 | Stadion Sokół | Zakończony |
| M_26_005 | 2026-08-22 | 15:00 | IV_MAZ_1 | K5_MAZ_009 | K5_MAZ_010 | 1 | 0 | 950 | Stadion Wisła | Zakończony |
| M_26_006 | 2026-08-23 | 15:00 | IV_MAZ_1 | K5_MAZ_002 | K5_MAZ_003 | 2 | 2 | 1100 | Stadion Miejski Wyszków | Zaplanowany |
| M_26_007 | 2026-08-23 | 17:00 | IV_MAZ_1 | K5_MAZ_004 | K5_MAZ_005 | - | - | - | Stadion Miejski | Zaplanowany |
| M_26_008 | 2026-08-29 | 15:00 | IV_MAZ_1 | K5_MAZ_006 | K5_MAZ_007 | - | - | - | Stadion Marcovia | Zaplanowany |
| M_26_009 | 2026-08-30 | 17:00 | IV_MAZ_1 | K5_MAZ_008 | K5_MAZ_009 | - | - | - | Stadion Legionovia | Zaplanowany |
| M_26_010 | 2026-08-30 | 15:00 | IV_MAZ_1 | K5_MAZ_010 | K5_MAZ_001 | - | - | - | Stadion Olimpia | Zaplanowany |

---

### 7. Tabela Klasyfikacji (`klasyfikacja_sezonu`)

| Pozycja | Klub_ID | Nazwa_Klubu | Liga_ID | Liczba_Meczy | Wygrane | Remisy | Przegrane | Bramki_Zdobyte | Bramki_Stracone | Różnica_Bramek | Punkty |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | K5_MAZ_001 | GKS Pokrzywnica | IV_MAZ_1 | 5 | 3 | 2 | 0 | 8 | 2 | +6 | 11 |
| 2 | K5_MAZ_003 | Huragan Wołomin | IV_MAZ_1 | 5 | 3 | 1 | 1 | 7 | 3 | +4 | 10 |
| 3 | K5_MAZ_002 | Bug Wyszków | IV_MAZ_1 | 5 | 2 | 2 | 1 | 6 | 4 | +2 | 8 |
| 4 | K5_MAZ_008 | Legionovia Legionowo | IV_MAZ_1 | 5 | 2 | 2 | 1 | 7 | 5 | +2 | 8 |
| 5 | K5_MAZ_006 | Marcovia Marki | IV_MAZ_1 | 5 | 2 | 1 | 2 | 6 | 6 | 0 | 7 |
| 6 | K5_MAZ_004 | Świt Nowy Dwór Maz. | IV_MAZ_1 | 5 | 2 | 0 | 3 | 5 | 7 | -2 | 6 |
| 7 | K5_MAZ_005 | Dąb Wieliszew | IV_MAZ_1 | 5 | 1 | 2 | 2 | 4 | 6 | -2 | 5 |
| 8 | K5_MAZ_007 | Sokół Serock | IV_MAZ_1 | 5 | 1 | 2 | 2 | 5 | 7 | -2 | 5 |
| 9 | K5_MAZ_010 | Olimpia Warszawa | IV_MAZ_1 | 4 | 1 | 1 | 2 | 2 | 3 | -1 | 4 |
| 10 | K5_MAZ_009 | Wisła Maciejowice | IV_MAZ_1 | 4 | 0 | 1 | 3 | 2 | 5 | -3 | 1 |

---

### 8. Tabela Trenerów (`trenery`)

| Trener_ID | Imię | Nazwisko | Data_Urodzenia | Klub_ID | Stanowisko | Kraj_Pochodzenia | Liczba_Lat_Doświadczenia | Data_Zatrudnienia | Kontrakt_Do |
|---|---|---|---|---|---|---|---|---|---|
| TR_00001 | Stanisław | Kowalski | 1965-03-12 | K5_MAZ_001 | Trener Główny | Polska | 25 | 2024-07-01 | 2027-06-30 |
| TR_00002 | Jan | Nowak | 1972-05-20 | K5_MAZ_001 | Asystent | Polska | 18 | 2024-07-15 | 2027-06-30 |
| TR_00003 | Marek | Zieliński | 1968-08-10 | K5_MAZ_001 | Trener Bramkarzy | Polska | 20 | 2024-08-01 | 2027-06-30 |
| TR_00004 | Zbigniew | Lewandowski | 1960-11-25 | K5_MAZ_002 | Trener Główny | Polska | 30 | 2023-06-01 | 2027-06-30 |
| TR_00005 | Adam | Góral | 1975-02-14 | K5_MAZ_002 | Asystent | Polska | 15 | 2024-07-01 | 2027-06-30 |
| TR_00006 | Piotr | Szymański | 1970-09-18 | K5_MAZ_003 | Trener Główny | Polska | 22 | 2024-07-01 | 2027-06-30 |
| TR_00007 | Dariusz | Wilk | 1968-04-30 | K5_MAZ_003 | Asystent | Polska | 19 | 2024-08-10 | 2027-06-30 |

---

### 9. Tabela Kartek (`kartki`)

| Kartka_ID | Mecz_ID | Zawodnik_ID | Typ_Kartki | Minuta | Powód |
|---|---|---|---|---|---|
| K_001 | M_26_001 | PL_000002 | Żółta | 25 | Faul |
| K_002 | M_26_001 | PL_000003 | Żółta | 48 | Zagranie niebezpieczne |
| K_003 | M_26_002 | PL_000006 | Żółta | 15 | Objawienie gry |
| K_004 | M_26_002 | PL_000007 | Żółta | 72 | Faul |
| K_005 | M_26_003 | PL_000008 | Żółta | 35 | Zagranie niebezpieczne |

---

### 10. Tabela Bramek (`bramki`)

| Bramka_ID | Mecz_ID | Zawodnik_ID | Minuta | Typ_Bramki | Asystent_ID |
|---|---|---|---|---|---|
| B_001 | M_26_001 | PL_000009 | 12 | Zgrywka | PL_000006 |
| B_002 | M_26_001 | PL_000010 | 34 | Strzał z pola | NULL |
| B_003 | M_26_001 | PL_000012 | 67 | Kontra-atak | PL_000007 |
| B_004 | M_26_002 | PL_000015 | 8 | Rzut rożny | NULL |
| B_005 | M_26_002 | PL_000016 | 42 | Strzał z pola | PL_000014 |
| B_006 | M_26_002 | PL_000017 | 75 | Strzał z pola | PL_000018 |
| B_007 | M_26_003 | PL_000020 | 55 | Zgrywka | PL_000019 |

---

## 📊 Podsumowanie Struktury Bazy

**Tabele (10 głównych):**
1. ✅ Wojewódzkie Związki Piłki Nożnej (wojewodztwa)
2. ✅ Ligi Rejonowe IV-ligowe (ligi_rejonowe)
3. ✅ Kluby (kluby_iv_liga)
4. ✅ Zawodnicy (zawodnicy)
5. ✅ Statystyki Zawodników (statystyki_zawodnikow)
6. ✅ Mecze (mecze)
7. ✅ Klasyfikacja (klasyfikacja_sezonu)
8. ✅ Trenerzy (trenery)
9. ✅ Kartki (kartki)
10. ✅ Bramki (bramki)

**Estymowana ilość rekordów:**
- ~500+ klubów (wszystkie wojewódzkie IV ligi)
- ~12,000+ zawodników (~24 zawodników per klub średnio)
- ~2,000+ meczów w sezonie (pełny cykl rozgrywek)
- ~100,000+ zmian w statystykach zawodników
- ~20,000+ bramek w sezonie

---

## 🔧 Następne Kroki

1. **Dodanie szczegółów dla każdego województwa** ✓ (struktura gotowa)
2. **Import danych zawodników dla wszystkich klubów** (będzie potrzebna dodatkowa praca)
3. **Dane historyczne poprzednich sezonów** (opcjonalnie)
4. **Automatyczne liczenie statystyk** (do implementacji w SQL)
5. **Integracja z systemem zarządzania** (Follow-up)

---

*Baza IV Ligi - Sezon 2026/2027*
*Ostatnia aktualizacja: 17 listopada 2026*
