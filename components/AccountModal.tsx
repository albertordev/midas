'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useTranslations } from 'use-intl'
import { AccountsModalProps } from '@/types'
import AccountsForm from './forms/AccountsForm'

const AccountModal = ({ type, open, setOpen }: AccountsModalProps) => {
  const [modalOpen, setModalOpen] = useState(open)
  const t = useTranslations('Accounts')

  useEffect(() => {
    setModalOpen(open)
  }, [open])

  useEffect(() => {
    setOpen && setOpen(modalOpen)
  }, [modalOpen])

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="flex min-w-[750px] flex-col">
        <DialogHeader className="w-full text-gray-600">
          {type === 'create' && (
            <DialogTitle className="text-3xl">{`${t('titleNew')}`}</DialogTitle>
          )}
          {type === 'modify' && (
            <DialogTitle className="text-3xl">{`${t('titleModify')}`}</DialogTitle>
          )}
          <DialogDescription>{t('subtitle')}</DialogDescription>
        </DialogHeader>
        <AccountsForm type={type} />
      </DialogContent>
    </Dialog>
  )
}

export default AccountModal
