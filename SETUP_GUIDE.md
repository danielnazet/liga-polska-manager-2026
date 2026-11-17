# 🛠️ Przewodnik Instalacji - IV Liga Baza Danych

## 📋 Wymagania Systemowe

- **PostgreSQL** 12+ LUB **MySQL** 8.0+
- **Git** (do klonowania repo)
- **Node.js** 16+ (opcjonalnie - dla API)
- **8 GB RAM** minimum
- **50 GB wolnego miejsca** na dysku

---

## 🚀 Szybki Start (5 minut)

### Opcja 1: PostgreSQL

#### 1. Zainstalować PostgreSQL
```bash
# Windows (Chocolatey)
choco install postgresql

# macOS (Homebrew)
brew install postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
```

#### 2. Uruchomić PostgreSQL
```bash
# Windows
net start postgresql-x64-15

# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql
```

#### 3. Stworzyć bazę danych
```bash
# Zalogować się do PostgreSQL
psql -U postgres

# W psql:
CREATE DATABASE liga_iv_2026_2027 
  WITH ENCODING 'UTF8' 
  LC_COLLATE 'C' 
  LC_CTYPE 'C';

\c liga_iv_2026_2027
```

#### 4. Importować schemat
```bash
psql -U postgres -d liga_iv_2026_2027 -f database_schema_iv_liga.sql
```

#### 5. Importować dane testowe
```bash
psql -U postgres -d liga_iv_2026_2027 -f database_sample_data.sql
```

#### 6. Weryfikacja
```bash
psql -U postgres -d liga_iv_2026_2027 -c "SELECT COUNT(*) as kluby FROM kluby;"
```

---

### Opcja 2: Docker (Rekomendowane)

#### 1. Zainstalować Docker
```bash
# Download z https://www.docker.com/products/docker-desktop
# Lub za pomocą brew
brew install docker
```

#### 2. Stworzyć `docker-compose.yml`
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: liga_postgres
    environment:
      POSTGRES_USER: liga_user
      POSTGRES_PASSWORD: liga_password
      POSTGRES_DB: liga_iv_2026_2027
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database_schema_iv_liga.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./database_sample_data.sql:/docker-entrypoint-initdb.d/02-data.sql
    networks:
      - liga_network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U liga_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: liga_pgadmin
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@example.com
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    networks:
      - liga_network
    depends_on:
      - postgres

volumes:
  postgres_data:

networks:
  liga_network:
    driver: bridge
```

#### 3. Uruchomić Docker Compose
```bash
docker-compose up -d
```

#### 4. Czekać na inicjalizację (30-60 sekund)
```bash
docker-compose logs -f postgres
```

#### 5. Połączyć się do bazy
```bash
# Terminal
psql -h localhost -U liga_user -d liga_iv_2026_2027 -c "SELECT version();"

# PgAdmin (web)
# http://localhost:5050
# email: admin@example.com
# hasło: admin
```

---

## 🔧 Konfiguracja Node.js API (Opcjonalnie)

### 1. Instalacja zależności
```bash
cd /path/to/liga
npm install pg express cors dotenv
```

### 2. Stworzyć `.env`
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=liga_user
DB_PASSWORD=liga_password
DB_NAME=liga_iv_2026_2027
API_PORT=3000
```

