'use client'

import { usePathname } from 'next/navigation'

import { formatAmount } from '@/lib/utils'

import CountUp from 'react-countup'
import Image from 'next/image'

const DashboardCard = ({ title, amount }: DashboardCardProps) => {
  const pathname = usePathname()
  const locale = pathname.split('/')[1]
  let suffix: string
  let separator: string
  let decimal: string

  switch (locale) {
    case 'en':
      suffix = '$'
      separator = ','
      decimal = '.'
      break
    case 'es':
      suffix = '€'
      separator = '.'
      decimal = ','
      break
    default:
      suffix = '€'
      separator = '.'
      decimal = ','
      break
  }

  return (
    <div className="flex h-40 w-full max-w-72 justify-between rounded-md bg-white p-4">
      <div className="flex items-center justify-center">
        <div className="flex max-w-20 rounded-full bg-yellow-100 p-2">
          <Image
            src="/icons/balance.png"
            alt="Balance"
            width={48}
            height={48}
          />
        </div>
      </div>
      <div className="flex flex-col items-start justify-center">
        <h1 className="text-center text-xl text-slate-400">{title}</h1>
        <p className="text-center text-3xl font-bold text-green-700">
          <CountUp
            start={0}
            end={amount}
            duration={1}
            separator={separator}
            decimals={2}
            decimal={decimal}
            suffix={suffix}
          />
        </p>
      </div>
    </div>
  )
}

export default DashboardCard
