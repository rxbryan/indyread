const _ = require('lodash')

function esFilterByTxTypeNames (txNames) {
  return {
    terms: {
      'idata.expansion.idata.txn.typeName': txNames
    }
  }
}

function esMatchTxType (txType) {
  return {
    match: {
      'idata.expansion.idata.txn.typeName': txType
    }
  }
}

function esFilterByNYM (nym) {
  return {
    match: {
      'idata.expansion.idata.txn.data.dest': nym

    }
  }
}

function esFilterByAttribName (name) {
  return {
    match: {
      'idata.expansion.idata.txn.data.raw': name
    }
  }
}

function esMatchFromDID(dest) {
  return {
    match: {
      "idata.expansion.idata.txn.metadata.from": dest
    }
  }
}

function esMatchSchemaName(name) {
  return {
    match: {
      "idata.expansion.idata.txn.data.data.name": name
    }
  }
}

function esMatchSchemaVersion(version) {
  return {
    match: {
      "idata.expansion.idata.txn.data.data.version": version
    }
  }
}

function esMatchTAAAVersion(version) {
  return {
    match: {
      "idata.expansion.idata.txn.data.version": version
    }
  }
}

function esMatchTAADigest(digest) {
  return {
    match: {
      "idata.expansion.idata.txn.metadata.digest": digest
    }
  }
}

function esMatchSchemaRef(ref) {
  return {
    term: {
      'idata.expansion.idata.txn.data.refSchemaTxnSeqno': {
        value: ref
      }
    }
  }
}

function esMatchTxnId(id) {
  return {
    match: {
      "idata.expansion.idata.txnMetadata.txnId": id
    }
  }
}

function esMatchRevocRegDefId(id) {
  return {
    match: {
      "idata.expansion.idata.txn.data.revocRegDefId": id
    }
  }
}

function esMatchTxTime(utime) {
  return {
    match: {
      "idata.expansion.idata.txnMetadata.txnTime": {
        "query": new Date(utime * 1000).toISOString(),
        "analyzer": "keyword"
      }
    }
  }
}

function esFilterSubledgerName (subledgerName) {
  return {
    term: {
      'imeta.subledger': {
        value: subledgerName
      }
    }
  }
}

function esFilterBySeqNo (seqNo) {
  return {
    term: {
      'imeta.seqNo': {
        value: seqNo
      }
    }
  }
}

function esFilterContainsFormat (format) {
  return {
    exists: {
      field: `idata.${format}`
    }
  }
}

function esFilterHasTimestamp () {
  return {
    exists: {
      field: 'idata.expansion.idata.txnMetadata.txnTime'
    }
  }
}

function esFilterSeqNoGteLtRange (gte, lt) {
  return {
    range: {
      'imeta.seqNo': {
        gte,
        lt
      }
    }
  }
}

function esFilterSeqNoGte (seqNo) {
  return {
    range: {
      'imeta.seqNo': {
        gte: seqNo
      }
    }
  }
}

function esFilterSeqNoLt (seqNo) {
  return {
    range: {
      'imeta.seqNo': {
        lt: seqNo
      }
    }
  }
}

function esFilterTxnAfterTime (utime) {
  return {
    range: {
      'idata.expansion.idata.txnMetadata.txnTime': {
        gte: new Date(utime * 1000).toISOString()
      }
    }
  }
}

function esFilterTxnBeforeTime (utime) {
  return {
    range: {
      'idata.expansion.idata.txnMetadata.txnTime': {
        lt: new Date(utime * 1000).toISOString()
      }
    }
  }
}

function esFullTextsearch (text) {
  return {
    simple_query_string: {
      query: text,
      default_operator: 'and'
    }
  }
}

function esOrFilters (...filters) {
  const finalQueries = _.concat(...filters).filter(f => !!f)
  if (finalQueries.length === 0) {
    return {}
  }
  return { bool: { should: [...finalQueries] } }
}

function esAndFilters (...filters) {
  const finalQueries = _.concat(...filters).filter(f => !!f)
  if (finalQueries.length === 0) {
    return {}
  }
  return { bool: { filter: [...finalQueries] } }
}

module.exports.esFilterSubledgerName = esFilterSubledgerName
module.exports.esFilterByTxTypeNames = esFilterByTxTypeNames
module.exports.esMatchTxType = esMatchTxType
module.exports.esFilterByNYM = esFilterByNYM
module.exports.esFilterByAttribName = esFilterByAttribName
module.exports.esMatchFromDID = esMatchFromDID
module.exports.esMatchSchemaName = esMatchSchemaName
module.exports.esMatchSchemaVersion = esMatchSchemaVersion
module.exports.esMatchSchemaRef = esMatchSchemaRef
module.exports.esMatchTxnId = esMatchTxnId
module.exports.esMatchTAAAVersion = esMatchTAAAVersion
module.exports.esMatchTAADigest = esMatchTAADigest
module.exports.esMatchRevocRegDefId = esMatchRevocRegDefId
module.exports.esMatchTxTime = esMatchTxTime
module.exports.esFilterTxnAfterTime = esFilterTxnAfterTime
module.exports.esFilterTxnBeforeTime = esFilterTxnBeforeTime
module.exports.esFilterBySeqNo = esFilterBySeqNo
module.exports.esFilterHasTimestamp = esFilterHasTimestamp
module.exports.esFilterSeqNoGte = esFilterSeqNoGte
module.exports.esFilterSeqNoLt = esFilterSeqNoLt
module.exports.esFilterSeqNoGteLtRange = esFilterSeqNoGteLtRange
module.exports.esAndFilters = esAndFilters
module.exports.esOrFilters = esOrFilters
module.exports.esFullTextsearch = esFullTextsearch
module.exports.esFilterContainsFormat = esFilterContainsFormat
