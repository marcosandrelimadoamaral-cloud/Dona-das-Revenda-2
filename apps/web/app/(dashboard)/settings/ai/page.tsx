import { getAiSettings } from "@/app/actions/ai/aiSettings"
import { AiSettingsForm } from "./AiSettingsForm"

export const metadata = {
    title: "Configurações de IA | Dona da Revenda",
}

export default async function AiSettingsPage() {
    const settings = await getAiSettings()

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Configurações de Inteligência Artificial</h1>
                <p className="text-muted-foreground text-sm mt-1">
                    Ajude os agentes da Dona da Revenda a conhecerem melhor você e o seu negócio. Quanto mais detalhes, mais precisas e humanas serão as respostas.
                </p>
            </div>

            <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-2xl shadow-sm p-6">
                <AiSettingsForm initialData={settings} />
            </div>
        </div>
    )
}
