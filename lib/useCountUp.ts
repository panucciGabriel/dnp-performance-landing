"use client";

import { useRef, useState, useEffect } from "react";

/**
 * Anima um número de 0 até `to` quando o elemento entra na viewport.
 * Retorna { ref, val } — aplique `ref` no elemento que dispara o trigger.
 */
export function useCountUp(to: number, duration = 1400) {
  const ref  = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const run = () => {
      if (done.current) return;
      done.current = true;
      const start = performance.now();

      const tick = (now: number) => {
        const p      = Math.min(1, (now - start) / duration);
        const eased  = 1 - Math.pow(1 - p, 3); // ease-out-cubic
        const current = Math.round(eased * to);
        setVal(current);
        if (p < 1) requestAnimationFrame(tick);
        else setVal(to); // garante o valor final exato
      };

      requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    io.observe(el);

    // Fallback: se o elemento nunca entrar na viewport (tab em background, etc.)
    const fallback = setTimeout(() => {
      if (!done.current) {
        setVal(to);
        done.current = true;
      }
    }, 2500);

    return () => {
      io.disconnect();
      clearTimeout(fallback);
    };
  }, [to, duration]);

  return { ref, val };
}
