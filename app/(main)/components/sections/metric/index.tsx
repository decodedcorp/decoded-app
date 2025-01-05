import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";
import { networkManager } from "@/common/network";

interface MetricItemProps {
  label: string;
  value: number;
  suffix?: string;
}

interface MockMetrics {
  totalRequests: number;
  todayRequests: number;
  successRate: number;
  responseTime: number;
}

export function useMockMetrics() {
  const [metrics, setMetrics] = useState<MockMetrics>({
    totalRequests: 1234,
    todayRequests: 56,
    successRate: 98,
    responseTime: 24,
  });

  useEffect(() => {
    // 랜덤한 시간 간격으로 업데이트 (3-7초)
    const getRandomInterval = () =>
      Math.floor(Math.random() * (7000 - 3000) + 3000);

    const updateMetrics = () => {
      setMetrics((prev) => ({
        ...prev,
        // 누적 요청 수: 1-3개씩 증가
        totalRequests: prev.totalRequests + Math.floor(Math.random() * 3) + 1,
        // 금일 요청 수: 50% 확률로 1개씩 증가
        todayRequests: prev.todayRequests + (Math.random() > 0.5 ? 1 : 0),
      }));
    };

    // 초기 인터벌 설정
    let intervalId = setInterval(updateMetrics, getRandomInterval());

    // 주기적으로 인터벌 시간 변경
    const intervalUpdateId = setInterval(() => {
      clearInterval(intervalId);
      intervalId = setInterval(updateMetrics, getRandomInterval());
    }, 10000);

    return () => {
      clearInterval(intervalId);
      clearInterval(intervalUpdateId);
    };
  }, []);

  return metrics;
}

interface CounterProps {
  from?: number;
  to: number;
  className?: string;
}

export function Counter({ from = 0, to, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(from);
  const rounded = useSpring(count, {
    stiffness: 100,
    damping: 20,
    restSpeed: 0.5,
  });

  useEffect(() => {
    if (isInView) {
      count.set(to);
    }
  }, [isInView, to, count]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.round(latest).toString();
      }
    });
  }, [rounded]);

  return <span ref={ref} className={className} />;
}

function MetricItem({ label, value, suffix = "" }: MetricItemProps) {
  return (
    <div className="text-center px-4">
      <div className="flex items-baseline justify-center gap-1">
        <Counter
          from={0}
          to={value}
          className={cn(
            "text-3xl md:text-4xl font-bold",
            "bg-gradient-to-b from-[#EAFD66] to-[#EAFD66]/70",
            "bg-clip-text text-transparent"
          )}
        />
        {suffix && <span className="text-xl text-[#EAFD66]/70">{suffix}</span>}
      </div>
      <p className="text-sm md:text-base text-zinc-400 mt-2">{label}</p>
    </div>
  );
}

export function MetricsSection() {
  const metrics = useMockMetrics();

  const fetchMetrics = async () => {
    const response = await networkManager.request("metrics/decoded", "GET");
    console.log(response.data);
  };

  useEffect(() => {
    const interval = setInterval(fetchMetrics, 10000); // Request every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      className={cn(
        "container mx-auto px-4 py-16",
        "border-y border-zinc-800",
        "bg-zinc-900/30"
      )}
    >
      <div
        className={cn(
          "grid grid-cols-2 md:grid-cols-4 gap-8",
          "max-w-4xl mx-auto"
        )}
      >
        <MetricItem
          label="누적 요청 수"
          value={metrics.totalRequests}
          suffix="건"
        />
        <MetricItem
          label="금일 요청 수"
          value={metrics.todayRequests}
          suffix="건"
        />
        <MetricItem
          label="제품 제공률"
          value={metrics.successRate}
          suffix="%"
        />
        <MetricItem
          label="평균 응답시간"
          value={metrics.responseTime}
          suffix="시간"
        />
      </div>
    </section>
  );
}
