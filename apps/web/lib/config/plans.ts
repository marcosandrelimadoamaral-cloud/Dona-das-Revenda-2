export const PLANS = {
    monthly: {
        id: 'price_monthly', // ID do Stripe
        name: 'Mensal',
        price: 97,
        period: 'month',
        label: 'R$ 97/mês'
    },
    quarterly: {
        id: 'price_quarterly',
        name: 'Trimestral',
        price: 261,
        period: '3 months',
        label: 'R$ 87/mês'
    },
    yearly: {
        id: 'price_yearly',
        name: 'Anual',
        price: 570,
        period: 'year',
        label: 'R$ 47,50/mês'
    }
}
