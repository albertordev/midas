import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, Edit, Trash } from 'lucide-react'
import { RowActions as Actions } from '@/constants'
import ConfirmationMessage from './ConfirmationMessage'
import { useState } from 'react'
import { AccountModel, MovementModel } from '@/types/appwrite.types'
import { deleteAccount } from '@/lib/actions/accounts.actions'
import { toast } from '@/hooks/use-toast'
import { CellActionProps } from '@/types'
import { useAccountActionStore } from '@/store/account-action-store'
import { useMovementActionStore } from '@/store/movement-action-store'
import AccountModal from './AccountModal'
import MovementModal from './MovementModal'
import { useUserStore } from '@/store/auth-store'
import { deleteMovement } from '@/lib/actions/movements.actions'

const CellAction = ({ origin, row, labels, actions }: CellActionProps) => {
  const [openAccountDialog, setOpenAccountDialog] = useState(false)
  const [openMovementDialog, setOpenMovementDialog] = useState(false)
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false)
  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false)
  const setAccountDeleted = useAccountActionStore(
    (state: any) => state.setRowDeleted
  )
  const updateCurrentAccount = useAccountActionStore(
    (state: any) => state.updateCurrentAccount
  )
  const setMovementDeleted = useMovementActionStore(
    (state: any) => state.setRowDeleted
  )
  const updateCurrentMovement = useMovementActionStore(
    (state: any) => state.setRowDeleted
  )
  const state = useUserStore((state: any) => state)
  const { user } = state

  const deleteSelectedAccount = async (accountId: string) => {
    setIsAccountModalOpen(false)
    const response = await deleteAccount(accountId)

    if (response?.status !== 200) {
      toast({
        variant: 'destructive',
        description: response?.data.message,
      })
      return
    }

    /** Notificamos el borrado para actualizar la lista de cuentas */
    setAccountDeleted(true)
  }

  const deleteSelectedMovement = async (movementId: string) => {
    setIsMovementsModalOpen(false)
    const response = await deleteMovement(movementId)

    if (response?.status !== 200) {
      toast({
        variant: 'destructive',
        description: response?.data.message,
      })
      return
    }

    /** Notificamos el borrado para actualizar la lista de movimientos */
    setMovementDeleted(true)
  }

  const updateSelected = (entity: any) => {
    switch (origin) {
      case 'accounts':
        const accountToUpdate: AccountModel = {
          ...entity,
          type: entity.type === 'Ingresos' ? 'income' : 'expenses',
        }
        updateCurrentAccount(accountToUpdate)
        setOpenAccountDialog(true)
        break
      case 'movements':
        const movementToUpdate: MovementModel = {
          ...entity,
          date: new Date(entity.date),
          type: entity.type === 'Ingresos' ? 'income' : 'expenses',
        }

        updateCurrentMovement(movementToUpdate)
        setOpenMovementDialog(true)
        break
      default:
        break
    }
  }

  const openModal = () => {
    switch (origin) {
      case 'accounts':
        setIsAccountModalOpen(true)
        break
      case 'movements':
        setIsMovementsModalOpen(true)
        break
      default:
        break
    }
  }

  if (!labels) return null

  return (
    <div className="text-center text-gray-500">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 focus-visible:ring-gray-500">
            <span className="sr-only">{actions[Actions.HEADER]}</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2"
            onClick={() => updateSelected(row.original)}>
            <Edit className="h-4 w-4" />
            {actions[Actions.EDIT]}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="hover:text-bg-gray-900 flex cursor-pointer items-center gap-2"
            onClick={() => openModal()}>
            <Trash className="h-4 w-4" />
            {actions[Actions.DELETE]}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {/* Modales de confirmación para elimianar registros */}
      <ConfirmationMessage
        title={`¿Está seguro de eliminar la cuenta ${row.original.code}?`}
        description="Esto eliminará permanentemente la cuenta de la base de datos."
        isOpen={isAccountModalOpen}
        onClose={() => setIsAccountModalOpen(false)}
        onConfirm={() => deleteSelectedAccount(row.original.$id)}
        loading={false}
      />
      <ConfirmationMessage
        title={`¿Está seguro de eliminar el movimiento para la cuenta ${row.original.account} y fecha ${new Date(row.original.date).toLocaleDateString()}?`}
        description="Esto eliminará permanentemente el movimiento de la base de datos y actualizará el saldo."
        isOpen={isMovementsModalOpen}
        onClose={() => setIsMovementsModalOpen(false)}
        onConfirm={() => deleteSelectedMovement(row.original.$id)}
        loading={false}
      />
      {/* Diálogos para crear y modificar registros */}
      <div className="w-min-[600px]">
        <AccountModal
          type="modify"
          userId={user.$id}
          open={openAccountDialog}
          setOpen={setOpenAccountDialog}
        />
      </div>
      <div className="w-min-[600px]">
        <MovementModal
          type="modify"
          userId={user.$id}
          open={openMovementDialog}
          setOpen={setOpenMovementDialog}
        />
      </div>
    </div>
  )
}

export default CellAction
