import { useEffect, useRef, useState } from "react";
import { mat4, vec3 } from "gl-matrix";
import { ArrowUpRight } from "lucide-react";

interface InfiniteMenuItem {
  id: number;
  title: string;
  summary: string;
  source: string;
  url?: string;
  publishedAt: string;
}

interface InfiniteMenuProps {
  items: InfiniteMenuItem[];
}

export default function InfiniteMenu({ items }: InfiniteMenuProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const dragVelocityRef = useRef(0);

  const itemCount = items.length;
  const radius = 800;
  const angleStep = (2 * Math.PI) / itemCount;

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      if (!isDragging && Math.abs(dragVelocityRef.current) > 0.001) {
        setRotationY(prev => prev + dragVelocityRef.current);
        dragVelocityRef.current *= 0.95;
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    if (!isDragging) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    dragVelocityRef.current = 0;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - startX;
    const rotationDelta = deltaX * 0.003;
    
    setRotationY(prev => prev + rotationDelta);
    dragVelocityRef.current = rotationDelta;
    setStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].clientX);
    dragVelocityRef.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.touches[0].clientX - startX;
    const rotationDelta = deltaX * 0.003;
    
    setRotationY(prev => prev + rotationDelta);
    dragVelocityRef.current = rotationDelta;
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const published = new Date(date);
    const diffMs = now.getTime() - published.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <div className="w-full h-screen flex items-center justify-center overflow-hidden perspective-1000">
      <div
        ref={containerRef}
        className="relative w-full h-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ perspective: "1000px" }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div 
            className="relative preserve-3d"
            style={{
              transform: `rotateY(${rotationY}rad)`,
              transformStyle: "preserve-3d",
            }}
          >
            {items.map((item, index) => {
              const angle = index * angleStep;
              const x = Math.sin(angle + rotationY) * radius;
              const z = Math.cos(angle + rotationY) * radius;
              const scale = (z + radius) / (2 * radius);
              const opacity = Math.max(0.3, Math.min(1, (z + radius) / radius));

              return (
                <div
                  key={item.id}
                  className="absolute bg-card border border-card-border rounded-2xl p-6 transition-all duration-200 hover-elevate"
                  style={{
                    transform: `translate3d(${x}px, 0px, ${z}px) rotateY(${-rotationY}rad) scale(${scale})`,
                    transformStyle: "preserve-3d",
                    width: "400px",
                    opacity: z > -radius * 0.5 ? opacity : 0,
                    pointerEvents: z > -radius * 0.3 ? "auto" : "none",
                    zIndex: Math.round(z),
                  }}
                  data-testid={`news-item-${item.id}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="text-lg font-semibold leading-tight flex-1">
                        {item.title}
                      </h3>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex-shrink-0 hover-elevate active-elevate-2 rounded-md p-1"
                        >
                          <ArrowUpRight className="w-5 h-5 text-muted-foreground" />
                        </a>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                      <span className="font-medium">{item.source}</span>
                      <span>{getTimeAgo(item.publishedAt)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-sm text-muted-foreground">
        Drag to rotate
      </div>
    </div>
  );
}
