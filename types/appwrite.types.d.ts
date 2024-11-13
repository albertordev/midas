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
  type: string
  period: number
  year: number
  amount: number
}
