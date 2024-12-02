'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import CustomFormField from '@/components/CustomFormField'
import { FormFieldType } from '@/constants'
import { Form } from '../ui/form'
import { SelectItem } from '@/components/ui/select'
import { Movement, EntityFormProps, AuthResponse } from '@/types'
import { createMovement, modifyMovement } from '@/lib/actions/movements.actions'
import { useEffect, useState } from 'react'
import { getAccounts } from '@/lib/actions/accounts.actions'
import { toast } from '@/hooks/use-toast'
import { AccountModel } from '@/types/appwrite.types'
import { useMovementActionStore } from '@/store/movement-action-store'

const formSchema = z.object({
  account: z.string().min(1, 'Seleccione una cuenta'),
  description: z
    .string()
    .min(1, 'Introduzca una descripción corta para el movimiento')
    .max(100, 'La descripción no puede contener más 100 caracteres'),
  date: z.date(),
  amount: z.coerce.number({
    required_error: 'El importe es obligatorio',
  }),
})

const parseOutputData = (data: AccountModel[]): AccountModel[] => {
  return data?.map((account: AccountModel) => {
    return {
      ...account,
      parsedType: account.type === 'income' ? 'Ingresos' : 'Gastos',
    }
  })
}

const MovementsForm = ({ type, userId, setOpen }: EntityFormProps) => {
  const setRowUpdated = useMovementActionStore(
    (state: any) => state.setRowUpdated
  )
  const currentMovement = useMovementActionStore(
    (state: any) => state.currentMovement
  )

  let accountsResponse: AuthResponse | undefined
  const [currentAccount, setCurrentAccount] = useState<AccountModel | null>(
    null
  )
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  const [isSaveAndNew, setIsSaveAndNew] = useState<boolean | null>(null)
  const [accounts, setAccounts] = useState<AccountModel[]>([])
  const [isDatabaseChanged, setIsDatabaseChanged] = useState(false)

  const defaultValues = {
    account: type === 'modify' ? currentMovement?.account : null,
    description: type === 'modify' ? currentMovement?.description : '',
    date: type === 'modify' ? new Date(currentMovement?.date) : undefined,
    amount: type === 'modify' ? currentMovement?.amount : 0,
  }
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })
  const { reset} = form

  useEffect(() => {
    getAccountsList(userId)
  }, [])

  const getAccountsList = async (userId: string) => {
    setIsLoadingAccounts(true)
    accountsResponse = await getAccounts(userId)

    if (!accountsResponse || !accountsResponse.data) {
      toast({
        variant: 'destructive',
        description: 'Ha ocurrido un error al recuperar la lista de cuentas',
      })
      return
    }

    if (accountsResponse?.status !== 200) {
      toast({
        variant: 'destructive',
        description: accountsResponse?.data.message,
      })
      return
    }

    accountsResponse?.data &&
      setAccounts(parseOutputData(accountsResponse?.data))
    setIsLoadingAccounts(false)
  }

  const handleSelect = (value: any) => {
    const selectedAccount = accounts.find(
      (account: AccountModel) => account.code === value
    )

    if (selectedAccount) {
      setCurrentAccount(selectedAccount)
    }
  }

  const openModal = (open: boolean) => {
    if (!open && isDatabaseChanged) {
      /** Notificamos el cambio para actualizar la lista de presupuestos */
      setRowUpdated(true)
    }

    setOpen(open)
  }

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSaveAndNew === null) {
      return
    }

    if (type === 'create' && !currentAccount) {
      toast({
        variant: 'destructive',
        description: 'Seleccione una cuenta',
      })
      return
    }

    if (type === 'create') {
      try {
        const movement: Movement = {
          id: '',
          type: currentAccount?.type ?? '' /** Siempre tendrá un valor */,
          accountName: currentAccount?.description,
          userId: userId,
          account: values.account,
          description: values.description,
          date: values.date,
          amount: values.amount,
        }
        const response: AuthResponse | undefined =
          await createMovement(movement)
        if (!response || !response?.data) {
          toast({
            variant: 'destructive',
            description: 'Ha ocurrido un error al crear el movimiento',
          })
          return
        }

        if (response?.status !== 200) {
          toast({
            variant: 'destructive',
            description: response?.data.message,
          })
          return
        }

        if (isSaveAndNew) {
          clear()
          /** Notificamos que se ha producido un cambio en la bbdd y por lo
           *  tanto tendremos que recargar la lista cuando salgamos de la
           *  pantalla
           */
          setIsDatabaseChanged(true)
        }else{
          /** Notificamos el cambio para actualizar la lista de presupuestos 
           *  y salimos
          */
          setRowUpdated(true)
          setOpen && setOpen(false)
        }        
      } catch (error) {
        toast({
          variant: 'destructive',
          description:
            'Ha ocurrido un error al crear el registro del movimiento',
        })
      }
    } else {
      try {
        const movement: Movement = {
          id: currentMovement.$id,
          type: currentMovement.type,
          accountName: currentAccount?.description,
          userId: userId,
          account: values.account,
          description: values.description,
          date: values.date,
          amount: values.amount,
        }

        const response: AuthResponse | undefined = await modifyMovement(movement)

        if (!response || !response?.data) {
          toast({
            variant: 'destructive',
            description: 'Ha ocurrido un error al crear el movimiento',
          })
          return
        }

        if (response?.status !== 200) {
          toast({
            variant: 'destructive',
            description: response?.data.message,
          })
          return
        }

        if (isSaveAndNew) {
          clear()
          /** Notificamos que se ha producido un cambio en la bbdd y por lo
           *  tanto tendremos que recargar la lista cuando salgamos de la
           *  pantalla
           */
          setIsDatabaseChanged(true)
        }else{
          /** Notificamos el cambio para actualizar la lista de presupuestos 
           *  y salimos
          */
          setRowUpdated(true)
          setOpen && setOpen(false)
        }        
      } catch (error) {
        toast({
          variant: 'destructive',
          description:
            'Ha ocurrido un error al guardar el registro del movimiento',
        })
      }
    }
  }

  const clear = () => {
    reset({
      account: '',
      description: '',
      date: null!,
      amount: 0,
    })
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col justify-between gap-4">
        {isLoadingAccounts ? (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="account"
            label="Cuenta"
            placeholder="Seleccione la cuenta">
            <SelectItem
              className="text-sm text-gray-400"
              key="loading"
              value="loading">
              Cargando cuentas...
            </SelectItem>
          </CustomFormField>
        ) : (
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="account"
            label="Cuenta"
            placeholder="Seleccione la cuenta"
            onSelectValueChanged={(value: any) => handleSelect(value)}>
            {accounts.map((account: AccountModel) => (
              <SelectItem key={account.code} value={account.code}>
                {`${account.description} (${account.code} - ${account.parsedType})`}
              </SelectItem>
            ))}
          </CustomFormField>
        )}
        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="description"
          label="Descripción"
          placeholder="Introduzca la descripción"
        />
        <div className="max-w-[200px]">
          <CustomFormField
            fieldType={FormFieldType.DATE_PICKER}
            control={form.control}
            name="date"
            label="Fecha"
            dateFormat="dd/MM/yyyy"
          />
        </div>
        <div className="max-w-[200px]">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            type="number"
            name="amount"
            label="Importe"
            placeholder="Introduzca el importe"
          />
        </div>
        <div className="flex items-center justify-between gap-2">
          <Button
            className="sm:text-md mt-4 max-w-[200px] border-gray-700 text-xs focus-visible:ring-0"
            variant="outline"
            type="button"
            onClick={clear}>
            Limpiar
          </Button>

          <div className="flex items-center justify-end gap-2">
            <Button
              className="mt-4 max-w-[200px]"
              variant="ghost"
              type="button"
              onClick={() => openModal(false)}>
              Cancelar
            </Button>
            <Button
              className="sm:text-md mt-4 max-w-[200px] bg-green-600 text-xs hover:bg-green-600/70"
              type="submit"
              onClick={() => setIsSaveAndNew(false)}>
              Guardar
            </Button>
            <Button
              className="sm:text-md mt-4 max-w-[200px] bg-blue-500 text-xs hover:bg-blue-500/70"
              type="submit"
              onClick={() => setIsSaveAndNew(true)}>
              Guardar y nuevo
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}

export default MovementsForm
