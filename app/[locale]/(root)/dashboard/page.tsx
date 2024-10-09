import DashboardCard from '@/components/DashboardCard'
import { useTranslations } from 'next-intl'

const DashboardPage = () => {
  const t = useTranslations('Dashboard')
  return (
    <div className="flex h-full w-full flex-col">
      <header className="mt-2 p-4">
        <h1 className="text-3xl font-bold">
          {t('welcome')}, <span className="text-blue-500">Alberto</span>
        </h1>
        <p className="italic text-gray-500">{t('subheader')}</p>
      </header>
      <main className="h-full bg-slate-100">
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-3">
          <DashboardCard title="Ingresos" amount={1400} />
          <DashboardCard title="Gastos" amount={800} />
          <DashboardCard title="Saldo" amount={600} />
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
