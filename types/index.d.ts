declare type DashboardCardData = {
  name: string
  value: number
}

declare type DashboardCardProps = {
  title: string
  amount: number
  icon: string
  color: string
  data: DashboardCardData[]
  backgrounds: string[]
}

declare type MovementAccount = {
  name: string
  amount: number
}

declare type TopMovementsProps = {
  type: string
  header: string
  accounts: MovementAccount[]
}

// export type AccountsModalProps = {
//   type: 'create' | 'modify'
//   userId: string
//   open: boolean
//   setOpen?: Dispatch<SetStateAction<boolean>>
// }

export type EntityFormProps = {
  type: 'create' | 'modify'
  userId: string
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export type HistoryFiltersProps = {
  userId: string
  open?: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export type AuthResponse = {
  data: AuthUser | null
  status: number
}

export type User = {
  id: string
  name: string
}

export type Account = {
  userId: string
  id: string
  code: string
  description: string
  icon?: string
  type: string
  comments?: string
}

export type CellActionProps = {
  origin: string
  row: Row<TData>
  labels: string[]
  actions: string[]
}

export type Movement = {
  id: string
  userId: string
  account: string
  type: string
  description: string
  date: Date
  amount: number
}

export type Balance = {
  id: string
  userId: string
  account: string
  type: string
  period: number
  year: number
  amount: number
}

export type HistoryFiltersParams = {
  userId: string
  account?: string
  type?: string
  description?: string
  dateFrom?: Date | null
  dateTo?: Date | null
  amountFrom?: number
  amountTo?: number
}
