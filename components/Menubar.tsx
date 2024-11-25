'use client'

import { redirect, useParams, usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { cn } from '@/lib/utils'
import { LogOutIcon } from 'lucide-react'
import { useUserStore } from '@/store/auth-store'
import { useEffect, useState } from 'react'

const Menubar = () => {
  const pathname = usePathname()
  const resetUser = useUserStore((state: any) => state.resetUser)
  const user = useUserStore((state: any) => state.user)
  const [avatarBackground, setAvatarBackground] = useState('bg-gray-500')
  const [avatarLetter, setAvatarLetter] = useState('X')
  let path: string = ''

  if (!user || !user.$id) {
    redirect(`/`)
  }

  useEffect(() => {
    const avatarLetter = user.name.charAt(0).toUpperCase()
    setAvatarLetter(avatarLetter)
    setAvatarBackground(user.avatarColor)
  }, [])

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
      label: 'Presupuestos',
      icon: '/icons/trending-up.svg',
      route: `/${path}/budget`,
    },
  ]

  console.log(avatarBackground)

  const LogOut = () => {
    resetUser()
    localStorage.removeItem('midas-user')
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
                    className="min-h-4 min-w-4"
                  />
                  <span className="menuText">{item.label}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <footer className="flex flex-col items-center justify-center gap-2 p-4 md:justify-between lg:flex-row">
        <div className="flex items-center justify-center gap-2 text-start text-xs text-gray-500">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-white',
              avatarBackground ?? 'bg-gray-500'
            )}>
            A
          </div>
          <span className="hidden text-[16px] font-semibold lg:block">
            {user && user.name}
          </span>
        </div>
        <LogOutIcon className="cursor-pointer text-gray-500" onClick={LogOut} />
      </footer>
    </aside>
  )
}

export default Menubar
