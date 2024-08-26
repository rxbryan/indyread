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

### Usage
You can find out how to Setup indyread for local tests [here](docs/setup_local_test_network.md)

### API
Provides replica clients with an HTTP version of the existing ledger API for querying and retrieving relevant identity data from the replicas. [Read more](docs/API.md).

###  Daemon
Scans ledger and stores the found transactions in an elasticsearch database.

