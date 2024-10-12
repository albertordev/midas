import { useTranslations } from 'next-intl'

import DashboardCard from '@/components/DashboardCard'
import TopMovements from '@/components/TopMovements'
import { DashboardLineChart } from '@/components/DashboardLineChart'

const DashboardPage = () => {
  const t = useTranslations('Dashboard')

  const labels = ['Account 1', 'Account 2']

  const incomeData = [
    { name: 'Account 1', value: 300 },
    { name: 'Account 2', value: 100 },
  ]

  const expensesData = [
    { name: 'Account 1', value: 200 },
    { name: 'Account 2', value: 30 },
  ]

  const balanceData = [
    { name: 'Account 1', value: 100 },
    { name: 'Account 2', value: 70 },
  ]

  const backgrounds = ['#3B82F6', '#0d53a6']

  const balanceDataKey = t('lineChartBalance')
  const budgetDataKey = t('lineChartBudget')

  const incomeAccounts = [
    {
      name: 'Nómina',
      amount: 1750.55,
    },
    {
      name: 'Alquiler',
      amount: 976.75,
    },
    {
      name: 'Cumpleaños',
      amount: 300.0,
    },
  ]

  const expensesAccounts = [
    {
      name: 'Revisión del coche',
      amount: 650.3,
    },
    {
      name: 'Dentista',
      amount: 555.0,
    },
    {
      name: 'Cesta compra',
      amount: 120.8,
    },
  ]

  return (
    <div className="flex h-full w-full flex-col">
      <header className="mt-2 p-4">
        <h1 className="text-3xl font-bold">
          {t('welcome')}, <span className="text-blue-500">Alberto</span>
        </h1>
        <p className="italic text-gray-500">{t('subheader')}</p>
      </header>
      <main className="h-auto w-full bg-gray-300/70">
        <div className="flex flex-col flex-wrap sm:flex-row 2xl:flex-nowrap">
          <div className="grid w-full grid-cols-1 items-center justify-start gap-4 p-4 sm:w-auto sm:grid-cols-3">
            <DashboardCard
              title={t('income')}
              amount={1400}
              icon="/icons/income.svg"
              color="green-700"
              data={incomeData}
              backgrounds={backgrounds}
            />
            <DashboardCard
              title={t('expenses')}
              amount={800}
              icon="/icons/expenses.svg"
              color="red-700"
              data={expensesData}
              backgrounds={backgrounds}
            />
            <DashboardCard
              title={t('balance')}
              amount={600}
              icon="/icons/balance.svg"
              color="yellow-700"
              data={balanceData}
              backgrounds={backgrounds}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
            <TopMovements
              header={t('topIncomeHeader')}
              type="income"
              accounts={incomeAccounts}
            />
            <TopMovements
              header={t('topExpensesHeader')}
              type="expenses"
              accounts={expensesAccounts}
            />
          </div>
        </div>
        <div className="m-4 h-[25rem] rounded-md bg-white">
          <DashboardLineChart />
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
