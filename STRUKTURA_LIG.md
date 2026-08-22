# Oficjalna Struktura Polskich Lig Piłkarskich (Polska Liga Manager 2026)

Piramida rozgrywkowa piłki nożnej w Polsce zaimplementowana w grze:

| Poziom | Nazwa klasy rozgrywkowej | Zasięg i organizacja | Szczegóły w grze |
| :--- | :--- | :--- | :--- |
| **I** | **Ekstraklasa** | Ogólnokrajowy (18 drużyn) | PKO BP Ekstraklasa (18 klubów, 3 spadki) |
| **II** | **I liga** | Ogólnokrajowy (18 drużyn) | Betclic 1. Liga (18 klubów, 2 awanse bezpośrednie, baraże 3-6) |
| **III** | **II liga** | Ogólnokrajowy (jedna grupa, 18 drużyn) | Betclic 2. Liga (18 klubów, 2 awanse, baraże 3-6, 4 spadki) |
| **IV** | **III liga** | 4 grupy (po 4 województwa) | Betclic 3. Liga (Grupy regionalne, 1 awans bezpośredni) |
| **V** | **IV liga** | 16 grup (po jednej na każde województwo) | IV liga wojewódzka (16 grup regionalnych) |
| **VI** | **V liga** lub **Klasa okręgowa** | V liga w 4 woj. (mazowieckie, małopolskie, śląskie, wielkopolskie); w pozostałych 12 to klasa okręgowa | Poziom regionalny / V liga & Klasa Okręgowa |
| **VII** | **Klasa okręgowa** lub **Klasa A** | Zależnie od struktury w danym województwie | Klasa A / Klasa Okręgowa niższa |
| **VIII** | **Klasa A** lub **Klasa B** | Zależnie od struktury regionalnej | Klasa B / Rozgrywki powiatowe |
| **IX** | **Klasa B** lub **Klasa C** | Najniższy poziom; Klasa C m.in. w woj. śląskim | Klasa C / Najniższy szczebel ligowy w Polsce |

---

## Szczegóły Implementacji Technicznej:
* **Baza Supabase:** Tabela `leagues` z kolumnami `id`, `name`, `short_name`, `tier` (1-9), `relegation_spots`, `promotion_spots`, `playoff_spots`.
* **Kluby:** Tabela `clubs` z relacją klucza obcego `league_id` do tabeli `leagues`.
