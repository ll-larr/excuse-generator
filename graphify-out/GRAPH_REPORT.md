# Graph Report - .  (2026-07-30)

## Corpus Check
- Corpus is ~14,919 words - fits in a single context window. You may not need a graph.

## Summary
- 237 nodes · 350 edges · 15 communities (11 shown, 4 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 1% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.9)
- Token cost: 152,596 input · 0 output

## Community Hubs (Navigation)
- Инструментарий разработки
- Route Handler и приёмка деплоя
- План реализации и задачи
- Контракт ошибок и тесты роута
- Рантайм-зависимости
- Клиент Anthropic и режимы модели
- Передача сессии и хвост работ
- Настройки TypeScript
- Деплой и меры защиты
- Область компиляции TypeScript
- Инструкции агента
- Конфигурация ESLint
- Конфигурация Next.js
- Конфигурация PostCSS

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `checkLimits()` - 15 edges
3. `Генератор отмазок — дизайн` - 15 edges
4. `Передача в новую сессию: задачи 9 и 10` - 15 edges
5. `POST()` - 13 edges
6. `Генератор отмазок — план реализации` - 12 edges
7. `getKv()` - 11 edges
8. `ERROR_MESSAGES` - 8 edges
9. `scripts` - 7 edges
10. `include` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Follow-up: TTL счётчиков ставится на полный час/сутки от первого инкремента, а не до границы корзины` --rationale_for--> `checkLimits()`  [AMBIGUOUS]
  docs/superpowers/plans/2026-07-30-session-handoff-tasks-9-10.md → src/lib/limits.ts
- `Follow-up: дневной бюджет считает попытки, а не успехи` --rationale_for--> `checkLimits()`  [EXTRACTED]
  docs/superpowers/plans/2026-07-30-session-handoff-tasks-9-10.md → src/lib/limits.ts
- `Мера: глобальный дневной потолок 1000 генераций` --rationale_for--> `checkLimits()`  [EXTRACTED]
  docs/superpowers/specs/2026-07-30-excuse-generator-design.md → src/lib/limits.ts
- `Расхождение плана и кода: задача 4 показывает устаревший getKv()` --rationale_for--> `POST()`  [EXTRACTED]
  docs/superpowers/plans/2026-07-30-session-handoff-tasks-9-10.md → src/app/api/generate/route.ts
- `Таблица обработки ошибок (причина → HTTP → текст)` --rationale_for--> `POST()`  [EXTRACTED]
  docs/superpowers/specs/2026-07-30-excuse-generator-design.md → src/app/api/generate/route.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Контракт отказа при недоступном хранилище лимитов** — docs_superpowers_specs_2026_07_30_excuse_generator_design_kv_fail_closed_decision, docs_superpowers_plans_2026_07_30_excuse_generator_kv_fail_closed_warning, docs_superpowers_plans_2026_07_30_session_handoff_tasks_9_10_plan_code_divergence, src_lib_kv_getkv, src_app_api_generate_route_post, src_lib_config_error_messages [EXTRACTED 1.00]
- **Пакет мер против злоупотреблений** — docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_rate_limit_ip, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_global_daily_cap, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_input_length_limit, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_max_tokens_cap, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_user_input_isolation, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_server_only_api_key [EXTRACTED 1.00]
- **Самые связные узлы графа памяти проекта** — docs_superpowers_plans_2026_07_30_session_handoff_tasks_9_10_memory_graph, src_lib_limits_checklimits, src_app_api_generate_route_post, src_lib_kv_getkv, src_lib_excuse_client_generateexcuse, src_lib_config_error_messages [EXTRACTED 1.00]

## Communities (15 total, 4 thin omitted)

### Community 0 - "Инструментарий разработки"
Cohesion: 0.06
Nodes (33): eslint, eslint-config-next, jsdom, devDependencies, eslint, eslint-config-next, jsdom, tailwindcss (+25 more)

### Community 1 - "Route Handler и приёмка деплоя"
Cohesion: 0.12
Nodes (22): Предупреждение: код задачи 7 (Route Handler) устарел после финального ревью, Follow-up: INCR и EXPIRE не атомарны, Шаг деплоя: проверка подделки x-forwarded-for против x-vercel-forwarded-for, Решение: отказ вместо тихого пропуска при недоступном KV на проде, clientIp(), generateExcuseMock, VALID_OUTPUT, json() (+14 more)

### Community 2 - "План реализации и задачи"
Cohesion: 0.08
Nodes (26): Генератор отмазок — план реализации, Решение: thinking disabled + max_tokens 600 вместо adaptive+400 из спеки, Task 1: Каркас проекта и тестовый конвейер, Task 2: Конфигурация и схемы данных, Task 3: Сборка промпта, Task 5: Рейт-лимит и дневной бюджет, Task 6: Клиент Anthropic, Task 7: Route Handler (+18 more)

### Community 3 - "Контракт ошибок и тесты роута"
Cohesion: 0.12
Nodes (15): Follow-up: текст budget_exhausted показывается и при отказе Redis, где он семантически неточен, Follow-up: ExcuseCard.test.tsx подменяет navigator.clipboard без отката, Решение: только копирование в буфер, без отправки писем, Таблица обработки ошибок (причина → HTTP → текст), Решение: отказ (503), а не тихий пропуск, при недоступном/ненастроенном хранилище лимитов, checkLimitsMock, generateExcuseMock, VALID_OUTPUT (+7 more)

### Community 4 - "Рантайм-зависимости"
Cohesion: 0.08
Nodes (23): @anthropic-ai/sdk, next, dependencies, @anthropic-ai/sdk, next, react, react-dom, @upstash/redis (+15 more)

### Community 5 - "Клиент Anthropic и режимы модели"
Cohesion: 0.14
Nodes (16): Тест-инвариант: THINKING_MODE==='disabled' || MAX_TOKENS>=2000, Находка: выход из ограждения через </situation> в поле ввода, Сверка режимов размышления: disabled(600) против adaptive(2000) на живой модели, Мера: лимит длины ввода 200 символов (серверная проверка), EFFORT, ExcuseError, ExcuseErrorKind, generateExcuse() (+8 more)

### Community 6 - "Передача сессии и хвост работ"
Cohesion: 0.10
Nodes (18): Предупреждение: код задачи 4 (KV) устарел после финального ревью, Task 4: Хранилище счётчиков, Передача в новую сессию: задачи 9 и 10, Состояние ветки: master, диск = удалённый репозиторий, 74 теста зелёных, Дизайн интерфейса не начат (голая Tailwind-разметка), вынесен за рамки владельцем, Follow-up: дневной бюджет считает попытки, а не успехи, Follow-up: TTL счётчиков ставится на полный час/сутки от первого инкремента, а не до границы корзины, Follow-up: предупреждения конфигурации Vitest (configLoader, vite-tsconfig-paths, ESM) (+10 more)

### Community 7 - "Настройки TypeScript"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 8 - "Деплой и меры защиты"
Cohesion: 0.16
Nodes (14): Task 10: Деплой на Vercel, Границы, которые не двигаем (4 инварианта продукта), Шаг деплоя: проверка отсутствия ключа Anthropic в клиентском бандле (поиск sk-ant), Шаг деплоя: проверка рейт-лимита на живом стенде (12 запросов curl), Задача 10: шаги деплоя на Vercel, Шаг деплоя: подключить Upstash Redis через Vercel Storage, Защита от злоупотреблений (пакет мер), Anthropic API (внешний сервис) (+6 more)

### Community 9 - "Область компиляции TypeScript"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

## Ambiguous Edges - Review These
- `kv.ts` → `Решение: отказ вместо тихого пропуска при недоступном KV на проде`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to
- `checkLimits()` → `Follow-up: TTL счётчиков ставится на полный час/сутки от первого инкремента, а не до границы корзины`  [AMBIGUOUS]
  docs/superpowers/plans/2026-07-30-session-handoff-tasks-9-10.md · relation: rationale_for

## Knowledge Gaps
- **88 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+83 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `kv.ts` and `Решение: отказ вместо тихого пропуска при недоступном KV на проде`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `checkLimits()` and `Follow-up: TTL счётчиков ставится на полный час/сутки от первого инкремента, а не до границы корзины`?**
  _Edge tagged AMBIGUOUS (relation: rationale_for) - confidence is low._
- **Why does `Передача в новую сессию: задачи 9 и 10` connect `Передача сессии и хвост работ` to `Деплой и меры защиты`, `Route Handler и приёмка деплоя`, `План реализации и задачи`, `Контракт ошибок и тесты роута`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **Why does `Генератор отмазок — дизайн` connect `План реализации и задачи` to `Деплой и меры защиты`, `Контракт ошибок и тесты роута`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Инструментарий разработки` to `Рантайм-зависимости`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _88 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Инструментарий разработки` be split into smaller, more focused modules?**
  _Cohesion score 0.06060606060606061 - nodes in this community are weakly interconnected._