FROM node:26.2.0-alpine3.22 AS runner

WORKDIR /app

COPY dist/ ./dist/

CMD ["node", "./dist/main.js"]
