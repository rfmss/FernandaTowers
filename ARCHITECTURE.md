# ARCHITECTURE.md — tower-defense

Documentação técnica da arquitetura do jogo.
Referência para o agente e para o desenvolvedor.

---

## Visão geral

Jogo de tower defense isométrico implementado em HTML/JS/CSS puro,
arquivo único, sem dependências externas, sem build step.
Roda em qualquer navegador moderno, otimizado para mobile.

---

## Camada 0 — Estrutura de arquivo

Arquivo único `index.html` com HTML + CSS + JS inline.
Sem módulos ES6, sem import/export — compatibilidade máxima com WebKit antigo.
Toda a lógica em escopo global dentro de uma `<script>` tag.

---

## Camada 1 — Game Loop

```
requestAnimationFrame(loop)
  │
  ├── delta time = (timestamp - lastTimestamp) / 1000
  ├── cap: Math.min(dt, 0.05)  ← evita spiral of death
  │
  ├── update(dt)
  │     ├── tickBuild(dt)
  │     ├── tickSpawner(dt)
  │     ├── updEnemies(dt)
  │     ├── updTowers(dt)
  │     └── updProjs(dt)
  │
  └── render()
        ├── ctx.drawImage(offscreen)   ← mapa estático
        ├── drawables.sort(painter)    ← profundidade iso
        ├── projs.forEach(drawProj)
        ├── updSplash(dt)
        └── drawHov()
```

**Delta time** — toda velocidade é multiplicada por `dt` (segundos).
Garante comportamento idêntico em 30fps e 60fps.

---

## Camada 2 — Projeção Isométrica

Conversão tile → pixel (tileToScreen):
```js
x = originX + (col - row) * (TILE_W / 2)
y = originY + (col + row) * (TILE_H / 2)
```

Conversão pixel → tile (screenToTile, inversa):
```js
col = ((px - originX) / (TW/2) + (py - originY) / (TH/2)) / 2
row = ((py - originY) / (TH/2) - (px - originX) / (TW/2)) / 2
```

`TILE_W = 64`, `TILE_H = 32` — proporção 2:1 padrão isométrico.
`originX/Y` calculado no resize para centralizar o mapa.

---

## Camada 3 — Tilemap e Pathfinding

**Mapa:** array 2D de inteiros. `0` = grama, `1` = caminho.

**Waypoints:** lista de `[row, col]` que define o percurso.
Inimigos seguem os waypoints em ordem — sem cálculo de rota em tempo real.
Sistema chamado de **Waypoint Path System**.

**Painter's Algorithm:** tiles renderizados de `row=0,col=0` até `row=N,col=N`.
Tiles com maior `row+col` são desenhados por cima dos anteriores,
criando a ilusão de profundidade isométrica.

**Offscreen Canvas:** mapa estático pré-renderizado uma vez.
A cada frame: `ctx.drawImage(offscreen, 0, 0)` — uma operação só.
Reconstruído apenas quando o mapa muda.

---

## Camada 4 — Entity System

Três arrays principais sem ECS formal:

```js
towers[]      // torres colocadas pelo jogador
enemies[]     // inimigos ativos na onda
projectiles[] // Object Pool de 100 slots
```

Cada entidade tem `update(dt)` implícito nas funções `upd*`.
Cada entidade tem `draw()` implícito nas funções `draw*`.

**Object Pool Pattern:**
```js
const projs = Array.from({length: 100}, () => ({ active: false }))
// Reutiliza slots inativos — zero new Object() no loop
const slot = projs.find(p => !p.active)
Object.assign(slot, { active: true, ...dados })
```

---

## Camada 5 — Inimigos

Propriedades por inimigo:
```
active, type, hp, mhp, spd, reward,
col, r (radius), wi (waypointIndex), prog (0-1),
x, y (screen pixels), slow, slowt (slow timer)
```

**Movimento:** interpola entre waypoint atual e próximo via `prog`.
```js
e.prog += e.spd * e.slow * dt
if (e.prog >= 1) { e.prog -= 1; e.wi++ }
```

**Tipos:**
| Tipo   | HP  | Speed | Reward | Característica       |
|--------|-----|-------|--------|----------------------|
| Walker | 100 | 1.1   | 10     | Padrão               |
| Runner | 55  | 2.2   | 15     | Rápido, frágil       |
| Tank   | 300 | 0.65  | 25     | Lento, muito HP      |

---

## Camada 6 — Torres

Propriedades por torre:
```
row, col, type, cd (cooldown), sx, sy (screen cache), level (1-3)
```

