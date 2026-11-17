-- ============================================================
-- BAZA DANYCH IV LIGI (V POZIOM) - SEZON 2026/2027
-- SQL Schema dla systemu zarządzania ligą piłkarską
-- ============================================================

-- ============================================================
-- 1. WOJEWÓDZKIE ZWIĄZKI PIŁKI NOŻNEJ
-- ============================================================
CREATE TABLE wojewodztwa (
  id SERIAL PRIMARY KEY,
  wojewodztwo_id VARCHAR(20) UNIQUE NOT NULL,
  nazwa_wojewodztwa VARCHAR(100) NOT NULL,
  liczba_grup INT NOT NULL,
  liczba_klubow INT NOT NULL,
  nazwa_zwiazku VARCHAR(100) NOT NULL,
  rok_zalozenia INT,
  siedziba_miasta VARCHAR(100),
  email_zwiazku VARCHAR(100),
  telefon VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wojewodztwo_id ON wojewodztwa(wojewodztwo_id);

-- ============================================================
-- 2. LIGI REJONOWE (IV LIGA - V POZIOM)
-- ============================================================
CREATE TABLE ligi_rejonowe (
  id SERIAL PRIMARY KEY,
  liga_id VARCHAR(50) UNIQUE NOT NULL,
  nazwa_ligi VARCHAR(150) NOT NULL,
  wojewodztwo_id INT REFERENCES wojewodztwa(id),
  numer_grupy INT NOT NULL,
  liczba_klubow INT NOT NULL,
  rok_zalozenia INT,
  regulamin_link VARCHAR(255),
  sezon VARCHAR(10) DEFAULT '2026/2027',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_liga_id ON ligi_rejonowe(liga_id);
CREATE INDEX idx_wojewodztwo_ligi ON ligi_rejonowe(wojewodztwo_id);

-- ============================================================
-- 3. KLUBY
-- ============================================================
CREATE TABLE kluby (
  id SERIAL PRIMARY KEY,
  klub_id VARCHAR(50) UNIQUE NOT NULL,
  nazwa_klubu VARCHAR(150) NOT NULL,
  liga_id INT REFERENCES ligi_rejonowe(id),
  wojewodztwo VARCHAR(50) NOT NULL,
  miejscowosc VARCHAR(100) NOT NULL,
  rok_zalozenia INT,
  stadion_nazwa VARCHAR(150),
  stadion_pojemnosc INT,
  stadion_adres VARCHAR(200),
  status VARCHAR(50) DEFAULT 'Aktywny', -- Aktywny, Zawieszony, Wypadł
  liczba_zawodnikow INT DEFAULT 0,
  liga_poziom INT DEFAULT 5, -- Poziom V (IV Liga)
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_klub_id ON kluby(klub_id);
CREATE INDEX idx_liga_kluby ON kluby(liga_id);
CREATE INDEX idx_miejscowosc ON kluby(miejscowosc);
CREATE INDEX idx_status_klubu ON kluby(status);

-- ============================================================
-- 4. POZYCJE PIŁKARSKIE
-- ============================================================
CREATE TABLE pozycje (
  id SERIAL PRIMARY KEY,
  pozycja_kod VARCHAR(20) UNIQUE NOT NULL,
  nazwa_pozycji VARCHAR(50) NOT NULL,
  skrot VARCHAR(3),
  opis VARCHAR(200)
);

INSERT INTO pozycje (pozycja_kod, nazwa_pozycji, skrot, opis) VALUES
  ('BR', 'Bramkarz', 'BR', 'Stojący w bramce'),
  ('OBR', 'Obrońca', 'OBR', 'Zawodnik obrony'),
  ('POM', 'Pomocnik', 'POM', 'Zawodnik środka pola'),
  ('NAP', 'Napastnik', 'NAP', 'Zawodnik ataku'),
  ('LBR', 'Lewy Obrońca', 'LBR', 'Obrońca lewej strony'),
  ('PBR', 'Prawy Obrońca', 'PBR', 'Obrońca prawej strony'),
  ('LPA', 'Lewy Pomocnik', 'LPA', 'Pomocnik lewej strony'),
  ('PPA', 'Prawy Pomocnik', 'PPA', 'Pomocnik prawej strony'),
  ('SPL', 'Środkowy Pomocnik', 'SPL', 'Pomocnik центру pola'),
  ('SPR', 'Skrzydłowy', 'SPR', 'Zawodnik skrzydła');

-- ============================================================
-- 5. ZAWODNICY
-- ============================================================
CREATE TABLE zawodnicy (
  id SERIAL PRIMARY KEY,
  zawodnik_id VARCHAR(50) UNIQUE NOT NULL,
  imie VARCHAR(100) NOT NULL,
  nazwisko VARCHAR(100) NOT NULL,
  data_urodzenia DATE,
  klub_id INT REFERENCES kluby(id),
  pozycja_id INT REFERENCES pozycje(id),
  numer_koszulki INT,
  wzrost_cm INT,
  waga_kg INT,
  noga_preferowana VARCHAR(10), -- Prawy, Lewy, Obie
  kraj_pochodzenia VARCHAR(100) DEFAULT 'Polska',
  pesel VARCHAR(11),
  data_zalaczenia DATE,
  kontrakt_do DATE,
  poprzedni_klub VARCHAR(150),
  international BOOLEAN DEFAULT FALSE,
  status_kontraktu VARCHAR(50) DEFAULT 'Aktywny', -- Aktywny, Zawieszony, Skończony
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_zawodnik_id ON zawodnicy(zawodnik_id);
CREATE INDEX idx_klub_zawodnicy ON zawodnicy(klub_id);
CREATE INDEX idx_pozycja_zawodnicy ON zawodnicy(pozycja_id);
CREATE INDEX idx_zawodnik_nazwisko ON zawodnicy(nazwisko);
CREATE INDEX idx_status_kontraktu ON zawodnicy(status_kontraktu);

-- ============================================================
-- 6. TRENERZY
-- ============================================================
CREATE TABLE trenery (
  id SERIAL PRIMARY KEY,
  trener_id VARCHAR(50) UNIQUE NOT NULL,
  imie VARCHAR(100) NOT NULL,
  nazwisko VARCHAR(100) NOT NULL,
  data_urodzenia DATE,
  klub_id INT REFERENCES kluby(id),
  stanowisko VARCHAR(100) NOT NULL, -- Trener Główny, Asystent, Bramkarz, etc.
  kraj_pochodzenia VARCHAR(100),
  liczba_lat_doswiadczenia INT,
  data_zatrudnienia DATE,
  kontrakt_do DATE,
  email VARCHAR(100),
  telefon VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trener_id ON trenery(trener_id);
CREATE INDEX idx_klub_trenery ON trenery(klub_id);
CREATE INDEX idx_stanowisko ON trenery(stanowisko);

-- ============================================================
-- 7. MECZE
-- ============================================================
CREATE TABLE mecze (
  id SERIAL PRIMARY KEY,
  mecz_id VARCHAR(50) UNIQUE NOT NULL,
  data_meczu DATE NOT NULL,
  godzina_meczu TIME,
  liga_id INT REFERENCES ligi_rejonowe(id),
  klub_gospodarzy INT REFERENCES kluby(id),
  klub_gosci INT REFERENCES kluby(id),
  wynik_gospodarzy INT DEFAULT NULL,
  wynik_gosci INT DEFAULT NULL,
  liczba_widzow INT,
  stadion_nazwa VARCHAR(150),
  stadion_adres VARCHAR(200),
  status VARCHAR(50) DEFAULT 'Zaplanowany', -- Zaplanowany, Zakończony, Przełożony, Anulowany
  arbiter_id INT REFERENCES trenery(id), -- Opcjonalnie
  dodatkowe_uwagi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mecz_id ON mecze(mecz_id);
CREATE INDEX idx_data_meczu ON mecze(data_meczu);
CREATE INDEX idx_liga_mecze ON mecze(liga_id);
CREATE INDEX idx_druzyny_mecz ON mecze(klub_gospodarzy, klub_gosci);
CREATE INDEX idx_status_meczu ON mecze(status);

-- ============================================================
-- 8. BRAMKI
-- ============================================================
CREATE TABLE bramki (
  id SERIAL PRIMARY KEY,
  bramka_id VARCHAR(50) UNIQUE NOT NULL,
  mecz_id INT REFERENCES mecze(id),
  zawodnik_id INT REFERENCES zawodnicy(id),
  klub_strzelca INT REFERENCES kluby(id),
  minuta_bramki INT NOT NULL,
  typ_bramki VARCHAR(50), -- Zgrywka, Strzał, Rzut rożny, etc.
  asystent_id INT REFERENCES zawodnicy(id),
  utworzono_bramke BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bramka_id ON bramki(bramka_id);
CREATE INDEX idx_mecz_bramki ON bramki(mecz_id);
CREATE INDEX idx_zawodnik_bramki ON bramki(zawodnik_id);
CREATE INDEX idx_klub_bramki ON bramki(klub_strzelca);

-- ============================================================
-- 9. KARTKI (ŻÓŁTE I CZERWONE)
-- ============================================================
CREATE TABLE kartki (
  id SERIAL PRIMARY KEY,
  kartka_id VARCHAR(50) UNIQUE NOT NULL,
  mecz_id INT REFERENCES mecze(id),
  zawodnik_id INT REFERENCES zawodnicy(id),
  klub INT REFERENCES kluby(id),
  typ_kartki VARCHAR(50) NOT NULL, -- Żółta, Czerwona
  minuta_kartki INT NOT NULL,
  powod_kartki VARCHAR(200),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_kartka_id ON kartki(kartka_id);
CREATE INDEX idx_mecz_kartki ON kartki(mecz_id);
CREATE INDEX idx_zawodnik_kartki ON kartki(zawodnik_id);
CREATE INDEX idx_typ_kartki ON kartki(typ_kartki);

-- ============================================================
-- 10. STATYSTYKI ZAWODNIKÓW
-- ============================================================
CREATE TABLE statystyki_zawodnikow (
  id SERIAL PRIMARY KEY,
  zawodnik_id INT REFERENCES zawodnicy(id) UNIQUE,
  liczba_meczy INT DEFAULT 0,
  gole INT DEFAULT 0,
  asysty INT DEFAULT 0,
  zolte_kartki INT DEFAULT 0,
  czerwone_kartki INT DEFAULT 0,
  minuty_grane INT DEFAULT 0,
  przeciętna_ocena DECIMAL(3, 2) DEFAULT 0.0,
  meczami_od_ostatniej_bramki INT,
  najlepszy_wynik_meczu DECIMAL(3, 2),
  sezon VARCHAR(10) DEFAULT '2026/2027',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_zawodnik_stat ON statystyki_zawodnikow(zawodnik_id);
CREATE INDEX idx_sezon_stat ON statystyki_zawodnikow(sezon);

-- ============================================================
-- 11. STATYSTYKI KLUBÓW
-- ============================================================
CREATE TABLE statystyki_klubow (
  id SERIAL PRIMARY KEY,
  klub_id INT REFERENCES kluby(id) UNIQUE,
  liczba_meczy INT DEFAULT 0,
  wygrane INT DEFAULT 0,
  remisy INT DEFAULT 0,
  przegrane INT DEFAULT 0,
  bramki_zdobyte INT DEFAULT 0,
  bramki_stracone INT DEFAULT 0,
  róznica_bramek INT DEFAULT 0,
  punkty INT DEFAULT 0,
  średnia_bramek_na_mecz DECIMAL(4, 2) DEFAULT 0.0,
  sezon VARCHAR(10) DEFAULT '2026/2027',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_klub_stat ON statystyki_klubow(klub_id);

-- ============================================================
-- 12. KLASYFIKACJA SEZONU
-- ============================================================
CREATE TABLE klasyfikacja_sezonu (
  id SERIAL PRIMARY KEY,
  pozycja INT NOT NULL,
  klub_id INT REFERENCES kluby(id),
  liga_id INT REFERENCES ligi_rejonowe(id),
  liczba_meczy INT DEFAULT 0,
  wygrane INT DEFAULT 0,
  remisy INT DEFAULT 0,
  przegrane INT DEFAULT 0,
  bramki_zdobyte INT DEFAULT 0,
  bramki_stracone INT DEFAULT 0,
  róznica_bramek INT DEFAULT 0,
  punkty INT DEFAULT 0,
  sezon VARCHAR(10) DEFAULT '2026/2027',
  UNIQUE(liga_id, pozycja, sezon),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_klasyfikacja_liga ON klasyfikacja_sezonu(liga_id);
CREATE INDEX idx_klasyfikacja_pozycja ON klasyfikacja_sezonu(pozycja);

-- ============================================================
-- 13. LOGOWANIE ZMIAN
-- ============================================================
CREATE TABLE logi_zmian (
  id SERIAL PRIMARY KEY,
  tabela_nazwa VARCHAR(100) NOT NULL,
  id_rekordu INT,
  typ_operacji VARCHAR(50) NOT NULL, -- INSERT, UPDATE, DELETE
  stare_wartosci JSONB,
  nowe_wartosci JSONB,
  uzytkownik_id INT,
  uzytkownik_nazwa VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logi_tabela ON logi_zmian(tabela_nazwa);
CREATE INDEX idx_logi_data ON logi_zmian(created_at);

-- ============================================================
-- VIEWS (WIDOKI)
-- ============================================================

-- Widok: Top Strzelcy Sezonu
CREATE VIEW top_strzelcy_sezonu AS
SELECT 
  z.zawodnik_id,
  CONCAT(z.imie, ' ', z.nazwisko) as zawodnik_pelnin_nazwa,
  k.nazwa_klubu,
  COUNT(DISTINCT b.id) as liczba_goli,
  COUNT(DISTINCT CASE WHEN b.asystent_id = z.id THEN b.id END) as asysty,
  COUNT(DISTINCT CASE WHEN b.asystent_id = z.id THEN b.id END) + COUNT(DISTINCT b.id) as gole_i_asysty
FROM zawodnicy z
LEFT JOIN bramki b ON z.id = b.zawodnik_id OR z.id = b.asystent_id
LEFT JOIN kluby k ON z.klub_id = k.id
GROUP BY z.zawodnik_id, z.imie, z.nazwisko, k.nazwa_klubu
ORDER BY liczba_goli DESC;

-- Widok: Klasyfikacja z objaśnieniami
CREATE VIEW klasyfikacja_pełna AS
SELECT 
  k.pozycja,
  klub.nazwa_klubu,
  k.liczba_meczy,
  k.wygrane,
  k.remisy,
  k.przegrane,
  CONCAT(k.bramki_zdobyte, ':', k.bramki_stracone) as bilans_bramek,
  k.róznica_bramek,
  k.punkty,
  CASE 
    WHEN k.pozycja <= 2 THEN 'Promocja'
    WHEN k.pozycja > 20 THEN 'Degradacja'
    ELSE 'Utrzymanie'
  END as status_sportowy
FROM klasyfikacja_sezonu k
LEFT JOIN kluby klub ON k.klub_id = klub.id
ORDER BY k.pozycja ASC;

-- ============================================================
-- TRIGGERS (WYZWALACZE)
-- ============================================================

-- Trigger: Automatyczna aktualizacja liczby zawodników w klubie
CREATE OR REPLACE FUNCTION update_liczba_zawodnikow()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE kluby 
  SET liczba_zawodnikow = (SELECT COUNT(*) FROM zawodnicy WHERE klub_id = NEW.klub_id)
  WHERE id = NEW.klub_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_zawodnicy
AFTER INSERT OR DELETE ON zawodnicy
FOR EACH ROW
EXECUTE FUNCTION update_liczba_zawodnikow();

-- Trigger: Automatyczne logowanie zmian
CREATE OR REPLACE FUNCTION log_zmian()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO logi_zmian (tabela_nazwa, id_rekordu, typ_operacji, nowe_wartosci)
  VALUES (TG_TABLE_NAME, NEW.id, TG_OP::text, row_to_json(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- FUNKCJE OBLICZENIOWE
-- ============================================================

-- Funkcja: Obliczenie punktów
CREATE OR REPLACE FUNCTION oblicz_punkty(wygrane INT, remisy INT, przegrane INT)
RETURNS INT AS $$
BEGIN
  RETURN (wygrane * 3) + (remisy * 1);
END;
$$ LANGUAGE plpgsql;

-- Funkcja: Różnica bramek
CREATE OR REPLACE FUNCTION oblicz_roznice_bramek(bramki_zdobyte INT, bramki_stracone INT)
RETURNS INT AS $$
BEGIN
  RETURN bramki_zdobyte - bramki_stracone;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- CONSTRAINTS I INDEKSY DODATKOWE
-- ============================================================

-- Alter tables dla constraints
ALTER TABLE zawodnicy 
ADD CONSTRAINT check_wiek_zawodnika CHECK (EXTRACT(YEAR FROM AGE(data_urodzenia)) >= 16),
ADD CONSTRAINT check_numer_koszulki CHECK (numer_koszulki >= 1 AND numer_koszulki <= 99);

ALTER TABLE trenery 
ADD CONSTRAINT check_wiek_trenera CHECK (EXTRACT(YEAR FROM AGE(data_urodzenia)) >= 25);

ALTER TABLE mecze 
ADD CONSTRAINT check_daty_meczu CHECK (data_meczu >= '2026-08-01' AND data_meczu <= '2027-06-30'),
ADD CONSTRAINT check_bramki_bramki CHECK (wynik_gospodarzy >= 0 AND wynik_gosci >= 0 OR wynik_gospodarzy IS NULL);

ALTER TABLE bramki 
ADD CONSTRAINT check_minuta_bramki CHECK (minuta_bramki >= 1 AND minuta_bramki <= 120);

ALTER TABLE kartki 
ADD CONSTRAINT check_minuta_kartki CHECK (minuta_kartki >= 1 AND minuta_kartki <= 120);

-- ============================================================
-- DANE TESTOWE (SAMPLE DATA)
-- ============================================================

-- Już zawarte w głównym pliku baza_iv_liga.md

-- ============================================================
-- KONIEC SCHEMATU BAZY DANYCH
-- ============================================================
