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
import { AuthResponse, FiltersProps } from '@/types'
import { AccountModel } from '@/types/appwrite.types'
import { getBalances } from '@/lib/actions/balance.actions'
import { useBalanceStore } from '@/store/balance-action-store'
import { buildPeriodsList, buildYearsList, getPeriodValue } from '@/lib/utils'

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
  period: z.string().optional(),
  year: z.coerce.number().optional(),
})

const BalanceFiltersForm = ({ userId, setOpen }: FiltersProps) => {
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false)
  let accountsResponse: AuthResponse | undefined
  const [accounts, setAccounts] = useState<AccountModel[]>([])
  const setBalanceRows = useBalanceStore((state: any) => state.setBalanceRows)
  const [years, setYears] = useState<number[]>(buildYearsList())
  const [periods, setPeriods] = useState<any[]>(buildPeriodsList('es'))

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      account: '',
      type: '',
      period: '',
      year: 0,
    },
  })
  const { reset } = form

  useEffect(() => {
    setYears(buildYearsList())
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
    const filterValues = {
      userId,
      account: values.account,
      type: values.type,
      period: values.period ? getPeriodValue(values.period) : undefined,
      year: values.year,
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

    try {
      const response = await getBalances(filterValues)

      if (!response) {
        toast({
          variant: 'destructive',
          description: 'Ha ocurrido un error al obtener los saldos',
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

      setBalanceRows(response?.data)
      setOpen(false)
    } catch (error) {
      console.log(error)
      toast({
        variant: 'destructive',
        description: 'Ha ocurrido un error al obtener los saldos',
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
          <div className="flex flex-col gap-4 sm:flex-row">
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
          <div className="flex flex-col gap-4 sm:flex-row">
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

export default BalanceFiltersForm
