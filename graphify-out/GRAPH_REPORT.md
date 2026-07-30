# Graph Report - .  (2026-07-30)

## Corpus Check
- Corpus is ~13,392 words - fits in a single context window. You may not need a graph.

## Summary
- 219 nodes · 310 edges · 19 communities (12 shown, 7 thin omitted)
- Extraction: 95% EXTRACTED · 4% INFERRED · 1% AMBIGUOUS · INFERRED: 13 edges (avg confidence: 0.88)
- Token cost: 164,414 input · 0 output

## Community Hubs (Navigation)
- Инструментарий разработки
- Продуктовые решения и задачи
- Промпт и клиент Anthropic
- Хранилище счётчиков и лимиты
- Рантайм-зависимости
- Настройки TypeScript
- План, спека и внешние сервисы
- Route Handler и обработка ошибок
- Область компиляции TypeScript
- Оболочка страницы и шрифты
- Конфигурация ESLint
- Конфигурация Next.js
- Конфигурация PostCSS
- Оценка стоимости генерации
- Ручной смоук-тест
- Вне рамок проекта
- Решение по кэшу промпта

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `checkLimits()` - 9 edges
3. `План реализации: генератор отмазок` - 9 edges
4. `POST()` - 8 edges
5. `scripts` - 7 edges
6. `getKv()` - 7 edges
7. `include` - 7 edges
8. `generateExcuse()` - 6 edges
9. `Решение: свободное поле ввода ситуации` - 6 edges
10. `ERROR_MESSAGES` - 5 edges

## Surprising Connections (you probably didn't know these)
- `AGENTS.md — правила агента для Next.js 16` --conceptually_related_to--> `Решение: Next.js 16 App Router на Vercel`  [INFERRED]
  AGENTS.md → docs/superpowers/specs/2026-07-30-excuse-generator-design.md
- `CLAUDE.md — точка входа инструкций агента` --references--> `AGENTS.md — правила агента для Next.js 16`  [EXTRACTED]
  CLAUDE.md → AGENTS.md
- `Task 10: деплой на Vercel` --references--> `README.md — Генератор отмазок`  [EXTRACTED]
  docs/superpowers/plans/2026-07-30-excuse-generator.md → README.md
- `README.md — Генератор отмазок` --cites--> `План реализации: генератор отмазок`  [EXTRACTED]
  README.md → docs/superpowers/plans/2026-07-30-excuse-generator.md
- `README.md — Генератор отмазок` --cites--> `Дизайн-спека: генератор отмазок`  [EXTRACTED]
  README.md → docs/superpowers/specs/2026-07-30-excuse-generator-design.md

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Свободный ввод → пакет мер защиты от злоупотреблений** — docs_superpowers_specs_2026_07_30_excuse_generator_design_decision_situation_input, docs_superpowers_specs_2026_07_30_excuse_generator_design_protection_rate_limit_ip, docs_superpowers_specs_2026_07_30_excuse_generator_design_protection_global_daily_cap, docs_superpowers_specs_2026_07_30_excuse_generator_design_protection_input_length_limit, docs_superpowers_specs_2026_07_30_excuse_generator_design_protection_max_tokens_cap [EXTRACTED 1.00]
- **Конвейер запроса: валидация → рейт-лимит → бюджет → вызов Anthropic** — src_app_api_generate_route, src_lib_excuse_schema, src_lib_limits, src_lib_excuse_client [EXTRACTED 1.00]
- **Контракт HTTP-маппинга ошибок /api/generate** — src_lib_config, docs_superpowers_specs_2026_07_30_excuse_generator_design_error_invalid_input, docs_superpowers_specs_2026_07_30_excuse_generator_design_error_rate_limited, docs_superpowers_specs_2026_07_30_excuse_generator_design_error_budget_exhausted, docs_superpowers_specs_2026_07_30_excuse_generator_design_error_upstream_failure, docs_superpowers_specs_2026_07_30_excuse_generator_design_error_model_refusal, docs_superpowers_specs_2026_07_30_excuse_generator_design_error_unparsable_output [EXTRACTED 1.00]

## Communities (19 total, 7 thin omitted)

### Community 0 - "Инструментарий разработки"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, jsdom, devDependencies, eslint, eslint-config-next, jsdom, tailwindcss (+25 more)

