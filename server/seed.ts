import { storage } from "./storage";

const newsData = [
  {
    title: "GPT-5 Achieves Human-Level Performance on Complex Reasoning Tasks",
    summary: "OpenAI's latest model demonstrates unprecedented capabilities in multi-step problem solving and abstract reasoning, marking a significant milestone in AI development.",
    source: "AI Research Daily",
    url: "https://example.com/gpt5",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    title: "Meta Releases Llama 3.5 with Improved Multimodal Capabilities",
    summary: "The new open-source model shows remarkable improvements in understanding images, videos, and text simultaneously.",
    source: "TechCrunch",
    url: "https://example.com/llama",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    title: "Google's Gemini Ultra Surpasses Claude 3 on Coding Benchmarks",
    summary: "Latest evaluations show Google's flagship model outperforming competitors on HumanEval and MBPP coding challenges.",
    source: "VentureBeat",
    url: "https://example.com/gemini",
    publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    title: "Breakthrough in Efficient Transformers: 10x Faster Training",
    summary: "Researchers at Stanford introduce a novel attention mechanism that dramatically reduces computational requirements for large language models.",
    source: "arXiv",
    url: "https://arxiv.org/abs/example",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
  },
  {
    title: "AutoML Platform Achieves State-of-the-Art on ImageNet",
    summary: "New automated machine learning system discovers architectures that outperform manually designed models on image classification.",
    source: "ML Papers",
    url: "https://example.com/automl",
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    title: "Ethical AI Framework Adopted by Major Tech Companies",
    summary: "Industry leaders commit to new standards for responsible AI development and deployment, focusing on transparency and fairness.",
    source: "AI Ethics Institute",
    url: "https://example.com/ethics",
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    title: "Quantum Machine Learning Shows Promise for Drug Discovery",
    summary: "Hybrid quantum-classical algorithms demonstrate ability to predict molecular properties with unprecedented accuracy.",
    source: "Nature Machine Intelligence",
    url: "https://example.com/quantum",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    title: "New Dataset Challenges Models on Real-World Reasoning",
    summary: "Researchers release comprehensive benchmark testing AI systems on practical, everyday problem-solving scenarios.",
    source: "Hugging Face",
    url: "https://huggingface.co/example",
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Federated Learning Enables Privacy-Preserving Healthcare AI",
    summary: "Hospitals collaborate on model training without sharing sensitive patient data, advancing medical AI while protecting privacy.",
    source: "Medical AI Journal",
    url: "https://example.com/federated",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Reinforcement Learning Breakthrough in Robotics Control",
    summary: "New algorithm enables robots to learn complex manipulation tasks from minimal human demonstrations.",
    source: "Robotics Today",
    url: "https://example.com/robotics",
    publishedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  try {
    for (const news of newsData) {
      await storage.createNewsItem(news);
      console.log(`✓ Added: ${news.title.substring(0, 50)}...`);
    }

    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
