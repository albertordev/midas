import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

const avatarColorsList = [
  'bg-blue-500',
  'bg-green-600',
  'bg-red-700',
  'bg-yellow-600',
  'bg-indigo-500',
  'bg-orange-500',
]

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
/** Formateo de importes */
export function formatAmount(amount: number, locale: string): string {
  let currencyLocale: string
  let currency: string

  switch (locale) {
    case 'en':
      currencyLocale = 'en-US'
      currency = 'USD'
      break
    case 'es':
      currencyLocale = 'es-ES'
      currency = 'EUR'
      break
    default:
      currencyLocale = 'es-ES'
      currency = 'EUR'
      break
  }

  const formatter = new Intl.NumberFormat(currencyLocale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  })

  return formatter.format(amount)
}

export const buildYearsList = (): number[] => {
  const yearsList = []
  const currentYear = new Date().getFullYear()
  for (let i = currentYear; i >= currentYear - 10; i--) {
    yearsList.push(i)
  }

  return yearsList
}

export const buildPeriodsList = (locale: string): any[] => {
  const periodsList = []
  const currentYear = new Date().getFullYear()
  let dateLocale: string

  switch (locale.toLowerCase()) {
    case 'es':
      dateLocale = 'es-ES'
      break
    case 'en':
      dateLocale = 'en-US'
      break
    default:
      dateLocale = 'es-ES'
      break
  }

  for (let i = 0; i < 12; i++) {
    const date = new Date(currentYear, i, 1)
    const name = date.toLocaleString(dateLocale, {
      month: 'long',
    })
    periodsList.push({
      value: date.getMonth() + 1,
      name: name.charAt(0).toUpperCase() + name.slice(1),
    })
  }

  return periodsList
}

export const getPeriodName = (period: number) => {
  const periodsList = buildPeriodsList('es')
  return periodsList.find((per: any) => per.value === period)?.name
}

export const getPeriodValue = (period: string) => {
  const periodsList = buildPeriodsList('es')
  return periodsList.find((per: any) => per.name === period)?.value
}

export const parseStringify = (value: any) => JSON.parse(JSON.stringify(value))

export const getAvatarColor = () => {
  const selectedColor = Math.trunc(Math.random() * avatarColorsList.length)
  return avatarColorsList[selectedColor]
}
