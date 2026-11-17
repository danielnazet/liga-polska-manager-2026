-- ============================================================
-- DANE TESTOWE - IV LIGA 2026/2027
-- Przykładowe dane do testowania bazy
-- ============================================================

-- ============================================================
-- 1. WOJEWÓDZKIE ZWIĄZKI PIŁKI NOŻNEJ
-- ============================================================

INSERT INTO wojewodztwa (wojewodztwo_id, nazwa_wojewodztwa, liczba_grup, liczba_klubow, nazwa_zwiazku, rok_zalozenia, siedziba_miasta, email_zwiazku, telefon)
VALUES
('WOJ_MAZ', 'Mazowieckie', 2, 56, 'MZPN', 1990, 'Warszawa', 'info@mzpn.pl', '+48 22 1234567'),
('WOJ_SL', 'Śląskie', 2, 48, 'ŚZPN', 1990, 'Katowice', 'info@slask.pzpn.pl', '+48 32 1234567'),
('WOJ_MAL', 'Małopolskie', 1, 24, 'MZPN', 1990, 'Kraków', 'info@malopolskie.pzpn.pl', '+48 12 1234567'),
('WOJ_WKP', 'Wielkopolskie', 2, 56, 'WZPN', 1990, 'Poznań', 'info@wielkopolskie.pzpn.pl', '+48 61 1234567'),
('WOJ_DOL', 'Dolnośląskie', 2, 48, 'DZPN', 1990, 'Wrocław', 'info@dolnoslaskie.pzpn.pl', '+48 71 1234567'),
('WOJ_POM', 'Pomorskie', 1, 24, 'PZPN', 1990, 'Gdańsk', 'info@pomorskie.pzpn.pl', '+48 58 1234567');

-- ============================================================
-- 2. LIGI REJONOWE
-- ============================================================

INSERT INTO ligi_rejonowe (liga_id, nazwa_ligi, wojewodztwo_id, numer_grupy, liczba_klubow, rok_zalozenia, sezon)
VALUES
('IV_MAZ_1', 'IV Liga Mazowiecka I', 1, 1, 28, 1990, '2026/2027'),
('IV_MAZ_2', 'IV Liga Mazowiecka II', 1, 2, 28, 1990, '2026/2027'),
('IV_SL_1', 'IV Liga Śląska I', 2, 1, 24, 1990, '2026/2027'),
('IV_SL_2', 'IV Liga Śląska II', 2, 2, 24, 1990, '2026/2027'),
('IV_MAL_1', 'IV Liga Małopolska', 3, 1, 24, 1990, '2026/2027'),
('IV_WKP_1', 'IV Liga Wielkopolska I', 4, 1, 28, 1990, '2026/2027'),
('IV_WKP_2', 'IV Liga Wielkopolska II', 4, 2, 28, 1990, '2026/2027'),
('IV_DOL_1', 'IV Liga Dolnośląska I', 5, 1, 24, 1990, '2026/2027'),
('IV_DOL_2', 'IV Liga Dolnośląska II', 5, 2, 24, 1990, '2026/2027'),
('IV_POM_1', 'IV Liga Pomorska', 6, 1, 24, 1990, '2026/2027');

-- ============================================================
-- 3. KLUBY - Mazowiecka I
-- ============================================================

INSERT INTO kluby (klub_id, nazwa_klubu, liga_id, wojewodztwo, miejscowosc, rok_zalozenia, stadion_nazwa, stadion_pojemnosc, stadion_adres, status, liga_poziom)
VALUES
('K5_MAZ_001', 'GKS Pokrzywnica', 1, 'MAZ', 'Pokrzywnica', 1958, 'Stadion Pokrzywnica', 2000, 'ul. Sportowa 1, Pokrzywnica', 'Aktywny', 5),
('K5_MAZ_002', 'Bug Wyszków', 1, 'MAZ', 'Wyszków', 1945, 'Stadion Miejski Wyszków', 3000, 'ul. Nowa 15, Wyszków', 'Aktywny', 5),
('K5_MAZ_003', 'Huragan Wołomin', 1, 'MAZ', 'Wołomin', 1963, 'Stadion Huragan', 2500, 'ul. Sportowa 20, Wołomin', 'Aktywny', 5),
('K5_MAZ_004', 'Świt Nowy Dwór Mazowiecki', 1, 'MAZ', 'Nowy Dwór Mazowiecki', 1947, 'Stadion Miejski', 2000, 'ul. Leśna 5, Nowy Dwór Maz.', 'Aktywny', 5),
('K5_MAZ_005', 'Dąb Wieliszew', 1, 'MAZ', 'Wieliszew', 1952, 'Stadion Dąb', 1500, 'ul. Sportowa 10, Wieliszew', 'Aktywny', 5),
('K5_MAZ_006', 'Marcovia Marki', 1, 'MAZ', 'Marki', 1964, 'Stadion Marcovia', 1800, 'ul. Piłsudskiego 25, Marki', 'Aktywny', 5),
('K5_MAZ_007', 'Sokół Serock', 1, 'MAZ', 'Serock', 1946, 'Stadion Sokół', 1200, 'ul. Rzeczna 7, Serock', 'Aktywny', 5),
('K5_MAZ_008', 'Legionovia Legionowo', 1, 'MAZ', 'Legionowo', 1942, 'Stadion Legionovia', 3500, 'ul. Armii Krajowej 1, Legionowo', 'Aktywny', 5),
('K5_MAZ_009', 'Wisła Maciejowice', 1, 'MAZ', 'Maciejowice', 1950, 'Stadion Wisła', 1000, 'ul. Główna 3, Maciejowice', 'Aktywny', 5),
('K5_MAZ_010', 'Olimpia Warszawa', 1, 'MAZ', 'Warszawa', 1963, 'Stadion Olimpia', 2200, 'ul. Olimpijska 10, Warszawa', 'Aktywny', 5);