### 3. Stworzyć `server.js`
```javascript
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Endpoints
app.get('/api/kluby', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM kluby LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/zawodnicy/:klub_id', async (req, res) => {
  try {
    const { klub_id } = req.params;
    const result = await pool.query(
      `SELECT z.*, p.nazwa_pozycji FROM zawodnicy z
       JOIN pozycje p ON z.pozycja_id = p.id
       WHERE z.klub_id = $1`,
      [klub_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/klasyfikacja/:liga_id', async (req, res) => {
  try {
    const { liga_id } = req.params;
    const result = await pool.query(
      `SELECT k.pozycja, kl.nazwa_klubu, k.liczba_meczy, 
              k.punkty, k.bramki_zdobyte, k.bramki_stracone
       FROM klasyfikacja_sezonu k
       JOIN kluby kl ON k.klub_id = kl.id
       WHERE k.liga_id = $1
       ORDER BY k.pozycja`,
      [liga_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/top-strzelcy', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM top_strzelcy_sezonu LIMIT 10`
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.API_PORT || 3000;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});
```

### 4. Uruchomić serwer
```bash
node server.js
# API running on http://localhost:3000
```

---

## 🌐 Integracja z React (Opcjonalnie)

### 1. Zainstalować w projekcie
```bash
npm install axios react-query
```

### 2. Stworzyć `lib/api.ts`
```typescript
import axios from 'axios';

const API_BASE = 'http://localhost:3000/api';

export const liga = {
  getKluby: () => axios.get(`${API_BASE}/kluby`),
  getZawodnicy: (klubId: number) => axios.get(`${API_BASE}/zawodnicy/${klubId}`),
  getKlasyfikacja: (ligaId: number) => axios.get(`${API_BASE}/klasyfikacja/${ligaId}`),
  getTopStrzelcy: () => axios.get(`${API_BASE}/top-strzelcy`),
};
```

### 3. Użyć w komponencie
```typescript
import { useQuery } from 'react-query';
import { liga } from '@/lib/api';

