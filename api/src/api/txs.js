const { json } = require('body-parser')
const { asyncHandler } = require('../middleware')
const { ValidationError } = require('../error')
const { validate } = require('express-validation')
const Joi = require('joi')

function initTxsApi (app, networkManager, serviceTxs) {
  function getNetworkId (req, res) {
    const { networkRef } = req.params
    try {
      return networkManager.getNetworkConfig(networkRef).id
    } catch (err) {
      return res.status(404).send({ message: `Couldn't resolve network you are referencing (${networkRef})` })
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

  app.get('/api/networks/:networkRef/ledgers/:ledger/txs/:seqNo',
    validate(
      {
        query: Joi.object({
          format: Joi.string().valid('serialized', 'full', 'expansion')
        })
      }
    ),
    asyncHandler(async function (req, res) {
      const { ledger: subledger, seqNo } = req.params
      let { format } = req.query
      format = format || 'full'
      const networkId = getNetworkId(req, res)
      const tx = await serviceTxs.getTx(networkId, subledger, parseInt(seqNo), format)
      res.status(200).send(tx)
    }))
    
  app.get('/api/networks/:networkRef/ledgers/:ledger/txs/:seqNo',
    asyncHandler(async function (req, res) {
      const { ledger: subledger, seqNo } = req.params
      let { format } = req.query
      format = format || 'serialized'
      const networkId = getNetworkId(req, res)
      console.log(parseInt(seqNo))
      const tx = await serviceTxs.getTx(networkId, subledger, parseInt(seqNo), format)
      res.status(200).send(JSON.parse(tx.idata.json))
  }))

  app.get('/api/networks/:networkRef/ledgers/:ledger/txs/nym/:nym',
  validate(
    {
      query: Joi.object({
        timestamp: Joi.number(),
        seqNo: Joi.number().min(1),
      })
    }
  ),
  asyncHandler(async function (req, res, next) {
    const networkId = getNetworkId(req, res)
    const { ledger: subledger, nym } = req.params
    const { timestamp, seqNo } = req.query

    if (timestamp && seqNo) {
      next(new ValidationError("'timestamp' is mutually exclusive with 'seqNo'"))
    }
    else {
      const txs = await serviceTxs.getTxByType(networkId, subledger, {nym, seqNo, timestamp}, "NYM")
      res.status(200).send(txs.map(tx => tx.idata.serialized.idata.json))
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
