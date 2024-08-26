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
                "id": "LOCALHOST_VON_NETWORK",
                "ui": {
                  "priority": 1,
                  "display": "von",
                  "display-long": "von localhost",
                  "description": "For active development of indyread.",
                  "tutorial": "Get your DID and start writing on the network",
                  "tutorial-link": "",
                  "logo-address": ""
                },
                "aliases": [
                  "von-localhost"
                ],
                "es": {
                  "index": "txs-von"
                }
              }
            ]
            ```

* **GET /api/networks/:networkRef/ledgers/:ledger/txs/:seqNo/raw**
    * **Description:** Retrieve a transaction by id or seqno.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `ledger`: `domain` `pool` `config`.
        * `seqNo`: transaction id.
    * **Response:**
        * **JSON:**
            ```json
                {
                "auditPath": [
                  "3XtSyZ8CQPJUYbc5mFKvUendLZSt4ybG2Y4zRtJEewSL",
                  "96irBGYpWrTvrVATexGGvktPrT3WicixwT8BtoZTtkYX",
                  "Hf2vXibDGJUFB2sMyhEPZZNKEPEiY4iLFxaxckeXwgKx"
                ],
                "ledgerSize": 5,
                "reqSignature": {},
                "rootHash": "DJLzEifT7n9DbiCHqQ5KWrWUPFBiZt349popapDfzo5p",
                "txn": {
                  "data": {
                    "dest": "V4SGRU86Z58d6TV7PBUe6f",
                    "role": "0",
                    "verkey": "~CoRER63DVYnWZtK8uAzNbx"
                  },
                  "metadata": {},
                  "type": "1"
                },
                "txnMetadata": {
                  "seqNo": 1
                },
                "ver": "1"
              }
            ```

* **GET /api/networks/:networkRef/ledgers/:ledger/txs/nym/:nym/raw**
    * **Description:** searches the ledger for a nym/did transaction.
    * **Request Parameters:**
        * `networkRef`: network id.
        * `ledger`: `domain` `pool` `config`.
        * `seqNo`: transaction id.
        * `nym`: nym to search for.
    * **Response:**
        * **JSON:**
            ```json
              {
                "reqSignature": {
                  "type": "ED25519",
                  "values": [
                    {
                      "from": "V4SGRU86Z58d6TV7PBUe6f",
                      "value": "m4kFkEJBY5ewh8fZrBn2zqH2hKZEuQmY3FDYPm3SXHat6YA9kbi8WPaD5vxieKgJCcjRHEoAzvCE4E16qSBq5KV"
                    }
                  ]
                },
                "txn": {
                  "data": {
                    "dest": "4oBNzKmwyoupVbtrL14ECm",
                    "role": "101",
                    "verkey": "351Hrpg4DjaDTtxAGGWMDxghnJmPL4iXSbjkfvDyihqk"
                  },
                  "metadata": {
                    "digest": "0541c5ff27911b40c42c5a616e4e098c2b29ca3784b463df0d8c4ac5530d3705",
                    "from": "V4SGRU86Z58d6TV7PBUe6f",
                    "payloadDigest": "b005917275418bd20efcb771108d143f8ff3593a052b9aec247bad519a5fda3d",
                    "reqId": 1.7246259276146637e+18
                  },
                  "protocolVersion": 2,
                  "type": "1"
                },
                "txnMetadata": {
                  "seqNo": 7,
                  "txnId": "6e5a79d189192744fbde70ffad76a8168bb2d6a4d1e13ca7d4e536a6808d3a94",
                  "txnTime": 1724625929
                },
                "ver": "1",
                "rootHash": "94e3jb8EpzHdSUMFwXhcWk3WJsCd1TbfyLtJP9xRgAgA",
                "auditPath": [
                  "6SDy3zTyHK651E9C529JXdt5svQH8BwCu7BzA3EkJFBd",
                  "HxBjFsqNyvMHc5r3vvfRiosTA1ZnHw7mL2PjonmiaQvj",
                  "D52hsZf4iH4Kp4x4eEp18FicbPNdirG9TL2cvat1eKvL"
                ],
                "ledgerSize": 8
              }
            ```