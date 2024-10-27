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

export type AccountsModalProps = {
  type: 'create' | 'modify'
  userId: string
  open: boolean
  setOpen?: Dispatch<SetStateAction<boolean>>
}

export type AccountsFormProps = {
  type: 'create' | 'modify'
  userId: string
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
  code: string
  description: string
  icon?: string
  type: string
  comments?: string
}
