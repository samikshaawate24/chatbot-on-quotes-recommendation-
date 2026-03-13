# Quotes Recommendation Chatbot using NLP

A complete full-stack chatbot application that recommends quotes based on user intent using keyword-based Natural Language Processing.

## Project Structure

- `server.ts`: Express backend with keyword-based NLP logic.
- `quotes.json`: Dataset containing quotes categorized by motivation, success, love, humor, and life.
- `src/App.tsx`: React frontend with a modern, responsive chatbot UI.
- `src/index.css`: Custom styling using Tailwind CSS and serif typography.

## Features

1. **Intelligent Intent Detection**: Understands user requests like "motivate me", "tell me a joke", or "life advice".
2. **Modern UI**: Clean, warm organic design with smooth animations.
3. **Real-time Interaction**: Instant responses from the backend wisdom database.
4. **Category Suggestions**: Quick-access buttons for popular quote categories.

## How to Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The app will be available at `http://localhost:3000`.

## NLP Logic

The chatbot uses a keyword-based approach to classify user messages into one of the following categories:
- **Motivation**: Keywords like "motivate", "inspire", "encouragement".
- **Success**: Keywords like "success", "achieve", "goal".
- **Love**: Keywords like "love", "romance", "heart".
- **Humor**: Keywords like "funny", "joke", "laugh".
- **Life**: Keywords like "life", "advice", "wisdom".

If no category is detected, the bot provides a helpful fallback message.

## Technologies Used

- **Frontend**: React, Tailwind CSS, Motion, Lucide Icons.
- **Backend**: Node.js, Express.
- **NLP**: Keyword-based intent classification.
