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

* **GET /api/networks/:networkRef/ledgers/:ledger/txs/:seqNo**
    * **Description:** Retrieve a transaction by id or seqno.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `ledger`: `domain` `pool` `config`.
        * `seqNo`: transaction id.
    * **Examples:**
        ```sh
          curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/ledgers/domain/txs/1
        ```
    * **Response:**
        * **JSON:**
            ```json
                {
                  "imeta": {
                    "subledger": "domain",
                    "seqNo": 1
                  },
                  "idata": {
                    "serialized": {
                      "imeta": {
                        "subledger": "domain",
                        "seqNo": 1
                      },
                      "idata": {
                        "json": "{\"reqSignature\":{},\"txn\":{\"data\":{\"dest\":\"V4SGRU86Z58d6TV7PBUe6f\",\"role\":\"0\",\"verkey\":\"~CoRER63DVYnWZtK8uAzNbx\"},\"metadata\":{},\"type\":\"1\"},\"txnMetadata\":{\"seqNo\":1},\"ver\":\"1\",\"rootHash\":\"8HZx81ehri6fggMnqGEUUJMmAonfj4XKKg5kyNPPmt5H\",\"auditPath\":[\"3XtSyZ8CQPJUYbc5mFKvUendLZSt4ybG2Y4zRtJEewSL\",\"96irBGYpWrTvrVATexGGvktPrT3WicixwT8BtoZTtkYX\",\"HqXD3TkLbpRuRU7CrrvrBeZwKuNFVCfta1ez7X7jGjtF\",\"3fsGMWtrpYdNiLZKRKGmhGUJTUkdC2yn2yNd8MPGjwdq\",\"BwS8ttPxJXQ4yn5RDy6spyxrFRZkukr9dbs9bjfskz1U\",\"3wvhiYWLX3fRwGp1SoLeMQas6xtRHK8n7a3WqLPiwyMc\",\"8oJHS289uuhcmgrvrzVtXvRGFfoXRnTWZnHQRYopDtUG\",\"B5yx8ExTWjkgaDHuYWbosaoPhuq15uBx1jmp6npp6cKa\",\"41vHGCg6qKUEtLAveyeWLMNdhZoH89Ym6xymFvSj64ER\",\"APznt6o24yBWCNs5tVF4fC6h6rMz1Joj9BYWQuXJH1V5\",\"3EByMrinqTxqaC7VEnQj4bKn29Gg357MoaTJxhZJvAbv\",\"CV3xU14oTyGxemt6ZzLGhcBoTEcQ9MivEgo4fREPJbax\",\"9MvXyCYNaPnTWV5ZW6E8hkPnjEurmTGmzTTUJJ9sGZ3L\",\"8cPhRmSsSLKQjVGdSLcfQT12FdmPVct96ruLzuDzMjUZ\",\"Cc3VieL5aXKyLLqt97PCrC3zoPU2F6wJddDZMhicCGSk\",\"Cbs8mFThL3uUoZNPNJLrzSozYMp1mGPe5z2SuNwFdRUR\",\"5QxygKhC5siMNd3geLBrXcdib341CRTpEFU3wicA6GM7\",\"2kqdayLhGFcDwDizS7Tr4tU7zFQmAAoE7HQjwDsXuYa1\",\"CmvdWARcru6SGgnCjjSvg6cLRwdTAixw2L1KwqHSEXUA\",\"5PevtFLM7muNh9FWdWkkdkXngFQszy6br2kicPkghSC2\",\"DuQMEgUHvqEpBqUj9shiiyn64u3hUu6qe5MCfHJHcpVC\"],\"ledgerSize\":1878460}"
                      }
                    },
                    "expansion": {
                      "imeta": {
                        "seqNo": 1,
                        "subledger": "domain"
                      },
                      "idata": {
                        "txnMetadata": {
                          "seqNo": 1
                        },
                        "txn": {
                          "metadata": {

                          },
                          "data": {
                            "role": "0",
                            "verkeyFull": "V4SGRU86Z58d6TV7PBUe6fCoRER63DVYnWZtK8uAzNbx",
                            "roleAction": "SET_TRUSTEE",
                            "dest": "V4SGRU86Z58d6TV7PBUe6f",
                            "verkey": "~CoRER63DVYnWZtK8uAzNbx"
                          },
                          "typeName": "NYM",
                          "type": "1"
                        }
                      }
                    }
                  }
                }
            ```

