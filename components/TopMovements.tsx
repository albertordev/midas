'use client'

import { usePathname } from 'next/navigation'

import { cn, formatAmount } from '@/lib/utils'
import Image from 'next/image'
import { MovementAccount, TopMovementsProps } from '@/types'

const TopMovements = ({ type, header, accounts }: TopMovementsProps) => {
  const pathname = usePathname()
  const locale = pathname.split('/')[1]

  return (
    <div className="flex w-full flex-col items-center justify-start bg-white">
      <header className="flex items-center justify-center gap-2 p-2">
        <div
          className={cn(
            'flex max-w-20 rounded-full p-2',
            type === 'income' ? 'bg-green-700/20' : 'bg-red-700/20'
          )}>
          {type === 'income' ? (
            <Image
              src="/icons/income.svg"
              alt={header}
              width={24}
              height={24}
            />
          ) : (
            <Image
              src="/icons/expenses.svg"
              alt={header}
              width={24}
              height={24}
            />
          )}
        </div>
        <h1 className="text-xl font-semibold text-slate-400">{header}</h1>
      </header>
      <ul className="flex w-full flex-col justify-center">
        {accounts.map((account: MovementAccount) => (
          <li
            key={account.name}
            className="flex w-full items-center justify-between gap-2 p-2">
            <span className="text-sm text-gray-500">{account.name}</span>
            <span
              className={cn(
                'text-sm font-semibold',
                type === 'income' ? 'text-green-700' : 'text-red-700'
              )}>
              {formatAmount(account.amount, locale)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TopMovements
