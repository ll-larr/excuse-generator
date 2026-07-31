# Graph Report - .  (2026-07-31)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 195 nodes · 325 edges · 15 communities (12 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.82)
- Token cost: 708 input · 140 output

## Graph Freshness
- Built from commit: `9c08ab00`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Frontend Dev Dependencies
- Excuse Generator UI Components
- Rate Limiting and KV Store
- API Route and Testing
- Project Dependencies
- TypeScript Compiler Options
- Prompt and Schema Design
- TypeScript Config Files
- App Layout and Fonts
- ESLint Configuration
- Next.js Configuration
- PostCSS Configuration

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `checkLimits()` - 12 edges
3. `Excuse Generator Implementation Plan` - 12 edges
4. `POST()` - 11 edges
5. `getKv()` - 9 edges
6. `generateExcuse()` - 8 edges
7. `Excuse Generator Design Spec` - 8 edges
8. `scripts` - 7 edges
9. `KvStore` - 7 edges
10. `include` - 7 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --calls--> `GenerateRequestSchema`  [EXTRACTED]
  src/app/api/generate/route.ts → docs/superpowers/plans/2026-07-30-excuse-generator.md
- `Plausibility Corridors by Madness Level` --conceptually_related_to--> `PLAUSIBILITY_RANGES`  [EXTRACTED]
  docs/superpowers/specs/2026-07-30-channel-and-madness-benchmarks-design.md → src/lib/config.ts
- `Channel Selection (SMS vs Live)` --conceptually_related_to--> `CHANNELS`  [EXTRACTED]
  docs/superpowers/specs/2026-07-30-channel-and-madness-benchmarks-design.md → src/lib/config.ts
- `Structured Output via Anthropic SDK` --conceptually_related_to--> `generateExcuse()`  [EXTRACTED]
  docs/superpowers/specs/2026-07-30-excuse-generator-design.md → src/lib/excuse/client.ts
- `Prompt Injection Protection` --conceptually_related_to--> `buildPrompt()`  [EXTRACTED]
  docs/superpowers/specs/2026-07-30-excuse-generator-design.md → src/lib/excuse/prompt.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Request Processing Pipeline** — src_components_excuseform, src_app_api_generate_route_post, src_lib_limits_checklimits, src_lib_excuse_client_generateexcuse, src_lib_excuse_prompt_buildprompt [EXTRACTED 0.95]
- **Abuse Protection Measures** — src_lib_limits_checklimits, src_lib_kv_getkv, src_lib_excuse_schema_generate_request, src_lib_config_error_messages, concept_rate_limiting [EXTRACTED 0.90]
- **Prompt Context System (Channel + Madness + Plausibility)** — concept_channel_selection, concept_plausibility_corridors, src_lib_config_madness_hints, src_lib_excuse_prompt_buildprompt [EXTRACTED 0.90]

## Communities (15 total, 3 thin omitted)

### Community 0 - "Frontend Dev Dependencies"
Cohesion: 0.07
Nodes (31): eslint, eslint-config-next, jsdom, devDependencies, eslint, eslint-config-next, jsdom, tailwindcss (+23 more)

### Community 1 - "Excuse Generator UI Components"
Cohesion: 0.15
Nodes (20): Channel Selection (SMS vs Live), Design Brief, Excuse Generator Implementation Plan, Session Handoff Tasks 9-10, README, src/app/globals.css, ExcuseCard(), EXCUSE (+12 more)

### Community 2 - "Rate Limiting and KV Store"
Cohesion: 0.15
Nodes (16): Rate Limiting and Daily Budget, generateExcuseMock, VALID_OUTPUT, createMemoryKv(), createMemoryKv(), getKv(), KvStore, resetKvCacheForTests() (+8 more)

### Community 3 - "API Route and Testing"
Cohesion: 0.13
Nodes (17): Structured Output via Anthropic SDK, clientIp(), json(), POST(), checkLimitsMock, generateExcuseMock, VALID_OUTPUT, EFFORT (+9 more)

### Community 4 - "Project Dependencies"
Cohesion: 0.08
Nodes (23): @anthropic-ai/sdk, next, dependencies, @anthropic-ai/sdk, next, react, react-dom, @upstash/redis (+15 more)

### Community 5 - "TypeScript Compiler Options"
Cohesion: 0.11
Nodes (19): dom, dom.iterable, esnext, compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules (+11 more)

### Community 6 - "Prompt and Schema Design"
Cohesion: 0.21
Nodes (13): Plausibility Corridors by Madness Level, Prompt Injection Protection, Channel and Madness Benchmarks Plan, Channel and Madness Benchmarks Design Spec, Excuse Generator Design Spec, PLAUSIBILITY_RANGES, buildPrompt(), CHANNEL_BLOCKS (+5 more)

### Community 7 - "TypeScript Config Files"
Cohesion: 0.18
Nodes (10): handoff, **/*.mts, .next/dev/types/**/*.ts, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+2 more)

### Community 8 - "App Layout and Fonts"
Cohesion: 0.40
Nodes (3): jetbrainsMono, metadata, plexSans

## Knowledge Gaps
- **79 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+74 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `Frontend Dev Dependencies` to `Project Dependencies`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._
- **Why does `Design Brief` connect `Excuse Generator UI Components` to `App Layout and Fonts`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _79 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Frontend Dev Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.06881720430107527 - nodes in this community are weakly interconnected._
- **Should `API Route and Testing` be split into smaller, more focused modules?**
  _Cohesion score 0.12666666666666668 - nodes in this community are weakly interconnected._
- **Should `Project Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `TypeScript Compiler Options` be split into smaller, more focused modules?**
  _Cohesion score 0.10526315789473684 - nodes in this community are weakly interconnected._