-- ============================================================
-- 4. POZYCJE (już zawarte w schema)
-- ============================================================

-- POZYCJE już zostały wstawione w schema.sql

-- ============================================================
-- 5. ZAWODNICY - GKS Pokrzywnica
-- ============================================================

INSERT INTO zawodnicy (zawodnik_id, imie, nazwisko, data_urodzenia, klub_id, pozycja_id, numer_koszulki, wzrost_cm, waga_kg, noga_preferowana, kraj_pochodzenia, pesel, data_zalaczenia, kontrakt_do, poprzedni_klub, status_kontraktu)
VALUES
-- Bramkarze
('PL_000001', 'Piotr', 'Nowak', '1998-05-15', 1, 1, 1, 185, 82, '-', 'Polska', '98051512345', '2023-07-01', '2027-06-30', 'GKS Pokrzywnica Rezerwy', 'Aktywny'),
('PL_000002', 'Jakub', 'Wiśniewski', '1997-08-22', 1, 2, 2, 182, 78, 'Prawy', 'Polska', '97082212345', '2024-01-15', '2027-06-30', 'Huragan Wołomin', 'Aktywny'),

-- Obrońcy
('PL_000003', 'Krzysztof', 'Lewandowski', '1996-03-10', 1, 3, 3, 180, 76, 'Lewy', 'Polska', '96031012345', '2023-08-20', '2027-06-30', 'Świt Nowy Dwór', 'Aktywny'),
('PL_000004', 'Marcin', 'Zieliński', '1999-11-05', 1, 5, 4, 183, 79, 'Prawy', 'Polska', '99110512345', '2024-07-10', '2027-06-30', 'Bug Wyszków', 'Aktywny'),
('PL_000005', 'Adam', 'Górski', '2000-02-14', 1, 6, 5, 177, 71, 'Lewy', 'Polska', '00021412345', '2023-09-01', '2027-06-30', 'Akademia GKS', 'Aktywny'),

-- Pomocnicy
('PL_000006', 'Tomasz', 'Nawrocki', '1995-07-28', 1, 8, 6, 179, 73, 'Prawy', 'Polska', '95072812345', '2022-01-10', '2027-06-30', 'Legionovia', 'Aktywny'),
('PL_000007', 'Bartosz', 'Szymański', '1998-09-03', 1, 7, 7, 176, 70, 'Lewy', 'Polska', '98090312345', '2023-07-15', '2027-06-30', 'Dąb Wieliszew', 'Aktywny'),
('PL_000008', 'Szymon', 'Kaminski', '2001-04-18', 1, 9, 8, 178, 72, 'Prawy', 'Polska', '01041812345', '2024-08-05', '2027-06-30', 'Akademia GKS', 'Aktywny'),

-- Napastnicy
('PL_000009', 'Łukasz', 'Mróz', '1997-12-11', 1, 4, 9, 184, 80, 'Prawy', 'Polska', '97121112345', '2023-10-20', '2027-06-30', 'Marcovia Marki', 'Aktywny'),
('PL_000010', 'Robert', 'Kucharski', '1996-06-25', 1, 4, 10, 181, 77, 'Lewy', 'Polska', '96062512345', '2021-07-01', '2028-06-30', 'Sokół Serock', 'Aktywny');

-- ============================================================
-- 6. TRENERZY - GKS Pokrzywnica
-- ============================================================

