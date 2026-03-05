"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, CreditCard, Gift, Sparkles, Plus, ChevronLeft, ChevronRight, CalendarClock, Briefcase, FileText } from "lucide-react"
import { format, isSameDay, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { getEvents, AgendaEvent } from "@/app/actions/agenda/getEvents"
import { createAppointment } from "@/app/actions/agenda/createAppointment"

export default function AgendaPage() {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [events, setEvents] = useState<AgendaEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    const [filters, setFilters] = useState({
        receivables: true,
        birthdays: true,
        appointments: true,
        pendingOnly: false
    })

    // Modal Form State
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [formError, setFormError] = useState<string | null>(null)

    async function loadEvents() {
        setLoading(true)
        const year = currentMonth.getFullYear()
        const month = currentMonth.getMonth() + 1
        const res = await getEvents(year, month)
        if (res.success && res.data) {
            setEvents(res.data)
        } else {
            setEvents([])
        }
        setLoading(false)
    }

    useEffect(() => {
        loadEvents()
    }, [currentMonth])

    const handleMonthChange = (month: Date) => setCurrentMonth(month)
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    // Handle Form Submission
    const handleCreateAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFormError(null)
        setIsSubmitting(true)

        const formData = new FormData(e.currentTarget)
        const result = await createAppointment(formData)

        if (result.success) {
            setIsDialogOpen(false)
            // Reload the events to show the newly created appointment
            loadEvents()
            // Optionally set the selected date to the one just created
            const newDateStr = formData.get('date') as string
            if (newDateStr) {
                const [y, m, d] = newDateStr.split('-').map(Number)
                setSelectedDate(new Date(y, m - 1, d))
                if (new Date(y, m - 1, d).getMonth() !== currentMonth.getMonth()) {
                    setCurrentMonth(new Date(y, m - 1, 1))
                }
            }
        } else {
            setFormError(result.error || "Ocorreu um erro.")
        }

        setIsSubmitting(false)
    }

    // Filter events for the selected date and apply sidebar filters
    const filteredEvents = events.filter(e => {
        if (!selectedDate || !e.date) return false;

        const eventDate = new Date(e.date + 'T00:00:00')
        if (!isSameDay(eventDate, selectedDate)) return false;

        if (e.type === 'receivable' && !filters.receivables) return false;
        if (e.type === 'birthday' && !filters.birthdays) return false;
        if ((e.type === 'appointment' || e.type === 'reminder') && !filters.appointments) return false;

        // 3. Pending only (Mocking the pending logic, assuming fiados are pending if they appear here usually, 
        // but if your backend has a status, we would check e.status !== 'completed' or similar. 
        // For visual sake, let's keep all returned as pending unless defined otherwise).
        if (filters.pendingOnly) {
            // example logic, if you have a completed flag
            // if (e.status === 'completed') return false; 
        }

        return true;
    })

    return (
        <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <CalendarIcon className="w-8 h-8 text-purple-600" />
                    Agenda
                </h1>
                <p className="text-muted-foreground mt-1 text-sm">
                    Acompanhe compromissos manuais, cobranças de fiados e aniversariantes.
                </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
                {/* 1. COLUNA ESQUERDA: Calendário e Filtros */}
                <div className="w-full lg:w-[400px] flex flex-col gap-6 overflow-y-auto pr-1">
                    <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-gray-950 overflow-hidden shrink-0">
                        <CardContent className="p-6">
                            <style>{`
                                .rdp-day_selected { background-color: #9333ea !important; color: white !important; font-weight: bold; border-radius: 9999px !important; }
                                .rdp-day_selected:hover { background-color: #7e22ce !important; }
                            `}</style>

                            {/* CABEÇALHO CUSTOMIZADO: Fix para setas não vazarem container */}
                            <div className="flex items-center justify-between mb-4 w-full">
                                <Button variant="ghost" size="icon" onClick={prevMonth} className="rounded-full h-8 w-8 text-gray-500 hover:text-gray-900 border border-gray-100 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800">
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                <h2 className="text-xl font-bold capitalize text-gray-900 dark:text-gray-100">
                                    {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                                </h2>
                                <Button variant="ghost" size="icon" onClick={nextMonth} className="rounded-full h-8 w-8 text-gray-500 hover:text-gray-900 border border-gray-100 hover:bg-gray-100 dark:border-gray-800 dark:hover:bg-gray-800">
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>

                            <DayPicker
                                mode="single"
                                month={currentMonth}
                                selected={selectedDate}
                                onSelect={(date) => { if (date) setSelectedDate(date) }}
                                onMonthChange={handleMonthChange}
                                locale={ptBR}
                                showOutsideDays
                                className="p-0 flex justify-center w-full"
                                classNames={{
                                    months: "w-full flex flex-col",
                                    month: "w-full space-y-4",
                                    month_caption: "hidden", // Esconde o cabeçalho nativo problemático da v9
                                    caption_label: "hidden",
                                    nav: "hidden", // Esconde a navegação nativa
                                    month_grid: "w-full table border-collapse",
                                    weekdays: "grid grid-cols-7 w-full mb-3",
                                    weekday: "text-muted-foreground font-semibold text-xs uppercase text-center",
                                    weeks: "w-full block",
                                    week: "grid grid-cols-7 w-full mt-2 gap-y-2",
                                    day: "text-center text-sm p-0 flex items-center justify-center relative min-h-[56px] w-full focus-within:relative focus-within:z-20",
                                    day_button: "h-12 w-12 p-0 font-medium aria-selected:opacity-100 rounded-full flex flex-col items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors mx-auto relative",
                                    outside: "text-muted-foreground opacity-30",
                                    disabled: "text-muted-foreground opacity-30",
                                    hidden: "invisible",
                                }}
                                components={{
                                    DayButton: (props) => {
                                        const { day, modifiers, ...buttonProps } = props;
                                        const eventsOnDay = events.filter(e => {
                                            if (!e.date) return false;
                                            const evDate = new Date(e.date + 'T00:00:00');
                                            return isSameDay(evDate, day.date);
                                        });
                                        const hasReceivable = eventsOnDay.some(e => e.type === 'receivable');
                                        const hasBirthday = eventsOnDay.some(e => e.type === 'birthday');
                                        const hasAppointment = eventsOnDay.some(e => e.type === 'appointment' || e.type === 'reminder');

                                        return (
                                            <button {...buttonProps} className={`${buttonProps.className || ''} relative flex items-center justify-center p-0`}>
                                                <span className="z-10">{day.date.getDate()}</span>
                                                <div className="flex gap-1 absolute bottom-1.5 z-10 w-full justify-center pb-0.5">
                                                    {filters.receivables && hasReceivable && <span className="w-[5px] h-[5px] rounded-full bg-red-500 shadow-sm" title="Fiado"></span>}
                                                    {filters.birthdays && hasBirthday && <span className="w-[5px] h-[5px] rounded-full bg-purple-500 shadow-sm" title="Aniversário"></span>}
                                                    {filters.appointments && hasAppointment && <span className="w-[5px] h-[5px] rounded-full bg-blue-500 shadow-sm" title="Compromisso"></span>}
                                                </div>
                                            </button>
                                        )
                                    }
                                }}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-gray-950 shrink-0">
                        <CardHeader className="pb-3 pt-5">
                            <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">Filtros de Exibição</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 pb-5">
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="appointments"
                                    checked={filters.appointments}
                                    onCheckedChange={(checked) => setFilters(f => ({ ...f, appointments: checked as boolean }))}
                                />
                                <label htmlFor="appointments" className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer select-none">
                                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm"></span>
                                    Compromissos Manuais
                                </label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="receivables"
                                    checked={filters.receivables}
                                    onCheckedChange={(checked) => setFilters(f => ({ ...f, receivables: checked as boolean }))}
                                />
                                <label htmlFor="receivables" className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer select-none">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm"></span>
                                    Cobranças e Fiados
                                </label>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Checkbox
                                    id="birthdays"
                                    checked={filters.birthdays}
                                    onCheckedChange={(checked) => setFilters(f => ({ ...f, birthdays: checked as boolean }))}
                                />
                                <label htmlFor="birthdays" className="flex items-center gap-2 text-sm font-medium leading-none cursor-pointer select-none">
                                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm"></span>
                                    Aniversários
                                </label>
                            </div>
                            <div className="flex items-center space-x-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                <Checkbox
                                    id="pending"
                                    checked={filters.pendingOnly}
                                    onCheckedChange={(checked) => setFilters(f => ({ ...f, pendingOnly: checked as boolean }))}
                                />
                                <label htmlFor="pending" className="text-sm font-medium leading-none cursor-pointer text-muted-foreground select-none">
                                    Mostrar apenas pendentes
                                </label>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* 2. COLUNA DIREITA: Detalhes do Dia Selecionado */}
                <div className="flex-1 min-w-0">
                    <Card className="border-none shadow-sm rounded-3xl bg-white dark:bg-gray-950 h-full flex flex-col">
                        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0 px-6 sm:px-8 pt-6">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold capitalize text-gray-900 dark:text-gray-100 tracking-tight">
                                    {selectedDate ? format(selectedDate, "dd 'de' MMMM, yyyy", { locale: ptBR }) : 'Selecione uma data'}
                                </h2>
                                <p className="text-sm text-purple-600 font-semibold mt-1">
                                    {filteredEvents.length} {filteredEvents.length === 1 ? 'compromisso agendado' : 'compromissos agendados'}
                                </p>
                            </div>

                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-5 sm:px-6 shadow-sm font-medium shrink-0 self-start sm:self-auto">
                                        <Plus className="w-4 h-4 mr-2" />
                                        <span>Novo compromisso</span>
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[450px]">
                                    <DialogHeader>
                                        <DialogTitle>Adicionar Novo Compromisso</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleCreateAppointment} className="space-y-4 mt-4">
                                        {formError && (
                                            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-200">
                                                {formError}
                                            </div>
                                        )}
                                        <div className="space-y-2">
                                            <label htmlFor="title" className="text-sm font-medium">Título do Compromisso *</label>
                                            <Input id="title" name="title" required placeholder="Ex: Visitar fornecedora" />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="date" className="text-sm font-medium">Data *</label>
                                            <Input
                                                id="date"
                                                type="date"
                                                name="date"
                                                required
                                                defaultValue={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ''}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="type" className="text-sm font-medium">Tipo *</label>
                                            <select
                                                id="type"
                                                name="type"
                                                required
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            >
                                                <option value="appointment">Compromissos Manuais</option>
                                                <option value="receivable">Cobranças e Fiados</option>
                                                <option value="birthday">Aniversários</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label htmlFor="description" className="text-sm font-medium">Descrição (Opcional)</label>
                                            <Textarea id="description" name="description" placeholder="Detalhes adicionais..." />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4 border-t mt-6">
                                            <Button type="button" variant="outline" className="rounded-full px-6" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                                                Cancelar
                                            </Button>
                                            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white rounded-full px-6" disabled={isSubmitting}>
                                                {isSubmitting ? "Salvando..." : "Salvar Compromisso"}
                                            </Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </CardHeader>

                        <CardContent className="flex-1 overflow-y-auto p-6 sm:p-8">
                            {loading ? (
                                <div className="space-y-4">
                                    <Skeleton className="h-24 w-full rounded-2xl" />
                                    <Skeleton className="h-24 w-full rounded-2xl" />
                                    <Skeleton className="h-24 w-full rounded-2xl" />
                                </div>
                            ) : filteredEvents.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredEvents.map(event => (
                                        <div key={event.id} className="p-5 rounded-2xl border border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center gap-5 hover:border-purple-200 hover:shadow-md transition-all bg-gray-50/50 dark:bg-gray-900/50 group">
                                            <div className="shrink-0 flex items-center gap-3">
                                                {event.type === 'receivable' && (
                                                    <div className="p-3 bg-red-100 text-red-600 rounded-2xl group-hover:bg-red-200 group-hover:shadow-sm transition-all shadow-sm">
                                                        <CreditCard className="w-6 h-6" />
                                                    </div>
                                                )}
                                                {event.type === 'birthday' && (
                                                    <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl group-hover:bg-purple-200 group-hover:shadow-sm transition-all shadow-sm">
                                                        <Gift className="w-6 h-6" />
                                                    </div>
                                                )}
                                                {(event.type === 'appointment' || event.type === 'reminder') && (
                                                    <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl group-hover:bg-blue-200 group-hover:shadow-sm transition-all shadow-sm">
                                                        {event.type === 'appointment' ? <Briefcase className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
                                                    </div>
                                                )}

                                                <div className="sm:hidden flex-1">
                                                    <h5 className="font-semibold text-base text-gray-900 dark:text-gray-100">{event.title}</h5>
                                                    <Badge variant="outline" className={`mt-1 mb-1 text-[10px] uppercase font-bold tracking-wider rounded-md border-transparent
                                                        ${event.type === 'receivable' ? 'bg-red-100 text-red-700' :
                                                            event.type === 'birthday' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-blue-100 text-blue-700'}`}>
                                                        {event.type === 'receivable' ? 'FIADO' : event.type === 'birthday' ? 'ANIVERSÁRIO' : 'COMPROMISSO'}
                                                    </Badge>
                                                    {event.description && <p className="text-sm text-muted-foreground mt-0.5 max-w-[250px]">{event.description}</p>}
                                                </div>
                                            </div>

                                            <div className="flex-1 hidden sm:block">
                                                <div className="flex items-center gap-3">
                                                    <h5 className="font-semibold text-lg text-gray-900 dark:text-gray-100">{event.title}</h5>
                                                    <Badge variant="outline" className={`text-[10px] uppercase font-bold tracking-wider rounded-md border-transparent
                                                        ${event.type === 'receivable' ? 'bg-red-100 text-red-700' :
                                                            event.type === 'birthday' ? 'bg-purple-100 text-purple-700' :
                                                                'bg-blue-100 text-blue-700'}`}>
                                                        {event.type === 'receivable' ? 'FIADO' : event.type === 'birthday' ? 'ANIVERSÁRIO' : 'MANUAL'}
                                                    </Badge>
                                                </div>
                                                {event.description && <p className="text-sm text-muted-foreground mt-1 leading-relaxed max-w-[400px]">{event.description}</p>}
                                            </div>

                                            {event.amount && (
                                                <div className="sm:text-right shrink-0 mt-2 sm:mt-0">
                                                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-1">A receber</p>
                                                    <p className="text-xl font-bold text-red-600 leading-none">R$ {event.amount.toFixed(2)}</p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center text-muted-foreground">
                                    <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-800 rounded-full p-8 mb-6 shadow-sm">
                                        <CalendarClock className="w-10 h-10 text-gray-400 dark:text-gray-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 mt-2">Nenhum compromisso para este dia.</h3>
                                    <p className="max-w-md text-sm leading-relaxed mx-auto text-gray-500">
                                        Excelente! Sabia que pode adicionar compromissos e lembretes manuais clicando no botão acima?
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
