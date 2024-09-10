const { json } = require('body-parser')
const { asyncHandler } = require('../middleware')
const { ValidationError } = require('../error')
const { validate } = require('express-validation')
const Joi = require('joi')
const { result } = require('lodash')
const { data } = require('../logging/logger-main')
const { type } = require('os')

function initTxsApi (app, networkManager, serviceTxs) {
  function getNetworkId (req, res) {
    const { networkRef } = req.params
    try {
      return networkManager.getNetworkConfig(networkRef).id
    } catch (err) {
      return res.status(404).send({ message: `Couldn't resolve network you are referencing (${networkRef})` })
    }
  }

  function getSubledger(ledgerId) {
    return ['pool', 'domain', 'config'][ledgerId]
  }

  function buildResponse(type, identifier, reqId, txn, txnMetadata, reqSignature, rootHash, auditPath) {
    txn.metadata['reqId'] = reqId
    return {
      op: "REPLY",
      result: {
        type,
        identifier,
        reqId,
        seqNo: txnMetadata.seqNo,
        data: {
          ver: txn.data.ver || 1,
          txn,
          txnMetadata,
          reqSignature,
          rootHash,
          auditPath
        }
      }
    }
  }

  app.get('/api/networks/:networkRef/ledgers/:ledger/txs',
    validate(
      {
        query: Joi.object({
          fromRecentTx: Joi.number(),
          toRecentTx: Joi.number(),
          filterTxNames: Joi.array().items(Joi.string()),
          seqNoGte: Joi.number(),
          seqNoLt: Joi.number(),
          search: Joi.string(),
          format: Joi.string().valid('serialized', 'full', 'expansion')
        })
      }
    ),
    asyncHandler(async function (req, res) {
      const networkId = getNetworkId(req, res)
      const { ledger } = req.params
      console.log(JSON.stringify(req.query))
      const { skip, size, filterTxNames, search, format, sortFromRecent, seqNoGte, seqNoLt } = req.query
      const txs = await serviceTxs.getTxs(
        networkId,
        ledger,
        skip || 0,
        size || 50,
        filterTxNames,
        seqNoGte,
        seqNoLt,
        search,
        format,
        (sortFromRecent === undefined || sortFromRecent === null) ? true : (sortFromRecent === 'true')
      )
      res.status(200).send(txs)
    }))

  // GET_TXN
  app.get('/api/networks/:networkRef/txs/:seqNo',
    validate(
      {
        query: Joi.object({
          ledgerId: Joi.number().valid(0, 1, 2).required(),
          reqId: Joi.string().required(),
          identifier: Joi.string().required()
        })
      }
    ),
    asyncHandler(async function (req, res) {
      Joi.object({
        seqNo: Joi.number().min(1).required()
      }).validate(req.params, (err, ok) => { if (err) throw err })

      const { seqNo } = req.params
      const { ledgerId,  reqId, identifier } = req.query

      const subledger = getSubledger(ledgerId)
      const networkId = getNetworkId(req, res)
      
      const tx = await serviceTxs.getTx(networkId, subledger, parseInt(seqNo))
      const originalTx = JSON.parse(tx.idata.json)

      res.status(200).send(
        buildResponse(
          "3",
          identifier,
          reqId,
          originalTx.txn,
          originalTx.txnMetadata,
          originalTx.reqSignature,
          originalTx.rootHash,
          originalTx.auditPath
        )
      )
    }))

  // GET_NYM
  app.get('/api/networks/:networkRef/txs/nym/:dest',
  validate(
    {
      query: Joi.object({
        timestamp: Joi.number(),
        seqNo: Joi.number().min(1),
        reqId: Joi.string().required(),
        identifier: Joi.string().required()
      })
    }
  ),
  asyncHandler(async function (req, res, next) {
    const networkId = getNetworkId(req, res)
    const { dest } = req.params
    const { timestamp, seqNo, reqId, identifier } = req.query

    if (timestamp && seqNo) {
      next(new ValidationError("'timestamp' is mutually exclusive with 'seqNo'"))
    }
    else {
      const txs = await serviceTxs.getTxByType(networkId, 'domain', {nym: dest, seqNo, timestamp}, "NYM")
      res.status(200).send(txs.map(tx => {
        let originalTx = JSON.parse(tx.idata.serialized.idata.json)
        originalTx.txn.data.identifier = identifier
        originalTx.txn.data.txnTime = originalTx.txnMetadata.txnTime
        originalTx.txn.data.seqNo = tx.imeta.seqNo

        return {
          op: "REPLY",
          result: {
            type: "105",
            identifier,
            reqId,
            seqNo: tx.imeta.seqNo,
            txnTime: originalTx.txnMetadata.txnTime,
            state_proof: {}
          },
          data: originalTx.txn.data,
          dest: originalTx.txn.data.dest,
        }
      }))
    }

  }))

  // GET_ATTRIB
  app.get('/api/networks/:networkRef/txs/attrib/:dest',
  validate(
    {
      query: Joi.object({
        timestamp: Joi.number(),
        seqNo: Joi.number().min(1),
        raw: Joi.string(),
        reqId: Joi.string().required(),
        identifier: Joi.string().required()
      })
    }
  ),
  asyncHandler(async function (req, res, next) {
    const networkId = getNetworkId(req, res)
    const { dest: nym } = req.params
    const { timestamp, seqNo, raw: rawBase64,  reqId, identifier } = req.query

    if (timestamp && seqNo) {
      next(new ValidationError("'timestamp' is mutually exclusive with 'seqNo'"))
    }
    else {
      const raw = rawBase64 && Buffer.from(rawBase64, 'base64').toString()
      const txs = await serviceTxs.getTxByType(networkId, 'domain', {nym, timestamp, seqNo, raw: raw}, "ATTRIB")
      res.status(200).send(txs.map(tx => {
          let originalTx = JSON.parse(tx.idata.serialized.idata.json)

          return {
            op: "REPLY",
            result: {
              type: "104",
              identifier,
              reqId,
              seqNo: tx.imeta.seqNo,
              txnTime: originalTx.txnMetadata.txnTime,
              state_proof: {}
            },
            data: originalTx.txn.data.raw,
            dest: originalTx.txn.data.dest,
            raw: Object.keys(JSON.parse(originalTx.txn.data.raw))[0]
          }
        }
      ))
    }

  }))

  //GET_SCHEMA
  app.get('/api/networks/:networkRef/txs/schema/:from',
    validate(
      {
        query: Joi.object({
          name: Joi.string().required(),
          version: Joi.string().required(),
          reqId: Joi.string().required(),
          identifier: Joi.string().required()
        })
      }
    ),
    asyncHandler(async function (req, res) {
      const networkId = getNetworkId(req, res)
      const { from } = req.params
      const { version, name,  reqId, identifier } = req.query

      const data = {version, name}
      const tx = await serviceTxs.getTxByType(networkId, 'domain', {from, data}, "SCHEMA")

      let originalTx = JSON.parse(tx.idata.serialized.idata.json)

      const result = {
        op: "REPLY",
        result: {
          data: tx.idata.expansion.idata.txn.data.data,
          type: "107",
          identifier,
          reqId,
          seqNo: tx.imeta.seqNo,
          txnTime: originalTx.txnMetadata.txnTime,
          state_proof: {}
        },
        dest: from
      }

      res.status(200).send(result)

  }))

  //GET_CLAIM_DEF
  app.get('/api/networks/:networkRef/txs/claim-def/:from',
    validate(
      {
        query: Joi.object({
          ref: Joi.string().required(),
          signature_type: Joi.string().valid("CL").required(),
          tag: Joi.string().required(),
          reqId: Joi.string().required(),
          identifier: Joi.string().required()
        })
      }
    ),
    asyncHandler(async function (req, res) {
      const networkId = getNetworkId(req, res)
      const { from } = req.params
      const {
        ref,
        signature_type,
        tag,
        reqId,
        identifier
      } = req.query

      const tx = await serviceTxs.getTxByType(networkId, 'domain', { from, ref, signature_type }, "CLAIM_DEF")

      let originalTx = JSON.parse(tx.idata.serialized.idata.json)

      console.log(JSON.stringify(originalTx.txn.data, null, 2))
      console.log(tag, originalTx.txn.data.tag)
      const result = tag !==  originalTx.txn.data.tag ? {} : {
        op: "REPLY",
        result: {
          data: originalTx.txn.data.data,
          type: "108",
          identifier,
          reqId,
          seqNo: tx.imeta.seqNo,
          txnTime: originalTx.txnMetadata.txnTime,
          state_proof: {}
        },
        signature_type,
        origin: from,
        ref,
        tag
      }

      console.log(JSON.stringify(result, null, 2))
      res.status(200).send(result)

  }))

  //GET_REVOC REG_DEF
  app.get('/api/networks/:networkRef/txs/revoc-reg-def/:id',
    validate(
      {
        query: Joi.object({
          reqId: Joi.string().required(),
          identifier: Joi.string().required()
        })
      }
    ),
    asyncHandler(async function (req, res) {
      const networkId = getNetworkId(req, res)
      const { id } = req.params
      const { reqId, identifier } = req.query

      const tx = await serviceTxs.getTxByType(networkId, 'domain', { id }, "REVOC_REG_DEF")

      let originalTx = JSON.parse(tx.idata.serialized.idata.json)

      const result = {
        op: "REPLY",
        result: {
          type: "115",
          identifier,
          reqId,
          seqNo: tx.imeta.seqNo,
          txnTime: originalTx.txnMetadata.txnTime,
          data: originalTx.txn.data,
          state_proof: {}
        },
      }

      res.status(200).send(result)

  }))

  //GET_REVOC REG_DEF
  app.get('/api/networks/:networkRef/txs/revoc-reg/:revocRegDefId',
    validate(
      {
        query: Joi.object({
          timestamp: Joi.number().required(),
          reqId: Joi.string().required(),
          identifier: Joi.string().required()
        })
      }
    ),
    asyncHandler(async function (req, res) {
      const networkId = getNetworkId(req, res)
      const { revocRegDefId } = req.params
      const { timestamp, reqId, identifier } = req.query

      const tx = await serviceTxs.getTxByType(networkId, 'domain', { revocRegDefId, timestamp }, "REVOC_REG_ENTRY")

      let originalTx = JSON.parse(tx.idata.serialized.idata.json)
      originalTx.txn.data.id = revocRegDefId
      const result = {
        op: "REPLY",
        result: {
          type: "116",
          identifier,
          reqId,
          revocRegDefId,
          seqNo: tx.imeta.seqNo,
          txnTime: originalTx.txnMetadata.txnTime,
          data: originalTx.txn.data,
          state_proof: {}
        },
      }

      res.status(200).send(result)

  }))

  app.get('/api/networks/:networkRef/ledgers/:ledger/txs/stats/count',
    validate(
      {
        query: Joi.object({
          filterTxNames: Joi.array().items(Joi.string())
        })
      }
    ),
    asyncHandler(async function (req, res) {
      const { ledger } = req.params
      const networkId = getNetworkId(req, res)
      const { filterTxNames, search } = req.query
      const txCount = await serviceTxs.getTxsCount(networkId, ledger, filterTxNames, search)
      res.status(200).send({ txCount })
    }))

  return app
}

module.exports = initTxsApi
