'use client'

import { Dispatch, SetStateAction, useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { AccountsModalProps } from '@/types'
import AccountsForm from './forms/AccountsForm'

const AccountModal = ({ type, userId, open, setOpen }: AccountsModalProps) => {
  const [modalOpen, setModalOpen] = useState(open)

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
            <DialogTitle className="text-3xl">Nueva cuenta</DialogTitle>
          )}
          {type === 'modify' && (
            <DialogTitle className="text-3xl">
              Modificación de la cuenta
            </DialogTitle>
          )}
          <DialogDescription>
            Introduzca los datos de la cuenta
          </DialogDescription>
        </DialogHeader>
        <AccountsForm type={type} userId={userId} />
      </DialogContent>
    </Dialog>
  )
}

export default AccountModal
