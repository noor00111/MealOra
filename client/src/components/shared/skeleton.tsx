import { cn } from "cn";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("bg-muted animate-pulse rounded", className)} />;
}

export function ListRowSkeleton({count = 4, avatarSize = "size-11", avatarRadius = "rounded-xl", lines = 2, trailingValue = true} : {count?: number; avatarSize?: string; avatarRadius?: string; lines?: number; trailingValue?: boolean;}) {
  
  return (
    <div className="rounded-2xl border border-border overflow-hidden divide-y divide-border">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4">
          <Skeleton className={cn(avatarRadius, "shrink-0", avatarSize)} />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-2/5" />
            {lines > 1 && <Skeleton className="h-2.5 w-3/5" />}
            {lines > 2 && <Skeleton className="h-2 w-1/3 mt-2" />}
          </div>
          {trailingValue && <Skeleton className="h-3 w-12" />}
        </div>
      ))}
    </div>
  );
}

export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden bg-card"
          style={{ boxShadow: "0 2px 12px 0 rgba(74,140,63,0.06)" }}>
          <Skeleton className="aspect-[4/3] rounded-none" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-4 w-44" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProfilePageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-10 space-y-4">
      <Skeleton className="h-64 rounded-2xl" />
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-80" />
      <div className="space-y-2 mt-6">
        {Array.from({ length: rows }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-4 md:px-6 py-8">
      <Skeleton className="h-5 w-24 mb-8" />
      <div className="grid md:grid-cols-[420px_1fr] gap-8 items-start">
        <Skeleton className="aspect-[4/3] md:aspect-[5/6] rounded-3xl" />
        <div className="space-y-4 py-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-12 w-36 rounded-2xl mt-4" />
          <Skeleton className="h-10 w-40 rounded-full mt-2" />
        </div>
      </div>
    </div>
  );
}
