const { importIndex } = require('indyscan-storage')
const { Client } = require('@elastic/elasticsearch')
const path = require('path')

async function run(url = "http://localhost:9200/", esindexes = ["txs-bcovdev", "txs-candyprod"], path_str=process.cwd()) {
  const esClient = new Client({ node: url })

  for (let esindex of esindexes){
    const { importTxs } = await importIndex (esClient, esindex, path.join(
      path_str,
      'start-test',
      'esindex',
      esindex
    ))
    console.log(`Importing esindex: ${esindex}`)
    importTxs()
  }
}

run()