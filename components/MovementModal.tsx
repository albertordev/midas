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
import MovementsForm from '@/components/forms/MovementsForm'

const AccountModal = ({ userId, type, open, setOpen }: EntityFormProps) => {
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
            <DialogTitle className="text-3xl">Nuevo movimiento</DialogTitle>
          )}
          {type === 'modify' && (
            <DialogTitle className="text-3xl">
              Modificación del movimiento
            </DialogTitle>
          )}
          <DialogDescription>
            Introduzca los datos del ingreso o gasto
          </DialogDescription>
        </DialogHeader>
        <MovementsForm userId={userId} setOpen={setOpen} type={type} />
      </DialogContent>
    </Dialog>
  )
}

export default AccountModal
