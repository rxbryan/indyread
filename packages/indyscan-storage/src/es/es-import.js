const fs = require('fs')
const path = require('path');
const { SUBLEDGERS } = require('./consts')
const { createStorageWriteEs } = require('./storage-write-es');
const { add } = require('lodash');

async function importIndex(esClient, esIndex, path_str) {
  const { setFormatMappings, addTx } = await createStorageWriteEs(esClient, esIndex, 0)

  const knownSubledgers = Object.values(SUBLEDGERS)
  
  const outputFormat = 'serialized'
  const InputFormat = 'original'
  const elasticsearchTargetMappings = {
      json: { type: 'text', index: false }
    }
  
  setFormatMappings(outputFormat, elasticsearchTargetMappings)

  async function importTxs() {
    knownSubledgers.map(async (subledger) => {
      const txfile = `${esIndex}_${subledger}.json`
      const filePath = path.join(path_str, txfile)

      let docCount = 0

      const docs = fs.readFileSync(filePath)
      
      esClient.helpers.bulk({
        datasource: JSON.parse(docs),
        onDocument (doc) {
          docCount++
          console.log(`upserting ${JSON.stringify(doc.imeta)}`)
          return [
            { update: { _index: esIndex, _id: `${subledger}-${doc.imeta.seqNo}` } },
            { doc_as_upsert: true }
          ]
        }
      })

      console.log(`Upserted ${docCount} ${subledger} txs in ${esIndex} index`)

    })
  }

  return {
    importTxs
  }

}

module.exports.importIndex = importIndex