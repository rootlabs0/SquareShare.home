"use client";

import { motion } from "framer-motion";
import { Puzzle, Zap, Rocket, BarChart3, Palette, ShieldCheck } from "lucide-react";

interface BentoCardProps {
  title: string;
  description: string;
  className?: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

function BentoCard({ title, description, className = "", icon, children }: BentoCardProps) {
  return (
    <motion.div
      className={`relative bg-white border border-neutral-200 rounded-none p-6 md:p-8 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] hover:border-neutral-400 transition-all duration-500 group overflow-hidden ${className}`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5 }}
    >
      {icon && (
        <div className="mb-4 text-3xl">{icon}</div>
      )}
      <h3 className="text-xl md:text-2xl font-black text-neutral-900 mb-2">
        {title}
      </h3>
      <p className="text-neutral-600 leading-relaxed">{description}</p>
      {children}
    </motion.div>
  );
}

function CodeSnippetPreview() {
  return (
    <div className="mt-6 bg-neutral-950 rounded-xl p-4 font-mono text-sm overflow-x-auto">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-2 text-neutral-500 text-xs">embed.html</span>
      </div>
      <pre className="text-neutral-400">
        <code>
          <span className="text-purple-400">&lt;script</span>{" "}
          <span className="text-sky-400">src</span>=
          <span className="text-[#ff9900]">&#34;squareshare.to/embed.js&#34;</span>
          <span className="text-purple-400">&gt;&lt;/script&gt;</span>
          {"\n"}
          <span className="text-purple-400">&lt;div</span>{" "}
          <span className="text-sky-400">id</span>=
          <span className="text-[#ff9900]">&#34;sq-store&#34;</span>
          <span className="text-purple-400">&gt;&lt;/div&gt;</span>
        </code>
      </pre>
    </div>
  );
}

export default function BentoGrid() {
  return (
    <section
      id="features"
      className="relative bg-[#F9F9F9] py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="mb-16 md:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-neutral-900 font-mono text-sm tracking-widest uppercase mb-4">
            How It Works
          </p>
          <h2 className="text-4xl md:text-6xl font-black text-neutral-900 leading-tight">
            Your Digital Store Shelf.
            <br />
            <span className="text-neutral-400">Everywhere.</span>
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 auto-rows-[minmax(200px,auto)]">
          {/* Large card - 2x2 */}
          <BentoCard
            className="md:col-span-2 lg:col-span-2 lg:row-span-2"
            title="Embed Anywhere"
            description="Drop a 2-line snippet into any website and watch your store come alive. Blogs, portfolios, landing pages. If it renders HTML, it runs Square Share."
            icon={<Puzzle size={28} className="text-neutral-800" />}
          >
            <CodeSnippetPreview />
          </BentoCard>

          {/* Standard cards - 1x1 */}
          <BentoCard
            className="lg:col-span-1"
            title="Bypass Shopify"
            description="Stop paying 30% platform fees. Generate a snippet, embed it, and own 100% of your customer relationships."
            icon={<Zap size={28} className="text-neutral-800" />}
          />

          <BentoCard
            className="lg:col-span-1"
            title="One-Click Setup"
            description="No coding required. Configure your store, copy the embed code, and go live in under 60 seconds."
            icon={<Rocket size={28} className="text-neutral-800" />}
          />

          {/* Wide card - 2x1 */}
          <BentoCard
            className="md:col-span-2"
            title="Real-Time Analytics"
            description="Track every click, conversion, and customer journey across all your embedded stores from one dashboard. See what's working and double down."
            icon={<BarChart3 size={28} className="text-neutral-800" />}
          >
            {/* Mini analytics preview */}
            <div className="mt-6 flex items-end gap-2 h-24">
              {[40, 65, 45, 80, 55, 90, 70, 95, 60, 85, 75, 100].map(
                (h, i) => (
                  <motion.div
                    key={i}
                    className="flex-1 bg-neutral-900 rounded-t-sm"
                    style={{ height: `${h}%` }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  />
                )
              )}
            </div>
          </BentoCard>

          {/* Standard card - 1x1 */}
          <BentoCard
            className="lg:col-span-1"
            title="Custom Branding"
            description="Your store, your brand. Full control over colors, fonts, and layout. No forced watermarks."
            icon={<Palette size={28} className="text-neutral-800" />}
          />

          {/* Standard card - 1x1 */}
          <BentoCard
            className="lg:col-span-1"
            title="Secure Payments"
            description="PCI-compliant checkout powered by Stripe. Your customers pay securely, you get paid instantly."
            icon={<ShieldCheck size={28} className="text-neutral-800" />}
          />
        </div>
      </div>
    </section>
  );
}