export function TopStrzelcy() {
  const { data, isLoading } = useQuery('top-strzelcy', () => 
    liga.getTopStrzelcy().then(res => res.data)
  );

  if (isLoading) return <div>Ładowanie...</div>;

  return (
    <div>
      {data?.map((strzelec) => (
        <div key={strzelec.zawodnik_id}>
          <h3>{strzelec.zawodnik_pelnin_nazwa}</h3>
          <p>{strzelec.liczba_goli} goli</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📊 Backupy & Maintenance

### Automatyczny Backup (Cron Job)

#### Linux/macOS
```bash
# Edytować crontab
crontab -e

# Dodać linie:
# Backup codziennie o 2:00 AM
0 2 * * * pg_dump -U liga_user liga_iv_2026_2027 > /backups/liga_$(date +\%Y\%m\%d).sql

# Backup co godzinę
0 * * * * pg_dump -U liga_user liga_iv_2026_2027 > /backups/liga_hourly.sql
```

#### Windows (Task Scheduler)
```batch
# backup.bat
@echo off
set BACKUP_DIR=C:\Backups\Liga
set TIMESTAMP=%date:~-4,4%%date:~-10,2%%date:~-7,2%_%time:~0,2%%time:~3,2%
set TIMESTAMP=%TIMESTAMP: =0%

pg_dump -h localhost -U liga_user -d liga_iv_2026_2027 > %BACKUP_DIR%\liga_%TIMESTAMP%.sql

echo Backup completed: %TIMESTAMP%
```

Dodać do Task Scheduler z opcją codziennego uruchomienia.

### Restore z Backupu
```bash
# Usuń starą bazę
psql -U postgres -c "DROP DATABASE liga_iv_2026_2027;"

# Stworź nową
psql -U postgres -c "CREATE DATABASE liga_iv_2026_2027;"

# Przywróć z backupu
psql -U postgres -d liga_iv_2026_2027 < /backups/liga_20261117.sql
```

---

## 🔍 Testowanie Bazy

### Test 1: Połączenie
```bash
psql -h localhost -U liga_user -d liga_iv_2026_2027 -c "SELECT NOW();"
```

### Test 2: Ilość danych
```sql
SELECT 
  (SELECT COUNT(*) FROM wojewodztwa) as wojewodztwa,
  (SELECT COUNT(*) FROM ligi_rejonowe) as ligi,
  (SELECT COUNT(*) FROM kluby) as kluby,
  (SELECT COUNT(*) FROM zawodnicy) as zawodnicy,
  (SELECT COUNT(*) FROM mecze) as mecze;
```

### Test 3: Top Zapytania
```sql
-- Najlepszy strzelec
SELECT * FROM top_strzelcy_sezonu LIMIT 1;

-- Klasyfikacja IV Liga Mazowiecka I
SELECT * FROM klasyfikacja_pełna 
WHERE liga_id = 1 
ORDER BY pozycja LIMIT 5;

-- Mecze klubu
SELECT m.data_meczu, k1.nazwa_klubu, k2.nazwa_klubu, 
       m.wynik_gospodarzy, m.wynik_gosci
FROM mecze m
JOIN kluby k1 ON m.klub_gospodarzy = k1.id
JOIN kluby k2 ON m.klub_gosci = k2.id
LIMIT 5;
```

---

## 🐛 Troubleshooting

### Problem: "psql: command not found"
**Rozwiązanie:**
```bash
# Dodaj do PATH
export PATH="/usr/local/opt/postgresql@15/bin:$PATH"
# Lub zainstaluj PostgreSQL client oddzielnie
brew install postgresql
```

### Problem: "FATAL: password authentication failed"
**Rozwiązanie:**
```bash
# Reset hasła PostgreSQL
sudo -u postgres psql
ALTER USER postgres WITH PASSWORD 'new_password';
\q
```

### Problem: "Database is locked"
**Rozwiązanie:**
```sql
-- Połącz się z systemową bazą
\c postgres

-- Ustaw bazy offline
ALTER DATABASE liga_iv_2026_2027 SET allow_connections = off;

-- Zamknij wszystkie połączenia
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE datname = 'liga_iv_2026_2027';

-- Włącz z powrotem
ALTER DATABASE liga_iv_2026_2027 SET allow_connections = on;
```

### Problem: "Memory error" przy imporcie
**Rozwiązanie:**
```bash
# Zwiększyć buffer
psql -h localhost -U liga_user -d liga_iv_2026_2027 \
  -v ON_ERROR_STOP=on \
  < database_sample_data.sql
```

---

## 📈 Monitoring

### Monitorować Połączenia
```sql
SELECT * FROM pg_stat_activity;
```

### Monitorować Zapytania (Top 10)
```sql
SELECT query, calls, mean_time, max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

### Rozmiar Bazy
```sql
SELECT 
  schemaname,
  SUM(pg_total_relation_size(schemaname||'.'||tablename)) / 1024 / 1024 AS size_mb
FROM pg_tables
GROUP BY schemaname
ORDER BY size_mb DESC;
```

---

## ✅ Checklist Wdrożenia

- [ ] Zainstalować PostgreSQL
- [ ] Stworzyć bazę `liga_iv_2026_2027`
- [ ] Importować `database_schema_iv_liga.sql`
- [ ] Importować `database_sample_data.sql`
- [ ] Przetestować połączenie
- [ ] Sprawdzić ilość danych
- [ ] Skonfigurować backupy
- [ ] Ustawić monitoring
- [ ] Zainstalować Node.js API (opcja)
- [ ] Testować API endpoints
- [ ] Skonfigurować CORS
- [ ] Przygotować dokumentację dla użytkowników

---

## 📞 Gdzie Szukać Pomocy

| Problem | Plik | Linia |
|---------|------|-------|
| SQL Schema | `database_schema_iv_liga.sql` | 1-500 |
| Dane Testowe | `database_sample_data.sql` | 1-350 |
| Dokumentacja | `DATABASE_DOCUMENTATION.md` | Wszelkie |
| Zapytania | `IV_LIGA_PROJECT_SUMMARY.md` | Use Cases |

---

## 🎯 Następne Kroki

1. ✅ Instalacja bazy - **WYKONANE**
2. → Integracja z aplikacją
3. → Wdrożenie API
4. → Deployment na produkcję
5. → Monitoring i maintenance

---

*Przewodnik Installation: v1.0*
*Data: 17 listopada 2026*
