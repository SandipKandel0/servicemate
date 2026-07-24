## Base: shared setup, installs ALL dependencies (used by dev via override)
FROM node:20-bookworm-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
EXPOSE 5000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+(process.env.PORT||5000)+'/api/health', r => process.exit(r.statusCode===200?0:1)).on('error', () => process.exit(1))"

## Production: prunes devDependencies for a leaner runtime image
FROM base AS production
ENV NODE_ENV=production
RUN npm prune --omit=dev
CMD ["node", "server.js"]
