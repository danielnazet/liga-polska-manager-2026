# Baza Danych Klubów Klasy B - Sezon 2026/2027

Ten plik zawiera zestawienie grup i klubów piłkarskich występujących na VIII poziomie rozgrywkowym (Klasa B) w Polsce, przygotowane do celów bazodanowych.

---

## 1. WOJEWÓDZTWO MAZOWIECKIE (Mazowiecki ZPN)

### Grupa Warszawa I
* **Błyskawica Warszawa** (ID: MAZ-W1-01)
* **Impet Łajski** (ID: MAZ-W1-02)
* **Lider Zakroczym** (ID: MAZ-W1-03)
* **Mewa Krubin** (ID: MAZ-W1-04)
* **Wisła Jabłonna** (ID: MAZ-W1-05)
* **Rządza Załubice** (ID: MAZ-W1-06)
* **Lotnisko Modlin** (ID: MAZ-W1-07)
* **APJD Łomianki** (ID: MAZ-W1-08)
* **AON Rembertów** (ID: MAZ-W1-09)
* **Bór Regut** (ID: MAZ-W1-10)
* **GKS Dąbrówka** (ID: MAZ-W1-11)
* **Wisła Dziecinów** (ID: MAZ-W1-12)

### Grupa Siedlce
* **Jastrząb Żeliszew** (ID: MAZ-SI-01)
* **Grom Kazanów** (ID: MAZ-SI-02)
* **LKS Ostrówek** (ID: MAZ-SI-03)
* **Zorza Stereń** (ID: MAZ-SI-04)
* **Amazonka Wiśniew** (ID: MAZ-SI-05)
* **Kolektyw Oleśnica** (ID: MAZ-SI-06)
* **Polonez Mordy** (ID: MAZ-SI-07)
* **Grodzisk Sabnie** (ID: MAZ-SI-08)

---

## 2. WOJEWÓDZTWO ŚLĄSKIE (Śląski ZPN)

### Grupa Katowice
* **MK Górnik II Katowice** (ID: SLA-KA-01)
* **UKS Szopienice** (ID: SLA-KA-02)
* **Hetman 22 Katowice** (ID: SLA-KA-03)
* **Górnik Wesoła** (ID: SLA-KA-04)
* **Naprzód II Lipiny** (ID: SLA-KA-05)
* **Jastrząb II Bielszowice** (ID: SLA-KA-06)
* **Sławia II Ruda Śląska** (ID: SLA-KA-07)
* **Siemianowiczanka II** (ID: SLA-KA-08)

### Grupa Sosnowiec
* **Zagłębie II Sosnowiec (Amatorska)** (ID: SLA-SO-01)
* **Górnik II Piaski** (ID: SLA-SO-02)
* **SKS II Ch those** (ID: SLA-SO-03)
* **Promień Strzemieszyce Małe** (ID: SLA-SO-04)
* **Zew Kazimierz** (ID: SLA-SO-05)
* **Ceti Boguchwałowice** (ID: SLA-SO-06)
* **LKS Wysoka** (ID: SLA-SO-07)
* **Błyskawica Preczów** (ID: SLA-SO-08)

---

## 3. WOJEWÓDZTWO MAŁOPOLSKIE (Małopolski ZPN)

### Grupa Kraków I
* **Wawel Kraków** (ID: MAL-KR-01)
* **Kolejarz Kraków** (ID: MAL-KR-02)
* **Pychowianka Kraków** (ID: MAL-KR-03)
* **Tramwaj II Kraków** (ID: MAL-KR-04)
* **Błękitni II Modlnica** (ID: MAL-KR-05)
* **Niedźwiedź II** (ID: MAL-KR-06)
* **Zelków II** (ID: MAL-KR-07)
* **Sankowia Sanka** (ID: MAL-KR-08)

---

## 4. WOJEWÓDZTWO DOLNOŚLĄSKIE (Dolnośląski ZPN)

### Grupa Legnica I
* **Victoria Siciny** (ID: DOL-LE-01)
* **Sparta II Grębocice** (ID: DOL-LE-02)
* **LZS Koźlice** (ID: DOL-LE-03)
* **Piast II Rzeczyca** (ID: DOL-LE-04)
* **Iskra Nielubia** (ID: DOL-LE-05)
* **KS Kłobuczyn** (ID: DOL-LE-06)
* **Zryw II Kotla** (ID: DOL-LE-07)
* **Perła Potoczek** (ID: DOL-LE-08)
* **Pogoń II Góra** (ID: DOL-LE-09)
* **Mieszko Ruszowice** (ID: DOL-LE-10)

---

## 5. WOJEWÓDZTWO WIELKOPOLSKIE (Wielkopolski ZPN)

### Grupa Poznań I
* **Poznań FC** (ID: WIE-PO-01)
* **Odlew Poznań** (ID: WIE-PO-02)
* **Hajduk II Biezdrowo** (ID: WIE-PO-03)
* **Złoci Złotkowo** (ID: WIE-PO-04)
* **Raki Rozwarzyn** (ID: WIE-PO-05)
* **Orzeł II Rostarzewo** (ID: WIE-PO-06)
* **Warta II Sieraków** (ID: WIE-PO-07)
* **派-Grom II Plewiska** (ID: WIE-PO-08)

---

## 6. WOJEWÓDZTWO ŁÓDZKIE (Łódzki ZPN)

### Grupa Łódź I
* **Boruta III Zgierz** (ID: LOD-LD-01)
* **Stal II Głowno** (ID: LOD-LD-02)
* **Rozwój Głowno** (ID: LOD-LD-03)
* **Sokół Lutomiersk** (ID: LOD-LD-04)
* **Włókniarz II Konstantynów Łódzki** (ID: LOD-LD-05)
* **KAS II Konstantynów** (ID: LOD-LD-06)
* **Bzura II Ozorków** (ID: LOD-LD-07)
* **SAP II Parzęczew** (ID: LOD-LD-08)

---

## Instrukcja importu bazy danych
Zalecana struktura tabeli SQL:
```sql
CREATE TABLE kluby_klasa_b (
    id VARCHAR(20) PRIMARY KEY,
    nazwa_klubu VARCHAR(100) NOT NULL,
    grupa VARCHAR(50),
    wojewodztwo VARCHAR(50)
);
```
