import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import CustomFormField from '../CustomFormField'
import { FormFieldType } from '@/constants'
import { Form } from '../ui/form'
import { useTranslations } from 'next-intl'
import { SelectItem } from '../ui/select'

const AccountsForm = ({ type }: { type: 'create' | 'modify' }) => {
  const t = useTranslations('Accounts')
  const tt = useTranslations('Global')

  const formSchema = z.object({
    id: z.number().optional(),
    account: z
      .string()
      .min(5, t('accountMinLength'))
      .max(20, t('accountMaxLength')),
    description: z
      .string()
      .min(1, t('descriptionMinLength'))
      .max(100, t('descriptionMaxLength')),
    icon: z.string().optional(),
    type: z.string().min(1, t('typeMinLength')),
    comments: z.string().max(1000, t('commentsMaxLength')).optional(),
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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const account = {
      userId: 'alberto',
      account: values.account,
      description: values.description,
      icon: values.icon,
      type: values.type,
      comments: values.comments,
    }

    console.log(account)
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
            label={t('account')}
            placeholder={t('accountPlaceholder')}
          />
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="description"
            label={t('description')}
            placeholder={t('descriptionPlaceholder')}
          />
          <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="type"
            label={t('type')}
            placeholder={t('typePlaceholder')}>
            <SelectItem value="Income">{t('incomeType')}</SelectItem>
            <SelectItem value="Expenses">{t('expensesType')}</SelectItem>
          </CustomFormField>
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="comments"
            label={t('comments')}
            placeholder={t('commentsPlaceholder')}
          />
        </div>
        <Button className="mt-4 bg-blue-500 hover:bg-blue-500/70" type="submit">
          {tt('save')}
        </Button>
      </form>
    </Form>
  )
}

export default AccountsForm
