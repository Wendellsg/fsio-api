FROM node:18.18.2-alpine AS base

USER root

# Instala yarn via apk
RUN apk add --no-cache yarn

USER node

RUN mkdir /home/node/project

WORKDIR /home/node/project

FROM base AS build

COPY --chown=node:node package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY --chown=node:node tsconfig.json ./
COPY --chown=node:node src src/
COPY --chown=node:node prisma prisma/

RUN yarn build

RUN yarn install --production --ignore-scripts --prefer-offline

FROM base AS deploy

COPY --from=build /home/node/project/node_modules node_modules/
COPY --from=build /home/node/project/dist dist/
COPY --from=build /home/node/project/package.json package.json
COPY --from=build /home/node/project/prisma prisma/

CMD ["yarn", "start:prod"]