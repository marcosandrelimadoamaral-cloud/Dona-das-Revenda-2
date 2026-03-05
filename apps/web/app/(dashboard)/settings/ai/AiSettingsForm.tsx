"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { updateAiSettings } from "@/app/actions/ai/aiSettings"
import { Save, Loader2, Sparkles, UserRound, Store, Users, Sliders, Volume2, Zap, Heart, MessageCircle, Clock } from "lucide-react"

const TONE_OPTIONS = [
    { value: 'amigavel', label: '😊 Amigável', desc: 'Calorosa, próxima e encorajadora' },
    { value: 'profissional', label: '💼 Profissional', desc: 'Clara, direta e respeitosa' },
    { value: 'descontraida', label: '🎉 Descontraída', desc: 'Informal, com bom humor e leveza' },
    { value: 'motivacional', label: '🚀 Motivacional', desc: 'Energética, inspiradora e positiva' },
]

const STYLE_OPTIONS = [
    { value: 'detalhado', label: '📖 Detalhado', desc: 'Explicações completas com contexto' },
    { value: 'objetivo', label: '⚡ Objetivo', desc: 'Respostas curtas e diretas ao ponto' },
    { value: 'exemplos', label: '💡 Com exemplos', desc: 'Sempre ilustra com exemplos práticos' },
    { value: 'listas', label: '📋 Organizado em listas', desc: 'Prefere bullet points e listas' },
]

export function AiSettingsForm({ initialData }: { initialData: any }) {
    const [loading, setLoading] = useState(false)
    const prefs = (() => {
        try { return JSON.parse(initialData?.persona_preferences || '{}') } catch { return {} }
    })()

    const [selectedTone, setSelectedTone] = useState<string>(prefs.tone || 'amigavel')
    const [selectedStyle, setSelectedStyle] = useState<string>(prefs.style || 'objetivo')
    const [useEmoji, setUseEmoji] = useState<boolean>(prefs.use_emoji !== undefined ? prefs.use_emoji : true)
    const [greeting, setGreeting] = useState<string>(prefs.greeting || '')

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setLoading(true)

        const formData = new FormData(e.currentTarget)
        // Append persona preferences as JSON
        formData.set('persona_preferences', JSON.stringify({
            tone: selectedTone,
            style: selectedStyle,
            use_emoji: useEmoji,
            greeting: greeting,
        }))

        const res = await updateAiSettings(formData)

        if (res.error) {
            toast.error(res.error)
        } else {
            toast.success("Configurações de IA salvas!")
        }

        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
            {/* Info banner */}
            <div className="bg-purple-50 dark:bg-purple-950/30 p-4 rounded-xl flex items-start gap-3 border border-purple-100 dark:border-purple-900">
                <Sparkles className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                <div className="text-sm text-purple-900 dark:text-purple-300">
                    <p className="font-semibold">Como isso funciona?</p>
                    <p className="mt-1 opacity-80">Estas configurações moldam a personalidade dos 5 Agentes de IA. Quanto mais você personalizar, mais natural e humana será a conversa.</p>
                </div>
            </div>

            {/* Basic Info */}
            <div className="space-y-5">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <UserRound className="w-4 h-4" /> Informações Básicas
                </h3>
                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <label htmlFor="user_name" className="text-sm font-medium flex items-center gap-2">
                            <UserRound className="w-4 h-4 text-muted-foreground" />
                            Como a IA deve te chamar?
                        </label>
                        <Input
                            id="user_name"
                            name="user_name"
                            defaultValue={initialData?.user_name || ""}
                            placeholder="Ex: Maria, Mari, Dona Maria..."
                            required
                            className="max-w-sm"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="store_name" className="text-sm font-medium flex items-center gap-2">
                            <Store className="w-4 h-4 text-muted-foreground" />
                            Nome do seu Espaço / Loja
                        </label>
                        <Input
                            id="store_name"
                            name="store_name"
                            defaultValue={initialData?.store_name || ""}
                            placeholder="Ex: Espaço Maria Flor, Beauty Cosméticos..."
                            className="max-w-sm"
                        />
                    </div>

                    <div className="grid gap-2">
                        <label htmlFor="target_audience" className="text-sm font-medium flex items-center gap-2">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            Quem é o seu público principal?
                        </label>
                        <Textarea
                            id="target_audience"
                            name="target_audience"
                            defaultValue={initialData?.target_audience || ""}
                            placeholder="Ex: Mulheres de 30 a 50 anos que adoram maquiagem, mães que buscam praticidade..."
                            className="h-20 resize-none"
                        />
                        <p className="text-xs text-muted-foreground">Ajuda a Clara (IA de Marketing) a ajustar a linguagem dos posts.</p>
                    </div>
                </div>
            </div>

            {/* Persona Preferences */}
            <div className="space-y-5 pt-2 border-t dark:border-gray-800">
                <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2 pt-4">
                    <Sliders className="w-4 h-4" /> Personalidade das IAs
                </h3>
                <p className="text-sm text-muted-foreground -mt-2">Escolha como quer que as IAs se comuniquem com você.</p>

                {/* Tom */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Volume2 className="w-3.5 h-3.5 text-muted-foreground" /> Tom de Comunicação
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {TONE_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setSelectedTone(opt.value)}
                                className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedTone === opt.value
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                                    }`}
                            >
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold ${selectedTone === opt.value ? 'text-purple-700 dark:text-purple-300' : ''}`}>{opt.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                                </div>
                                {selectedTone === opt.value && (
                                    <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Estilo */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-muted-foreground" /> Estilo de Resposta
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {STYLE_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => setSelectedStyle(opt.value)}
                                className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${selectedStyle === opt.value
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/30'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-900'
                                    }`}
                            >
                                <div className="flex-1">
                                    <p className={`text-sm font-semibold ${selectedStyle === opt.value ? 'text-purple-700 dark:text-purple-300' : ''}`}>{opt.label}</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">{opt.desc}</p>
                                </div>
                                {selectedStyle === opt.value && (
                                    <div className="w-4 h-4 rounded-full bg-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Emoji toggle */}
                <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
                    <Heart className="w-4 h-4 text-pink-500 shrink-0 mt-1" />
                    <div className="flex-1">
                        <p className="text-sm font-semibold">Usar emojis nas respostas?</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Deixa o tom mais expressivo e divertido</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setUseEmoji(!useEmoji)}
                        className={`relative w-10 h-6 rounded-full transition-colors shrink-0 ${useEmoji ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'}`}
                    >
                        <span className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all ${useEmoji ? 'left-5' : 'left-1'}`} />
                    </button>
                </div>

                {/* Greeting message */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        <MessageCircle className="w-3.5 h-3.5 text-muted-foreground" />
                        Frase de Saudação Preferida
                        <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
                    </label>
                    <Input
                        value={greeting}
                        onChange={e => setGreeting(e.target.value)}
                        placeholder='Ex: "Olá linda! Vamos arrasar nas vendas hoje?" 💪'
                        className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">A IA vai usar essa frase para te cumprimentar nas conversas.</p>
                </div>
            </div>

            <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={loading} className="gap-2 bg-purple-600 hover:bg-purple-700 rounded-xl h-11 px-6">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {loading ? "Salvando..." : "Salvar Configurações"}
                </Button>
            </div>
        </form>
    )
}