* **GET /api/networks/:networkRef/ledgers/:ledger/txs/nym/:nym**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `ledger`: `domain` `pool` `config`.
        * `nym`: nym to search for.
    * **Request query:**
        * `timestamp`: timestamp' is mutually exclusive with 'seqNo'
        * `seqNo`: transaction id. seqNo' is mutually exclusive with 'timestamp'
    * **Example**
        ```sh
        curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/ledgers/domain/txs/nym/RxFcjTjL6jPdn5EEJkNfqt?timestamp=1690575759
        ```
    * **Response:**
        * **JSON:**
            ```json
              [
                {
                  "reqSignature": {
                    "type": "ED25519",
                    "values": [
                      {
                        "from": "V4SGRU86Z58d6TV7PBUe6f",
                        "value": "36TQMq2U6gi9v26Wi6Jxsq87Nq47pZ6LpGiPUquWSAYYDPd2HPp9LgtGEWUD9QMvsYMnw22Q65HV1BukErerq59r"
                      }
                    ]
                  },
                  "txn": {
                    "data": {
                      "alias": "Bob.agent",
                      "dest": "RxFcjTjL6jPdn5EEJkNfqt",
                      "role": "101",
                      "verkey": "EboVMVodmktudV37A29X4VQebiVYqw3hgKpLT3eyoEEe"
                    },
                    "metadata": {
                      "digest": "44b9693e7153a158bb7f211594665dbd8c30338eef0e640c2a7064e0b20bfcfa",
                      "from": "V4SGRU86Z58d6TV7PBUe6f",
                      "payloadDigest": "27e74c52f21f02f7a851c5926f9a43bc8f88c2e18e0c7f698e11ffbd5377a65b",
                      "reqId": 1690575759048687000
                    },
                    "protocolVersion": 2,
                    "type": "1"
                  },
                  "txnMetadata": {
                    "seqNo": 108,
                    "txnId": "920910dca299d81cbdfaac71b30f4c9020b0e6bc23aaed61e9967f19fde970d8",
                    "txnTime": 1690575759
                  },
                  "ver": "1",
                  "rootHash": "8HZx81ehri6fggMnqGEUUJMmAonfj4XKKg5kyNPPmt5H",
                  "auditPath": [
                    "Ed2h8E4KrrBnbtMT2ux4xUwQ6CjbVtjJQe3RRhaoRset",
                    "3nU1KckdUoc7saNEkBF7DAzaUjL1kviA4mHYmcfraAvi",
                    "5CsxRGiDC93W9frdKmTXttGmdWTSR6E27SzpLLzFz8mj",
                    "4HA4nytDZ9eXtUGYeNStzuv1VjyYPUUNRKZDkRJf2nCg",
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
                  ],
                  "ledgerSize": 1878460
                }
              ]
            ```

* **GET /api/networks/:networkRef/ledgers/:ledger/txs/attrib/:dest**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `ledger`: `domain` `pool` `config`.
        * `nym`: nym to search for.
    * **Request query:**
        * `timestamp`: timestamp' is mutually exclusive with 'seqNo'.
        * `seqNo`: transaction id. seqNo' is mutually exclusive with 'timestamp'.
        * `raw`: Requested attribute name *base64 encoded*.
    * **Example**
        ```sh
        curl http://0.0.0.0:3708/api/networks/TEST_NETWORK/ledgers/domain/txs/attrib/RxFcjTjL6jPdn5EEJkNfqt?timestamp=1690575762&raw=eyJlbmRwb2ludCI6eyJlbmRwb2ludCI6Imh0dHA6Ly8xMC4xLjAuMTI6ODA0MCIsInJvdXRpbmdLZXlzIjpbXX19
        ```
    * **Response:**
        * **JSON:**
            ```json
              [
                {
                  "reqSignature": {
                    "type": "ED25519",
                    "values": [
                      {
                        "from": "RxFcjTjL6jPdn5EEJkNfqt",
                        "value": "4WnvhzTmUgQpTvAQkQUpQuxojX4QdvxX4BZ3RB11yC8RtqVTRVyjD9iGP7NCkUZjavrhLY1ArHVpWcofxrorgg9U"
                      }
                    ]
                  },
                  "txn": {
                    "data": {
                      "dest": "RxFcjTjL6jPdn5EEJkNfqt",
                      "raw": "{\"endpoint\":{\"endpoint\":\"http://10.1.0.12:8040\",\"routingKeys\":[]}}"
                    },
                    "metadata": {
                      "digest": "470e055c8e402dbccb18aca3482c8d8a40195e726e5dedbb28be02e4d0c4bb46",
                      "from": "RxFcjTjL6jPdn5EEJkNfqt",
                      "payloadDigest": "e88247cc7a2fb070b28cc73ac52d2e72aaec9c01ec795691a12ac41b75cc2286",
                      "reqId": 1690575762396969000
                    },
                    "protocolVersion": 2,
                    "type": "100"
                  },
                  "txnMetadata": {
                    "seqNo": 109,
                    "txnId": "RxFcjTjL6jPdn5EEJkNfqt:1:b6bf7bc8d96f3ea9d132c83b3da8e7760e420138485657372db4d6a981d3fd9e",
                    "txnTime": 1690575762
                  },
                  "ver": "1",
                  "rootHash": "8HZx81ehri6fggMnqGEUUJMmAonfj4XKKg5kyNPPmt5H",
                  "auditPath": [
                    "4oBcnv2ehbLTMo5Bshi6ovrPg9PkTizGXLvsUkxciVxA",
                    "57f4BXDx52XhRJ3oycp3FkknqgNbeAijxoy65rnVQa62",
                    "AWZQRDA9mHJwUcayEahp2vHYgtBbxHjFDGgoDMqfrRum",
                    "4HA4nytDZ9eXtUGYeNStzuv1VjyYPUUNRKZDkRJf2nCg",
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
                  ],
                  "ledgerSize": 1878460
                }
              ]
            ```

