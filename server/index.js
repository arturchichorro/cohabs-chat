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
        const { query, history = [] } = req.body;
        const result = await handleQuery(query, history);
        res.status(200).json({ answer: result });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error occurred",
        });
    }
});

async function handleQuery(query, history) {
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

    const systemMessage = {
        role: "system",
        content: `You are Cohabs FAQ Assistant, a friendly and professional customer service bot.
        - Answer questions **only** using the information provided in the Context section. Take previous messages into account when interpreting the question.
        - If the question is unrelated to Cohabs, don't mention "context" or that you cannot help; instead, politely guide the user back to Cohabs-related topics.
        - If you believe the question might be related to Cohabs but you don't have an answer in the context, respond with EXACTLY: "[[FALLBACK]]".
        - Do not guess, invent information, or use outside knowledge.
        - Always format answers in **markdown** for readability.
        - If the Context contains a link, include it as a clickable markdown link (e.g., [Link text](https://example.com)).
        - Keep answers **clear, concise, and professional**, while sounding warm and conversational.
        - If the user greets you (e.g., "Hello", "Hi"), respond politely with a short greeting and say who you are.
        - If the user asks something unrelated to Cohabs, gently redirect by saying something like:
        "I'm here to help with Cohabs information such as booking, amenities, or pricing. What would you like to know about Cohabs?"
        - If multiple points are provided in the Context, present them as a bulleted or numbered list for clarity.
        Remember: Stay on Cohabs, be helpful, and keep the tone warm and supportive.`
    }

    const historyMessages = history.map(m => ({
        role: m.isUser ? "user" : "assistant",
        content: m.text
    }));

    const messages = [
        systemMessage,
        ...historyMessages,
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

    const response = completion.choices[0].message.content;

    if (response.startsWith("[[FALLBACK]]")) {
        console.log("Mock Slack Notification: ")
        console.log(`Couldn't solve issue: ${query}.`);
        console.log(`Context Preview: ${contextText}`);

        return ("We couldn't find an answer in our docs just now. I've notified our team to follow up. If you have more details, feel free to share and I'll try again. 🙏");
    }

    return response;
}

app.listen('3035', () => {
    console.log('App is running on port 3035');
});

