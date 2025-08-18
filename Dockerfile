FROM node:lts as builder

WORKDIR /app

COPY . .

RUN yarn install --frozen-lockfile
RUN yarn prisma:generate
RUN yarn build

FROM node:lts-alpine

WORKDIR /app

COPY --from=builder /app/package.json /app/yarn.lock ./
COPY --from=builder /app/build ./

RUN yarn install --frozen-lockfile --production

RUN apk add curl
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3\
    CMD [ "curl", "--fail", "--silent", "--output", "/dev/null", "localhost:3000/api/status" ]

EXPOSE 3000

CMD ["node", "./index.js"]