"use client"

import { useState } from "react"
import { PatternFormat } from "react-number-format"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { completeOnboarding } from "@/app/actions/onboarding/completeOnboarding"
import { Sparkles, ArrowRight, Check } from "lucide-react"
import Image from "next/image"

const AVAILABLE_BRANDS = [
    { id: "natura", label: "Natura" },
    { id: "avon", label: "Avon" },
    { id: "boticario", label: "O Boticário" },
    { id: "marykay", label: "Mary Kay" },
    { id: "eudora", label: "Eudora" },
    { id: "jequiti", label: "Jequiti" },
    { id: "hinode", label: "Hinode" },
    { id: "outras", label: "Outras marcas" },
]

export default function OnboardingPage() {
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isLoading, setIsLoading] = useState(false)

    const [name, setName] = useState("")
    const [whatsapp, setWhatsapp] = useState("")
    const [brands, setBrands] = useState<string[]>([])

    const handleNext = () => setStep(s => s + 1)
    const handlePrev = () => setStep(s => s - 1)

    const toggleBrand = (id: string) => {
        setBrands(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id])
    }

    const handleFinish = async () => {
        setIsLoading(true)
        const res = await completeOnboarding({ fullName: name, whatsapp, brands })
        if (res.success) {
            router.push("/dashboard?welcome=true")
        } else {
            setIsLoading(false)
            alert("Erro ao salvar suas configurações. Tente novamente.")
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-4">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-b from-purple-100 dark:from-purple-950/30 to-transparent rounded-full blur-3xl opacity-50" />
                <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-t from-pink-100 dark:from-pink-950/30 to-transparent rounded-full blur-3xl opacity-50" />
            </div>

            <div className="w-full max-w-2xl">
                {/* Logo */}
                <div className="flex justify-center mb-8">
                    <div className="flex items-center gap-3">
                        <Image src="/logo-transparent.png" alt="Dona da Revenda" width={48} height={48} className="object-contain" />
                        <div className="flex flex-col leading-none">
                            <span className="font-black text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Dona da</span>
                            <span className="font-black text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Revenda</span>
                        </div>
                    </div>
                </div>

                <Card className="border-0 shadow-xl rounded-2xl overflow-hidden bg-white dark:bg-gray-900 backdrop-blur-xl">
                    {/* Progress Bar */}
                    <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800">
                        <div
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 ease-out"
                            style={{ width: `${(step / 2) * 100}%` }}
                        />
                    </div>

                    <CardHeader className="text-center pb-2 pt-8">
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                            {step === 1 && "Bem-vinda à Dona da Revenda!"}
                            {step === 2 && "Quais marcas você revende?"}
                        </CardTitle>
                        <CardDescription className="text-base mt-2 text-gray-600 dark:text-gray-400">
                            {step === 1 && "Vamos configurar seu espaço. Como os clientes devem te chamar?"}
                            {step === 2 && "Sua IA vai montar vitrines exclusivas baseadas nestas marcas."}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8">
                        {step === 1 && (
                            <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-base text-gray-700 dark:text-gray-300">Nome Completo</Label>
                                    <Input
                                        id="name"
                                        placeholder="Ex: Maria Antonieta"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="h-12 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="text-base text-gray-700 dark:text-gray-300">WhatsApp de Vendas</Label>
                                    <PatternFormat
                                        id="whatsapp"
                                        format="(##) #####-####"
                                        mask="_"
                                        placeholder="(00) 00000-0000"
                                        value={whatsapp}
                                        onValueChange={(values: any) => setWhatsapp(values.value)}
                                        customInput={Input}
                                        className="h-12 text-lg bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400">A IA usará este número para processar seus pedidos futuramente.</p>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                                {AVAILABLE_BRANDS.map(brand => {
                                    const isSelected = brands.includes(brand.id)
                                    return (
                                        <div
                                            key={brand.id}
                                            onClick={() => toggleBrand(brand.id)}
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all text-center ${isSelected
                                                ? 'border-purple-600 bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-200 shadow-sm scale-105'
                                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-200 dark:hover:border-purple-700 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                                                }`}
                                        >
                                            <div className={`w-6 h-6 rounded-full border-2 mb-2 flex items-center justify-center transition-colors
                                                ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300 dark:border-gray-600'}`}
                                            >
                                                {isSelected && <Check className="w-4 h-4 text-white" />}
                                            </div>
                                            <span className="font-semibold text-sm text-gray-800 dark:text-gray-200">{brand.label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </CardContent>

                    <CardFooter className="p-8 pt-0 flex justify-between">
                        {step > 1 ? (
                            <Button variant="ghost" onClick={handlePrev} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                Voltar
                            </Button>
                        ) : <div />}

                        {step < 2 ? (
                            <Button
                                onClick={handleNext}
                                disabled={step === 1 && (!name || whatsapp.replace(/\D/g, '').length < 11)}
                                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-8"
                            >
                                Continuar <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleFinish}
                                disabled={isLoading}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-8 shadow-md"
                            >
                                {isLoading ? "Preparando Máquina..." : "Finalizar e Entrar"}
                                {!isLoading && <Sparkles className="w-4 h-4 ml-2" />}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
