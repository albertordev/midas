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
import HistoryFiltersForm from '@/components/forms/HistoryFiltersForm'

const HistoryFiltersModal = ({ userId, open, setOpen }: FiltersProps) => {
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
          <DialogTitle className="text-3xl">
            Filtro de histórico de movimientos
          </DialogTitle>
          <DialogDescription>
            Filtre la lista de movimientos para ver los que se han realizado
          </DialogDescription>
        </DialogHeader>
        <HistoryFiltersForm userId={userId} setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  )
}

export default HistoryFiltersModal
