# SESSION.md — tower-defense

> Atualizar ao fim de cada sessão de trabalho.

---

## Estado atual

**Versão:** Etapa 7 — Sistema de upgrades  
**Arquivo principal:** `index.html` (arquivo único, autossuficiente)  
**Status:** Jogável no navegador

---

## O que está implementado

- [x] Canvas 2D + game loop com requestAnimationFrame e delta time
- [x] Projeção isométrica completa (tileToScreen / screenToTile)
- [x] Offscreen Canvas para mapa estático
- [x] Painter's Algorithm para ordenação de profundidade
- [x] Tilemap 12x12 com waypoints predefinidos
- [x] Object Pool de projéteis (100 slots)
- [x] 3 tipos de torre: Archer, Cannon, Ice
- [x] 3 tipos de inimigo: Walker, Runner, Tank
- [x] 5 ondas com dificuldade crescente
- [x] Sistema de targeting (furthest along path)
- [x] Projéteis homing com hit detection por distância euclidiana
- [x] Splash damage (Cannon) com FX visual
- [x] Slow debuff (Ice) com indicador visual no inimigo
- [x] Painel de seleção de torre com ícones no canvas
- [x] Hover com preview de colocação
- [x] Sistema de upgrades 3 níveis (clique em torre existente)
- [x] Level pips visuais nas torres
- [x] Floaty numbers (ouro, level up)
- [x] HUD: ouro, vidas, wave, score
- [x] Wave banner, build phase timer, bônus inter-wave
- [x] Game over e vitória com overlay
- [x] Atalhos de teclado: [1][2][3][Esc][Espaço]

---

## Próximo passo sugerido

- [ ] Etapa 8: Sons via Web Audio API (sem assets externos)
- [ ] Etapa 9: Segundo mapa / seleção de mapa
- [ ] Etapa 10: Build APK via Capacitor

---

## Decisões tomadas

- Canvas 2D puro (não WebGL) — compatibilidade com iPad mini 2
- Arquivo único HTML — sem bundler, abre direto no navegador
- Object Pool de 100 slots — zero GC no loop
- Targeting por furthest along path — mais estratégico que nearest
- Offscreen canvas para tiles — só redesenha quando mapa muda

---

## Problemas conhecidos

- Nenhum no momento.

---

## Notas de sessão

_Adicionar aqui ao encerrar cada sessão._
