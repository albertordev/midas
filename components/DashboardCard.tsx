'use client'

import { usePathname } from 'next/navigation'
import Image from 'next/image'

import { Chart, ArcElement, Tooltip } from 'chart.js'

import { PieChart, Pie, Sector, Cell } from 'recharts'

import CountUp from 'react-countup'
import { useEffect, useState } from 'react'

const DashboardCard = ({
  title,
  amount,
  icon,
  color,
  data,
  backgrounds,
}: DashboardCardProps) => {
  /** Para asegurar que se renderice el mismo componente en el cliente y en el servidor */
  const [isClient, setIsClient] = useState(false)

  const pathname = usePathname()
  const locale = pathname.split('/')[1]
  let suffix: string
  let separator: string
  let decimal: string

  Chart.register(ArcElement, Tooltip)

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

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <div className="flex h-40 w-full rounded-md bg-white p-4 sm:max-w-48 sm:justify-between md:max-w-60">
      <div className="flex flex-col items-start justify-center">
        <div className={`flex max-w-20 rounded-full bg-${color}/20 p-2`}>
          <Image src={icon} alt={title} width={24} height={24} />
        </div>
        <h1 className="mt-2 text-center text-xl text-slate-400">{title}</h1>
        <div className={`text-center text-2xl text-${color} font-bold`}>
          <CountUp
            start={0}
            end={amount}
            duration={1}
            separator={separator}
            decimals={2}
            decimal={decimal}
            suffix={suffix}
          />
        </div>
      </div>
      <div className="flex max-w-[30rem] items-center justify-center sm:hidden sm:max-w-80 md:flex">
        <PieChart width={800} height={400}>
          <Pie
            data={data}
            cx={120}
            cy={200}
            innerRadius={50}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value">
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={backgrounds[index % backgrounds.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </div>
    </div>
  )
}

export default DashboardCard
