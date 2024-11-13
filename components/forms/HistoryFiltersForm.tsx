'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { SelectItem } from '../ui/select'
import CustomFormField from '@/components/CustomFormField'
import { FormFieldType } from '@/constants'
import { Form } from '@/components/ui/form'
import { getAccounts } from '@/lib/actions/accounts.actions'
import { toast } from '@/hooks/use-toast'
import { AuthResponse, HistoryFiltersProps } from '@/types'
import { AccountModel } from '@/types/appwrite.types'
import { getMovementsHistory } from '@/lib/actions/movements.actions'
import { useHistoryStore } from '@/store/movement-action-store'

const parseOutputData = (data: AccountModel[]): AccountModel[] => {
  return data?.map((account: AccountModel) => {
    return {
      ...account,
      parsedType: account.type === 'income' ? 'Ingresos' : 'Gastos',
    }
  })
}

const formSchema = z.object({
  account: z.string().optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
  amountFrom: z.coerce.number().optional(),
  amountTo: z.coerce.number().optional(),
})

const HistoryFiltersModal = ({ userId, setOpen }: HistoryFiltersProps) => {
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  let accountsResponse: AuthResponse | undefined
  const [accounts, setAccounts] = useState<AccountModel[]>([])
  const setHistoryList = useHistoryStore((state: any) => state.setHistoryList)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: '',
      type: '',
      description: '',
      dateFrom: undefined,
      dateTo: undefined,
      amountFrom: 0,
      amountTo: 0,
    },
  })
  const { reset } = form

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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values)
    const filterValues = {
      userId,
      account: values.account,
      type: values.type,
      description: values.description,
      dateFrom: values.dateFrom ? new Date(values.dateFrom?.toString()) : null,
      dateTo: values.dateTo ? new Date(values.dateTo?.toString()) : null,
      amountFrom: values.amountFrom,
      amountTo: values.amountTo,
    }

    /** Comprobamos que la selección es coherente  */
    if (filterValues.account !== '' && filterValues.type !== '') {
      const selectedAccount = accounts.find(
        account => account.code === filterValues.account
      )
      if (selectedAccount?.type !== filterValues.type) {
        toast({
          variant: 'destructive',
          description: 'La cuenta seleccionada no es del tipo seleccionado',
        })
        return
      }
    }

    if (filterValues.amountFrom && filterValues.amountTo) {
      if (filterValues.amountFrom > filterValues.amountTo) {
        toast({
          variant: 'destructive',
          description: 'El importe de inicio debe ser menor al importe fin',
        })
        return
      }
    }

    /** Comprobamos que la fecha de inicio es anterior a la de fin */
    if (filterValues.dateFrom && filterValues.dateTo) {
      if (filterValues.dateFrom > filterValues.dateTo) {
        toast({
          variant: 'destructive',
          description: 'La fecha de inicio debe ser anterior a la fecha fin',
        })
        return
      }
    }

    try {
      const response = await getMovementsHistory(filterValues)

      if (!response) {
        toast({
          variant: 'destructive',
          description:
            'Ha ocurrido un error al obtener el histórico de movimientos',
        })
        setOpen(false)
        return
      }

      if (response?.status !== 200) {
        toast({
          variant: 'destructive',
          description: response?.data.message,
        })
        setOpen(false)
        return
      }

      setHistoryList(response?.data)
      setOpen(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        description:
          'Ha ocurrido un error al obtener el histórico de movimientos',
      })
    }
  }

  const clear = () => {
    reset()
  }

  return (
    <div className="flex w-full flex-col gap-2">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex h-full flex-col justify-between gap-4">
          <div className="flex gap-4">
            {isLoadingAccounts ? (
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="account"
                label="Cuenta"
                placeholder="Seleccione una cuenta">
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
                placeholder="Seleccione una cuenta">
                {accounts.map((account: AccountModel) => (
                  <SelectItem key={account.code} value={account.code}>
                    {`${account.description} (${account.parsedType})`}
                  </SelectItem>
                ))}
              </CustomFormField>
            )}
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="type"
              label="Tipo"
              placeholder="Seleccione un tipo">
              <SelectItem value="income">Ingresos</SelectItem>
              <SelectItem value="expenses">Gastos</SelectItem>
            </CustomFormField>
          </div>
          <div className="flex gap-4">
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="dateFrom"
              label="Fecha desde"
              dateFormat="dd/MM/yyyy"
            />
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="dateTo"
              label="Hasta"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div className="flex gap-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="description"
              label="Descripción"
              placeholder="Introduzca una descripción"
            />
          </div>
          <div className="flex gap-4">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              type="number"
              name="amountFrom"
              label="Importe desde"
              placeholder="Introduzca un importe"
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              type="number"
              name="amountTo"
              label="Hasta"
              placeholder="Introduzca una importe"
            />
          </div>
          <div className="flex items-center justify-between gap-2">
            <Button
              className="mt-4 max-w-[200px] border-gray-700 focus-visible:ring-0"
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
                onClick={() => setOpen(false)}>
                Cancelar
              </Button>
              <Button
                className="mt-4 max-w-[200px] bg-blue-500 hover:bg-blue-500/70"
                type="submit">
                Aceptar
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default HistoryFiltersModal
