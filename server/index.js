const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
const { createClient } = require("@supabase/supabase-js");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
);

app.post("/query", async (req, res) => {
    try {
        const { query } = req.body;
        const result = await handleQuery(query);
        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occurred",
        });
    }
});

async function handleQuery(query) {
    const input = query.replace(/\n/g, " ");

    const embeddingResponse = await openai.embeddings.create({
        model: "text-embedding-3-small",
        input,
    });

    const [{ embedding }] = embeddingResponse.data;

    const { data: documents, error } = await supabase.rpc("match_documents", {
        query_embedding: embedding,
        match_threshold: 0.2,
        match_count: 10,
    });

    if (error) throw error;

    let contextText = "";
    contextText += documents
        .map((document) => `${document.content.trim()}---\n`)
        .join("");

    const messages = [
        {
            role: "system",
            content: `You are Cohabs FAQ Assistant, a helpful customer service bot. Only answer questions using the information provided in the Context section. If the answer is not fully supported by the Context, reply exactly: "I can't answer that question." Do not guess, make assumptions, or use outside knowledge. Keep answers concise, clear, and professional.`,
        },
        {
            role: "user",
            content: `Context: "${contextText}" Question: "${query}" Answer:`,
        },
    ];

    const completion = await openai.chat.completions.create({
        messages,
        model: "gpt-5-nano",
        reasoning_effort: "low",
        verbosity: "low",
    });

    return completion.choices[0].message.content;
}

app.listen('3035', () => {
    console.log('App is running on port 3035');
});

