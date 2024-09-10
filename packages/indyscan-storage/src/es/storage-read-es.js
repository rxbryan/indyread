const { esFilterContainsFormat, esOrFilters } = require('./es-query-builder')
const { SUBLEDGERS } = require('./consts')
const { searchOneDocument } = require('./utils')
const {
  esFilterSubledgerName,
  esAndFilters, 
  esFilterBySeqNo, 
  esFilterByNYM, 
  esMatchTxType, 
  esMatchTxTime,
  esFilterByAttribName,
  esMatchFromDID,
  esMatchSchemaName,
  esMatchSchemaVersion,
  esMatchSchemaRef,
  esMatchTxnId,
  esMatchRevocRegDefId
} = require('./es-query-builder')
const util = require('util')

function createWinstonLoggerDummy () {
  const logger = {}
  logger.error = (param1, param2) => {}
  logger.warn = (param1, param2) => {}
  logger.info = (param1, param2) => {}
  logger.debug = (param1, param2) => {}
  logger.silly = (param1, param2) => {}
  return logger
}

/*
esClient - elasticsearch client
esIndex - name of the index to read/write data from/to
logger (optional) - winston logger
 */
function createStorageReadEs (esClient, esIndex) {
  const whoami = `StorageRead/${esIndex} : `

  function createSubledgerQuery (subledgerName) {
    const knownSubledgers = Object.values(SUBLEDGERS)
    const lowerCased = subledgerName.toLowerCase()
    if (knownSubledgers.includes(lowerCased) === false) {
      throw Error(`Unknown subledger '${lowerCased}'. Known ledger = ${JSON.stringify(knownSubledgers)}`)
    }
    return esFilterSubledgerName(lowerCased)
  }

  async function getTxCount (subledger, queries = [], logger = createWinstonLoggerDummy()) {
    const query = esAndFilters(createSubledgerQuery(subledger), queries)
    const request = {
      index: esIndex,
      body: { query }
    }
    logger.debug(`${whoami} Submitting count txs request: ${JSON.stringify(request, null, 2)}`)
    const { body } = await esClient.count(request)
    logger.debug(`${whoami} Received count txs response: ${JSON.stringify(body, null, 2)}`)
    return body.count
  }

  /*
  If format specified, returns specified transaction is selected format if available, otherwise undefined.
  If format not specified, returns transaction if "full" format, which contains all available formats. Example:
  {
     "imeta" : {
        "seqNo": 40,
        "subledger": "domain"
     },
     "idata": {
        "format1" : { data: "foo" }
        "format2" : { data: "FOO" }
     }
   }
   */
  async function getOneTx (subledger, seqNo, format = 'full') {
    const subledgerTxsQuery = createSubledgerQuery(subledger)
    const query = esAndFilters(subledgerTxsQuery, esFilterBySeqNo(seqNo))
    console.log(JSON.stringify(query))
    //console.log(seqNo)
    const tx = await searchOneDocument(esClient, esIndex, query)
    if (!tx) {
      return undefined
    }
    if (format === 'full') {
      return tx
    }
    return tx.idata[format]
  }

  async function executeEsSearch (searchRequest, logger = createWinstonLoggerDummy()) {
    try {
      logger.debug(`${whoami} Submitting ES request ${JSON.stringify(searchRequest, null, 2)}`)
      const { body } = await esClient.search(searchRequest)
      logger.debug(`${whoami} Received ES response ${JSON.stringify(body, null, 2)}`)
      return body
    } catch (e) {
      logger.error(util.inspect(e, undefined, 10))
      throw e
    }
  }

  async function getNYM (subledger, queries) {
    const subledgerTxsQuery = createSubledgerQuery(subledger)
    const query = queries.timestamp
    ? esAndFilters(subledgerTxsQuery, esMatchTxType("NYM"), esFilterByNYM(queries.nym), esMatchTxTime(queries.timestamp))
    : queries.seqNo
    ? esAndFilters(subledgerTxsQuery, esMatchTxType("NYM"), esFilterByNYM(queries.nym), esFilterBySeqNo(queries.seqNo))
    : esAndFilters(subledgerTxsQuery, esMatchTxType("NYM"), esFilterByNYM(queries.nym))

    let sort = { 'imeta.seqNo': { order: 'asc' } }

    const searchRequest = {
      index: esIndex,
      body: { query, sort }
    }

    const body = await executeEsSearch(searchRequest)
    const fullTxs = body.hits.hits.map(h => h._source)
    return fullTxs
  }

  async function getAttrib (subledger, queries) {
    const subledgerTxsQuery = createSubledgerQuery(subledger)
    const query = queries.raw 
    ? esAndFilters(subledgerTxsQuery, esMatchTxType("ATTRIB"), esFilterByNYM(queries.nym), esFilterByAttribName(queries.raw))
    : queries.timestamp
    ? esAndFilters(subledgerTxsQuery, esMatchTxType("ATTRIB"), esFilterByNYM(queries.nym), esMatchTxTime(queries.timestamp))
    : queries.seqNo
    ? esAndFilters(subledgerTxsQuery, esMatchTxType("ATTRIB"), esFilterByNYM(queries.nym), esFilterBySeqNo(queries.seqNo))
    : esAndFilters(subledgerTxsQuery, esMatchTxType("ATTRIB"), esFilterByNYM(queries.nym))

    let sort = { 'imeta.seqNo': { order: 'asc' } }

    const searchRequest = {
      index: esIndex,
      body: { query, sort }
    }

    console.log(JSON.stringify(query))
    const body = await executeEsSearch(searchRequest)
    const fullTxs = body.hits.hits.map(h => h._source)
    //console.log(JSON.stringify(fullTxs))
    return fullTxs
  }

  async function getSchema (subledger, queries) {
    const subledgerTxsQuery = createSubledgerQuery(subledger)
    const query = esAndFilters(
      subledgerTxsQuery,
      esMatchTxType("SCHEMA"),
      esMatchFromDID(queries.from),
      esMatchSchemaName(queries.data.name),
      esMatchSchemaVersion(queries.data.version)
    )
    
    console.log(query)

    const tx = await searchOneDocument(esClient, esIndex, query)
    return tx
  }

  async function getClaimDef (subledger, queries) {
    const subledgerTxsQuery = createSubledgerQuery(subledger)
    const query = esAndFilters(
      subledgerTxsQuery,
      esMatchTxType("CLAIM_DEF"),
      esMatchFromDID(queries.from),
      esMatchSchemaRef(queries.ref),

    )
    const tx = await searchOneDocument(esClient, esIndex, query)
    return tx
  }

  async function getRevocRegDef (subledger, queries) {
    const subledgerTxsQuery = createSubledgerQuery(subledger)
    const query = esAndFilters(
      subledgerTxsQuery,
      esMatchTxType("REVOC_REG_DEF"),
      esMatchTxnId(queries.id)
    )
    console.log(JSON.stringify(query, null, 2))
    const tx = await searchOneDocument(esClient, esIndex, query)
    return tx
  }


  /*
  Returns array of (by default all) transactions.
  By default are transactions sorted from the latest (index 0) to the oldest (last index of result array)
  The individual transactions are in "full" format.
  Every format ha
   */
  async function getManyTxs (subledger, skip, limit, queries, sort, format = 'full') {
    const formatQuery = (format === 'full') ? null : esFilterContainsFormat(format)
    const subledgerQuery = createSubledgerQuery(subledger)
    const query = esAndFilters(subledgerQuery, formatQuery, queries)
    sort = sort || { 'imeta.seqNo': { order: 'desc' } }
    const searchRequest = {
      from: skip,
      size: limit,
      index: esIndex,
      body: { query, sort }
    }
    const body = await executeEsSearch(searchRequest)
    const fullTxs = body.hits.hits.map(h => h._source)
    // todo: Add ES query to return only transactions which contain certain tx formats. We wouldn't then have to do the filtering here
    if (format === 'full') {
      return fullTxs
    }
    return fullTxs
      .map(fullTx => fullTx.idata ? fullTx.idata[format] : undefined)
      .filter(formatTx => !!formatTx)
  }

  async function findMaxSeqNo (subledger, format = 'full') {
    const txs = await getManyTxs(
      subledger,
      0,
      1,
      null,
      { 'imeta.seqNo': { order: 'desc' } },
      format
    )
    if (txs.length === 0) {
      return 0
    } else return txs[0].imeta.seqNo
  }

  return {
    findMaxSeqNo,
    getOneTx,
    getNYM,
    getAttrib,
    getSchema,
    getClaimDef,
    getRevocRegDef,
    getManyTxs,
    getTxCount
  }
}

module.exports.createStorageReadEs = createStorageReadEs
