"use client"

import { motion } from "framer-motion"

const BRANDS = [
    "Natura",
    "Avon",
    "O Boticário",
    "Mary Kay",
    "Eudora",
    "Jequiti",
    "Hinode",
    "Racco",
    "Yanbal",
    "Multimarcas"
]

export function BrandsMarquee() {
    return (
        <section className="py-12 bg-white dark:bg-gray-950 overflow-hidden border-b border-gray-100 dark:border-gray-800">
            <div className="container mx-auto px-4 mb-8 text-center">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">
                    Gerencie todas as suas marcas em um único lugar
                </p>
            </div>

            <div className="relative flex overflow-x-hidden">
                <div className="absolute left-0 top-0 w-32 h-full bg-gradient-to-r from-white dark:from-gray-950 to-transparent z-10"></div>
                <div className="absolute right-0 top-0 w-32 h-full bg-gradient-to-l from-white dark:from-gray-950 to-transparent z-10"></div>

                <motion.div
                    className="flex whitespace-nowrap gap-16 py-4"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{
                        repeat: Infinity,
                        ease: "linear",
                        duration: 30,
                    }}
                >
                    {/* Double the array to create a seamless loop */}
                    {[...BRANDS, ...BRANDS].map((brand, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-center min-w-[120px]"
                        >
                            <h3 className="text-2xl font-bold text-gray-400 opacity-60 hover:opacity-100 hover:text-purple-600 transition-all duration-300">
                                {brand}
                            </h3>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
