'use client'

import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { CirclePlus } from 'lucide-react'

import DataTable from '@/components/DataTable'

import { AccountColumns } from '@/constants'
import { accountColumns } from '@/lib/columns'
import { accountData } from '@/constants/mockup'
import AccountModal from '@/components/AccountModal'
import { useState } from 'react'

const AccountsPage = () => {
  const t = useTranslations('Accounts')
  const tt = useTranslations('Global')

  const data = accountData

  /** Array de etiquetas para las columnas con el texto traducido */
  const labels: string[] = []
  labels[AccountColumns.ACCOUNT] = t('account')
  labels[AccountColumns.DESCRIPTION] = t('description')
  labels[AccountColumns.ICON] = t('icon')
  labels[AccountColumns.TYPE] = t('type')
  labels[AccountColumns.ACTIONS] = tt('actions')
  labels[AccountColumns.EDIT] = tt('edit')
  labels[AccountColumns.DELETE] = tt('delete')

  const columns = accountColumns({ labels })
  const [openAccountDialog, setOpenAccountDialog] = useState(false)

  return (
    <div className="flex h-full w-full flex-col bg-gray-300/70 p-4">
      <header className="mt-2 flex h-16 w-full items-center justify-between rounded-md bg-white p-4">
        <span className="text-2xl font-bold text-gray-600">{t('header')}</span>
        <Button
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-500/70"
          onClick={() => setOpenAccountDialog(true)}>
          <CirclePlus className="h-6 w-6" />
          {t('addAccount')}
        </Button>
      </header>
      <div className="mt-2 flex h-full w-full rounded-md bg-white p-4">
        <DataTable columns={columns} data={data} translations={t} />
      </div>
      <div className="w-min-[600px]">
        <AccountModal
          type="create"
          open={openAccountDialog}
          setOpen={setOpenAccountDialog}
        />
      </div>
    </div>
  )
}

export default AccountsPage
