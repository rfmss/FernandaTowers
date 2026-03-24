# CLAUDE.md — tower-defense

## Projeto
Tower defense isométrico para navegador mobile e APK Android.
Arquivo principal: `index.html` — sem framework, sem bundler, sem build step no HTML.
Empacotado como APK via Capacitor quando necessário.

## Permissões
- Executa comandos sem pedir confirmação.
- Edita e cria arquivos sem aprovação prévia.
- Instala dependências de sistema quando necessário.
- Nunca fragmenta um comando — sempre um bloco completo e pronto pra colar.

## Ambiente de desenvolvimento
- OS: Linux MX 25
- Editor: VSCode
- Node: instalado via apt ou nvm
- Android SDK: ~/Android/Sdk
- ADB: disponível no PATH
- Target primário: navegador mobile (Safari WebKit, Chrome Android)
- Benchmark de performance: iPad mini 2

## Testar no navegador (rápido)
```bash
python3 -m http.server 8080
```
Acessa `http://IP_DA_MAQUINA:8080` no celular na mesma rede Wi-Fi.
Sem cabo, sem build, ciclo de segundos.

## Gerar APK
```bash
npx cap sync android && cd android && ./gradlew assembleDebug
```
APK gerado em: `android/app/build/outputs/apk/debug/app-debug.apk`

## Instalar no celular
Via USB:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```
Via Wi-Fi:
```bash
adb connect IP_DO_CELULAR:5555 && adb install android/app/build/outputs/apk/debug/app-debug.apk
```

## Stack do jogo
- Renderização: Canvas 2D puro
- Lógica: JavaScript vanilla, arquivo único
- Projeção: isométrica (tileToScreen / screenToTile)
- Mapa: grid 2D com waypoints fixos
- Entidades: Object Pool Pattern
- Mapa estático: Offscreen Canvas
- Ordenação: Painter's Algorithm por (row + col)
- Sem WebGL, sem SVG, sem npm no jogo

## Arquitetura de arquivos
```
tower-defense/
├── index.html          # jogo completo
├── CLAUDE.md           # este arquivo
├── SESSION.md          # memória de sessão (atualizar ao encerrar)
├── ARCHITECTURE.md     # arquitetura técnica detalhada
├── BUILD.md            # guia de build e deploy
├── DEVLOG.md           # registro de decisões e progresso
├── android/            # gerado pelo Capacitor (não editar manualmente)
├── package.json        # gerado pelo Capacitor
└── capacitor.config.json
```

## Convenções de código
- Nomes de função e variável: inglês
- Comentários: português
- Constantes: CAPS no topo do arquivo
- Funções de update separadas das funções de draw
- Sempre delta time — nunca velocidade em pixels absolutos por frame
- Zero criação de objeto dentro do game loop

## Regras de performance inegociáveis
- Usar Object Pool — nunca criar objetos dentro do loop
- Zero innerHTML dentro do loop
- Offscreen Canvas para elementos estáticos
- Cap de delta time em 50ms
- Testar no iPad mini 2 antes de considerar pronto

## O que não fazer
- Não usa WebGL
- Não adiciona bibliotecas externas sem avisar
- Não refatora sem ser pedido
- Não quebra o que está funcionando
- Não abre múltiplas perguntas — se precisar de info, pergunta uma coisa só

## Memória de sessão
- Ao iniciar: ler CLAUDE.md e SESSION.md
- Ao encerrar: atualizar SESSION.md com o que foi feito e o próximo passo
