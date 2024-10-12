'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'

import { cn } from '@/lib/utils'

const Menubar = () => {
  /** Traducciones */
  const t = useTranslations('Menu')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const menubarItems = [
    {
      label: t('dashboard'),
      icon: '/icons/dashboard.svg',
      route: `/${locale}/dashboard`,
    },
    {
      label: t('accounts'),
      icon: '/icons/credit-card.svg',
      route: '/accounts',
    },
    {
      label: t('balance'),
      icon: '/icons/euro.svg',
      route: '/balance',
    },
    {
      label: t('newMovements'),
      icon: '/icons/layer-plus.svg',
      route: '/new-movements',
    },
    {
      label: t('history'),
      icon: '/icons/transfer.svg',
      route: '/history',
    },
    {
      label: t('budget'),
      icon: '/icons/trending-up.svg',
      route: '/budget',
    },
  ]

  return (
    <aside className="flex h-full w-[5.5rem] flex-col justify-start border-r-2 border-gray-200 bg-gray-200/25 pt-2 md:justify-between lg:w-72">
      <nav className="mt-2 flex flex-col p-4">
        <header className="flex items-center justify-start gap-2 p-2">
          <Image src="/icons/logo.svg" alt="Logo" width={50} height={50} />
          <h1 className="hidden text-3xl font-bold lg:block">Midas</h1>
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
          <span className="text-[16px] font-semibold">Alberto Rodríguez</span>
          arodriguez@gmail.com
        </div>
        <LogOut className="text-gray-500" />
      </footer>
    </aside>
  )
}

export default Menubar