**Targeting — Furthest Along Path:**
```js
score = enemy.waypointIndex + enemy.progress
// Mira o inimigo com maior score — mais próximo da base
```

**Stats por nível** (multiplicadores sobre base):
| Nível | Dano  | Range | Fire Rate |
|-------|-------|-------|-----------|
| LV1   | 1.0x  | 1.0x  | 1.0x      |
| LV2   | 1.5x  | 1.2x  | 1.35x     |
| LV3   | 2.4x  | 1.45x | 1.8x      |

**Custo de upgrade** (% do custo base da torre):
- LV1 → LV2: 60%
- LV2 → LV3: 100%

**Tipos:**
| Torre  | Custo | Dano | Range | Rate  | Especial          |
|--------|-------|------|-------|-------|-------------------|
| Archer | 50    | 22   | 3.2   | 1.2/s | Single target     |
| Cannon | 100   | 70   | 2.4   | 0.42/s| AoE splash 42px   |
| Ice    | 75    | 9    | 2.9   | 0.95/s| Slow 0.38x por 2.2s|

---

## Camada 7 — Projéteis

**Homing Projectile:** persegue o target em tempo real.
```js
dx = target.x - proj.x
dy = target.y - proj.y
dist = Math.sqrt(dx*dx + dy*dy)
proj.x += (dx/dist) * proj.speed * dt
```

**Hit Detection:** distância euclidiana simples.
```js
if (dist < proj.speed * dt + 5) { hit(proj) }
```

**AoE (Cannon):** ao acertar, itera todos os inimigos.
```js
enemies.forEach(e => {
  if (dist(e, target) <= splash) dmg(e, damage)
})
```

---

## Camada 8 — Wave System

**Spawn Queue:** lista de `{ type, at }` ordenada por tempo.
```js
queue = [ {type:'walker', at:0}, {type:'walker', at:1.4}, ... ]
```

**Wave Controller:**
```js
waveTimer += dt
while (queue[cursor].at <= waveTimer) { spawnEnemy(); cursor++ }
if (cursor >= queue.length && enemies.all(inactive)) endWave()
```

**Build Phase:** 8 segundos entre ondas. `[Espaço]` pula.
**Bônus inter-wave:** +30 ouro ao completar uma onda.

**Ondas definidas:**
| Onda | Composição                              |
|------|----------------------------------------|
| 1    | 6 Walkers                              |
| 2    | 5 Walkers + 3 Runners                  |
| 3    | 7 Runners + 4 Walkers                  |
| 4    | 3 Tanks + 5 Runners                    |
| 5    | 4 Tanks + 8 Runners + 6 Walkers        |

---

## Camada 9 — HUD e Input

**HUD:** desenhado em coordenadas de tela fixas via DOM (não canvas).
Elementos: gold, lives, wave, score, phase label, status bar.

**Input:**
- `mousemove` / `touchstart` → s2t() → highlight de tile
- `click` → s2t() → colocar torre ou selecionar torre existente
- `[1][2][3]` → seleção de torre por teclado
- `[Esc]` → cancela seleção / fecha painel de upgrade
- `[Espaço]` → inicia onda (na build phase)

**Upgrade Panel:** DOM sobreposto ao canvas (lado direito).
Aparece ao clicar em torre existente.
Atualiza stats e custo em tempo real conforme ouro muda.

---

## Camada 10 — Visual

Sem sprites. Tudo desenhado com Canvas 2D primitives:
- Tiles: losangos via `beginPath / lineTo` com faces laterais (pseudo-3D)
- Torres: cubos isométricos escalados por nível
- Inimigos: círculos com sombra elíptica e barra de HP
- Projéteis: círculos com halo translúcido
- Splash: anel expansivo animado

**Paleta:**
```
#E8440A  laranja — acento principal, torres, ouro
#1A1A1A  preto — tinta, torres escuras
#EBEBEB  cinza claro — fundo
#E2E2E2  grama
#CFC8C0  caminho
#7ECBE8  azul gelo — torre Ice, slow effect
```

---

## Camada 11 — Otimizações Mobile

**Offscreen Canvas:** tiles estáticos pré-renderizados.
**Object Pool:** zero alocação no loop principal.
**Delta time cap:** `Math.min(dt, 0.05)` — evita travamento após perda de foco.
**Painter sort:** apenas entidades dinâmicas são reordenadas por frame.
**DOM mínimo:** HUD em DOM, jogo em canvas — zero reflow no loop.
