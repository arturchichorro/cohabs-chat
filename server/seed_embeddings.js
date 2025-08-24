const { readFileSync } = require("fs");
const { Document } = require("@langchain/core/documents");
const { createClient } = require("@supabase/supabase-js");
const OpenAI = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

function loadFaqAsDocuments() {

    let raw;
    try {
        raw = readFileSync("./faq.json", "utf8");
    } catch (error) {
        throw new Error(`Failed to read faq.json: ${error.message}`);
    }
    const items = JSON.parse(raw);

    if (!Array.isArray(items)) {
        throw new Error("faq.json must be a JSON array of { question, answer } objects.");
    }

    const docs = items
        .map((item, i) => {
            const q = item?.question?.trim?.();
            const a = item?.answer?.trim?.();
            if (!q || !a) return null;

            return new Document({
                id: String(i),
                pageContent: `Q: ${q} A: ${a}`,
                metadata: {
                    source: "./faq.json",
                    index: i,
                    question: q,
                },
            });
        })
        .filter(Boolean);
    
    return docs;
}

async function storeEmbeddings() {
    
    const docs = loadFaqAsDocuments()

    const promises = docs.map(async (chunk) => {
        const cleanChunk = chunk.pageContent.replace(/\n/g, " ");

        const embeddingResponse = await openai.embeddings.create({
            model: "text-embedding-3-small",
            input: cleanChunk
        });

        const [{ embedding }] = embeddingResponse.data;

        const { error } = await supabase.from("documents").insert({
            content: cleanChunk,
            embedding,
        });

        if (error) {
            throw error;
        }
    });

    await Promise.all(promises);
}

storeEmbeddings()