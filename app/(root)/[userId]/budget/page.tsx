'use client'

import MovementsForm from '@/components/forms/MovementsForm'
import { toast } from '@/hooks/use-toast'
import { getAccounts } from '@/lib/actions/accounts.actions'
import BudgetModal from '@/components/BudgetModal'
import { useUserStore } from '@/store/auth-store'
import { Account, AuthResponse, Movement } from '@/types'
import { useEffect, useState } from 'react'
import { CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/DataTable'
import { BudgetColumns, RowActions } from '@/constants'
import { budgetColumns } from '@/lib/columns'
import { getBudgets } from '@/lib/actions/budget.actions'
import { BudgetModel } from '@/types/appwrite.types'
import { useBudgetActionStore } from '@/store/budget-action-store'
import { redirect } from 'next/navigation'
import { getPeriodName } from '@/lib/utils'

/** Array de etiquetas para las columnas con el texto traducido
 * Si alguna vez se traducen las columnas, reaprovechamos el array
 */
const labels: string[] = []
labels[BudgetColumns.ACCOUNT] = 'Cuenta'
labels[BudgetColumns.NAME] = 'Nombre'
labels[BudgetColumns.TYPE] = 'Tipo'
labels[BudgetColumns.PERIOD] = 'Mes'
labels[BudgetColumns.YEAR] = 'Año'
labels[BudgetColumns.AMOUNT] = 'Saldo'

const actions: string[] = []
actions[RowActions.HEADER] = 'Acciones'
actions[RowActions.DELETE] = 'Borrar'
actions[RowActions.EDIT] = 'Modificar'

const columns = budgetColumns({ labels, actions })

/** Utilidades usadas por el componente */
const parseOutputData = (data: BudgetModel[]): BudgetModel[] => {
  return data?.map((budget: BudgetModel) => {
    return {
      ...budget,
      type: budget.type === 'income' ? 'Ingresos' : 'Gastos',
      periodName: getPeriodName(budget.period),
    }
  })
}

const BudgetPage = () => {
  const state = useUserStore((state: any) => state)
  const { user } = state
  let response: AuthResponse | undefined
  const [data, setData] = useState<BudgetModel[]>([])
  const [openBudgetDialog, setOpenBudgetDialog] = useState(false)
  const rowDeleted = useBudgetActionStore((state: any) => state.rowDeleted)
  const rowUpdated = useBudgetActionStore((state: any) => state.rowUpdated)
  const setRowUpdated = useBudgetActionStore(
    (state: any) => state.setRowUpdated
  )
  const setRowDeleted = useBudgetActionStore(
    (state: any) => state.setRowDeleted
  )

  useEffect(() => {
    getBudgetsList(user.$id)
  }, [])

  useEffect(() => {
    if (!state || !user || !user.$id) {
      redirect(`/`)
    }

    if (rowUpdated || rowDeleted) {
      getBudgetsList(user.$id)
    }
  }, [user.$id, rowUpdated, rowDeleted])

  useEffect(() => {
    if (rowUpdated || rowDeleted) {
      getBudgetsList(user.$id)
    }
  }, [openBudgetDialog])

  const getBudgetsList = async (userId: string) => {
    response = await getBudgets(userId)

    if (!response) {
      toast({
        variant: 'destructive',
        description:
          'Ha ocurrido un error al recuperar la lista de presupuestos',
      })
      return
    }

    if (response?.status !== 200) {
      toast({
        variant: 'destructive',
        description: response?.data.message,
      })
      return
    }
    setData(parseOutputData(response?.data))
    if (rowUpdated) {
      setRowUpdated(false)
    }
    if (rowDeleted) {
      setRowDeleted(false)
    }
  }

  return (
    <div className="flex h-full w-full flex-col bg-gray-300/70 p-4">
      <header className="mt-2 flex h-16 w-full items-center justify-between rounded-md bg-white p-4">
        <span className="text-2xl font-bold text-gray-600">
          Lista de presupuestos
        </span>
        <Button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-500/70"
          onClick={() => setOpenBudgetDialog(true)}>
          <CirclePlus className="h-5 w-5 md:h-6 md:w-6" />
          <span className="hidden md:block">Añadir presupuesto</span>
        </Button>
      </header>
      <div className="mt-2 flex h-full w-full rounded-md bg-white p-4">
        <DataTable columns={columns} data={data} hiddenColumnsLabels={labels} />
      </div>
      <div className="w-min-[600px]">
        <BudgetModal
          type="create"
          userId={user.$id}
          open={openBudgetDialog}
          setOpen={setOpenBudgetDialog}
        />
      </div>
    </div>
  )
}

export default BudgetPage
