'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import CustomFormField from '@/components/CustomFormField'
import { FormFieldType } from '@/constants'
import { Form } from '@/components/ui/form'
import { SelectItem } from '@/components/ui/select'
import { useState } from 'react'
import { createAccount, modifyAccount } from '@/lib/actions/accounts.actions'
import { Account, AuthResponse, EntityFormProps } from '@/types/'
import { useAccountActionStore } from '@/store/account-action-store'
import { toast } from '@/hooks/use-toast'

const formSchema = z.object({
  account: z
    .string()
    .min(3, 'El código de cuenta debe tener al menos 3 caracteres')
    .max(20, 'El código de cuenta no puede sobrepasar los 20 caracteres'),
  description: z
    .string()
    .min(1, 'Introduzca una descripción corta para la cuenta')
    .max(100, 'La descripción no puede contener más 100 caracteres'),
  icon: z.string().optional(),
  type: z.string().min(1, 'Seleccione un tipo de cuenta'),
  comments: z
    .string()
    .max(1000, 'Las observaciones no pueden contener más de 1000 caracteres')
    .optional(),
})

const AccountsForm = ({ type, userId, setOpen }: EntityFormProps) => {
  const setRowUpdated = useAccountActionStore(
    (state: any) => state.setRowUpdated
  )
  const currentAccount = useAccountActionStore(
    (state: any) => state.currentAccount
  )
  const [isSaveAndNew, setIsSaveAndNew] = useState<boolean | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: type === 'modify' ? currentAccount?.code : '',
      description: type === 'modify' ? currentAccount?.description : '',
      icon: '',
      type: type === 'modify' ? currentAccount?.type : '',
      comments: type === 'modify' ? currentAccount?.comments : '',
    },
  })

  const { reset } = form

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isSaveAndNew === null) {
      return
    }

    const account: Account = {
      id: '',
      userId: userId,
      code: values.account,
      description: values.description,
      icon: values.icon,
      type: values.type,
      comments: values.comments,
    }

    if (type === 'create') {
      try {
        const response: AuthResponse | undefined = await createAccount(account)
        if (!response || !response.status) {
          toast({
            variant: 'destructive',
            description: 'Ha ocurrido un error al crear la cuenta',
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

        !isSaveAndNew && setOpen && setOpen(false)
        isSaveAndNew && clear()

        /** Notificamos el cambio para actualizar la lista de cuentas */
        setRowUpdated(true)
      } catch (error) {
        toast({
          variant: 'destructive',
          description: 'Ha ocurrido un error al crear la cuenta',
        })
      }
    } else {
      try {
        account.id = currentAccount.$id
        const response: AuthResponse | undefined = await modifyAccount(account)

        if (!response || !response.status) {
          toast({
            variant: 'destructive',
            description: 'Ha ocurrido un error al modificar la cuenta',
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

        !isSaveAndNew && setOpen && setOpen(false)
        isSaveAndNew && clear()

        /** Notificamos el cambio para actualizar la lista de cuentas */
        setRowUpdated(true)
      } catch (error) {
        toast({
          variant: 'destructive',
          description: 'Ha ocurrido un error al modificar la cuenta',
        })
      }
    }
  }

  const clear = () => {
    // if(currentAccount){
    form.reset({
      account: '',
      description: '',
      icon: '',
      type: '',
      comments: '',
    })
    // }
    reset()
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col justify-between gap-4">
        <div className="flex flex-col gap-4">
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="account"
            label="Cuenta"
            placeholder="Introduzca el código de la cuenta"
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="description"
            label="Descripción"
            placeholder="Introduzca la descripción"
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="type"
            label="Tipo"
            placeholder="Seleccione el tipo">
            <SelectItem value="income">Ingresos</SelectItem>
            <SelectItem value="expenses">Gastos</SelectItem>
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="comments"
            label="Observaciones"
            placeholder="Introduzca las observaciones (máximo 1000 caracteres)"
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
              className="sm:text-md mt-4 max-w-[200px] text-xs"
              variant="ghost"
              type="button"
              onClick={() => setOpen(false)}>
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

export default AccountsForm
