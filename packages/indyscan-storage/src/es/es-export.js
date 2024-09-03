const fs = require('fs')
const path = require('path');
const { SUBLEDGERS } = require('./consts')
const {createStorageReadEs} = require('./storage-read-es')

function exportIndex(esClient, esIndex, path_str) {
  const { findMaxSeqNo } = createStorageReadEs(esClient, esIndex)

  const knownSubledgers = Object.values(SUBLEDGERS)

  async function dumpTxs() {
    knownSubledgers.map(async (subledger) => {
      let maxSeqNo = await findMaxSeqNo(subledger)
      console.log(`Subledeger ${subledger} has ${maxSeqNo} transactions`)
      const docs = []
      for (let i = 1; i <= maxSeqNo; i++) {
        const docId = `${subledger}-${i}`
        const doc = (await esClient.get({
          index: esIndex,
          id: docId
        })).body._source
        docs.push(doc)
      }

      let docstr = JSON.stringify(docs)

      const stats = fs.statSync(path_str) // Handle errors? such as file not found or permission issues
      if (!stats.isDirectory()) {
        throw new Error("Expected a directory!");
      }

      fs.writeFileSync(path.join(path_str,`${esIndex}_${subledger}.json`), docstr)
    })
  }

  return {
    dumpTxs
  }

}

module.exports.exportIndex = exportIndex