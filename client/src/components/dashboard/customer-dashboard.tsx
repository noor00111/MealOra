import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { UtensilsCrossed, ShoppingBag, DollarSign, ArrowRight, Sparkles } from "lucide-react";
import { fetchMyOrders } from "@/lib/order-api";
import { ProviderOrder } from "@/types/order";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { getGreeting, OrderRow, StatCard } from "@/components/dashboard/shared";

export function CustomerDashboard({ name }: { name: string }) {
  const { data: orders = [] } = useQuery({ queryKey: ["my-orders"], queryFn: fetchMyOrders, staleTime: 30000 });

  const active = orders.filter(o => o.status === "PLACED" || o.status === "PREPARING" || o.status === "READY");
  const totalSpent = orders.filter(o => o.status !== "CANCELLED").reduce((s, o) => s + parseFloat(o.totalAmount), 0);
  const recent = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <motion.div initial="hidden" animate="show" variants={staggerContainer} className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border min-h-[260px] md:min-h-[300px]">
        <Image src="/images/dashboardImg.png" alt="" fill className="object-cover object-center" sizes="100vw" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(15,35,24,0.82) 0%, rgba(15,35,24,0.65) 55%, rgba(15,35,24,0.2) 100%)" }} />
        <div className="relative z-10 px-7 py-10 md:py-14 max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            {getGreeting()}, <span className="text-[#a8d5a2]">{name}!</span> 😊
          </h1>
          <p className="text-white/70 text-sm mb-5">
            Discover meals from local chefs delivered fresh to your door.
          </p>
          <div className="flex flex-wrap items-center gap-5 mb-6 text-sm">
            <span className="flex items-center gap-1.5 text-white/90 font-medium"><ShoppingBag size={14} className="text-[#a8d5a2]" /><strong>{orders.length}</strong> Total orders</span>
            <span className="flex items-center gap-1.5 text-white/90 font-medium"><Sparkles size={14} className="text-primary" /><strong>{active.length}</strong> Active</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/meals" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 hover:-translate-y-px transition-all duration-200 shadow-sm">
              <UtensilsCrossed size={14} /> Find Food
            </Link>
            <Link href="/orders" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
              <ShoppingBag size={14} /> My Orders
            </Link>
          </div>
        </div>
      </motion.div>

      <div>
        <motion.h2 variants={fadeUp} className="flex items-center gap-2 text-base font-semibold text-foreground mb-4">
          <span>🛍️</span> Your Order Activity
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<ShoppingBag size={20} />} value={orders.length} label="Total Orders" href="/orders" />
          <StatCard icon={<Sparkles size={20} />} value={active.length} label="Active Orders" href="/orders" />
          <StatCard icon={<DollarSign size={20} />} value={`$${totalSpent.toFixed(2)}`} label="Total Spent" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><span>📦</span> Recent Orders</h3>
            <Link href="/orders" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">View All <ArrowRight size={11} /></Link>
          </div>
          {recent.length > 0 ? recent.map(o => <OrderRow key={o.id} order={o as ProviderOrder} />) : (
            <div className="py-10 text-center text-muted-foreground text-sm">No orders yet — <Link href="/meals" className="text-primary underline">find something delicious!</Link></div>
          )}
        </div>
        <div className="relative overflow-hidden rounded-2xl border border-border flex flex-col items-center justify-center p-6 text-center min-h-[200px]"
          style={{ background: "linear-gradient(135deg, #fff8f0 0%, #fef3e8 100%)" }}>
          <p className="text-foreground font-bold text-lg leading-tight mb-3" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            Hungry? Your next meal is one tap away
          </p>
          <Link href="/meals" className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 transition-all">
            Browse menu <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
