### IndyRead API

**Description:**
This API provides endpoints for querying the indy ledger.

**Endpoints:**
* **GET /api/networks**
    * **Description:** Retrieve the networks supported by the running instance of indyread.
    * **Response:**
        * **JSON:**
            ```json
                [
                  {
                    "id": "TEST_NETWORK",
                    "ui": {
                      "priority": 1,
                      "display": "TEST_NETWORK",
                      "display-long": "",
                      "description": "For active development of indyread.",
                      "tutorial": "Get your DID and start writing on the network",
                      "tutorial-link": "",
                      "logo-address": ""
                    },
                    "aliases": [
                      ""
                    ],
                    "es": {
                      "index": "txs-bcovdev"
                    }
                  }
                ]
            ```

### Read Requests

#### GET_TXN

* **GET /api/networks/:networkRef/txs/:seqNo**
    * **Description:** Retrieve a transaction by id or seqno.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `seqNo`: `data` (int): Requested transaction sequence number (seqNo) as it’s stored on Ledger.
    * **Request Query:**
        * `ledgerId` (int enum, required): ID of the ledger the requested transaction belongs to (Pool=0; Domain=1; Config=2).
        * `reqId`: (required)
        * `identifier`: (required)
    * **Examples:**
        ```sh
          curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/txs/100?ledgerId=1&reqId=1514311352551755&identifier=MSjKTWkPLtYoPEaTF1TUDb
        ```
    * **Response:**
        * **JSON:**
            ```json
                {
                  "op": "REPLY",
                  "result": {
                    "type": 3,
                    "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                    "reqId": "1514311352551755",
                    "seqNo": 100,
                    "data": {
                      "ver": 1,
                      "txn": {
                        "data": {
                          "dest": "L5ak5y4ctDEqyHJsnRZMJL",
                          "raw": "{\"endpoint\":{\"endpoint\":\"http://10.1.0.12:8020\",\"routingKeys\":[]}}"
                        },
                        "metadata": {
                          "digest": "bed4b26e608fa866ace669cc18cf79e3b5ff29abe5992cbc57d9088447ff8fe5",
                          "from": "L5ak5y4ctDEqyHJsnRZMJL",
                          "payloadDigest": "aa3839b914ad6800e1dbe22737b114960e3534577892c0d3c7270a40791ec554",
                          "reqId": "1514311352551755"
                        },
                        "protocolVersion": 2,
                        "type": "100"
                      },
                      "txnMetadata": {
                        "seqNo": 100,
                        "txnId": "L5ak5y4ctDEqyHJsnRZMJL:1:b6bf7bc8d96f3ea9d132c83b3da8e7760e420138485657372db4d6a981d3fd9e",
                        "txnTime": 1690575694
                      },
                      "reqSignature": {
                        "type": "ED25519",
                        "values": [
                          {
                            "from": "L5ak5y4ctDEqyHJsnRZMJL",
                            "value": "5KNS3gCwvbdP5yaiMpsWSTKFSwRD7ZKyGHoe7TwtyFuCVAxAeFHrf1r7TfoymjtUSnh9Ykq9u8yKRFYkjLTKwYvR"
                          }
                        ]
                      },
                      "rootHash": "8HZx81ehri6fggMnqGEUUJMmAonfj4XKKg5kyNPPmt5H",
                      "auditPath": [
                        "7U19YUEjKB7fzvLZyuF1vqGAfr3dUg8cHVvmZFc2wmnA",
                        "3DtZb67YPv8Man8kHCj4M8PWXFDn2WEpnSJPNBZWgGbW",
                        "ByrpoQo2bYCUs1x8EwWfKBvnY74FW85eTexYN56WVM6R",
                        "4U4dWZhU4hKedrvs3EJuLQXsQyoBTYo6TbbUqbTMofTK",
                        "H2todTrd6uQdi9o9UEr41fnXueRvahquNMQxSatfubn1",
                        "FBBFf4oP7UJgP5bEoDVB4tuULEJHubjS2fnfM3ivuev3",
                        "BAMh6dZwJov2VUVMeuo4As4QU2eH98EdomrAwUaAfKwr",
                        "B5yx8ExTWjkgaDHuYWbosaoPhuq15uBx1jmp6npp6cKa",
                        "41vHGCg6qKUEtLAveyeWLMNdhZoH89Ym6xymFvSj64ER",
                        "APznt6o24yBWCNs5tVF4fC6h6rMz1Joj9BYWQuXJH1V5",
                        "3EByMrinqTxqaC7VEnQj4bKn29Gg357MoaTJxhZJvAbv",
                        "CV3xU14oTyGxemt6ZzLGhcBoTEcQ9MivEgo4fREPJbax",
                        "9MvXyCYNaPnTWV5ZW6E8hkPnjEurmTGmzTTUJJ9sGZ3L",
                        "8cPhRmSsSLKQjVGdSLcfQT12FdmPVct96ruLzuDzMjUZ",
                        "Cc3VieL5aXKyLLqt97PCrC3zoPU2F6wJddDZMhicCGSk",
                        "Cbs8mFThL3uUoZNPNJLrzSozYMp1mGPe5z2SuNwFdRUR",
                        "5QxygKhC5siMNd3geLBrXcdib341CRTpEFU3wicA6GM7",
                        "2kqdayLhGFcDwDizS7Tr4tU7zFQmAAoE7HQjwDsXuYa1",
                        "CmvdWARcru6SGgnCjjSvg6cLRwdTAixw2L1KwqHSEXUA",
                        "5PevtFLM7muNh9FWdWkkdkXngFQszy6br2kicPkghSC2",
                        "DuQMEgUHvqEpBqUj9shiiyn64u3hUu6qe5MCfHJHcpVC"
                      ]
                    }
                  }
                }
            ```

