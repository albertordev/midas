'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import CustomFormField from '@/components/CustomFormField'
import { FormFieldType } from '@/constants'
import { Form } from '../ui/form'
import { SelectItem } from '@/components/ui/select'
import { EntityFormProps, AuthResponse, Budget } from '@/types'
import { createBudget, modifyBudget } from '@/lib/actions/budget.actions'
import { useEffect, useState } from 'react'
import { getAccounts } from '@/lib/actions/accounts.actions'
import { toast } from '@/hooks/use-toast'
import { AccountModel } from '@/types/appwrite.types'
import { useBudgetActionStore } from '@/store/budget-action-store'
import {
  buildPeriodsList,
  buildYearsList,
  getPeriodName,
  getPeriodValue,
} from '@/lib/utils'

const formSchema = z.object({
  account: z.string().min(1, 'Seleccione una cuenta'),
  period: z.string().min(1, 'Seleccione un período'),
  year: z.coerce.number({
    required_error: 'Seleccione un año',
  }),
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

const BudgetsForm = ({ type, userId, setOpen }: EntityFormProps) => {
  const setRowUpdated = useBudgetActionStore(
    (state: any) => state.setRowUpdated
  )
  const currentBudget = useBudgetActionStore(
    (state: any) => state.currentBudget
  )

  let accountsResponse: AuthResponse | undefined
  const [currentAccount, setCurrentAccount] = useState<AccountModel | null>(
    null
  )
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  const [isSaveAndNew, setIsSaveAndNew] = useState<boolean | null>(null)
  const [accounts, setAccounts] = useState<AccountModel[]>([])
  const [years, setYears] = useState<number[]>(buildYearsList())
  const [periods, setPeriods] = useState<any[]>(buildPeriodsList('es'))
  const [isDatabaseChanged, setIsDatabaseChanged] = useState(false)

  const defaultValues = {
    account: type === 'modify' ? currentBudget?.account : null,
    period: type === 'modify' ? getPeriodName(currentBudget?.period) : '',
    year: type === 'modify' ? currentBudget?.year.toString() : '',
    amount: type === 'modify' ? currentBudget?.amount : 0,
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
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
        const budget: Budget = {
          id: '',
          type: currentAccount?.type ?? '' /** Siempre tendrá un valor */,
          userId: userId,
          account: values.account,
          accountName: currentAccount?.description,
          period: values.period ? getPeriodValue(values.period) : undefined,
          year: values.year,
          amount: values.amount,
        }

        const response: AuthResponse | undefined = await createBudget(budget)
        if (!response || !response?.data) {
          toast({
            variant: 'destructive',
            description:
              'Ha ocurrido un error al crear el registro de presupuesto',
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
            'Ha ocurrido un error al crear el registro de presupuesto',
        })
      }
    } else {
      try {
        const budget: Budget = {
          id: currentBudget.$id,
          type: currentBudget.type,
          userId: userId,
          account: values.account,
          accountName: currentAccount?.description,
          period: values.period ? getPeriodValue(values.period) : undefined,
          year: values.year,
          amount: values.amount,
        }

        const response: AuthResponse | undefined = await modifyBudget(budget)

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
            'Ha ocurrido un error al guardar el registro del presupuesto',
        })
      }
    }
  }

  const clear = () => {
    reset({
      account: '',
      year: 0,
      period: '',
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
                {`${account.description} (${account.parsedType})`}
              </SelectItem>
            ))}
          </CustomFormField>
        )}
        <div className="flex gap-4">
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="year"
            label="Año"
            placeholder="Seleccione un año">
            {years.map((year: number) => (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            ))}
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="period"
            label="Mes"
            placeholder="Seleccione un mes">
            {periods.map((period: any) => (
              <SelectItem key={period.value} value={period.name}>
                {period.name}
              </SelectItem>
            ))}
          </CustomFormField>
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
              onClick={() => openModal(false)}>
              Cancelar
            </Button>
            <Button
              className="mt-4 max-w-[200px] bg-green-600 hover:bg-green-600/70"
              type="submit"
              onClick={() => setIsSaveAndNew(false)}>
              Guardar
            </Button>
            <Button
              className="mt-4 max-w-[200px] bg-blue-500 hover:bg-blue-500/70"
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

export default BudgetsForm
