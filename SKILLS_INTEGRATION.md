# Skill Packages Integration

## Zainstalowane pakiety

### 1. **Ponytail** (@dietrichgebert/ponytail v5.3.3)
- **Opis**: Lazy senior dev mode for AI agents - najlepszy kod to kod, który nigdy nie napisałeś
- **Repozytorium**: https://github.com/DietrichGebert/ponytail.git
- **Funkcje**:
  - OpenCode plugin
  - Qoder integration
  - Code generation skills
  - Hooks dla editor integration

**Lokalizacja**: `/node_modules/ponytail`

### 2. **Humanizer**
- **Opis**: Rewrite AI-sounding text so it reads like the writer without changing what it says
- **Repozytorium**: https://github.com/blader/humanizer.git
- **Funkcje**:
  - Przetwarzanie tekstu AI
  - Naturalizacja written content
  - Pi-package skills

**Lokalizacja**: `/node_modules/humanizer`

---

## Jak używać

### Import w projekcie

```typescript
import { getAvailableSkills, humanizeText, generateCodeSuggestions } from '@/utils/skills';

// Sprawdzenie dostępnych skilli
const skills = getAvailableSkills();
console.log(skills);

// Humanizacja tekstu
const naturalText = await humanizeText("This is an AI-generated text that sounds artificial.");

// Generowanie sugestii kodu
const suggestions = await generateCodeSuggestions("Need helper function for...");
```

### Konfiguracja do edytorów

Oba pakiety zawierają integracje dla:
- **Cursor** (`.cursor-plugin`, `.cursor`)
- **OpenCode** (`.opencode/`, `.opencode-plugin/`)
- **Qoder** (`.qoder/`, `.qoder-plugin/`)
- **Claude** (`.claude-plugin`)
- **Windsurf** (`.windsurf`)

### Skills w Ponytail

Dostępne skills znajdują się w katalogu `/node_modules/ponytail/skills/`:
- Różne helpery dla code generation
- Hooks dla editor integration
- OpenCode plugin API

### Humanizer Skills

Skille Humanizera są dostępne w głównym katalogu pakietu `/node_modules/humanizer/`

---

## Integracja z CLI

Oba pakiety wspomagają agenty AI:
- **Ponytail** oferuje "lazy senior dev mode" - idealne dla agentów AI do szybkiego generowania kodu
- **Humanizer** może być używany do post-processingu generowanego tekstu

---

## Struktura plików

```
node_modules/
├── ponytail/
│   ├── skills/              # Code generation skills
│   ├── hooks/               # Editor hooks
│   ├── .opencode/           # OpenCode plugin
│   ├── .qoder/              # Qoder configuration
│   ├── pi-extension/        # Pi-package extension
│   └── package.json
│
└── humanizer/
    ├── agents/              # AI agent configurations
    ├── scripts/             # Utility scripts
    └── package.json
```

---

## Development

### Testowanie Ponytail

```bash
npm test --prefix node_modules/ponytail
```

### Modyfikacja Skills

Skills można rozszerzać przez:
1. Dodanie nowych plików w `/node_modules/ponytail/skills/`
2. Rejestracja w `pi.json` lub `package.json`
3. Importowanie w aplikacji poprzez skill system

---

## Troubleshooting

Jeśli pakiety nie są dostępne:

```bash
# Ponowna instalacja
git clone https://github.com/DietrichGebert/ponytail.git node_modules/ponytail
git clone https://github.com/blader/humanizer.git node_modules/humanizer

# Sprawdzenie
ls node_modules/ponytail/package.json
ls node_modules/humanizer/package.json
```

---

## Użyte w projekcie

W pliku `src/utils/skills.ts` jest interfejs integracyjny do obu pakietów z funkcjami:
- `getAvailableSkills()` - sprawdzenie dostępności
- `humanizeText()` - humanizacja tekstów
- `generateCodeSuggestions()` - sugestie kodu
