import { ChatInterface } from "./ChatInterface"
import { getAiSettings } from "@/app/actions/ai/aiSettings"

export const metadata = {
  title: "Central de IA | Dona da Revenda",
}

export default async function AiCentralPage() {
  const settings = await getAiSettings()

  return (
    <div className="flex flex-col h-[calc(100vh-2rem)] bg-white dark:bg-gray-900 rounded-xl shadow-sm border overflow-hidden">
      <ChatInterface settings={settings} />
    </div>
  )
}
