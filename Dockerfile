FROM node:20

WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json openapi.json ./
COPY src ./src
COPY prisma ./prisma

RUN yarn

EXPOSE 3000

CMD [ "yarn", "start:docker" ]
