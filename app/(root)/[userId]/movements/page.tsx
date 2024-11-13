'use client'

import MovementsForm from '@/components/forms/MovementsForm'
import { toast } from '@/hooks/use-toast'
import { getAccounts } from '@/lib/actions/accounts.actions'
import MovementModal from '@/components/MovementModal'
import { useUserStore } from '@/store/auth-store'
import { Account, AuthResponse, Movement } from '@/types'
import { useEffect, useState } from 'react'
import { CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/DataTable'
import { MovementColumns, RowActions } from '@/constants'
import { movementColumns } from '@/lib/columns'
import { getMovements } from '@/lib/actions/movements.actions'
import { MovementModel } from '@/types/appwrite.types'
import { useMovementActionStore } from '@/store/movement-action-store'
import { redirect } from 'next/navigation'

/** Array de etiquetas para las columnas con el texto traducido
 * Si alguna vez se traducen las columnas, reaprovechamos el array
 */
const labels: string[] = []
labels[MovementColumns.ACCOUNT] = 'Cuenta'
labels[MovementColumns.DESCRIPTION] = 'Descripción'
labels[MovementColumns.DATE] = 'Fecha'
labels[MovementColumns.TYPE] = 'Tipo'
labels[MovementColumns.AMOUNT] = 'Cantidad'

const actions: string[] = []
actions[RowActions.HEADER] = 'Acciones'
actions[RowActions.DELETE] = 'Borrar'
actions[RowActions.EDIT] = 'Modificar'

const columns = movementColumns({ labels, actions })

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

const MovementsPage = () => {
  const state = useUserStore((state: any) => state)
  const { user } = state
  let response: AuthResponse | undefined
  const [data, setData] = useState<MovementModel[]>([])
  const [openMovementDialog, setOpenMovementDialog] = useState(false)
  const rowDeleted = useMovementActionStore((state: any) => state.rowDeleted)
  const rowUpdated = useMovementActionStore((state: any) => state.rowUpdated)
  const setRowUpdated = useMovementActionStore(
    (state: any) => state.setRowUpdated
  )
  const setRowDeleted = useMovementActionStore(
    (state: any) => state.setRowDeleted
  )

  useEffect(() => {
    getMovementsList(user.$id)
  }, [])

  useEffect(() => {
    if (!state || !user || !user.$id) {
      redirect(`/`)
    }

    if (rowUpdated || rowDeleted) {
      getMovementsList(user.$id)
    }
  }, [user.$id, rowUpdated, rowDeleted])

  const getMovementsList = async (userId: string) => {
    response = await getMovements(userId)

    if (!response) {
      toast({
        variant: 'destructive',
        description:
          'Ha ocurrido un error al recuperar la lista de movimientos',
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
          Lista de movimientos
        </span>
        <Button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-500/70"
          onClick={() => setOpenMovementDialog(true)}>
          <CirclePlus className="h-6 w-6" />
          Añadir movimiento
        </Button>
      </header>
      <div className="mt-2 flex h-full w-full rounded-md bg-white p-4">
        <DataTable columns={columns} data={data} hiddenColumnsLabels={labels} />
      </div>
      <div className="w-min-[600px]">
        <MovementModal
          type="create"
          userId={user.$id}
          open={openMovementDialog}
          setOpen={setOpenMovementDialog}
        />
      </div>
    </div>
  )
}

export default MovementsPage
