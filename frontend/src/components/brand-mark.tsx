import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BrandMark({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "border-background bg-linear-to-b rounded-(--radius) relative flex size-9 translate-y-0.5 items-center justify-center border from-yellow-300 to-orange-600 shadow-lg shadow-black/20 ring-1 ring-black/10",
        className,
      )}
    >
      <BookOpen className="mask-b-from-25% size-6 fill-white stroke-white drop-shadow-sm" />
      <BookOpen className="absolute inset-0 m-auto size-6 fill-white stroke-white opacity-65 drop-shadow-sm" />
      <div className="z-1 h-4.5 absolute inset-2 m-auto w-px translate-y-px rounded-full bg-black/10"></div>
    </div>
  );
}