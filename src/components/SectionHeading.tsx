import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  badge?: string;
  title: string;
  description?: string;
  className?: string;
  align?: "left" | "center";
}

const SectionHeading = ({
  badge,
  title,
  description,
  className,
  align = "center",
}: SectionHeadingProps) => (
  <div
    className={cn(
      "mb-12 md:mb-16",
      align === "center" && "text-center mx-auto max-w-3xl",
      className,
    )}
  >
    {badge && (
      <span className="inline-block mb-4 text-accent text-xs font-semibold tracking-[0.2em] uppercase border border-accent/30 px-4 py-1.5 rounded-full bg-accent/10">
        {badge}
      </span>
    )}
    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient-gold">
      {title}
    </h2>
    {description && (
      <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
    )}
  </div>
);

export default SectionHeading;
