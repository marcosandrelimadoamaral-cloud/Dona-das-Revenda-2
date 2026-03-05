"use client"

import { useState, useEffect } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Gift, ShoppingBag, CreditCard, Sparkles } from "lucide-react"
import { format, startOfMonth, endOfMonth, isSameDay, addMonths, subMonths } from "date-fns"
import { ptBR } from "date-fns/locale"
import { DayPicker } from "react-day-picker"
import { getCalendarEvents, CalendarEvent } from "@/app/actions/dashboard/getCalendarEvents"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

export function CalendarWidget() {
    const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
    const [events, setEvents] = useState<CalendarEvent[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())

    useEffect(() => {
        async function loadEvents() {
            setLoading(true)
            const start = startOfMonth(currentMonth).toISOString()
            const end = endOfMonth(currentMonth).toISOString()

            const res = await getCalendarEvents(start, end)
            if (res.success && res.data) {
                setEvents(res.data)
            }
            setLoading(false)
        }
        loadEvents()
    }, [currentMonth])

    const handleMonthChange = (month: Date) => setCurrentMonth(month)
    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    // Find events for the selected date
    const selectedEvents = events.filter(e => selectedDate && isSameDay(new Date(e.date), selectedDate))

    return (
        <div className="flex flex-col md:flex-row gap-6 bg-white dark:bg-gray-950 p-6 rounded-3xl border shadow-sm">
            {/* Calendar Side */}
            <div className="flex-1 md:max-w-[350px]">
                <div className="flex items-center gap-2 font-semibold text-lg mb-4">
                    <CalendarIcon className="w-5 h-5 text-purple-600" />
                    Agenda Inteligente
                </div>

                <style>{`
          .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: #f3e8ff; color: #9333ea; }
          .rdp-day_selected { background-color: #9333ea !important; font-weight: bold; color: white !important; }
        `}</style>

                <div className="flex items-center justify-between mb-4 w-full px-2">
                    <button onClick={prevMonth} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <h3 className="text-lg font-bold capitalize text-gray-900 dark:text-gray-100">
                        {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
                    </h3>
                    <button onClick={nextMonth} className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>

                <DayPicker
                    mode="single"
                    month={currentMonth}
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    onMonthChange={handleMonthChange}
                    locale={ptBR}
                    showOutsideDays
                    className="p-0"
                    classNames={{
                        months: "w-full flex flex-col",
                        month: "w-full space-y-4",
                        month_caption: "hidden", // Esconde o cabeçalho nativo
                        caption_label: "hidden",
                        nav: "hidden", // Esconde a navegação nativa
                        month_grid: "w-full table",
                        weekdays: "grid grid-cols-7 w-full mb-2",
                        weekday: "text-muted-foreground font-medium text-xs uppercase text-center",
                        weeks: "w-full block",
                        week: "grid grid-cols-7 w-full mt-2 gap-y-2",
                        day: "text-center text-sm p-0 relative min-h-[48px] overflow-visible w-full flex flex-col items-center justify-start focus-within:relative focus-within:z-20",
                        day_button: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-lg flex flex-col items-center justify-center hover:bg-purple-50 dark:hover:bg-purple-900/40 transition-colors mx-auto relative",
                        outside: "text-muted-foreground opacity-30",
                        disabled: "text-muted-foreground opacity-30",
                        hidden: "invisible",
                    }}
                    components={{
                        DayButton: (props) => {
                            const { day, modifiers, ...buttonProps } = props;
                            const eventsOnDay = events.filter(e => {
                                if (!e.date) return false;
                                const evDate = new Date(e.date);
                                return isSameDay(evDate, day.date);
                            });
                            const hasReceivable = eventsOnDay.some(e => e.type === 'receivable');
                            const hasBirthday = eventsOnDay.some(e => e.type === 'birthday');
                            const hasCycle = eventsOnDay.some(e => e.type === 'cycle');

                            return (
                                <button {...buttonProps} className={`${buttonProps.className || ''} relative flex flex-col items-center justify-center p-0`}>
                                    <span>{day.date.getDate()}</span>
                                    <div className="flex gap-0.5 absolute bottom-1">
                                        {hasReceivable && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-sm" title="Fiado"></span>}
                                        {hasBirthday && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 shadow-sm" title="Aniversário"></span>}
                                        {hasCycle && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm" title="Ciclo"></span>}
                                    </div>
                                </button>
                            )
                        }
                    }}
                />
            </div>

            <div className="hidden md:block w-px bg-gray-100 dark:bg-gray-800"></div>

            {/* Details Side */}
            <div className="flex-1 flex flex-col h-full min-h-[300px]">
                <h4 className="font-semibold text-lg mb-4 flex items-center justify-between">
                    <span>{selectedDate ? format(selectedDate, "d 'de' MMMM", { locale: ptBR }) : 'Selecione uma data'}</span>
                    <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                        {selectedEvents.length} {selectedEvents.length === 1 ? 'evento' : 'eventos'}
                    </Badge>
                </h4>

                <div className="flex-1 overflow-y-auto pr-2 space-y-3">
                    {loading ? (
                        <div className="space-y-3">
                            <Skeleton className="h-16 w-full rounded-xl" />
                            <Skeleton className="h-16 w-full rounded-xl" />
                        </div>
                    ) : selectedEvents.length > 0 ? (
                        selectedEvents.map(event => (
                            <div key={event.id} className="p-3 rounded-xl border flex gap-4 hover:border-purple-200 hover:shadow-sm transition-all bg-white dark:bg-gray-950">
                                <div className="shrink-0 mt-1">
                                    {event.type === 'receivable' && <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><CreditCard className="w-4 h-4" /></div>}
                                    {event.type === 'birthday' && <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Gift className="w-4 h-4" /></div>}
                                    {event.type === 'cycle' && <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><ShoppingBag className="w-4 h-4" /></div>}
                                </div>
                                <div>
                                    <h5 className="font-medium text-sm text-gray-900 dark:text-gray-100">{event.title}</h5>
                                    {event.description && <p className="text-xs text-muted-foreground mt-0.5 leading-snug">{event.description}</p>}
                                    {event.amount && <p className="text-sm font-semibold text-emerald-600 mt-1">R$ {event.amount.toFixed(2)}</p>}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center text-center h-[200px] text-muted-foreground">
                            <Sparkles className="w-8 h-8 text-gray-200 mb-2" />
                            <p>Nenhum evento neste dia.</p>
                            <p className="text-xs mt-1">Tire o dia para focar nas vendas!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
