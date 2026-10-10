import { useEffect, useRef, useState } from 'react';

export const useAnimatedInView = (options = {}) => {
  const ref = useRef(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (!options.continuous) observer.unobserve(entry.target);
      } else if (options.continuous) {
        setIsInView(false);
      }
    }, { threshold: options.threshold || 0.1 });

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return [ref, isInView];
};
