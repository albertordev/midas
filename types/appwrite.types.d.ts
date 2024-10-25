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
