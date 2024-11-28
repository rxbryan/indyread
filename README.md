# Indyread
Read Replica for the Hyperledger Indy Ledger.

Hyperledger Indy "read replica” is a sort of observer node for Indy Network that holds copies of the ledger transactions and can be used by clients that “trust” the replica. 
 
  - The use of read replicas will reduce the read load on the Indy ledgers it replicates. 
  - Each replica stays up to date with the transactions on the ledgers it connects to.
  - Agents using the replica need not connect directly with the ledger.

  This project focuses on improving the scalability of read transactions on Hyperledger Indy. 

  - Allows scaling of read transactions independent of the indy network. I.e support more clients.

  - Makes it easy to onboard new developers to Indy. Using a REST interface for indy read allows any client that can make a http request to read from any Hyperledger Indy network.

  - Solve network, port and firewall issues caused by reliance on ZMQ by the Indy network.

## How it works?
Indy read  consists of 
  - a daemon that reads transactions from all three Indy ledgers (pool, config, domain), and stores them on an elasticsearch index.

  - an API server that exposes endpoints analogous to the indy read requests. The server reads from the elasticsearch index.[Read more](./docs/API.md).

  - Transactions are stored in Elasticsearch ([storage format info](./packages/indyscan-storage/readme.md))

### Structure
```
- api/        - API for querying db-stored transactions
- daemon/     - process searching for ledger transactions, storing them in a database
- packages/indyscan-storage/    - shared library for app and daemon - how to store and retrieve transactions in db
- packages/indyscan-txtype/     - shared library contaning domain knowledge about indy transactions
```

## Start test instance locally in localhost
The easiest way to get started with indy read would be to use this [script](./manage). It starts an indy read instance and connects to the candy production netowrk.
in order to reduce start up time,  the first 1523 transactions are read from [here](./start_test/esindex/txs-candyprod/) which at the time of writing is all the transactions in the candy production domain ledger.

## for Custom deployments or running on host
If
- you want to deploy indy read replicas on your host machine
- you want to deploy indy read replicas against some particular Indy network
- you want to deploy indy read replicas on intranet

First take a look at the individual services [here](./daemon/) and [here](./api/), you will find useful more info about the individual services you need and how to configure them.

This [docker-compose](./docker-compose.es.yml) will startup an elasticsearch and kibana instance and this other [docker-compose](./docker-compose.prod.yml) will startup both the daemon and api services.
you might just figure small modification you need to do for your use case.

```sh
docker compose -f docker-compose.es.yml -f start_test/docker-compose.dev.yml up -d
```

## Configuration

See [Daemon](./api/readme.md) and [API server](./daemon/script/) for configuration information


## Usage
You can find out how to Setup indyread for local tests [here](docs/setup_local_test_network.md)


