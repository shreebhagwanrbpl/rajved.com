import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ServiceCard({
  icon,
  title,
  description,
  badge,
  turnaround,
  highlights = [],
  loading = false,
  makeLink = (p) => p,
}) {
  if (loading) {
    return (
      <div className="animate-pulse rounded-3xl border border-[#FBD5D3] bg-white p-8 shadow-md">
        <div className="mb-6 h-14 w-14 rounded-2xl bg-[#FFF0EF]" />
        <div className="mb-4 h-7 w-3/4 rounded bg-[#FEEAE8]" />
        <div className="space-y-3">
          <div className="h-4 rounded bg-[#FFF0EF]" />
          <div className="h-4 w-11/12 rounded bg-[#FFF0EF]" />
          <div className="h-4 w-8/12 rounded bg-[#FFF0EF]" />
        </div>
      </div>
    );
  }

  return (
    <div className="group relative flex flex-col justify-between rounded-3xl border border-[#FBD5D3] bg-white p-8 shadow-md transition-all duration-300 hover:-translate-y-2 hover:border-[#E05353]/50 hover:shadow-2xl hover:shadow-[#E05353]/15">
      <div>
        {/* Top bar with Icon & Badge */}
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0EF] text-[#E05353] transition-all duration-300 group-hover:bg-[#E05353] group-hover:text-white group-hover:scale-105 shadow-sm [&>svg]:stroke-current [&>svg]:text-current [&>svg]:transition-colors">
            {icon}
          </div>

          {badge && (
            <span className="rounded-full border border-[#E05353]/20 bg-[#FFF0EF] px-3 py-1 text-xs font-bold text-[#C93B3B]">
              {badge}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="mb-3 text-2xl font-bold text-[#2D1818] transition-colors duration-300 group-hover:text-[#E05353]">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base leading-relaxed text-[#796565]">
          {description}
        </p>

        {/* Highlights List if present */}
        {highlights && highlights.length > 0 && (
          <ul className="mt-6 space-y-2.5 border-t border-[#FBD5D3]/60 pt-5 text-sm text-[#796565]">
            {highlights.map((item, idx) => (
              <li key={idx} className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-[#E05353] shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer Link */}
      <div className="mt-8 flex items-center justify-between border-t border-[#FBD5D3]/60 pt-4">
        {turnaround ? (
          <span className="text-xs font-semibold text-[#796565]">
            SLA: <strong className="text-[#E05353] font-bold">{turnaround}</strong>
          </span>
        ) : (
          <span className="text-xs font-semibold text-[#796565]">Certified Quality</span>
        )}

        <Link
          href={makeLink("/contact")}
          className="inline-flex items-center gap-1.5 text-sm font-bold text-[#E05353] transition-all group-hover:translate-x-1 group-hover:text-[#C93B3B]"
        >
          <span>Book Service</span>
          <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}