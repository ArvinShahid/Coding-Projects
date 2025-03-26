
import { useEffect, useRef } from 'react';
import { type CarouselApi } from "@/components/ui/carousel";

export function useAutoScroll(
  carouselApi: CarouselApi | null,
  interval: number = 3000,
  enabled: boolean = true
) {
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (!carouselApi || !enabled) return;
    
    const startAutoScroll = () => {
      intervalRef.current = window.setInterval(() => {
        carouselApi.scrollNext();
      }, interval);
    };

    const stopAutoScroll = () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };

    // Start auto-scrolling immediately
    startAutoScroll();

    // Clean up when component unmounts
    return () => {
      stopAutoScroll();
    };
  }, [carouselApi, interval, enabled]);

  return intervalRef.current !== null;
}
