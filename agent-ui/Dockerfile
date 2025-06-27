# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia package.json y lockfile para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instala dependencias
RUN pnpm install

# Copia el resto del código fuente
COPY . .

# Construye la app Next.js
RUN pnpm run build

# Etapa 2: Runner (producción)
FROM node:20-alpine AS runner

WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia la carpeta .next de la build (generada)
COPY --from=builder /app/.next ./.next

# Copia package.json y lockfile para instalar solo dependencias de producción
COPY package.json pnpm-lock.yaml ./

# Instala solo dependencias de producción
RUN pnpm install --prod

# Copia la carpeta public si existe
# Si la carpeta no existe, no la copies (para evitar errores)
# Esto depende de que exista en tu contexto de build
# Así que asegúrate de que no esté en .dockerignore si la necesitas
COPY --from=builder /app/public ./public

# Copia archivos de configuración necesarios
COPY --from=builder /app/next.config.js ./ || true
COPY --from=builder /app/tsconfig.json ./ || true

# Expone el puerto en que corre Next.js (por defecto 3000)
EXPOSE 3000

# Comando para iniciar la app
CMD ["pnpm", "start"]
