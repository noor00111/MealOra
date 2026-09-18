import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { statusColor } from "@/lib/order-status";
import type { AdminOrder } from "@/types/admin";

export function RecentOrdersTable({ orders }: { orders: AdminOrder[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}
      className="rounded-2xl bg-card overflow-hidden mb-6"
      style={{ boxShadow: "0 2px 12px 0 rgba(0,0,0,0.05)" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
        <h2 className="text-sm font-bold text-foreground">Recent Orders</h2>
        <Link href="/admin/orders" className="text-xs font-bold flex items-center gap-1 hover:underline" style={{ color: "var(--primary)" }}>
          View all <ArrowRight size={11} />
        </Link>
      </div>

      <div className="grid grid-cols-[1fr_1fr_80px_100px_90px] gap-4 px-5 py-2.5 border-b border-border/40">
        {["ORDER ID", "CUSTOMER", "TOTAL", "STATUS", "DATE"].map((h) => (
          <p key={h} className="text-[9px] font-black tracking-[0.14em] text-muted-foreground uppercase">{h}</p>
        ))}
      </div>

      <div className="divide-y divide-border/40">
        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground px-5 py-6">No orders yet.</p>
        )}
        
        {orders.map((order) => {
          const color = statusColor[order.status] ?? "#9ca3af";
          const date  = new Date(order.createdAt);
          const dateStr = date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
          const timeStr = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
          return (
            <div key={order.id} className="grid grid-cols-[1fr_1fr_80px_100px_90px] gap-4 px-5 py-3.5 hover:bg-muted/30 transition-colors items-center">
              <span className="text-xs font-black font-mono text-foreground tracking-wider">
                #{order.id.slice(-8).toUpperCase()}
              </span>

              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="size-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: "rgba(150,167,141,0.1)", color: "var(--primary)" }}>
                  {order.customer.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-foreground truncate">{order.customer.name}</span>
              </div>

              <span className="text-sm font-bold tabular-nums text-foreground">${order.totalAmount}</span>

              <span
                className="text-[10px] font-black tracking-wide px-2.5 py-1 rounded-full w-fit"
                style={{ backgroundColor: `${color}15`, color }}>
                {order.status}
              </span>

              <div className="text-right">
                <p className="text-xs text-foreground font-medium">{dateStr}</p>
                <p className="text-[10px] text-muted-foreground">{timeStr}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
