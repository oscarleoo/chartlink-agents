# Runs the stdio bridge to https://chartlink.app/mcp. Registries that build
# a repo to inspect its tools (Glama) read this; the bridge lists every tool
# without a key, and tool calls need CHARTLINK_API_KEY.
FROM node:20-alpine
WORKDIR /app
COPY packages/chartlink-mcp/package.json packages/chartlink-mcp/package-lock.json* ./
RUN npm install --omit=dev --ignore-scripts && npm install --no-save typescript @types/node
COPY packages/chartlink-mcp/tsconfig.json ./
COPY packages/chartlink-mcp/src ./src
RUN npx tsc -p tsconfig.json
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]