### Community 1 - "Продуктовые решения и задачи"
Cohesion: 0.10
Nodes (21): AGENTS.md — правила агента для Next.js 16, CLAUDE.md — точка входа инструкций агента, Task 1: каркас проекта и тестовый конвейер, Task 2: конфигурация и схемы данных, Task 8: интерфейс (форма и карточка), Решение: ползунок уровня безумия 1–5, Решение: только копирование в буфер, без отправки писем, Решение: рейтинг правдоподобности как structured output (+13 more)

### Community 2 - "Промпт и клиент Anthropic"
Cohesion: 0.10
Nodes (21): Task 3: сборка промпта, Task 6: клиент Anthropic, Решение: LLM вместо комбинаторики шаблонов, Ошибка: отказ модели, stop_reason refusal (422), Ошибка: пустой parsed_output (502), Ошибка: сбой апстрима Anthropic (502), Правило: пользовательский текст — данные, не инструкция, Пять уровней безумия (от бытовой правды до внеземных цивилизаций) (+13 more)

### Community 3 - "Хранилище счётчиков и лимиты"
Cohesion: 0.14
Nodes (16): Task 4: хранилище счётчиков (KvStore), Task 5: рейт-лимит и дневной бюджет, Решение: отказ вместо тихого пропуска при недоступном KV на проде, generateExcuseMock, VALID_OUTPUT, createMemoryKv(), getKv(), KvStore (+8 more)

### Community 4 - "Рантайм-зависимости"
Cohesion: 0.08
Nodes (23): @anthropic-ai/sdk, next, dependencies, @anthropic-ai/sdk, next, react, react-dom, @upstash/redis (+15 more)

### Community 5 - "Настройки TypeScript"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 6 - "План, спека и внешние сервисы"
Cohesion: 0.20
Nodes (16): План реализации: генератор отмазок, Решение: thinking:disabled, effort:low, max_tokens:600, Task 10: деплой на Vercel, Task 9: локальная проверка на живой модели, Дизайн-спека: генератор отмазок, Решение: свободное поле ввода ситуации, Контракт вызова модели (model/max_tokens/thinking/output_config), Глобальный дневной потолок (1000 генераций/день) (+8 more)

### Community 7 - "Route Handler и обработка ошибок"
Cohesion: 0.17
Nodes (14): Task 7: Route Handler, Ошибка: дневной бюджет исчерпан (503), Ошибка: невалидный ввод (400), Ошибка: рейт-лимит по IP (429 + Retry-After), Интеграционные тесты Route Handler с мок-SDK, Изоляция ANTHROPIC_API_KEY (только сервер, без NEXT_PUBLIC_), Стратегия тестирования: TDD, Юнит-тесты: схема, промпт, лимиты, маппинг ошибок (+6 more)

### Community 8 - "Область компиляции TypeScript"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 9 - "Оболочка страницы и шрифты"
Cohesion: 0.40
Nodes (3): geistMono, geistSans, metadata

## Ambiguous Edges - Review These
- `kv.ts` → `Решение: отказ вместо тихого пропуска при недоступном KV на проде`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to
- `Правило отказа модели на нерелевантный ввод` → `Ошибка: отказ модели, stop_reason refusal (422)`  [AMBIGUOUS]
  docs/superpowers/specs/2026-07-30-excuse-generator-design.md · relation: conceptually_related_to

## Knowledge Gaps
- **87 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+82 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `kv.ts` and `Решение: отказ вместо тихого пропуска при недоступном KV на проде`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Правило отказа модели на нерелевантный ввод` and `Ошибка: отказ модели, stop_reason refusal (422)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `devDependencies` connect `Инструментарий разработки` to `Рантайм-зависимости`?**
  _High betweenness centrality (0.053) - this node is a cross-community bridge._
- **Why does `compilerOptions` connect `Настройки TypeScript` to `Область компиляции TypeScript`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `План реализации: генератор отмазок` (e.g. with `Решение: свободное поле ввода ситуации` and `Глобальный дневной потолок (1000 генераций/день)`) actually correct?**
  _`План реализации: генератор отмазок` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _87 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Инструментарий разработки` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._