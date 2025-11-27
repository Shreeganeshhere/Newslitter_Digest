import InfiniteMenu from "../InfiniteMenu";

const sampleNews = [
  {
    id: 1,
    title: "GPT-5 Released with Groundbreaking Features",
    summary: "OpenAI announces the release of GPT-5, featuring improved reasoning capabilities and multimodal understanding.",
    source: "AI Daily",
    publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    title: "Meta's New AI Model Surpasses Expectations",
    summary: "Meta releases Llama 3.5 with significantly improved performance on benchmarks.",
    source: "TechCrunch",
    publishedAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    title: "Breakthrough in Quantum ML Algorithms",
    summary: "Researchers develop new quantum machine learning algorithms that could revolutionize the field.",
    source: "Nature AI",
    publishedAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
];

export default function InfiniteMenuExample() {
  return <InfiniteMenu items={sampleNews} />;
}
