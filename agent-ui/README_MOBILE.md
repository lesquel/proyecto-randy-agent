# Mobile (Capacitor) Build Guide

## Requisitos

- Node + pnpm / bun
- Java JDK 17
- Android Studio instalado
- SDK Platforms (Android 14) y Build Tools

## 1. Instalar dependencias Capacitor

```
pnpm add @capacitor/core @capacitor/android
pnpm add -D @capacitor/cli
```

## 2. Generar build web

```
pnpm run build:mobile
```

Esto ejecuta `next export` y genera carpeta `out/` y luego sincroniza con Android (`android/app/src/main/assets/public`).

## 3. Abrir en Android Studio

```
pnpm run open:android
```

Luego: Build > Generate APK(s) o Build > Generate Signed Bundle/APK.

## 4. Splash e Iconos

Reemplaza:

- `android/app/src/main/res/mipmap-*/*` con tus íconos.
- Agrega `icon-192.png` y `icon-512.png` en `public/` (ya referenciados en manifest).

## 5. Service Worker / Offline

Archivo: `public/service-worker.js`. Ajusta caché si necesitas más recursos.

## 6. Actualizar contenido

Cada vez que modifiques la web:

```
pnpm run export
npx cap sync android
```

## 7. Live Reload (opcional)

En `capacitor.config.ts` puedes configurar `server: { url: 'http://TU_IP:3000', cleartext: true }` durante desarrollo para apuntar al dev server.

## 8. Errores comunes

- Pantalla blanca: revisa que `out/` exista y `cap sync` se ejecutó.
- Recursos 404: usar rutas relativas; `output: 'export'` ya configurado.
- SW no registra en Android: asegúrate de `https` o esquema configurado.

## 9. Ajustes extra

- Permisos: editar `android/app/src/main/AndroidManifest.xml`.
- Versión app: `android/app/build.gradle` -> `versionCode`, `versionName`.

---

Listo para generar APK.
