# DEVLOG.md — tower-defense

Registro cronológico de decisões, progresso e aprendizados.

---

## Decisões de arquitetura

### Canvas 2D puro (não WebGL)
**Motivo:** compatibilidade com iPad mini 2 (GPU PowerVR G6430).
WebGL tem driver instável em devices antigos — contexto perdido facilmente.
Canvas 2D é previsível, amplamente suportado, sem overhead.
**Impacto:** limite prático de ~80-100 entidades simultâneas antes de queda de FPS.

### Arquivo único HTML
**Motivo:** zero configuração, zero build step, abre no navegador direto.
Facilita o ciclo de vibecoding: edita → F5 → testa.
**Impacto:** sem módulos, sem tree-shaking. Aceitável para o escopo do projeto.

### Waypoints fixos (não A*)
**Motivo:** A* em tempo real em grid grande é caro demais para mobile.
Caminho predefinido é suficiente para tower defense clássico.
**Impacto:** mapa não pode ter obstáculos dinâmicos bloqueando o caminho.

### Object Pool de projéteis
**Motivo:** evitar Garbage Collection no loop — GC causa stutters perceptíveis.
100 slots pré-alocados, reutilizados com `active: false`.
**Impacto:** limite de 100 projéteis simultâneos (suficiente para 5 ondas).

### Targeting: furthest along path
**Motivo:** mais estratégico que "nearest enemy" — prioriza quem está chegando na base.
**Impacto:** torres focam inimigos que estão escapando, não os recém-chegados.

### Offscreen Canvas para mapa
**Motivo:** tiles estáticos redesenhados a cada frame são desperdício de GPU.
Pré-renderiza uma vez, copia com `drawImage` — uma operação barata.
**Impacto:** rebuild necessário apenas quando o mapa muda (colocar torre não muda o mapa).

---

## Progresso por etapa

### Etapa 1 — Fundação visual ✓
Canvas + game loop + delta time + iso math + tilemap + offscreen canvas.
Inimigos demo percorrendo waypoints. Hover de tile. HUD básico.

### Etapa 4 — Torres e combate ✓
Torres com targeting, projectile pool, hit detection, splash AoE.
3 tipos de torre, 3 tipos de inimigo. 5 ondas. Painel de seleção.
Floaty numbers, wave banner, game over, vitória.

### Etapa 7 — Upgrades ✓
Sistema de 3 níveis com multiplicadores de stats.
Painel lateral com barras de stat e custo dinâmico.
Visual progressivo: torre cresce e clareia com o nível.
Level pips laranja abaixo de cada torre.

---

## Roadmap

### Etapa 8 — Som
Web Audio API sem assets externos.
Sons gerados por oscilador (beep sintético) para:
- Tiro de archer
- Explosão de cannon
- Hit de ice
- Morte de inimigo
- Wave start
- Game over

### Etapa 9 — Segundo mapa
Tela de seleção de mapa antes do jogo.
Mapa 2 com layout diferente e waypoints alternativos.
Dificuldade base escalada.

### Etapa 10 — APK
Capacitor configurado.
Build script automatizado.
Ícone e splash screen.
Teste de performance no device real.

### Backlog
- Inimigo Splitter (ao morrer, spawna 2 menores)
- Torre Tesla (chain lightning, atinge múltiplos)
- Torre Poison (DoT — dano por segundo)
- Sistema de save (localStorage)
- Highscore local
- Animação de sprite sheet nos inimigos
- Partículas de morte

---

## Notas técnicas

### Performance no iPad mini 2
Testado até ~40 inimigos simultâneos com 3 torres atirando: ~50fps.
Acima de 60 inimigos: queda perceptível. Cap natural das waves está abaixo disso.

### WebKit (Safari mobile) — quirks conhecidos
- `requestAnimationFrame` tem comportamento ligeiramente diferente em background tab.
- `canvas.getContext('2d')` pode falhar se muitos canvas forem criados (limite ~16).
- `touchstart` mais responsivo que `click` em iOS (300ms delay no click).
  → Considerar adicionar `touchstart` handler para colocação de torres.

### Capacitor WebView
A WebView do Android usa Chromium — mesma engine do Chrome.
Performance na WebView é ~80-90% da performance no Chrome standalone.
Testar no Chrome mobile antes de gerar APK é indicativo confiável.
