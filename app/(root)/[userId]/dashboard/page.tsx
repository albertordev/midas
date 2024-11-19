'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  BalanceVsBudget,
  BudgetFiltersParams,
  DashboardBalance,
  DashboardCardData,
  MovementAccount,
  SortedBalanceParams,
} from '@/types'
import DashboardCard from '@/components/DashboardCard'
import TopMovements from '@/components/TopMovements'
import { DashboardLineChart } from '@/components/DashboardLineChart'
import { useUserStore } from '@/store/auth-store'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'
import { getBalances } from '@/lib/actions/balance.actions'
import { AuthResponse, BalanceFiltersParams } from '@/types'
import { toast } from '@/hooks/use-toast'
import { getPeriodName } from '@/lib/utils'
import { getFilteredBudget } from '@/lib/actions/budget.actions'
import build from 'next/dist/build'

const DashboardPage = () => {
  const state = useUserStore((state: any) => state)
  const { user } = state

  let incomeResponse: AuthResponse | undefined
  let expensesResponse: AuthResponse | undefined
  let budgetResponse: AuthResponse | undefined

  const [totalIncome, setTotalIncome] = useState<number>(0)
  const [totalBalance, setTotalBalance] = useState<number>(0)
  const [totalExpenses, setTotalExpenses] = useState<number>(0)

  const [incomeAccounts, setIncomeAccounts] = useState<DashboardCardData[]>([])
  const [expensesAccounts, setExpensesAccounts] = useState<DashboardCardData[]>(
    []
  )
  const [balances, setBalances] = useState<DashboardBalance[]>([])
  const [budgets, setBudgets] = useState<DashboardBalance[]>([])
  const [comparative, setComparative] = useState<BalanceVsBudget[]>([])

  if (!state || !user || !user.$id) {
    redirect(`/`)
  }

  useEffect(() => {
    const getData = async () => {
      try {
        /** Ingresos */
        const incomeFilters: SortedBalanceParams = {
          userId: user.$id,
          type: 'income',
          sort: 'amount',
          order: 'desc',
        }
        incomeResponse = await getBalances(incomeFilters)

        if (!incomeResponse || !incomeResponse.data) {
          toast({
            variant: 'destructive',
            description:
              'Ha ocurrido un error al recuperar los datos de los indicadores',
          })
          return
        }

        if (incomeResponse?.status !== 200) {
          toast({
            variant: 'destructive',
            description: incomeResponse?.data.message,
          })
          return
        }

        /** Gastos */
        const expensesFilters: SortedBalanceParams = {
          userId: user.$id,
          type: 'expenses',
          sort: 'amount',
          order: 'desc',
        }

        expensesResponse = await getBalances(expensesFilters)

        if (!expensesResponse || !expensesResponse.data) {
          toast({
            variant: 'destructive',
            description:
              'Ha ocurrido un error al recuperar los datos de los indicadores',
          })
          return
        }

        if (expensesResponse?.status !== 200) {
          toast({
            variant: 'destructive',
            description: expensesResponse?.data.message,
          })
          return
        }

        /** Presupuestos */
        const budgetFilters: BudgetFiltersParams = {
          userId: user.$id,
          year: new Date().getFullYear(),
        }
        budgetResponse = await getFilteredBudget(budgetFilters)

        if (!budgetResponse || !budgetResponse.data) {
          toast({
            variant: 'destructive',
            description:
              'Ha ocurrido un error al recuperar los datos de los indicadores',
          })
          return
        }

        if (budgetResponse?.status !== 200) {
          toast({
            variant: 'destructive',
            description: budgetResponse?.data.message,
          })
          return
        }

        const incomeData = buildIncomeData()
        const expensesData = buildExpensesData()

        /** Para el gráfico comparativo entre saldo y presupuestos */
        buildBalancesData()
        buildBudgetData()

        /** El array que enviamos para que se muestren las cuentas
         *  solo contendrá las tres cuentas con mayor cantidad de ingresos
         */
        // setIncomeData(incomeData.slice(0, 3))
        // setExpensesData(expensesData.slice(0, 3))

        /** Obtenemos las cuentas de ingresos y gastos con sus importes acumulados
         *  Irán a los doughnuts de los indicadores y a los top de ingresos y gastos.
         *  Sólo contendrán las tres cuentas con mayor cantidad de ingresos
         */

        getIncomeAccounts(incomeData)
        getExpensesAccounts(expensesData)
      } catch (error) {
        toast({
          variant: 'destructive',
          description:
            'Ha ocurrido un error al recuperar los datos de los indicadores',
        })
      }
    }
    user.$id && getData()
  }, [])

  useEffect(() => {
    setTotalIncome(getTotalIncome(incomeAccounts))
    setTotalExpenses(getTotalExpenses(expensesAccounts))
  }, [incomeAccounts, expensesAccounts])

  useEffect(() => {
    setTotalBalance(totalIncome - totalExpenses)
  }, [totalIncome, totalExpenses])

  useEffect(() => {
    /** Construimos el array de saldos y presupuestos para los doce meses */
    if (!balances.length && !budgets.length) return

    const comparative: BalanceVsBudget[] = []
    for (let i = 1; i <= 12; i++) {
      const month = getPeriodName(i)
      let balance = 0
      let budget = 0

      const balanceFound = balances.find(
        (val: DashboardBalance) => val.period === i
      )
      if (balanceFound) {
        balance = balanceFound.amount
      }
      const budgetFound = budgets.find(
        (val: DashboardBalance) => val.period === i
      )
      if (budgetFound) {
        budget = budgetFound.amount
      }

      comparative.push({
        period: month,
        balance,
        budget,
      })
    }

    setComparative(comparative)
  }, [balances, budgets])

  const getTotalIncome = (incomeData: DashboardCardData[]) => {
    return incomeData
      .map((data: DashboardCardData) => data.value)
      .reduce((total, value) => total + value, 0)
  }

  const getTotalExpenses = (expensesData: DashboardCardData[]) => {
    return expensesData
      .map((data: DashboardCardData) => data.value)
      .reduce((total, value) => total + value, 0)
  }

  const buildIncomeData = () => {
    return incomeResponse?.data?.map((balance: any) => {
      return {
        name: balance.accountName,
        value: balance.amount,
      }
    })
  }

  const buildExpensesData = () => {
    return expensesResponse?.data?.map((balance: any) => {
      return {
        name: balance.accountName,
        value: balance.amount,
      }
    })
  }

  const buildBalancesData = () => {
    const balanceData: DashboardBalance[] = []

    incomeResponse?.data?.forEach((income: any) => {
      const found = balanceData.find(
        (val: DashboardBalance) => val.period === income.period
      )

      if (found) {
        found.amount += income.amount
      } else {
        balanceData.push({
          period: income.period,
          monthName: getPeriodName(income.period),
          amount: income.amount,
        })
      }
    })

    expensesResponse?.data?.forEach((expenses: any) => {
      const found = balanceData.find(
        (val: DashboardBalance) => val.period === expenses.period
      )

      if (found) {
        found.amount -= expenses.amount
      } else {
        balanceData.push({
          period: expenses.period,
          monthName: getPeriodName(expenses.period),
          amount: expenses.amount,
        })
      }
    })

    setBalances(balanceData)
  }

  const buildBudgetData = () => {
    const budgetData: DashboardBalance[] = []

    budgetResponse?.data?.forEach((budget: any) => {
      const found = budgetData.find(
        (val: DashboardBalance) => val.period === budget.period
      )

      if (found) {
        if (budget.type === 'budget') {
          found.amount += budget.amount
        } else {
          found.amount -= budget.amount
        }
      } else {
        budgetData.push({
          period: budget.period,
          monthName: getPeriodName(budget.period),
          amount: budget.type === 'income' ? budget.amount : -budget.amount,
        })
      }
    })

    setBudgets(budgetData)
  }

  const backgrounds = ['#3B82F6', '#0d53a6']

  const getIncomeAccounts = (incomeData: DashboardCardData[]) => {
    /** Acumulamos los importes de los ingresos por cuenta */
    const accounts: DashboardCardData[] = []
    incomeData.forEach((income: DashboardCardData) => {
      const found = accounts.find(
        (val: DashboardCardData) => val.name === income.name
      )

      if (found) {
        found.value += income.value
      } else {
        accounts.push(income)
      }
    })
    setIncomeAccounts(accounts)
  }

  const getExpensesAccounts = (expensesData: DashboardCardData[]) => {
    /** Acumulamos los importes de los gastos por cuenta */
    const accounts: DashboardCardData[] = []
    expensesData.forEach((expense: DashboardCardData) => {
      const found = accounts.find(
        (val: DashboardCardData) => val.name === expense.name
      )
      if (found) {
        found.value += expense.value
      } else {
        accounts.push(expense)
      }
    })
    setExpensesAccounts(accounts)
  }

  return (
    <div className="flex h-full w-full flex-col">
      <header className="mt-2 p-4">
        <h1 className="text-3xl font-bold text-gray-600">
          Bienvenido/a, <span className="text-blue-500">{user?.name}</span>
        </h1>
        <p className="italic text-gray-500">
          Ten al día tus finanzas personales sin esfuerzo con Midas
        </p>
      </header>
      <main className="h-auto w-full bg-gray-300/70">
        <div className="flex flex-col flex-wrap sm:flex-row 2xl:flex-nowrap">
          <div className="grid w-full grid-cols-1 items-center justify-start gap-4 p-4 sm:w-auto sm:grid-cols-3">
            <DashboardCard
              title="Ingresos"
              amount={totalIncome}
              icon="/icons/income.svg"
              color="green-700"
              data={incomeAccounts.slice(0, 3)}
              backgrounds={backgrounds}
            />
            <DashboardCard
              title="Gastos"
              amount={totalExpenses}
              icon="/icons/expenses.svg"
              color="red-700"
              data={expensesAccounts.slice(0, 3)}
              backgrounds={backgrounds}
            />
            <DashboardCard
              title="Saldo"
              amount={totalBalance}
              icon="/icons/balance.svg"
              color="yellow-700"
              data={[]}
              backgrounds={backgrounds}
            />
          </div>
          <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
            <TopMovements
              header="Principales ingresos"
              type="income"
              accounts={incomeAccounts.slice(0, 3)}
            />
            <TopMovements
              header="Principales gastos"
              type="expenses"
              accounts={expensesAccounts.slice(0, 3)}
            />
          </div>
        </div>
        <div className="m-4 h-[25rem] rounded-md bg-white">
          <DashboardLineChart userId={user?.$id} data={comparative} />
        </div>
      </main>
    </div>
  )
}

export default DashboardPage
