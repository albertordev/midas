'use client'

import { useUserStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

import LoginForm from '@/components/forms/LoginForm'

const LoginPage = () => {
  const state = useUserStore((state: any) => state)
  const router = useRouter()

  if (state && state.user && state.user.$id) {
    const id = state.user.$id
    router.push(`/${id}/dashboard`)
  }

  return (
    <div className="flex h-screen min-h-screen">
      <div className="w-full bg-white p-5 sm:w-[60%] md:w-[50%] lg:w-[40%]">
        <div className="flex h-full w-full flex-col items-center justify-center text-left">
          <div className="flex w-80 flex-col items-start justify-center">
            <h1 className="text-left text-3xl font-bold text-gray-600">
              Bienvenido/a a Midas
            </h1>
            <h2 className="mb-4 mt-2 text-left text-gray-500">
              Inicia sesión en el sistema
            </h2>
          </div>
          <LoginForm />
        </div>
      </div>
      <div className="relative hidden sm:block sm:w-[40%] md:w-[50%] lg:w-[60%]">
        <Image src="/icons/login-image.png" alt="Login" fill={true} />
      </div>
    </div>
  )
}

export default LoginPage