#### GET_NYM¶

* **GET /api/networks/:networkRef/txs/nym/:dest**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `ledger`: `domain` `pool` `config`.
        * `dest`: nym to search for.
    * **Request query:**
        * `timestamp`: timestamp' is mutually exclusive with 'seqNo'
        * `seqNo`: transaction id. seqNo' is mutually exclusive with 'timestamp'
        * `reqId`: (required)
        * `identifier`: (required)
    * **Example**
        ```sh
        curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/txs/nym/YT1mzd8om41njS7VuoAwZ4/?reqId=1514311352551755&identifier=MSjKTWkPLtYoPEaTF1TUDb
        ```
    * **Response:**
        * **JSON:**
            ```json
              [
                {
                  "op": "REPLY",
                  "result": {
                    "type": "105",
                    "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                    "reqId": "1514311352551755",
                    "seqNo": 14,
                    "txnTime": 1690575212
                  },
                  "data": {
                    "alias": "Bob.agent",
                    "dest": "YT1mzd8om41njS7VuoAwZ4",
                    "role": "101",
                    "verkey": "J99fCbX5wdrohpXmDiRDqJ5psje3MGD2hgEQgoGuy8hV",
                    "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                    "txnTime": 1690575212,
                    "seqNo": 14
                  },
                  "dest": "YT1mzd8om41njS7VuoAwZ4"
                }
              ]
            ```

#### GET_ATTRIB
* **GET /api/networks/:networkRef/txs/attrib/:dest**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `dest`: nym to search for.
    * **Request query:**
        * `timestamp`: timestamp' is mutually exclusive with 'seqNo'.
        * `seqNo`: transaction id. seqNo' is mutually exclusive with 'timestamp'.
        * `raw`: *base64 encoded* Requested attribute name.
    * **Example**
        ```sh
        curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/txs/attrib/RxFcjTjL6jPdn5EEJkNfqt?timestamp=1690575762&raw=eyJlbmRwb2ludCI6eyJlbmRwb2ludCI6Imh0dHA6Ly8xMC4xLjAuMTI6ODA0MCIsInJvdXRpbmdLZXlzIjpbXX19&reqId=1514311352551755&identifier=MSjKTWkPLtYoPEaTF1TUDb
        ```
    * **Response:**
        * **JSON:**
            ```json
              [
                {
                  "op": "REPLY",
                  "result": {
                    "type": "104",
                    "identifier": "MSjKTWkPLtYoPEaTF1TUDb",
                    "reqId": "1514311352551755",
                    "seqNo": 109,
                    "txnTime": 1690575762
                  },
                  "data": "{\"endpoint\":{\"endpoint\":\"http://10.1.0.12:8040\",\"routingKeys\":[]}}",
                  "dest": "RxFcjTjL6jPdn5EEJkNfqt",
                  "raw": "endpoint"
                }
              ]
            ```



#### GET_SCHEMA
#### GET_CLAIM_DEF
#### GET_REVOC REG_DEF
#### GET_REVOC_REG
#### GET_REVOC_REG_DELTA
#### GET_AUTH_RULE
#### GET_TRANSACTION AUTHOR_AGREEMENT
#### GET_TRANSACTION_AUTHOR_AGREEMENT_AML
#### GET_CONTEXT
