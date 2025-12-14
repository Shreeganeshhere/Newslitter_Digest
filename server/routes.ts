import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSubscriberSchema, insertNewsItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Subscriber routes (stores email in subscribers table)
  app.post("/api/subscribers", async (req, res) => {
    try {
      const data = insertSubscriberSchema.parse(req.body);
      
      // Check if email already exists in subscribers table
      const existing = await storage.getSubscriberByEmail(data.email);
      if (existing) {
        return res.status(400).json({ 
          error: "Email id already exists" 
        });
      }

      const subscriber = await storage.createSubscriber(data);
      res.json(subscriber);
    } catch (error: any) {
      res.status(400).json({ 
        error: error.message || "Failed to create subscriber" 
      });
    }
  });

  // News routes
  app.get("/api/news", async (req, res) => {
    try {
      const news = await storage.getAllNews();
      res.json(news);
    } catch (error: any) {
      res.status(500).json({ 
        error: error.message || "Failed to fetch news" 
      });
    }
  });

  app.post("/api/news", async (req, res) => {
    try {
      const data = insertNewsItemSchema.parse(req.body);
      const newsItem = await storage.createNewsItem(data);
      res.json(newsItem);
    } catch (error: any) {
      res.status(400).json({ 
        error: error.message || "Failed to create news item" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
