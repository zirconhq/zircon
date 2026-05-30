FROM node:26.2.0-alpine3.22 AS installer

# Install pnpm
RUN npm install -g pnpm@10.15.1

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm run init

FROM node:26.2.0-alpine3.22 AS runner

WORKDIR /app

COPY package.json ./
COPY --from=installer /app/node_modules ./node_modules
COPY dist/ ./dist/

CMD ["node", "./dist/main.js"]
