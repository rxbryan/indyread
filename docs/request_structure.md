## Request structure
Each read Request is a JSON with a number of common metadata fields.

```json
{
    "operation": {
        "type": <request type>,
        "ver": <operation version>,
        <request-specific fields>
    },
    
    "identifier": <author DID>, 
    "reqId": <req_id unique integer>,
    "protocolVersion": 2        
}
```

- `operation`: The request-specific operation json.
- `type`: request type as one of the following values:

    - read requests:
      - GET_TXN = “3”

      - GET_TXN_AUTHOR_AGREEMENT = “6”

      - GET_TXN_AUTHOR_AGREEMENT_AML = “7”

      - GET_ATTR = “104”

      - GET_NYM = “105”

      - GET_SCHEMA = “107”

      - GET_CLAIM_DEF = “108”

      - GET_REVOC_REG_DEF = “115”

      - GET_REVOC_REG = “116”

      - GET_REVOC_REG_DELTA = “117”

      - GET_AUTH_RULE = “121”

      - GET_CONTEXT = “300”

- `ver`: operation request version

- request-specific data

- `identifier`: For read requests, the identifier is the submitter of the read request. It can be any DID (not necessary present on the ledger as a NYM txn)

- `reqId` (integer): Unique ID number of the request with transaction.

- `protocolVersion` (integer; optional): The version of client-to-node protocol.

## Reply Structure for Read Requests

```json
{
    "op": "REPLY", 
    "result": {
        "type": "105",
        "identifier": "L5AD5g65TDQr1PPHHRoiGf",
        "reqId": 1514214863899317,
        
        "seqNo": 10,
        "txnTime": 1514214795,
        
        "data": <transaction-specific data>,
        
        <request-specific data>
}
```
- `type` (enum number as string): Same as in the request above

- `identifier`: read request submitter’s DID as was in read Request (may differ from the identifier in data which defines transaction author)

- `reqId` (integer): as was in read Request (may differ from the reqId in data which defines the request used to write the transaction to the Ledger)

- `seqNo` (integer): a unique sequence number of the transaction on Ledger

- `txnTime` (integer as POSIX timestamp): the time when the transaction was written to the Ledger as POSIX timestamp

- `data` (json or dict): transaction-specific data (see transactions for each transaction type)

- request-specific fields as they appear in Read request

