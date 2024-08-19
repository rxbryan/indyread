FROM ghcr.io/absaoss/vcxagencynode/vcxagency-base:2.5.0-release260-864 as nodejs

RUN apk add --no-cache \
        npm \
        bash \
        g++ \
        gcc \
        make \
        cmake \
        python2 \
        curl

RUN npm install -g npm@8.7.0

USER node

USER root
ARG UID=1002
ARG GID=1002
RUN addgroup -g $GID indyread && adduser -u $UID -D -G indyread indyread

WORKDIR /home/indyread/packages/indyscan-txtype
WORKDIR /home/indyread/packages/indyscan-storage
WORKDIR /home/indyread/daemon
RUN chown -R indyread:indyread /home/indyread

USER indyread

WORKDIR /home/indyread/packages/indyscan-txtype
COPY --chown=indyread:indyread packages/indyscan-txtype ./
RUN npm ci --only=prod

WORKDIR /home/indyread/packages/indyscan-storage
COPY --chown=indyread:indyread packages/indyscan-storage ./
RUN npm ci --only=prod

WORKDIR /home/indyread/daemon
COPY --chown=indyread:indyread daemon/package*.json ./
COPY --chown=indyread:indyread ./daemon ./
RUN rm -rf /node_modules
RUN npm ci --only=prod

USER root
RUN chown -R indyread:indyread /home/indyread
USER indyread
RUN mkdir -p /home/indyread/daemon/logs
RUN mkdir -p /home/indyread/.indy_client/wallet
RUN mkdir -p /home/indyread/.indy_client/pool

LABEL org.label-schema.schema-version="1.1.0"
LABEL org.label-schema.name="indyread-daemon"
LABEL org.label-schema.description="Application scanning Hyperledger Indy blockchain for new transactions and further processing."
LABEL org.label-schema.vcs-url="https://github.com/rxbryan/indyread"

WORKDIR /home/indyread/daemon

CMD npm run start
