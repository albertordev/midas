'use client'

import { toast } from '@/hooks/use-toast'
import { useUserStore } from '@/store/auth-store'
import { AuthResponse, HistoryFiltersParams } from '@/types'
import { useEffect, useState } from 'react'
import { Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/DataTable'
import { MovementColumns } from '@/constants'
import { historyColumns } from '@/lib/columns'
import { getMovementsHistory } from '@/lib/actions/movements.actions'
import { useHistoryStore } from '@/store/movement-action-store'
import { MovementModel } from '@/types/appwrite.types'
import HistoryFiltersModal from '@/components/HistoryFiltersModal'

/** Array de etiquetas para las columnas con el texto traducido
 * Si alguna vez se traducen las columnas, reaprovechamos el array
 */
const labels: string[] = []
labels[MovementColumns.ACCOUNT] = 'Cuenta'
labels[MovementColumns.DESCRIPTION] = 'Descripción'
labels[MovementColumns.DATE] = 'Fecha'
labels[MovementColumns.TYPE] = 'Tipo'
labels[MovementColumns.AMOUNT] = 'Importe'

const columns = historyColumns({ labels })

/** Utilidades usadas por el componente */
const parseOutputData = (data: MovementModel[]): MovementModel[] => {
  return data?.map((movement: MovementModel) => {
    return {
      ...movement,
      type: movement.type === 'income' ? 'Ingresos' : 'Gastos',
      parsedDate: new Date(movement.date).toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }),
    }
  })
}

const HistoryPage = () => {
  const state = useUserStore((state: any) => state)
  const { user } = state
  const [openFiltersDialog, setOpenFiltersDialog] = useState(false)
  const [data, setData] = useState<MovementModel[]>([])
  const historyRows = useHistoryStore((state: any) => state.historyRows)

  useEffect(() => {
    if (historyRows) setData(parseOutputData(historyRows))
  }, [historyRows])

  return (
    <div className="flex h-full w-full flex-col bg-gray-300/70 p-4">
      <header className="mt-2 flex w-full items-start justify-between rounded-md bg-white p-4">
        <span className="text-2xl font-bold text-gray-600">
          Histórico de movimientos
        </span>
        <Button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-500/70"
          onClick={() => setOpenFiltersDialog(true)}>
          <Filter className="h-5 w-5 md:h-6 md:w-6" />
          <span className="hidden md:block">Filtrar</span>
        </Button>
      </header>
      <div className="mt-2 flex h-full w-full flex-col rounded-md bg-white p-4">
        <HistoryFiltersModal
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

export default HistoryPage
