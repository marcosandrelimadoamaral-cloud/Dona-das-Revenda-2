import { ChatInterface } from "./ChatInterface"
import { getAiSettings } from "@/app/actions/ai/aiSettings"

export const metadata = {
  title: "Central de IA | Dona da Revenda",
}

export default async function AiCentralPage() {
  const settings = await getAiSettings()

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] lg:h-[calc(100vh-7rem)] bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
      <ChatInterface settings={settings} />
    </div>
  )
}
