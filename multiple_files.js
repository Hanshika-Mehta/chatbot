const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { OpenAIEmbeddings } = require( "langchain/embeddings/openai");
// const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const { RetrievalQAChain, ConversationalRetrievalQAChain } = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
// const { PDFLoader } = require  ("langchain/document_loaders/fs/pdf");
const  { CSVLoader } = require ("langchain/document_loaders/fs/csv");
const { TextLoader } = require ("langchain/document_loaders/fs/text");
// const  ChromaClient  = require( "chromadb");
const { OpenAIEmbeddingFunction } = require("chromadb");
const { ChromaClient } = require("chromadb");
const { path } = require("path");
const { fs }  = require("fs");
// const { Chroma} = require( "langchain/vectorstores/chroma");

// chroma_client = chromadb.Client()
// collection = chroma_client.create_collection("bedCourtney")

const main = async () => {
//   const pdfPath = "./courtney-bed-br.pdf";
//   const pdfLoader = new PDFLoader(pdfPath);
//   const data = await pdfLoader.load();
    let data;
    let splitDocs = [];

  // console.log({Chroma});

  try {
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 0,
    });

    const splitDocs = await textSplitter.splitDocuments(data);

    // const embeddings = new OpenAIEmbeddings({
    //   openAIApiKey: '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'
    // });

    // console.log(embeddings);

    const embedder = new OpenAIEmbeddingFunction({
      openai_api_key: "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",
    });
    const client = new ChromaClient({});
    const collection = await client.getOrCreateCollection({
      name: "bedCourtney",
      embeddingFunction: embedder,
    });

    const collection2 = await client.getOrCreateCollection({
      name: "bed",
      embeddingFunction: embedder,
      
    });
    console.log('my collection',await client.getCollection({
      name: 'bedCourtney'
    }))
    const vectorStore = await collection.add({
      ids: ["1"],
      documents: [splitDocs[0].pageContent],
    });
    console.log(vectorStore);
    // const vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    // const vectorStore = await Chroma.fromDocuments(splitDocs, embeddings, chromaArgs);
    // console.log("Vector Dimensionssssss:", vectors[0].length);

    // const relevantDocs = await vectorStore.similaritySearch(
    //   "Our product courtney bed"
    // );

    const model = new ChatOpenAI({
      modelName: "gpt-3.5-turbo",
      openAIApiKey: "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",
    });
    // const chain = ConversationalRetrievalQAChain.fromLLM(model, collection.asRetriever());
    const response = await collection.query({
      nResults: 2,
      queryTexts: ["what are the features of product?"],
    });
    console.log(response);
    performance.now();
  } catch (error) {
    console.log(error);
  }
};

main()
  .then(() => {
    console.log("Done");
  })
  .catch((err) => console.error(err));

// const getData = async () => {
//   const collection = await client.getCollection({
//     name: "bed_courtney",
//   });
// };

// getData();
