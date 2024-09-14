/*
esClient - elasticsearch client
esIndex - name of the index to read/write data from/to
esReplicaCount - if <esIndex> doesn't exist yet, it will be created with <esReplicaCount> replicas
subledgerName - indy subledger managed by this storage client
assureEsIndex - whether shall this storage client try to create index if it doesnt exists. This is useful if you creating multiple
                storage clients (different subledgers) for the same network in parallel
expectEsIndex - if true and the esIndex is not already created, it will throw
createEsTransformedTx - function taking 1 argument, a transaction as found on ledger. Returns somewhat transformed transaction
                      - the transformed tx must contains root "meta" field, might be empty object
                      - should never throw, if an error occurs during processing, it should be stored in the result under
                        tx.meta.transformError field
logger (optional) - winston logger
 */

const { esFilterSubledgerName } = require('./es-query-builder')
const { deleteDyQuery } = require('./utils')
const { esFilterSeqNoLt } = require('./es-query-builder')
const { esFilterSeqNoGte } = require('./es-query-builder')
const { esAndFilters } = require('./es-query-builder')
const { SUBLEDGERS } = require('./consts')
const { setMapping } = require('./utils')
const { upsertSubdocument } = require('./utils')
const { assureEsIndex } = require('./utils')
const { createWinstonLoggerDummy } = require('./utils')

async function createStorageWriteEs (esClient, esIndex, esReplicaCount, logger = createWinstonLoggerDummy()) {
  const whoami = `StorageWrite/${esIndex} : `

  await assureEsIndex(esClient, esIndex, esReplicaCount, logger)
  await setMapping(esClient, esIndex, {
    properties: {
      'imeta.subledger': { type: 'keyword' },
      'imeta.seqNo': { type: 'integer' }
    }
  })

  const util = require('util')

  async function setFormatMappings (formatName, fieldMappings, logger = createWinstonLoggerDummy()) {
    logger.info(`${whoami} Setting up mappings for ES Index ${esIndex}!`)
    const esMappingDefinition = { properties: {} }
    for (const [field, fieldMapping] of Object.entries(fieldMappings)) {
      esMappingDefinition.properties[`idata.${formatName}.idata.${field}`] = fieldMapping
    }

    // Allow exact matching for these fields. 
    esMappingDefinition.properties['idata.expansion.idata.txn.data.dest'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.raw'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.metadata.from'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.metadata.digest'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.data.name'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.data.version'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txnMetadata.txnId'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.auth_type'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.field'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.auth_action'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.new_value'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.old_value'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.revocRegDefId'] = { type: 'keyword' }
    esMappingDefinition.properties['idata.expansion.idata.txn.data.version'] = { type: 'keyword' }
    esMappingDefinition.properties[`idata.${formatName}.imeta.subledger`] = { type: 'keyword' }
    esMappingDefinition.properties[`idata.${formatName}.imeta.seqNo`] = { type: 'integer' }
    try {
      return await setMapping(esClient, esIndex, esMappingDefinition)
    } catch (e) {
      console.log(util.inspect(e, undefined, 10))
    }
  }

  function lowercasedSubledger (subledgerName) {
    const knownSubledgers = Object.values(SUBLEDGERS)
    const lowerCased = subledgerName.toLowerCase()
    if (knownSubledgers.includes(lowerCased) === false) {
      throw Error(`${whoami} Unknown subledger '${lowerCased}'. Known ledgers = ${JSON.stringify(knownSubledgers)}`)
    }
    return lowerCased
  }

  async function addTx (subledger, seqNo, format, txData, logger = createWinstonLoggerDummy()) {
    subledger = lowercasedSubledger(subledger)
    logger.debug(`${whoami} Storing for subledger:${subledger} seqno:${seqNo} in format:${format}. Data: ${JSON.stringify(txData, null, 2)}!`)
    const persistData = {
      imeta: {
        subledger,
        seqNo
      },
      idata: {
        [format]: {
          imeta: {
            subledger,
            seqNo
          },
          idata: txData
        }
      }
    }
    const docId = `${subledger}-${seqNo}`
    return upsertSubdocument(esClient, esIndex, docId, persistData)
  }

  async function deleteTxsByGteSeqNo (subledger, seqNoGte) {
    const seqNoRangeQuery = esAndFilters(esFilterSeqNoGte(seqNoGte), esFilterSeqNoLt(1000000000), esFilterSubledgerName(subledger))
    return deleteDyQuery(esClient, esIndex, seqNoRangeQuery)
  }

  return {
    addTx,
    deleteTxsByGteSeqNo,
    setFormatMappings
  }
}

module.exports.createStorageWriteEs = createStorageWriteEs
