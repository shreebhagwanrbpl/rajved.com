export default function SectionTitle({
  badge,
  title,
  description,
  center = false,
  className = "",
}) {
  return (
    <div
      className={`max-w-3xl ${center ? "mx-auto text-center" : ""} ${className}`}
    >
      {badge && (
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#E05353]/25 bg-gradient-to-r from-[#FFF0EF] to-[#FEEAE8] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#C93B3B] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#E05353] animate-pulse" />
          <span>{badge}</span>
        </div>
      )}

      {title && (
        <h2 className="text-3xl font-extrabold tracking-tight text-[#2D1818] sm:text-4xl md:text-5xl leading-tight">
          {title}
        </h2>
      )}

      {description && (
        <p className="mt-4 text-base sm:text-lg leading-relaxed text-[#796565]">
          {description}
        </p>
      )}
    </div>
  );
}