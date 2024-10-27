import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import CustomFormField from '@/components/CustomFormField'
import { FormFieldType } from '@/constants'
import { Form } from '../ui/form'
import { SelectItem } from '@/components/ui/select'
import { createAccount } from '@/lib/actions/accounts.actions'
import { Account, AccountsFormProps } from '@/types/'

const AccountsForm = ({ type, userId }: AccountsFormProps) => {
  const formSchema = z.object({
    id: z.number().optional(),
    account: z
      .string()
      .min(5, 'El código de cuenta debe tener al menos 5 caracteres')
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      account: '',
      description: '',
      icon: '',
      type: '',
      comments: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const account: Account = {
      userId: userId,
      code: values.account,
      description: values.description,
      icon: values.icon,
      type: values.type,
      comments: values.comments,
    }

    console.log(account)

    try {
      await createAccount(account)
    } catch (error) {
      console.log(error)
    }
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
        <Button className="mt-4 bg-blue-500 hover:bg-blue-500/70" type="submit">
          Guardar
        </Button>
      </form>
    </Form>
  )
}

export default AccountsForm
