'use client'

import { useEffect, useState } from 'react'
import { toast } from '@/hooks/use-toast'

import { redirect } from 'next/navigation'
import { CirclePlus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import DataTable from '@/components/DataTable'
import { AccountColumns } from '@/constants'
import { accountColumns } from '@/lib/columns'
import AccountModal from '@/components/AccountModal'
import { useUserStore } from '@/store/auth-store'
import { getAccounts } from '@/lib/actions/accounts.actions'
import { AuthResponse } from '@/types'
import { AccountModel } from '@/types/appwrite.types'

/** Array de etiquetas para las columnas con el texto traducido
 * Si alguna vez se traducen las columnas, reaprovechamos el array
 */
const labels: string[] = []
labels[AccountColumns.ACCOUNT] = 'Cuenta'
labels[AccountColumns.DESCRIPTION] = 'Descripción'
labels[AccountColumns.ICON] = 'Icono'
labels[AccountColumns.TYPE] = 'Tipo'
labels[AccountColumns.ACTIONS] = 'Acciones'
labels[AccountColumns.EDIT] = 'Modificar'
labels[AccountColumns.DELETE] = 'Borrar'

const columns = accountColumns({ labels })

const parseError = (errorCode: number | undefined): void => {
  if (!errorCode) {
    toast({
      variant: 'destructive',
      description: 'Ha ocurrido un error al recuperar la lista de cuentas',
    })

    return
  }
}

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
  const { user } = state
  let response: AuthResponse | undefined
  let data: AccountModel[]

  useEffect(() => {
    if (!state || !user || !user.$id) {
      redirect(`/`)
    }

    const getAccountsList = async (userId: string) => {
      response = await getAccounts(userId)
      console.log('response', response)

      if (!response || !response.data) {
        toast({
          variant: 'destructive',
          description: 'Ha ocurrido un error al recuperar la lista de cuentas',
        })
      }

      if (response?.status !== 200) {
        parseError(response?.status)
        return
      }
      console.log('data', data)
      parseOutputData(response?.data)
    }

    getAccountsList(user.$id)
  }, [user.$id])

  return (
    <div className="flex h-full w-full flex-col bg-gray-300/70 p-4">
      <header className="mt-2 flex h-16 w-full items-center justify-between rounded-md bg-white p-4">
        <span className="text-2xl font-bold text-gray-600">
          Lista de cuentas
        </span>
        <Button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-500/70"
          onClick={() => setOpenAccountDialog(true)}>
          <CirclePlus className="h-6 w-6" />
          Añadir cuenta
        </Button>
      </header>
      <div className="mt-2 flex h-full w-full rounded-md bg-white p-4">
        <DataTable columns={columns} data={data} />
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
