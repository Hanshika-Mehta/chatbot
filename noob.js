
const { ChromaClient, OpenAIEmbeddingFunction } = require('chromadb')

const client = new ChromaClient()

const embedder = new OpenAIEmbeddingFunction({
  openai_api_key: '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'
})

const insertData = async () => {
  await client.deleteCollection({
    name: 'my_collection'
  })
  const collection = await client.getOrCreateCollection({
    name: 'my_collection',
    embeddingFunction: embedder
  })

  const data = [
    `Johnson and Johnson to Go First Aid Kit`,
    `Aplicare Lubricating Jelly`,
    `AirSense 11 Standard Filter, Disposable`,
    `Securi-T USA Two-Piece Cut-to-Fit Standard Wear Wafer with Flexible Collar 5" x 5" 2-3/4" - 10/Box`,
    `B. Braun Cap - 500/Case`,
    `Respironics Tubing`,
    `Mindray USA Cable`
  ]

  await collection.add({
    ids: data.map((_, i) => `id${i + 1}`),
    metadatas: data.map(() => ({ source: 'my_source' })),
    documents: data
  })
}

const search = async str => {
  const collection = await client.getOrCreateCollection({
    name: 'my_collection',
    embeddingFunction: embedder
  })

  const results = await collection.query({
    nResults: 3,
    queryTexts: [str]
  })

  return results
}

// insertData()
search('cable').then(console.log)
