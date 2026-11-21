# The whole product in one container: the website and Node API on the public port, the Python AI gateway on loopback only.
# Build from the repository root.
FROM node:24-slim AS site
# The website installs from the pnpm workspace lockfile: frontend/package-lock.json is stale and has no build tools.
RUN npm install -g pnpm@11.6.0
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages
COPY frontend/package.json ./frontend/
RUN pnpm install --frozen-lockfile
COPY frontend ./frontend
# An empty API address means "the address this page was served from".
RUN cd frontend && VITE_NODE_BASE_URL= pnpm exec vite build --outDir dist-web --emptyOutDir

FROM node:24-slim AS api
WORKDIR /app/backend/node
COPY backend/node/package.json backend/node/package-lock.json ./
RUN npm ci --omit=dev
COPY backend/node ./

FROM python:3.12-slim
COPY --from=api /usr/local/bin/node /usr/local/bin/node
RUN node --version
WORKDIR /app/backend/python
COPY backend/python/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/python ./
COPY --from=api /app/backend/node /app/backend/node
COPY --from=site /app/frontend/dist-web /app/web
COPY deploy/start.sh /app/start.sh
ENV NODE_ENV=production STATIC_DIR=/app/web TRUST_PROXY=1 AI_HOST=127.0.0.1 AI_PORT=8010 PYTHON_AI_URL=http://127.0.0.1:8010
RUN useradd --system --no-create-home curasense
USER curasense
CMD ["bash", "/app/start.sh"]
