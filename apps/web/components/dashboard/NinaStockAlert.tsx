import { createClient } from "@/lib/supabase/server"
import { AlertCircle, PackageOpen, Sparkles } from "lucide-react"

export async function NinaStockAlert() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Get products with stock below minimum
    // Note: Postgrest doesn't support comparing two columns directly with simple operators in JS client filter (like stock_quantity <= min_stock).
    // So we fetch all and filter in memory, or we can use a raw SQL RPC. Given typical limits, doing it in memory is fine for small inv.
    const { data: items } = await supabase
        .from('user_products')
        .select('id, custom_name, current_stock, min_stock_alert')
        .eq('user_id', user.id)

    const lowStockItems = (items || []).filter(item => {
        const minStock = item.min_stock_alert ?? 5
        return item.current_stock <= minStock
    })

    if (lowStockItems.length === 0) {
        return (
            <div className="bg-white dark:bg-gray-950 border rounded-3xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                        <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-lg text-emerald-900 dark:text-emerald-400">Nina Informa</h3>
                        <p className="text-xs text-gray-500">Seu estoque está sob controle!</p>
                    </div>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 relative">
                    &quot;Nenhum produto está abaixo do limite mínimo definido. Ótimo trabalho revendedora!&quot;
                </p>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-500 flex items-center justify-center border border-amber-200 dark:border-amber-800">
                    <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="font-semibold text-lg text-amber-900 dark:text-amber-400">Atenção ao Estoque</h3>
                    <p className="text-xs text-amber-700/70 dark:text-amber-500/70">Nina identificou {lowStockItems.length} alertas</p>
                </div>
            </div>

            <p className="text-sm text-amber-800 dark:text-amber-300 relative mb-4">
                &quot;Notei que alguns dos seus itens estão com poucas unidades. Aqui está o que você precisa ficar de olho para não perder vendas:&quot;
            </p>

            <div className="space-y-3 max-h-48 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-amber-200">
                {lowStockItems.slice(0, 5).map(item => (
                    <div key={item.id} className="flex items-center justify-between text-sm bg-white/50 dark:bg-black/20 p-2 rounded-lg border border-amber-100 dark:border-amber-900/30">
                        <div className="flex items-center gap-2 overflow-hidden flex-1 mr-2">
                            <PackageOpen className="w-4 h-4 text-amber-600/70 flex-shrink-0" />
                            <span className="font-medium text-amber-900 dark:text-amber-100 truncate">{item.custom_name || 'Produto sem nome'}</span>
                        </div>
                        <span className="font-bold text-red-600 dark:text-red-400 flex-shrink-0">
                            {item.current_stock} un
                        </span>
                    </div>
                ))}
            </div>
            {lowStockItems.length > 5 && (
                <p className="text-xs text-amber-600 text-center mt-3 pt-2 border-t border-amber-200/50">
                    E outros {lowStockItems.length - 5} produtos. Acesse o Estoque para conferir tudo.
                </p>
            )}
        </div>
    )
}
