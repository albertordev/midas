'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import CustomFormField from '@/components/CustomFormField'
import { FormFieldType } from '@/constants'
import { Form } from '@/components/ui/form'
import { useTranslations } from 'next-intl'
import { loginUser } from '@/lib/actions/user.actions'
import { useParams, useRouter } from 'next/navigation'
import { AuthResponse } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import Image from 'next/image'
import { useUserStore } from '@/store/auth-store'

const LoginForm = () => {
  const t = useTranslations('Login')
  const router = useRouter()
  const params = useParams()
  const { locale } = params
  const [isLoading, setIsLoading] = useState(false)
  const saveUser = useUserStore((state: any) => state.saveUser)

  const { toast } = useToast()

  const formSchema = z.object({
    username: z
      .string()
      .min(3, t('usernameMinLength'))
      .max(10, t('usernameMaxLength')),
    password: z
      .string()
      .min(8, t('passwordMinLength'))
      .max(20, t('passwordMaxLength')),
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response: AuthResponse | undefined = await loginUser(
        values.username,
        values.password
      )

      if (response?.status !== 200) {
        parseError(response?.status)
        return
      }

      const loggedUser = response?.data

      if (loggedUser && response?.status === 200) {
        router.push(`/${locale}/${loggedUser?.$id}/dashboard`)
      }
      saveUser({ user: loggedUser })
    } catch (error: AuthResponse | any) {
      error && parseError(error.status)
    } finally {
      setIsLoading(false)
    }
  }

  const parseError = (errorCode: number | undefined): void => {
    if (!errorCode) {
      toast({ variant: 'destructive', description: t('generalError') })

      return
    }

    switch (errorCode) {
      case 400:
        toast({ variant: 'destructive', description: t('invalidData') })
        break
      case 401:
        toast({ variant: 'destructive', description: t('invalidCredentials') })
        break
      case 500:
        toast({ variant: 'destructive', description: t('generalError') })
        break
      default:
        toast({ variant: 'destructive', description: t('generalError') })
        break
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-auto w-80 flex-col justify-between gap-4">
        <div className="mt-4 flex flex-col items-center gap-4">
          <div className="flex w-72">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="username"
              placeholder={t('usernamePlaceholder')}
              iconSrc="/icons/user.svg"
            />
          </div>
          <div className="flex w-72">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              iconSrc="/icons/password.svg"
            />
          </div>
        </div>
        <Button
          disabled={isLoading}
          className="mt-4 flex w-full gap-2 rounded-3xl bg-blue-500 hover:bg-blue-500/70"
          type="submit">
          {isLoading && (
            <Image
              src="/icons/loader.svg"
              width={20}
              height={20}
              alt="Loading..."
            />
          )}
          {t('loginButton')}
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
