'use client'

import { redirect, useParams, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { LogOutIcon } from 'lucide-react'
import { useUserStore } from '@/store/auth-store'
import { useRouter } from 'next/navigation'

const Menubar = () => {
  const pathname = usePathname()
  const saveUser = useUserStore((state: any) => state.saveUser)
  const router = useRouter()
  const user = useUserStore((state: any) => state.user)
  let path: string = ''

  if (!user || !user.$id) {
    redirect(`/`)
  }

  path = `${user.$id}`

  const menubarItems = [
    {
      label: 'Cuadro de mandos',
      icon: '/icons/dashboard.svg',
      route: `/${path}/dashboard`,
    },
    {
      label: 'Cuentas',
      icon: '/icons/credit-card.svg',
      route: `/${path}/accounts`,
    },
    {
      label: 'Saldos',
      icon: '/icons/euro.svg',
      route: `/${path}/balance`,
    },
    {
      label: 'Movimientos',
      icon: '/icons/layer-plus.svg',
      route: `/${path}/movements`,
    },
    {
      label: 'Histórico',
      icon: '/icons/transfer.svg',
      route: `/${path}/history`,
    },
    {
      label: 'Presupuesto',
      icon: '/icons/trending-up.svg',
      route: `/${path}/budget`,
    },
  ]

  const LogOut = () => {
    saveUser({ user: null })
    localStorage.removeItem('midas-user')
    router.push(`/`)
  }

  return (
    <aside className="flex h-full w-[5.5rem] flex-col justify-start border-r-2 border-gray-200 bg-gray-200/25 pt-2 md:justify-between lg:w-72">
      <nav className="mt-2 flex flex-col p-4">
        <header className="flex items-center justify-start gap-2 p-2">
          <Image src="/icons/logo.svg" alt="Logo" width={50} height={50} />
          <h1 className="hidden text-3xl font-bold text-gray-600 lg:block">
            Midas
          </h1>
        </header>
        <ul className="flex flex-col gap-4 p-2">
          {menubarItems.map(item => {
            const isActive = pathname === item.route
            return (
              <li key={item.label}>
                <Link
                  href={item.route}
                  className={cn('menuItem', isActive && 'bg-blue-200')}>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <span className="menuText">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <footer className="flex items-center justify-center p-4 md:justify-between">
        <div className="hidden flex-col text-start text-xs text-gray-500 lg:flex">
          <div>Avatar</div>
          <span className="text-[16px] font-semibold">{user && user.name}</span>
        </div>
        <LogOutIcon className="cursor-pointer text-gray-500" onClick={LogOut} />
      </footer>
    </aside>
  )
}

export default Menubar