INSERT INTO trenery (trener_id, imie, nazwisko, data_urodzenia, klub_id, stanowisko, kraj_pochodzenia, liczba_lat_doswiadczenia, data_zatrudnienia, kontrakt_do, email, telefon)
VALUES
('TR_00001', 'Stanisław', 'Kowalski', '1965-03-12', 1, 'Trener Główny', 'Polska', 25, '2024-07-01', '2027-06-30', 's.kowalski@pokrzywnica.pl', '+48 666 111222'),
('TR_00002', 'Jan', 'Nowak', '1972-05-20', 1, 'Asystent', 'Polska', 18, '2024-07-15', '2027-06-30', 'j.nowak@pokrzywnica.pl', '+48 666 111223'),
('TR_00003', 'Marek', 'Zieliński', '1968-08-10', 1, 'Trener Bramkarzy', 'Polska', 20, '2024-08-01', '2027-06-30', 'm.zielinski@pokrzywnica.pl', '+48 666 111224');

-- ============================================================
-- 7. MECZE - IV Liga Mazowiecka I
-- ============================================================

INSERT INTO mecze (mecz_id, data_meczu, godzina_meczu, liga_id, klub_gospodarzy, klub_gosci, wynik_gospodarzy, wynik_gosci, liczba_widzow, stadion_nazwa, stadion_adres, status)
VALUES
('M_26_001', '2026-08-15', '15:00', 1, 1, 2, 2, 1, 1500, 'Stadion Pokrzywnica', 'ul. Sportowa 1, Pokrzywnica', 'Zakończony'),
('M_26_002', '2026-08-15', '17:00', 1, 3, 4, 3, 2, 1200, 'Stadion Huragan', 'ul. Sportowa 20, Wołomin', 'Zakończony'),
('M_26_003', '2026-08-16', '15:00', 1, 5, 6, 1, 1, 800, 'Stadion Dąb', 'ul. Sportowa 10, Wieliszew', 'Zakończony'),
('M_26_004', '2026-08-16', '17:00', 1, 7, 8, 2, 2, 1300, 'Stadion Sokół', 'ul. Rzeczna 7, Serock', 'Zakończony'),
('M_26_005', '2026-08-22', '15:00', 1, 9, 10, 1, 0, 950, 'Stadion Wisła', 'ul. Główna 3, Maciejowice', 'Zakończony'),
('M_26_006', '2026-08-23', '15:00', 1, 2, 3, 2, 2, 1100, 'Stadion Miejski Wyszków', 'ul. Nowa 15, Wyszków', 'Zaplanowany'),
('M_26_007', '2026-08-23', '17:00', 1, 4, 5, NULL, NULL, NULL, 'Stadion Miejski', 'ul. Leśna 5, Nowy Dwór Maz.', 'Zaplanowany'),
('M_26_008', '2026-08-29', '15:00', 1, 6, 7, NULL, NULL, NULL, 'Stadion Marcovia', 'ul. Piłsudskiego 25, Marki', 'Zaplanowany'),
('M_26_009', '2026-08-30', '17:00', 1, 8, 9, NULL, NULL, NULL, 'Stadion Legionovia', 'ul. Armii Krajowej 1, Legionowo', 'Zaplanowany'),
('M_26_010', '2026-08-30', '15:00', 1, 10, 1, NULL, NULL, NULL, 'Stadion Olimpia', 'ul. Olimpijska 10, Warszawa', 'Zaplanowany');

-- ============================================================
-- 8. BRAMKI
-- ============================================================

INSERT INTO bramki (bramka_id, mecz_id, zawodnik_id, klub_strzelca, minuta_bramki, typ_bramki, asystent_id)
VALUES
('B_001', 1, 9, 1, 12, 'Zgrywka', 6),
('B_002', 1, 10, 1, 34, 'Strzał z pola', NULL),
('B_003', 1, 2, 2, 67, 'Kontra-atak', 7),
('B_004', 2, 3, 3, 8, 'Rzut rożny', NULL),
('B_005', 2, 4, 3, 42, 'Strzał z pola', 2),
('B_006', 2, 5, 4, 75, 'Strzał z pola', 3),
('B_007', 3, 6, 5, 55, 'Zgrywka', 7);

-- ============================================================
-- 9. KARTKI
-- ============================================================

INSERT INTO kartki (kartka_id, mecz_id, zawodnik_id, klub, typ_kartki, minuta_kartki, powod_kartki)
VALUES
('K_001', 1, 2, 1, 'Żółta', 25, 'Faul'),
('K_002', 1, 3, 1, 'Żółta', 48, 'Zagranie niebezpieczne'),
('K_003', 2, 2, 3, 'Żółta', 15, 'Objawienie gry'),
('K_004', 2, 4, 3, 'Żółta', 72, 'Faul'),
('K_005', 3, 5, 5, 'Żółta', 35, 'Zagranie niebezpieczne');

