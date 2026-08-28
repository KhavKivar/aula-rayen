FROM node:24-alpine AS build

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY packages/contracts/package.json packages/contracts/package.json

RUN pnpm install --frozen-lockfile

COPY apps/api apps/api
COPY packages/contracts packages/contracts

RUN pnpm --filter @aula-rayen/api build

RUN pnpm --filter @aula-rayen/api deploy --legacy --prod /prod

FROM node:24-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /prod ./
COPY --from=build /app/apps/api/dist ./dist

EXPOSE 3000

CMD ["node", "dist/main.js"]
