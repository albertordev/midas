import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'
import DataTable from '@/components/DataTable'

const AccountsPage = () => {
  const t = useTranslations('Accounts')
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
