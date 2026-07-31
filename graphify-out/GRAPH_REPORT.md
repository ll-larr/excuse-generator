# Graph Report - .  (2026-07-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 228 nodes · 325 edges · 18 communities (13 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 1 edges (avg confidence: 0.75)
- Token cost: 1,160 input · 169 output

## Graph Freshness
- Built from commit: `1b4ffbde`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Excuse UI Components
- Project Planning and Tasks
- Dev Dependencies Setup
- KV Store and Rate Limit Logic
- Core Dependencies
- TypeScript Compiler Options
- Abuse Protection and Route
- TypeScript Config Files
- Route Handler Tests
- App Layout and Fonts
- Channel and Madness Spec
- Agent Instruction Files
- ESLint Config
- Next.js Config
- PostCSS Config
- Design Brief

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Генератор отмазок — дизайн` - 15 edges
3. `checkLimits()` - 12 edges
4. `Генератор отмазок — план реализации` - 12 edges
5. `POST()` - 11 edges
6. `getKv()` - 10 edges
7. `scripts` - 7 edges
8. `include` - 7 edges
9. `Защита от злоупотреблений (пакет мер)` - 7 edges
10. `ERROR_MESSAGES` - 7 edges

## Surprising Connections (you probably didn't know these)
- `Мера: глобальный дневной потолок 1000 генераций` --rationale_for--> `checkLimits()`  [EXTRACTED]
  docs/superpowers/specs/2026-07-30-excuse-generator-design.md → src/lib/limits.ts
- `Мера: рейт-лимит по IP (10/час, 40/сутки)` --rationale_for--> `checkLimits()`  [EXTRACTED]
  docs/superpowers/specs/2026-07-30-excuse-generator-design.md → src/lib/limits.ts
- `Предупреждение: код задачи 7 (Route Handler) устарел после финального ревью` --rationale_for--> `POST()`  [EXTRACTED]
  docs/superpowers/plans/2026-07-30-excuse-generator.md → src/app/api/generate/route.ts
- `Предупреждение: код задачи 4 (KV) устарел после финального ревью` --rationale_for--> `getKv()`  [EXTRACTED]
  docs/superpowers/plans/2026-07-30-excuse-generator.md → src/lib/kv.ts
- `Решение: отказ (503), а не тихий пропуск, при недоступном/ненастроенном хранилище лимитов` --rationale_for--> `getKv()`  [EXTRACTED]
  docs/superpowers/specs/2026-07-30-excuse-generator-design.md → src/lib/kv.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Channel & Madness Benchmarks Feature Spec, Plan and Implementation** — docs_superpowers_specs_2026_07_30_channel_and_madness_benchmarks_design, docs_superpowers_plans_2026_07_30_channel_and_madness_benchmarks, concept_channel_selection, concept_plausibility_corridors [EXTRACTED 0.97]
- **Контракт отказа при недоступном хранилище лимитов** — docs_superpowers_specs_2026_07_30_excuse_generator_design_kv_fail_closed_decision, docs_superpowers_plans_2026_07_30_excuse_generator_kv_fail_closed_warning, src_lib_kv_getkv, src_app_api_generate_route_post, src_lib_config_error_messages [EXTRACTED 1.00]
- **Пакет мер против злоупотреблений** — docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_rate_limit_ip, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_global_daily_cap, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_input_length_limit, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_max_tokens_cap, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_user_input_isolation, docs_superpowers_specs_2026_07_30_excuse_generator_design_measure_server_only_api_key [EXTRACTED 1.00]

## Communities (18 total, 5 thin omitted)

### Community 0 - "Excuse UI Components"
Cohesion: 0.09
Nodes (27): Решение: только копирование в буфер, без отправки писем, Решение: LLM вместо комбинаторики шаблонов, ExcuseCard(), EXCUSE, ExcuseForm(), LOADING_CHATTER, MADNESS_EMOJI, EXCUSE (+19 more)

### Community 1 - "Project Planning and Tasks"
Cohesion: 0.07
Nodes (31): Prompt Injection Defense, Rate Limiting (10 req/hr, daily budget), Генератор отмазок — план реализации, Решение: thinking disabled + max_tokens 600 вместо adaptive+400 из спеки, Предупреждение: код задачи 4 (KV) устарел после финального ревью, Task 10: Деплой на Vercel, Task 1: Каркас проекта и тестовый конвейер, Task 2: Конфигурация и схемы данных (+23 more)

### Community 2 - "Dev Dependencies Setup"
Cohesion: 0.07
Nodes (31): eslint, eslint-config-next, jsdom, devDependencies, eslint, eslint-config-next, jsdom, tailwindcss (+23 more)

### Community 3 - "KV Store and Rate Limit Logic"
Cohesion: 0.14
Nodes (17): Предупреждение: код задачи 7 (Route Handler) устарел после финального ревью, Task 7: Route Handler, Решение: отказ вместо тихого пропуска при недоступном KV на проде, generateExcuseMock, VALID_OUTPUT, createMemoryKv(), getKv(), KvStore (+9 more)

### Community 4 - "Core Dependencies"
Cohesion: 0.08
Nodes (23): @anthropic-ai/sdk, next, dependencies, @anthropic-ai/sdk, next, react, react-dom, @upstash/redis (+15 more)

### Community 5 - "TypeScript Compiler Options"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 6 - "Abuse Protection and Route"
Cohesion: 0.18
Nodes (17): Защита от злоупотреблений (пакет мер), Таблица обработки ошибок (причина → HTTP → текст), Решение: отказ (503), а не тихий пропуск, при недоступном/ненастроенном хранилище лимитов, Мера: глобальный дневной потолок 1000 генераций, Мера: лимит длины ввода 200 символов (серверная проверка), Мера: max_tokens 400 как потолок цены запроса, Мера: рейт-лимит по IP (10/час, 40/сутки), Мера: ANTHROPIC_API_KEY читается только в Route Handler (+9 more)

### Community 7 - "TypeScript Config Files"
Cohesion: 0.20
Nodes (9): **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx, exclude (+1 more)

### Community 8 - "Route Handler Tests"
Cohesion: 0.33
Nodes (3): checkLimitsMock, generateExcuseMock, VALID_OUTPUT

### Community 9 - "App Layout and Fonts"
Cohesion: 0.40
Nodes (3): jetbrainsMono, metadata, plexSans

### Community 10 - "Channel and Madness Spec"
Cohesion: 0.50
Nodes (4): Channel Selection (sms vs live), Plausibility Corridors by Madness Level, Plan: Channel and Madness Benchmarks Implementation, Spec: Channel and Madness Benchmarks Design

## Ambiguous Edges - Review These
- `kv.ts` → `Решение: отказ вместо тихого пропуска при недоступном KV на проде`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to

## Knowledge Gaps
- **99 isolated node(s):** `nextConfig`, `name`, `version`, `private`, `dev` (+94 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `kv.ts` and `Решение: отказ вместо тихого пропуска при недоступном KV на проде`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `Генератор отмазок — дизайн` connect `Project Planning and Tasks` to `Excuse UI Components`, `Abuse Protection and Route`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `devDependencies` connect `Dev Dependencies Setup` to `Core Dependencies`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `Генератор отмазок — план реализации` connect `Project Planning and Tasks` to `KV Store and Rate Limit Logic`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **What connects `nextConfig`, `name`, `version` to the rest of the system?**
  _99 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Excuse UI Components` be split into smaller, more focused modules?**
  _Cohesion score 0.09191583610188261 - nodes in this community are weakly interconnected._
- **Should `Project Planning and Tasks` be split into smaller, more focused modules?**
  _Cohesion score 0.06666666666666667 - nodes in this community are weakly interconnected._