-- ============================================================
-- 10. STATYSTYKI ZAWODNIKÓW
-- ============================================================

INSERT INTO statystyki_zawodnikow (zawodnik_id, liczba_meczy, gole, asysty, zolte_kartki, czerwone_kartki, minuty_grane, przeciętna_ocena, sezon)
VALUES
('PL_000001', 5, 0, 0, 0, 0, 450, 7.2, '2026/2027'),
('PL_000002', 5, 0, 0, 1, 0, 450, 6.9, '2026/2027'),
('PL_000003', 5, 0, 1, 2, 0, 450, 6.8, '2026/2027'),
('PL_000004', 5, 1, 0, 1, 0, 450, 7.1, '2026/2027'),
('PL_000005', 5, 0, 0, 1, 0, 400, 6.7, '2026/2027'),
('PL_000006', 5, 2, 3, 0, 0, 450, 7.4, '2026/2027'),
('PL_000007', 5, 1, 2, 2, 0, 420, 7.0, '2026/2027'),
('PL_000008', 5, 0, 0, 0, 0, 350, 6.6, '2026/2027'),
('PL_000009', 5, 2, 1, 1, 0, 450, 7.3, '2026/2027'),
('PL_000010', 5, 1, 0, 0, 0, 400, 7.0, '2026/2027');

-- ============================================================
-- 11. STATYSTYKI KLUBÓW
-- ============================================================

INSERT INTO statystyki_klubow (klub_id, liczba_meczy, wygrane, remisy, przegrane, bramki_zdobyte, bramki_stracone, róznica_bramek, punkty, średnia_bramek_na_mecz, sezon)
VALUES
(1, 5, 3, 1, 1, 8, 3, 5, 10, 1.6, '2026/2027'),
(2, 5, 2, 2, 1, 6, 5, 1, 8, 1.2, '2026/2027'),
(3, 5, 2, 2, 1, 7, 4, 3, 8, 1.4, '2026/2027'),
(4, 5, 2, 1, 2, 5, 7, -2, 7, 1.0, '2026/2027'),
(5, 5, 1, 3, 1, 4, 5, -1, 6, 0.8, '2026/2027'),
(6, 4, 1, 1, 2, 3, 5, -2, 4, 0.75, '2026/2027'),
(7, 4, 1, 1, 2, 3, 5, -2, 4, 0.75, '2026/2027'),
(8, 3, 1, 1, 1, 3, 3, 0, 4, 1.0, '2026/2027'),
(9, 4, 1, 1, 2, 2, 4, -2, 4, 0.5, '2026/2027'),
(10, 4, 1, 0, 3, 2, 4, -2, 3, 0.5, '2026/2027');

-- ============================================================
-- 12. KLASYFIKACJA SEZONU
-- ============================================================

INSERT INTO klasyfikacja_sezonu (pozycja, klub_id, liga_id, liczba_meczy, wygrane, remisy, przegrane, bramki_zdobyte, bramki_stracone, róznica_bramek, punkty, sezon)
VALUES
(1, 1, 1, 5, 3, 1, 1, 8, 3, 5, 10, '2026/2027'),
(2, 3, 1, 5, 2, 2, 1, 7, 4, 3, 8, '2026/2027'),
(3, 2, 1, 5, 2, 2, 1, 6, 5, 1, 8, '2026/2027'),
(4, 4, 1, 5, 2, 1, 2, 5, 7, -2, 7, '2026/2027'),
(5, 5, 1, 5, 1, 3, 1, 4, 5, -1, 6, '2026/2027'),
(6, 6, 1, 4, 1, 1, 2, 3, 5, -2, 4, '2026/2027'),
(7, 7, 1, 4, 1, 1, 2, 3, 5, -2, 4, '2026/2027'),
(8, 8, 1, 3, 1, 1, 1, 3, 3, 0, 4, '2026/2027'),
(9, 9, 1, 4, 1, 1, 2, 2, 4, -2, 4, '2026/2027'),
(10, 10, 1, 4, 1, 0, 3, 2, 4, -2, 3, '2026/2027');

-- ============================================================
-- KONIEC DANYCH TESTOWYCH
-- ============================================================

-- Podsumowanie:
-- ✅ 6 wojewódzkich związków
-- ✅ 10 lig rejonowych
-- ✅ 10 klubów z Mazowian I
-- ✅ 10 zawodników (1 klub)
-- ✅ 3 trenerów
-- ✅ 10 meczów
-- ✅ 7 bramek
-- ✅ 5 kartek
-- ✅ 10 statystyk zawodników
-- ✅ 10 statystyk klubów
-- ✅ 10 pozycji w klasyfikacji

SELECT '✅ Dane testowe zostały pomyślnie wstawione!' as Status;
