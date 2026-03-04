# SpryvAI — App de Escritorio Windows

## Requisitos

- Node.js 18 o superior → https://nodejs.org
- Windows 10/11 x64

---

## Cómo compilar el instalador .exe

### 1. Instalar dependencias

```
npm install
```

### 2. Añadir el icono (opcional pero recomendado)

Coloca un archivo `icon.ico` (256x256px) en la carpeta `assets/`.
Si no lo tienes, crea la carpeta vacía y quita la línea `"icon"` del package.json.

```
mkdir assets
```

### 3. Compilar el instalador

```
npm run build
```

El instalador aparecerá en `dist/SpryvAI Setup 1.0.0.exe`

---

## Cómo probar sin compilar

```
npm start
```

Abre la app directamente en modo desarrollo.

---

## Primer uso

1. Instala la app con el .exe
2. Abre SpryvAI
3. Haz clic en ⚙ (Ajustes, arriba a la derecha)
4. Introduce tu API Key de Anthropic (`sk-ant-...`)
   → La consigues en https://console.anthropic.com → API Keys
5. Guarda y empieza a usar

---

## Estructura del proyecto

```
spryvai-app/
├── main.js          ← Proceso principal de Electron
├── preload.js       ← Puente seguro entre app y sistema
├── package.json     ← Configuración y scripts
├── src/
│   └── index.html   ← La aplicación completa
└── assets/
    └── icon.ico     ← Icono de la app (añadir manualmente)
```

---

## Datos guardados

Los proyectos y la API Key se guardan cifrados en:
`C:\Users\[usuario]\AppData\Roaming\spryvai\`

---

SpryvAI · Pablo Sejas · Deloitte · 2026
