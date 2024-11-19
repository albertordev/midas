'use client'

import { useUserStore } from '@/store/auth-store'
import { AuthResponse, BalanceFiltersParams } from '@/types'
import { useEffect, useState } from 'react'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/DataTable'
import { BalanceColumns } from '@/constants'
import { balanceColumns } from '@/lib/columns'
import { useBalanceStore } from '@/store/balance-action-store'
import { BalanceModel } from '@/types/appwrite.types'
import BalanceFiltersModal from '@/components/BalanceFiltersModal'
import { getPeriodName } from '@/lib/utils'
import { getBalances } from '@/lib/actions/balance.actions'
import { toast } from '@/hooks/use-toast'

/** Array de etiquetas para las columnas con el texto traducido
 * Si alguna vez se traducen las columnas, reaprovechamos el array
 */
const labels: string[] = []
labels[BalanceColumns.ACCOUNT] = 'Cuenta'
labels[BalanceColumns.NAME] = 'Descripción'
labels[BalanceColumns.TYPE] = 'Tipo'
labels[BalanceColumns.PERIOD] = 'Mes'
labels[BalanceColumns.YEAR] = 'Año'
labels[BalanceColumns.AMOUNT] = 'Saldo'

const columns = balanceColumns({ labels })

/** Utilidades usadas por el componente */
const parseOutputData = (data: BalanceModel[]): BalanceModel[] => {
  return data?.map((balance: BalanceModel) => {
    return {
      ...balance,
      type: balance.type === 'income' ? 'Ingresos' : 'Gastos',
      periodName: getPeriodName(balance.period),
    }
  })
}

const BalancePage = () => {
  const state = useUserStore((state: any) => state)
  const { user } = state
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false)
  let response: AuthResponse | undefined
  const [data, setData] = useState<BalanceModel[]>([])
  const balanceRows = useBalanceStore((state: any) => state.balanceRows)

  useEffect(() => {
    const getDefaultList = async () => {
      const balanceFilters: BalanceFiltersParams = {
        userId: user.$id,
        year: new Date().getFullYear(),
      }
      response = await getBalances(balanceFilters)

      if (!response || !response.data) {
        toast({
          variant: 'destructive',
          description:
            'Ha ocurrido un error al recuperar los datos de los indicadores',
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
    }
    user.$id && getDefaultList()
  }, [])

  useEffect(() => {
    if (balanceRows) setData(parseOutputData(balanceRows))
  }, [balanceRows])

  return (
    <div className="flex h-full w-full flex-col bg-gray-300/70 p-4">
      <header className="mt-2 flex w-full items-start justify-between rounded-md bg-white p-4">
        <span className="text-xl font-bold text-gray-600 sm:text-xl">
          Relación de saldos
        </span>
        <Button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-500/70"
          onClick={() => setOpenFiltersDialog(true)}>
          <Filter className="h-5 w-5 md:h-6 md:w-6" />
          <span className="hidden md:block">Filtrar</span>
        </Button>
      </header>
      <div className="mt-2 flex h-full w-full flex-col rounded-md bg-white p-4">
        <BalanceFiltersModal
          userId={user.$id}
          open={openFiltersDialog}
          setOpen={setOpenFiltersDialog}
        />
        <div className="flex h-full w-full">
          <DataTable
            columns={columns}
            data={data}
            readonly={true}
            hiddenColumnsLabels={[]}
          />
        </div>
      </div>
    </div>
  )
}

export default BalancePage
