const { exportIndex } = require('indyscan-storage')
const { Client } = require('@elastic/elasticsearch')

function run(url = "http://localhost:9200/", esindex = "txs-bcovdev", path=process.cwd()) {
  const esClient = new Client({ node: url })

  const {dumpTxs} = exportIndex (esClient, esindex, path)
  console.log(`Dumping esindex: ${esindex}`)
  dumpTxs()
}

run()