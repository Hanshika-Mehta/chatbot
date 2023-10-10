const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
// const { OpenAIEmbeddings } = require( "langchain/embeddings/openai");
const { MemoryVectorStore } = require("langchain/vectorstores/memory");
const {
  RetrievalQAChain,
  ConversationalRetrievalQAChain,
} = require("langchain/chains");
const { ChatOpenAI } = require("langchain/chat_models/openai");
const { PDFLoader } = require("langchain/document_loaders/fs/pdf");
// const  ChromaClient  = require( "chromadb");
const { OpenAIEmbeddingFunction } = require("chromadb");
const { ChromaClient } = require("chromadb");
// const { Chroma} = require( "langchain/vectorstores/chroma");

// chroma_client = chromadb.Client()cls
// collection = chroma_client.create_collection("bedCourtney")

const main = async () => {
  const pdfPath = "E:/tdc-GenAI/chatbot/documents/courtney-bed-br.pdf";
  const pdfLoader = new PDFLoader(pdfPath);
  const data = await pdfLoader.load();

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
    for (let i = 0; i < splitDocs.length; i++) {
      const splitDoc = splitDocs[i];
      const vectorStore = await collection.add({
        ids: [(i+30).toString()],
        documents: [splitDoc.pageContent],
      });
    }
    const database = await collection.get();
    // console.log(database);
    // console.log(vectorStore);
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
      nResults: 1,
      queryTexts: [
        "features of the BlackDecker WDBD10:",
      ],
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
