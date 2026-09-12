import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function Pagination({page, totalPages, totalCount, onPageChange, itemLabel = "items"}: {page: number; totalPages: number; totalCount: number; onPageChange: (page: number) => void; itemLabel?: string;}) {
  
  const pageNumbers = useMemo(() => {
  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, start + 4);
  
  for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  }, [page, totalPages]);
  if (totalPages <= 1) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="flex items-center justify-center gap-2 mt-10">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
          <ChevronLeft size={14} /> Prev
        </button>

        <div className="flex items-center gap-1">
          {pageNumbers[0] > 1 && (
            <>
              <button
                onClick={() => onPageChange(1)}
                className="size-9 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200">
                1
              </button>
              {pageNumbers[0] > 2 && (
                <span className="size-9 flex items-center justify-center text-muted-foreground text-sm">…</span>
              )}
            </>
          )}

          {pageNumbers.map((p) => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`size-9 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                p === page ? "" : "border-border bg-card font-medium text-muted-foreground hover:border-primary/50 hover:text-primary"
              }`}
              style={
                p === page
                  ? { backgroundColor: "var(--primary)", borderColor: "var(--primary)", color: "white" }
                  : {}
              }> {p}
            </button>
          ))}

          {pageNumbers[pageNumbers.length - 1] < totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                <span className="size-9 flex items-center justify-center text-muted-foreground text-sm">…</span>
              )}
              <button
                onClick={() => onPageChange(totalPages)}
                className="size-9 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-200">
                {totalPages}
              </button>
            </>
          )}
        </div>

        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-card text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200">
          Next <ChevronRight size={14} />
        </button>
      </motion.div>

      <p className="text-center text-xs text-muted-foreground mt-3">
        Page {page} of {totalPages} · {totalCount} {itemLabel}
      </p>
    </>
  );
}
