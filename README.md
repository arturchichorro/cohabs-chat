# Cohabs FAQ Chat

## Overview

Cohabs FAQ Chat is a **customer service chatbot** designed to provide accurate, contextual answers based on a predefined FAQ dataset.  
It combines a simple **FAQ JSON knowledge base** with **Retrieval Augmented Generation (RAG)** to enhance responses.

### How it works

1. **FAQ Knowledge Base**  
   The app uses a JSON file containing frequently asked questions and their answers. This serves as the trusted source of information.

2. **Retrieval Augmented Generation (RAG)**  
   When a user submits a query:
   - The system searches the FAQ knowledge base for the most relevant entries.
   - Those relevant FAQ entries are passed as context to the language model (OpenAI).
   - The model generates a natural, conversational response that stays grounded in the provided context.

3. **Contextual Responses Only**  
   The bot is restricted to the FAQ context:  
   - It will not invent answers outside of the knowledge base.  
   - Responses remain factual, consistent, and within the customer service scope.  

## Setup

In order to run the code, start by cloning the repository. Then, in the root directory, create a .env file, similar to .env.example. Insert the required environment variables.

Then, build and run with Docker Compose:

```bash
docker compose up --build
```

This will:

- Start the server on [http://localhost:3035](http://localhost:3035)
- Start the client on [http://localhost:5173](http://localhost:3035)

Open the client and chat with the bot.

## Preview

![Preview of the app](https://i.imgur.com/89nNCD8.png)
