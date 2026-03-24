# BUILD.md — tower-defense

Guia completo para testar no navegador e gerar APK Android.

---

## Modo 1 — Navegador (ciclo rápido)

Zero configuração. Para testar no celular na mesma rede Wi-Fi:

```bash
python3 -m http.server 8080
```

No celular, abre o navegador e acessa:
```
http://IP_DO_SEU_COMPUTADOR:8080
```

Para descobrir o IP do computador:
```bash
ip addr show | grep 'inet ' | grep -v '127.0.0.1'
```

Ciclo de desenvolvimento: edita o HTML no VSCode → salva → F5 no celular. Segundos.

---

## Modo 2 — APK Android via Capacitor

### Pré-requisitos (instalar uma vez)

**Node.js:**
```bash
sudo apt install nodejs npm -y
node --version  # precisa ser v16+
```

**Java (necessário para o Gradle):**
```bash
sudo apt install default-jdk -y
java --version
```

**Android SDK — opção A (leve, sem Android Studio):**
```bash
sudo apt install android-sdk adb -y
```

Adiciona ao `~/.bashrc`:
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin
```

```bash
source ~/.bashrc
```

Aceita licenças e instala plataforma:
```bash
yes | sdkmanager --licenses
sdkmanager "platforms;android-34" "build-tools;34.0.0"
```

**Android SDK — opção B (completo, com Android Studio):**
Baixa em https://developer.android.com/studio e instala.
O SDK fica em `~/Android/Sdk` por padrão.

---

### Configurar Capacitor (uma vez por projeto)

Na pasta do projeto:
```bash
npm init -y
npm install @capacitor/core @capacitor/android
npx cap init "Tower Defense" "com.rafamass.towerdefense" --web-dir .
npx cap add android
```

Isso cria a pasta `android/` com o projeto Android.

---

### Build do APK

Toda vez que quiser gerar um novo APK:

```bash
npx cap sync android && cd android && ./gradlew assembleDebug && cd ..
```

APK gerado em:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

---

### Instalar no celular

**Via USB (depuração USB ativada no celular):**

Ativa a depuração USB:
```
Configurações → Sobre o telefone → toca 7x em "Número da versão"
Configurações → Opções do desenvolvedor → Depuração USB → ativar
```

Conecta o cabo e instala:
```bash
adb devices          # verifica se o celular aparece
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Via Wi-Fi (sem cabo):**

No celular com Termux instalado:
```bash
# No Termux do celular
pkg install android-tools -y
adb tcpip 5555
```

No computador:
```bash
adb connect IP_DO_CELULAR:5555
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**Via arquivo (mais simples):**

Copia o APK pro celular via cabo, Google Drive, ou qualquer meio.
No celular, abre o gerenciador de arquivos e toca no `.apk`.
Precisa ter "Instalar apps desconhecidos" ativado nas configurações.

---

### Script de build completo

Cria um `build.sh` na raiz do projeto:

```bash
#!/bin/bash
set -e

echo "→ Sincronizando Capacitor..."
npx cap sync android

echo "→ Compilando APK..."
cd android
./gradlew assembleDebug
cd ..

echo "→ APK gerado:"
ls -lh android/app/build/outputs/apk/debug/app-debug.apk

echo "→ Instalando no celular..."
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

echo "✓ Pronto."
```

```bash
chmod +x build.sh
./build.sh
```

---

## Troubleshooting

**`ANDROID_HOME not set`:**
```bash
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

**`adb: device not found`:**
```bash
adb kill-server
adb start-server
adb devices
```

**`Gradle build failed` — versão do Java:**
```bash
java --version  # precisa ser Java 11 ou 17
sudo apt install openjdk-17-jdk -y
```

**APK instalado mas tela branca:**
Verifica se o `capacitor.config.json` tem `webDir` apontando para `.` (pasta do index.html).

**Performance ruim no celular:**
O APK via Capacitor usa uma WebView — a mesma engine do Chrome.
Se rodar bem no Chrome do celular, roda bem no APK.

---

## capacitor.config.json (referência)

```json
{
  "appId": "com.rafamass.towerdefense",
  "appName": "Tower Defense",
  "webDir": ".",
  "server": {
    "androidScheme": "https"
  },
  "android": {
    "allowMixedContent": true
  }
}
```
