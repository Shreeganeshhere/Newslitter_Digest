const stats = [
  { value: "10K+", label: "Subscribers" },
  { value: "5 Years", label: "Running" },
  { value: "98%", label: "Open Rate" },
  { value: "Weekly", label: "Delivery" }
];

export default function StatisticsBar() {
  return (
    <section className="py-20 md:py-24 bg-primary/5 border-y border-border">
      <div className="container max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="text-center space-y-2"
              data-testid={`stat-${index}`}
            >
              <div className="text-5xl md:text-6xl font-bold font-mono text-primary">
                {stat.value}
              </div>
              <div className="text-base md:text-lg text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
