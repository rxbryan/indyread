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
          3,
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
          },
          data: originalTx.txn.data,
          dest: originalTx.txn.data.dest,
        }
      }))
    }

  }))

  app.get('/api/networks/:networkRef/ledgers/:ledger/txs/attrib/:nym',
  validate(
    {
      query: Joi.object({
        timestamp: Joi.number(),
        seqNo: Joi.number().min(1),
        raw: Joi.string()
      })
    }
  ),
  asyncHandler(async function (req, res, next) {
    const networkId = getNetworkId(req, res)
    const { ledger: subledger, nym } = req.params
    const { timestamp, seqNo, raw: rawBase64 } = req.query

    if (timestamp && seqNo) {
      next(new ValidationError("'timestamp' is mutually exclusive with 'seqNo'"))
    }
    else {
      const raw = rawBase64 && Buffer.from(rawBase64, 'base64').toString()
      const txs = await serviceTxs.getTxByType(networkId, subledger, {nym, timestamp, seqNo, raw: raw}, "ATTRIB")
      res.status(200).send(txs.map(tx => tx.idata.serialized.idata.json))
    }

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
