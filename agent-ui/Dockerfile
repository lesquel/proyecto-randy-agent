###############################
# Stage 1: Build estático Next (# output: 'export')
###############################
FROM node:20-alpine AS builder

WORKDIR /app

# Dependencias del sistema mínimas (git puede ser necesario para algunos paquetes)
RUN apk add --no-cache git libc6-compat

# PNPM
RUN npm install -g pnpm@9

# Capa de dependencias
COPY package.json pnpm-lock.yaml ./
ARG PNPM_INSTALL_FLAGS="--no-frozen-lockfile"
RUN pnpm install $PNPM_INSTALL_FLAGS

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
RUN rm -f /etc/nginx/conf.d/default.conf \
	&& apk add --no-cache curl \
	&& addgroup -g 1010 appgrp || true \
	&& adduser -D -G appgrp -u 1010 appusr || true
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx.main.conf /etc/nginx/nginx.conf
# Ajuste de permisos para ejecutar nginx como usuario no root (appusr)
# Nginx necesita escribir en /var/cache/nginx (usamos ahí el pid), /var/run y logs.
RUN mkdir -p /var/cache/nginx /var/run /var/log/nginx \
	&& touch /var/cache/nginx/nginx.pid \
	&& chown -R appusr:appgrp /usr/share/nginx/html /var/cache/nginx /var/run /var/log/nginx \
	&& chmod -R 755 /var/cache/nginx /var/run /var/log/nginx

# Puerto (coincidimos con 3000 para compatibilidad con hosting que espera 3000)
EXPOSE 3000

# Healthcheck simple (opcional)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
	CMD curl -fsSL http://localhost:3000/ >/dev/null || exit 1

USER appusr

CMD ["nginx", "-g", "daemon off;"]
