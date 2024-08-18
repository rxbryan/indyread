# Indyread
Read Replica for the Hyperledger Indy Ledger.

Read replicas, in context of Hyperledger Indy, are copies of ledger transactions that are kept synchro-
nized with the original Indy ledger. They are designed to offload read traffic from the main ledger,
improving performance and scalability.
This project focuses on improving the scalability of read transactions on Hyperledger Indy. These
replicas store copies of ledger transactions and can be accessed by trusted entities (agents). Benefits
include:
- Reduces load on the main ledger for frequent read requests.
- Offers a simpler API for retrieving data compared to the complex ZMQ interface for the main
ledger.
- Enables faster resolution of read transactions for agents.

## Run IndyRead on Sovrin Netork
first startup an elasticsearch image by running: 
```
make es-up
```
start up the daemon:
```
cd daemon &&  npm run start
```
start up the rest server:
```
cd api && ES_URL=http://localhost:9200 DAEMON_URL=http://localhost:3709 LOG_LEVEL=info PORT=3708 NETWORKS_CONFIG_PATH=./app-config/sovrin-buildernet.json LOG_HTTP_REQUESTS=true LOG_HTTP_RESPONSES=true npm run start
```

This will start up
- indyread services (scanner, api, elasticsearch)
- by default also kibana, you can opt-out by commenting it out in the `docker-compose` file
 