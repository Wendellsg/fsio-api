FROM node:18.18.2-alpine AS base

USER root

# Instala pnpm via npm
RUN npm install -g pnpm

USER node

RUN mkdir /home/node/project

WORKDIR /home/node/project

FROM base AS build

COPY --chown=node:node package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src src/
COPY --chown=node:node prisma prisma/

RUN pnpm build

RUN pnpm install --production --ignore-scripts --prefer-offline

FROM base AS deploy

COPY --from=build /home/node/project/node_modules node_modules/
COPY --from=build /home/node/project/dist dist/
COPY --from=build /home/node/project/package.json package.json
COPY --from=build /home/node/project/prisma prisma/

CMD ["pnpm", "start:prod"]
