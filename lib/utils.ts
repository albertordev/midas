import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Formateo de fecha y hora */
// export const formatDateTime = (dateString: Date) => {
//   const dateTimeOptions: Intl.DateTimeFormatOptions = {
//     weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
//     month: 'short', // abbreviated month name (e.g., 'Oct')
//     day: 'numeric', // numeric day of the month (e.g., '25')
//     hour: 'numeric', // numeric hour (e.g., '8')
//     minute: 'numeric', // numeric minute (e.g., '30')
//     hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
//   }

//   const dateDayOptions: Intl.DateTimeFormatOptions = {
//     weekday: 'short', // abbreviated weekday name (e.g., 'Mon')
//     year: 'numeric', // numeric year (e.g., '2023')
//     month: '2-digit', // abbreviated month name (e.g., 'Oct')
//     day: '2-digit', // numeric day of the month (e.g., '25')
//   }

//   const dateOptions: Intl.DateTimeFormatOptions = {
//     month: 'short', // abbreviated month name (e.g., 'Oct')
//     year: 'numeric', // numeric year (e.g., '2023')
//     day: 'numeric', // numeric day of the month (e.g., '25')
//   }

//   const timeOptions: Intl.DateTimeFormatOptions = {
//     hour: 'numeric', // numeric hour (e.g., '8')
//     minute: 'numeric', // numeric minute (e.g., '30')
//     hour12: true, // use 12-hour clock (true) or 24-hour clock (false)
//   }

//   const formattedDateTime: string = new Date(dateString).toLocaleString(
//     'en-US',
//     dateTimeOptions
//   )

//   const formattedDateDay: string = new Date(dateString).toLocaleString(
//     'en-US',
//     dateDayOptions
//   )

//   const formattedDate: string = new Date(dateString).toLocaleString(
//     'en-US',
//     dateOptions
//   )

//   const formattedTime: string = new Date(dateString).toLocaleString(
//     'en-US',
//     timeOptions
//   )

//   return {
//     dateTime: formattedDateTime,
//     dateDay: formattedDateDay,
//     dateOnly: formattedDate,
//     timeOnly: formattedTime,
//   }
// }

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
