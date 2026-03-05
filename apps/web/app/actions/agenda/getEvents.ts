"use server"

import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, format } from 'date-fns'

export type AgendaEvent = {
    id: string
    date: string
    type: 'birthday' | 'receivable' | 'appointment' | 'reminder'
    title: string
    description?: string
    amount?: number
    clientName?: string
}

export async function getEvents(year?: number, month?: number): Promise<{ success: boolean; data: AgendaEvent[]; error?: string }> {
    try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            return { success: false, data: [], error: "Não autorizado" }
        }

        const events: AgendaEvent[] = []

        // Use provided year/month or default to current local date
        const targetDate = new Date()
        if (year) targetDate.setFullYear(year)
        if (month !== undefined) targetDate.setMonth(month - 1) // JS months are 0-11

        const currentYear = targetDate.getFullYear()

        // Calculate the first and last day of the selected month
        const targetStart = startOfMonth(targetDate)
        const targetEnd = endOfMonth(targetDate)

        const startString = format(targetStart, 'yyyy-MM-dd')
        const endString = format(targetEnd, 'yyyy-MM-dd')

        // 1. Fetch Fiados (Receivables) due in this month
        const { data: fiados, error: fiadosError } = await supabase
            .from('sales')
            .select('id, due_date, total_amount, clients(name)')
            .eq('user_id', user.id)
            .eq('status', 'pending')
            .eq('is_fiado', true)
            .gte('due_date', startString)
            .lte('due_date', endString)

        if (fiadosError) throw fiadosError

        if (fiados) {
            fiados.forEach((f: any) => {
                if (f.due_date) {
                    events.push({
                        id: `fiado-${f.id}`,
                        date: f.due_date,
                        type: 'receivable',
                        title: `Receber de ${f.clients?.name || 'Cliente'}`,
                        amount: f.total_amount,
                        clientName: f.clients?.name
                    })
                }
            })
        }

        // 2. Fetch Birthdays (Clients) born in this month
        // Assumes birth_date is stored as YYYY-MM-DD. So we look for %-MM-%
        const monthString = month !== undefined ? String(month).padStart(2, '0') : format(targetDate, 'MM')

        const { data: clients, error: clientsError } = await supabase
            .from('clients')
            .select('id, name, birth_date')
            .eq('user_id', user.id)
            .not('birth_date', 'is', null)
            .like('birth_date', `%-${monthString}-%`)

        if (clientsError && clientsError.code !== 'PGRST116') {
            console.error("Error fetching clients:", clientsError)
        }

        if (clients) {
            clients.forEach((c: any) => {
                if (c.birth_date && c.birth_date.trim() !== "") {
                    const parts = c.birth_date.split('-')
                    if (parts.length === 3) {
                        const m = parts[1]
                        const d = parts[2]
                        if (m === monthString) {
                            const currentYearBirthday = `${currentYear}-${m}-${d}`
                            events.push({
                                id: `bday-${c.id}`,
                                date: currentYearBirthday,
                                type: 'birthday',
                                title: `Aniversário: ${c.name}`,
                                clientName: c.name,
                                description: "Envie uma mensagem de parabéns oferecendo 10% de desconto!"
                            })
                        }
                    }
                }
            })
        }

        // 3. Fetch Appointments for this month
        const { data: appointmentsData, error: apptError } = await supabase
            .from('appointments')
            .select('id, title, date, type, description')
            .eq('user_id', user.id)
            .gte('date', startString)
            .lte('date', endString)

        if (apptError) console.error("Error fetching appointments:", apptError)

        if (appointmentsData) {
            appointmentsData.forEach((a: any) => {
                if (a.date) {
                    events.push({
                        id: `appt-${a.id}`,
                        date: a.date,
                        type: a.type as 'appointment' | 'reminder', // Using exact type from DB
                        title: a.title,
                        description: a.description || undefined
                    })
                }
            })
        }

        events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

        return { success: true, data: events }
    } catch (error: any) {
        console.error('Erro getEvents:', error)
        return { success: false, data: [], error: error.message }
    }
}
