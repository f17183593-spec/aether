"use client"
import { motion, type Easing } from "framer-motion"
import { ArrowRight, Sparkles, Shield, Truck, Star, Gift } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { getDictionary } from "@/lib/i18n"
import type { Locale } from "@/types"

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const itemAnim = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as Easing } },
}

function BentoItem({
  children,
  className,
  colSpan = "col-span-1",
  rowSpan = "row-span-1",
}: {
  children: React.ReactNode
  className?: string
  colSpan?: string
  rowSpan?: string
}) {
  return (
    <motion.div
      variants={itemAnim}
      className={cn(
        "glass-card rounded-3xl overflow-hidden group",
        colSpan,
        rowSpan,
        className
      )}
    >
      {children}
    </motion.div>
  )
}

const testimonials = [
  { name: "Sofia Chen", role: "Fashion Director", text: "The quality surpassed my expectations. This is not just shopping; it's an experience." },
  { name: "James Al-Rashid", role: "Tech Entrepreneur", text: "ÆTHERIS has completely redefined how I think about online luxury retail." },
  { name: "Amara Okafor", role: "Interior Designer", text: "Every piece feels curated. The attention to detail is extraordinary." },
]

const features = [
  { icon: Truck, title: "Free Express Shipping", desc: "On orders over $200" },
  { icon: Shield, title: "Secure Checkout", desc: "256-bit SSL encryption" },
  { icon: Star, title: "Premium Quality", desc: "Hand-picked excellence" },
  { icon: Gift, title: "Loyalty Rewards", desc: "Earn points every purchase" },
]

export function BentoGrid() {
  const params = useParams()
  const locale = (params.locale as Locale) || "en"
  const dict = getDictionary(locale)

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-6 gap-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      {/* Hero - large top-left */}
      <BentoItem colSpan="md:col-span-2" rowSpan="md:row-span-3" className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-aether-900/40 via-transparent to-pink-900/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-aether-500/10 rounded-full blur-3xl" />
        <div className="relative p-8 lg:p-10 h-full flex flex-col justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-aether-400 bg-aether-500/10 px-3 py-1.5 rounded-full border border-aether-500/20">
              <Sparkles className="w-3 h-3" /> 2026 Collection
            </span>
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight">
              <span className="gradient-text">{dict.home.hero.title}</span>
            </h2>
            <p className="text-gray-400 text-sm lg:text-base leading-relaxed max-w-md">
              {dict.home.hero.subtitle}
            </p>
            <Link href={`/${locale}/products`}>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-white bg-gradient-to-r from-aether-600 to-pink-600 px-6 py-3 rounded-xl hover:shadow-lg hover:shadow-aether-500/25 transition-all duration-300">
                {dict.home.hero.cta} <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>
      </BentoItem>

      {/* Featured Product 1 */}
      <BentoItem rowSpan="md:row-span-2" className="relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-t from-aether-900/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-aether-500/5 via-transparent to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="h-full flex flex-col justify-end p-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-aether-400 font-semibold">New</span>
            <h3 className="text-lg font-semibold">Aether Pulse</h3>
            <p className="text-xs text-gray-400">Smart wellness device</p>
            <p className="text-sm font-bold gradient-text">$299</p>
          </div>
        </div>
      </BentoItem>

      {/* Featured Product 2 */}
      <BentoItem rowSpan="md:row-span-2" className="relative group cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-t from-aether-900/60 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 via-transparent to-aether-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="h-full flex flex-col justify-end p-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-widest text-pink-400 font-semibold">Limited</span>
            <h3 className="text-lg font-semibold">Nebula Series</h3>
            <p className="text-xs text-gray-400">Signature fragrance</p>
            <p className="text-sm font-bold gradient-text">$189</p>
          </div>
        </div>
      </BentoItem>

      {/* Stats / Metrics */}
      <BentoItem colSpan="md:col-span-2" rowSpan="md:row-span-1" className="flex items-center justify-around p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-aether-500/5 via-transparent to-pink-500/5" />
        {[
          { label: "Products", value: "10K+" },
          { label: "Clients", value: "50K+" },
          { label: "Countries", value: "120+" },
          { label: "Rating", value: "4.9" },
        ].map((stat) => (
          <div key={stat.label} className="relative text-center">
            <p className="text-xl lg:text-2xl font-bold gradient-text">{stat.value}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{stat.label}</p>
          </div>
        ))}
      </BentoItem>

      {/* Testimonial */}
      <BentoItem colSpan="md:col-span-2" rowSpan="md:row-span-2" className="p-8 flex flex-col justify-center relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-aether-500/5 rounded-full blur-2xl" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500/5 rounded-full blur-2xl" />
        <div className="relative space-y-4">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-aether-400 text-aether-400" />
            ))}
          </div>
          <p className="text-lg lg:text-xl leading-relaxed text-gray-200 italic">
            &ldquo;{testimonials[0].text}&rdquo;
          </p>
          <div>
            <p className="text-sm font-medium">{testimonials[0].name}</p>
            <p className="text-xs text-gray-500">{testimonials[0].role}</p>
          </div>
        </div>
      </BentoItem>

      {/* Features Grid */}
      {features.map((feature) => (
        <BentoItem key={feature.title} className="p-6 flex flex-col items-center text-center justify-center gap-3">
          <feature.icon className="w-6 h-6 text-aether-400" />
          <div>
            <p className="text-sm font-medium">{feature.title}</p>
            <p className="text-xs text-gray-500 mt-0.5">{feature.desc}</p>
          </div>
        </BentoItem>
      ))}
    </motion.div>
  )
}
