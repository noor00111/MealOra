import Link from "next/link";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { UtensilsCrossed, ShoppingBag, DollarSign, Users, ArrowRight } from "lucide-react";
import { fetchAdminOrders, fetchAdminUsers } from "@/lib/admin-api";
import { ProviderOrder } from "@/types/order";
import { fadeUp, staggerContainer } from "@/lib/motion";
import { getGreeting, OrderRow, StatCard } from "@/components/dashboard/shared";

export function AdminDashboard({ name }: { name: string }) {
  const { data: users = [] } = useQuery({ queryKey: ["admin-users"], queryFn: fetchAdminUsers, staleTime: 60000 });
  const { data: orders = [] } = useQuery({ queryKey: ["admin-orders"], queryFn: fetchAdminOrders, staleTime: 30000 });

  const customers = users.filter(u => u.role === "CUSTOMER");
  const providers = users.filter(u => u.role === "PROVIDER");
  const revenue = orders.filter(o => o.status !== "CANCELLED").reduce((s, o) => s + parseFloat(o.totalAmount), 0);
  const recent = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  return (
    <motion.div initial="hidden" animate="show" variants={staggerContainer} className="max-w-7xl mx-auto px-4 md:px-6 py-6 space-y-6">
      <motion.div variants={fadeUp} className="relative overflow-hidden rounded-3xl border border-border min-h-[260px] md:min-h-[300px]">
        <Image src="/images/dashboardImg.png" alt="" fill className="object-cover object-center" sizes="100vw" priority />
        <div className="absolute inset-0" style={{ background: "linear-gradient(100deg, rgba(15,35,24,0.82) 0%, rgba(15,35,24,0.65) 55%, rgba(15,35,24,0.2) 100%)" }} />
        <div className="relative z-10 px-7 py-10 md:py-14 max-w-lg">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2"
            style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
            {getGreeting()}, <span className="text-[#a8d5a2]">{name}!</span> 🛡️
          </h1>
          <p className="text-white/70 text-sm mb-5">
            Here&apos;s your platform overview. Everything looks healthy.
          </p>
          <div className="flex flex-wrap items-center gap-5 mb-6 text-sm">
            <span className="flex items-center gap-1.5 text-white/90 font-medium"><Users size={14} className="text-[#a8d5a2]" /><strong>{users.length}</strong> Users</span>
            <span className="flex items-center gap-1.5 text-white/90 font-medium"><ShoppingBag size={14} className="text-primary" /><strong>{orders.length}</strong> Orders</span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold bg-primary text-white hover:opacity-90 hover:-translate-y-px transition-all duration-200 shadow-sm">
              <Users size={14} /> Manage Users
            </Link>
            <Link href="/admin/orders" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium border border-white/30 bg-white/10 text-white hover:bg-white/20 transition-all duration-200 backdrop-blur-sm">
              <ShoppingBag size={14} /> All Orders
            </Link>
          </div>
        </div>
      </motion.div>

      <div>
        <motion.h2 variants={fadeUp} className="flex items-center gap-2 text-base font-semibold text-foreground mb-4">
          <span>📊</span> Platform Overview
        </motion.h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatCard icon={<Users size={20} />} value={users.length} label="Total Users" href="/admin/users" />
          <StatCard icon={<UtensilsCrossed size={20} />} value={providers.length} label="Providers" href="/admin/users" />
          <StatCard icon={<ShoppingBag size={20} />} value={orders.length} label="Total Orders" href="/admin/orders" />
          <StatCard icon={<DollarSign size={20} />} value={`$${revenue.toFixed(0)}`} label="Platform Revenue" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-card border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2"><span>📦</span> Recent Orders</h3>
            <Link href="/admin/orders" className="text-xs font-medium text-primary hover:underline flex items-center gap-1">View All <ArrowRight size={11} /></Link>
          </div>
          {recent.length > 0 ? recent.map(o => <OrderRow key={o.id} order={o as unknown as ProviderOrder} showCustomer />) : (
            <div className="py-10 text-center text-muted-foreground text-sm">No orders on the platform yet.</div>
          )}
        </div>
        <div className="rounded-2xl border border-border flex flex-col justify-between p-5 gap-4"
          style={{ background: "linear-gradient(135deg, #f0f7f0 0%, #e8f5e9 100%)" }}>
          <div>
            <p className="text-xs font-bold tracking-widest text-brand-green uppercase mb-2">Platform health</p>
            <p className="font-bold text-lg text-foreground leading-snug" style={{ fontFamily: "var(--font-playfair), Georgia, serif" }}>
              {customers.length} customers trusting {providers.length} local chefs
            </p>
          </div>
          <div className="space-y-2">
            {[
              { label: "Active providers", val: providers.length },
              { label: "Customers served", val: customers.length },
            ].map(({ label, val }) => (
              <div key={label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{label}</span>
                <span className="font-semibold text-foreground">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
