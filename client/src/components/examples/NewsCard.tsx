import NewsCard from "../NewsCard";

export default function NewsCardExample() {
  return (
    <div className="p-8 max-w-md">
      <NewsCard
        title="GPT-5 Achieves Human-Level Performance on Complex Reasoning Tasks"
        summary="OpenAI's latest model demonstrates unprecedented capabilities in multi-step problem solving and abstract reasoning."
        source="AI Research Daily"
        timeAgo="2h ago"
      />
    </div>
  );
}
