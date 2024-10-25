import { Account } from '@/types'

export const accountData: Account[] = [
  {
    account: 'Nómina',
    description: 'Nómina',
    icon: '/icons/euro.svg',
    id: '1',
    type: 'Ingresos',
  },
  {
    account: 'Alquiler',
    description: 'Alquiler',
    icon: '/icons/balance.svg',
    id: '2',
    type: 'Gastos',
  },
  {
    account: 'Cumpleaños',
    description: 'Regalos de cumpleaños',
    icon: '/icons/layer-plus.svg',
    id: '3',
    type: 'Ingresos',
  },
  {
    account: 'Compra',
    description: 'Cesta de la compra',
    icon: '/icons/credit-card.svg',
    id: '4',
    type: 'Gastos',
  },
  {
    account: 'Médicos',
    description: 'Gastos médicos',
    icon: '/icons/expenses.svg',
    id: '5',
    type: 'Gastos',
  },
  {
    account: 'Ventas',
    description: 'Ventas de productos',
    icon: '/icons/trending-up.svg',
    id: '6',
    type: 'Ingresos',
  },
]
