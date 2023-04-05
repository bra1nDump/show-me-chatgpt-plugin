/**
 * Search Lex Chunks endpoint
 * URL: https://beta-git-tfchat-dexa.vercel.app/api/query
 * Method: POST
 */

/** Request Body */
// const ReqBodySchema = z.object({
//   query: z.string().min(1).max(500),
//   topK: z.number().min(1).max(100).default(10),
// });

// type Chunk = {
//   /** The text content of the chunk */
//   content: string;
//   /** GPT generated summary of the chunk content */
//   chunkSummary?: string | null;
//   /** Names and short IDs of the people that speak in the chunk */
//   peopleSids: string[];
//   peopleNames: string[];
//   /** Titles for the chunk, section (chapter), and document (episode) */
//   chunkName: string;
//   sectionName: string;
//   docName: string;
//   /** The short IDs are used in route URLs and dynamic image URLs */
//   docSid: string;
//   sectionSid: string;
//   chunkSid: string;
// };

// type ResponseBody = {
//   chunks: Chunk[];
// };

// /**
//  * Lex Q&A endpoint
//  * URL: https://beta-git-tfchat-dexa.vercel.app/api/ask
//  * Method: POST
//  */

// const ReqBodySchema = z.object({
//   query: z.string().min(1).max(500)
// })

// /** An answer from a specific person */
// type Answer = {
//   /** The answer text */
//   answer: string
//   /** The person that answered the question */
//   personName: string
//   personSid: string
//   /** Context used to answer the question */
//   context: string
//   sectionName: string
//   docName: string
//   chunkSid: string
//   sectionSid: string
//   docSid: string
// }

// /** Answers from all people that answered the question */
// type ResponseBody = {
//   answers: Answer[]
// }

// /**

// Person image URL: https://assets.standardresume.co/image/upload/c_thumb,w_96,h_96,f_auto,q_auto,g_face,z_0.89/dexa/people/{personSid}

// Episode page deep link: https://dexa.ai/lex/episodes/doc_358?sectionSid=sec_5319&chunkSid=chunk_9725

//  */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
}
