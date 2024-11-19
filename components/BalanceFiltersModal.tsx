'use client'

import { useEffect, useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { FiltersProps } from '@/types'
import BalanceFiltersForm from '@/components/forms/BalanceFiltersForm'

const BalanceFiltersModal = ({ userId, open, setOpen }: FiltersProps) => {
  const [modalOpen, setModalOpen] = useState(open)

  useEffect(() => {
    setModalOpen(open)
  }, [open])

  useEffect(() => {
    setOpen && setOpen(modalOpen)
  }, [modalOpen])

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="flex w-full flex-col sm:rounded-md md:min-w-[750px]">
        <DialogHeader className="w-full text-gray-600">
          <DialogTitle className="text-3xl">
            Filtro de consulta de saldos
          </DialogTitle>
          <DialogDescription>
            Filtre los saldos registrados en la aplicación
          </DialogDescription>
        </DialogHeader>
        <BalanceFiltersForm userId={userId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

export default BalanceFiltersModal
