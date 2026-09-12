export function StatusFilterTabs<T extends string>({
  tabs,
  active,
  onChange,
  count,
}: {
  tabs: { value: T; label: string }[];
  active: T;
  onChange: (value: T) => void;
  count: (value: T) => number;
}) {
  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-5">
      {tabs.map((tab) => {
        const c = count(tab.value);
        return (
          <button
            key={tab.value}
            onClick={() => onChange(tab.value)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
              active === tab.value
                ? "bg-foreground text-background border-foreground"
                : "bg-card text-muted-foreground border-border hover:border-foreground/30 hover:text-foreground"
            }`}
          >
            {tab.label}
            {c > 0 && (
              <span className={`ml-1.5 text-[10px] font-bold ${active === tab.value ? "opacity-50" : "text-primary"}`}>
                {c}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
