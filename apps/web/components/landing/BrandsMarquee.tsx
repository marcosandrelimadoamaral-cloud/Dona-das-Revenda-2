"use client"

import { motion } from "framer-motion"

const BRANDS = ["Natura", "Avon", "O Boticário", "Mary Kay", "Eudora", "Jequiti", "Hinode", "Racco", "Yanbal", "Multimarcas"]

export function BrandsMarquee() {
  return (
    <section className="py-12 bg-white dark:bg-card overflow-hidden border-y border-border">
      <div className="container mx-auto px-4 mb-8 text-center">
        <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
          Gerencie todas as suas marcas em um único lugar
        </p>
      </div>

      <div className="relative flex overflow-x-hidden">
        <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white dark:from-card to-transparent z-10" />
        <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white dark:from-card to-transparent z-10" />

        <motion.div
          className="flex whitespace-nowrap py-4"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
        >
          {/* Lista duplicada para o loop ficar contínuo */}
          {[...BRANDS, ...BRANDS].map((brand, i) => (
            <div key={i} className="flex items-center justify-center min-w-[120px] pr-16">
              <h3 className="text-2xl font-bold text-brand-vinho dark:text-brand-quartzo opacity-50 hover:opacity-100 hover:text-brand-grena dark:hover:text-brand-quartzo transition-all duration-300">
                {brand}
              </h3>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
