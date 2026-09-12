import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronRight, ArrowRight, Clock } from "lucide-react";
import { fadeUp } from "@/lib/motion";
import { timeAgo } from "@/lib/format";
import { ProviderOrder, Order, OrderStatus } from "@/types/order";

export function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export const STATUS_STYLE: Record<OrderStatus, { label: string; cls: string }> = {
  PLACED:    { label: "New",       cls: "bg-orange-100 text-orange-700" },
  PREPARING: { label: "Preparing", cls: "bg-blue-100 text-blue-700" },
  READY:     { label: "Ready",     cls: "bg-green-100 text-green-700" },
  DELIVERED: { label: "Delivered", cls: "bg-gray-100 text-gray-600" },
  CANCELLED: { label: "Cancelled", cls: "bg-red-100 text-red-600" },
};

export function StatCard({
  icon, value, label, href,
}: { icon: React.ReactNode; value: string | number; label: string; href?: string }) {
  return (
    <motion.div variants={fadeUp} className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="size-11 rounded-xl bg-brand-green/10 flex items-center justify-center text-brand-green">
          {icon}
        </div>
        {href && (
          <Link href={href} className="size-7 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors">
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

export function OrderRow({ order, showCustomer }: { order: ProviderOrder | Order; showCustomer?: boolean }) {
  const firstItem = order.items[0];
  const st = STATUS_STYLE[order.status];
  return (
    <Link
      href={`/provider/orders`}
      className="flex items-center gap-3 py-3 px-1 border-b border-border/50 last:border-0 hover:bg-muted/30 rounded-lg transition-colors group">
      <div className="relative size-11 rounded-xl overflow-hidden bg-muted shrink-0">
        {firstItem?.meal.imageUrl ? (
          <Image src={firstItem.meal.imageUrl} alt={firstItem.meal.name} fill className="object-cover" sizes="44px" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xl">🍽</div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-foreground truncate">{firstItem?.meal.name ?? "Order"}</p>
        {showCustomer && "customer" in order && (
          <p className="text-xs text-muted-foreground mt-0.5">by {order.customer.name}</p>
        )}
      </div>
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${st.cls}`}>{st.label}</span>
      <div className="text-right shrink-0 ml-1">
        <p className="text-sm font-semibold text-foreground">${order.totalAmount}</p>
        <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 justify-end">
          <Clock size={9} />{timeAgo(order.createdAt)}
        </p>
      </div>
      <ChevronRight size={14} className="text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
    </Link>
  );
}
