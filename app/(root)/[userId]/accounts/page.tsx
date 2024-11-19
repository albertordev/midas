'use client'

import { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'

import { redirect } from 'next/navigation'

import { CirclePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/DataTable'
import { AccountColumns, RowActions } from '@/constants'
import { accountColumns } from '@/lib/columns'
import AccountModal from '@/components/AccountModal'
import { useUserStore } from '@/store/auth-store'
import { getAccounts } from '@/lib/actions/accounts.actions'
import { AuthResponse } from '@/types'
import { AccountModel } from '@/types/appwrite.types'
import { useAccountActionStore } from '@/store/account-action-store'

/** Array de etiquetas para las columnas con el texto traducido
 * Si alguna vez se traducen las columnas, reaprovechamos el array
 */
const labels: string[] = []
labels[AccountColumns.CODE] = 'Cuenta'
labels[AccountColumns.DESCRIPTION] = 'Descripción'
labels[AccountColumns.ICON] = 'Icono'
labels[AccountColumns.TYPE] = 'Tipo'

const actions: string[] = []
actions[RowActions.HEADER] = 'Acciones'
actions[RowActions.DELETE] = 'Borrar'
actions[RowActions.EDIT] = 'Modificar'

const columns = accountColumns({ labels, actions })

/** Utilidades usadas por el componente */
const parseOutputData = (data: AccountModel[]): AccountModel[] => {
  return data?.map((account: AccountModel) => {
    return {
      ...account,
      type: account.type === 'income' ? 'Ingresos' : 'Gastos',
      icon: account.icon || '/icons/general-account.svg',
    }
  })
}

const AccountsPage = () => {
  const [openAccountDialog, setOpenAccountDialog] = useState(false)
  const state = useUserStore((state: any) => state)
  const [data, setData] = useState<AccountModel[]>([])
  const rowDeleted = useAccountActionStore((state: any) => state.rowDeleted)
  const rowUpdated = useAccountActionStore((state: any) => state.rowUpdated)
  const setRowUpdated = useAccountActionStore(
    (state: any) => state.setRowUpdated
  )
  const setRowDeleted = useAccountActionStore(
    (state: any) => state.setRowDeleted
  )

  const { user } = state
  let response: AuthResponse | undefined

  useEffect(() => {
    getAccountsList(user.$id)
  }, [])

  useEffect(() => {
    if (!state || !user || !user.$id) {
      redirect(`/`)
    }

    if (rowUpdated || rowDeleted) {
      getAccountsList(user.$id)
    }
  }, [user.$id, rowUpdated, rowDeleted])

  const getAccountsList = async (userId: string) => {
    response = await getAccounts(userId)

    if (!response) {
      toast({
        variant: 'destructive',
        description: 'Ha ocurrido un error al recuperar la lista de cuentas',
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
        <span className="text-xl font-bold text-gray-600 sm:text-2xl">
          Lista de cuentas
        </span>
        <Button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-500/70"
          onClick={() => setOpenAccountDialog(true)}>
          <CirclePlus className="h-5 w-5 md:h-6 md:w-6" />
          <span className="hidden md:block">Añadir cuenta</span>
        </Button>
      </header>
      <div className="mt-2 flex h-full w-full rounded-md bg-white p-4">
        <DataTable columns={columns} data={data} hiddenColumnsLabels={labels} />
      </div>
      <div className="w-min-[600px]">
        <AccountModal
          type="create"
          userId={user.$id}
          open={openAccountDialog}
          setOpen={setOpenAccountDialog}
        />
      </div>
    </div>
  )
}

export default AccountsPage
