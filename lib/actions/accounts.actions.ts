'use server'

import * as sdk from 'node-appwrite'

import { Account, AuthResponse, User } from '@/types'
import { Query } from 'node-appwrite'
import { ID } from 'node-appwrite'
import { parseStringify } from '../utils'
import { AccountModel } from '@/types/appwrite.types'

const {
  APPWRITE_PROJECT_ID,
  APPWRITE_DATABASE_ID,
  APPWRITE_ACCOUNTS_COLLECTION_ID,
  APPWRITE_API_KEY,
  APPWRITE_API_ENDPOINT,
} = process.env

const client = new sdk.Client()

client
  .setEndpoint(APPWRITE_API_ENDPOINT!)
  .setProject(APPWRITE_PROJECT_ID!)
  .setKey(APPWRITE_API_KEY!)

const databases = new sdk.Databases(client)

/** CREAR NUEVA CUENTA */
export const createAccount = async (account: Account) => {
  try {
    const accountCreated = await databases.createDocument(
      APPWRITE_DATABASE_ID!,
      APPWRITE_ACCOUNTS_COLLECTION_ID!,
      ID.unique(),
      account
    )
    console.log(accountCreated)
    return {
      data: accountCreated,
      status: 200,
    } as AuthResponse
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code

      return {
        data: null,
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** OBTENER CUENTAS */
export const getAccounts = async (userId: string) => {
  try {
    const accounts = await databases.listDocuments(
      APPWRITE_DATABASE_ID!,
      APPWRITE_ACCOUNTS_COLLECTION_ID!,
      [Query.equal('userId', [userId])]
    )
    if (accounts.documents.length === 0) {
      return {
        data: null,
        status: 404,
      } as AuthResponse
    }

    const accountsData: AccountModel[] = accounts.documents as AccountModel[]

    return {
      data: accountsData,
      status: 200,
    }
  } catch (error: sdk.AppwriteException | any) {
    if (error) {
      const errorCode = error?.code
      return {
        data: null,
        status: errorCode,
      } as AuthResponse
    }
  }
}

/** MODIFICAR CUENTA */
// export const modifyAccount = async (account: AccountModel) => {
//   const { APPWRITE_ACCOUNTS_COLLECTION_ID } = process.env

//   client
//   .setEndpoint(APPWRITE_AI_ENDPOINT!)
//   .setProject(APPWRITE_PROJECT_ID!)
//   .setKey(APPWRITE_API_KEY!)

// export const databases = new sdk.Databases(client)

//   return await databases.updateDocument(
//     APPWRITE_DATABASE_ID!,
//     APPWRITE_ACCOUNTS_COLLECTION_ID!,
//     ID.unique(),
//     account
//   )
// }

/** BORRAR CUENTA */
// export const deleteAccount = async (accountId: string) => {
//   const { APPWRITE_ACCOUNTS_COLLECTION_ID } = process.env

//   return await databases.deleteDocument(
//     APPWRITE_ACCOUNTS_COLLECTION_ID!,
//     accountId
//   )
// }
