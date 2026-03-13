import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Load quotes dataset
  const quotesPath = path.resolve(process.cwd(), "quotes.json");
  const quotes = JSON.parse(fs.readFileSync(quotesPath, "utf-8"));

  // Simple NLP: Keyword-based intent classification
  function getCategory(message: string): string | null {
    const msg = message.toLowerCase();
    
    if (msg.includes("motivate") || msg.includes("motivation") || msg.includes("inspire") || msg.includes("encourag")) {
      return "motivation";
    }
    if (msg.includes("success") || msg.includes("achieve") || msg.includes("goal") || msg.includes("win")) {
      return "success";
    }
    if (msg.includes("love") || msg.includes("romance") || msg.includes("heart") || msg.includes("affection")) {
      return "love";
    }
    if (msg.includes("funny") || msg.includes("humor") || msg.includes("joke") || msg.includes("laugh")) {
      return "humor";
    }
    if (msg.includes("life") || msg.includes("advice") || msg.includes("wisdom") || msg.includes("live")) {
      return "life";
    }
    
    return null;
  }

  // API endpoint for chatbot
  app.post("/api/get", (req, res) => {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const category = getCategory(message);
    
    if (category && quotes[category]) {
      const categoryQuotes = quotes[category];
      const randomQuote = categoryQuotes[Math.floor(Math.random() * categoryQuotes.length)];
      res.json({ quote: randomQuote, category });
    } else {
      res.json({ 
        quote: "I'm not sure what kind of quote you're looking for. Try asking for motivation, success, love, humor, or life advice!", 
        category: "unknown" 
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
