FROM node:12.14.0-alpine3.9 as BUILD

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

RUN apk add make
RUN apk add g++
RUN apk add python

RUN npm install -g npm@8.7.0

WORKDIR /usr/src/app/packages/indyscan-storage

COPY packages/indyscan-storage ./
RUN npm ci --only=prod

WORKDIR /usr/src/app/api
COPY api/package*.json ./
RUN npm ci --only=prod
COPY api ./

FROM node:12.14.0-alpine3.9 as PRODUCTION

RUN apk update && apk upgrade
COPY --from=BUILD /usr/src/app/packages/indyscan-storage /usr/src/app/packages/indyscan-storage
COPY --from=BUILD /usr/src/app/api /usr/src/app/api
WORKDIR /usr/src/app/api

ENV ES_URL ${ES_URL}
ENV PORT ${PORT:-"3708"}
ENV NETWORKS_CONFIG_PATH ${NETWORKS_CONFIG_PATH:-"./app-config/testnetwork.json"}
ENV LOG_LEVEL ${LOG_LEVEL:-"info"}
ENV LOG_HTTP_REQUESTS ${LOG_HTTP_REQUESTS:-"false"}
ENV LOG_HTTP_RESPONSES ${LOG_HTTP_RESPONSES:-"false"}

EXPOSE ${PORT}

LABEL org.label-schema.schema-version="1.0"
LABEL org.label-schema.vendor=""
LABEL org.label-schema.name="IndyreadAPI"
LABEL org.label-schema.description="Indy read replica"
LABEL org.label-schema.vcs-url="https://github.com/rxbryan/indyread"

CMD npm run start
