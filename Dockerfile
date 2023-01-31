FROM node:19-slim AS build

COPY . /opt/app/gw2-tools
WORKDIR /opt/app/gw2-tools
RUN npm ci
RUN npx tsc

FROM node:19-slim
COPY --from=build /opt/app/gw2-tools/dist /opt/app/gw2-tools
COPY ./package* /opt/app/gw2-tools/
WORKDIR /opt/app/gw2-tools

RUN npm ci --omit=dev

CMD ["node", "main.js"]