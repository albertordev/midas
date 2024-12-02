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
import BudgetsForm from '@/components/forms/BudgetsForm'
import { useBudgetActionStore } from '@/store/budget-action-store'

const BudgetModal = ({ userId, type, open, setOpen }: EntityFormProps) => {
  const [modalOpen, setModalOpen] = useState(open)
  const rowUpdated = useBudgetActionStore((state: any) => state.rowUpdated)

  useEffect(() => {
    setModalOpen(open)
  }, [open])

  useEffect(() => {
    setOpen && setOpen(modalOpen!)
  }, [modalOpen, rowUpdated])

  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogContent className="flex w-full flex-col rounded-md md:min-w-[750px]">
        <DialogHeader className="w-full text-gray-600">
          {type === 'create' && (
            <DialogTitle className="text-3xl">Nuevo presupuesto</DialogTitle>
          )}
          {type === 'modify' && (
            <DialogTitle className="text-3xl">
              Modificación del presupuesto
            </DialogTitle>
          )}
          <DialogDescription>
            Introduzca los presupuestos por período y año
          </DialogDescription>
        </DialogHeader>
        <BudgetsForm userId={userId} setOpen={setModalOpen} type={type} />
      </DialogContent>
    </Dialog>
  )
}

export default BudgetModal
