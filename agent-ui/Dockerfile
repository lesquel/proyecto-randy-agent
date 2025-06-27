# Etapa 1: Construcción
FROM node:20-alpine AS builder

# Crea directorio de trabajo
WORKDIR /app

# Instala pnpm globalmente
RUN npm install -g pnpm

# Copia archivos necesarios para instalar dependencias
COPY package.json pnpm-lock.yaml ./

# Instala dependencias
RUN pnpm install

# Copia el resto del código fuente
COPY . .

# Genera la build de producción
RUN pnpm run build

# Etapa 2: Imagen final para producción
FROM node:20-alpine AS runner

# Crea directorio de trabajo
WORKDIR /app

# Copia solo los archivos necesarios para producción
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules

# Render usará este puerto
EXPOSE 3000

# Comando de arranque
CMD ["node_modules/.bin/next", "start"]
