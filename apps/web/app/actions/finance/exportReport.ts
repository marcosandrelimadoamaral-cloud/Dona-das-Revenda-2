'use server'

import { createClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'

export async function exportReport(period: 'this_month' | 'last_3_months' | 'this_year' = 'this_month') {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            throw new Error('Usuário não autenticado')
        }

        const now = new Date()
        let startDate = new Date()

        if (period === 'this_month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1)
        } else if (period === 'last_3_months') {
            startDate = new Date(now.getFullYear(), now.getMonth() - 2, 1)
        } else if (period === 'this_year') {
            startDate = new Date(now.getFullYear(), 0, 1)
        }

        // Buscar Vendas com Join dos itens e cliente
        const { data: sales, error } = await supabase
            .from('sales')
            .select(`
        id,
        sale_date,
        total_amount,
        payment_method,
        status,
        is_fiado,
        items,
        clients ( name )
      `)
            .eq('user_id', user.id)
            .gte('sale_date', startDate.toISOString())
            .order('sale_date', { ascending: false })

        if (error) throw error

        if (!sales || sales.length === 0) {
            // Return an empty-data file with a notice row
            const ws = XLSX.utils.json_to_sheet([{ 'Aviso': 'Nenhuma venda encontrada para este período.' }])
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, ws, 'Vendas')
            const uint8 = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Uint8Array
            const base64 = Buffer.from(uint8).toString('base64')
            return {
                success: true,
                fileName: `relatorio-donadarevenda-${now.getMonth() + 1}-${now.getFullYear()}.xlsx`,
                fileBase64: base64,
            }
        }

        // Buscar produtos para pegar os custos
        const { data: userProducts } = await supabase
            .from('user_products')
            .select('id, purchase_price')
            .eq('user_id', user.id)

        const productCostsMap = new Map<string, number>(
            (userProducts || []).map((p: any) => [p.id, p.purchase_price])
        )

        // Transformar dados para tabela Excel
        const excelData = sales.map((sale: any) => {
            const saleItems = sale.items && Array.isArray(sale.items) ? sale.items : []

            // Concatenar nome dos produtos
            const productsNames = saleItems.map((item: any) =>
                `${item.qty}x ${item.product_name || 'Produto Removido'}`
            ).join(', ')

            // Calcular custo e lucro desta venda
            let custo = 0
            saleItems.forEach((item: any) => {
                const cp = productCostsMap.get(item.product_id) || 0
                custo += (cp * item.qty)
            })
            const lucro = sale.total_amount - custo

            const formatBRL = (val: number) => val.toFixed(2).replace('.', ',')

            return {
                'Data da Venda': new Date(sale.sale_date).toLocaleDateString('pt-BR'),
                'Cliente': (sale.clients as any)?.name || 'Venda Avulsa / Sem Cliente',
                'Produtos': productsNames,
                'Valor Total (R$)': formatBRL(sale.total_amount),
                'Custo (R$)': formatBRL(custo),
                'Lucro Bruto (R$)': formatBRL(lucro),
                'Método de Pagamento': sale.payment_method?.toUpperCase() || 'N/A',
                'Status': sale.status === 'paid' ? 'PAGO' : sale.status === 'pending' ? 'PENDENTE/FIADO' : 'CANCELADO',
                'É Fiado?': sale.is_fiado ? 'Sim' : 'Não'
            }
        })

        // Criar Workbook
        const worksheet = XLSX.utils.json_to_sheet(excelData)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Vendas')

        // Ajustar largura das colunas
        worksheet['!cols'] = [
            { wch: 15 }, // Data
            { wch: 25 }, // Cliente
            { wch: 40 }, // Produtos
            { wch: 15 }, // Valor
            { wch: 15 }, // Custo
            { wch: 15 }, // Lucro
            { wch: 20 }, // Metodo
            { wch: 15 }, // Status
            { wch: 10 }  // Fiado
        ]

        // Gerar buffer em Node.js e converter para base64 de forma confiável
        const uint8Array = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' }) as Uint8Array
        const base64Data = Buffer.from(uint8Array).toString('base64')

        return {
            success: true,
            fileName: `relatorio-donadarevenda-${now.getMonth() + 1}-${now.getFullYear()}.xlsx`,
            fileBase64: base64Data
        }

    } catch (error) {
        console.error('Erro ao exportar:', error)
        return { success: false, error: `Erro ao gerar relatório: ${(error as Error).message}` }
    }
}
