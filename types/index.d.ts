declare type DashboardCardData = {
  name: string
  value: number
}

declare type DashboardCardProps = {
  title: string
  amount: number
  icon: string,
  color: string,
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


