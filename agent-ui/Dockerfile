###############################
# Stage 1: Build estático Next (# output: 'export')
###############################
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencias del sistema mínimas (git puede ser necesario para algunos paquetes)
RUN apk add --no-cache git

# PNPM
RUN npm install -g pnpm@9

# Capa de dependencias
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Código fuente
COPY . .

# Build (genera carpeta out/ gracias a output: 'export')
ENV NODE_ENV=production
RUN pnpm run build:static && test -d out

###############################
# Stage 2: Runtime estático con Nginx
###############################
FROM nginx:1.27-alpine AS runtime

WORKDIR /usr/share/nginx/html

# Copiamos export estático
COPY --from=builder /app/out ./

# Configuración de Nginx personalizada (SPA fallback + caché agresivo para assets)
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Puerto (coincidimos con 3000 para compatibilidad con hosting que espera 3000)
EXPOSE 3000

# Healthcheck simple (opcional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
