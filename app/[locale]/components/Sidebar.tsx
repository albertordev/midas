'use client'

import { useTranslations } from 'next-intl'
import {LogOut } from 'lucide-react'
import Image from 'next/image'
import { usePathname} from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const Sidebar = () => {
  /** Traducciones */
  const t = useTranslations('Menu')
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  const sideBarItems = [
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
    <aside className='flex flex-col justify-between w-24 md:w-60 border-r-2 border-gray-200 bg-gray-200/25 pt-2 h-full'>
      <nav className="flex flex-col p-4 mt-2">
        <header className="flex items-center justify-start gap-2 p-2">
          <Image src="/icons/logo.svg" alt="Logo" width={50} height={50} />
          <h1 className="hidden md:block text-3xl font-bold">Midas</h1>
        </header>
        <ul className="flex flex-col gap-4 p-2">
          {sideBarItems.map((item) => {

            const isActive = pathname === item.route
            return(
              <li key={item.label}>
                <Link href={item.route} className={cn('menuItem', isActive && 'bg-blue-200')}>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={20}
                    height={20}
                  />
                  <span className='menuText'>{item.label}</span>
                </Link>
              </li>
            )
          })}
          {/* <li className="menuItem">
            <LayoutDashboard />
            <span className='menuText' >{t('dashboard')}</span>
          </li>
          <li className="menuItem">
            <CreditCardIcon />
            <span className='menuText' >{t('accounts')}</span>
          </li>
          <li className="menuItem">
            <Euro />
            <span className='menuText' >{t('balance')}</span>
          </li>
          <li className="menuItem">
            <ListPlus />
            <span className='menuText' >{t('newMovements')}</span>
          </li>
          <li className="menuItem">
            <ArrowRightLeft /> 
            <span className='menuText' >{t('history')}</span>
          </li>
          <li className="menuItem">
            <TrendingUpDown />
            <span className='menuText' >{t('budget')}</span>
          </li> */}
        </ul>
      </nav>
      <footer className='flex items-center p-4 justify-center md:justify-between'>
        <div className="hidden md:flex flex-col text-start text-xs text-gray-500">
          <span className='font-semibold text-[16px]'>Alberto Rodríguez</span>
          arodriguez@gmail.com
        </div>
        <LogOut className='text-gray-500' />
      </footer>
    </aside>
  )
}

export default Sidebar
