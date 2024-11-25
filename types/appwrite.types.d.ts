import { Models } from 'node-appwrite'

/** Appwrite Auth */
export interface AuthUser {
  id: string
  name: string
  email: string
}

export interface AccountModel extends Models.Document {
  userId: string
  account: string
  description: string
  icon?: string
  type: string
  comments?: string
}

export interface UserModel extends Models.Document {
  name: string
  avatarColor?: string
}

export interface MovementModel extends Models.Document {
  userId: string
  account: string
  description: string
  date: Date
  amount: number
}

export interface BalanceModel extends Models.Document {
  userId: string
  account: string
  accountName?: string
  type: string
  period: number
  year: number
  amount: number
}

export interface BudgetModel extends Models.Document {
  userId: string
  account: string
  accountName?: string
  type: string
  period: number
  year: number
  amount: number
}
