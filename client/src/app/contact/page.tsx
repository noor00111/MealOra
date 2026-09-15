"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Phone, MapPin, Check, Send } from "lucide-react";

const subjects = [
  "General Enquiry",
  "Order Issue",
  "Become a Chef Partner",
  "Feedback & Suggestions",
  "Media & Press",
  "Other",
];

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    primary: "hello@mealora.com",
    secondary: "We reply within 24 hours.",
  },
  {
    icon: Phone,
    label: "Call Us",
    primary: "+880 1XXXXXXXXX",
    secondary: "Mon – Fri, 9am – 6pm (BDT)",
  },
  {
    icon: MapPin,
    label: "Our Location",
    primary: "Chittagong, Bangladesh",
    secondary: "123 Foodie Street, Green Road, Chittagong 1205",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setSending(true);
    setTimeout(() => {
      setSending(false);
      setSent(true);
    }, 1200);
  }

  return (
    <div className="overflow-x-hidden">
      <div className="py-16 md:py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
            className="mb-4">
            <span
              className="text-[10px] font-black tracking-[0.18em] px-3 py-1.5 rounded-full"
                style={{ backgroundColor: "rgba(74,140,63,0.1)", color: "var(--primary)" }}>
              GET IN TOUCH
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.08 }}
            className="text-4xl md:text-5xl font-bold leading-tight text-foreground"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
            We&apos;d Love to<br />Hear From{" "}
            <em className="not-italic">You.</em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.18 }}
            className="mt-5 text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
            Have a question, feedback, or just want to say hi? Our team is here
            to help. Fill out the form or reach us through the details below.
          </motion.p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-14 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-10 md:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            <h2
              className="text-2xl font-bold text-foreground mb-1"
              style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
              Send Us a Message
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              We&apos;ll get back to you as soon as possible.
            </p>

            <AnimatePresence mode="wait">
              {sent ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center text-center py-14 gap-4">
                  
                  <div
                    className="size-16 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "rgba(22,163,74,0.12)" }}>
                    <Check size={28} className="text-emerald-600" />
                  </div>
                  <h3
                    className="text-xl font-bold text-foreground"
                    style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
                    Message sent!
                  </h3>
                  <p className="text-sm text-muted-foreground max-w-xs">
                    Thanks for reaching out. We&apos;ll reply to{" "}
                    <span className="font-semibold text-foreground">{form.email}</span> within 24 hours.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="mt-2 text-sm font-semibold text-primary hover:underline">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      
                      <label className="text-xs font-semibold text-foreground">
                        Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        required
                        className="h-11 px-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-foreground">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        required
                        className="h-11 px-4 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Subject <span className="text-destructive">*</span>
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="h-11 px-4 rounded-xl border border-border bg-card text-sm text-foreground outline-none focus:border-primary/60 transition-colors appearance-none">
                      <option value="">Select a subject</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-foreground">
                      Message <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help you?"
                      required
                      rows={5}
                      className="px-4 py-3 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/60 transition-colors resize-none"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={sending}
                    whileHover={!sending ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!sending ? { scale: 0.97 } : {}}
                    className="self-start inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-bold text-white transition-all duration-200 disabled:opacity-70"
                    style={{
                      backgroundColor: "var(--primary)",
                      boxShadow: "0 4px 18px 0 rgba(74,140,63,0.3)",
                    }}>
                    <Send size={14} />
                    {sending ? "Sending…" : "Send Message"}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="flex flex-col gap-4">

            {contactInfo.map((info, i) => (
              <motion.div
                key={info.label}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 + i * 0.08, duration: 0.38 }}
                className="flex items-start gap-4 p-4 rounded-2xl border border-border bg-card"
                style={{ boxShadow: "0 2px 10px 0 rgba(74,140,63,0.05)" }}>
                
                <div
                  className="size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: "rgba(74,140,63,0.1)" }}>
                  <info.icon size={16} style={{ color: "var(--primary)" }} />
                </div>
                <div>
                  <p className="text-xs font-black tracking-wide text-muted-foreground uppercase mb-0.5">
                    {info.label}
                  </p>
                  <p className="text-sm font-bold text-foreground">{info.primary}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{info.secondary}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="py-14 px-4 text-center"
        style={{ backgroundColor: "rgba(74,140,63,0.05)" }}>
        <motion.p
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold italic text-foreground"
          style={{ fontFamily: "var(--font-playfair),Georgia,serif" }}>
          &ldquo;Good food is always a good idea.&rdquo;
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.28 }}
          className="text-xs text-muted-foreground mt-3">
          — MealOra
        </motion.p>
      </div>
    </div>
  );
}
