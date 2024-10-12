import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'
import DataTable, { Payment } from '@/components/DataTable'
import { ColumnDef } from '@tanstack/react-table'

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'amount',
    header: 'Amount',
  },
]

const payments: Payment[] = [
  {
    id: '728ed52f',
    amount: 100,
    status: 'pending',
    email: 'm@example.com',
  },
  {
    id: '489e1d42',
    amount: 125,
    status: 'processing',
    email: 'example@gmail.com',
  },
  {
    id: '489e1d46',
    amount: 75,
    status: 'pending',
    email: 'example2@gmail.com',
  },
  {
    id: '489e1d47',
    amount: 110,
    status: 'pending',
    email: 'example3@gmail.com',
  },
  {
    id: '489e1d56',
    amount: 65,
    status: 'pending',
    email: 'example4@gmail.com',
  },
  {
    id: '489e1xf6',
    amount: 200,
    status: 'processing',
    email: 'example5@gmail.com',
  },
  {
    id: '489e1d46',
    amount: 90,
    status: 'pending',
    email: 'example6@gmail.com',
  },
]

const AccountsPage = () => {
  const t = useTranslations('Accounts')
  const data = payments
  return (
    <div className="flex h-full w-full flex-col bg-gray-300/70 p-4">
      <header className="mt-2 flex h-16 w-full items-center justify-between rounded-md bg-white p-4">
        <span className="text-2xl font-bold">{t('header')}</span>
        <Button className="flex items-center gap-2 bg-blue-500">
          <CirclePlus className="h-6 w-6" />
          {t('addAccount')}
        </Button>
      </header>
      <main className="mt-2 flex h-full w-full rounded-md bg-white p-4">
        <DataTable />
      </main>
    </div>
  )
}

export default AccountsPage
