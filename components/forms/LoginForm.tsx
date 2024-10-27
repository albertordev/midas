'use client'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import CustomFormField from '@/components/CustomFormField'
import { FormFieldType } from '@/constants'
import { Form } from '@/components/ui/form'
import { loginUser } from '@/lib/actions/user.actions'
import { useParams, useRouter } from 'next/navigation'
import { AuthResponse } from '@/types'
import { useToast } from '@/hooks/use-toast'
import { useState } from 'react'
import Image from 'next/image'
import { useUserStore } from '@/store/auth-store'

const LoginForm = () => {
  const router = useRouter()
  const params = useParams()
  const { locale } = params
  const [isLoading, setIsLoading] = useState(false)
  const saveUser = useUserStore((state: any) => state.saveUser)

  const { toast } = useToast()

  const formSchema = z.object({
    username: z
      .string()
      .min(3, 'El código de usuario debe contener al menos 3 caracteres')
      .max(10, 'El código de usuario debe contener como máximo 10 caracteres'),
    password: z
      .string()
      .min(8, 'La contraseña debe contener al menos 6 caracteres')
      .max(20, 'La contraseña debe contener como máximo 20 caracteres'),
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
      toast({
        variant: 'destructive',
        description: 'Ha ocurrido un error al iniciar sesión',
      })

      return
    }

    switch (errorCode) {
      case 400:
        toast({
          variant: 'destructive',
          description: 'Se han introducido datos incorrectos',
        })
        break
      case 401:
        toast({
          variant: 'destructive',
          description: 'Usuario o contraseña incorrectos',
        })
        break
      case 500:
        toast({
          variant: 'destructive',
          description: 'Ha ocurrido un error al iniciar sesión',
        })
        break
      default:
        toast({
          variant: 'destructive',
          description: 'Ha ocurrido un error al iniciar sesión',
        })
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
              placeholder="Introduce tu usuario"
              iconSrc="/icons/user.svg"
            />
          </div>
          <div className="flex w-72">
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="password"
              type="password"
              placeholder="Introduce tu contraseña"
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
          Iniciar sesión
        </Button>
      </form>
    </Form>
  )
}

export default LoginForm
