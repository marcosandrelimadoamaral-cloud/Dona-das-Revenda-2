"use server"

import { createClient } from '@/lib/supabase/server'
import { asaasRequest } from '@/lib/asaas'

export async function createAsaasCheckout(planType: 'monthly' | 'quarterly' | 'annual') {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, error: "Usuário não autenticado." }
        }

        const email = user.email
        const name = user.user_metadata?.name || "Cliente"
        let asaasCustomerId = ""

        // 1. Check if Customer already exists precisely by email in Asaas
        const searchCustomer = await asaasRequest('GET', `/customers?email=${email}`)
        if (searchCustomer && searchCustomer.data && searchCustomer.data.length > 0) {
            asaasCustomerId = searchCustomer.data[0].id
        } else {
            // Create a new Customer in Asaas
            const newCustomer = await asaasRequest('POST', '/customers', {
                name: name,
                email: email,
                externalReference: user.id
            })
            if (!newCustomer || !newCustomer.id) {
                return { success: false, error: "Falha ao registrar cliente no gateway financeiro." }
            }
            asaasCustomerId = newCustomer.id
        }

        // 2. Set pricing and installment rules based on selection
        let value = 0
        let description = ""
        let isAnnual = false

        switch (planType) {
            case 'monthly':
                value = 97.00
                description = "Assinatura O Cauteloso - 30 Dias"
                break
            case 'quarterly':
                value = 261.00
                description = "Assinatura O Equilíbrio - 90 Dias"
                break
            case 'annual':
                value = 570.00
                description = "Assinatura VIP Anual - 365 Dias"
                isAnnual = true
                break
            default:
                return { success: false, error: "Plano inválido." }
        }

        // 3. Create a Payment Link (Payment Link allows Pix, Boleto, and Installments natively on Asaas checkout UI)
        // Set dueDate to today (or 3 days from now for boleto)
        const today = new Date()
        today.setDate(today.getDate() + 3)
        const dueDateString = today.toISOString().split('T')[0]

        // Create the direct charge
        const payload: any = {
            customer: asaasCustomerId,
            billingType: 'UNDEFINED', // Allows customer to choose Credit Card, Boleto, or Pix
            value: value,
            dueDate: dueDateString,
            description: description,
            externalReference: user.id, // VITAL for webhook processing
        }

        // Se for o plano anual, nós permitimos o parcelamento em até 12x SEM juros PELA ASAAS.
        if (isAnnual) {
            payload.installmentCount = 12
            payload.installmentValue = Number((value / 12).toFixed(2))
        }

        // Asaas doesn't immediately give a checkout URL for a single dynamic charge with all methods unless we use Payment Links or specifically fetch the invoiceUrl.
        const charge = await asaasRequest('POST', '/payments', payload)

        if (!charge || !charge.invoiceUrl) {
            console.error("Erro na carga Asaas:", charge)
            return { success: false, error: "Falha ao criar cobrança no gateway financeiro." }
        }

        return { success: true, url: charge.invoiceUrl }
    } catch (error: any) {
        console.error("Erro no createAsaasCheckout:", error)
        return { success: false, error: error.message || "Erro interno ao conectar com a operadora." }
    }
}
