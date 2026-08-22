-- ====================================================================
-- POLSKA LIGA MANAGER 2026 - SCHEMA & SEED BAZY DANYCH SUPABASE (PostgreSQL)
-- OFICJALNA STRUKTURA POLSKICH LIG PIŁKARSKICH (POZIOMY I - IX)
-- ====================================================================

-- 1. TABELA LIG (LEAGUES)
CREATE TABLE IF NOT EXISTS leagues (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  tier INT NOT NULL,
  relegation_spots INT DEFAULT 3,
  promotion_spots INT DEFAULT 2,
  playoff_spots INT DEFAULT 0
);

-- 2. TABELA ZESPOŁÓW (CLUBS)
CREATE TABLE IF NOT EXISTS clubs (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  city TEXT NOT NULL,
  league_id TEXT REFERENCES leagues(id) ON DELETE SET NULL,
  primary_color TEXT NOT NULL DEFAULT '#059669',
  secondary_color TEXT NOT NULL DEFAULT '#ffffff',
  reputation INT NOT NULL DEFAULT 50,
  stadium_capacity INT NOT NULL DEFAULT 5000,
  stadium_seated INT NOT NULL DEFAULT 5000,
  has_floodlights BOOLEAN DEFAULT false,
  has_heated_pitch BOOLEAN DEFAULT false,
  ticket_price INT NOT NULL DEFAULT 35,
  medical_level INT DEFAULT 1,
  youth_academy_level INT DEFAULT 1,
  training_facility_level INT DEFAULT 1,
  balance BIGINT NOT NULL DEFAULT 1000000,
  wage_budget INT NOT NULL DEFAULT 150000,
  transfer_budget BIGINT NOT NULL DEFAULT 500000,
  season_ticket_holders INT NOT NULL DEFAULT 1000,
  main_sponsor_weekly INT NOT NULL DEFAULT 30000,
  stadium_bands_weekly INT NOT NULL DEFAULT 15000,
  tv_rights_weekly INT NOT NULL DEFAULT 35000,
  bank_loan BIGINT DEFAULT 0,
  bank_loan_weekly_payment INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. TABELA ZAWODNIKÓW (PLAYERS)
CREATE TABLE IF NOT EXISTS players (
  id TEXT PRIMARY KEY,
  club_id TEXT REFERENCES clubs(id) ON DELETE SET NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('BR', 'OB', 'PO', 'NA')),
  overall INT NOT NULL DEFAULT 60,
  goalkeeping INT NOT NULL DEFAULT 50,
  defending INT NOT NULL DEFAULT 50,
  playmaking INT NOT NULL DEFAULT 50,
  scoring INT NOT NULL DEFAULT 50,
  condition INT NOT NULL DEFAULT 100,
  form INT NOT NULL DEFAULT 7,
  morale INT NOT NULL DEFAULT 8,
  stamina INT NOT NULL DEFAULT 70,
  salary INT NOT NULL DEFAULT 2000,
  contract_years INT NOT NULL DEFAULT 2,
  market_value BIGINT NOT NULL DEFAULT 100000,
  is_injured BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. TABELA ZAPISÓW GRY (GAME SAVES)
CREATE TABLE IF NOT EXISTS game_saves (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  game_mode TEXT DEFAULT 'single_player',
  season INT DEFAULT 1,
  current_round INT DEFAULT 1,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Włączenie Row Level Security (RLS)
ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_saves ENABLE ROW LEVEL SECURITY;

-- Polityki dostępu
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read leagues') THEN
    CREATE POLICY "Public read leagues" ON leagues FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read clubs') THEN
    CREATE POLICY "Public read clubs" ON clubs FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read players') THEN
    CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Access game_saves') THEN
    CREATE POLICY "Access game_saves" ON game_saves FOR ALL USING (true) WITH CHECK (true);
  END IF;
END $$;

-- ====================================================================
-- SEED POLSKIEJ STRUKTURY LIGOWEJ (POZIOMY I - IX)
-- ====================================================================

INSERT INTO leagues (id, name, short_name, tier, relegation_spots, promotion_spots, playoff_spots) VALUES
('ekstraklasa', 'PKO BP Ekstraklasa', 'EKS', 1, 3, 0, 0),
('pierwsza_liga', 'Betclic 1. Liga', '1L', 2, 3, 2, 4),
('druga_liga', 'Betclic 2. Liga', '2L', 3, 4, 2, 4),
('trzecia_liga', 'Betclic 3. Liga (Gr. IV)', '3L', 4, 3, 1, 0),
('czwarta_liga', 'IV Liga Wojewódzka', '4L', 5, 3, 1, 2),
('v_liga_okregowka', 'V Liga / Klasa Okręgowa', '5L', 6, 2, 1, 2),
('klasa_a', 'Klasa A (Regionalna)', 'KL-A', 7, 2, 1, 1),
('klasa_b_warszawa', 'Klasa B (Warszawa I)', 'KB-WA1', 8, 1, 2, 0),
('klasa_b_siedlce', 'Klasa B (Siedlce)', 'KB-SIE', 8, 1, 2, 0),
('klasa_b_katowice', 'Klasa B (Katowice)', 'KB-KAT', 8, 1, 2, 0),
('klasa_b_sosnowiec', 'Klasa B (Sosnowiec)', 'KB-SOS', 8, 1, 2, 0),
('klasa_b_krakow', 'Klasa B (Kraków I)', 'KB-KR1', 8, 1, 2, 0),
('klasa_b_legnica', 'Klasa B (Legnica I)', 'KB-LEG', 8, 1, 2, 0),
('klasa_b_poznan', 'Klasa B (Poznań I)', 'KB-POZ', 8, 1, 2, 0),
('klasa_b_lodz', 'Klasa B (Łódź I)', 'KB-LOD', 8, 1, 2, 0),
('klasa_c_zabrze', 'Klasa C (Grupa Zabrze)', 'KC-ZAB', 9, 0, 2, 0),
('klasa_c_raciborz', 'Klasa C (Grupa Racibórz)', 'KC-RAC', 9, 0, 2, 0)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  tier = EXCLUDED.tier;

-- ====================================================================
-- SEED KLUBÓW KLASY B (VIII SZCZEBEL)
-- ====================================================================

INSERT INTO clubs (id, name, short_name, city, league_id, primary_color, secondary_color, reputation, stadium_capacity, stadium_seated, has_floodlights, has_heated_pitch, ticket_price, balance, wage_budget, transfer_budget, season_ticket_holders, main_sponsor_weekly, stadium_bands_weekly, tv_rights_weekly) VALUES
-- MAZOWIECKIE - WARSZAWA I
('blyskawica_warszawa', 'Błyskawica Warszawa', 'BLW', 'Warszawa', 'klasa_b_warszawa', '#0055A5', '#FFFFFF', 44, 600, 200, false, false, 8, 60000, 5500, 5000, 50, 700, 150, 300),
('impet_lajski', 'Impet Łajski', 'IMP', 'Łajski', 'klasa_b_warszawa', '#16A34A', '#FFFFFF', 42, 400, 150, false, false, 8, 50000, 4800, 4000, 40, 600, 120, 300),
('lider_zakroczym', 'Lider Zakroczym', 'LID', 'Zakroczym', 'klasa_b_warszawa', '#F59E0B', '#000000', 43, 500, 180, false, false, 8, 55000, 5000, 4500, 45, 650, 140, 300),
('mewa_krubin', 'Mewa Krubin', 'MEW', 'Krubin', 'klasa_b_warszawa', '#0284C7', '#FFFFFF', 41, 400, 120, false, false, 8, 48000, 4500, 3500, 35, 550, 100, 300),
('wisla_jablonna', 'Wisła Jabłonna', 'WJA', 'Jabłonna', 'klasa_b_warszawa', '#0055A5', '#C8102E', 44, 650, 250, true, false, 8, 65000, 5800, 5500, 55, 750, 180, 300),
('rzadza_zalubice', 'Rządza Załubice', 'RZA', 'Załubice', 'klasa_b_warszawa', '#16A34A', '#F59E0B', 42, 450, 150, false, false, 8, 52000, 4800, 4000, 40, 600, 120, 300),
('lotnisko_modlin', 'Lotnisko Modlin', 'LMO', 'Nowy Dwór Maz.', 'klasa_b_warszawa', '#0055A5', '#F59E0B', 45, 800, 300, true, false, 8, 70000, 6200, 6000, 70, 800, 200, 300),
('apjd_lomianki', 'APJD Łomianki', 'LOM', 'Łomianki', 'klasa_b_warszawa', '#C8102E', '#000000', 43, 550, 200, false, false, 8, 56000, 5100, 4500, 45, 660, 150, 300),
('aon_rembertow', 'AON Rembertów', 'AON', 'Warszawa', 'klasa_b_warszawa', '#006837', '#FFFFFF', 44, 600, 250, false, false, 8, 62000, 5500, 5000, 50, 700, 160, 300),
('bor_regut', 'Bór Regut', 'BOR', 'Regut', 'klasa_b_warszawa', '#16A34A', '#000000', 42, 450, 150, false, false, 8, 50000, 4700, 4000, 40, 580, 120, 300),
('gks_dabrowka', 'GKS Dąbrówka', 'DAB', 'Dąbrówka', 'klasa_b_warszawa', '#F59E0B', '#0055A5', 41, 400, 120, false, false, 8, 48000, 4500, 3500, 35, 550, 100, 300),
('wisla_dziecinow', 'Wisła Dziecinów', 'WIE', 'Dziecinów', 'klasa_b_warszawa', '#0284C7', '#C8102E', 42, 450, 150, false, false, 8, 51000, 4700, 4000, 40, 590, 120, 300),

-- MAZOWIECKIE - SIEDLCE
('jastrzab_zeliszew', 'Jastrząb Żeliszew', 'JZE', 'Żeliszew', 'klasa_b_siedlce', '#0055A5', '#FFFFFF', 42, 400, 150, false, false, 8, 48000, 4500, 3500, 35, 550, 100, 300),
('grom_kazanow', 'Grom Kazanów', 'GKA', 'Kazanów', 'klasa_b_siedlce', '#16A34A', '#FFFFFF', 41, 350, 120, false, false, 8, 45000, 4200, 3000, 30, 500, 90, 300),
('lks_ostrowek', 'LKS Ostrówek', 'OST', 'Ostrówek', 'klasa_b_siedlce', '#F59E0B', '#16A34A', 42, 400, 150, false, false, 8, 49000, 4600, 3800, 40, 560, 110, 300),
('zorza_sterdyn', 'Zorza Sterdyń', 'ZST', 'Sterdyń', 'klasa_b_siedlce', '#C8102E', '#FFFFFF', 41, 350, 120, false, false, 8, 44000, 4200, 3000, 30, 500, 90, 300),
('amazonka_wisniew', 'Amazonka Wiśniew', 'AMW', 'Wiśniew', 'klasa_b_siedlce', '#16A34A', '#000000', 43, 500, 180, false, false, 8, 54000, 4900, 4200, 45, 620, 130, 300),
('kolektyw_olesnica', 'Kolektyw Oleśnica', 'KOL', 'Oleśnica', 'klasa_b_siedlce', '#0055A5', '#F59E0B', 42, 450, 150, false, false, 8, 50000, 4700, 3900, 40, 580, 120, 300),
('polonez_mordy', 'Polonez Mordy', 'PMO', 'Mordy', 'klasa_b_siedlce', '#C8102E', '#0055A5', 43, 500, 180, false, false, 8, 53000, 4800, 4100, 45, 600, 130, 300),
('grodzisk_sabnie', 'Grodzisk Sabnie', 'GSA', 'Sabnie', 'klasa_b_siedlce', '#006837', '#FFFFFF', 41, 380, 120, false, false, 8, 46000, 4300, 3200, 35, 520, 100, 300),

-- ŚLĄSKIE - KATOWICE
('mk_gornik_2_katowice', 'MK Górnik II Katowice', 'MK2', 'Katowice', 'klasa_b_katowice', '#0055A5', '#FFFFFF', 44, 600, 200, false, false, 8, 60000, 5500, 5000, 50, 700, 150, 300),
('uks_szopienice', 'UKS Szopienice', 'SZO', 'Katowice', 'klasa_b_katowice', '#16A34A', '#F59E0B', 43, 500, 180, false, false, 8, 54000, 5000, 4200, 45, 620, 130, 300),
('hetman_22_katowice', 'Hetman 22 Katowice', 'HET', 'Katowice', 'klasa_b_katowice', '#C8102E', '#FFFFFF', 43, 550, 200, false, false, 8, 56000, 5100, 4500, 45, 650, 140, 300),
('gornik_wesola', 'Górnik Wesoła', 'WES', 'Mysłowice', 'klasa_b_katowice', '#16A34A', '#000000', 44, 650, 250, false, false, 8, 62000, 5600, 5200, 55, 720, 160, 300),
('naprzod_2_lipiny', 'Naprzód II Lipiny', 'LIP', 'Świętochłowice', 'klasa_b_katowice', '#0055A5', '#C8102E', 42, 450, 150, false, false, 8, 50000, 4700, 3800, 40, 580, 120, 300),
('jastrzab_2_bielszowice', 'Jastrząb II Bielszowice', 'JBI', 'Ruda Śląska', 'klasa_b_katowice', '#0055A5', '#16A34A', 42, 450, 150, false, false, 8, 49000, 4600, 3700, 40, 560, 110, 300),
('slawia_2_ruda_slaska', 'Sławia II Ruda Śląska', 'SLA', 'Ruda Śląska', 'klasa_b_katowice', '#006837', '#FFFFFF', 43, 500, 180, false, false, 8, 53000, 4900, 4100, 45, 610, 130, 300),
('siemianowiczanka_2', 'Siemianowiczanka II', 'SIE', 'Siemianowice Śl.', 'klasa_b_katowice', '#C8102E', '#000000', 43, 550, 200, false, false, 8, 55000, 5000, 4300, 45, 630, 140, 300),

-- ŚLĄSKIE - SOSNOWIEC
('zaglebie_2_sosnowiec_amat', 'Zagłębie II Sosnowiec (Amatorska)', 'ZSA', 'Sosnowiec', 'klasa_b_sosnowiec', '#C8102E', '#FFFFFF', 45, 800, 300, true, false, 8, 70000, 6200, 6000, 65, 800, 200, 300),
('gornik_2_piaski', 'Górnik II Piaski', 'GPI', 'Czeladź', 'klasa_b_sosnowiec', '#16A34A', '#000000', 42, 450, 150, false, false, 8, 50000, 4700, 3800, 40, 580, 120, 300),
('sks_2_choszczowka', 'SKS II Choszczówka', 'SK2', 'Sosnowiec', 'klasa_b_sosnowiec', '#0055A5', '#F59E0B', 41, 400, 120, false, false, 8, 47000, 4400, 3400, 35, 540, 100, 300),
('promien_strzemieszyce', 'Promień Strzemieszyce Małe', 'PSM', 'Dąbrowa Górnicza', 'klasa_b_sosnowiec', '#F59E0B', '#000000', 43, 500, 180, false, false, 8, 54000, 4900, 4200, 45, 620, 130, 300),
('zew_kazimierz', 'Zew Kazimierz', 'ZEW', 'Sosnowiec', 'klasa_b_sosnowiec', '#0055A5', '#C8102E', 44, 600, 220, false, false, 8, 59000, 5300, 4800, 50, 680, 150, 300),
('ceti_boguchwalowice', 'Ceti Boguchwałowice', 'CET', 'Boguchwałowice', 'klasa_b_sosnowiec', '#16A34A', '#FFFFFF', 41, 350, 100, false, false, 8, 45000, 4200, 3000, 30, 500, 90, 300),
('lks_wysoka', 'LKS Wysoka', 'WYS', 'Wysoka', 'klasa_b_sosnowiec', '#F59E0B', '#C8102E', 42, 400, 150, false, false, 8, 48000, 4500, 3500, 35, 550, 100, 300),
('blyskawica_preczow', 'Błyskawica Preczów', 'BPR', 'Preczów', 'klasa_b_sosnowiec', '#0284C7', '#FFFFFF', 42, 450, 150, false, false, 8, 51000, 4700, 3900, 40, 580, 120, 300),

-- MAŁOPOLSKIE - KRAKÓW I
('wawel_krakow', 'Wawel Kraków', 'WAW', 'Kraków', 'klasa_b_krakow', '#0055A5', '#C8102E', 46, 1000, 400, true, false, 10, 80000, 6800, 7500, 80, 900, 250, 300),
('kolejarz_krakow', 'Kolejarz Kraków', 'KOL', 'Kraków', 'klasa_b_krakow', '#006837', '#FFFFFF', 44, 650, 250, false, false, 8, 64000, 5600, 5300, 55, 740, 170, 300),
('pychowianka_krakow', 'Pychowianka Kraków', 'PYC', 'Kraków', 'klasa_b_krakow', '#F59E0B', '#000000', 43, 500, 180, false, false, 8, 55000, 5000, 4400, 45, 640, 140, 300),
('tramwaj_2_krakow', 'Tramwaj II Kraków', 'TR2', 'Kraków', 'klasa_b_krakow', '#C8102E', '#FFFFFF', 43, 550, 200, false, false, 8, 56000, 5100, 4500, 45, 650, 140, 300),
('blekitni_2_modlnica', 'Błękitni II Modlnica', 'BL2', 'Modlnica', 'klasa_b_krakow', '#0284C7', '#FFFFFF', 42, 450, 150, false, false, 8, 50000, 4700, 3800, 40, 580, 120, 300),
('niedzwiedz_2', 'Niedźwiedź II', 'ND2', 'Niedźwiedź', 'klasa_b_krakow', '#16A34A', '#000000', 41, 400, 120, false, false, 8, 47000, 4400, 3300, 35, 530, 100, 300),
('zelkow_2', 'Zelków II', 'ZE2', 'Zelków', 'klasa_b_krakow', '#0055A5', '#FFFFFF', 41, 380, 120, false, false, 8, 46000, 4300, 3200, 35, 520, 100, 300),
('sankowia_sanka', 'Sankowia Sanka', 'SAN', 'Sanka', 'klasa_b_krakow', '#F59E0B', '#C8102E', 42, 420, 140, false, false, 8, 49000, 4600, 3600, 40, 560, 110, 300),

-- DOLNOŚLĄSKIE - LEGNICA I
('victoria_siciny', 'Victoria Siciny', 'VSI', 'Siciny', 'klasa_b_legnica', '#16A34A', '#FFFFFF', 42, 400, 150, false, false, 8, 48000, 4500, 3500, 35, 550, 100, 300),
('sparta_2_grebocice', 'Sparta II Grębocice', 'SP2', 'Grębocice', 'klasa_b_legnica', '#C8102E', '#FFFFFF', 43, 500, 180, false, false, 8, 53000, 4900, 4100, 45, 610, 130, 300),
('lzs_kozlice', 'LZS Koźlice', 'KOZ', 'Koźlice', 'klasa_b_legnica', '#F59E0B', '#16A34A', 41, 350, 120, false, false, 8, 45000, 4200, 3000, 30, 500, 90, 300),
('piast_2_rzeczyca', 'Piast II Rzeczyca', 'PRZ', 'Rzeczyca', 'klasa_b_legnica', '#0055A5', '#C8102E', 42, 420, 140, false, false, 8, 49000, 4600, 3600, 40, 560, 110, 300),
('iskra_nielubia', 'Iskra Nielubia', 'ISK', 'Nielubia', 'klasa_b_legnica', '#0284C7', '#FFFFFF', 41, 380, 120, false, false, 8, 46000, 4300, 3200, 35, 520, 100, 300),
('ks_klobuczyn', 'KS Kłobuczyn', 'KLO', 'Kłobuczyn', 'klasa_b_legnica', '#16A34A', '#000000', 42, 400, 150, false, false, 8, 48000, 4500, 3500, 35, 550, 100, 300),
('zryw_2_kotla', 'Zryw II Kotla', 'ZK2', 'Kotla', 'klasa_b_legnica', '#C8102E', '#000000', 41, 350, 100, false, false, 8, 44000, 4200, 3000, 30, 500, 90, 300),
('perla_potoczek', 'Perła Potoczek', 'PER', 'Potoczek', 'klasa_b_legnica', '#006837', '#FFFFFF', 42, 400, 140, false, false, 8, 47000, 4400, 3400, 35, 540, 100, 300),
('pogon_2_gora', 'Pogoń II Góra', 'PG2', 'Góra', 'klasa_b_legnica', '#0055A5', '#FFFFFF', 43, 500, 180, false, false, 8, 52000, 4800, 4000, 45, 600, 120, 300),
('mieszko_ruszowice', 'Mieszko Ruszowice', 'MRU', 'Ruszowice', 'klasa_b_legnica', '#F59E0B', '#000000', 42, 450, 150, false, false, 8, 50000, 4600, 3800, 40, 570, 110, 300),

-- WIELKOPOLSKIE - POZNAŃ I
('poznan_fc', 'Poznań FC', 'PFC', 'Poznań', 'klasa_b_poznan', '#0055A5', '#FFFFFF', 45, 750, 300, true, false, 8, 70000, 6000, 6000, 65, 780, 190, 300),
('odlew_poznan', 'Odlew Poznań', 'ODL', 'Poznań', 'klasa_b_poznan', '#C8102E', '#FFFFFF', 44, 600, 250, false, false, 8, 62000, 5500, 5200, 55, 710, 160, 300),
('hajduk_2_biezdrowo', 'Hajduk II Biezdrowo', 'HB2', 'Biezdrowo', 'klasa_b_poznan', '#16A34A', '#000000', 41, 380, 120, false, false, 8, 46000, 4300, 3200, 35, 520, 100, 300),
('zloci_zlotkowo', 'Złoci Złotkowo', 'ZZL', 'Złotkowo', 'klasa_b_poznan', '#F59E0B', '#000000', 43, 500, 180, false, false, 8, 54000, 4900, 4200, 45, 620, 130, 300),
('raki_rozwarzyn', 'Raki Rozwarzyn', 'RRO', 'Rozwarzyn', 'klasa_b_poznan', '#C8102E', '#F59E0B', 42, 420, 140, false, false, 8, 49000, 4600, 3600, 40, 560, 110, 300),
('orzel_2_rostarzewo', 'Orzeł II Rostarzewo', 'OR2', 'Rostarzewo', 'klasa_b_poznan', '#0055A5', '#C8102E', 42, 450, 150, false, false, 8, 50000, 4700, 3800, 40, 580, 120, 300),
('warta_2_sierakow', 'Warta II Sieraków', 'WS2', 'Sieraków', 'klasa_b_poznan', '#16A34A', '#FFFFFF', 43, 500, 180, false, false, 8, 53000, 4900, 4100, 45, 610, 130, 300),
('grom_2_plewiska', 'Grom II Plewiska', 'GR2', 'Plewiska', 'klasa_b_poznan', '#0284C7', '#FFFFFF', 43, 550, 200, false, false, 8, 55000, 5000, 4300, 45, 630, 140, 300),

-- ŁÓDZKIE - ŁÓDŹ I
('boruta_3_zgierz', 'Boruta III Zgierz', 'BO3', 'Zgierz', 'klasa_b_lodz', '#000000', '#FFFFFF', 43, 500, 180, false, false, 8, 53000, 4900, 4100, 45, 610, 130, 300),
('stal_2_glowno', 'Stal II Głowno', 'ST2', 'Głowno', 'klasa_b_lodz', '#0055A5', '#F59E0B', 42, 450, 150, false, false, 8, 50000, 4700, 3800, 40, 580, 120, 300),
('rozwoj_glowno', 'Rozwój Głowno', 'RGL', 'Głowno', 'klasa_b_lodz', '#16A34A', '#FFFFFF', 42, 450, 150, false, false, 8, 51000, 4700, 3900, 40, 590, 120, 300),
('sokol_lutomiersk', 'Sokół Lutomiersk', 'SLU', 'Lutomiersk', 'klasa_b_lodz', '#006837', '#FFFFFF', 43, 520, 190, false, false, 8, 54000, 4900, 4200, 45, 620, 130, 300),
('wlokniarz_2_konstantynow', 'Włókniarz II Konstantynów Łódzki', 'WK2', 'Konstantynów Ł.', 'klasa_b_lodz', '#16A34A', '#000000', 43, 500, 180, false, false, 8, 52000, 4800, 4000, 45, 600, 120, 300),
('kas_2_konstantynow', 'KAS II Konstantynów', 'KA2', 'Konstantynów Ł.', 'klasa_b_lodz', '#0055A5', '#C8102E', 42, 450, 150, false, false, 8, 49000, 4600, 3700, 40, 570, 110, 300),
('bzura_2_ozorkow', 'Bzura II Ozorków', 'BZ2', 'Ozorków', 'klasa_b_lodz', '#0284C7', '#FFFFFF', 42, 450, 150, false, false, 8, 50000, 4700, 3800, 40, 580, 120, 300),
('sap_2_parzeczew', 'SAP II Parzęczew', 'SA2', 'Parzęczew', 'klasa_b_lodz', '#F59E0B', '#000000', 41, 400, 120, false, false, 8, 47000, 4400, 3400, 35, 540, 100, 300)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  short_name = EXCLUDED.short_name,
  city = EXCLUDED.city,
  league_id = EXCLUDED.league_id,
  primary_color = EXCLUDED.primary_color,
  secondary_color = EXCLUDED.secondary_color,
  reputation = EXCLUDED.reputation;
