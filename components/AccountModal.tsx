'use client'

import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EntityFormProps } from '@/types'
import AccountsForm from '@/components/forms/AccountsForm'

const AccountModal = ({ type, userId, open, setOpen }: EntityFormProps) => {
  const [modalOpen, setModalOpen] = useState(open)

  useEffect(() => {
    setModalOpen(open)
  }, [open])

  useEffect(() => {
    setOpen && setOpen(modalOpen)
  }, [modalOpen])

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="flex w-full flex-col rounded-md md:min-w-[750px]">
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
        <AccountsForm type={type} userId={userId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

export default AccountModal
