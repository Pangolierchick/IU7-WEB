FROM arm64v8/node:latest

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json openapi.json node_modules ./
COPY src ./src
COPY prisma ./prisma

RUN yarn install --immutable --immutable-cache --check-cache

EXPOSE 3000

CMD [ "yarn", "start:docker" ]
