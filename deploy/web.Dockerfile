# The website and the Node API, served from one address. Build from the repository root.
FROM node:24-slim AS site
WORKDIR /app
COPY packages ./packages
COPY frontend/package.json frontend/package-lock.json ./frontend/
RUN cd frontend && npm ci
COPY frontend ./frontend
# An empty API address means "the address this page was served from".
RUN cd frontend && VITE_NODE_BASE_URL= npx vite build --outDir dist-web --emptyOutDir

FROM node:24-slim
WORKDIR /app/backend/node
COPY backend/node/package.json backend/node/package-lock.json ./
RUN npm ci --omit=dev
COPY backend/node ./
COPY --from=site /app/frontend/dist-web /app/web
ENV NODE_ENV=production STATIC_DIR=/app/web TRUST_PROXY=1 PASSWORD_RESET_EMAIL=1
USER node
CMD ["node", "server.js"]
