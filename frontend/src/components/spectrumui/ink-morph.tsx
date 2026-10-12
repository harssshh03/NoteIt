import { useEffect, useId, useRef } from "react";
import { motion, animate } from "framer-motion";

type Props = {
  text?: string;
  intensityFrom?: number;
  intensityTo?: number;
  settleMs?: number;
  colorStart?: string;
  colorEnd?: string;
};

export function InkMorphText({
  text = "Ink Morph",
  intensityFrom = 0.28,
  intensityTo = 0.002,
  settleMs = 2000,
  colorStart = "#6366f1",
  colorEnd = "#10b981",
}: Props) {
  const id = useId().replace(/:/g, "_");
  const turbRef = useRef<SVGFETurbulenceElement | null>(null);
  const dispRef = useRef<SVGFEDisplacementMapElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    startRef.current = null;
    const tick = (t: number) => {
      if (!startRef.current) startRef.current = t;
      const elapsed = t - (startRef.current ?? 0);
      const p = Math.min(1, elapsed / settleMs);

      const ease = 1 - Math.pow(1 - p, 3);
      const freq = intensityFrom + (intensityTo - intensityFrom) * ease;
      const scale = 80 * (1 - ease);

      if (turbRef.current)
        turbRef.current.setAttribute("baseFrequency", `${freq} ${freq * 0.9}`);
      if (dispRef.current) dispRef.current.setAttribute("scale", `${scale}`);

      if (turbRef.current)
        turbRef.current.setAttribute(
          "seed",
          `${Math.floor(1000 + t * 0.02 + p * 50)}`,
        );

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensityFrom, intensityTo, settleMs]);

  useEffect(() => {
    animate(colorStart, colorEnd, {
      duration: settleMs / 1000,
      ease: [0.2, 0.6, 0.12, 1.0],
      onUpdate: (latest) => {
        if (textRef.current) {
          textRef.current.style.color = latest;
        }
      },
    });
  }, [colorStart, colorEnd, settleMs]);

  const textRef = useRef<HTMLSpanElement | null>(null);

  return (
    <motion.div
      className="relative isolate"
      aria-label={text}
      role="img"
      style={{ filter: `url(#ink_${id})` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <span
        ref={textRef}
        className="select-none whitespace-pre font-black tracking-tight text-[clamp(30px,6vw,68px)]"
        style={{ color: colorStart }}
      >
        {text}
      </span>

      <svg width="0" height="0" className="absolute">
        <filter id={`ink_${id}`}>
          <feTurbulence
            ref={turbRef}
            type="fractalNoise"
            baseFrequency={`${intensityFrom} ${intensityFrom * 0.9}`}
            numOctaves="2"
            stitchTiles="stitch"
            result="noise"
            seed="1"
          />
          <feDisplacementMap
            ref={dispRef}
            in="SourceGraphic"
            in2="noise"
            scale="80"
            xChannelSelector="R"
            yChannelSelector="G"
          />

          <feComponentTransfer>
            <feFuncR type="gamma" amplitude="1.05" exponent="0.9" />
            <feFuncG type="gamma" amplitude="1.05" exponent="0.9" />
            <feFuncB type="gamma" amplitude="1.05" exponent="0.9" />
          </feComponentTransfer>
        </filter>
      </svg>

      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.06]">
        <div className="h-full w-full bg-[radial-gradient(60%_50%_at_50%_45%,#3f3f3f22_0%,transparent_60%)]" />
      </div>
    </motion.div>
  );
}
